import { t } from '../../i18n';
import type { QuizVariant } from '../../types/quiz';
import { QUIZ_FORMATS } from './formats';
import { ArrowIcon, ClockIcon } from './primitives';

interface VariantScreenProps {
  error: string | null;
  onStart: (variant: QuizVariant) => void;
}

export function VariantScreen({ error, onStart }: VariantScreenProps) {
  return (
    <section className="ed e-fmt" aria-labelledby="variant-title">
      <div className="e-wrap">
        <p className="e-eyebrow">{t.variantEyebrow}</p>
        <h1 id="variant-title">
          {t.variantTitlePre}
          <span className="e-accent">{t.variantTitleEm}</span>
        </h1>
        <p className="e-lead">{t.variantLead}</p>

        <ul className="e-fmt-grid">
          {QUIZ_FORMATS.map((format) => (
            <li className={format.featured ? 'e-fmt-card e-hi' : 'e-fmt-card'} key={format.variant}>
              <div className="e-fmt-top">
                <span className="e-fmt-tag">{format.label}</span>
                {format.featured && <span className="e-rec">{t.recommended}</span>}
              </div>
              <p className="e-fmt-num">
                <strong>{format.count}</strong> {format.countWord}
              </p>
              <p className="e-fmt-desc">{format.description}</p>
              <p className="e-fmt-meta">
                <span>
                  <ClockIcon />
                  {format.duration}
                </span>
                <span aria-label={t.depthAria(format.depth)}>
                  {t.depthLabel}
                  <span className="e-depth" aria-hidden="true">
                    {[1, 2, 3].map((level) => (
                      <i key={level} className={level <= format.depth ? 'e-on' : undefined} />
                    ))}
                  </span>
                </span>
              </p>
              <button
                className={format.featured ? 'e-btn e-btn-light' : 'e-btn e-btn-primary'}
                type="button"
                onClick={() => onStart(format.variant)}
              >
                {format.action} <ArrowIcon />
              </button>
            </li>
          ))}
        </ul>

        <ul className="e-fmt-note">
          {t.formatNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        {error && <p className="inline-error" role="alert">{error}</p>}
      </div>
    </section>
  );
}
