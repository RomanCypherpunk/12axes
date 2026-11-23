import { useEffect, useState } from 'react';
import { t } from '../../i18n';
import { NEW_ISSUE_URL } from '../../data/repo';
import { isFeedbackOpen } from '../../utils/feedbackWindow';

/**
 * Botões "Reportar um problema" e "Sugerir melhorias" do rodapé: abrem uma issue no GitHub e só aparecem
 * de segunda a quinta (horário de Brasília).
 */
export function FeedbackLinks() {
  const [open, setOpen] = useState(() => isFeedbackOpen());
  // Reavalia a cada minuto para os botões aparecerem ou sumirem na virada do dia, com a aba aberta.
  useEffect(() => {
    const id = window.setInterval(() => setOpen(isFeedbackOpen()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (!open) return null;
  return (
    <nav className="e-foot-links" aria-label={t.feedbackTitle}>
      <a className="e-btn e-btn-ghost e-btn-sm" href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
        {t.feedbackReport}
      </a>
      <a className="e-btn e-btn-ghost e-btn-sm" href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
        {t.feedbackSuggest}
      </a>
    </nav>
  );
}
