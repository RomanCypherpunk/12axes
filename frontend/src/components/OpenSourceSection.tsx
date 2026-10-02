import { t } from '../i18n';
import { NEW_ISSUE_URL, REPO, REPO_URL } from '../data/repo';

const CARD_ICONS = [
  <>
    <path d="M12 3 4 7v5c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V7l-8-4Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h10" />
  </>,
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <path d="M6 8.5v7" />
    <path d="M18 10.5c0 4-6 3-11 6" />
  </>
];

/** Seção "Código aberto" da home: fica logo abaixo de "Apoie". */
export function OpenSourceSection() {
  return (
    <section className="e-oss" id="codigo-aberto" aria-labelledby="oss-titulo">
      <div className="e-wrap">
        <div className="e-oss-head">
          <div>
            <p className="e-oss-eyebrow">{t.ossEyebrow}</p>
            <h2 id="oss-titulo">{t.ossTitle}</h2>
          </div>
          <p className="e-oss-lead">{t.ossLead}</p>
        </div>
        <ul className="e-oss-cards">
          {t.ossCards.map((card, index) => (
            <li className="e-oss-card" key={card.title}>
              <span className="e-oss-num">/{String(index + 1).padStart(2, '0')}</span>
              <svg className="e-oss-ico" viewBox="0 0 24 24" aria-hidden="true">
                {CARD_ICONS[index]}
              </svg>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
        </ul>
        <div className="e-oss-bar">
          <svg className="e-oss-gh" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
            />
          </svg>
          <div className="e-oss-bar-txt">
            <b>{REPO}</b>
            <span>{t.ossBarText}</span>
          </div>
          <div className="e-oss-actions">
            <a className="e-oss-btn e-oss-primary" href={REPO_URL} target="_blank" rel="noopener noreferrer">
              {t.ossGithubCta}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
            <a className="e-oss-btn e-oss-ghost" href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
              {t.ossIssueCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
