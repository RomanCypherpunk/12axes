import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { FullValue } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import type { Religion } from '../../utils/religion';
import { FullValueCoin, FullValueDetail } from './FullValueParts';
import { InfoSheet } from './InfoSheet';
import { DimRow } from './parts';
import { fitNames } from './PoliticalValuesSection';

interface FullValuesSectionProps {
  values: FullValue[];
  /** Categoria da ideologia principal do usuário: define a cor do anel das moedas e da ficha. */
  category: string;
  /** Religião do usuário, para o símbolo da teocracia. */
  religion?: Religion | null;
  title?: string;
  id?: string;
  footer?: ReactNode;
}

/** Seção "Seus valores" do quiz de 240 perguntas: os valores que a pessoa escolheu, um por categoria. */
export function FullValuesSection({ values, category, religion, title, id, footer }: FullValuesSectionProps) {
  const [selected, setSelected] = useState<FullValue | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const fit = () => fitNames(list);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    void document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [values]);

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="e-panel e-values" id={id ?? 'valores'} data-reveal>
      <h2>{title ?? t.valuesSectionTitle}</h2>
      <ul ref={listRef} className="e-dims e-values-grid">
        {values.map((value) => (
          <DimRow
            key={value.categoryId}
            open={{ label: t.valueInfoAria(value.name), onOpen: () => setSelected(value) }}
            visual={<FullValueCoin value={value} size={56} religion={religion} />}
            label={value.categoryLabel}
            name={value.name}
          >
            {null}
          </DimRow>
        ))}
      </ul>
      {footer}

      {selected && (
        <InfoSheet titleId="value-sheet-title" style={catStyle(category) as CSSProperties} onClose={() => setSelected(null)}>
          <FullValueDetail value={selected} religion={religion} />
        </InfoSheet>
      )}
    </section>
  );
}
