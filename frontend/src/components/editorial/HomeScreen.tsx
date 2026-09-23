import type { CSSProperties, ReactNode } from 'react';
import { t } from '../../i18n';
import type { ExampleResult } from '../../data/exampleResult';
import type { Axis, AxisResult, QuizVariant } from '../../types/quiz';
import { AxisIcon, PoleIcon } from '../AxisIcon';
import { SupportSection } from '../SupportSection';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { catStyle, localCatStyle, SPECTRUM_ORDER } from '../../utils/ideologyColors';
import { QUIZ_FORMATS } from './formats';
import { ArrowIcon, ClockIcon, pct, Ring, SafeImg } from './primitives';

interface HomeScreenProps {
  example: ExampleResult | null;
  axes: Axis[];
  showBelowFold: boolean;
  onOpenChooser: () => void;
  onStart: (variant: QuizVariant) => void;
}

const DISCOVERY_ICONS: Record<string, ReactNode> = {
  ideology: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M4 19a2 2 0 0 1 2-2h13" />
      <path d="M9 7h6" />
    </>
  ),
  country: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </>
  ),
  personality: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  spectrum: (
    <>
      <path d="M4 12h16" />
      <path d="M4 6h16" />
      <path d="M4 18h16" />
      <circle cx="9" cy="6" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  profile: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="11" r="2.5" />
      <path d="M5.5 17a3.5 3.5 0 0 1 7 0" />
      <path d="M15 10h3" />
      <path d="M15 14h3" />
    </>
  ),
  compatibility: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  )
};

export function HomeScreen({ example, axes, showBelowFold, onOpenChooser, onStart }: HomeScreenProps) {
  const style = (example ? catStyle(example.ideology.category) : undefined) as CSSProperties | undefined;

  return (
    <div className="ed" style={style}>
      <section className="e-hero" id="inicio">
        <div className="e-wrap">
          <div>
            <p className="e-eyebrow">{t.heroEyebrow}</p>
            <h1>
              {t.h1Pre}
              <span className="e-accent">
                {t.h1Em}
                {t.h1Post}
              </span>
            </h1>
            <p className="e-lead">{t.introLead}</p>
            <div className="e-hero-actions">
              <button className="e-btn e-btn-primary" type="button" onClick={onOpenChooser}>
                {t.startQuiz} <ArrowIcon />
              </button>
              <a className="e-btn e-btn-ghost" href="#guia-eixos">
                {t.seeAxes}
              </a>
            </div>
            <ul className="e-hero-labels">
              {t.heroLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          <div className="e-hero-result">
            {example && (
              <>
                <p className="e-hero-example-label">{t.heroTeaserTag}</p>
                <HeroExample example={example} />
              </>
            )}
          </div>
        </div>
      </section>

      {showBelowFold && (
        <>
          <section className="e-sec" id="descubra" style={{ paddingTop: 24 }}>
            <div className="e-wrap" data-reveal>
              <div className="e-split-head">
                <div>
                  <p className="e-eyebrow">{t.discoveryEyebrow}</p>
                  <h2>{t.discoveryTitle}</h2>
                </div>
                <p className="e-lead">{t.discoveryLead}</p>
              </div>
              <ul className="e-disc-list">
                {t.discoveryItems.map((item) => (
                  <li className="e-disc-item" key={item.title}>
                    <svg className="e-ico" viewBox="0 0 24 24" aria-hidden="true">
                      {DISCOVERY_ICONS[item.icon]}
                    </svg>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="e-sec e-example" id="exemplo">
            <div className="e-wrap" data-reveal>
              <div className="e-sec-head">
                <p className="e-eyebrow">{t.exampleEyebrow}</p>
                <h2>{t.exampleTitle}</h2>
              </div>
              {example && <ExampleGrid example={example} />}
              <div className="e-ex-foot">
                <p>{t.exampleCaption}</p>
                <button className="e-btn e-btn-primary" type="button" onClick={onOpenChooser}>
                  {t.exampleCta} <ArrowIcon />
                </button>
              </div>
            </div>
          </section>

          <section className="e-sec e-dark" id="como-funciona">
            <div className="e-wrap" data-reveal>
              <div className="e-sec-head">
                <p className="e-eyebrow">{t.howEyebrow}</p>
                <h2>{t.howTitle}</h2>
                <p className="e-lead">{t.howLead}</p>
              </div>
              <ol className="e-steps">
                {t.steps.map((step, index) => (
                  <li className="e-step" key={step.title}>
                    <span className="e-n">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="e-sec" id="guia-eixos">
            <div className="e-wrap" data-reveal>
              <div className="e-split-head">
                <div>
                  <p className="e-eyebrow">{t.axesGuideEyebrow}</p>
                  <h2>{t.axesGuideTitle}</h2>
                </div>
                <p className="e-lead">{t.axesGuideLead}</p>
              </div>
              <ul className="e-axes-grid">
                {axes.map((axis, index) => (
                  <li className="e-axis-card" key={axis.id}>
                    <div className="e-axis-top">
                      <span className="e-num">{String(index + 1).padStart(2, '0')}</span>
                      <h3>{axis.label}</h3>
                    </div>
                    <p className="e-poles">
                      <PoleIcon axisId={axis.id} side="left" className="e-ico" />
                      <span>{axis.leftPole}</span>
                      <em>↔</em>
                      <span>{axis.rightPole}</span>
                      <PoleIcon axisId={axis.id} side="right" className="e-ico" />
                    </p>
                    <p>{t.axisExplanations[axis.id]}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="e-sec e-spectrum" id="espectro-politico">
            <div className="e-wrap" data-reveal>
              <div className="e-sec-head">
                <p className="e-eyebrow">{t.spectrumEyebrow}</p>
                <h2>{t.spectrumTitle}</h2>
                <p className="e-lead">{t.spectrumLead}</p>
              </div>
              <div className="e-spec-bar" role="img" aria-label={t.spectrumBarAria}>
                {SPECTRUM_ORDER.map((color) => (
                  <span key={color.key} style={{ background: color.base }} />
                ))}
              </div>
              <ul className="e-spec-grid">
                {t.spectrumItems.map((item) => (
                  <li className="e-spec-card" key={item.id} style={localCatStyle(item.id) as CSSProperties}>
                    <span className="e-spec-dot" />
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="e-sec e-faq" id="faq">
            <div className="e-wrap" data-reveal>
              <div>
                <p className="e-eyebrow">{t.navFaq}</p>
                <h2>{t.faqTitle}</h2>
                <p className="e-lead">{t.faqLead}</p>
              </div>
              <div className="e-faq-list">
                {t.faqItems.map((item) => (
                  <details key={item.question}>
                    <summary>
                      {item.question}
                      <span className="e-plus" aria-hidden="true" />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="e-sec e-dark" id="versoes">
            <div className="e-wrap" data-reveal>
              <div className="e-sec-head">
                <p className="e-eyebrow">{t.versionsEyebrow}</p>
                <h2>{t.versionsTitle}</h2>
                <p className="e-lead">{t.versionsLead}</p>
              </div>
              <ul className="e-ver-grid">
                {QUIZ_FORMATS.map((format) => (
                  <li className={format.featured ? 'e-ver-card e-hi' : 'e-ver-card'} key={format.variant}>
                    <div className="e-ver-top">
                      <span className="e-ver-tag">{format.label}</span>
                      {format.featured && <span className="e-rec">{t.recommended}</span>}
                    </div>
                    <p className="e-ver-num">
                      <strong>{format.count}</strong> {format.countWord}
                    </p>
                    <p className="e-ver-desc">{format.description}</p>
                    <p className="e-ver-time">
                      <ClockIcon />
                      {format.duration}
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
            </div>
          </section>

          <SupportSection variant="home" />
        </>
      )}
    </div>
  );
}

function ExampleGrid({ example }: { example: ExampleResult }) {
  const { ideology, country, personality } = example;
  const flagSrc = resolveCountryFlagSrc(country.flagPath);
  const portraitSrc = resolvePersonalityImageSrc(personality.imagePath);

  return (
    <div className="e-ex-grid">
      <article className="e-card">
        <div className="e-ex-main-head">
          <div>
            <span className="e-tag e-tag-solid">{ideology.category}</span>
            <h3 className={ideology.name.length >= 18 ? 'e-long-name' : undefined}>{ideology.name}</h3>
          </div>
          <Ring pct={ideology.compatibility} size={112} stroke={9} sized={false} />
        </div>
        <p className="e-ex-desc">{ideology.description}</p>
        <div className="e-ex-axes">
          {example.axes.map((axis) => (
            <ExampleAxis key={axis.axisId} axis={axis} />
          ))}
        </div>
      </article>
      <div className="e-ex-side">
        <article className="e-card e-mini">
          <SafeImg className="e-flag" src={flagSrc} alt={t.flagAlt(t.flagLabel, country.name)} fallback={t.flagUnavailable} />
          <div>
            <div className="e-mini-top">
              <span className="e-tag e-tag-cat">{t.countryKicker}</span>
              <span className="e-tag e-tag-solid">
                {pct(country.compatibility)}% {t.matchWord}
              </span>
            </div>
            <h3>{country.name}</h3>
            <p className="e-meta">
              <span className="e-tag e-tag-neutral">{country.historical && country.period ? country.period : country.category}</span>
            </p>
            <p>{country.description}</p>
          </div>
        </article>
        <article className="e-card e-mini">
          <SafeImg
            className=""
            src={portraitSrc}
            alt={t.portraitAlt(personality.name)}
            fallback={personalityInitials(personality.name)}
          />
          <div>
            <div className="e-mini-top">
              <span className="e-tag e-tag-cat">{t.personalityKicker}</span>
              <span className="e-tag e-tag-solid">
                {pct(personality.compatibility)}% {t.matchWord}
              </span>
            </div>
            <h3>{personality.name}</h3>
            <p className="e-meta">
              <span className="e-tag e-tag-neutral">
                {[personality.role, personality.lifespan].filter(Boolean).join(' · ')}
              </span>
            </p>
            <p>{personality.description}</p>
          </div>
        </article>
      </div>
    </div>
  );
}

function HeroExample({ example }: { example: ExampleResult }) {
  const { ideology, personality, country } = example;
  const portraitSrc = resolvePersonalityImageSrc(personality.imagePath);
  const flagSrc = resolveCountryFlagSrc(country.flagPath);

  return (
    <article className="e-hero-summary">
      <div className="e-hero-summary-main">
        <div>
          <span className="e-tag e-tag-solid">{ideology.category}</span>
          <h2 className={ideology.name.length >= 18 ? 'e-long-name' : undefined}>{ideology.name}</h2>
        </div>
        <Ring pct={ideology.compatibility} size={104} stroke={9} />
      </div>
      <div className="e-hero-summary-detail">
        <SafeImg
          className="e-hero-summary-portrait"
          src={portraitSrc}
          alt={t.portraitAlt(personality.name)}
          fallback={personalityInitials(personality.name)}
        />
        <div>
          <span className="e-tag e-tag-cat">{t.personalityKicker}</span>
          <h3>{personality.name}</h3>
          {(personality.role || personality.lifespan) && (
            <span className="e-tag e-tag-neutral">
              {[personality.role, personality.lifespan].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
      </div>
      <div className="e-hero-summary-detail">
        <SafeImg
          className="e-hero-summary-portrait e-hero-summary-flag"
          src={flagSrc}
          alt={t.flagAlt(t.flagLabel, country.name)}
          fallback={t.flagUnavailable}
        />
        <div>
          <span className="e-tag e-tag-cat">{t.countryKicker}</span>
          <h3>{country.name}</h3>
          <span className="e-tag e-tag-neutral">
            {country.historical && country.period ? country.period : country.category}
          </span>
        </div>
      </div>
    </article>
  );
}

function ExampleAxis({ axis }: { axis: AxisResult }) {
  const leftWins = axis.leftPercent >= axis.rightPercent;
  const leftFill = leftWins ? Math.max(0, (axis.leftPercent - 50) * 2) : 0;
  const rightFill = leftWins ? 0 : Math.max(0, (axis.rightPercent - 50) * 2);

  return (
    <div className="e-ax-row">
      <div className="e-ax-head">
        <AxisIcon id={axis.axisId} className="e-ico" />
        <h4>{axis.label}</h4>
        <span className="e-tag e-tag-cat">
          {axis.intensity} · {axis.dominantPole}
        </span>
      </div>
      <div className="e-ax-bar">
        <span className={leftWins ? 'e-win' : undefined}>
          {axis.leftPole} {pct(axis.leftPercent)}%
        </span>
        <div className="e-track" aria-hidden="true">
          <div className="e-half e-l">
            <i style={{ width: `${leftFill}%` }} />
          </div>
          <b />
          <div className="e-half e-r">
            <i style={{ width: `${rightFill}%` }} />
          </div>
        </div>
        <span className={leftWins ? undefined : 'e-win'}>
          {pct(axis.rightPercent)}% {axis.rightPole}
        </span>
      </div>
    </div>
  );
}
