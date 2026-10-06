import { useState } from 'react';
import { t } from '../../i18n';
import type { QuestionHelp } from '../../types/quiz';

interface QuestionHelpPanelProps {
  questionId: string;
  help: QuestionHelp;
}

// "Explicar de forma simples": revela a pergunta em linguagem simples e, quando
// existe, o par de exemplos (concordar / discordar). Abrir nunca conta como resposta.
export function QuestionHelpPanel({ questionId, help }: QuestionHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `question-help-${questionId}`;

  return (
    <div className="question-help">
      <button
        type="button"
        className={`e-btn e-btn-sm question-help-toggle ${isOpen ? 'e-btn-primary' : 'e-btn-ghost'}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" />
        </svg>
        <span>{isOpen ? t.helpHide : t.helpShow}</span>
      </button>
      {isOpen && (
        <div className="question-help-panel" id={panelId}>
          <section className="question-help-simple">
            <p className="question-help-label">{t.helpSimpleLabel}</p>
            <p className="question-help-text">{help.simple}</p>
          </section>
          {help.example && (
            <div className="question-help-examples">
              <section className="question-help-example" data-side="agree">
                <p className="question-help-label">{t.helpAgreeLabel}</p>
                <p className="question-help-text">{help.example.agree}</p>
              </section>
              <section className="question-help-example" data-side="disagree">
                <p className="question-help-label">{t.helpDisagreeLabel}</p>
                <p className="question-help-text">{help.example.disagree}</p>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
