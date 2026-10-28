import type { ReactNode } from 'react';
import { t } from '../../i18n';
import { CountUpValue } from './CountUpValue';
import { Ring } from '../editorial/primitives';
import { clickableProps } from './InfoSheet';

interface MatchHeroProps {
  visual: ReactNode;
  compatibility: number;
  name: string;
  tags: string[];
  description: string;
  /** Miniatura opcional exibida antes da etiqueta "Mais compatível" (ex.: bandeira do país). */
  kickerPrefix?: ReactNode;
}

// Card do item mais compatível de um catálogo (país ou personalidade).
export function MatchHero({ visual, compatibility, name, tags, description, kickerPrefix }: MatchHeroProps) {
  const caption = tags.join(' · ');

  return (
    <article className="e-match">
      <div className="e-match-top">
        {visual}
        <div className="e-match-info">
          <div className="e-match-tags">
            {kickerPrefix}
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

interface DimRowProps {
  /** Abre os detalhes ao clicar no cartão inteiro (aria-label incluído). */
  open?: { label: string; onOpen: () => void };
  visual: ReactNode;
  label: string;
  name: string;
  /** Linha extra abaixo do nome. */
  note?: ReactNode;
  /** Coluna da direita (a porcentagem ou uma ação). */
  children: ReactNode;
}

/** Linha de perfil (miniatura, tipo, nome e valor à direita), também usada em /compare. */
export function DimRow({ open, visual, label, name, note, children }: DimRowProps) {
  return (
    <li {...(open ? { ...clickableProps(open.label, open.onOpen), className: 'e-dim-row e-clickable' } : { className: 'e-dim-row' })}>
      {visual}
      <div>
        <span className="e-dim">{label}</span>
        <strong>{name}</strong>
        {note}
      </div>
      <span className="e-pctc">{children}</span>
    </li>
  );
}

export function DimList({ items, hideTitle = false, hideValue = false }: { items: DimItem[]; hideTitle?: boolean; hideValue?: boolean }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <>
      {!hideTitle && <p className="e-sub">{t.dimensionsTitleShort}</p>}
      <ul className="e-dims">
        {items.map((item) => (
          <DimRow
            key={item.key}
            open={item.onInfo && item.infoLabel ? { label: item.infoLabel, onOpen: item.onInfo } : undefined}
            visual={item.visual}
            label={item.label}
            name={item.name}
          >
            {hideValue ? null : <CountUpValue value={item.compatibility} decimals={0} />}
          </DimRow>
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
