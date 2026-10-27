import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, CompareProfile } from '../../types/quiz';
import { PoleIcon } from '../AxisIcon';
import { AxisTags, profileColor, reading, valueOf } from './axisTags';
import { ProfileFace } from '../results/CompareSection';
import { colorOf } from './profileColors';

export { profileColor, valueOf };

/** Legenda: um chip com o rosto de cada perfil na cor da sua posição. */
export function ProfileLegend({ profiles }: { profiles: CompareProfile[] }) {
  return (
    <ul className="e-cp-legend" aria-hidden="true">
      {profiles.map((profile, index) => (
        <li key={`${profile.item.type}:${profile.item.id}`}>
          <span className="e-cmpp-ring" style={profileColor(colorOf(profile, index))}>
            <ProfileFace item={profile.item} className="e-close-face" />
          </span>
          {profile.item.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * Os 12 eixos um sobre o outro, nas cores e com os ícones dos polos como nos resultados, e um rosto por perfil
 * na trilha. Passar o mouse (ou focar) no rosto mostra a porcentagem daquele perfil.
 */
export function CompareAxes({ axes, profiles, tags = false }: { axes: Axis[]; profiles: CompareProfile[]; tags?: boolean }) {
  return (
    <section className="e-panel" id="cmp-eixos">
      <h2>{t.comparePageAxesTitle}</h2>
      <ProfileLegend profiles={profiles} />
      <ul className="e-cp-axes">
        {axes.map((axis) => {
          const readings = profiles.map((profile) => `${profile.item.name} ${reading(axis, valueOf(profile, axis.id))}`);
          return (
            <li key={axis.id} className="e-cp-axis" style={{ '--al': axis.leftColor, '--ar': axis.rightColor } as CSSProperties}>
              <div className="e-axis-row-head">
                <h3>{axis.label}</h3>
              </div>
              <div className="e-cp-track" role="img" aria-label={t.comparePageAxisAria(axis.label, readings.join(', '))}>
                <span className="e-amid" />
                {tags && <AxisTags axis={axis} profiles={profiles} />}
                {!tags && profiles.map((profile, index) => {
                  const value = valueOf(profile, axis.id);
                  return (
                    <span
                      key={`${profile.item.type}:${profile.item.id}`}
                      className="e-cp-pin"
                      tabIndex={0}
                      data-tip={`${profile.item.name} · ${Math.round(Math.max(value, 100 - value))}%`}
                      style={{ ...profileColor(colorOf(profile, index)), left: `${100 - value}%`, zIndex: index + 1 }}
                    >
                      <ProfileFace item={profile.item} className="e-close-face" />
                    </span>
                  );
                })}
              </div>
              <div className="e-axis-poles">
                <div className="e-pole e-left e-win">
                  <PoleIcon axisId={axis.id} side="left" className="e-ico" />
                  <b>{axis.leftPole}</b>
                </div>
                <div className="e-pole e-right e-win">
                  <b>{axis.rightPole}</b>
                  <PoleIcon axisId={axis.id} side="right" className="e-ico" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
