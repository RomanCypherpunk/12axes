import type { Axis } from '../types/quiz';
import type { IdeologyColorKey } from '../utils/ideologyColors';
import type { TreeLayout } from '../../scripts/tree-layout.mjs';

export type TreeKind = 'ideologies' | 'personalities' | 'countries' | 'parties';
export type TreeLocale = 'pt' | 'en';

export const TREE_KINDS: TreeKind[] = ['ideologies', 'personalities', 'countries', 'parties'];

export interface TreeNode {
  id: string;
  name: string;
  /** Segunda linha do painel (cargo, regime, tipo de organização…). */
  subtitle: string;
  description: string;
  /** 12 valores (0–100) na ordem de axes.json: % do polo esquerdo. */
  vector: number[];
  /** Região do espectro: dá a cor do ponto e a posição na teia. */
  key: IdeologyColorKey;
  image?: string;
}

/** Tudo que a teia precisa, já calculado no build (scripts/tree-data.mjs). */
export interface TreeData {
  kind: TreeKind;
  locale: TreeLocale;
  worldX: number;
  worldY: number;
  scale: number;
  axes: Axis[];
  nodes: TreeNode[];
  layout: TreeLayout;
  /** Os 6 itens mais compatíveis de cada um: [índice, pontuação]. */
  similar: [number, number][][];
}

interface Payload {
  worldX: number;
  worldY: number;
  scale: number;
  axes: Axis[];
  nodes: { id: string; name: string; sub: string; desc: string; vec: number[]; key: IdeologyColorKey; img: string }[];
  x: number[];
  y: number[];
  deg: number[];
  edges: [number, number, number][];
  similar: [number, number][][];
}

// Cache da sessão: trocar de aba (ou voltar) não baixa nem remonta nada de novo.
const cache = new Map<string, TreeData>();
const inflight = new Map<string, Promise<TreeData>>();

const keyOf = (kind: TreeKind, locale: TreeLocale) => `${locale}-${kind}`;

/** Dados já em memória, se houver (para não piscar "carregando" ao voltar para uma aba). */
export function peekTreeData(kind: TreeKind, locale: TreeLocale): TreeData | null {
  return cache.get(keyOf(kind, locale)) ?? null;
}

export function loadTreeData(kind: TreeKind, locale: TreeLocale): Promise<TreeData> {
  const key = keyOf(kind, locale);
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  let pending = inflight.get(key);
  if (!pending) {
    pending = fetch(`/tree-data/${key}.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`tree-data ${key}: HTTP ${response.status}`);
        return response.json() as Promise<Payload>;
      })
      .then((payload) => {
        const data: TreeData = {
          kind,
          locale,
          worldX: payload.worldX,
          worldY: payload.worldY,
          scale: payload.scale,
          axes: payload.axes,
          nodes: payload.nodes.map((node) => ({
            id: node.id,
            name: node.name,
            subtitle: node.sub,
            description: node.desc,
            vector: node.vec,
            key: node.key,
            image: node.img || undefined
          })),
          layout: {
            x: Float64Array.from(payload.x),
            y: Float64Array.from(payload.y),
            degree: payload.deg,
            edges: payload.edges.map(([a, b, similarity]) => ({ a, b, similarity }))
          },
          similar: payload.similar
        };
        cache.set(key, data);
        return data;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }
  return pending;
}

/** Aquece o cache dos outros catálogos quando o navegador está ocioso, para a troca de aba ser instantânea. */
export function prefetchTreeData(locale: TreeLocale, except: TreeKind) {
  const run = () => {
    for (const kind of TREE_KINDS) if (kind !== except) void loadTreeData(kind, locale).catch(() => undefined);
  };
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (idle) idle(run);
  else window.setTimeout(run, 1500);
}
