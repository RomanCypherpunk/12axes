import { LANG } from '../../../i18n';
import type { AnswerValue, AxisAnalysis, Disagreement, GovernmentSeat } from '../../../types/quiz';

// Textos do Relatório Completo. Ficam junto das seções (que carregam sob demanda) para quem não compra não baixar nada disto.
interface PremiumText {
  title: string;
  devBadge: string;
  loading: string;
  error: string;
  retry: string;
  historical: string;
  axisTitle: string;
  impactsTitle: string;
  positions: { you: string; ideology: string; personality: string; country: string };
  answerLabels: Record<AnswerValue, string>;
  levelLabels: Record<AxisAnalysis['level'], string>;
  points: (value: number) => string;
  disagreeTitle: string;
  disagreeKinds: Record<Disagreement['kind'], string>;
  disagreeLegendProfile: string;
  gapRank: (position: number) => string;
  disagreeCaption: (userPct: number, userPole: string, profileName: string, profilePct: number, profilePole: string) => string;
  governmentTitle: string;
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
  impactsTitle: 'O que mais pesou nas suas respostas',
  positions: { you: 'Você', ideology: 'Ideologia', personality: 'Personalidade', country: 'País' },
  answerLabels: {
    STRONGLY_AGREE: 'Concordou totalmente',
    AGREE: 'Concordou',
    NEUTRAL: 'Neutro',
    DISAGREE: 'Discordou',
    STRONGLY_DISAGREE: 'Discordou totalmente'
  },
  levelLabels: { equilibrado: 'Equilibrado', inclinado: 'Inclinado', forte: 'Forte', muito_forte: 'Muito forte' },
  points: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1).replace('.', ',')} pts`,
  disagreeTitle: 'Onde você mais discorda',
  disagreeKinds: { ideology: 'da sua ideologia', personality: 'da sua personalidade', country: 'do seu país' },
  disagreeLegendProfile: 'Perfil',
  gapRank: (position) => (position === 1 ? 'Maior diferença' : `${position}ª maior diferença`),
  disagreeCaption: (userPct, userPole, profileName, profilePct, profilePole) =>
    `Você fica em ${Math.round(userPct)}% ${userPole}; ${profileName}, em ${Math.round(profilePct)}% ${profilePole}.`,
  governmentTitle: 'Seu governo ideal',
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
  impactsTitle: 'What weighed most in your answers',
  positions: { you: 'You', ideology: 'Ideology', personality: 'Figure', country: 'Country' },
  answerLabels: {
    STRONGLY_AGREE: 'Strongly agreed',
    AGREE: 'Agreed',
    NEUTRAL: 'Neutral',
    DISAGREE: 'Disagreed',
    STRONGLY_DISAGREE: 'Strongly disagreed'
  },
  levelLabels: { equilibrado: 'Balanced', inclinado: 'Leaning', forte: 'Strong', muito_forte: 'Very strong' },
  points: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)} pts`,
  disagreeTitle: 'Where you disagree most',
  disagreeKinds: { ideology: 'with your ideology', personality: 'with your figure', country: 'with your country' },
  disagreeLegendProfile: 'Profile',
  gapRank: (position) => (position === 1 ? 'Biggest gap' : position === 2 ? '2nd biggest gap' : '3rd biggest gap'),
  disagreeCaption: (userPct, userPole, profileName, profilePct, profilePole) =>
    `You sit at ${Math.round(userPct)}% ${userPole}; ${profileName}, at ${Math.round(profilePct)}% ${profilePole}.`,
  governmentTitle: 'Your ideal government',
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

const fr: PremiumText = {
  title: 'Rapport complet',
  devBadge: 'Mode développement : ouvert sans paiement, uniquement sur cette machine.',
  loading: 'Préparation de votre rapport complet...',
  error: 'Impossible de charger le rapport. Réessayez dans un instant.',
  retry: 'Réessayer',
  historical: 'historique',
  axisTitle: 'Analyse complète, axe par axe',
  impactsTitle: 'Ce qui a le plus pesé dans vos réponses',
  positions: { you: 'Vous', ideology: 'Idéologie', personality: 'Figure', country: 'Pays' },
  answerLabels: {
    STRONGLY_AGREE: "Tout à fait d'accord",
    AGREE: "D'accord",
    NEUTRAL: 'Neutre',
    DISAGREE: 'Pas d’accord',
    STRONGLY_DISAGREE: 'Pas du tout d’accord'
  },
  levelLabels: { equilibrado: 'Équilibré', inclinado: 'Incliné', forte: 'Fort', muito_forte: 'Très fort' },
  points: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1).replace('.', ',')} pts`,
  disagreeTitle: 'Là où vous êtes le plus en désaccord',
  disagreeKinds: {
    ideology: 'avec votre idéologie',
    personality: 'avec votre figure',
    country: 'avec votre pays'
  },
  disagreeLegendProfile: 'Profil',
  gapRank: (position) =>
    position === 1 ? 'Plus grand écart' : position === 2 ? '2e plus grand écart' : '3e plus grand écart',
  disagreeCaption: (userPct, userPole, profileName, profilePct, profilePole) =>
    `Vous êtes à ${Math.round(userPct)}% ${userPole} ; ${profileName}, à ${Math.round(profilePct)}% ${profilePole}.`,
  governmentTitle: 'Votre gouvernement idéal',
  timelineTitle: 'Votre frise idéologique',
  timelineEraNames: {
    antiguidade: 'Antiquité',
    medieval: 'Moyen Âge',
    moderna: 'Époque moderne',
    xix: 'XIXe siècle',
    xx: 'XXe siècle',
    xxi: 'XXIe siècle'
  },
  timelineRange: (from, to) => {
    const year = (value: number) => (value < 0 ? `${-value} av. J.-C.` : String(value));
    if (from === null && to !== null) return `Jusqu’à ${year(to)}`;
    if (to === null && from !== null) return `Depuis ${year(from)}`;
    return `${year(from ?? 0)} à ${year(to ?? 0)}`;
  },
  timelineCurrent: 'Actuel',
  timelineBestEra: 'Époque la plus compatible :',
  seats: {
    lider: 'Dirigeant politique',
    vice: 'Vice-dirigeant politique',
    economia: 'Responsable de l’Économie',
    educacao: 'Responsable de l’Éducation',
    estrategia: 'Chef de la stratégie politique',
    filosofia: 'Conseiller philosophique',
    social: 'Coordinateur des affaires sociales',
    industria: 'Coordinateur de l’industrie et de l’innovation',
    cultura: 'Conseiller culturel'
  },
  countriesTitle: '10 pays ou régions où vivre',
  saveTitle: 'Conservez votre accès',
  saveIntro:
    'Pour ouvrir ce rapport sur un autre appareil, ou après avoir effacé le navigateur, enregistrez le lien ci-dessous. Quiconque dispose du lien ouvre le rapport de ce résultat, alors gardez-le en sécurité.',
  saveField: 'Lien d’accès au rapport',
  saveCopy: 'Copier le lien',
  saveCopied: 'Lien copié'
};

export const P: PremiumText = LANG === 'en' ? en : LANG === 'fr' ? fr : pt;
