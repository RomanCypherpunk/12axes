import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, CompareProfile } from '../../types/quiz';
import { PoleIcon } from '../AxisIcon';
import { firstName } from '../../utils/peopleCompare';
import { colorOf } from './profileColors';

// Mesma regra do resultado: perto do centro o eixo é equilibrado e não pende para polo nenhum.
const BALANCED_DISTANCE = 7.5;

// Na comparação entre duas pessoas as etiquetas mais próximas que isto (em pontos do eixo) viram uma só: "Vocês".
const MERGE_DISTANCE = 12;
// A etiqueta é larga: perto das pontas ela encosta na borda em vez de sair da trilha.
// Carmim da identidade: cor da segunda etiqueta quando as duas cairiam na mesma.
const DISTINCT_COLOR = '#880912';
const clampTag = (percent: number): number => Math.max(5, Math.min(95, percent));

/** Valor de um perfil no eixo (% do polo esquerdo); 50 quando o vetor não traz o eixo. */
export const valueOf = (profile: CompareProfile, axisId: string): number => profile.vector[axisId] ?? 50;

/** "62% Federal" para quem pende a um polo; "Equilibrado" perto do centro. */
export function reading(axis: Axis, value: number): string {
  if (Math.abs(value - 50) < BALANCED_DISTANCE) return `${t.comparePageBalanced} (${Math.round(value)}% ${axis.leftPole})`;
  return value > 50 ? `${Math.round(value)}% ${axis.leftPole}` : `${Math.round(100 - value)}% ${axis.rightPole}`;
}

export function profileColor(color: string): CSSProperties {
  return { '--pc': color } as CSSProperties;
}

/** Texto da etiqueta: o primeiro nome de uma pessoa; o nome inteiro de um perfil de catálogo quando é curto. */
function tagLabel(profile: CompareProfile): string {
  const name = profile.item.name;
  return profile.item.initials || name.length > 14 ? firstName(name) : name;
}

/**
 * Etiquetas com o nome (ou "Vocês" quando as duas ficam juntas), no lugar dos rostos.
 * A cor é a da ideologia mais próxima da pessoa, a mesma das iniciais no cartão dela, ou a do espectro do perfil de catálogo.
 */
export function AxisTags({ axis, profiles }: { axis: Axis; profiles: CompareProfile[] }) {
  const values = profiles.map((profile) => valueOf(profile, axis.id));
  const percent = (value: number): number => Math.round(Math.max(value, 100 - value));
  if (profiles.length === 2 && Math.abs(values[0] - values[1]) < MERGE_DISTANCE) {
    const middle = (values[0] + values[1]) / 2;
    const tip = profiles.map((profile, index) => `${profile.item.name} · ${percent(values[index])}%`).join(' / ');
    return (
      <span className="e-cp-pin e-cp-tag is-both" tabIndex={0} data-tip={tip} style={{ left: `${clampTag(100 - middle)}%`, zIndex: 1 }}>
        {profiles.every((profile) => profile.item.initials) ? t.peopleBoth : t.compareBoth}
      </span>
    );
  }
  // Mesma cor nas duas etiquetas (as duas no mesmo espectro): a segunda vira o carmim da identidade, para não se confundirem.
  const colors = profiles.map((profile, index) => colorOf(profile, index));
  if (colors.length === 2 && colors[0] === colors[1]) colors[1] = DISTINCT_COLOR;
  return (
    <>
      {profiles.map((profile, index) => (
        <span
          key={`${profile.item.type}:${profile.item.id}`}
          className="e-cp-pin e-cp-tag"
          tabIndex={0}
          data-tip={`${profile.item.name} · ${percent(values[index])}%`}
          style={{ ...profileColor(colors[index]), left: `${clampTag(100 - values[index])}%`, zIndex: index + 1 }}
        >
          {tagLabel(profile)}
        </span>
      ))}
    </>
  );
}

/** Os 12 eixos com as etiquetas dos perfis na trilha e os polos com ícone embaixo (o mesmo desenho da comparação entre pessoas). */
export function AxisTagList({ axes, profiles }: { axes: Axis[]; profiles: CompareProfile[] }) {
  return (
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
              <AxisTags axis={axis} profiles={profiles} />
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
  );
}
