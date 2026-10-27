import { t } from '../../i18n';
import type { Axis, QuizPayload, QuizResult } from '../../types/quiz';
import { resolveIdeologyColor } from '../../utils/ideologyColors';
import { createSharePng, exportQuizFor } from '../../utils/shareImage';
import type { Religion } from '../../utils/religion';
import { SharePhoneStage, stageColors, useSharePreview } from './SharePhoneStage';

interface SharePreviewSectionProps {
  result: QuizResult;
  quiz: QuizPayload | null;
  axes: Axis[];
  religion?: Religion | null;
  isSharing: boolean;
  onShare: () => void;
}

/**
 * Prévia do cartão de compartilhamento do resultado (o mesmo cartão do botão "Compartilhar resultado"),
 * gerada só quando a seção está perto de aparecer na tela.
 */
export function SharePreviewSection({ result, quiz, axes, religion = null, isSharing, onShare }: SharePreviewSectionProps) {
  const { ref, status, src } = useSharePreview(() => createSharePng(result, exportQuizFor(quiz, axes, 'short'), religion), [result, quiz, axes, religion]);

  if (status === 'error') {
    return null;
  }
  return (
    <SharePhoneStage
      id="compartilhar"
      title={t.sharePreviewTitle}
      colors={stageColors(resolveIdeologyColor(result.topMatch.category))}
      src={src}
      isSharing={isSharing}
      onShare={onShare}
      sectionRef={ref}
    />
  );
}
