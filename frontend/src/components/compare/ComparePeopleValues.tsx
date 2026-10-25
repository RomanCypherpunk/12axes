import { useState, type CSSProperties } from 'react';
import { t } from '../../i18n';
import type { PoliticalValue, QuizResult } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import type { Religion } from '../../utils/religion';
import { InfoSheet } from '../results/InfoSheet';
import { ValueCoin } from '../results/ValueCoin';

interface Person {
  name: string;
  result: QuizResult;
  religion: Religion | null;
}

interface Opened {
  value: PoliticalValue;
  /** Quem tem o valor: o nome da pessoa ou "Vocês", nos valores em comum. */
  owner: string;
  category: string;
  religion: Religion | null;
}

/** O texto de um valor, igual ao dos resultados, com a categoria e o dono no rótulo. */
function ValueSheet({ opened, onClose }: { opened: Opened; onClose: () => void }) {
  const { value, owner, category, religion } = opened;
  return (
    <InfoSheet titleId="people-value-sheet-title" style={catStyle(category) as CSSProperties} onClose={onClose}>
      <div className="e-value-sheet">
        <ValueCoin valueId={value.valueId} name={value.name} size={120} religion={religion} />
        <span className="e-dim">
          {value.categoryLabel} · {owner}
        </span>
        <h3 id="people-value-sheet-title">{value.name}</h3>
        {value.neutral && <span className="e-tag e-tag-cat">{t.valuesNeutralTag}</span>}
        <p>{value.description}</p>
      </div>
    </InfoSheet>
  );
}

function ValueRow({ value, owner, category, religion, onOpen }: Opened & { onOpen: (opened: Opened) => void }) {
  return (
    <button
      type="button"
      className="e-pv-row"
      style={catStyle(category) as CSSProperties}
      aria-label={t.valueInfoAria(value.name)}
      onClick={() => onOpen({ value, owner, category, religion })}
    >
      <ValueCoin valueId={value.valueId} name={value.name} size={46} religion={religion} />
      <span>
        <b>{owner}</b>
        <strong>{value.name}</strong>
      </span>
    </button>
  );
}

/**
 * Os valores políticos de cada pessoa, categoria por categoria ("Política: Enzo X, Davi Y"), cada um na cor da
 * ideologia da própria pessoa. Clicar num valor abre o texto dele, como nos resultados.
 */
export function ComparePeopleValues({ people, id, title }: { people: [Person, Person]; id: string; title: string }) {
  const [opened, setOpened] = useState<Opened | null>(null);
  const first = people[0].result.politicalValues ?? [];
  const second = people[1].result.politicalValues ?? [];
  // A ordem das categorias é a da primeira pessoa; uma categoria que só a segunda tem entra no fim.
  const categories = [...first, ...second.filter((value) => !first.some((other) => other.categoryId === value.categoryId))];
  if (categories.length === 0) return null;

  return (
    <section className="e-panel" id={id} data-reveal>
      <h2>{title}</h2>
      <ul className="e-pv-grid">
        {categories.map(({ categoryId, categoryLabel }) => (
          <li key={categoryId} className="e-pv-card">
            <span className="e-pv-cat">{categoryLabel}</span>
            {people.map((person) => {
              const value = person.result.politicalValues?.find((candidate) => candidate.categoryId === categoryId);
              if (!value) return null;
              return (
                <ValueRow
                  key={person.name}
                  value={value}
                  owner={person.name}
                  category={person.result.topMatch.category}
                  religion={person.religion}
                  onOpen={setOpened}
                />
              );
            })}
          </li>
        ))}
      </ul>
      {opened && <ValueSheet opened={opened} onClose={() => setOpened(null)} />}
    </section>
  );
}

/** Os valores que as duas pessoas têm em comum, no mesmo desenho: um cartão por categoria, clicável. */
export function CompareSharedValues({
  values,
  category,
  religion,
  id,
  title
}: {
  values: PoliticalValue[];
  category: string;
  religion: Religion | null;
  id: string;
  title: string;
}) {
  const [opened, setOpened] = useState<Opened | null>(null);
  if (values.length === 0) return null;

  return (
    <section className="e-panel e-values" id={id} data-reveal style={catStyle(category) as CSSProperties}>
      <h2>{title}</h2>
      <ul className="e-dims e-values-grid">
        {values.map((value) => {
          const open = () => setOpened({ value, owner: t.peopleBoth, category, religion });
          return (
            <li
              key={value.categoryId}
              className="e-dim-row e-values-pick"
              role="button"
              tabIndex={0}
              aria-label={t.valueInfoAria(value.name)}
              onClick={open}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  open();
                }
              }}
            >
              <ValueCoin valueId={value.valueId} name={value.name} size={56} religion={religion} />
              <div>
                <span className="e-dim">{value.categoryLabel}</span>
                <strong>{value.name}</strong>
              </div>
            </li>
          );
        })}
      </ul>
      {opened && <ValueSheet opened={opened} onClose={() => setOpened(null)} />}
    </section>
  );
}
