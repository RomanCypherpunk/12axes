import type { CSSProperties } from 'react';
import { t } from '../../../i18n';
import type { Axis, AxisResult, CountryMatch, GovernmentSeat, PersonalityMatch, ReportPreview, TimelineEra } from '../../../types/quiz';
import { catStyle } from '../../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../../utils/personalityImage';
import { SafeImg } from '../../editorial/primitives';
import { Portrait } from '../PersonalitiesSection';
import { UnlockButton } from '../UnlockButton';
import { AxisRowView, axisContext } from './AxisAnalysisPanel';
import { GovernmentScene, ORDER, seatPosition, type SeatKey } from './GovernmentPanel';
import { P } from './premiumText';
import { viewOf } from './TimelinePanel';

// O convite da compra mostra cada seção do relatório pago com o MESMO layout da página paga, mas só com o começo: o que é de graça
// fica nítido e o resto vira um desfoque com o botão que abre a compra. O que está desfocado são formas genéricas, sem nenhum dado.

interface AxisPreviewProps {
  preview: ReportPreview;
  axes: Axis[];
  results: Map<string, AxisResult>;
  /** O país e a personalidade mais compatíveis, do resultado gratuito: de onde vêm a bandeira e o retrato das marcas. */
  country: CountryMatch;
  personality: PersonalityMatch;
}

/** O eixo mais forte como a página paga o mostra (trilha com as marcas, polos e ícones), mas do texto só o começo: o resto some num desfoque diagonal. */
export function AxisPreviewRow({ preview, axes, results, country, personality }: AxisPreviewProps) {
  const axis = axes.find((candidate) => candidate.id === preview.analysis.axisId);
  if (!axis) return null;
  const ctx = axisContext({ disagreements: preview.profiles, countries: [country], personalities: [personality] });
  const text = preview.analysis.text;

  return (
    <ol className="e-cp-axes e-prem-axes e-pw-axis-preview">
      <AxisRowView item={preview.analysis} axis={axis} result={results.get(axis.id)} ctx={ctx}>
        {text && (
          <div className="e-pw-fade">
            <p className="e-pw-fade-start">{text}</p>
            <div className="e-pw-fade-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </AxisRowView>
    </ol>
  );
}

interface DisagreePreviewProps {
  preview: ReportPreview;
  /** A personalidade mais compatível, do resultado gratuito: de onde vem a foto. */
  personality: PersonalityMatch;
  onUnlock: () => void;
}

/** "Onde você mais discorda": a personalidade com a foto, a etiqueta e o nome iguais aos da página paga, e o cartão ao lado desfocado com o botão. */
export function DisagreePreview({ preview, personality, onUnlock }: DisagreePreviewProps) {
  const item = preview.profiles.find((profile) => profile.kind === 'personality');
  if (!item) return null;

  return (
    <section className="e-panel e-prem e-pw-sec" data-reveal>
      <div className="e-sec-head">
        <h2 className="e-sec-title">{P.disagreeTitle}</h2>
        <p className="e-mleg" aria-hidden="true">
          <span>
            <i className="e-k-m" />
            {P.disagreeLegendProfile}
          </span>
          <span>
            <i className="e-k-y" />
            {P.positions.you}
          </span>
        </p>
      </div>

      <div className="e-prem-gap-group" style={catStyle(item.ideologyCategory) as CSSProperties}>
        <aside className="e-prem-gap-who has-photo">
          <SafeImg
            className="e-prem-gap-photo"
            src={resolvePersonalityImageSrc(personality.imagePath)}
            alt={t.portraitAlt(item.profileName)}
            fallback={personalityInitials(item.profileName)}
          />
          <span className="e-tag e-tag-white">{P.disagreeKinds.personality}</span>
          <div className="e-prem-gap-name">
            <strong>{item.profileName}</strong>
          </div>
        </aside>

        <div className="e-pw-lockbox">
          {/* Só a forma do cartão da página paga, com posições inventadas e tudo desfocado. */}
          <article className="e-dcard e-strong e-prem-gap-card e-pw-blurred" aria-hidden="true">
            <div className="e-dcard-head">
              <span className="e-tag e-tag-white">{P.gapRank(1)}</span>
              <span className="e-pw-bar e-pw-line e-pw-short" />
            </div>
            <div className="e-dcard-body">
              <span className="e-pw-bar e-pw-big" />
              <span className="e-pw-bar e-pw-line" />
            </div>
            <div className="e-mbar">
              <span className="e-mtrack" />
              <span className="e-mfill" style={{ left: '30%', width: '34%' }} />
              <span className="e-mmed" style={{ left: '30%' }} />
              <span className="e-myou e-strong" style={{ left: '64%' }} />
            </div>
          </article>
          <UnlockButton onClick={onUnlock} label={t.paywallBlockCta.disagree} />
        </div>
      </div>
    </section>
  );
}

interface GovernmentPreviewProps {
  preview: ReportPreview;
  onUnlock: () => void;
}

/** "Seu governo ideal": a mesa com as nove cadeiras como na página paga, só o líder e o vice com rosto e o resto desfocado, com o botão. */
export function GovernmentPreview({ preview, onUnlock }: GovernmentPreviewProps) {
  const byKey = new Map<SeatKey, GovernmentSeat>(preview.government.map((seat) => [seat.seatKey, seat]));
  const category = preview.profiles.find((profile) => profile.kind === 'ideology')?.ideologyCategory ?? '';

  return (
    <section className="e-panel e-prem e-pw-sec" data-reveal>
      <h2>{P.governmentTitle}</h2>
      <GovernmentScene
        category={category}
        seat={(key, face, side) => {
          const seat = byKey.get(key);
          if (seat) {
            return (
              <button key={key} type="button" className={`e-gov-seat e-gov-${side}`} style={seatPosition(face)} onClick={onUnlock}>
                <Portrait match={seat.holder} className="e-gov-face" />
                <span className="e-gov-label">
                  <span className="e-gov-name">{seat.holder.name}</span>
                  <span className="e-gov-role">{P.seats[key]}</span>
                </span>
              </button>
            );
          }
          return (
            <span key={key} className={`e-gov-seat e-gov-${side} e-pw-blurred`} style={seatPosition(face)} aria-hidden="true">
              <span className="e-gov-face e-pw-blurface" />
              <span className="e-gov-label">
                <span className="e-pw-bar e-pw-line" />
                <span className="e-pw-bar e-pw-line e-pw-short" />
              </span>
            </span>
          );
        }}
      >
        <UnlockButton onClick={onUnlock} label={t.paywallBlockCta.government} className="e-pw-gov-btn" />
      </GovernmentScene>

      {/* No celular os nomes não cabem em volta da mesa: lista com o cargo e o nome, e os outros cargos desfocados. */}
      <ul className="e-gov-mlist">
        {ORDER.filter((key) => byKey.has(key)).map((key) => {
          const seat = byKey.get(key) as GovernmentSeat;
          return (
            <li key={key}>
              <button type="button" onClick={onUnlock}>
                <Portrait match={seat.holder} className="e-gov-mface" />
                <span>
                  <b>{seat.holder.name}</b>
                  <small>{P.seats[key]}</small>
                </span>
              </button>
            </li>
          );
        })}
        {ORDER.filter((key) => !byKey.has(key)).map((key) => (
          <li key={key} className="e-pw-blurred" aria-hidden="true">
            <span className="e-gov-mface e-pw-blurface" />
            <span>
              <span className="e-pw-bar e-pw-line" />
              <small>{P.seats[key]}</small>
            </span>
          </li>
        ))}
        <li className="e-pw-gov-mbtnli">
          <UnlockButton onClick={onUnlock} label={t.paywallBlockCta.government} className="e-pw-gov-mbtn" />
        </li>
      </ul>
    </section>
  );
}

// As eras na ordem da linha do tempo. A primeira vem do servidor; as outras só existem como forma, cada vez mais desfocadas.
const ERA_ORDER: TimelineEra['key'][] = ['antiguidade', 'medieval', 'moderna', 'xix', 'xx', 'xxi'];
// O convite mostra so tres eras (a primeira de verdade e duas desfocadas): a seção inteira tem seis e ficaria longa demais, principalmente no celular.
const PREVIEW_ERAS = 3;

interface TimelinePreviewProps {
  preview: ReportPreview;
  onUnlock: () => void;
}

/** "Sua linha do tempo ideológica": a primeira era (Antiguidade) como na página paga e as outras desfocadas, mais e mais conforme descem, com o botão. */
export function TimelinePreview({ preview, onUnlock }: TimelinePreviewProps) {
  const first = preview.timeline[0];
  if (!first) return null;

  return (
    <section className="e-panel e-prem e-tl e-pw-sec" data-reveal>
      <h2>{P.timelineTitle}</h2>
      <ol className="e-tl-eras">
        <li className="e-tl-era">
          <div className="e-tl-head">
            <h3>{P.timelineEraNames[first.key]}</h3>
            <p>{P.timelineRange(first.fromYear, first.toYear)}</p>
          </div>
          <ul className="e-tl-list">
            {first.highlights.map((entry) => {
              const view = viewOf(entry);
              if (!view) return null;
              return (
                <li key={view.key}>
                  <button type="button" className="e-tl-item" onClick={onUnlock}>
                    {view.photo}
                    <span className="e-tl-text">
                      <strong>{view.name}</strong>
                      <small>{view.date}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
        {ERA_ORDER.slice(1, PREVIEW_ERAS).map((key, index) => (
          <li
            key={key}
            className="e-tl-era e-pw-tl-era"
            style={{ '--b': `${3 + index * 2}px`, '--o': String(Math.max(0.45, 0.85 - index * 0.1)) } as CSSProperties}
          >
            <div className="e-tl-head" aria-hidden="true">
              <h3>{P.timelineEraNames[key]}</h3>
              <span className="e-pw-bar e-pw-line e-pw-short" />
            </div>
            <ul className="e-tl-list" aria-hidden="true">
              {[0, 1].map((slot) => (
                <li key={slot}>
                  <span className="e-tl-item">
                    <span className="e-tl-photo e-pw-blurface" />
                    <span className="e-tl-text">
                      <span className="e-pw-bar e-pw-line" />
                      <span className="e-pw-bar e-pw-line e-pw-short" />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {index === 0 && <UnlockButton onClick={onUnlock} label={t.paywallBlockCta.timeline} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
