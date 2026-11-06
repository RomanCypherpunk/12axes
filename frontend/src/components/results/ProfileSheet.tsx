import type { CSSProperties, ReactNode } from 'react';
import { InfoSheet } from './InfoSheet';
import { MatchInsightBlock, useHasMatchInsight } from './MatchInsight';

interface ProfileSheetProps {
  /** id do título, para o aria-labelledby do diálogo. */
  titleId: string;
  /** Retrato, bandeira ou logo, já com a classe e-sheet-face (ou e-sheet-flag / e-sheet-logo). */
  visual: ReactNode;
  /** Rótulo pequeno, em caixa-alta, acima do nome (categoria, cargo...). */
  label?: string;
  name: string;
  /** Linha de apoio abaixo do nome (função e anos de vida, período...). */
  caption?: string;
  description: string;
  /** Vetor de 12 eixos do perfil: no relatório pago, a ficha mostra ao lado o que aproxima e afasta o usuário dele. */
  vector?: Record<string, number>;
  /** Cor de acento da aba (catStyle). */
  style?: CSSProperties;
  onClose: () => void;
}

/** Ficha de um perfil (personalidade, país ou partido): quem é e, no relatório pago, o que o aproxima do usuário. */
export function ProfileSheet({ titleId, visual, label, name, caption, description, vector, style, onClose }: ProfileSheetProps) {
  const withInsight = useHasMatchInsight() && vector !== undefined;
  return (
    <InfoSheet titleId={titleId} style={style} className={withInsight ? 'e-axis-sheet--insight' : undefined} onClose={onClose}>
      <div className={withInsight ? 'e-profile-cols' : undefined}>
        <div className="e-value-sheet">
          {visual}
          {label && <span className="e-dim">{label}</span>}
          <h3 id={titleId}>{name}</h3>
          {caption && <p className="e-axis-sheet-label">{caption}</p>}
          <p>{description}</p>
        </div>
        {withInsight && <MatchInsightBlock name={name} vector={vector} />}
      </div>
    </InfoSheet>
  );
}
