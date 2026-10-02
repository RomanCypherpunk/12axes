const common = {
  skip: 'Aller au contenu', catalogNav: 'Catalogue', homeAria: '12 Axes, page d’accueil',
  eyebrow: 'Catalogue', takeTheTest: 'Faire le test', viewProfile: 'Voir le profil',
  footer: 'Quiz politique indépendant · 12axes.vercel.app',
  flagAlt: (name) => `Drapeau : ${name}`, portraitAlt: (name) => `Portrait de ${name}`,
  axesEyebrow: 'Axes politiques', axesTitle: 'Profil sur les 12 axes',
  tabs: { axes: 'Axes', ideologies: 'Idéologies', personalities: 'Personnalités', countries: 'Pays' },
  ids: { axes: 'axes', ideologies: 'ideologies', personalities: 'personalities', countries: 'countries' },
  rareTag: 'Position la plus singulière', commonTag: 'Position la plus courante',
  rareNote: (axis) => `Parmi tous les axes, ${axis} est celui qui s’écarte le plus du catalogue.`,
  commonText: (axis, exact) => `Sur l’axe ${axis}, ce profil se situe ${exact ? 'presque exactement à' : 'près de'} la médiane du catalogue.`,
  ideologyEyebrow: 'Proximité idéologique', distantIdeology: 'L’idéologie la plus éloignée',
  matchWord: 'compatibilité', mostCompatible: 'Le plus compatible',
  byDimension: 'Les plus proches, par dimension', alsoByDimension: 'Également proches, par dimension',
  dimensionLabels: { political: 'Politiquement', social: 'Socialement', economic: 'Économiquement' },
  nearSub: 'Autres profils compatibles', farPeople: 'Les plus éloignées', farCountries: 'Les plus éloignés',
  countryTabsAria: 'Type de pays', currentTab: 'Pays actuel', historicalTab: 'Expérience historique',
  currentKicker: 'Pays actuel le plus compatible', historicalKicker: 'Expérience historique la plus compatible',
  kpiClosestIdeology: 'Idéologie la plus proche', kpiClosestPerson: 'Personnalité la plus proche',
  emptyText: 'Essayez un autre terme ou effacez les filtres.', clear: 'Effacer les filtres',
  legendAria: 'Pôles de chaque axe, dans l’ordre des icônes',
  dnaNote: '<b>Comment lire les 12 icônes :</b> chaque icône représente un axe et indique le pôle vers lequel le profil penche. Plus l’icône est marquée, plus la position est affirmée. Survolez les icônes pour voir les valeurs.'
};

export const FR_GENERATOR = {
  htmlLang: 'fr', ogLocale: 'fr_FR', prefix: '/fr', homePath: '/fr', home: 'Accueil',
  navIdeologies: 'Idéologies', navCountries: 'Pays', navPersonalities: 'Personnalités',
  takeTheTest: common.takeTheTest, axesTitle: common.axesTitle,
  ctaTitle: 'Où vous situez-vous sur le spectre politique ?',
  ctaText: 'Faites le quiz et découvrez votre compatibilité avec les idéologies, les pays et les personnalités sur les 12 axes.',
  currentCountry: 'Pays actuel', historicalRegime: (period) => `Régime historique${period ? ` · ${period}` : ''}`,
  flagAlt: common.flagAlt, imageSource: 'Source de l’image', homeAria: common.homeAria,
  balanced: 'Équilibrée', intensity: ['Équilibrée', 'Modérée', 'Forte', 'Très forte'],
  subjectPrefix: (name) => name,
  ideologyTitle: (name) => `${name} — définition et position sur les 12 axes politiques | 12 Axes`,
  countryTitle: (name) => `${name} — profil politique sur les 12 axes | 12 Axes`,
  personalityTitle: (name) => `${name} — position politique sur les 12 axes | 12 Axes`,
  ideologyHeadline: (name) => `${name} — position politique sur les 12 axes`,
  countryHeadline: (name) => `${name} — profil politique sur les 12 axes`,
  ideologiesIndexTitle: (n) => `Idéologies politiques : liste complète de ${n} courants | 12 Axes`,
  ideologiesIndexDesc: (n) => `Explorez ${n} idéologies politiques, du communisme au libertarianisme, avec leur description et leur position sur 12 axes. Découvrez la vôtre avec le quiz 12 Axes.`,
  ideologiesIndexHeading: 'Idéologies politiques',
  countriesIndexTitle: (n) => `Profils politiques de ${n} pays et régimes historiques | 12 Axes`,
  countriesIndexDesc: (n) => `Comparez les profils politiques de ${n} pays et régimes historiques sur 12 axes : démocratie, économie, libertés et bien plus. Découvrez le pays qui vous correspond.`,
  countriesIndexHeading: 'Pays et régimes',
  personalitiesIndexTitle: (n) => `${n} personnalités politiques et leurs positions | 12 Axes`,
  personalitiesIndexDesc: (n) => `Découvrez les positions de ${n} personnalités historiques et contemporaines sur 12 axes. À qui ressemblez-vous le plus ? Faites le quiz 12 Axes.`,
  personalitiesIndexHeading: 'Personnalités politiques'
};

export const FR_IDEOLOGIES_INDEX = {
  ...common, skip: 'Aller à la liste',
  lead: (n) => `Les ${n} courants politiques répertoriés par 12 Axes, regroupés par famille idéologique. Chacun dispose d’une description et d’un profil complet sur les 12 axes.`,
  stats: ['courants', 'familles', 'axes par profil'], distribution: 'Répartition sur le spectre politique',
  distributionAria: (label, n) => `${label} : ${n} idéologies`,
  searchLabel: 'Rechercher une idéologie', searchPlaceholder: 'Rechercher une idéologie… ( / )',
  filterAria: 'Filtrer par famille idéologique', count: 'courants', emptyTitle: 'Aucune idéologie trouvée',
  found: ['idéologie trouvée', 'idéologies trouvées'], ctaTitle: 'Et vous, où vous situez-vous ?',
  ctaText: (n) => `Faites le quiz et découvrez lesquelles de ces ${n} idéologies vous correspondent le mieux.`,
  descriptions: {
    'esq-radical': 'Communisme révolutionnaire ou à parti unique, avec une économie planifiée et une forte concentration du pouvoir d’État.',
    esquerda: 'Social-démocratie, progressisme et intervention accrue de l’État dans l’économie, dans le cadre de la démocratie libérale.',
    centro: 'Équilibre entre marché et État, réformes et stabilité, avec une position modérée ou pragmatique.',
    direita: 'Conservatisme, libéralisme économique et nationalisme modéré dans le cadre de la démocratie libérale.',
    'ext-direita': 'Rejet explicite de la démocratie libérale, nationalisme radical et concentration autoritaire du pouvoir.',
    terceira: 'Synthèse nationaliste et corporatiste qui rejette à la fois le capitalisme libéral et le marxisme.',
    libertario: 'État minimal, libre marché, propriété privée et libertés individuelles, sans abolition de l’État.',
    anarquismo: 'Rejet de l’État et de toute autorité coercitive, avec une organisation sociale libre et volontaire.'
  }
};

export const FR_AREA_LABELS = { politico: 'Politique', religioso: 'Religion', economista: 'Économie', filosofo: 'Philosophie', teorico: 'Théorie politique', empresario: 'Entrepreneuriat', intelectual: 'Vie intellectuelle', ativista: 'Militantisme' };

export const FR_PERSONALITIES_INDEX = {
  ...common, skip: 'Aller à la liste',
  lead: (n) => `${n} dirigeants, penseurs, économistes et militants répertoriés par 12 Axes et regroupés par domaine. Chaque profil comprend un portrait, une courte biographie et ses positions sur les 12 axes.`,
  stats: ['personnalités', 'domaines', 'axes par profil'], areasAria: 'Domaines',
  searchLabel: 'Rechercher une personnalité', searchPlaceholder: 'Rechercher un nom, un rôle ou une époque',
  filterAria: 'Filtrer par domaine', count: ['personnalité', 'personnalités'],
  emptyTitle: 'Aucune personnalité trouvée', found: ['personnalité trouvée', 'personnalités trouvées'],
  credit: 'Portraits : Wikimedia Commons / Wikipédia, selon la source indiquée sur chaque profil.',
  ctaTitle: 'À qui ressemblez-vous le plus ?',
  ctaText: (n) => `Faites le quiz et découvrez lesquelles de ces ${n} personnalités partagent le plus vos idées.`,
  descriptions: {
    politico: 'Chefs d’État, parlementaires, révolutionnaires et dirigeants de partis ayant exercé le pouvoir ou lutté pour l’obtenir.',
    teorico: 'Auteurs de doctrines, de programmes et de concepts qui orientent les mouvements et les gouvernements.',
    filosofo: 'Penseurs ayant débattu de la justice, de la liberté, de l’autorité et de la nature de l’État.',
    economista: 'Économistes dont les idées ont façonné les politiques monétaires et budgétaires, ainsi que le débat entre marché et État.',
    intelectual: 'Écrivains, historiens, journalistes et universitaires ayant influencé le débat public.',
    ativista: 'Militants et dirigeants de mouvements sociaux, syndicaux, de défense des droits civiques ou de causes particulières.',
    religioso: 'Dirigeants et penseurs religieux ayant une influence directe sur la vie politique et morale.',
    empresario: 'Entrepreneurs et dirigeants d’entreprise jouant un rôle ou exerçant une influence dans la vie politique.'
  }
};

export const FR_COUNTRIES_INDEX = {
  ...common, skip: 'Aller à la liste',
  lead: (cur, hist) => `${cur} pays actuels et ${hist} régimes historiques avec un profil complet sur les 12 axes. De l’Antiquité à nos jours, découvrez les positions de chacun.`,
  stats: ['profils', 'pays actuels', 'régimes historiques', 'années d’histoire'], erasAria: 'Époques',
  searchLabel: 'Rechercher un pays ou un régime', searchPlaceholder: 'Rechercher un pays, un régime ou une époque',
  filterAria: 'Filtrer par époque', historicalBlock: 'Régimes historiques',
  countCurrent: ['pays', 'pays'], countHistorical: ['régime', 'régimes'],
  emptyTitle: 'Aucun pays trouvé', found: ['profil trouvé', 'profils trouvés'],
  ctaTitle: 'Quel pays vous correspondrait ?',
  ctaText: 'Faites le quiz et découvrez les pays et les régimes historiques les plus proches de vos idées.',
  labels: { atuais: 'Pays actuels', antiguidade: 'Antiquité', medieval: 'Moyen Âge', moderna: 'Époque moderne', xix: 'XIXe siècle', xx: 'XXe et XXIe siècles' },
  descriptions: {
    atuais: 'États et régions autonomes actuels, avec leur régime politique et leur profil sur les 12 axes.',
    antiguidade: 'Cités-États, républiques et empires du monde antique.',
    medieval: 'Empires, républiques marchandes et communautés du Moyen Âge.',
    moderna: 'Monarchies, empires coloniaux et républiques de l’époque moderne.',
    xix: 'Empires, nations récemment unifiées et expériences révolutionnaires du XIXe siècle.',
    xx: 'Régimes des XXe et XXIe siècles : totalitarismes, dictatures, révolutions et expériences démocratiques.'
  }
};

export const FR_PERSONALITY_PAGE = {
  ...common, kpiSpectrum: 'Famille idéologique la plus proche', kpiAssociated: 'Idéologie associée',
  tabsAria: 'Sections du profil', distTitle: (name) => `Ce qui distingue ${name}`,
  rareText: (name, pole, pct, n) => `${name} penche davantage vers le pôle « ${pole} » que ${pct} % des ${n} personnalités du catalogue.`,
  rareNote: (axis, name) => `Parmi tous les axes, ${axis} est celui sur lequel ${name} se distingue le plus du catalogue.`,
  commonText: (axis, name, exact) => `Sur l’axe ${axis}, ${name} se situe ${exact ? 'presque exactement à' : 'près de'} la médiane du catalogue.`,
  commonNote: 'Ce profil partage ici une position courante parmi les personnalités du catalogue.', median: 'Médiane des personnalités',
  ideologyTitle: (name) => `Les idéologies proches de ${name}`,
  closestIdeologies: (n) => `Les plus proches parmi les ${n} idéologies`,
  personalitiesTitle: 'Personnalités les plus proches', farSub: (name) => `Les plus éloignées de ${name}`,
  countriesTitle: 'Pays les plus proches', ctaTitle: 'Et vous, à qui ressemblez-vous ?',
  ctaText: (name) => `Faites le quiz et découvrez votre compatibilité avec ${name}, les idéologies, les pays et les autres personnalités sur les 12 axes.`
};

export const FR_IDEOLOGY_PAGE = {
  ...common, kind: 'Idéologie', refPerson: 'Personnalité de référence', refCountry: 'Pays de référence',
  phraseTitle: 'En une phrase',
  phraseNote: (name) => ['Voici comment une personne proche du courant « ', name, ' » résumerait la société qu’elle souhaite.'],
  tabsAria: 'Sections de l’idéologie', distTitle: 'Ce qui distingue cette idéologie',
  rareText: (pole, pct, n) => `Penche davantage vers le pôle « ${pole} » que ${pct} % des ${n} idéologies du catalogue.`,
  commonNote: 'Cette position est courante parmi les idéologies du catalogue.', median: 'Médiane des idéologies', you: 'Cette idéologie',
  personalitiesTitle: 'Personnalités', countriesTitle: 'Pays', refHistorical: 'Référence historique', refCurrent: 'Référence actuelle',
  otherCountries: 'Autres pays proches', ideologiesTitle: 'Idéologies proches',
  sameSpectrum: (label) => `Les plus proches dans la famille « ${label} »`, otherSpectrums: 'Les plus proches dans les autres familles',
  ctaTitle: 'Et vous, où vous situez-vous ?',
  ctaText: (name, n) => `Faites le quiz et découvrez votre compatibilité avec ${name} et ${n} autres idéologies sur les 12 axes.`
};

export const FR_COUNTRY_PAGE = {
  ...common, currentCountry: 'Pays actuel', historicalRegime: 'Régime historique',
  kpiSpectrum: 'Famille idéologique dominante', kpiLinked: 'Idéologie associée',
  tabsAria: 'Sections du pays', distTitle: (name) => `Ce qui distingue ${name}`,
  rareText: (pole, pct, n) => `Penche davantage vers le pôle « ${pole} » que ${pct} % des ${n} pays et régimes du catalogue.`,
  commonNote: 'Cette position est courante parmi les pays du catalogue.', median: 'Médiane des pays',
  ideologiesTitle: 'Idéologies', compatibleSub: (n) => `Les plus compatibles parmi les ${n} idéologies`,
  personalitiesTitle: 'Personnalités', countriesTitle: 'Pays similaires',
  currentTab: 'Pays actuels', historicalTab: 'Régimes historiques',
  currentKicker: 'Pays actuel le plus similaire', historicalKicker: 'Régime historique le plus similaire',
  alsoByDimension: 'Également similaires, par dimension', farCountries: 'Les plus différents',
  ctaTitle: 'Ce pays vous correspondrait-il ?',
  ctaText: (name, n) => `Faites le quiz et découvrez votre compatibilité avec ${name} et ${n} autres pays et régimes sur les 12 axes.`
};
