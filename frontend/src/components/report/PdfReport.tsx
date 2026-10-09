import type { CSSProperties, ReactNode } from 'react';
import { LANG, t } from '../../i18n';
import type {
  Axis,
  AxisOutlier,
  AxisResult,
  AxisTension,
  CountryDimensionMatch,
  CountryMatch,
  QuizResult
} from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { catStyle, ideologyColorByKey, localCatStyle } from '../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import type { Religion } from '../../utils/religion';
import { PoleIcon } from '../AxisIcon';
import { pct } from '../editorial/primitives';
import { axisLeaning, displayRank } from '../results/AxesSection';
import { AmazonIcon } from '../results/BooksSection';
import { COMPASS_GRID_CELLS, compassClamp, compassView } from '../results/PoliticalCompassSection';
import { commonNote, unusualLead } from '../results/SignatureSection';
import { computeCompass, type CompassPosition } from '../../utils/politicalCompass';

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
  const compass = computeCompass(axisResults);
  const sections = [
    t.axesSectionTitle,
    t.signatureTitle,
    t.countriesSectionTitle,
    t.personalitiesSectionTitle,
    ...(result.personalityMatches.length > 0 ? [t.areasGeneralTitle] : []),
    ...(books.length > 0 ? [t.booksTitle] : []),
    t.otherMatches,
    ...(compass ? [t.compassTitle] : [])
  ];
  const today = new Date().toLocaleDateString(LANG === 'pt' ? 'pt-BR' : 'en-US', {
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
            <Ring value={top.compatibility} size={132} stroke={6} />
          </div>
          <p className="cv-desc">
            {top.longDescription || top.description}
          </p>
        </div>
        <div className="cv-body">
          {top.phrase && <Quote phrase={top.phrase} />}
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
          <SectionHead title={t.axesSectionTitle} />
          <ul className="axes">
            {[...axes]
              .sort((first, second) => displayRank(first.id) - displayRank(second.id))
              .map((axis) => {
                const axisResult = axisResults.get(axis.id);
                return axisResult ? <AxisRow key={axis.id} axis={axis} result={axisResult} religion={religion} /> : null;
              })}
          </ul>
        </section>

        <section className="rp-sec">
          <SectionHead title={t.signatureTitle} />
          <div className="dist">
            <SignatureCard outlier={result.mostUnusualAxis} strong label={t.signatureUnusualLabel} axisResults={axisResults} />
            <SignatureCard outlier={result.mostCommonAxis} strong={false} label={t.signatureCommonLabel} axisResults={axisResults} />
            {result.axisTension && <TensionBlock tension={result.axisTension} axes={axes} axisResults={axisResults} />}
          </div>
        </section>

        <section className="rp-sec">
          <SectionHead title={t.countriesSectionTitle} />
          <CountryBlock
            label={t.countryCurrentTab}
            match={result.topCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={result.bottomCountryMatches}
          />
        </section>
        <section className="rp-sec">
          <p className="cont">
            {t.countriesSectionTitle} ({t.report.continued})
          </p>
          <CountryBlock label={t.countryHistoricalTab} match={result.topHistoricalCountryMatch} />
        </section>

        <section className="rp-sec">
          <SectionHead title={t.personalitiesSectionTitle} />
          <MatchCard
            visual={<Img className="av-b" src={resolvePersonalityImageSrc(result.topPersonalityMatch.imagePath)} name={result.topPersonalityMatch.name} />}
            compatibility={result.topPersonalityMatch.compatibility}
            name={result.topPersonalityMatch.name}
            tags={[result.topPersonalityMatch.role, result.topPersonalityMatch.lifespan].filter(Boolean)}
            description={result.topPersonalityMatch.description}
          />
          <p className="lbl">{t.dimensionsTitleShort}</p>
          <ul className="dims">
            {result.dimensionMatches.map(({ dimension, match }) => (
              <li className="dc" key={dimension}>
                <Img className="av-s" src={resolvePersonalityImageSrc(match.imagePath)} name={match.name} />
                <span className="dim">{t.dimensionLabels[dimension]}</span>
                <b>{match.name}</b>
                <strong>{Math.round(match.compatibility)}%</strong>
              </li>
            ))}
          </ul>
          <FarList
            title={t.personalitiesDistantTitle}
            items={result.bottomPersonalityMatches.map((match) => ({ key: match.personalityId, name: match.name, caption: match.role }))}
          />
        </section>

        {result.personalityMatches.length > 0 && (
          <section className="rp-sec">
            <SectionHead title={t.areasGeneralTitle} />
            <ol className="rank">
              {result.personalityMatches.map((match, index) => (
                <li className="rk" key={match.personalityId}>
                  <span className="rk-n">{String(index + 1).padStart(2, '0')}</span>
                  <Img className="av-m" src={resolvePersonalityImageSrc(match.imagePath)} name={match.name} />
                  <div className="rk-i">
                    <b>{match.name}</b>
                    <small>{t.personalityCategories[match.category]}</small>
                    <div className="bar">
                      <i style={{ width: `${Math.max(0, Math.min(100, match.compatibility))}%` }} />
                    </div>
                  </div>
                  <strong>{Math.round(match.compatibility)}%</strong>
                </li>
              ))}
            </ol>
          </section>
        )}

        {books.length > 0 && (
          <section className="rp-sec">
            <SectionHead title={t.booksTitle} />
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
                  <a className="bk-btn" href={book.url} target="_blank" rel="sponsored noopener noreferrer">
                    {t.booksCta} <AmazonIcon />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rp-sec">
          <SectionHead title={t.otherMatches} />
          <ul className="others">
            {others.map((match) => (
              <li className="oc" key={match.ideologyId} style={localCatStyle(match.category) as CSSProperties}>
                <span className="tag osol">{match.category}</span>
                <h3>{match.name}</h3>
                <p>{match.longDescription || match.description}</p>
              </li>
            ))}
          </ul>
          <div className="far-i" style={localCatStyle(result.bottomIdeologyMatch.category) as CSSProperties}>
            <span className="lab">{t.ideologyDistantTitle}</span>
            <b>{result.bottomIdeologyMatch.name}</b>
            <span className="tag osol-l">{result.bottomIdeologyMatch.category}</span>
            <p>{result.bottomIdeologyMatch.longDescription || result.bottomIdeologyMatch.description}</p>
          </div>
        </section>

        {compass && (
          <section className="rp-sec">
            <SectionHead title={t.compassTitle} />
            <Compass position={compass} category={top.category} moralAxis={axes.find((axis) => axis.id === 'moral')} />
          </section>
        )}

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

function Compass({ position, category, moralAxis }: { position: CompassPosition; category: string; moralAxis?: Axis }) {
  const { right, authoritarian, traditional } = position;
  const { spectrum, centerSideKey, centerLabel, markerColor, social, stripCells, socialColor } = compassView(
    position,
    category,
    moralAxis
  );
  const spectrumLabel = centerSideKey ? centerLabel : t.compassSpectrumLabels[spectrum.key];
  const spectrumColor = centerSideKey ? ideologyColorByKey(centerSideKey).base : spectrum.base;
  return (
    <div className="cmp">
      <div className="cmp-chart">
        <span className="cmp-lbl cmp-top">{t.compassAuthoritarian}</span>
        <span className="cmp-lbl cmp-left">{t.compassLeft}</span>
        <div className="cmp-grid">
          {COMPASS_GRID_CELLS.map((color, index) => (
            <span key={index} style={{ background: color }} />
          ))}
          <i className="cmp-axis cmp-x" />
          <i className="cmp-axis cmp-y" />
          <CompassX left={right} top={100 - authoritarian} color={markerColor ?? 'var(--cat)'} />
        </div>
        <span className="cmp-lbl cmp-right">{t.compassRight}</span>
        <span className="cmp-lbl cmp-bottom">{t.compassLibertarian}</span>
      </div>
      <div className="cmp-read">
        <p className="cmp-sentence">
          <span style={{ color: spectrumColor }}>{spectrumLabel}</span> <span className="cmp-conn">{t.compassWith}</span>{' '}
          <mark style={{ background: socialColor }}>{t.compassSocialLabels[social]}</mark>
          {t.compassSocialValues && <span className="cmp-conn"> {t.compassSocialValues}</span>}
        </p>
        <div className="cmp-bar-lbls">
          <span>{t.compassProgressive}</span>
          <span>{t.compassTraditionalist}</span>
        </div>
        <div className="cmp-strip">
          {stripCells.map((color, index) => (
            <span key={index} style={{ background: color }} />
          ))}
          <CompassX left={traditional} color={socialColor} />
        </div>
      </div>
    </div>
  );
}

function CompassX({ left, top, color }: { left: number; top?: number; color: string }) {
  return (
    <span
      className="cmp-mark"
      style={{ left: `${compassClamp(left)}%`, top: top === undefined ? '50%' : `${compassClamp(top)}%`, background: color }}
    >
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

function formatPct(value: number, decimals: number): string {
  return `${value.toLocaleString(LANG === 'pt' ? 'pt-BR' : 'en-US', {
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

function Quote({ phrase }: { phrase: string }) {
  return (
    <figure className="quote">
      <span className="q">“</span>
      <div>
        <p className="eb">{t.phraseTitle}</p>
        <blockquote>{phrase}</blockquote>
      </div>
    </figure>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="sh">
      <h2>{title}</h2>
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
  const winnerPct = pct(rightWins ? result.rightPercent : result.leftPercent);
  const dotAt = Math.max(0, Math.min(100, result.rightPercent));
  return (
    <li className="ax" style={style}>
      <div className="ax-h">
        <b>{result.label}</b>
        <span className="ax-v">{balanced ? result.intensity : `${winnerPct}% ${result.dominantPole}`}</span>
      </div>
      <div className="tr">
        <i className="fill" style={{ left: `${Math.min(dotAt, 50)}%`, width: `${Math.abs(dotAt - 50)}%` }} />
        <span className="mid" />
        <span className="dot" style={{ left: `${dotAt}%` }} />
      </div>
      <div className="ax-e">
        <div className={leftWins ? 'pl l win' : 'pl l'}>
          <PoleIcon axisId={axis.id} side="left" className="ico" />
          <span>{result.leftPole}</span>
        </div>
        <div className={rightWins ? 'pl r win' : 'pl r'}>
          <span>{result.rightPole}</span>
          <PoleIcon axisId={axis.id} side="right" className="ico" religion={religion} />
        </div>
      </div>
    </li>
  );
}

function SignatureCard({ outlier, strong, label, axisResults }: {
  outlier: AxisOutlier;
  strong: boolean;
  label: string;
  axisResults: Map<string, AxisResult>;
}) {
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  // O backend manda % do polo esquerdo; a regua tem o polo esquerdo na ponta esquerda.
  const median = clamp(100 - outlier.catalogMedian);
  const you = clamp(100 - outlier.userPercent);
  const axisResult = axisResults.get(outlier.axisId);

  let big = '';
  let cap: string;
  if (strong) {
    big = outlier.balanced ? '' : String(outlier.abovePercent >= 99.5 ? 100 : Math.round(outlier.abovePercent));
    cap = outlier.balanced ? unusualLead(outlier) : t.signatureBigCap(outlier.abovePole);
  } else {
    big = outlier.balanced ? t.signatureAtCentre : t.signatureAtMedian;
    cap = commonNote(outlier);
  }

  return (
    <article className={strong ? 'dcard s' : 'dcard'}>
      <div className="dc-h">
        <span className={strong ? 'tag tw' : 'tag tc'}>{label}</span>
        <h3>{outlier.label}</h3>
      </div>
      <div className="dc-b">
        {big && (
          <p className="big">
            {big}
            {strong && <small>%</small>}
          </p>
        )}
        <p className="cap">{cap}</p>
      </div>
      <div className="mbar">
        <span className="mfill" style={{ left: `${Math.min(median, you)}%`, width: `${Math.abs(you - median)}%` }} />
        <span className="mm" style={{ left: `${median}%` }} />
        <span className={strong ? 'my s' : 'my'} style={{ left: `${you}%` }} />
      </div>
      {axisResult && (
        <div className="ml">
          <span>{axisResult.leftPole}</span>
          <span>{axisResult.rightPole}</span>
        </div>
      )}
      <p className="mleg">
        <span>
          <i className="k-m" />
          {t.signatureMedian}
        </span>
        <span>
          <i className="k-y" />
          {t.signatureYou}
        </span>
      </p>
    </article>
  );
}

function TensionBlock({ tension, axes, axisResults }: {
  tension: AxisTension;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
}) {
  const colorOf = (axisLabel: string, pole: string): string | undefined => {
    const axis = axes.find((candidate) => axisResults.get(candidate.id)?.label === axisLabel);
    const axisResult = axis ? axisResults.get(axis.id) : undefined;
    if (!axis || !axisResult) {
      return undefined;
    }
    return axisResult.rightPole === pole ? axis.rightColor : axis.leftColor;
  };
  const hidden = tension.matchingIdeologies - tension.examples.length;
  return (
    <article className="tension">
      <div>
        <span className="tag tw">{t.tensionLabel}</span>
        <div className="pair">
          <span style={{ '--c': colorOf(tension.firstAxisLabel, tension.firstPole) } as CSSProperties}>{tension.firstPole}</span>
          <em>+</em>
          <span style={{ '--c': colorOf(tension.secondAxisLabel, tension.secondPole) } as CSSProperties}>{tension.secondPole}</span>
        </div>
      </div>
      <div>
        <p>
          {tension.matchingIdeologies === 0 ? (
            t.tensionUnique
          ) : (
            <b>{t.tensionRareShort(tension.matchingIdeologies, tension.catalogSize)}</b>
          )}
        </p>
        {tension.examples.length > 0 && (
          <ul className="chips">
            {tension.examples.map((name) => (
              <li key={name}>{name}</li>
            ))}
            {hidden > 0 && <li>+{hidden}</li>}
          </ul>
        )}
      </div>
    </article>
  );
}

function MatchCard({ visual, compatibility, name, tags, description }: {
  visual: ReactNode;
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
          <span className="tag tc">{t.matchTopKicker}</span>
          <span className="tag ts">
            {Math.round(compatibility)}% {t.matchWord}
          </span>
        </div>
        <h3>{name}</h3>
        {tags.length > 0 && <p className="mc-cap">{tags.join(' · ')}</p>}
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
        compatibility={match.compatibility}
        name={match.name}
        tags={[match.category, match.historical ? match.period : ''].filter((tag): tag is string => Boolean(tag))}
        description={match.description}
      />
      {dimensions && dimensions.length > 0 && (
        <>
          <p className="lbl">{t.dimensionsTitleShort}</p>
          <ul className="dims">
            {dimensions.map(({ dimension, match: item }) => (
              <li className="dc" key={dimension}>
                <Img className="fl-s" src={resolveCountryFlagSrc(item.flagPath)} name={item.name} />
                <span className="dim">{t.dimensionLabels[dimension]}</span>
                <b>{item.name}</b>
                <strong>{Math.round(item.compatibility)}%</strong>
              </li>
            ))}
          </ul>
        </>
      )}
      {distant && distant.length > 0 && (
        <FarList
          title={t.countriesDistantTitle}
          items={distant.map((item) => ({ key: item.countryId, name: item.name, caption: countryCaption(item) }))}
        />
      )}
    </>
  );
}

function FarList({ title, items }: {
  title: string;
  items: { key: string; name: string; caption?: string }[];
}) {
  return (
    <div className="far">
      <span className="lab">{title}</span>
      <ul className="fars">
        {items.map((item) => (
          <li className="fr" key={item.key}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
