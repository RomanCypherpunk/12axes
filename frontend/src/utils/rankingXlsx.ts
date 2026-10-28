import type { PremiumRanking, RankingRow } from '../types/quiz';
import { resolveIdeologyColor } from './ideologyColors';

type Lang = 'pt' | 'en';
type Kind = keyof PremiumRanking;

interface SheetText {
  name: string;
  /** Rótulo da coluna do nome: "Partido", "País"... */
  subject: string;
  /** Países e partidos têm perfis históricos; ideologias e personalidades, não. */
  hasHistorical: boolean;
}

const KINDS: Kind[] = ['ideologies', 'personalities', 'countries', 'parties'];

const TEXT: Record<Lang, Record<Kind, SheetText>> = {
  pt: {
    ideologies: { name: 'Ideologias', subject: 'Ideologia', hasHistorical: false },
    personalities: { name: 'Personalidades', subject: 'Personalidade', hasHistorical: false },
    countries: { name: 'Países', subject: 'País', hasHistorical: true },
    parties: { name: 'Partidos', subject: 'Partido', hasHistorical: true }
  },
  en: {
    ideologies: { name: 'Ideologies', subject: 'Ideology', hasHistorical: false },
    personalities: { name: 'Figures', subject: 'Figure', hasHistorical: false },
    countries: { name: 'Countries', subject: 'Country', hasHistorical: true },
    parties: { name: 'Parties', subject: 'Party', hasHistorical: true }
  }
};

const COLUMNS: Record<Lang, { position: string; category: string; historical: string; compatibility: string; yes: string; no: string }> = {
  pt: { position: 'Posição', category: 'Categoria', historical: 'Histórico', compatibility: 'Compatibilidade', yes: 'Sim', no: 'Não' },
  en: { position: 'Position', category: 'Category', historical: 'Historical', compatibility: 'Compatibility', yes: 'Yes', no: 'No' }
};

export interface RankingSheet {
  name: string;
  headers: string[];
  /** Largura de cada coluna, em caracteres. */
  widths: number[];
  rows: { cells: (string | number)[]; category: string }[];
  /** Índice da coluna da categoria, que leva a cor do espectro político dela. */
  categoryColumn: number;
  /** Índice da coluna de compatibilidade (fração, formatada como %). */
  compatibilityColumn: number;
}

/** Uma planilha por tipo de perfil: posição, nome, categoria, histórico (só países e partidos) e compatibilidade. */
export function rankingSheets(ranking: PremiumRanking, lang: Lang): RankingSheet[] {
  const columns = COLUMNS[lang];
  return KINDS.map((kind) => {
    const text = TEXT[lang][kind];
    const headers = [columns.position, text.subject, columns.category, ...(text.hasHistorical ? [columns.historical] : []), columns.compatibility];
    const rows = ranking[kind].map((row: RankingRow, index) => ({
      category: row.category,
      cells: [
        index + 1,
        row.name,
        row.category,
        ...(text.hasHistorical ? [row.historical ? columns.yes : columns.no] : []),
        // Fração: a célula mostra "87,3%" no formato de porcentagem e continua sendo um número que dá para ordenar.
        Math.round(row.compatibility * 10) / 1000
      ]
    }));
    return {
      name: text.name,
      headers,
      widths: text.hasHistorical ? [10, 44, 22, 12, 17] : [10, 44, 22, 17],
      rows,
      categoryColumn: 2,
      compatibilityColumn: headers.length - 1
    };
  });
}

const argb = (hex: string): string => `FF${hex.replace('#', '').toUpperCase()}`;

/**
 * Baixa o ranking completo como planilha (.xlsx), uma aba por tipo. O cabeçalho e as listras usam a cor da categoria do
 * resultado (Sora no cabeçalho, Poppins no corpo) e a coluna de categoria leva a cor do espectro de cada linha.
 * A biblioteca é grande e só carrega quando alguém clica em exportar.
 */
export async function downloadRankingXlsx(ranking: PremiumRanking, lang: Lang, userCategory: string): Promise<void> {
  const { default: ExcelJS } = await import('exceljs');
  const palette = resolveIdeologyColor(userCategory);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = '12 Axes';

  for (const sheet of rankingSheets(ranking, lang)) {
    const worksheet = workbook.addWorksheet(sheet.name, { views: [{ state: 'frozen', ySplit: 1 }] });
    worksheet.columns = sheet.widths.map((width) => ({ width }));

    const header = worksheet.addRow(sheet.headers);
    header.height = 26;
    header.eachCell((cell, column) => {
      cell.font = { name: 'Sora', bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(palette.base) } };
      cell.alignment = { vertical: 'middle', horizontal: column - 1 === sheet.compatibilityColumn ? 'right' : 'left', indent: 1 };
    });

    sheet.rows.forEach((row, index) => {
      const line = worksheet.addRow(row.cells);
      line.height = 20;
      const stripe = index % 2 === 0 ? undefined : argb(palette.bg);
      line.eachCell((cell, column) => {
        const own = column - 1 === sheet.categoryColumn ? resolveIdeologyColor(row.category) : null;
        cell.font = { name: 'Poppins', size: 10, bold: own !== null, color: { argb: own ? argb(own.base) : 'FF101010' } };
        const fill = own ? argb(own.bg) : stripe;
        if (fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
        cell.alignment = { vertical: 'middle', horizontal: column - 1 === sheet.compatibilityColumn ? 'right' : 'left', indent: 1 };
        if (column - 1 === sheet.compatibilityColumn) cell.numFmt = '0.0%';
      });
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '12axes-ranking.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
