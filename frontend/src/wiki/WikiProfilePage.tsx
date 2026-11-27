import type { CSSProperties, ReactNode } from 'react';
import { t } from '../i18n';
import type { Axis, AxisResult, QuizResult } from '../types/quiz';
import { SafeImg } from '../components/editorial/primitives';
import { AreasSection } from '../components/results/AreasSection';
import { AxesSection } from '../components/results/AxesSection';
import { CountriesSection } from '../components/results/CountriesSection';
import { IdeologiesSection } from '../components/results/IdeologiesSection';
import { PartiesSection } from '../components/results/PartiesSection';
import { PersonalitiesSection } from '../components/results/PersonalitiesSection';
import { PoliticalCompassSection } from '../components/results/PoliticalCompassSection';
import { PoliticalValuesSection } from '../components/results/PoliticalValuesSection';
import { ResultsNav } from '../components/results/ResultsNav';
import { SignatureSection } from '../components/results/SignatureSection';
import { resolveCountryFlagSrc } from '../utils/countryFlags';
import { resolvePartyLogoSrc } from '../utils/partyLogos';
import { catStyle } from '../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../utils/personalityImage';
import { compassFromVector } from '../utils/politicalCompass';
import type { Religion } from '../utils/religion';
import type { WikiKind, WikiText } from './strings';

export interface WikiTag {
  label: string;
  solid?: boolean;
}

export interface WikiImage {
  src: string;
  alt: string;
  /** Foto (preenche o espaço) ou bandeira/logo (inteiro, sem cortar). */
  fit: 'cover' | 'contain';
  credit: string;
  creditUrl: string;
}

/** O perfil da página: personalidade, ideologia, país ou partido. */
export interface WikiSubject {
  kind: WikiKind;
  id: string;
  name: string;
  tags: WikiTag[];
  description: string;
  /** Frase da ideologia, no cartão "Em uma frase" abaixo do cabeçalho. */
  phrase?: string;
  /** Título do cartão da frase e a nota abaixo dela ([antes, nome, depois]). */
  phraseTitle?: string;
  phraseNote?: [string, string, string];
  /** Sem imagem (ideologias), o cabeçalho ocupa a largura toda. */
  image?: WikiImage;
  /** Categoria e id da ideologia que dão a cor da página (a da própria ideologia, nas ideologias). */
  colorCategory?: string;
  colorIdeologyId?: string;
  compareHref: string;
  quizHref: string;
  /** Prefixo do idioma nos links ("" em pt, "/en"...). */
  prefix: string;
}

export interface WikiProfileProps {
  subject: WikiSubject;
  result: QuizResult;
  axes: Axis[];
  religion: Religion | null;
  text: WikiText;
}

// Ordem das seções pedida pelo autor (spec da reforma da wiki).
export const WIKI_SECTIONS = ['eixos-resultado', 'assinatura', 'paises', 'personalidades', 'areas', 'partidos', 'valores', 'bussola', 'ideologias'];

function NearCard({ href, label, name, visual, tint }: { href: string; label: string; name: string; visual?: ReactNode; tint?: CSSProperties }) {
  return (
    <li>
      <a className={tint ? 'e-dim-row e-wiki-tinted' : 'e-dim-row'} href={href} style={tint}>
        {visual}
        <div>
          <span className="e-dim">{label}</span>
          <strong>{name}</strong>
        </div>
      </a>
    </li>
  );
}

/** O perfil no lugar do "X" da bússola: foto redonda, bandeira, logo no quadrado branco; ideologia fica com o X. */
function compassFace(subject: WikiSubject): ReactNode {
  if (!subject.image) return undefined;
  const fallback = personalityInitials(subject.name);
  if (subject.kind === 'personality') {
    return <SafeImg className="e-compass-img e-wiki-mk-round" src={resolvePersonalityImageSrc(subject.image.src)} alt="" fallback={fallback} />;
  }
  if (subject.kind === 'country') {
    return <SafeImg className="e-compass-img e-wiki-mk-flag" src={resolveCountryFlagSrc(subject.image.src)} alt="" fallback={fallback} />;
  }
  return <SafeImg className="e-compass-img e-wiki-mk-logo" src={resolvePartyLogoSrc(subject.image.src)} alt="" fallback={fallback} />;
}

export function WikiProfilePage({ subject, result, axes, religion, text }: WikiProfileProps) {
  const top = result.topMatch;
  const results = new Map<string, AxisResult>(result.axes.map((axis) => [axis.axisId, axis]));
  const vector = Object.fromEntries(result.axes.map((axis) => [axis.axisId, axis.leftPercent]));
  const compass = compassFromVector(vector);
  const closest = result.topPersonalityMatch;
  const country = result.topCountryMatch;
  const p = subject.prefix;
  const pageColor = catStyle(subject.colorCategory ?? top.category, subject.colorIdeologyId ?? top.ideologyId) as CSSProperties;

  const spectrumCard = (
    <NearCard key="spectrum" href={`${p}/ideologies`} label={text.nearestSpectrum} name={top.category} tint={catStyle(top.category) as CSSProperties} />
  );
  const ideologyCard = (
    <NearCard
      key="ideology"
      href={`${p}/ideologies/${top.ideologyId}`}
      label={text.nearestIdeology}
      name={top.name}
      tint={catStyle(top.category, top.ideologyId) as CSSProperties}
    />
  );
  const personCard = closest && (
    <NearCard
      key="person"
      href={`${p}/personalities/${closest.personalityId}`}
      label={text.nearestPerson}
      name={closest.name}
      visual={<SafeImg className="e-wiki-face" src={resolvePersonalityImageSrc(closest.imagePath)} alt="" fallback={personalityInitials(closest.name)} />}
    />
  );
  const countryCard = (
    <NearCard
      key="country"
      href={`${p}/countries/${country.countryId}`}
      label={text.nearestCountry}
      name={country.name}
      visual={<SafeImg className="e-wiki-flag" src={resolveCountryFlagSrc(country.flagPath)} alt="" fallback="" />}
    />
  );
  // Numa ideologia o espectro é o da própria ideologia; no lugar dele entra o país mais próximo.
  const nearCards = subject.kind === 'ideology' ? [ideologyCard, personCard, countryCard] : [spectrumCard, ideologyCard, personCard];

  return (
    <main className="ed e-res e-wiki" style={pageColor}>
      <div className="e-wrap">
        {subject.kind === 'ideology' ? (
          // Ideologia, como na versão anterior da wiki: duas colunas (texto | mais próximos) e a frase num cartão abaixo.
          <>
            <article className="e-panel e-wiki-hero e-wiki-ideo">
              <div className="e-wiki-hero-text">
                {subject.tags[0] && (
                  <p className="e-wiki-tags">
                    <span className="e-tag e-tag-solid">{subject.tags[0].label}</span>
                  </p>
                )}
                <h1>{subject.name}</h1>
                <p className="e-wiki-desc">{subject.description}</p>
                <a className="e-btn e-btn-primary e-wiki-compare" href={subject.compareHref}>
                  {text.compare}
                </a>
              </div>
              <aside className="e-wiki-ideo-side">
                <ul className="e-wiki-near">{nearCards}</ul>
              </aside>
            </article>
            {subject.phrase && (
              <figure className="e-panel e-wiki-phrase-card">
                <span className="e-wiki-q" aria-hidden="true">“</span>
                <div>
                  {subject.phraseTitle && <p className="e-wiki-eyebrow">— {subject.phraseTitle}</p>}
                  <blockquote>{subject.phrase}</blockquote>
                  {subject.phraseNote && (
                    <figcaption>
                      {subject.phraseNote[0]}
                      <b>{subject.phraseNote[1]}</b>
                      {subject.phraseNote[2]}
                    </figcaption>
                  )}
                </div>
              </figure>
            )}
          </>
        ) : (
        <article className="e-panel e-wiki-hero">
          <div className="e-wiki-hero-text">
            <h1>{subject.name}</h1>
            {subject.tags.length > 0 && (
              <p className="e-wiki-tags">
                {subject.tags.map((tag) => (
                  <span key={tag.label} className={tag.solid ? 'e-tag e-tag-solid' : 'e-tag e-tag-neutral'}>
                    {tag.label}
                  </span>
                ))}
              </p>
            )}
            <p className="e-wiki-desc">{subject.description}</p>
            <ul className="e-wiki-near">{nearCards}</ul>
            <a className="e-btn e-btn-primary e-wiki-compare" href={subject.compareHref}>
              {text.compare}
            </a>
          </div>
          {subject.image && (
            <figure className={subject.image.fit === 'contain' ? 'e-wiki-photo e-wiki-emblem' : 'e-wiki-photo'}>
              <SafeImg className="e-wiki-img" src={subject.image.src} alt={subject.image.alt} fallback={personalityInitials(subject.name)} />
              {subject.image.credit && (
                <figcaption>
                  {subject.image.creditUrl ? (
                    <a href={subject.image.creditUrl} rel="noopener nofollow">
                      {subject.image.credit}
                    </a>
                  ) : (
                    subject.image.credit
                  )}
                </figcaption>
              )}
            </figure>
          )}
        </article>
        )}
      </div>
      <div className="e-wrap e-res-grid e-wiki-body">
        <div className="e-res-main">
          <AxesSection axes={axes} results={results} religion={religion} />

          <SignatureSection unusual={result.mostUnusualAxis} common={result.mostCommonAxis} tension={result.axisTension} axes={axes} results={results} />

          <CountriesSection
            current={result.topCountryMatch}
            historical={result.topHistoricalCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={[]}
            axes={axes}
            results={results}
          />

          <PersonalitiesSection top={result.topPersonalityMatch} dimensions={result.dimensionMatches} distant={[]} axes={axes} results={results} />

          <AreasSection generalMatches={result.personalityMatches} areaMatches={[]} axes={axes} results={results} areaLocked />

          {(result.topPartyMatches?.length ?? 0) > 0 && (
            <PartiesSection
              current={result.topPartyMatch}
              historical={result.topHistoricalPartyMatch}
              top={result.topPartyMatches ?? []}
              dimensions={result.partyDimensionMatches ?? []}
              distant={[]}
              axes={axes}
              results={results}
            />
          )}

          <PoliticalValuesSection values={result.politicalValues ?? []} category={top.category} ideologyId={top.ideologyId} religion={religion} />

          {compass && (
            <PoliticalCompassSection position={compass} category={top.category} ideologyId={top.ideologyId} moralAxis={axes.find((axis) => axis.id === 'moral')} face={compassFace(subject)} />
          )}

          <IdeologiesSection others={result.matches.slice(0, 3)} />

          <section className="e-wiki-cta">
            <div>
              <h2>{text.ctaTitle}</h2>
              <p>{text.ctaText(subject.name)}</p>
            </div>
            <a className="e-btn" href={subject.quizHref}>
              {text.ctaButton}
            </a>
          </section>
        </div>

        <aside className="e-side" aria-label={t.navOnThisPage}>
          <ResultsNav only={WIKI_SECTIONS.filter((id) => id !== 'partidos' || (result.topPartyMatches?.length ?? 0) > 0)} />
        </aside>
      </div>
    </main>
  );
}
