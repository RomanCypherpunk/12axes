import { t } from '../../i18n';
import type { QuizVariant } from '../../types/quiz';

export interface QuizFormat {
  variant: QuizVariant;
  label: string;
  count: string;
  countWord: string;
  description: string;
  duration: string;
  action: string;
  depth: number;
  featured: boolean;
}

function build(variant: QuizVariant, depth: number, featured = false): QuizFormat {
  const source = t.formats[variant === 'short' ? 'short' : variant === 'extended' ? 'extended' : 'extreme'];
  const [count, ...word] = source.questionCount.split(' ');
  return {
    variant,
    label: source.label,
    count,
    countWord: word.join(' '),
    description: source.description,
    duration: source.duration,
    action: source.action,
    depth,
    featured
  };
}

export const QUIZ_FORMATS: QuizFormat[] = [build('short', 1), build('extended', 2, true), build('extreme', 3)];
