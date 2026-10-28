import type { CSSProperties, ReactNode } from 'react';
import { InfoSheet } from './InfoSheet';

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
  /** Cor de acento da aba (catStyle). */
  style?: CSSProperties;
  onClose: () => void;
}

/** Ficha de um perfil (personalidade, país ou partido): quem é, em uma aba simples, no padrão da ficha dos valores. */
export function ProfileSheet({ titleId, visual, label, name, caption, description, style, onClose }: ProfileSheetProps) {
  return (
    <InfoSheet titleId={titleId} style={style} onClose={onClose}>
      <div className="e-value-sheet">
        {visual}
        {label && <span className="e-dim">{label}</span>}
        <h3 id={titleId}>{name}</h3>
        {caption && <p className="e-axis-sheet-label">{caption}</p>}
        <p>{description}</p>
      </div>
    </InfoSheet>
  );
}
