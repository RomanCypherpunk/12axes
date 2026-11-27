// Resultado de um perfil do catálogo para a página dele na wiki: o mesmo cálculo de /api/results/by-axes com o vetor
// do perfil e a religião dele, tirando o próprio perfil do catálogo dele (senão ele seria o mais próximo de si mesmo).
//
// Uma diferença pedida pelo autor: na wiki, a distinção (eixo mais incomum, mais comum e tensão) compara o perfil com o
// próprio catálogo dele (personalidade com personalidades, país com países...), não com as ideologias como nos resultados.
// A fórmula é a mesma do backend (AxisOutlierService e AxisTensionService); muda só o conjunto de comparação.

import type { QuizResult } from '../../types/quiz';
import { rankOutliers, strongestTension } from './outliers.ts';
import { profileReligion } from './religion.ts';
import { computeResult, type WikiCatalogs } from './result.ts';

export type WikiCatalog = 'personality' | 'ideology' | 'country' | 'party';

const LIST: Record<WikiCatalog, 'personalities' | 'ideologies' | 'countries' | 'parties'> = {
  personality: 'personalities',
  ideology: 'ideologies',
  country: 'countries',
  party: 'parties'
};

export function buildProfileResult(subject: { catalog: WikiCatalog; id: string }, catalogs: WikiCatalogs): QuizResult {
  const list = catalogs[LIST[subject.catalog]] as { id: string; name: string; religions?: string[] }[];
  const item = list.find((entry) => entry.id === subject.id);
  const vector = catalogs.vectors[subject.catalog].get(subject.id);
  if (!item || !vector) throw new Error(`perfil inexistente na wiki: ${subject.catalog}/${subject.id}`);
  const others = list.filter((entry) => entry.id !== subject.id);
  const withoutSelf = { ...catalogs, [LIST[subject.catalog]]: others } as WikiCatalogs;
  const result = computeResult(vector, profileReligion(item.religions), withoutSelf);

  const peers = others
    .map((entry) => ({ name: entry.name, vector: catalogs.vectors[subject.catalog].get(entry.id) }))
    .filter((entry): entry is { name: string; vector: Record<string, number> } => Boolean(entry.vector));
  const user = Object.fromEntries(result.axes.map((axis) => [axis.axisId, axis.leftPercent]));
  const outliers = rankOutliers(result.axes, catalogs.axes, peers.map((peer) => peer.vector));
  return {
    ...result,
    mostUnusualAxis: outliers[0],
    mostCommonAxis: outliers[outliers.length - 1],
    axisTension: strongestTension(user, catalogs.axes, peers)
  };
}
