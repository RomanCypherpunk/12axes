type Gtag = (command: 'event', name: string, params?: Record<string, string | number | boolean>) => void;

/**
 * Eventos do funil no GA4: quiz_start, quiz_complete, result_view, paywall_section_seen, paywall_view, modal_close,
 * checkout_start, purchase_unlocked, pdf_export_click e premium_report_view. Sem gtag (bloqueador de anúncios, testes) não faz nada e nunca quebra a tela.
 */
export function track(name: string, params?: Record<string, string | number | boolean>): void {
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === 'function') gtag('event', name, params);
  } catch {
    // métrica nunca pode atrapalhar a compra
  }
}
