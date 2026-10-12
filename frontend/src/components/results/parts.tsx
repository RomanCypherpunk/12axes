import { t } from '../../i18n';

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

// Lembra que as notas são afinidade com o usuário, não uma escala de força.
export function SimilarityNote() {
  return (
    <p className="e-sim-note">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </svg>
      {t.similarityNote}
    </p>
  );
}
