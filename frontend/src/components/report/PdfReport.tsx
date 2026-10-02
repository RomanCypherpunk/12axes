import type { CSSProperties, ReactNode } from 'react';
import { NUMBER_LOCALE, t } from '../../i18n';
import type {
  Axis,
  AxisOutlier,
  AxisResult,
  CountryDimensionMatch,
  CountryMatch,
  QuizResult
} from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { catStyle, localCatStyle } from '../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import type { Religion } from '../../utils/religion';
import { PoleIcon } from '../AxisIcon';
import { pct } from '../editorial/primitives';
import { axisLeaning } from '../results/AxesSection';
import { commonNote, unusualLead } from '../results/SignatureSection';

interface PdfReportProps {
  result: QuizResult;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
  answeredCount: number | null;
  religion?: Religion | null;
}

/**
 * Relatório completo para impressão/PDF (design em docs/nova-identidade/12axes-relatorio.html).
 * Só aparece em @media print; a paginação fica a cargo do navegador, com a capa numa página própria.
 */
export function PdfReport({ result, axes, axisResults, answeredCount, religion }: PdfReportProps) {
  const top = result.topMatch;
  const books = result.bookRecommendations ?? [];
  const others = result.matches.slice(1, 4);
  const sections = [
    t.axesSectionTitle,
    t.signatureTitle,
    t.countriesSectionTitle,
    t.personalitiesSectionTitle,
    ...(result.personalityMatches.length > 0 ? [t.areasGeneralTitle] : []),
    ...(books.length > 0 ? [t.booksTitle] : []),
    t.otherMatches
  ];
  const num = (title: string) => String(sections.indexOf(title) + 1).padStart(2, '0');
  const today = new Date().toLocaleDateString(NUMBER_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="rp" style={catStyle(top.category) as CSSProperties}>
      <section className="rp-cover">
        <div className="cv-top">
          <div className="cv-bar">
            <Logo />
            <span className="cv-line" />
            <span className="cv-lab">{t.report.docLabel}</span>
          </div>
          <p className="cv-eb">{t.report.profileEyebrow}</p>
          <div className="cv-main">
            <div>
              <span className="tag cv-tag">{top.category}</span>
              <h1>{top.name}</h1>
            </div>
            <Ring value={top.compatibility} size={132} stroke={11} />
          </div>
          <p className="cv-desc">
            {top.longDescription || top.description}
          </p>
        </div>
        <div className="cv-body">
          {top.phrase && <Quote phrase={top.phrase} ideology={top.name} />}
          <div className="kpis">
            <div>
              <small>{t.metaTop}</small>
              <b className="c">{formatPct(top.compatibility, 1)}</b>
              <span>{top.name}</span>
            </div>
            <div>
              <small>{t.report.kpiCountry}</small>
              <b>{formatPct(result.topCountryMatch.compatibility, 0)}</b>
              <span>{result.topCountryMatch.name}</span>
            </div>
            <div>
              <small>{t.report.kpiPersonality}</small>
              <b>{formatPct(result.topPersonalityMatch.compatibility, 0)}</b>
              <span>{result.topPersonalityMatch.name}</span>
            </div>
            <div>
              <small>{t.report.kpiAxes}</small>
              <b>12</b>
              {answeredCount ? <span>{t.report.kpiAnswered(answeredCount)}</span> : null}
            </div>
          </div>
          <div className="toc">
            <p className="eb">{t.report.tocTitle}</p>
            <ol>
              {sections.map((title, index) => (
                <li key={title}>
                  <span className="tn">{String(index + 1).padStart(2, '0')}</span>
                  <span className="tt">{title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <footer className="pf cv-f">
          <span>
            {t.report.generatedOn(today)} · 12axes.vercel.app
          </span>
        </footer>
      </section>

      <div className="rp-body">
        <header className="ph">
          <Logo />
          <span>{t.report.headerLabel(top.name)}</span>
        </header>

        <section className="rp-sec">
          <SectionHead n={num(t.axesSectionTitle)} eyebrow={t.axesSectionEyebrow} title={t.axesSectionTitle} />
          <p className="intro">{t.report.axesIntro}</p>
          <ul className="axes">
            {axes.map((axis) => {
              const axisResult = axisResults.get(axis.id);
              return axisResult ? <AxisRow key={axis.id} axis={axis} result={axisResult} religion={religion} /> : null;
            })}
          </ul>
          <div className="ileg">
            <b>{t.report.intensityLegend}</b>
            {t.report.intensityLevels.map((label, index) => (
              <span key={label}>
                <i style={{ opacity: [0.3, 0.55, 0.8, 1][index] }} />
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="rp-sec">
          <SectionHead n={num(t.signatureTitle)} title={t.signatureTitle} />
          <div className="dist">
            <SignatureCard
              outlier={result.mostUnusualAxis}
              strong
              label={t.signatureUnusualLabel}
              lead={unusualLead(result.mostUnusualAxis)}
              note={t.signatureUnusualNote(result.mostUnusualAxis.label)}
            />
            <SignatureCard
              outlier={result.mostCommonAxis}
              strong={false}
              label={t.signatureCommonLabel}
              lead={t.signatureCommonLead(result.mostCommonAxis.label)}
              note={commonNote(result.mostCommonAxis)}
            />
            {result.axisTension && (
              <article className="tension">
                <div>
                  <span className="tag tw">{t.tensionLabel}</span>
                  <h3>{t.tensionCombo(result.axisTension.firstPole, result.axisTension.secondPole)}</h3>
                </div>
                <p>
                  <b>
                    {result.axisTension.matchingIdeologies === 0
                      ? t.tensionUnique
                      : t.tensionRare(result.axisTension.matchingIdeologies, result.axisTension.catalogSize)}
                  </b>
                  {[
                    result.axisTension.examples.length > 0 ? t.tensionExamples(result.axisTension.examples.join(', ')) : '',
                    t.tensionNote(result.axisTension.firstAxisLabel, result.axisTension.secondAxisLabel)
                  ]
                    .filter(Boolean)
                    .join(' ')}
                </p>
              </article>
            )}
          </div>
        </section>

        <section className="rp-sec">
          <SectionHead n={num(t.countriesSectionTitle)} title={t.countriesSectionTitle} />
          <CountryBlock
            label={t.countryCurrentTab}
            match={result.topCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={result.bottomCountryMatches}
          />
        </section>
        <section className="rp-sec">
          <p className="cont">
            {num(t.countriesSectionTitle)} · {t.countriesSectionTitle} ({t.report.continued})
          </p>
          <CountryBlock label={t.countryHistoricalTab} match={result.topHistoricalCountryMatch} />
        </section>

        <section className="rp-sec">
          <SectionHead n={num(t.personalitiesSectionTitle)} title={t.personalitiesSectionTitle} />
          <MatchCard
            visual={<Img className="av-b" src={resolvePersonalityImageSrc(result.topPersonalityMatch.imagePath)} name={result.topPersonalityMatch.name} />}
            kicker={t.personalityKicker}
            compatibility={result.topPersonalityMatch.compatibility}
            name={result.topPersonalityMatch.name}
            tags={[result.topPersonalityMatch.role, result.topPersonalityMatch.lifespan].filter(Boolean)}
            description={result.topPersonalityMatch.description}
          />
          <p className="lbl">{t.report.alsoClose}</p>
          <ul className="dims">
            {result.dimensionMatches.map(({ dimension, match }) => (
              <li className="dc" key={dimension}>
                <Img className="av-s" src={resolvePersonalityImageSrc(match.imagePath)} name={match.name} />
                <span className="dim">{t.dimensionLabels[dimension]}</span>
                <b>{match.name}</b>
                <small>{match.role}</small>
                <strong>{Math.round(match.compatibility)}%</strong>
              </li>
            ))}
          </ul>
          <FarList
            title={t.personalitiesDistantTitle}
            items={result.bottomPersonalityMatches.map((match) => ({ key: match.personalityId, name: match.name, caption: match.role, value: match.compatibility }))}
          />
        </section>

        {result.personalityMatches.length > 0 && (
          <section className="rp-sec">
            <SectionHead n={num(t.areasGeneralTitle)} title={t.areasGeneralTitle} />
            <p className="intro">{t.report.areasIntro}</p>
            <ul className="near">
              {result.personalityMatches.map((match) => (
                <li className="nc" key={match.personalityId}>
                  <Img className="av-m" src={resolvePersonalityImageSrc(match.imagePath)} name={match.name} />
                  <span className="tag tn">{t.personalityCategories[match.category]}</span>
                  <b>{match.name}</b>
                  <small>{match.role}</small>
                  <strong>{Math.round(match.compatibility)}%</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        {books.length > 0 && (
          <section className="rp-sec">
            <SectionHead n={num(t.booksTitle)} eyebrow={t.booksEyebrow} title={t.booksTitle} />
            <p className="intro">{t.report.booksIntro}</p>
            <ul className="books">
              {books.map((book, index) => (
                <li className={index === 0 ? 'bk top' : 'bk'} key={book.personalityId}>
                  <div className="bk-top">
                    <span className="bk-n">{String(index + 1).padStart(2, '0')}</span>
                    <span className="tag tc">{t.booksWhy(Math.round(book.compatibility))}</span>
                  </div>
                  <div className="bk-a">
                    <Img className="av-x" src={resolvePersonalityImageSrc(book.imagePath)} name={book.personalityName} />
                    <div>
                      <small>{index === 0 ? t.booksTopLabel : t.booksAuthorLabel}</small>
                      <b>{book.personalityName}</b>
                    </div>
                  </div>
                  <div className="bk-t">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2" />
                      <path d="M4 19a2 2 0 0 1 2-2h13" />
                    </svg>
                    <div>
                      <h4>{book.title}</h4>
                      {book.year ? <span>{book.year < 0 ? t.booksYearBc(-book.year) : book.year}</span> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rp-sec">
          <SectionHead n={num(t.otherMatches)} eyebrow={t.proximityEyebrow} title={t.otherMatches} />
          <ul className="others">
            {others.map((match) => (
              <li className="oc" key={match.ideologyId} style={localCatStyle(match.category) as CSSProperties}>
                <div className="oc-h">
                  <span className="tag osol">{match.category}</span>
                  <h3>{match.name}</h3>
                </div>
                <p>{match.description}</p>
              </li>
            ))}
          </ul>
          <p className="lbl">{t.ideologyDistantTitle}</p>
          <div className="far-i" style={localCatStyle(result.bottomIdeologyMatch.category) as CSSProperties}>
            <b>{result.bottomIdeologyMatch.name}</b>
            <span className="tag osol-l">{result.bottomIdeologyMatch.category}</span>
            <span className="fp">{Math.round(result.bottomIdeologyMatch.compatibility)}%</span>
            <p>{result.bottomIdeologyMatch.description}</p>
          </div>
        </section>

        <div className="close">
          <div>
            <p className="eb">{t.report.aboutTitle}</p>
            <p>{t.report.aboutText}</p>
          </div>
          <div className="close-cta">
            <b>{t.report.ctaTitle}</b>
            <span>12axes.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPct(value: number, decimals: number): string {
  return `${value.toLocaleString(NUMBER_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
}

function Logo() {
  return (
    <span className="logo">
      <b>12</b> axes
    </span>
  );
}

function Ring({ value, size, stroke }: { value: number; size: number; stroke: number }) {
  const center = size / 2;
  const radius = center - stroke / 2 - 0.5;
  const circumference = 2 * Math.PI * radius;
  const arc = (Math.max(0, Math.min(100, value)) / 100) * circumference;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--ring-bg)" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div>
        <b>{Math.round(value)}%</b>
        <small>{t.matchWord}</small>
      </div>
    </div>
  );
}

function Quote({ phrase, ideology }: { phrase: string; ideology: string }) {
  const [before, after] = t.phraseNote(ideology).split(ideology);
  return (
    <figure className="quote">
      <span className="q">“</span>
      <div>
        <p className="eb">{t.phraseTitle}</p>
        <blockquote>{phrase}</blockquote>
        <figcaption>
          {before}
          <b>{ideology}</b>
          {after}
        </figcaption>
      </div>
    </figure>
  );
}

function SectionHead({ n, eyebrow, title }: { n: string; eyebrow?: string; title: string }) {
  return (
    <div className="sh">
      <span className="sn">{n}</span>
      <div>
        {eyebrow && <p className="eb">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
    </div>
  );
}

// Retrato/bandeira com iniciais no lugar quando a imagem não existe.
function Img({ className, src, name }: { className: string; src: string; name: string }) {
  if (!src) {
    return <div className={`${className} ini`}>{personalityInitials(name)}</div>;
  }
  return <img className={className} src={src} alt="" />;
}

function AxisRow({ axis, result, religion }: { axis: Axis; result: AxisResult; religion?: Religion | null }) {
  const { balanced, rightWins, leftWins, accent } = axisLeaning(axis, result);
  const style = { '--ac': accent, '--al': axis.leftColor, '--ar': axis.rightColor } as CSSProperties;
  return (
    <li className="ax" style={style}>
      <div className="ax-name">
        <b>{result.label}</b>
        <span className="itag">
          <i />
          {balanced ? result.intensity : `${result.intensity} · ${result.dominantPole}`}
        </span>
      </div>
      <div className={leftWins ? 'pl l win' : 'pl l'}>
        <PoleIcon axisId={axis.id} side="left" className="ico" />
        <span>
          {result.leftPole}
          <em>{pct(result.leftPercent)}%</em>
        </span>
      </div>
      <div className="tr">
        <span className="half l">
          <i style={{ width: `${leftWins ? (result.leftPercent - 50) * 2 : 0}%` }} />
        </span>
        <span className="half r">
          <i style={{ width: `${rightWins ? (result.rightPercent - 50) * 2 : 0}%` }} />
        </span>
        <span className="mid" />
        <span className="dot" style={{ left: `${Math.max(0, Math.min(100, result.rightPercent))}%` }} />
      </div>
      <div className={rightWins ? 'pl r win' : 'pl r'}>
        <span>
          {result.rightPole}
          <em>{pct(result.rightPercent)}%</em>
        </span>
        <PoleIcon axisId={axis.id} side="right" className="ico" religion={religion} />
      </div>
    </li>
  );
}

function SignatureCard({ outlier, strong, label, lead, note }: {
  outlier: AxisOutlier;
  strong: boolean;
  label: string;
  lead: string;
  note: string;
}) {
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  return (
    <article className={strong ? 'dcard s' : 'dcard'}>
      <span className={strong ? 'tag tc' : 'tag tn'}>{label}</span>
      <h3>{outlier.label}</h3>
      <p>{lead}</p>
      <div className="mbar">
        <span className="mt" />
        <span className="mm" style={{ left: `${clamp(outlier.catalogMedian)}%` }} />
        <span className={strong ? 'my s' : 'my'} style={{ left: `${clamp(outlier.userPercent)}%` }} />
      </div>
      <div className="ml">
        <span>
          {t.signatureMedian} {outlier.catalogMedian.toFixed(0)}
        </span>
        <b>
          {t.signatureYou} {outlier.userPercent.toFixed(0)}
        </b>
      </div>
      <p>{note}</p>
    </article>
  );
}

function MatchCard({ visual, kicker, compatibility, name, tags, description }: {
  visual: ReactNode;
  kicker: string;
  compatibility: number;
  name: string;
  tags: string[];
  description: string;
}) {
  return (
    <article className="mc">
      {visual}
      <div>
        <div className="tags">
          <span className="tag tc">{kicker}</span>
          <span className="tag ts">
            {Math.round(compatibility)}% {t.matchWord}
          </span>
        </div>
        <h3>{name}</h3>
        <div className="tags">
          {tags.map((tag) => (
            <span className="tag tn" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p>{description}</p>
      </div>
    </article>
  );
}

function countryCaption(match: CountryMatch): string {
  return match.historical && match.period ? match.period : match.category;
}

function CountryBlock({ label, match, dimensions, distant }: {
  label: string;
  match: CountryMatch;
  dimensions?: CountryDimensionMatch[];
  distant?: CountryMatch[];
}) {
  return (
    <>
      <div className="sub-h">
        <span>{label}</span>
      </div>
      <MatchCard
        visual={<Img className="fl-b" src={resolveCountryFlagSrc(match.flagPath)} name={match.name} />}
        kicker={t.countryKicker}
        compatibility={match.compatibility}
        name={match.name}
        tags={[match.category, match.historical ? match.period : ''].filter((tag): tag is string => Boolean(tag))}
        description={match.description}
      />
      {dimensions && dimensions.length > 0 && (
        <>
          <p className="lbl">{t.report.alsoClose}</p>
          <ul className="dims">
            {dimensions.map(({ dimension, match: item }) => (
              <li className="dc" key={dimension}>
                <Img className="fl-s" src={resolveCountryFlagSrc(item.flagPath)} name={item.name} />
                <span className="dim">{t.dimensionLabels[dimension]}</span>
                <b>{item.name}</b>
                <small>{countryCaption(item)}</small>
                <strong>{Math.round(item.compatibility)}%</strong>
              </li>
            ))}
          </ul>
        </>
      )}
      {distant && distant.length > 0 && (
        <FarList
          title={t.countriesDistantTitle}
          items={distant.map((item) => ({ key: item.countryId, name: item.name, caption: countryCaption(item), value: item.compatibility }))}
        />
      )}
    </>
  );
}

function FarList({ title, items }: {
  title: string;
  items: { key: string; name: string; caption?: string; value: number }[];
}) {
  return (
    <>
      <p className="lbl">{title}</p>
      <ul className="fars">
        {items.map((item) => (
          <li className="fr" key={item.key}>
            <div>
              <b>{item.name}</b>
              {item.caption && <small>{item.caption}</small>}
            </div>
            <span>{Math.round(item.value)}%</span>
          </li>
        ))}
      </ul>
    </>
  );
}
