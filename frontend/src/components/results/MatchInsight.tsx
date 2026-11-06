import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult } from '../../types/quiz';
import { insightSide, matchInsight, type InsightAxis } from '../../utils/matchInsight';

interface InsightSource {
  axes: Axis[];
  /** O resultado do usuário em cada eixo (leftPercent). */
  results: Map<string, AxisResult>;
}

// Só o relatório pago tem o provedor: nas fichas sem ele (resultado grátis, comparação) o bloco não aparece.
const MatchInsightContext = createContext<InsightSource | null>(null);

export function MatchInsightProvider({ axes, results, children }: InsightSource & { children: ReactNode }) {
  const value = useMemo(() => ({ axes, results }), [axes, results]);
  return <MatchInsightContext.Provider value={value}>{children}</MatchInsightContext.Provider>;
}

export function useHasMatchInsight(): boolean {
  return useContext(MatchInsightContext) !== null;
}

/** Os eixos e o resultado do usuário, quando estamos no relatório pago; fora dele, null. */
export function useUserAxes(): InsightSource | null {
  return useContext(MatchInsightContext);
}

/** Percentual no polo em que a posição pende (o que o resultado mostra ao lado do nome do polo). */
const sidePct = (leftPercent: number): number => Math.round(Math.max(leftPercent, 100 - leftPercent));

// Abaixo disso a diferença não é afastamento (o pop-up só chama de afastamento a partir de 15 pontos).
const TINY_GAP = 8;

const poleText = (axisId: string, side: InsightAxis['userSide']): string => {
  if (side === 'balanced') return t.insight.balanced;
  return t.insight.poles[axisId]?.[side] ?? t.insight.balanced;
};

/**
 * A frase de um eixo em que o usuário e um perfil se afastam ("Em Religião, vocês se afastam: você tem ..., enquanto X tem ..."),
 * a mesma do pop-up. Quando os dois ficam do mesmo lado, diz que a diferença é de intensidade.
 */
export function divergenceText(axisId: string, label: string, userLeft: number, otherLeft: number, name: string): string {
  const userSide = insightSide(userLeft);
  const otherSide = insightSide(otherLeft);
  const gap = Math.round(Math.abs(userLeft - otherLeft));
  // Quando a maior diferença é minúscula (perfis quase idênticos), dizer que se afastam seria falso.
  if (gap < TINY_GAP) return t.insight.apartTiny(label, name, gap);
  if (userSide === otherSide && userSide !== 'balanced') {
    return t.insight.apartSame(label, poleText(axisId, userSide), sidePct(userLeft), sidePct(otherLeft), name, gap);
  }
  return t.insight.apartAxis(label, poleText(axisId, userSide), poleText(axisId, otherSide), name, gap);
}

/** O que aproxima o usuário de um perfil e onde os dois se afastam, em texto, só pelos vetores dos 12 eixos. */
export function MatchInsightBlock({ name, vector }: { name: string; vector: Record<string, number> | undefined }) {
  const source = useContext(MatchInsightContext);
  const insight = useMemo(() => {
    if (!source || !vector) return null;
    const user = new Map([...source.results].map(([id, result]) => [id, result.leftPercent]));
    return matchInsight(source.axes, user, vector);
  }, [source, vector]);
  if (!insight) return null;

  return (
    <div className="e-insight">
      <section>
        <h4>{t.insight.closeTitle(name)}</h4>
        {insight.shared.length === 0 ? (
          <p>{t.insight.closeNone(name)}</p>
        ) : (
          insight.shared.map((row) => (
            <p key={row.axisId}>
              {t.insight.closeAxis(row.label, poleText(row.axisId, row.userSide), sidePct(row.user), sidePct(row.other), name, Math.round(Math.abs(row.user - row.other)))}
            </p>
          ))
        )}
      </section>
      <section>
        <h4>{t.insight.apartTitle}</h4>
        {insight.apart.length === 0 ? (
          <p>{t.insight.apartNone(name)}</p>
        ) : (
          insight.apart.map((row) => (
            <p key={row.axisId}>
              {t.insight.apartAxis(row.label, poleText(row.axisId, row.userSide), poleText(row.axisId, row.otherSide), name, Math.round(Math.abs(row.user - row.other)))}
            </p>
          ))
        )}
      </section>
    </div>
  );
}
