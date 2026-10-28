import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { PoliticalValue } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import type { Religion } from '../../utils/religion';
import { InfoSheet } from './InfoSheet';
import { DimRow } from './parts';
import { ValueCoin } from './ValueCoin';

interface PoliticalValuesSectionProps {
  values: PoliticalValue[];
  /** Categoria da ideologia principal do usuário: define a cor das moedas. */
  category: string;
  /** Religião escolhida pelo usuário, para o ícone dos valores religiosos. */
  religion?: Religion | null;
  /** Para reusar a seção fora dos resultados (página de comparação entre pessoas). */
  title?: string;
  id?: string;
  header?: ReactNode;
}

const MIN_NAME_FONT = 9;

// O nome do valor nunca quebra no meio da palavra: se a maior palavra não couber na largura do cartão,
// a fonte diminui (em passos de 0,5px, até um mínimo) em vez de a palavra ser cortada.
function fitNames(list: HTMLElement) {
  list.querySelectorAll<HTMLElement>('.e-dim-row strong').forEach((name) => {
    name.style.fontSize = '';
    let size = parseFloat(getComputedStyle(name).fontSize);
    while (name.scrollWidth > name.clientWidth + 0.5 && size > MIN_NAME_FONT) {
      size -= 0.5;
      name.style.fontSize = `${size}px`;
    }
  });
}

export function PoliticalValuesSection({ values, category, religion, title, id, header }: PoliticalValuesSectionProps) {
  const [selected, setSelected] = useState<PoliticalValue | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const fit = () => fitNames(list);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    // a fonte do site pode terminar de carregar depois da primeira medição
    void document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [values]);

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="e-panel e-values" id={id ?? 'valores'} data-reveal>
      <h2>{title ?? t.valuesSectionTitle}</h2>
      {header}

      <ul ref={listRef} className="e-dims e-values-grid">
        {values.map((value) => (
          <DimRow
            key={value.categoryId}
            open={{ label: t.valueInfoAria(value.name), onOpen: () => setSelected(value) }}
            visual={<ValueCoin valueId={value.valueId} name={value.name} size={56} religion={religion} />}
            label={value.categoryLabel}
            name={value.name}
          >
            {null}
          </DimRow>
        ))}
      </ul>

      {selected && (
        <InfoSheet titleId="value-sheet-title" style={catStyle(category) as CSSProperties} onClose={() => setSelected(null)}>
          <div className="e-value-sheet">
            <ValueCoin valueId={selected.valueId} name={selected.name} size={120} religion={religion} />
            <span className="e-dim">{selected.categoryLabel}</span>
            <h3 id="value-sheet-title">{selected.name}</h3>
            {selected.neutral && <span className="e-tag e-tag-cat">{t.valuesNeutralTag}</span>}
            <p>{selected.description}</p>
          </div>
        </InfoSheet>
      )}
    </section>
  );
}
