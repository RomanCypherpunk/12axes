import type { ReactNode } from 'react';
import { t } from '../../i18n';
import { CountUpValue } from './CountUpValue';

interface MatchHeroProps {
  visual: ReactNode;
  kicker: string;
  compatibility: number;
  name: string;
  tags: string[];
  description: string;
}

// Card do item mais compatível de um catálogo (país ou personalidade).
export function MatchHero({ visual, kicker, compatibility, name, tags, description }: MatchHeroProps) {
  return (
    <article className="e-match">
      {visual}
      <div>
        <div className="e-match-tags">
          <span className="e-tag e-tag-cat">{kicker}</span>
          <span className="e-tag e-tag-solid">
            {Math.round(compatibility)}% {t.matchWord}
          </span>
        </div>
        <h3>{name}</h3>
        {tags.length > 0 && (
          <div className="e-match-tags">
            {tags.map((tag) => (
              <span className="e-tag e-tag-neutral" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <p>{description}</p>
      </div>
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
}

export function DimList({ items }: { items: DimItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <>
      <p className="e-sub">{t.dimensionsTitle}</p>
      <ul className="e-dims">
        {items.map((item) => (
          <li className="e-dim-row" key={item.key}>
            {item.visual}
            <div>
              <span className="e-dim">{item.label}</span>
              <strong>{item.name}</strong>
              {item.caption && <small>{item.caption}</small>}
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
  compatibility: number;
}

export function FarList({ title, items }: { title: string; items: FarItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <>
      <p className="e-sub">{title}</p>
      <ul className="e-fars">
        {items.map((item) => (
          <li className="e-far-row" key={item.key}>
            <div>
              <strong>{item.name}</strong>
              {item.caption && <small>{item.caption}</small>}
            </div>
            <span>{Math.round(item.compatibility)}%</span>
          </li>
        ))}
      </ul>
    </>
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
