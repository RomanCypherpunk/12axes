/**
 * O que o botão "Download PDF" faz: gerar o PDF, ou (sem acesso ao Relatório completo, com a compra ligada) abrir o modal
 * de compra. Com a compra desligada o PDF segue livre, como antes.
 */
export function pdfButtonAction(paywallEnabled: boolean, hasPremium: boolean): 'print' | 'openModal' {
  return paywallEnabled && !hasPremium ? 'openModal' : 'print';
}
