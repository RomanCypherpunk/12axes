import { useMemo, useState, type CSSProperties } from 'react';
import { SafeImg } from '../components/editorial/primitives';
import { localCatStyle } from '../utils/ideologyColors';
import { personalityInitials } from '../utils/personalityImage';
import type { WikiListText, WikiText } from './strings';

/** Um item da lista. Ideologias viram o cartão de "Outras ideologias"; os demais, a caixa de "Também próximos". */
export interface WikiListItem {
  id: string;
  name: string;
  /** Cargo, tipo de regime, país do partido... (vai na busca também). */
  subtitle: string;
  group: string;
  groupLabel: string;
  href: string;
  /** Foto, bandeira ou logo (já com o caminho final). Sem imagem, o item é o cartão colorido da ideologia. */
  image?: string;
  imageShape?: 'round' | 'flag' | 'logo';
  /** Categoria e id da ideologia, para a cor do cartão. */
  category?: string;
}

export interface WikiCatalogIndexProps {
  items: WikiListItem[];
  groups: { id: string; label: string; count: number }[];
  /** Cor das bolinhas dos filtros (espectros, nas ideologias). */
  groupColors?: Record<string, string>;
  text: WikiText;
  list: WikiListText;
}

export const PAGE_SIZE = 24;

// Sem acento e em minúsculas, para a busca achar "Lênin" digitando "lenin".
const fold = (value: string): string => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/** Filtro por grupo e busca por nome ou subtítulo (sem acento, sem caixa). */
export function filterItems(items: WikiListItem[], group: string | null, query: string): WikiListItem[] {
  const needle = fold(query.trim());
  return items.filter((item) => (!group || item.group === group) && (!needle || fold(`${item.name} ${item.subtitle}`).includes(needle)));
}

export function WikiCatalogIndex({ items, groups, groupColors, text, list }: WikiCatalogIndexProps) {
  const [group, setGroup] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => filterItems(items, group, query), [items, group, query]);
  const shown = filtered.slice(0, limit);

  const pick = (next: string | null) => {
    setGroup(next);
    setLimit(PAGE_SIZE);
  };

  return (
    <main className="ed e-res e-wiki">
      <div className="e-wrap">
        <header className="e-wiki-list-head">
          <h1>{list.title}</h1>
          <p>{list.lead(items.length)}</p>
          <div className="e-wiki-tools">
            <input
              className="e-wiki-search"
              type="search"
              placeholder={list.search}
              aria-label={list.search}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLimit(PAGE_SIZE);
              }}
            />
            <div className="e-wiki-chips" role="group">
              <button type="button" aria-pressed={group === null} onClick={() => pick(null)}>
                {text.all}
                <small>{items.length}</small>
              </button>
              {groups.map((item) => (
                <button key={item.id} type="button" aria-pressed={group === item.id} onClick={() => pick(item.id)}>
                  {groupColors?.[item.id] && <i className="e-wiki-dot" style={{ background: groupColors[item.id] }} />}
                  {item.label}
                  <small>{item.count}</small>
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="e-panel">
          <h2>{list.panel}</h2>
          <p className="e-wiki-count">{text.showing(shown.length, filtered.length)}</p>
          {shown.length === 0 ? (
            <p>{list.empty}</p>
          ) : (
            <ul className="e-wiki-grid">
              {shown.map((item) =>
                item.image === undefined ? (
                  <li key={item.id}>
                    <a className="e-ocard e-wiki-ocard" href={item.href} style={localCatStyle(item.category ?? '', item.id) as CSSProperties}>
                      <span className="e-tag e-osolid">{item.groupLabel}</span>
                      <h3>{item.name}</h3>
                    </a>
                  </li>
                ) : (
                  <li key={item.id}>
                    <a className="e-dim-row" href={item.href}>
                      <SafeImg
                        className={item.imageShape === 'flag' ? 'e-wiki-flag' : item.imageShape === 'logo' ? 'e-wiki-logo' : 'e-wiki-face'}
                        src={item.image}
                        alt=""
                        fallback={personalityInitials(item.name)}
                      />
                      <div>
                        <span className="e-dim">{item.groupLabel}</span>
                        <strong>{item.name}</strong>
                        {item.subtitle && <em>{item.subtitle}</em>}
                      </div>
                    </a>
                  </li>
                )
              )}
            </ul>
          )}
          {shown.length < filtered.length && (
            <div className="e-wiki-more">
              <button className="e-btn e-btn-ghost" type="button" onClick={() => setLimit(limit + PAGE_SIZE)}>
                {text.more}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
