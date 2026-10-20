import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { AxisRow } from '../components/results/AxesSection';
import type { Axis, AxisResult } from '../types/quiz';
import { ideologyColorByKey, SPECTRUM_ORDER, type IdeologyColorKey } from '../utils/ideologyColors';
import { loadTreeData, peekTreeData, prefetchTreeData, TREE_KINDS, type TreeData, type TreeKind, type TreeLocale, type TreeNode } from './data';
import '../../scripts/site-header.css';
import './tree.css';

const STRINGS = {
  pt: {
    kinds: { ideologies: 'Ideologias', personalities: 'Personalidades', countries: 'Países', parties: 'Partidos' },
    title: 'Teia',
    search: { ideologies: 'Buscar ideologia…', personalities: 'Buscar personalidade…', countries: 'Buscar país…', parties: 'Buscar partido…' },
    books: 'Livros',
    start: 'Começar',
    closest: 'Mais próximas',
    viewProfile: 'Ver perfil completo',
    listView: 'Ver em lista',
    close: 'Fechar',
    loading: 'Montando a teia…',
    top: 'Autoritarismo',
    bottom: 'Anarquismo',
    left: 'Esquerda',
    right: 'Direita',
    regions: {
      'esq-radical': 'Esquerda Radical',
      esquerda: 'Esquerda',
      centro: 'Centro',
      direita: 'Direita',
      'ext-direita': 'Extrema Direita',
      terceira: 'Terceira Posição',
      libertario: 'Libertário',
      anarquismo: 'Anarquismo'
    } as Record<IdeologyColorKey, string>,
    intensity: ['Equilibrado', 'Inclinado', 'Forte', 'Muito forte']
  },
  en: {
    kinds: { ideologies: 'Ideologies', personalities: 'Personalities', countries: 'Countries', parties: 'Parties' },
    title: 'Web',
    search: { ideologies: 'Search ideology…', personalities: 'Search personality…', countries: 'Search country…', parties: 'Search party…' },
    books: 'Books',
    start: 'Start',
    closest: 'Closest',
    viewProfile: 'View full profile',
    listView: 'List view',
    close: 'Close',
    loading: 'Building the web…',
    top: 'Authoritarianism',
    bottom: 'Anarchism',
    left: 'Left',
    right: 'Right',
    regions: {
      'esq-radical': 'Radical Left',
      esquerda: 'Left',
      centro: 'Center',
      direita: 'Right',
      'ext-direita': 'Far Right',
      terceira: 'Third Position',
      libertario: 'Libertarian',
      anarquismo: 'Anarchism'
    } as Record<IdeologyColorKey, string>,
    intensity: ['Balanced', 'Leaning', 'Strong', 'Very strong']
  }
};

/** Mesma faixa de intensidade do backend (ScoringService.intensityFor). */
function intensityIndex(distanceFromCenter: number): number {
  if (distanceFromCenter < 7.5) return 0;
  if (distanceFromCenter < 22.5) return 1;
  if (distanceFromCenter < 37.5) return 2;
  return 3;
}

/** O vetor guarda o % do polo esquerdo; devolve no formato que a página de resultados usa. */
function axisResultFor(axis: Axis, leftPercent: number, intensities: string[]): AxisResult {
  const rightPercent = 100 - leftPercent;
  return {
    axisId: axis.id,
    label: axis.label,
    leftPole: axis.leftPole,
    rightPole: axis.rightPole,
    leftPercent,
    rightPercent,
    dominantPole: leftPercent >= rightPercent ? axis.leftPole : axis.rightPole,
    intensity: intensities[intensityIndex(Math.abs(leftPercent - 50))]
  };
}

/** Centro de cada região da bússola (direita, autoritário), em 0–100. */
const REGION_CENTERS: Record<IdeologyColorKey, [number, number]> = {
  'esq-radical': [15, 85],
  terceira: [50, 85],
  'ext-direita': [85, 85],
  esquerda: [15, 50],
  centro: [50, 50],
  direita: [85, 50],
  anarquismo: [20, 12],
  libertario: [80, 12]
};

interface View {
  x: number;
  y: number;
  k: number;
}

const MAX_ZOOM_FACTOR = 16;
const PAPER = '244,241,232';
const INK = '16,16,16';
const IMAGE_ZOOM = 2.4;

export default function TreePage({ kind: initialKind, locale }: { kind: TreeKind; locale: TreeLocale }) {
  const [kind, setKind] = useState<TreeKind>(initialKind);
  const [data, setData] = useState<TreeData | null>(() => peekTreeData(initialKind, locale));
  const [failed, setFailed] = useState(false);
  const s = STRINGS[locale];
  const prefix = locale === 'en' ? '/en' : '';

  useEffect(() => {
    let alive = true;
    setFailed(false);
    const cached = peekTreeData(kind, locale);
    if (cached) {
      setData(cached);
      return undefined;
    }
    setData(null);
    loadTreeData(kind, locale).then(
      (loaded) => {
        if (alive) setData(loaded);
      },
      () => {
        if (alive) setFailed(true);
      }
    );
    return () => {
      alive = false;
    };
  }, [kind, locale]);

  // Com a aba atual pronta, aquece as outras: a troca de catálogo fica instantânea.
  useEffect(() => {
    if (data) prefetchTreeData(locale, kind);
  }, [data, kind, locale]);

  // Trocar de aba não recarrega a página: só o histórico e o estado mudam (e o cache de dados é reaproveitado).
  const navigate = useCallback(
    (next: TreeKind) => {
      if (next === kind) return;
      window.history.pushState(null, '', `${prefix}/tree/${next}`);
      setKind(next);
    },
    [kind, prefix]
  );
  useEffect(() => {
    const onPop = () => {
      const match = /\/tree\/(ideologies|personalities|countries|parties)\/?$/.exec(window.location.pathname);
      setKind((match?.[1] as TreeKind | undefined) ?? 'ideologies');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Não indexar: o conteúdo é desenhado em canvas e a página é só uma visão alternativa do catálogo.
  useEffect(() => {
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.title = `${s.title} · ${s.kinds[kind]} — 12 Axes`;
    document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = meta?.content ?? null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, follow';
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      if (meta) {
        if (previousRobots === null) meta.remove();
        else meta.content = previousRobots;
      }
    };
  }, [kind, locale, s]);

  return (
    <div className="ed tree-page">
      {data && data.kind === kind ? (
        <TreeView key={`${locale}-${kind}`} kind={kind} locale={locale} data={data} onNavigate={navigate} />
      ) : (
        <>
          <TreeHeader kind={kind} locale={locale} onNavigate={navigate} />
          <p className="tree-loading">{failed ? 'Não foi possível carregar a teia. Recarregue a página.' : s.loading}</p>
        </>
      )}
    </div>
  );
}

interface HeaderProps {
  kind: TreeKind;
  locale: TreeLocale;
  onNavigate: (kind: TreeKind) => void;
  search?: {
    query: string;
    onQuery: (value: string) => void;
    matches: { node: TreeNode; i: number }[];
    onPick: (index: number) => void;
  };
}

function TreeHeader({ kind, locale, onNavigate, search }: HeaderProps) {
  const s = STRINGS[locale];
  const prefix = locale === 'en' ? '/en' : '';
  const other = locale === 'en' ? '' : '/en';
  return (
    <header className="sh tree-sh">
      <div className="sh-wrap">
        <a className="sh-logo" href={prefix || '/'} aria-label="12 axes">
          <b>12</b>
          <span>axes</span>
        </a>
        <nav className="sh-links" aria-label={s.title}>
          <a href={`${prefix}/books`}>{s.books}</a>
          {TREE_KINDS.map((k) => (
            <a
              key={k}
              href={`${prefix}/tree/${k}`}
              aria-current={k === kind ? 'page' : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                onNavigate(k);
              }}
            >
              {s.kinds[k]}
            </a>
          ))}
          <a className="sh-lang" href={`${other}/tree/${kind}`} hrefLang={locale === 'en' ? 'pt-BR' : 'en'}>
            {locale === 'en' ? 'PT' : 'EN'}
          </a>
        </nav>
        <div className="sh-actions">
          {search && (
            <div className="tree-search">
              <input
                type="search"
                placeholder={s.search[kind]}
                value={search.query}
                onChange={(e) => search.onQuery(e.target.value)}
                aria-label={s.search[kind]}
              />
              {search.matches.length > 0 && (
                <ul className="tree-suggestions">
                  {search.matches.map(({ node, i }) => (
                    <li key={node.id}>
                      <button type="button" onClick={() => search.onPick(i)}>
                        <span className="tree-dot" style={{ background: ideologyColorByKey(node.key).base }} />
                        {node.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <a className="sh-btn sh-btn-ghost" href={`${prefix}/${kind}`}>
            {s.listView}
          </a>
          <a className="sh-btn sh-btn-primary" href={prefix || '/'}>
            {s.start}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

function TreeView({
  kind,
  locale,
  data,
  onNavigate
}: {
  kind: TreeKind;
  locale: TreeLocale;
  data: TreeData;
  onNavigate: (kind: TreeKind) => void;
}) {
  const s = STRINGS[locale];
  const prefix = locale === 'en' ? '/en' : '';

  const { nodes, axes, layout, worldX, worldY, scale } = data;
  const n = nodes.length;
  // Espaçamento médio entre itens no mundo (mesma ideia do layout).
  const spacing = Math.sqrt((4 * worldX * worldY) / n);
  const toWorld = useCallback(
    (right: number, authoritarian: number): [number, number] => [((right - 50) / 50) * worldX, (-(authoritarian - 50) / 50) * worldY],
    [worldX, worldY]
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const sizeRef = useRef({ w: 1, h: 1, dpr: 1 });
  const viewRef = useRef<View>({ x: 0, y: 0, k: 1 });
  const fitKRef = useRef(1);
  const hoverRef = useRef(-1);
  const selectedRef = useRef(-1);
  const rafRef = useRef(0);
  const flyRef = useRef(0);
  const animateRef = useRef(true);
  const imagesRef = useRef(new Map<string, HTMLImageElement>());
  const drawRef = useRef<() => void>(() => undefined);

  const [selected, setSelected] = useState(-1);
  const [query, setQuery] = useState('');

  const colors = useMemo(() => nodes.map((node) => ideologyColorByKey(node.key).base), [nodes]);

  const rank = useMemo(() => {
    const order = nodes.map((_, i) => i).sort((a, b) => layout.degree[b] - layout.degree[a] || a - b);
    const out = new Array<number>(n);
    order.forEach((idx, position) => {
      out[idx] = position;
    });
    return out;
  }, [nodes, layout, n]);

  const categoryCenters = useMemo(() => {
    const acc = new Map<IdeologyColorKey, { x: number; y: number; n: number }>();
    nodes.forEach((node, i) => {
      const cur = acc.get(node.key) ?? { x: 0, y: 0, n: 0 };
      cur.x += layout.x[i];
      cur.y += layout.y[i];
      cur.n += 1;
      acc.set(node.key, cur);
    });
    return Array.from(acc, ([key, v]) => ({ key, x: v.x / v.n, y: v.y / v.n }));
  }, [nodes, layout]);

  // Fases fixas por nó: cada item "respira" no seu próprio ritmo.
  const phases = useMemo(
    () =>
      nodes.map((_, i) => ({
        a: (i * 2.399963) % (Math.PI * 2),
        b: (i * 1.618034 + 1.3) % (Math.PI * 2),
        r: (i * 0.7548) % (Math.PI * 2)
      })),
    [nodes]
  );

  /** Deslocamento (px de tela) do nó no instante t: deriva lenta e suave, sem sair do lugar. */
  const wobble = useCallback(
    (i: number, t: number): [number, number] => {
      if (!animateRef.current) return [0, 0];
      const p = phases[i];
      return [
        Math.sin(t / 1900 + p.a) * 2.6 + Math.sin(t / 4700 + p.b) * 3.4,
        Math.cos(t / 2300 + p.b) * 2.6 + Math.sin(t / 5300 + p.a) * 3.4
      ];
    },
    [phases]
  );

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => drawRef.current());
  }, []);

  const imageFor = useCallback(
    (src: string): HTMLImageElement | null => {
      const cache = imagesRef.current;
      let img = cache.get(src);
      if (!img) {
        img = new Image();
        img.decoding = 'async';
        img.onload = () => schedule();
        img.src = src;
        cache.set(src, img);
      }
      return img.complete && img.naturalWidth > 0 ? img : null;
    },
    [schedule]
  );

  /** Raio do ponto em px: com imagem (retrato, bandeira, logo) fica maior quando se aproxima. */
  const radiusAt = useCallback(
    (i: number, z: number) => {
      const base = (2.8 + layout.degree[i] * 0.6) * Math.min(2.2, Math.pow(Math.max(z, 0.4), 0.35));
      return nodes[i].image && z >= IMAGE_ZOOM ? Math.max(base, 13 + Math.min(z - IMAGE_ZOOM, 4) * 2) : base;
    },
    [layout, nodes]
  );

  drawRef.current = () => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const t = performance.now();
    const { w, h, dpr } = sizeRef.current;
    const { x: tx, y: ty, k } = viewRef.current;
    const z = k / fitKRef.current;
    const hover = hoverRef.current;
    const sel = selectedRef.current;
    const focus = sel >= 0 ? sel : hover;
    // O foco mostra os mais compatíveis dele (a mesma lista do painel), não as ligações que outros itens fazem até ele.
    const focusSet = new Set<number>();
    const focusSimilar = focus >= 0 ? data.similar[focus] : [];
    if (focus >= 0) {
      focusSet.add(focus);
      for (const [j] of focusSimilar) focusSet.add(j);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const px = new Float64Array(n);
    const py = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      const [ox, oy] = wobble(i, t);
      px[i] = layout.x[i] * k + tx + ox;
      py[i] = layout.y[i] * k + ty + oy;
    }
    const breathe = (i: number) => (animateRef.current ? 1 + 0.09 * Math.sin(t / 1100 + phases[i].r) : 1);
    const radius = (i: number) => radiusAt(i, z) * (nodes[i].image && z >= IMAGE_ZOOM ? 1 : breathe(i));

    // Regiões da bússola ao fundo, nos pastéis do espectro
    for (const key of Object.keys(REGION_CENTERS) as IdeologyColorKey[]) {
      const [cr, ca] = REGION_CENTERS[key];
      const [wx, wy] = toWorld(cr, ca);
      const rr = 520 * scale * k;
      const cx = wx * k + tx;
      const cy = wy * k + ty;
      if (cx + rr < 0 || cx - rr > w || cy + rr < 0 || cy - rr > h) continue;
      const breath = animateRef.current ? 1 + 0.025 * Math.sin(t / 3200 + cr * 0.1 + ca * 0.07) : 1;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr * breath);
      const bg = ideologyColorByKey(key).bg;
      grad.addColorStop(0, `${bg}cc`);
      grad.addColorStop(1, `${bg}00`);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - rr * breath, cy - rr * breath, rr * 2 * breath, rr * 2 * breath);
    }

    // Ligações, com um brilho lento que passa por elas
    ctx.lineWidth = Math.min(1.6, 0.7 + z * 0.12);
    const shimmer = animateRef.current ? 0.06 : 0;
    for (let ei = 0; ei < layout.edges.length; ei += 1) {
      const e = layout.edges[ei];
      const x1 = px[e.a];
      const y1 = py[e.a];
      const x2 = px[e.b];
      const y2 = py[e.b];
      if ((x1 < -50 && x2 < -50) || (x1 > w + 50 && x2 > w + 50) || (y1 < -50 && y2 < -50) || (y1 > h + 50 && y2 > h + 50)) {
        continue;
      }
      const dim = focus >= 0;
      const pulse = shimmer * Math.sin(t / 1600 + ei * 0.9);
      // ligações longas (vizinhos que a bússola separa) ficam bem mais discretas
      const lengthFade = Math.max(0.2, 1 - Math.hypot(layout.x[e.a] - layout.x[e.b], layout.y[e.a] - layout.y[e.b]) / (5 * spacing));
      const alpha = dim ? 0.05 : (0.16 + 0.26 * e.similarity + pulse) * lengthFade;
      ctx.strokeStyle = `rgba(${INK},${Math.max(0.03, alpha)})`;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Linhas do foco até os seus mais compatíveis: mais fortes quanto maior a pontuação
    if (focus >= 0) {
      ctx.lineWidth = 2;
      for (const [j, score] of focusSimilar) {
        ctx.globalAlpha = 0.35 + 0.55 * Math.max(0, Math.min(1, (score - 50) / 50));
        ctx.strokeStyle = colors[focus];
        ctx.beginPath();
        ctx.moveTo(px[focus], py[focus]);
        ctx.lineTo(px[j], py[j]);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Pulsos de luz viajando pelas ligações (a teia "pensando")
    if (animateRef.current && focus < 0 && layout.edges.length > 0) {
      const PULSES = 16;
      const CYCLE = 3400;
      for (let j = 0; j < PULSES; j += 1) {
        const cycle = Math.floor(t / CYCLE + j * 0.37);
        const progress = (t / CYCLE + j * 0.37) % 1;
        const e = layout.edges[(j * 131 + cycle * 977) % layout.edges.length];
        const from = j % 2 === 0 ? e.a : e.b;
        const to = from === e.a ? e.b : e.a;
        const x = px[from] + (px[to] - px[from]) * progress;
        const y = py[from] + (py[to] - py[from]) * progress;
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.9;
        ctx.fillStyle = colors[from];
        ctx.beginPath();
        ctx.arc(x, y, 2.4 + Math.min(z, 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Nós
    for (let i = 0; i < n; i += 1) {
      if (px[i] < -30 || px[i] > w + 30 || py[i] < -30 || py[i] > h + 30) continue;
      const dim = focus >= 0 && !focusSet.has(i);
      const r = radius(i);
      const src = nodes[i].image;
      const asImage = Boolean(src) && z >= IMAGE_ZOOM;
      const img = asImage && src ? imageFor(src) : null;
      if (!dim && !img) {
        const halo = animateRef.current ? 0.1 + 0.07 * Math.sin(t / 1400 + phases[i].a) : 0.1;
        ctx.fillStyle = colors[i];
        ctx.globalAlpha = halo;
        ctx.beginPath();
        ctx.arc(px[i], py[i], r * 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = dim ? 0.22 : 1;
      if (img) {
        // retrato / bandeira / logo recortado em círculo, com aro na cor da região
        ctx.save();
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgb(${PAPER})`;
        ctx.fill();
        ctx.clip();
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - side) / 2;
        const sy = kind === 'personalities' ? 0 : (img.naturalHeight - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, px[i] - r, py[i] - r, r * 2, r * 2);
        ctx.restore();
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (i === sel || i === hover) {
        const ring = i === sel && animateRef.current ? 3 + Math.sin(t / 380) * 1.2 : 3;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px[i], py[i], r + ring + 1, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Nomes das regiões quando está longe
    const catAlpha = Math.max(0, Math.min(1, 1.9 - z));
    if (catAlpha > 0.02) {
      ctx.font = '700 15px Sora, Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const c of categoryCenters) {
        const cx = c.x * k + tx;
        const cy = c.y * k + ty;
        const label = s.regions[c.key].toUpperCase();
        ctx.globalAlpha = catAlpha * 0.95;
        ctx.lineWidth = 5;
        ctx.strokeStyle = `rgba(${PAPER},0.9)`;
        ctx.strokeText(label, cx, cy);
        ctx.fillStyle = ideologyColorByKey(c.key).base;
        ctx.fillText(label, cx, cy);
      }
      ctx.globalAlpha = 1;
    }

    // Rótulos: prioridade por importância, com anti-colisão; foco sempre aparece.
    ctx.font = '500 12px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const placed: [number, number, number, number][] = [];
    const order = nodes.map((_, i) => i).sort((a, b) => {
      const fa = focusSet.has(a) ? 0 : 1;
      const fb = focusSet.has(b) ? 0 : 1;
      return fa - fb || rank[a] - rank[b];
    });
    for (const i of order) {
      const forced = focusSet.has(i) && focus >= 0;
      const threshold = 0.9 + (rank[i] / n) * 3.4;
      if (!forced && z < threshold) continue;
      if (px[i] < -100 || px[i] > w + 100 || py[i] < -20 || py[i] > h + 20) continue;
      const text = nodes[i].name;
      const tw = ctx.measureText(text).width;
      const lx = px[i] + radius(i) + 5;
      const box: [number, number, number, number] = [lx - 2, py[i] - 8, lx + tw + 2, py[i] + 8];
      if (!forced && placed.some((p) => box[0] < p[2] && box[2] > p[0] && box[1] < p[3] && box[3] > p[1])) continue;
      placed.push(box);
      const dim = focus >= 0 && !focusSet.has(i);
      ctx.globalAlpha = dim ? 0.3 : 1;
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = `rgba(${PAPER},0.92)`;
      ctx.strokeText(text, lx, py[i]);
      ctx.fillStyle = i === sel || i === hover ? '#101010' : '#2c2b27';
      ctx.fillText(text, lx, py[i]);
    }
    ctx.globalAlpha = 1;

    if (animateRef.current && !document.hidden) rafRef.current = requestAnimationFrame(() => drawRef.current());
  };

  const fit = useCallback(() => {
    const { w, h } = sizeRef.current;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < n; i += 1) {
      minX = Math.min(minX, layout.x[i]);
      maxX = Math.max(maxX, layout.x[i]);
      minY = Math.min(minY, layout.y[i]);
      maxY = Math.max(maxY, layout.y[i]);
    }
    const bw = Math.max(1, maxX - minX);
    const bh = Math.max(1, maxY - minY);
    const k = Math.min(w / bw, h / bh) * 0.88;
    fitKRef.current = k;
    viewRef.current = { k, x: w / 2 - ((minX + maxX) / 2) * k, y: h / 2 - ((minY + maxY) / 2) * k };
  }, [layout, n]);

  const flyTo = useCallback(
    (index: number) => {
      cancelAnimationFrame(flyRef.current);
      const { w, h } = sizeRef.current;
      const from = { ...viewRef.current };
      const targetK = Math.max(from.k, fitKRef.current * 4.5);
      const panelOffset = w > 820 ? 230 : 0;
      const to = {
        k: targetK,
        x: (w - panelOffset) / 2 - layout.x[index] * targetK,
        y: (w > 820 ? h / 2 : h * 0.28) - layout.y[index] * targetK
      };
      const start = performance.now();
      const DURATION = 800;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const e = 1 - Math.pow(1 - t, 3);
        // interpola o zoom em escala logarítmica para não "saltar" no começo
        const k = Math.exp(Math.log(from.k) + (Math.log(to.k) - Math.log(from.k)) * e);
        viewRef.current = { k, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
        schedule();
        if (t < 1) flyRef.current = requestAnimationFrame(step);
      };
      flyRef.current = requestAnimationFrame(step);
    },
    [layout, schedule]
  );

  const select = useCallback(
    (index: number, fly: boolean) => {
      selectedRef.current = index;
      setSelected(index);
      if (index >= 0 && fly) flyTo(index);
      schedule();
    },
    [flyTo, schedule]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    // Quem pede menos movimento no sistema recebe a teia parada.
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    animateRef.current = !motionQuery.matches;
    const onMotion = () => {
      animateRef.current = !motionQuery.matches;
      schedule();
    };
    motionQuery.addEventListener('change', onMotion);
    const onVisibility = () => {
      if (!document.hidden) schedule();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const first = sizeRef.current.w === 1;
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (first) fit();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    const pointers = new Map<number, { x: number; y: number }>();
    let dragStart: { x: number; y: number; vx: number; vy: number } | null = null;
    let moved = 0;
    let pinch: { dist: number; k: number } | null = null;

    const local = (e: { clientX: number; clientY: number }) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const hit = (mx: number, my: number) => {
      const { x: tx, y: ty, k } = viewRef.current;
      const z = k / fitKRef.current;
      const t = performance.now();
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < n; i += 1) {
        const r = radiusAt(i, z) + 6;
        const [ox, oy] = wobble(i, t);
        const d = Math.hypot(layout.x[i] * k + tx + ox - mx, layout.y[i] * k + ty + oy - my);
        if (d <= r && d < bestD) {
          best = i;
          bestD = d;
        }
      }
      return best;
    };
    const zoomAt = (mx: number, my: number, factor: number) => {
      const v = viewRef.current;
      const minK = fitKRef.current * 0.6;
      const maxK = fitKRef.current * MAX_ZOOM_FACTOR;
      const k = Math.max(minK, Math.min(maxK, v.k * factor));
      const real = k / v.k;
      viewRef.current = { k, x: mx - (mx - v.x) * real, y: my - (my - v.y) * real };
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      cancelAnimationFrame(flyRef.current);
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, local(e));
      if (pointers.size === 1) {
        const p = local(e);
        dragStart = { x: p.x, y: p.y, vx: viewRef.current.x, vy: viewRef.current.y };
        moved = 0;
      } else if (pointers.size === 2) {
        const [a, b] = Array.from(pointers.values());
        pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: viewRef.current.k };
        dragStart = null;
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, p);
      if (pointers.size === 2 && pinch) {
        const [a, b] = Array.from(pointers.values());
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, (pinch.k * (dist / pinch.dist)) / viewRef.current.k);
        return;
      }
      if (dragStart && pointers.size === 1) {
        const dx = p.x - dragStart.x;
        const dy = p.y - dragStart.y;
        moved = Math.max(moved, Math.hypot(dx, dy));
        viewRef.current = { ...viewRef.current, x: dragStart.vx + dx, y: dragStart.vy + dy };
        schedule();
      } else if (e.pointerType === 'mouse') {
        const idx = hit(p.x, p.y);
        if (idx !== hoverRef.current) {
          hoverRef.current = idx;
          canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab';
          schedule();
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      const wasSingle = pointers.size === 1;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (wasSingle && dragStart && moved < 5) {
        const p = local(e);
        const idx = hit(p.x, p.y);
        select(idx, idx >= 0);
      }
      if (pointers.size === 0) dragStart = null;
    };
    const onLeave = () => {
      if (hoverRef.current !== -1) {
        hoverRef.current = -1;
        schedule();
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cancelAnimationFrame(flyRef.current);
      const p = local(e);
      zoomAt(p.x, p.y, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(-1, false);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      observer.disconnect();
      motionQuery.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      cancelAnimationFrame(flyRef.current);
    };
  }, [fit, layout, n, radiusAt, schedule, select, wobble]);

  // ?id=<item> abre direto num item.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('id');
    const index = wanted ? nodes.findIndex((node) => node.id === wanted) : -1;
    if (index >= 0) {
      const timer = window.setTimeout(() => select(index, true), 60);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [nodes, select]);

  const current = selected >= 0 ? nodes[selected] : null;

  const similar = useMemo(
    () => (selected < 0 ? [] : data.similar[selected].map(([i, score]) => ({ i, score }))),
    [data, selected]
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return nodes
      .map((node, i) => ({ node, i }))
      .filter(({ node }) => node.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [nodes, query]);

  const legend = useMemo(() => {
    const present = new Set(nodes.map((node) => node.key));
    return SPECTRUM_ORDER.filter((color) => present.has(color.key)).map((color) => ({ key: color.key, base: color.base }));
  }, [nodes]);

  return (
    <>
      <TreeHeader
        kind={kind}
        locale={locale}
        onNavigate={onNavigate}
        search={{
          query,
          onQuery: setQuery,
          matches,
          onPick: (i) => {
            setQuery('');
            select(i, true);
          }
        }}
      />

      <main className="tree-stage">
        <div className="tree-canvas-wrap" ref={wrapRef}>
          <canvas ref={canvasRef} className="tree-canvas" aria-label={`${s.title} · ${s.kinds[kind]}`} />
        </div>

        <span className="tree-compass tree-compass-top">{s.top}</span>
        <span className="tree-compass tree-compass-bottom">{s.bottom}</span>
        <span className="tree-compass tree-compass-left">{s.left}</span>
        <span className="tree-compass tree-compass-right">{s.right}</span>

        <ul className="tree-legend">
          {legend.map((item) => (
            <li key={item.key}>
              <span className="tree-dot" style={{ background: item.base }} />
              {s.regions[item.key]}
            </li>
          ))}
        </ul>

        {current && (
          <aside className="e-panel tree-panel" aria-label={current.name}>
            <button type="button" className="tree-close" onClick={() => select(-1, false)} aria-label={s.close}>
              ×
            </button>
            <div className="tree-id">
              {current.image && <img className="tree-avatar" src={current.image} alt="" loading="lazy" />}
              <span
                className="e-tag e-tag-cat"
                style={{ '--cat': ideologyColorByKey(current.key).base, '--cat-bg': ideologyColorByKey(current.key).bg } as CSSProperties}
              >
                {s.regions[current.key]}
              </span>
            </div>
            <h2 className="tree-title">{current.name}</h2>
            {current.subtitle && <p className="tree-subtitle">{current.subtitle}</p>}
            <p className="tree-desc">{current.description}</p>
            <a className="e-btn e-btn-ghost e-btn-sm tree-profile" href={`${prefix}/${kind}/${current.id}`}>
              {s.viewProfile}
            </a>

            <ul className="e-axes-list">
              {axes.map((axis, i) => (
                <AxisRow key={axis.id} axis={axis} result={axisResultFor(axis, current.vector[i], s.intensity)} />
              ))}
            </ul>

            <p className="e-eyebrow tree-eyebrow">{s.closest}</p>
            <ul className="tree-similar">
              {similar.map(({ i, score }) => (
                <li key={nodes[i].id}>
                  <button type="button" onClick={() => select(i, true)}>
                    <span className="tree-dot" style={{ background: colors[i] }} />
                    <span className="tree-similar-name">{nodes[i].name}</span>
                    <span className="tree-similar-pct">{score.toFixed(1).replace('.0', '')}%</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
    </>
  );
}
