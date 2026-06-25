import type { AnswerOption, AnswerValue, Question } from '../types/quiz';

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
  options: AnswerOption[];
  selected?: AnswerValue;
  disabled?: boolean;
  onSelect: (answer: AnswerValue) => void;
}

export function QuestionCard({ question, axisLabel, options, selected, disabled = false, onSelect }: QuestionCardProps) {
  return (
    <article className="question-card" aria-labelledby="question-title">
      <header className="question-card-header">
        <p className="question-axis">{axisLabel ?? question.axisId.replace('-', ' ')}</p>
        <h2 id="question-title">{question.text}</h2>
      </header>
      <div className="answer-grid" role="radiogroup" aria-label="Opções de resposta">
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
              onClick={() => onSelect(option.id)}
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
