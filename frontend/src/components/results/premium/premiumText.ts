import { LANG } from '../../../i18n';
import type { AxisAnalysis, Disagreement, GovernmentSeat } from '../../../types/quiz';

// Textos do Relatório Completo. Ficam junto das seções (que carregam sob demanda) para quem não compra não baixar nada disto.
interface PremiumText {
  title: string;
  devBadge: string;
  loading: string;
  error: string;
  retry: string;
  historical: string;
  axisTitle: string;
  positions: { you: string; ideology: string; personality: string; country: string };
  levelLabels: Record<AxisAnalysis['level'], string>;
  disagreeTitle: string;
  disagreeKinds: Record<Disagreement['kind'], string>;
  disagreeLegendProfile: string;
  gapRank: (position: number) => string;
  governmentTitle: string;
  governmentRolesTitle: string;
  governmentSwap: {
    aria: (seat: string) => string;
    title: (seat: string) => string;
    lead: (category: string) => string;
    current: string;
    none: string;
    swapped: string;
    searchLabel: string;
    /** Quem já ocupa outro cargo: a busca avisa que ele troca de lugar. */
    holdsNow: (seat: string) => string;
    searchPlaceholder: string;
    searchNone: string;
    searchError: string;
    searching: string;
  };
  governmentRolesLead: string;
  /** Como cada parágrafo do cargo abre, por eixo ("Politicamente,", "No poder,"...). */
  roleAxis: Record<string, string>;
  /** Sujeito dos parágrafos seguintes ao primeiro, no lugar do nome; nulo quando o idioma o omite. */
  roleSubject: string | null;
  governmentWhy: (area: string, pct: number) => string;
  /** Cargo ocupado por uma escolha do usuário: não dá para dizer que é a figura mais próxima. */
  governmentWhySwapped: (pct: number) => string;
  timelineTitle: string;
  timelineEraNames: Record<'antiguidade' | 'medieval' | 'moderna' | 'xix' | 'xx' | 'xxi', string>;
  timelineRange: (from: number | null, to: number | null) => string;
  timelineCurrent: string;
  timelineBestEra: string;
  seats: Record<GovernmentSeat['seatKey'], string>;
  countriesTitle: string;
  saveTitle: string;
  saveIntro: string;
  saveField: string;
  saveCopy: string;
  saveCopied: string;
}

const pt: PremiumText = {
  title: 'Relatório completo',
  devBadge: 'Modo de desenvolvimento: aberto sem pagamento, só nesta máquina.',
  loading: 'Montando o seu relatório completo...',
  error: 'Não foi possível carregar o relatório. Tente de novo em instantes.',
  retry: 'Tentar de novo',
  historical: 'histórico',
  axisTitle: 'Análise completa, eixo a eixo',
  positions: { you: 'Você', ideology: 'Ideologia', personality: 'Personalidade', country: 'País' },
  levelLabels: { equilibrado: 'Equilibrado', inclinado: 'Inclinado', forte: 'Forte', muito_forte: 'Muito forte' },
  disagreeTitle: 'Onde você mais discorda',
  disagreeKinds: { ideology: 'da sua ideologia', personality: 'da sua personalidade', country: 'do seu país' },
  disagreeLegendProfile: 'Perfil',
  gapRank: (position) => (position === 1 ? 'Maior diferença' : `${position}ª maior diferença`),
  governmentTitle: 'Seu governo ideal',
  governmentRolesTitle: 'O papel de cada um no seu governo',
  governmentSwap: {
    aria: (seat) => `Trocar quem ocupa o cargo de ${seat}`,
    title: (seat) => `Trocar: ${seat}`,
    lead: (category) => `As figuras de ${category} mais compatíveis com você depois da atual. Escolha uma para montar o seu governo ideal.`,
    current: 'Atual',
    none: 'Não há outras figuras desta categoria para trocar.',
    swapped: 'Trocado por você',
    searchLabel: 'Ou busque qualquer outra figura',
    holdsNow: (seat) => `Hoje: ${seat}. Troca de lugar.`,
    searchPlaceholder: 'Digite um nome',
    searchNone: 'Ninguém encontrado com esse nome.',
    searchError: 'Não foi possível buscar agora. Tente de novo em instantes.',
    searching: 'Buscando…'
  },
  governmentRolesLead: 'Cada cargo é descrito a partir das suas posições nos eixos que mais pesam nele, para você ver por que o resultado saiu assim.',
  roleAxis: {
    estrutura: 'Na estrutura,',
    representacao: 'Politicamente,',
    poder: 'No poder,',
    imigracao: 'Na imigração,',
    diplomacia: 'Na diplomacia,',
    intervencao: 'Na intervenção,',
    economia: 'Na economia,',
    controle: 'No controle,',
    comercio: 'No comércio,',
    religiao: 'Na religião,',
    moral: 'Na moral,',
    tecnologia: 'Na tecnologia,'
  },
  roleSubject: null,
  governmentWhy: (area, pct) => `Ocupa o cargo por ser a figura mais próxima de você na categoria ${area}: ${pct}% de compatibilidade.`,
  governmentWhySwapped: (pct) => `Entrou no cargo pela sua troca: ${pct}% de compatibilidade com o seu resultado.`,
  timelineTitle: 'Sua linha do tempo ideológica',
  timelineEraNames: {
    antiguidade: 'Antiguidade',
    medieval: 'Idade Média',
    moderna: 'Idade Moderna',
    xix: 'Século XIX',
    xx: 'Século XX',
    xxi: 'Século XXI'
  },
  timelineRange: (from, to) => {
    const year = (value: number) => (value < 0 ? `${-value} a.C.` : String(value));
    if (from === null && to !== null) return `Até ${year(to)}`;
    if (to === null && from !== null) return `Desde ${year(from)}`;
    return `${year(from ?? 0)} a ${year(to ?? 0)}`;
  },
  timelineCurrent: 'Atual',
  timelineBestEra: 'Época mais compatível:',
  seats: {
    lider: 'Líder político',
    vice: 'Vice-líder político',
    economia: 'Responsável pela Economia',
    educacao: 'Responsável pela Educação',
    estrategia: 'Chefe da Estratégia Política',
    filosofia: 'Conselheiro Filosófico',
    social: 'Coordenador de Assuntos Sociais',
    industria: 'Coordenador de Indústria e Inovação',
    cultura: 'Conselheiro de Cultura'
  },
  countriesTitle: '10 países ou regiões para viver',
  saveTitle: 'Guarde o seu acesso',
  saveIntro: 'Para abrir este relatório em outro aparelho, ou depois de limpar o navegador, salve o link abaixo. Quem tiver o link abre o relatório deste resultado, então guarde-o com cuidado.',
  saveField: 'Link de acesso ao relatório',
  saveCopy: 'Copiar link',
  saveCopied: 'Link copiado',
};

const en: PremiumText = {
  title: 'Full report',
  devBadge: 'Development mode: open without payment, on this machine only.',
  loading: 'Building your full report...',
  error: 'Could not load the report. Please try again in a moment.',
  retry: 'Try again',
  historical: 'historical',
  axisTitle: 'Full analysis, axis by axis',
  positions: { you: 'You', ideology: 'Ideology', personality: 'Figure', country: 'Country' },
  levelLabels: { equilibrado: 'Balanced', inclinado: 'Leaning', forte: 'Strong', muito_forte: 'Very strong' },
  disagreeTitle: 'Where you disagree most',
  disagreeKinds: { ideology: 'with your ideology', personality: 'with your figure', country: 'with your country' },
  disagreeLegendProfile: 'Profile',
  gapRank: (position) => (position === 1 ? 'Biggest gap' : position === 2 ? '2nd biggest gap' : '3rd biggest gap'),
  governmentTitle: 'Your ideal government',
  governmentRolesTitle: 'Each member’s role in your government',
  governmentSwap: {
    aria: (seat) => `Swap who holds the ${seat} seat`,
    title: (seat) => `Swap: ${seat}`,
    lead: (category) => `The ${category} figures closest to you after the current one. Pick one to build your ideal government.`,
    current: 'Current',
    none: 'There are no other figures in this category to swap in.',
    swapped: 'Swapped by you',
    searchLabel: 'Or search for any other figure',
    holdsNow: (seat) => `Now: ${seat}. Swaps places.`,
    searchPlaceholder: 'Type a name',
    searchNone: 'Nobody found with that name.',
    searchError: 'Could not search right now. Please try again in a moment.',
    searching: 'Searching…'
  },
  governmentRolesLead: 'Each seat is described from your positions on the axes that weigh most in it, so you can see why the result came out this way.',
  roleAxis: {
    estrutura: 'On structure,',
    representacao: 'Politically,',
    poder: 'On power,',
    imigracao: 'On immigration,',
    diplomacia: 'On diplomacy,',
    intervencao: 'On intervention,',
    economia: 'On the economy,',
    controle: 'On control,',
    comercio: 'On trade,',
    religiao: 'On religion,',
    moral: 'On morals,',
    tecnologia: 'On technology,'
  },
  roleSubject: 'they',
  governmentWhy: (area, pct) => `Holds the seat as the figure closest to you in the ${area} category: ${pct}% compatibility.`,
  governmentWhySwapped: (pct) => `Took the seat through your swap: ${pct}% compatibility with your result.`,
  timelineTitle: 'Your ideological timeline',
  timelineEraNames: {
    antiguidade: 'Antiquity',
    medieval: 'Middle Ages',
    moderna: 'Early modern era',
    xix: '19th century',
    xx: '20th century',
    xxi: '21st century'
  },
  timelineRange: (from, to) => {
    const year = (value: number) => (value < 0 ? `${-value} BC` : String(value));
    if (from === null && to !== null) return `Until ${year(to)}`;
    if (to === null && from !== null) return `Since ${year(from)}`;
    return `${year(from ?? 0)} to ${year(to ?? 0)}`;
  },
  timelineCurrent: 'Current',
  timelineBestEra: 'Most compatible era:',
  seats: {
    lider: 'Political leader',
    vice: 'Deputy political leader',
    economia: 'Head of Economy',
    educacao: 'Head of Education',
    estrategia: 'Chief of Political Strategy',
    filosofia: 'Philosophical Adviser',
    social: 'Coordinator of Social Affairs',
    industria: 'Coordinator of Industry and Innovation',
    cultura: 'Cultural Adviser'
  },
  countriesTitle: '10 countries or regions to live in',
  saveTitle: 'Keep your access',
  saveIntro: 'To open this report on another device, or after clearing your browser, save the link below. Anyone with the link opens the report for this result, so keep it safe.',
  saveField: 'Report access link',
  saveCopy: 'Copy link',
  saveCopied: 'Link copied',
};

const es: PremiumText = {
  title: 'Informe completo',
  devBadge: 'Modo de desarrollo: abierto sin pago, solo en esta máquina.',
  loading: 'Preparando tu informe completo...',
  error: 'No se pudo cargar el informe. Inténtalo de nuevo en unos instantes.',
  retry: 'Intentar de nuevo',
  historical: 'histórico',
  axisTitle: 'Análisis completo, eje por eje',
  positions: { you: 'Tú', ideology: 'Ideología', personality: 'Personalidad', country: 'País' },
  levelLabels: { equilibrado: 'Equilibrado', inclinado: 'Inclinado', forte: 'Fuerte', muito_forte: 'Muy fuerte' },
  disagreeTitle: 'Donde más discrepas',
  disagreeKinds: { ideology: 'de tu ideología', personality: 'de tu personalidad', country: 'de tu país' },
  disagreeLegendProfile: 'Perfil',
  gapRank: (position) => (position === 1 ? 'Mayor diferencia' : position === 2 ? '2.ª mayor diferencia' : '3.ª mayor diferencia'),
  governmentTitle: 'Tu gobierno ideal',
  governmentRolesTitle: 'El papel de cada uno en tu gobierno',
  governmentSwap: {
    aria: (seat) => `Cambiar quién ocupa el cargo de ${seat}`,
    title: (seat) => `Cambiar: ${seat}`,
    lead: (category) => `Las figuras de ${category} más cercanas a ti después de la actual. Elige una para armar tu gobierno ideal.`,
    current: 'Actual',
    none: 'No hay otras figuras de esta categoría para cambiar.',
    swapped: 'Cambiado por ti',
    searchLabel: 'O busca cualquier otra figura',
    holdsNow: (seat) => `Hoy: ${seat}. Cambia de lugar.`,
    searchPlaceholder: 'Escribe un nombre',
    searchNone: 'No se encontró a nadie con ese nombre.',
    searchError: 'No se pudo buscar ahora. Inténtalo de nuevo en un momento.',
    searching: 'Buscando…'
  },
  governmentRolesLead: 'Cada cargo se describe a partir de tus posiciones en los ejes que más pesan en él, para que veas por qué el resultado salió así.',
  roleAxis: {
    estrutura: 'En la estructura,',
    representacao: 'En lo político,',
    poder: 'En el poder,',
    imigracao: 'En la inmigración,',
    diplomacia: 'En la diplomacia,',
    intervencao: 'En la intervención,',
    economia: 'En la economía,',
    controle: 'En el control,',
    comercio: 'En el comercio,',
    religiao: 'En la religión,',
    moral: 'En la moral,',
    tecnologia: 'En la tecnología,'
  },
  roleSubject: null,
  governmentWhy: (area, pct) => `Ocupa el cargo por ser la figura más cercana a ti en la categoría ${area}: ${pct}% de compatibilidad.`,
  governmentWhySwapped: (pct) => `Llegó al cargo por tu cambio: ${pct}% de compatibilidad con tu resultado.`,
  timelineTitle: 'Tu línea del tiempo ideológica',
  timelineEraNames: {
    antiguidade: 'Antigüedad',
    medieval: 'Edad Media',
    moderna: 'Edad Moderna',
    xix: 'Siglo XIX',
    xx: 'Siglo XX',
    xxi: 'Siglo XXI'
  },
  timelineRange: (from, to) => {
    const year = (value: number) => (value < 0 ? `${-value} a. C.` : String(value));
    if (from === null && to !== null) return `Hasta ${year(to)}`;
    if (to === null && from !== null) return `Desde ${year(from)}`;
    return `${year(from ?? 0)} a ${year(to ?? 0)}`;
  },
  timelineCurrent: 'Actual',
  timelineBestEra: 'Época más compatible:',
  seats: {
    lider: 'Líder político',
    vice: 'Vicelíder político',
    economia: 'Responsable de Economía',
    educacao: 'Responsable de Educación',
    estrategia: 'Jefe de Estrategia Política',
    filosofia: 'Consejero Filosófico',
    social: 'Coordinador de Asuntos Sociales',
    industria: 'Coordinador de Industria e Innovación',
    cultura: 'Consejero de Cultura'
  },
  countriesTitle: '10 países o regiones para vivir',
  saveTitle: 'Guarda tu acceso',
  saveIntro: 'Para abrir este informe en otro dispositivo, o después de borrar los datos del navegador, guarda el enlace de abajo. Quien tenga el enlace abre el informe de este resultado, así que guárdalo con cuidado.',
  saveField: 'Enlace de acceso al informe',
  saveCopy: 'Copiar enlace',
  saveCopied: 'Enlace copiado',
};

const de: PremiumText = {
  title: 'Vollständiger Bericht',
  devBadge: 'Entwicklungsmodus: ohne Zahlung geöffnet, nur auf diesem Rechner.',
  loading: 'Dein vollständiger Bericht wird erstellt...',
  error: 'Der Bericht konnte nicht geladen werden. Versuche es gleich noch einmal.',
  retry: 'Erneut versuchen',
  historical: 'historisch',
  axisTitle: 'Vollständige Analyse, Achse für Achse',
  positions: { you: 'Du', ideology: 'Ideologie', personality: 'Persönlichkeit', country: 'Land' },
  levelLabels: { equilibrado: 'Ausgeglichen', inclinado: 'Tendenz', forte: 'Stark', muito_forte: 'Sehr stark' },
  disagreeTitle: 'Wo du am meisten abweichst',
  disagreeKinds: { ideology: 'von deiner Ideologie', personality: 'von deiner Persönlichkeit', country: 'von deinem Land' },
  disagreeLegendProfile: 'Profil',
  gapRank: (position) => (position === 1 ? 'Größte Abweichung' : position === 2 ? '2. größte Abweichung' : '3. größte Abweichung'),
  governmentTitle: 'Deine ideale Regierung',
  governmentRolesTitle: 'Die Rolle jedes Mitglieds in deiner Regierung',
  governmentSwap: {
    aria: (seat) => `Besetzung ändern: ${seat}`,
    title: (seat) => `Tauschen: ${seat}`,
    lead: (category) => `Die Persönlichkeiten der Kategorie ${category} mit der höchsten Übereinstimmung mit dir nach der aktuellen. Wähle eine aus, um deine ideale Regierung zusammenzustellen.`,
    current: 'Aktuell',
    none: 'Es gibt keine weiteren Persönlichkeiten in dieser Kategorie zum Tauschen.',
    swapped: 'Von dir getauscht',
    searchLabel: 'Oder suche eine beliebige andere Persönlichkeit',
    holdsNow: (seat) => `Aktuell: ${seat}. Tauscht den Platz.`,
    searchPlaceholder: 'Name eingeben',
    searchNone: 'Niemand mit diesem Namen gefunden.',
    searchError: 'Die Suche ist gerade nicht möglich. Versuche es gleich noch einmal.',
    searching: 'Suche läuft…'
  },
  governmentRolesLead: 'Jedes Amt wird anhand deiner Positionen auf den Achsen beschrieben, die dafür am meisten zählen, damit du siehst, warum das Ergebnis so ausgefallen ist.',
  // Die Absätze nach dem ersten beginnen mit "diese Person würde ...": nach dem Doppelpunkt ein vollständiger Hauptsatz.
  roleAxis: {
    estrutura: 'Bei der Struktur:',
    representacao: 'Politisch:',
    poder: 'Bei der Macht:',
    imigracao: 'Bei der Einwanderung:',
    diplomacia: 'In der Diplomatie:',
    intervencao: 'Bei der Intervention:',
    economia: 'In der Wirtschaft:',
    controle: 'Bei der Steuerung:',
    comercio: 'Im Handel:',
    religiao: 'In der Religion:',
    moral: 'In der Moral:',
    tecnologia: 'In der Technologie:'
  },
  roleSubject: 'diese Person',
  governmentWhy: (area, pct) => `Hat das Amt inne, weil diese Persönlichkeit in der Kategorie ${area} am besten zu dir passt: ${pct} % Übereinstimmung.`,
  governmentWhySwapped: (pct) => `Ist durch deinen Tausch ins Amt gekommen: ${pct} % Übereinstimmung mit deinem Ergebnis.`,
  timelineTitle: 'Deine ideologische Zeitleiste',
  timelineEraNames: {
    antiguidade: 'Antike',
    medieval: 'Mittelalter',
    moderna: 'Frühe Neuzeit',
    xix: '19. Jahrhundert',
    xx: '20. Jahrhundert',
    xxi: '21. Jahrhundert'
  },
  timelineRange: (from, to) => {
    const year = (value: number) => (value < 0 ? `${-value} v. Chr.` : String(value));
    if (from === null && to !== null) return `Bis ${year(to)}`;
    if (to === null && from !== null) return `Seit ${year(from)}`;
    return `${year(from ?? 0)} bis ${year(to ?? 0)}`;
  },
  timelineCurrent: 'Aktuell',
  timelineBestEra: 'Epoche mit der höchsten Übereinstimmung:',
  seats: {
    lider: 'Politische Führung',
    vice: 'Stellvertretende politische Führung',
    economia: 'Verantwortlich für Wirtschaft',
    educacao: 'Verantwortlich für Bildung',
    estrategia: 'Leitung Politische Strategie',
    filosofia: 'Philosophischer Berater',
    social: 'Koordination Soziales',
    industria: 'Koordination Industrie und Innovation',
    cultura: 'Berater für Kultur'
  },
  countriesTitle: '10 Länder oder Regionen zum Leben',
  saveTitle: 'Bewahre deinen Zugang auf',
  saveIntro: 'Um diesen Bericht auf einem anderen Gerät oder nach dem Löschen des Browserspeichers zu öffnen, speichere den Link unten. Wer den Link hat, kann den Bericht zu diesem Ergebnis öffnen, also bewahre ihn sorgfältig auf.',
  saveField: 'Zugangslink zum Bericht',
  saveCopy: 'Link kopieren',
  saveCopied: 'Link kopiert',
};

export const P: PremiumText = LANG === 'pt' ? pt : LANG === 'es' ? es : LANG === 'de' ? de : en;
