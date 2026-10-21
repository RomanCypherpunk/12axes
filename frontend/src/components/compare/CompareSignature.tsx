import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, CompareProfile } from '../../types/quiz';
import { valueOf } from './CompareAxes';
import { colorOf } from './profileColors';

const BALANCED_DISTANCE = 7.5;
const clamp = (value: number): number => Math.max(0, Math.min(100, value));

interface AxisSpread {
  axis: Axis;
  spread: number;
  low: number;
  high: number;
}

/**
 * O que distingue os perfis, no molde de "O que te distingue" dos resultados: o eixo em que mais se afastam,
 * o eixo em que mais se encontram e os eixos em que ficam em lados opostos.
 */
export function CompareSignature({ axes, profiles }: { axes: Axis[]; profiles: CompareProfile[] }) {
  const spreads: AxisSpread[] = axes.map((axis) => {
    const values = profiles.map((profile) => valueOf(profile, axis.id));
    const low = values.indexOf(Math.min(...values));
    const high = values.indexOf(Math.max(...values));
    return { axis, spread: values[high] - values[low], low, high };
  });
  const widest = spreads.reduce((best, current) => (current.spread > best.spread ? current : best));
  const narrowest = spreads.reduce((best, current) => (current.spread < best.spread ? current : best));
  const opposite = spreads.filter(
    ({ axis, spread }) =>
      spread > 0 &&
      profiles.some((profile) => valueOf(profile, axis.id) - 50 >= BALANCED_DISTANCE) &&
      profiles.some((profile) => 50 - valueOf(profile, axis.id) >= BALANCED_DISTANCE)
  );

  return (
    <section className="e-panel" id="cmp-assinatura">
      <div className="e-sec-head">
        <h2 className="e-sec-title">{t.comparePageSignatureTitle}</h2>
        <p className="e-mleg" aria-hidden="true">
          {profiles.map((profile, index) => (
            <span key={`${profile.item.type}:${profile.item.id}`}>
              <i className="e-k-y" style={{ borderColor: colorOf(profile, index) }} />
              {profile.item.name}
            </span>
          ))}
        </p>
      </div>
      <div className="e-dist">
        <SpreadCard entry={widest} strong label={t.comparePageDiverge} profiles={profiles} />
        <SpreadCard entry={narrowest} strong={false} label={t.comparePageAgree} profiles={profiles} />
        <article className="e-tension e-cp-tension">
          <div className="e-cp-tension-head">
            <span className="e-tag e-tag-white">{t.comparePageOpposite}</span>
            <div className="e-pair" aria-hidden="true">
              {profiles.map((profile, index) => (
                <span key={`${profile.item.type}:${profile.item.id}`} style={{ '--c': colorOf(profile, index) } as CSSProperties}>
                  {profile.item.name}
                </span>
              ))}
            </div>
          </div>
          <p>
            <b>{opposite.length > 0 ? t.comparePageOppositeCount(opposite.length, axes.length) : t.comparePageNoOpposite}</b>
          </p>
          {opposite.length > 0 && (
            <ul className="e-chips">
              {opposite.map(({ axis }) => (
                <li key={axis.id}>{axis.label}</li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}

function SpreadCard({ entry, strong, label, profiles }: { entry: AxisSpread; strong: boolean; label: string; profiles: CompareProfile[] }) {
  const { axis, spread, low, high } = entry;
  // Na régua o polo esquerdo fica à esquerda; o vetor guarda a % do polo esquerdo, então a posição é o complemento.
  const positions = profiles.map((profile) => clamp(100 - valueOf(profile, axis.id)));
  const start = Math.min(...positions);
  const end = Math.max(...positions);
  const points = Math.round(spread);
  const cap = strong
    ? t.comparePageDivergeCap(profiles[high].item.name, profiles[low].item.name, points)
    : t.comparePageAgreeCap(points);

  return (
    <article className={strong ? 'e-dcard e-strong' : 'e-dcard'}>
      <div className="e-dcard-head">
        <span className={strong ? 'e-tag e-tag-white' : 'e-tag e-tag-cat'}>{label}</span>
        <h3>{axis.label}</h3>
      </div>
      <div className="e-dcard-body">
        <p className="e-big">
          {points}
          <small>{t.comparePageUnitPoints}</small>
        </p>
        <p className="e-cap">{cap}</p>
      </div>
      <div className="e-mbar" aria-hidden="true">
        <span className="e-mtrack" />
        <span className="e-mfill" style={{ left: `${start}%`, width: `${end - start}%` }} />
        {positions.map((position, index) => (
          <span
            key={`${profiles[index].item.type}:${profiles[index].item.id}`}
            className={strong ? 'e-myou e-strong' : 'e-myou'}
            style={{ left: `${position}%`, borderColor: colorOf(profiles[index], index) }}
          />
        ))}
      </div>
      <div className="e-mlab">
        <span>{axis.leftPole}</span>
        <span>{axis.rightPole}</span>
      </div>
    </article>
  );
}
