import type { ReactNode } from 'react';
import { t } from '../../i18n';
import { CountUpValue } from './CountUpValue';
import { Ring } from '../editorial/primitives';
import { InfoButton } from './InfoSheet';

interface MatchHeroProps {
  visual: ReactNode;
  compatibility: number;
  name: string;
  tags: string[];
  description: string;
}

// Card do item mais compatível de um catálogo (país ou personalidade).
export function MatchHero({ visual, compatibility, name, tags, description }: MatchHeroProps) {
  const caption = tags.join(' · ');

  return (
    <article className="e-match">
      <div className="e-match-top">
        {visual}
        <div className="e-match-info">
          <div className="e-match-tags">
            <span className="e-tag e-tag-solid">{t.matchTopKicker}</span>
            <span className="e-tag e-tag-cat e-match-pill">
              {Math.round(compatibility)}% {t.matchWord}
            </span>
          </div>
          <h3>{name}</h3>
          {caption && <p>{caption}</p>}
        </div>
        <Ring pct={compatibility} size={104} stroke={6} />
      </div>
      {description && (
        <details className="e-more">
          <summary>{t.knowMoreAbout(name)}</summary>
          <p>{description}</p>
        </details>
      )}
    </article>
  );
}

export interface DimItem {
  key: string;
  visual: ReactNode;
  label: string;
  name: string;
  caption: string;
  compatibility: number;
  infoLabel?: string;
  onInfo?: () => void;
}

export function DimList({ items }: { items: DimItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <>
      <p className="e-sub">{t.dimensionsTitleShort}</p>
      <ul className="e-dims">
        {items.map((item) => (
          <li className="e-dim-row" key={item.key}>
            {item.onInfo && item.infoLabel && (
              <InfoButton className="e-axis-info e-card-info" label={item.infoLabel} onClick={item.onInfo} />
            )}
            {item.visual}
            <div>
              <span className="e-dim">{item.label}</span>
              <strong>{item.name}</strong>
            </div>
            <span className="e-pctc">
              <CountUpValue value={item.compatibility} decimals={0} />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export interface FarItem {
  key: string;
  name: string;
  caption: string;
}

export function FarList({ title, items }: { title: string; items: FarItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="e-far">
      <p className="e-sub">{title}</p>
      <ul className="e-fars">
        {items.map((item) => (
          <li className="e-far-row" key={item.key}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TabsProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function Tabs<T extends string>({ label, value, options, onChange }: TabsProps<T>) {
  return (
    <div className="e-tabs" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
