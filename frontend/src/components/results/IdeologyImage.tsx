import { t } from '../../i18n';
import { IDEOLOGY_IMAGE_CREDITS, ideologyImageUrl } from '../../data/ideologyImages';
import type { IdeologyMatch } from '../../types/quiz';
import { MatchHero } from './parts';

/** Só http(s) vira link: a fonte vem do catálogo, mas um endereço estranho nunca deve ser clicável. */
export function safeSourceUrl(url: string): string | null {
  return /^https?:\/\//i.test(url) ? url : null;
}

/** "Fonte original" da imagem da ideologia (com autor e licença, quando há); nada sem crédito cadastrado. */
export function IdeologyImageSource({ ideologyId }: { ideologyId: string | undefined }) {
  const credit = ideologyId && ideologyImageUrl(ideologyId) ? IDEOLOGY_IMAGE_CREDITS[ideologyId] : undefined;
  const url = credit?.sourceUrl ? safeSourceUrl(credit.sourceUrl) : null;
  if (!credit || !url) {
    return null;
  }
  const text = [credit.author && `${t.ideologyImgAuthor}: ${credit.author}`, credit.license && `${t.ideologyImgLicense}: ${credit.license}`]
    .filter(Boolean)
    .join(' · ');
  return (
    <>
      {text && <span>{text} </span>}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {t.ideologyImgSource}
      </a>
    </>
  );
}

/**
 * Cartão do topo para uma ideologia que tem imagem (arquivo em src/assets/ideologies/, nome = id da ideologia): o mesmo cartão
 * dos países, com a imagem no lugar da bandeira, o selo do espectro, o match, a frase e o "Saber mais". As sem imagem usam o
 * cartão de sempre (ResultsScreen).
 */
export function IdeologyHero({ match }: { match: IdeologyMatch }) {
  const src = ideologyImageUrl(match.ideologyId);
  if (!src) {
    return null;
  }
  return (
    <MatchHero
      className="e-ideology-hero"
      visual={<img className="e-flagbig" src={src} alt={match.name} decoding="async" />}
      compatibility={match.compatibility}
      name={match.name}
      tags={[]}
      subtitle={<span className="e-tag e-tag-solid">{match.category}</span>}
      kickerPrefix={<span className="e-tag e-tag-solid">{match.category}</span>}
      intro={
        match.phrase ? (
          <figure className="e-phrase">
            <span className="e-q" aria-hidden="true">“</span>
            <div>
              <blockquote>{match.phrase}</blockquote>
            </div>
          </figure>
        ) : undefined
      }
      description={match.longDescription || match.description}
      note={<IdeologyImageSource ideologyId={match.ideologyId} />}
    />
  );
}
