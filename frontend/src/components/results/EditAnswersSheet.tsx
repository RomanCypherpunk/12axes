import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { t } from '../../i18n';
import type { AnswerValue, ArchetypeQuestion, Axis, AxisResult, Question, QuizPayload } from '../../types/quiz';
import { changedArchetypeIds, changedQuestionIds, countChanges, type AnswerSet } from '../../utils/editAnswers';
import type { Religion } from '../../utils/religion';
import { ArchetypeCard } from '../ArchetypeCard';
import { PoleIcon } from '../AxisIcon';
import { QuestionCard } from '../QuestionCard';
import { InfoSheet } from './InfoSheet';

const ARCHETYPE = 'archetype';
const RELIGION = 'religion';
// Ids das perguntas de religião e de vertente cristã (os mesmos de App.tsx): formam o grupo "Sua religião".
const RELIGION_STEP_IDS = new Set(['religiao', 'denominacao']);
// Quantas cartas aparecem ao mesmo tempo: a da frente, as duas de trás e a que acabou de sair.
const VISIBLE_AHEAD = 2;

type Step =
  | { kind: 'question'; group: string; question: Question }
  | { kind: 'archetype'; group: string; question: ArchetypeQuestion };

interface EditAnswersSheetProps {
  /** Quiz reconstruído com as mesmas perguntas, na mesma ordem em que a pessoa respondeu. */
  quiz: QuizPayload;
  axes: Axis[];
  /** Resultado atual por eixo: o botão de cada eixo mostra o polo em que a pessoa ficou mais forte. */
  axisResults: Map<string, AxisResult>;
  religion?: Religion | null;
  initial: AnswerSet;
  /** Perguntas de arquétipo e religião (a da vertente cristã só existe se a religião for o cristianismo). */
  buildSteps: (choices: Record<string, string>) => ArchetypeQuestion[];
  /** Tira escolhas que deixaram de valer (a vertente cristã, se a religião mudou). */
  normalizeChoices: (choices: Record<string, string>) => Record<string, string>;
  isSaving: boolean;
  error: string | null;
  onSave: (edited: AnswerSet) => void;
  onClose: () => void;
}

const arrow = (flip = false) => (
  <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: 'rotate(180deg)' } : undefined}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

/**
 * Edita as respostas de um quiz já feito. À esquerda ficam os 12 eixos (mais arquétipo e religião); à direita, as
 * perguntas do eixo escolhido como um baralho de cartas, que passam com Voltar e Avançar. "Gravar" recalcula o resultado.
 */
export function EditAnswersSheet({ quiz, axes, axisResults, religion, initial, buildSteps, normalizeChoices, isSaving, error, onSave, onClose }: EditAnswersSheetProps) {
  const [answers, setAnswers] = useState(initial.answers);
  const [choices, setChoices] = useState(initial.archetypeChoices);
  const [position, setPosition] = useState(0);

  const edited: AnswerSet = { answers, archetypeChoices: normalizeChoices(choices) };
  const changes = countChanges(initial, edited);
  const changedQuestions = useMemo(() => new Set(changedQuestionIds(initial, edited)), [initial, answers, choices]);
  const changedChoices = useMemo(() => new Set(changedArchetypeIds(initial, edited)), [initial, answers, choices]);

  // Todas as cartas em ordem: eixo a eixo (na ordem dos eixos) e, por fim, arquétipo e religião.
  const steps: Step[] = useMemo(() => {
    const byAxis = new Map<string, Question[]>();
    quiz.questions.forEach((question) => byAxis.set(question.axisId, [...(byAxis.get(question.axisId) ?? []), question]));
    const list: Step[] = [];
    axes.forEach((axis) => (byAxis.get(axis.id) ?? []).forEach((question) => list.push({ kind: 'question', group: axis.id, question })));
    buildSteps(choices).forEach((question) =>
      list.push({ kind: 'archetype', group: RELIGION_STEP_IDS.has(question.id) ? RELIGION : ARCHETYPE, question })
    );
    return list;
  }, [quiz, axes, buildSteps, choices]);

  const index = Math.min(position, steps.length - 1);
  const current = steps[index];
  const groupSteps = steps.filter((item) => item.group === current.group);
  const groupFirst = steps.findIndex((item) => item.group === current.group);
  const inGroup = index - groupFirst;

  const isChanged = (item: Step) => (item.kind === 'question' ? changedQuestions.has(item.question.id) : changedChoices.has(item.question.id));
  const groups = [
    ...axes
      .filter((axis) => steps.some((item) => item.group === axis.id))
      .map((axis) => {
        // Sempre há um polo: o que passa de 50% (empate em 50% fica com o da esquerda).
        const side = (axisResults.get(axis.id)?.rightPercent ?? 0) > 50 ? ('right' as const) : ('left' as const);
        return { id: axis.id, label: axis.label, color: (side === 'right' ? axis.rightColor : axis.leftColor) as string | undefined, side };
      }),
    { id: ARCHETYPE, label: t.editAnswersArchetype, color: undefined as string | undefined, side: null },
    { id: RELIGION, label: t.editAnswersReligion, color: undefined as string | undefined, side: null }
  ].map((group) => ({
    ...group,
    first: steps.findIndex((item) => item.group === group.id),
    edits: steps.filter((item) => item.group === group.id && isChanged(item)).length
  }));

  const close = () => {
    if (changes > 0 && !window.confirm(t.editAnswersDiscard)) {
      return;
    }
    onClose();
  };

  const goTo = (next: number) => setPosition(Math.max(0, Math.min(steps.length - 1, next)));

  // Setas do teclado passam as cartas, como os botões.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'ArrowLeft') goTo(index - 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const counter =
    current.kind === 'question'
      ? t.progress(inGroup + 1, groupSteps.length)
      : `${groups.find((group) => group.id === current.group)?.label} · ${inGroup + 1}/${groupSteps.length}`;

  return (
    <InfoSheet titleId="e-edit-title" className="e-edit-sheet" onClose={close}>
      <header className="e-edit-head">
        <h3 id="e-edit-title">{t.editAnswersTitle}</h3>
        <span className="e-edit-count" aria-live="polite">
          {t.editAnswersChanged(changes)}
        </span>
        <button className="e-btn e-btn-primary e-btn-sm e-edit-save" type="button" onClick={() => onSave(edited)} disabled={changes === 0 || isSaving}>
          {isSaving ? t.editAnswersSaving : t.editAnswersSave}
        </button>
      </header>

      <div className="e-edit-layout">
        <nav className="e-edit-axes" role="tablist" aria-label={t.editAnswersGroupsAria}>
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={current.group === group.id}
              className={current.group === group.id ? 'e-edit-axis e-on' : 'e-edit-axis'}
              data-extra={group.id === ARCHETYPE || group.id === RELIGION ? group.id : undefined}
              style={group.color ? ({ '--gc': group.color } as CSSProperties) : undefined}
              onClick={() => goTo(group.first)}
            >
              {group.side && <PoleIcon axisId={group.id} side={group.side} className="e-ico e-edit-axis-ico" religion={religion} />}
              <span>{group.label}</span>
              {group.edits > 0 && <span className="e-edit-badge">{group.edits}</span>}
            </button>
          ))}
        </nav>

        <section className="e-edit-stage" aria-label={counter}>
          <div className="e-deck-edit">
            {groupSteps.map((item, offset) => {
              const pos = offset - inGroup;
              if (pos < -1 || pos > VISIBLE_AHEAD) {
                return null;
              }
              const dataPos = pos < 0 ? 'out' : String(pos);
              const id = item.question.id;
              return (
                <div
                  key={`${item.group}:${id}`}
                  className={isChanged(item) ? 'e-edit-card is-changed' : 'e-edit-card'}
                  data-pos={dataPos}
                  aria-hidden={pos !== 0}
                  {...(pos !== 0 ? ({ inert: '' } as Record<string, string>) : {})}
                >
                  {item.kind === 'question' ? (
                    <QuestionCard
                      question={item.question}
                      axis={quiz.axes.find((axis) => axis.id === item.question.axisId)}
                      axisLabel={axes.find((axis) => axis.id === item.question.axisId)?.label}
                      number={quiz.questions.findIndex((question) => question.id === id) + 1}
                      options={quiz.answerOptions}
                      selected={answers[id]}
                      disabled={isSaving}
                      titleId={`edit-title-${id}`}
                      onSelect={(answer: AnswerValue) => setAnswers((state) => ({ ...state, [id]: answer }))}
                    />
                  ) : (
                    <ArchetypeCard
                      question={item.question}
                      index={steps.filter((step) => step.kind === 'archetype').indexOf(item)}
                      selected={choices[id]}
                      disabled={isSaving}
                      titleId={`edit-title-${id}`}
                      onSelect={(optionId) => setChoices((state) => ({ ...state, [id]: optionId }))}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <nav className="e-edit-foot" aria-label={t.quizNavAria}>
            <button className="e-btn e-btn-ghost e-btn-sm" type="button" onClick={() => goTo(index - 1)} disabled={index === 0 || isSaving}>
              {arrow(true)}
              {t.back}
            </button>
            <span className="e-edit-counter">{counter}</span>
            <button className="e-btn e-btn-ghost e-btn-sm" type="button" onClick={() => goTo(index + 1)} disabled={index >= steps.length - 1 || isSaving}>
              {t.next}
              {arrow()}
            </button>
          </nav>
        </section>
      </div>
    </InfoSheet>
  );
}
