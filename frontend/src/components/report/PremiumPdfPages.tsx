import type { CSSProperties, ReactNode } from 'react';
import type { Axis, AxisResult, PremiumReport } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { catStyle, resolveIdeologyColor } from '../../utils/ideologyColors';
import { resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { CENTER, ORDER, place, TABLE_R } from '../results/premium/GovernmentPanel';
import { P } from '../results/premium/premiumText';
import { bestTimelineEra, eraCompatibility, eraHighlights, timelineEntryInfo } from '../results/premium/TimelinePanel';
import { Img, PageHeader, Ring, SectionHead } from './pdfParts';

interface PremiumPdfPagesProps {
  premium: PremiumReport;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
  topName: string;
  /** O fechamento ("Sobre este relatório"): fecha a última página. */
  closing: ReactNode;
}

const colorOf = (category: string | undefined): string => resolveIdeologyColor(category ?? '').base;

// Posição na trilha: o polo esquerdo fica à esquerda e quanto maior o % do polo esquerdo, mais perto dele.
const at = (leftPercent: number): string => `${Math.max(0, Math.min(100, 100 - leftPercent))}%`;

function sideOf(leftPercent: number, result: AxisResult | undefined): { pct: number; pole: string } {
  const left = leftPercent >= 50;
  return { pct: Math.max(leftPercent, 100 - leftPercent), pole: result ? (left ? result.leftPole : result.rightPole) : '' };
}

function Page({ topName, title, sub, children }: { topName: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <div className="rp-page rx-page">
      <PageHeader topName={topName} />
      <section className="rp-sec rx-sec">
        <SectionHead title={title} />
        {sub && <p className="intro">{sub}</p>}
        {children}
      </section>
    </div>
  );
}

/**
 * O Relatório completo no PDF, no mesmo padrão das outras seções: uma página por seção, com o visual da tela traduzido
 * para o papel. Só entra no PDF de quem tem acesso.
 */
export function PremiumPdfPages({ premium, axes, axisResults, topName, closing }: PremiumPdfPagesProps) {
  const ideology = premium.disagreements.find((item) => item.kind === 'ideology');
  const personality = premium.disagreements.find((item) => item.kind === 'personality');
  const country = premium.disagreements.find((item) => item.kind === 'country');
  const youColor = colorOf(ideology?.ideologyCategory);
  const personalityPhoto = resolvePersonalityImageSrc(premium.personalitiesByArea.find((m) => m.personalityId === personality?.profileId)?.imagePath ?? '');
  const countryFlag = resolveCountryFlagSrc(premium.topCountries.find((c) => c.countryId === country?.profileId)?.flagPath ?? '');
  const analysis = premium.axisAnalysis.filter((item) => axes.some((axis) => axis.id === item.axisId));
  const half = Math.ceil(analysis.length / 2);
  const bestEra = bestTimelineEra(premium.timeline);
  const topCountry = premium.topCountries[0];

  const axisPage = (items: typeof analysis, part: number) => (
    <Page topName={topName} title={P.axisTitle} sub={`${part}/2`}>
      <ul className="rx-axes">
        {items.map((item) => {
          const result = axisResults.get(item.axisId);
          return (
            <li className="rx-ax" key={item.axisId}>
              <div className="rx-ax-h">
                <b>{item.label}</b>
                <span style={{ color: youColor }}>
                  {result && item.side !== 'balanced' ? `${result.dominantPole} · ` : ''}
                  {P.levelLabels[item.level]}
                </span>
              </div>
              <div className="rx-track">
                <i className="rx-mid" />
                {item.countryLeftPercent !== null && country && (
                  <span className="rx-pin" style={{ left: at(item.countryLeftPercent), '--pc': colorOf(country.ideologyCategory) } as CSSProperties}>
                    <Img className="rx-pin-img" src={countryFlag} name={country.profileName} />
                  </span>
                )}
                {item.personalityLeftPercent !== null && personality && (
                  <span className="rx-pin" style={{ left: at(item.personalityLeftPercent), '--pc': colorOf(personality.ideologyCategory) } as CSSProperties}>
                    <Img className="rx-pin-img" src={personalityPhoto} name={personality.profileName} />
                  </span>
                )}
                <span className="rx-pin rx-you" style={{ left: at(item.userLeftPercent), '--pc': youColor } as CSSProperties}>
                  {P.positions.you}
                </span>
              </div>
              {result && (
                <div className="rx-poles">
                  <span className={item.side === 'left' ? 'on' : undefined}>{result.leftPole}</span>
                  <span className={item.side === 'right' ? 'on' : undefined}>{result.rightPole}</span>
                </div>
              )}
              {item.text && <p className="rx-t">{item.text}</p>}
            </li>
          );
        })}
      </ul>
    </Page>
  );

  return (
    <>
      {axisPage(analysis.slice(0, half), 1)}
      {axisPage(analysis.slice(half), 2)}

      <Page topName={topName} title={P.disagreeTitle}>
        <div className="rx-dis">
          {premium.disagreements.map((item) => {
            const photo =
              item.kind === 'personality'
                ? personalityPhoto
                : item.kind === 'country'
                  ? countryFlag
                  : '';
            return (
              <article className="rx-dis-card" key={item.kind} style={catStyle(item.ideologyCategory) as CSSProperties}>
                <header>
                  {photo ? <Img className={item.kind === 'country' ? 'rx-dis-flag' : 'rx-dis-photo'} src={photo} name={item.profileName} /> : null}
                  <div>
                    <span className="tag ts">{P.disagreeKinds[item.kind]}</span>
                    <h3>{item.profileName}</h3>
                  </div>
                </header>
                <ul>
                  {item.axes.slice(0, 3).map((axis, index) => {
                    const result = axisResults.get(axis.axisId);
                    const you = sideOf(axis.userLeftPercent, result);
                    const profile = sideOf(axis.profileLeftPercent, result);
                    return (
                      <li key={axis.axisId}>
                        <span className="rx-rank">{P.gapRank(index + 1)}</span>
                        <b className="rx-axis-name">{axis.label}</b>
                        <p className="rx-big">
                          {Math.round(Math.abs(axis.difference))}
                          <small>pts</small>
                        </p>
                        <div className="rx-mbar">
                          <i className="rx-mfill" style={{ left: `min(${at(axis.userLeftPercent)}, ${at(axis.profileLeftPercent)})`, width: `${Math.abs(axis.userLeftPercent - axis.profileLeftPercent)}%` }} />
                          <i className="rx-mdot rx-mprofile" style={{ left: at(axis.profileLeftPercent) }} />
                          <i className="rx-mdot rx-myou" style={{ left: at(axis.userLeftPercent) }} />
                        </div>
                        {result && (
                          <div className="rx-poles">
                            <span>{result.leftPole}</span>
                            <span>{result.rightPole}</span>
                          </div>
                        )}
                        <p className="rx-cap">{P.disagreeCaption(you.pct, you.pole, item.profileName, profile.pct, profile.pole)}</p>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </Page>

      <Page topName={topName} title={P.governmentTitle}>
        <div className="rx-gov" style={catStyle(ideology?.ideologyCategory ?? '') as CSSProperties}>
          <svg viewBox="0 0 1000 680" aria-hidden="true">
            <circle className="rx-table-edge" cx={CENTER.x} cy={CENTER.y} r={TABLE_R} />
            <circle className="rx-table-top" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 7} />
            <circle className="rx-table-ring" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 44} />
            {ORDER.map((key, index) => {
              const { chair, degrees } = place(index);
              return (
                <g key={key} transform={`translate(${chair.x.toFixed(1)} ${chair.y.toFixed(1)}) rotate(${degrees + 90})`}>
                  <rect className="rx-chair-back" x="-19" y="-25" width="38" height="9" rx="4.5" />
                  <rect className="rx-chair-seat" x="-18" y="-14" width="36" height="28" rx="9" />
                </g>
              );
            })}
          </svg>
          {ORDER.map((key, index) => {
            const seat = premium.idealGovernment.find((candidate) => candidate.seatKey === key);
            if (!seat) return null;
            const { face, side } = place(index);
            return (
              <div key={key} className={`rx-seat rx-seat-${side}`} style={{ left: `${face.x / 10}%`, top: `${(face.y / 680) * 100}%` }}>
                <Img className="rx-face" src={resolvePersonalityImageSrc(seat.holder.imagePath)} name={seat.holder.name} />
                <div className="rx-lab">
                  <b>{seat.holder.name}</b>
                  <span>{P.seats[key]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Page>

      <Page topName={topName} title={P.timelineTitle}>
        <ol className="rx-eras">
          {premium.timeline.map((era) => (
            <li className="rx-era" key={era.key}>
              <div className="rx-era-h">
                <b>{P.timelineEraNames[era.key]}</b>
                <small>{P.timelineRange(era.fromYear, era.toYear)}</small>
              </div>
              <ul>
                {eraHighlights(era).map((entry) => {
                  const info = timelineEntryInfo(entry);
                  if (!info) return null;
                  return (
                    <li className="rx-era-card" key={info.key}>
                      <Img className={info.isLogo ? 'av-m rx-logo' : 'av-m'} src={info.imageSrc} name={info.name} />
                      <div>
                        <b>{info.name}</b>
                        <small>{info.date}</small>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
        {bestEra && (
          <div className="rx-best">
            <div className="rx-mosaic">
              {bestEra.entries.slice(0, 4).map((entry) => {
                const info = timelineEntryInfo(entry);
                return info ? <Img key={info.key} className={info.isLogo ? 'rx-tile rx-tile-logo' : 'rx-tile'} src={info.imageSrc} name={info.name} /> : null;
              })}
            </div>
            <div className="rx-best-t">
              <small>{P.timelineBestEra}</small>
              <h3>{P.timelineEraNames[bestEra.key]}</h3>
              <span>{P.timelineRange(bestEra.fromYear, bestEra.toYear)}</span>
            </div>
            <Ring value={eraCompatibility(bestEra)} size={82} stroke={5} />
          </div>
        )}
      </Page>

      <Page topName={topName} title={P.countriesTitle}>
        {topCountry && (
          <div className="rx-hero">
            <Img className="rx-hero-flag" src={resolveCountryFlagSrc(topCountry.flagPath)} name={topCountry.name} />
            <div>
              <span className="tag tc">{topCountry.category}</span>
              <h3>{topCountry.name}</h3>
              {topCountry.description && <p>{topCountry.description}</p>}
            </div>
            <Ring value={topCountry.compatibility} size={92} stroke={5.5} />
          </div>
        )}
        <ol className="rank rx-rank">
          {premium.topCountries.map((match, index) => (
            <li className="rk" key={match.countryId}>
              <span className="rk-n">{String(index + 1).padStart(2, '0')}</span>
              <Img className="av-f" src={resolveCountryFlagSrc(match.flagPath)} name={match.name} />
              <div className="rk-i">
                <b>{match.name}</b>
                <small>{match.category}</small>
                <div className="bar">
                  <i style={{ width: `${Math.max(0, Math.min(100, match.compatibility))}%` }} />
                </div>
              </div>
              <strong>{Math.round(match.compatibility)}%</strong>
            </li>
          ))}
        </ol>
        <div className="rx-closing">{closing}</div>
      </Page>
    </>
  );
}
