// Layout da teia (posição 2D de cada item a partir do vetor de 12 eixos). Roda no build
// (scripts/tree-data.mjs): o navegador só recebe as posições prontas.
// Puro e determinístico (sem Math.random): mesmo resultado a cada build.

/** Distância euclidiana normalizada entre dois vetores (0 = iguais, 1 = opostos em todos os eixos). */
export function vectorDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = (a[i] - b[i]) / 100;
    sum += d * d;
  }
  return Math.sqrt(sum / a.length);
}

export function vectorSimilarity(a, b) {
  return Math.max(0, 1 - vectorDistance(a, b) * 2);
}

/** Dois primeiros componentes principais por iteração de potência (determinística). */
function pca2(points) {
  const n = points.length;
  const dim = points[0].length;
  const mean = new Array(dim).fill(0);
  for (const p of points) for (let i = 0; i < dim; i += 1) mean[i] += p[i] / n;
  const centered = points.map((p) => p.map((v, i) => v - mean[i]));

  const apply = (v) => {
    const out = new Array(dim).fill(0);
    for (const row of centered) {
      let dot = 0;
      for (let i = 0; i < dim; i += 1) dot += row[i] * v[i];
      for (let i = 0; i < dim; i += 1) out[i] += row[i] * dot;
    }
    return out;
  };
  const normalize = (v) => {
    const len = Math.hypot(...v) || 1;
    return v.map((x) => x / len);
  };
  const component = (orthogonalTo) => {
    let v = normalize(Array.from({ length: dim }, (_, i) => 1 + i * 0.37));
    for (let iter = 0; iter < 60; iter += 1) {
      v = apply(v);
      if (orthogonalTo) {
        const dot = v.reduce((s, x, i) => s + x * orthogonalTo[i], 0);
        v = v.map((x, i) => x - dot * orthogonalTo[i]);
      }
      v = normalize(v);
    }
    return v;
  };
  const c1 = component();
  const c2 = component(c1);
  return centered.map((row) => [
    row.reduce((s, x, i) => s + x * c1[i], 0),
    row.reduce((s, x, i) => s + x * c2[i], 0)
  ]);
}

/**
 * @param {{ id: string, vector: number[] }[]} items
 * @param {number} [neighbors] ligações por item
 * @param {[number, number][]} [anchors] posição-alvo de cada item, em unidades de -1 a 1 (y para baixo);
 *   sem elas, a posição inicial vem de uma projeção PCA dos 12 eixos
 * @param {(i: number, j: number) => number} [similarity] similaridade 0–1 entre dois itens
 * @returns {{ x: Float64Array, y: Float64Array, edges: { a: number, b: number, similarity: number }[], degree: number[] }}
 */
export function buildTreeLayout(items, neighbors = 3, anchors, similarity) {
  const n = items.length;
  const vectors = items.map((item) => item.vector);
  const sim = similarity ?? ((i, j) => vectorSimilarity(vectors[i], vectors[j]));

  // Ligações: cada nó se liga aos seus `neighbors` itens mais próximos (união dos dois sentidos).
  const edgeKey = new Set();
  const edges = [];
  for (let i = 0; i < n; i += 1) {
    const ranked = [];
    for (let j = 0; j < n; j += 1) {
      if (j !== i) ranked.push({ j, d: 1 - sim(i, j) });
    }
    ranked.sort((p, q) => p.d - q.d || p.j - q.j);
    for (const { j } of ranked.slice(0, neighbors)) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = a * n + b;
      if (edgeKey.has(key)) continue;
      edgeKey.add(key);
      edges.push({ a, b, similarity: sim(a, b) });
    }
  }
  const degree = new Array(n).fill(0);
  for (const edge of edges) {
    degree[edge.a] += 1;
    degree[edge.b] += 1;
  }

  // Posição inicial = posições-alvo (ou PCA); depois relaxa com molas (vizinhos) e repulsão (todos).
  const projected = anchors ?? pca2(vectors);
  const spread = anchors ? 1 : Math.max(...projected.flat().map(Math.abs)) || 1;
  const SCALE = 900;
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  const ax = new Float64Array(n);
  const ay = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    ax[i] = (projected[i][0] / spread) * SCALE;
    ay[i] = (projected[i][1] / spread) * SCALE;
    x[i] = ax[i];
    y[i] = ay[i];
  }

  // Espaçamento ideal entre vizinhos, pela área que as posições-alvo ocupam: espalha de forma uniforme.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < n; i += 1) {
    minX = Math.min(minX, ax[i]);
    maxX = Math.max(maxX, ax[i]);
    minY = Math.min(minY, ay[i]);
    maxY = Math.max(maxY, ay[i]);
  }
  const d0 = Math.sqrt(Math.max(1, (maxX - minX) * (maxY - minY)) / n);
  const reach = 2.4 * d0;
  const k2 = 0.9 * d0 * (0.9 * d0);
  const pullToAnchor = anchors ? 0.02 : 0.012;

  const ITERATIONS = 320;
  const fx = new Float64Array(n);
  const fy = new Float64Array(n);
  for (let iter = 0; iter < ITERATIONS; iter += 1) {
    const cooling = 1 - iter / ITERATIONS;
    fx.fill(0);
    fy.fill(0);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        let dx = x[i] - x[j];
        let dy = y[i] - y[j];
        let d2 = dx * dx + dy * dy;
        if (d2 > reach * reach) continue;
        if (d2 < 0.01) {
          dx = ((i * 7 + j) % 13) - 6 || 1;
          dy = ((i + j * 5) % 11) - 5 || 1;
          d2 = dx * dx + dy * dy;
        }
        const d = Math.sqrt(d2);
        const push = k2 / d;
        fx[i] += (dx / d) * push;
        fy[i] += (dy / d) * push;
        fx[j] -= (dx / d) * push;
        fy[j] -= (dy / d) * push;
      }
    }
    for (const edge of edges) {
      const dx = x[edge.b] - x[edge.a];
      const dy = y[edge.b] - y[edge.a];
      const d = Math.hypot(dx, dy) || 1;
      const rest = d0 * (0.35 + (1 - edge.similarity) * 0.9);
      const pull = (d - rest) * 0.05;
      fx[edge.a] += (dx / d) * pull;
      fy[edge.a] += (dy / d) * pull;
      fx[edge.b] -= (dx / d) * pull;
      fy[edge.b] -= (dy / d) * pull;
    }
    const step = 0.9 * cooling + 0.1;
    const cap = 0.14 * d0 * step;
    for (let i = 0; i < n; i += 1) {
      fx[i] += (ax[i] - x[i]) * pullToAnchor * d0 * 0.4;
      fy[i] += (ay[i] - y[i]) * pullToAnchor * d0 * 0.4;
      const mag = Math.hypot(fx[i], fy[i]);
      const k = mag > cap ? cap / mag : 1;
      x[i] += fx[i] * k * 0.5;
      y[i] += fy[i] * k * 0.5;
    }
  }

  // Passada final: ninguém fica por cima de ninguém.
  const minGap = 0.5 * d0;
  for (let pass = 0; pass < 24; pass += 1) {
    let moved = false;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const dx = x[i] - x[j];
        const dy = y[i] - y[j];
        const d = Math.hypot(dx, dy);
        if (d >= minGap) continue;
        const nx = d > 0.001 ? dx / d : 1;
        const ny = d > 0.001 ? dy / d : 0;
        const shift = (minGap - d) / 2;
        x[i] += nx * shift;
        y[i] += ny * shift;
        x[j] -= nx * shift;
        y[j] -= ny * shift;
        moved = true;
      }
    }
    if (!moved) break;
  }

  return { x, y, edges, degree };
}
