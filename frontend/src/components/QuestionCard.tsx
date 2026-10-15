import { useState, type CSSProperties } from 'react';
import { t } from '../i18n';
import type { AnswerOption, AnswerValue, Axis, Question, QuestionHelp } from '../types/quiz';
import { PoleIcon } from './AxisIcon';
import { GlossaryText } from './GlossaryText';
import { InfoButton, InfoSheet } from './results/InfoSheet';

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
  const [isAxisInfoOpen, setIsAxisInfoOpen] = useState(false);
  const agreeColor = axis && (question.agreePole === 'LEFT' ? axis.leftColor : axis.rightColor);

  return (
    <article className="question-card" aria-labelledby="question-title">
      {number !== undefined && (
        <span className="question-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
      )}
      <header className="question-card-header">
        {axis ? (
          <div className="question-axis-help">
            <p className="question-axis-tag" style={{ '--pole': agreeColor } as CSSProperties}>
              <i aria-hidden="true">
                <PoleIcon axisId={axis.id} side={question.agreePole === 'LEFT' ? 'left' : 'right'} className="question-axis-tag-ico" />
              </i>
              <span>{question.agreePole === 'LEFT' ? axis.leftPole : axis.rightPole}</span>
            </p>
            <InfoButton label={question.help ? t.questionHelpAria : t.axisInfoAria(axis.label)} onClick={() => setIsAxisInfoOpen(true)} />
          </div>
        ) : (
          <p className="question-axis">{axisLabel ?? question.axisId.replace('-', ' ')}</p>
        )}
        <h2 id="question-title"><GlossaryText text={question.text} terms={question.terms} /></h2>
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
      {axis && isAxisInfoOpen && (
        <InfoSheet
          titleId="quiz-axis-sheet-title"
          className={question.help ? 'e-question-sheet' : undefined}
          style={{ '--ac': agreeColor } as CSSProperties}
          onClose={() => setIsAxisInfoOpen(false)}
        >
          {question.help ? (
            <QuestionHelpContent help={question.help} />
          ) : (
            <>
              <p className="e-axis-sheet-label">{axis.label}</p>
              <h3 id="quiz-axis-sheet-title">
                {question.agreePole === 'LEFT' ? (
                  <><span>{axis.leftPole}</span> × {axis.rightPole}</>
                ) : (
                  <>{axis.leftPole} × <span>{axis.rightPole}</span></>
                )}
              </h3>
              <p className="e-axis-sheet-text">{t.axisExplanations[axis.id]}</p>
            </>
          )}
        </InfoSheet>
      )}
    </article>
  );
}

// O que concordar e discordar significam, com um país real de cada lado quando houver; a nota avisa quem pensa fora do enquadramento da pergunta.
function QuestionHelpContent({ help }: { help: QuestionHelp }) {
  const sides = [
    { key: 'agree', label: t.questionHelpAgree, text: help.agree, example: help.agreeExample },
    { key: 'disagree', label: t.questionHelpDisagree, text: help.disagree, example: help.disagreeExample }
  ];
  return (
    <>
      <h3 id="quiz-axis-sheet-title">{t.questionHelpTitle}</h3>
      <div className="e-question-sides">
        {sides.map((side) => (
          <section key={side.key} className={`e-question-side is-${side.key}`}>
            <h4>
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d={side.key === 'agree' ? 'm6 12 4 4 8-8' : 'm7 7 10 10M17 7 7 17'} />
                </svg>
              </i>
              {side.label}
            </h4>
            <p>{side.text}</p>
            {side.example && (
              <p className="e-question-example"><strong>{t.questionHelpExample}:</strong> {side.example}</p>
            )}
          </section>
        ))}
      </div>
      {help.note && (
        <p className="e-question-note"><strong>{t.questionHelpNote}:</strong> {help.note}</p>
      )}
    </>
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
