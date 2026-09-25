import type { CSSProperties } from 'react';
import { t } from '../i18n';
import type { AnswerOption, AnswerValue, Axis, Question } from '../types/quiz';
import { PoleIcon } from './AxisIcon';

const answerClassById: Record<AnswerValue, string> = {
  STRONGLY_AGREE: 'answer-button answer-strong-agree',
  AGREE: 'answer-button answer-agree',
  NEUTRAL: 'answer-button answer-neutral',
  DISAGREE: 'answer-button answer-disagree',
  STRONGLY_DISAGREE: 'answer-button answer-strong-disagree'
};

interface QuestionCardProps {
  question: Question;
  axisLabel?: string;
  /** Eixo da pergunta: icone e cor do polo de concordancia no selo. */
  axis?: Axis;
  /** Numero da pergunta exibido no canto superior direito. */
  number?: number;
  options: AnswerOption[];
  selected?: AnswerValue;
  disabled?: boolean;
  onSelect: (answer: AnswerValue) => void;
}

export function QuestionCard({ question, axisLabel, axis, number, options, selected, disabled = false, onSelect }: QuestionCardProps) {
  return (
    <article className="question-card" aria-labelledby="question-title">
      {number !== undefined && (
        <span className="question-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      )}
      <header className="question-card-header">
        {axis ? (
          <p
            className="question-axis-tag"
            style={{ '--pole': question.agreePole === 'LEFT' ? axis.leftColor : axis.rightColor } as CSSProperties}
          >
            <i aria-hidden="true">
              <PoleIcon axisId={axis.id} side={question.agreePole === 'LEFT' ? 'left' : 'right'} className="question-axis-tag-ico" />
            </i>
            <span>{axis.label}</span>
          </p>
        ) : (
          <p className="question-axis">{axisLabel ?? question.axisId.replace('-', ' ')}</p>
        )}
        <h2 id="question-title">{question.text}</h2>
      </header>
      <div className="answer-grid" role="radiogroup" aria-label={t.answersAria}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              className={isSelected ? `${answerClassById[option.id]} selected` : answerClassById[option.id]}
              data-answer={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={(event) => {
                // Ancora a onda de confirmacao no ponto exato do clique.
                const target = event.currentTarget;
                const rect = target.getBoundingClientRect();
                const x = event.clientX - rect.left;
                if (rect.width > 0 && Number.isFinite(x)) {
                  target.style.setProperty('--commit-x', `${(x / rect.width) * 100}%`);
                }
                onSelect(option.id);
              }}
            >
              <AnswerIcon answer={option.id} />
              <span>{option.label}</span>
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </article>
  );
}

function AnswerIcon({ answer }: { answer: AnswerValue }) {
  if (answer === 'NEUTRAL') {
    return (
      <span className="answer-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 12h12" />
        </svg>
      </span>
    );
  }

  if (answer === 'DISAGREE' || answer === 'STRONGLY_DISAGREE') {
    return (
      <span className="answer-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="m7 7 10 10" />
          <path d="m17 7-10 10" />
        </svg>
      </span>
    );
  }

  return (
    <span className="answer-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="m6 12 4 4 8-8" />
      </svg>
    </span>
  );
}
