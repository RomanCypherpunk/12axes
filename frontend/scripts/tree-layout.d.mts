export interface TreeEdge {
  a: number;
  b: number;
  /** 0–1, quanto maior mais parecidas. */
  similarity: number;
}
export interface TreeLayout {
  x: Float64Array;
  y: Float64Array;
  edges: TreeEdge[];
  /** Quantidade de ligações de cada nó; serve de "importância" para os rótulos. */
  degree: number[];
}
export function vectorDistance(a: number[], b: number[]): number;
export function vectorSimilarity(a: number[], b: number[]): number;
export function buildTreeLayout(
  items: { id: string; vector: number[] }[],
  neighbors?: number,
  anchors?: [number, number][],
  similarity?: (i: number, j: number) => number
): TreeLayout;
