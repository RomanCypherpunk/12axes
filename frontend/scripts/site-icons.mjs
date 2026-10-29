// <link> dos ícones do site para as páginas geradas. Com VITE_ASSETS_CDN (a mesma origem que serve /assets), os ícones
// saem da CDN em vez da hospedagem do HTML: cada visita pede de 3 a 4 deles, e na Vercel todo pedido é cobrado.
// Sem a variável (build local), os endereços ficam relativos ao próprio site.
const CDN = (process.env.VITE_ASSETS_CDN ?? '').trim().replace(/\/+$/, '');

export function iconLinks() {
  return `<link rel="icon" type="image/x-icon" href="${CDN}/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="${CDN}/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="${CDN}/apple-touch-icon.png" />`;
}
