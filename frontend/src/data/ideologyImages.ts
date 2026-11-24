/**
 * Imagem redonda opcional de uma ideologia (cartão do resultado). É automático: qualquer arquivo em
 * frontend/src/assets/ideologies/ cujo nome (sem a extensão) seja o ID da ideologia aparece, sem precisar registrar nada.
 * Ex.: aceleracionismo-de-direita.png. O id é o do ideologies.json (minúsculas, com hífens), não o nome exibido.
 * Formatos: png, webp, jpg, jpeg e svg.
 *
 * Os créditos (fonte, autor, licença) são opcionais e ficam em IDEOLOGY_IMAGE_CREDITS: com eles, a ficha "Sobre a ideologia"
 * mostra o botão "Fonte original". Antes de uma imagem entrar de vez, vale conferir a licença na página de origem (domínio
 * público, CC0, CC BY ou CC BY-SA são as que permitem o uso).
 */
const FILES = import.meta.glob('../assets/ideologies/*.{png,webp,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

// id da ideologia (nome do arquivo sem a extensão) -> endereço do arquivo
const URL_BY_ID: Record<string, string> = Object.fromEntries(
  Object.entries(FILES).map(([path, url]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), url])
);

/** Endereço da imagem da ideologia, ou null quando não há arquivo com o id dela (ou o id é estranho). */
export function ideologyImageUrl(ideologyId: string | undefined): string | null {
  return ideologyId && Object.prototype.hasOwnProperty.call(URL_BY_ID, ideologyId) ? URL_BY_ID[ideologyId] : null;
}

export interface IdeologyImageCredit {
  sourceUrl: string | null;
  author: string | null;
  license: string | null;
}

/** Créditos opcionais por id de ideologia. Imagem sem crédito aqui aparece do mesmo jeito, só sem o botão de fonte. */
export const IDEOLOGY_IMAGE_CREDITS: Record<string, IdeologyImageCredit> = {
  // Bandeira do Neorreacionarismo (wiki do Polcompball). Licença ainda não verificada: a página bloqueia acesso automático.
  neorreacionarismo: { sourceUrl: 'https://wiki.polcompball.co.uk/File:Nrx_flag.svg', author: null, license: null }
};
