// Monta a página da wiki a partir das props (o mesmo no build e na hidratação do navegador).
import { t } from '../i18n';
import type { Axis, QuizResult } from '../types/quiz';
import type { Religion } from '../utils/religion';
import type { Lang } from './engine/result.ts';
import { applyPerspective, WIKI_LIST_TEXT, WIKI_TEXT, type WikiKind } from './strings';
import { WikiCatalogIndex, type WikiListItem } from './WikiCatalogIndex';
import { WikiProfilePage, type WikiSubject } from './WikiProfilePage';

export interface ProfileProps {
  kind: 'profile';
  lang: Lang;
  subject: WikiSubject;
  result: QuizResult;
  axes: Axis[];
  religion: Religion | null;
}

export interface IndexProps {
  kind: 'index';
  lang: Lang;
  catalog: WikiKind;
  items: WikiListItem[];
  groups: { id: string; label: string; count: number }[];
  groupColors?: Record<string, string>;
}

export type WikiProps = ProfileProps | IndexProps;

export function wikiElement(props: WikiProps) {
  const text = WIKI_TEXT[props.lang];
  if (props.kind === 'index') {
    return <WikiCatalogIndex items={props.items} groups={props.groups} groupColors={props.groupColors} text={text} list={WIKI_LIST_TEXT[props.lang][props.catalog]} />;
  }
  applyPerspective(t, props.lang, props.subject.name, props.subject.kind);
  return <WikiProfilePage subject={props.subject} result={props.result} axes={props.axes} religion={props.religion} text={text} />;
}

