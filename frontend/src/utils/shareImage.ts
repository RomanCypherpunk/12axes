import type { Axis, QuizPayload, QuizResult, QuizVariant } from '../types/quiz';
import type { Religion } from './religion';

/** Quiz mínimo para montar o cartão quando o resultado veio de um link (sem o quiz carregado). */
export function exportQuizFor(quiz: QuizPayload | null, axes: Axis[], variant: QuizVariant): QuizPayload {
  return (
    quiz ?? {
      title: '',
      description: '',
      variant,
      questionCount: 0,
      questionsPerAxis: 0,
      axes,
      questions: [],
      answerOptions: []
    }
  );
}

async function loadShareFonts(): Promise<void> {
  if (!document.fonts) {
    return;
  }
  await Promise.allSettled([
    document.fonts.load('400 30px "Poppins"'),
    document.fonts.load('500 30px "Poppins"'),
    document.fonts.load('600 30px "Poppins"'),
    document.fonts.load('600 30px "Sora"'),
    document.fonts.load('700 30px "Sora"'),
    document.fonts.load('800 30px "Sora"')
  ]);
  await document.fonts.ready;
}

/** Gera o PNG 1080x1920 do cartão de compartilhamento (data URL), o mesmo do botão "Compartilhar resultado". */
export async function createSharePng(result: QuizResult, quiz: QuizPayload, religion: Religion | null): Promise<string> {
  let stage: HTMLDivElement | null = null;
  try {
    await loadShareFonts();
    const [{ toPng }, shareCard] = await Promise.all([import('html-to-image'), import('./shareCard')]);
    const { stage: builtStage, target } = shareCard.buildShareCard(result, quiz, religion);
    stage = builtStage;
    document.body.appendChild(stage);
    return await shareCard.renderSharePng(target, toPng);
  } finally {
    stage?.remove();
  }
}
