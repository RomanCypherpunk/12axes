import { useState, type CSSProperties } from 'react';
import { t } from '../../i18n';
import type { PoliticalValue } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import type { Religion } from '../../utils/religion';
import { InfoButton, InfoSheet } from './InfoSheet';
import { DimRow } from './parts';
import { ValueCoin } from './ValueCoin';

interface PoliticalValuesSectionProps {
  values: PoliticalValue[];
  /** Categoria da ideologia principal do usuário: define a cor das moedas. */
  category: string;
  /** Religião escolhida pelo usuário, para o ícone dos valores religiosos. */
  religion?: Religion | null;
}

export function PoliticalValuesSection({ values, category, religion }: PoliticalValuesSectionProps) {
  const [selected, setSelected] = useState<PoliticalValue | null>(null);

  if (values.length === 0) {
    return null;
  }

  return (
    <section className="e-panel e-values" id="valores" data-reveal>
      <h2>{t.valuesSectionTitle}</h2>

      <ul className="e-dims e-values-grid">
        {values.map((value) => (
          <DimRow
            key={value.categoryId}
            info={<InfoButton className="e-axis-info e-card-info" label={t.valueInfoAria(value.name)} onClick={() => setSelected(value)} />}
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
