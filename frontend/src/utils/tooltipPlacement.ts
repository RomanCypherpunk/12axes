interface Rect {
  top: number;
  bottom: number;
  left: number;
  width: number;
}

export interface Placement {
  top: number;
  left: number;
  /** Posição da seta, relativa à borda esquerda do balão. */
  arrowLeft: number;
  above: boolean;
}

const GAP = 10;
const MARGIN = 8;
const ARROW_INSET = 14;

/**
 * Posição do balão: centralizado no termo e abaixo dele; vai para cima só quando
 * não cabe embaixo e cabe em cima. Na horizontal fica a pelo menos 8px das bordas
 * da tela, e a seta continua apontando para o termo.
 *
 * @param anchor   retângulo do termo (coordenadas da viewport)
 * @param tip      tamanho do balão já renderizado
 * @param viewport tamanho da janela
 */
export function placeTooltip(
  anchor: Rect,
  tip: { width: number; height: number },
  viewport: { width: number; height: number }
): Placement {
  const center = anchor.left + anchor.width / 2;
  const left = Math.min(Math.max(center - tip.width / 2, MARGIN), viewport.width - tip.width - MARGIN);
  const fitsBelow = anchor.bottom + GAP + tip.height <= viewport.height - MARGIN;
  const fitsAbove = anchor.top - GAP - tip.height >= MARGIN;
  const above = !fitsBelow && fitsAbove;
  return {
    top: above ? anchor.top - GAP - tip.height : anchor.bottom + GAP,
    left,
    arrowLeft: Math.min(Math.max(center - left, ARROW_INSET), tip.width - ARROW_INSET),
    above
  };
}
