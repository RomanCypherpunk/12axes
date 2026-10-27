import qrcode from 'qrcode-generator';

/**
 * Módulos (quadradinhos) de um QR code para o texto, como matriz de booleanos (true = escuro).
 * Nível de correção "M" por padrão; "L" cabe mais dados e serve aos links maiores.
 */
export function qrModules(text: string, level: 'L' | 'M' = 'M'): boolean[][] {
  const qr = qrcode(0, level);
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  return Array.from({ length: count }, (_, row) => Array.from({ length: count }, (_, column) => qr.isDark(row, column)));
}
