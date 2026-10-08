import type { CSSProperties } from 'react';
import type { ArchetypeQuestion, QuestionIcon } from '../types/quiz';

interface ArchetypeCardProps {
  question: ArchetypeQuestion;
  index: number;
  selected?: string;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
}

// Selo de cada tema, no mesmo formato do selo de eixo das perguntas comuns:
// ícone preenchido sobre o verde da marca.
const THEME_COLOR = '#102E24';

const THEME_ICONS: Record<string, { viewBox: string; d: string; evenOdd?: boolean }> = {
  sociedade: {
    viewBox: '0 0 1920 1792',
    d: 'M593 896q-162 5-265 128H194q-82 0-138-40.5T0 865q0-353 124-353q6 0 43.5 21t97.5 42.5T384 597q67 0 133-23q-5 37-5 66q0 139 81 256m1071 637q0 120-73 189.5t-194 69.5H523q-121 0-194-69.5T256 1533q0-53 3.5-103.5t14-109T300 1212t43-97.5t62-81t85.5-53.5T602 960q10 0 43 21.5t73 48t107 48t135 21.5t135-21.5t107-48t73-48t43-21.5q61 0 111.5 20t85.5 53.5t62 81t43 97.5t26.5 108.5t14 109t3.5 103.5M640 256q0 106-75 181t-181 75t-181-75t-75-181t75-181T384 0t181 75t75 181m704 384q0 159-112.5 271.5T960 1024T688.5 911.5T576 640t112.5-271.5T960 256t271.5 112.5T1344 640m576 225q0 78-56 118.5t-138 40.5h-134q-103-123-265-128q81-117 81-256q0-29-5-66q66 23 133 23q59 0 119-21.5t97.5-42.5t43.5-21q124 0 124 353m-128-609q0 106-75 181t-181 75t-181-75t-75-181t75-181t181-75t181 75t75 181'
  },
  poder: {
    viewBox: '0 0 14 14',
    evenOdd: true,
    d: 'M7 .05a.75.75 0 0 0-.75.75v2.305L2.963 5.27a.5.5 0 0 0-.204.561l.001.002h8.644v-.002a.5.5 0 0 0-.203-.561L7.75 2.997V1.551h.621a.75.75 0 0 0 0-1.5zm6.242 8.51h-.196v3.934h.196a.75.75 0 0 1 0 1.5H.922a.75.75 0 0 1 0-1.5h.196V8.559H.922a.75.75 0 1 1 0-1.5h12.32a.75.75 0 0 1 0 1.5m-2.106 0h-1.25v3.934h1.25zm-7.022 0h-1.25v3.934h1.25zm3.843 3.934v-2.11a.93.93 0 1 0-1.862 0v2.11z'
  },
  economia: {
    viewBox: '0 0 15 15',
    d: 'M8.5.5v2h1c1.56 0 2.84 1.18 2.98 2.72l.02.28h-2c0-.56-.44-1-1-1h-1v2h1c1.66 0 3 1.34 3 3s-1.34 3-3 3h-1v2h-2v-2h-1c-1.56 0-2.84-1.18-2.98-2.72L2.5 9.5h2c0 .56.44 1 1 1h1v-2h-1c-1.66 0-3-1.34-3-3s1.34-3 3-3h1v-2zm1 8h-1v2h1c.56 0 1-.44 1-1s-.44-1-1-1m-3-4h-1c-.56 0-1 .44-1 1s.44 1 1 1h1z'
  },
  mundo: {
    viewBox: '0 0 24 24',
    d: 'M5 21V4h9l.4 2H20v10h-7l-.4-2H7v7z'
  },
  // Mesmo chip do polo "Tecnologia" (filledPoleIcons.ts), com os dois paths unidos.
  tecnologia: {
    viewBox: '0 0 24 24',
    d: 'M17.504 7.501H7.5v10.003h10.003zM21.505 5.5v-2h-2v-2h-2.001v2h-2v-2h-2.001v2h-2v-2H9.501v2h-2v-2H5.5v2h-2v2h-2v2.001h2v2h-2v2.001h2v2h-2v2.001h2v2h-2v2.001h2v2h2v2.001h2.001v-2h2v2h2.001v-2h2v2h2.001v-2h2v2h2.001v-2h2v-2h2.001v-2.001h-2v-2h2v-2.001h-2v-2h2V9.501h-2v-2h2V5.5zm-2 14.004H5.5V5.501h14.003z'
  }
};

function FilledSvg({ icon, className }: { icon: QuestionIcon; className?: string }) {
  const rule = icon.fillRule ?? 'evenodd';
  return (
    <svg className={className} viewBox={icon.viewBox} aria-hidden="true" style={{ fill: 'currentColor', stroke: 'none' }}>
      {icon.paths.map((d) => <path key={d} d={d} fillRule={rule} clipRule={rule} />)}
    </svg>
  );
}

/** Pergunta de arquétipo do quiz: alternativas com letra (ou ícone), uma escolha. */
export function ArchetypeCard({ question, index, selected, disabled = false, onSelect }: ArchetypeCardProps) {
  const theme = THEME_ICONS[question.id] ?? THEME_ICONS.sociedade;
  const icon: QuestionIcon = question.icon ?? {
    viewBox: theme.viewBox,
    paths: [theme.d],
    fillRule: theme.evenOdd ? 'evenodd' : 'nonzero'
  };
  return (
    <article
      className={question.layout === 'tiles' ? 'question-card archetype-card archetype-card--tiles' : 'question-card archetype-card'}
      aria-labelledby="archetype-title"
    >
      <span className="question-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <header className="question-card-header">
        <p className="question-axis-tag" style={{ '--pole': THEME_COLOR } as CSSProperties}>
          <i aria-hidden="true">
            <FilledSvg icon={icon} className="question-axis-tag-ico" />
          </i>
          <span>{question.label}</span>
        </p>
        <h2 id="archetype-title">{question.text}</h2>
      </header>
      <div className="answer-grid" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              className={isSelected ? 'answer-button archetype-option selected' : 'answer-button archetype-option'}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelect(option.id)}
            >
              <span className="answer-icon archetype-letter" aria-hidden="true">
                {option.icon ? <FilledSvg icon={option.icon} className="archetype-option-ico" /> : option.id}
              </span>
              <span>{option.text}</span>
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </article>
  );
}
