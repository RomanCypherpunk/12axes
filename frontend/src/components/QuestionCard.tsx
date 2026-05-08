import type { AnswerOption, AnswerValue, Question } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  options: AnswerOption[];
  selected?: AnswerValue;
  disabled?: boolean;
  onSelect: (answer: AnswerValue) => void;
}

export function QuestionCard({ question, options, selected, disabled = false, onSelect }: QuestionCardProps) {
  return (
    <section className="question-card" aria-labelledby="question-title">
      <p className="question-axis">{question.axisId.replace('-', ' ')}</p>
      <h2 id="question-title">{question.text}</h2>
      <div className="answer-grid">
        {options.map((option) => (
          <button
            key={option.id}
            className={selected === option.id ? 'answer-button selected' : 'answer-button'}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
