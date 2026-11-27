// Entrada do build (Node): monta o HTML das páginas da wiki com os componentes da página de resultados.
// Um módulo por idioma: o dicionário (`t`) é fixado por globalThis.__WIKI_LANG antes de importar este arquivo.
import { renderToString } from 'react-dom/server';
import type { Religion } from '../utils/religion';
import { wikiElement, type WikiProps } from './element';
import { loadCatalogs } from './engine/catalogs.ts';
import { buildProfileResult } from './engine/profileResult.ts';
import { profileReligion } from './engine/religion.ts';

export function renderWiki(props: WikiProps): string {
  return renderToString(wikiElement(props));
}

/** Religião usada no ícone dos valores religiosos: a primeira selecionável do perfil. */
export function iconReligion(religions: string[] | undefined): Religion | null {
  const preference = profileReligion(religions);
  return preference && preference !== 'other' ? (preference.split(',')[0] as Religion) : null;
}

export { buildProfileResult, loadCatalogs };
