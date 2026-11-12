/**
 * Chave curta dos valores completos no link do resultado (`f=`, ver FullValuesKey no backend): 10 caracteres
 * base64url. Só serve para mostrar os valores; o vetor dos eixos continua sendo o resultado.
 */
const KEY_SHAPE = /^[A-Za-z0-9_-]{10}$/;

/** "&f=<chave>" para acrescentar ao link, ou "" quando não há chave (ou ela não tem a forma certa): o link fica como antes. */
export function fullValuesParam(key: string | null | undefined): string {
  return key && KEY_SHAPE.test(key) ? `&f=${key}` : '';
}

/** A chave `f` do endereço, ou null se faltar ou estiver malformada. */
export function readFullValuesKey(search: string): string | null {
  const key = new URLSearchParams(search).get('f');
  return key && KEY_SHAPE.test(key) ? key : null;
}
