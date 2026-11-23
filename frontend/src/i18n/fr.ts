// Dicionário de UI em francês: só é baixado por quem abre o site em francês. Chave ausente usa o inglês.
import type { Strings } from './index';
import type { DeepPartial } from './mergeStrings';

export const fr: DeepPartial<Strings> = {
  htmlLang: 'fr',
  docTitle: 'Test politique gratuit : quelle est votre idéologie politique ? | 12 Axes',
  loadingAnalysis: 'Chargement de l’analyse politique…',
  loadingQuiz: 'Chargement du test…',
  loadingResult: 'Chargement des résultats…',
  tryAgain: 'Réessayer',
  crashTitle: 'Une erreur est survenue',
  crashBody: 'La page a rencontré une erreur inattendue. Rechargez-la pour réessayer.',
  crashBodyWithProgress: 'La page a rencontré une erreur inattendue, mais vos réponses sont enregistrées. Rechargez la page et choisissez de reprendre là où vous en étiez.',
  crashReload: 'Recharger la page',
  resumeTitle: 'Reprenez là où vous en étiez',
  resumeBody: (answered, total) => `Vous avez répondu à ${answered} question${answered > 1 ? 's' : ''} sur ${total}. Vos réponses sont enregistrées dans ce navigateur.`,
  resumeContinue: 'Continuer',
  resumeDiscard: 'Recommencer',
  resumeUnavailable: 'Le test précédent n’a pas pu être repris. Veuillez en commencer un nouveau.',
  doneTitle: 'Vous avez déjà passé le test',
  doneBody: (name) => `Votre résultat était ${name}. Il est enregistré dans ce navigateur : il suffit de le rouvrir.`,
  doneView: 'Voir les résultats',
  doneRetake: 'Repasser le test',
  editAnswersButton: 'Modifier les réponses',
  editAnswersTitle: 'Modifier les réponses',
  editAnswersGroupsAria: 'Axes',
  editAnswersArchetype: 'Archétype',
  editAnswersReligion: 'Votre religion',
  editAnswersChanged: (count) => (count === 0 ? 'Aucune modification' : count === 1 ? '1 réponse modifiée' : `${count} réponses modifiées`),
  editAnswersCancel: 'Annuler',
  editAnswersSave: 'Enregistrer les réponses',
  editAnswersSaving: 'Recalcul en cours…',
  editAnswersDiscard: 'Abandonner les modifications non enregistrées ?',
  editAnswersLoading: 'Chargement de vos réponses…',
  editAnswersUnavailable: 'Vos réponses n’ont pas pu être ouvertes : les questions ont changé depuis que vous avez passé le test.',
  skipToContent: 'Aller au contenu',
  backToStartAria: 'Retour au début',
  mainNavAria: 'Navigation principale',
  navHow: 'Comment ça marche',
  navAxes: '12 axes',
  navSpectrum: 'Spectre',
  navFaq: 'FAQ',
  navBooks: 'Livres',
  navIdeologies: 'Idéologies',
  navPersonalities: 'Personnalités',
  navCountries: 'Pays',
  navParties: 'Partis',
  navCompare: 'Comparer',
  navSupport: 'Nous soutenir',
  langToggleLabel: 'PT',
  langToggleAria: 'Langue',
  redoQuiz: 'Repasser le test',
  religionLabel: 'Religion',
  religionQuestion: 'Appartenez-vous à une religion ? Nous l’utilisons uniquement pour adapter vos recommandations.',
  religionNone: 'Sans religion, agnostique ou athée',
  religionNames: {
    christianity: 'Christianisme',
    judaism: 'Judaïsme',
    islam: 'Islam',
    buddhism: 'Bouddhisme',
    hinduism: 'Hindouisme',
    other: 'Autre religion'
  },
  denominationLabel: 'Tradition chrétienne',
  denominationQuestion: 'De quelle tradition chrétienne vous réclamez-vous ?',
  denominationNames: { catholic: 'Catholique', protestant: 'Protestante', orthodox: 'Orthodoxe' },
  restartQuiz: 'Recommencer le test',
  h1Pre: 'Connaissez-vous vraiment votre ',
  h1Em: 'idéologie politique',
  h1Post: ' ?',
  introLead:
    'Vous vous étiquetez peut-être à tort. En quelques minutes, découvrez votre véritable idéologie, le pays qui pense le plus comme vous et le dirigeant politique le plus proche de vos idées.',
  startQuiz: 'Découvrir mon profil',
  seeAxes: 'Voir les 12 axes',
  heroLabels: ['Gratuit', 'Anonyme', 'Rapide', 'Résultat immédiat'],
  heroTeaserLabel: 'affinité',
  heroTeaserTag: 'Exemple de résultat',
  heroDeckDot: (position, total) => `Afficher l’exemple ${position} sur ${total}`,
  heroDeckAlt: (ideology) => `Exemple de la carte de résultat à partager : ${ideology}`,
  formats: {
    short: {
      label: 'Court',
      questionCount: '36 questions',
      description: 'Un résultat rapide, idéal pour une première lecture de votre profil',
      duration: 'Environ 5 min',
      action: 'Commencer la version courte'
    },
    extended: {
      label: 'Complet',
      questionCount: '60 questions',
      description: 'Plus de précision pour rapprocher votre résultat des profils idéologiques.',
      duration: 'Environ 9 min',
      action: 'Commencer la version complète'
    },
    extreme: {
      label: 'Extrême',
      questionCount: '240 questions',
      description: 'Connaissez la synthèse exacte de votre pensée avec une précision de 100 %.',
      duration: 'Environ 30 min',
      action: 'Commencer la version extrême'
    }
  },
  axisInfoAria: (label) => `Que signifie l’axe ${label} ?`,
  questionHelpAria: 'Comprendre cette question',
  questionHelpLabel: 'Comprendre',
  themeToDarkAria: 'Passer en mode sombre',
  themeToLightAria: 'Passer en mode clair',
  questionHelpTitle: 'À propos de cette question',
  questionHelpAgree: 'Si vous êtes d’accord',
  questionHelpDisagree: 'Si vous n’êtes pas d’accord',
  questionHelpNote: 'À retenir',
  questionHelpExample: 'Exemple',
  closeLabel: 'Fermer',
  personalityInfoAria: (name) => `Voir les détails sur ${name}`,
  closenessTitle: 'Ce qui vous rapproche',
  closenessYou: 'Vous',
  insight: {
    closeTitle: (name) => `Ce qui vous rapproche de ${name}`,
    closeNone: (name) => `Vous et ${name} ne partagez clairement une position sur aucun axe.`,
    closeAxis: (axis, phrase, youPct, otherPct, name, gap) =>
      `Sur ${axis}, vous montrez tous deux ${phrase}. Vous vous situez à ${youPct} % de ce côté et ${name} à ${otherPct} %${gap < 8 ? ', pratiquement au même endroit' : gap < 15 ? ', très proche' : ', avec une intensité différente'}.`,
    apartTitle: 'Là où vos chemins se séparent',
    apartNone: (name) => `Vous et ${name} n’êtes éloignés sur aucun axe.`,
    apartAxis: (axis, you, other, name, gap) => `Sur ${axis}, vos chemins se séparent : vous montrez ${you}, tandis que ${name} montre ${other}. La distance entre vous sur cet axe est de ${gap} point${gap > 1 ? 's' : ''}.`,
    apartTiny: (axis, name, gap) =>
      `Sur ${axis}, la plus grande différence entre vous et ${name} n’est que de ${gap} point${gap > 1 ? 's' : ''} : vous êtes pratiquement au même endroit.`,
    apartSame: (axis, phrase, youPct, otherPct, name, gap) =>
      `Sur ${axis}, vous penchez du même côté mais avec une intensité différente : vous montrez tous deux ${phrase}, vous à ${youPct} % et ${name} à ${otherPct} %. La distance entre vous sur cet axe est de ${gap} point${gap > 1 ? 's' : ''}.`,
    balanced: 'une position équilibrée',
    poles: {
      estrutura: { left: 'une préférence pour plus d’autonomie des États et des régions', right: 'une préférence pour un gouvernement central plus fort' },
      representacao: { left: 'le soutien à la démocratie et aux élections libres', right: 'le soutien à un pouvoir concentré entre les mains d’un chef ou d’un groupe' },
      poder: { left: 'la priorité donnée à la sécurité et à l’ordre', right: 'la priorité donnée aux libertés individuelles' },
      imigracao: { left: 'une préférence pour l’assimilation à la culture nationale', right: 'le soutien à la coexistence de plusieurs cultures' },
      diplomacia: { left: 'la confiance dans la force militaire', right: 'une préférence pour la paix et la négociation' },
      intervencao: { left: 'une préférence pour rester en dehors des différends étrangers', right: 'l’accent mis sur la défense de l’intérêt national' },
      economia: { left: 'l’accent mis sur la propriété et les services publics', right: 'l’accent mis sur la propriété privée et l’entreprise' },
      controle: { left: 'une préférence pour une économie planifiée et régulée', right: 'une préférence pour les marchés libres et une régulation légère' },
      comercio: { left: 'le soutien à la protection de l’industrie nationale', right: 'le soutien à l’ouverture au commerce international' },
      religiao: { left: 'une préférence pour la séparation de la religion et de la politique', right: 'le soutien à une plus grande place de la religion dans la vie publique' },
      moral: { left: 'des valeurs sociales progressistes', right: 'des valeurs sociales traditionnelles' },
      tecnologia: { left: 'la confiance dans la technologie et l’industrie', right: 'une préférence pour des solutions plus naturelles et biologiques' }
    }
  },
  compareEyebrow: 'Analyse comparative',
  compareTitle: 'Analyse comparative',
  compareLead: 'Choisissez une personnalité, un pays ou une idéologie et voyez, axe par axe, où vous êtes proches ou éloignés.',
  compareSearchLabel: 'Rechercher un profil à comparer',
  compareSearchPlaceholder: 'Rechercher une personnalité, un pays ou une idéologie',
  compareView: 'Voir',
  compareFieldCaption: 'Personnalité, pays ou idéologie',
  compareFullView: 'Voir la comparaison complète',
  compareExamplePlaceholder: 'Ex. : Donald Trump',
  compareAxesTitle: 'Vos 12 axes',
  compareNoResults: 'Aucun profil trouvé.',
  compareLoading: 'Comparaison en cours…',
  compareLoadError: 'Impossible de charger la comparaison. Veuillez réessayer.',
  compareTypeLabels: { personality: 'Personnalité', country: 'Pays', ideology: 'Idéologie', party: 'Parti ou organisation' },
  compareAxisAdverbs: {
    estrutura: 'sur le plan structurel',
    economia: 'sur le plan économique',
    moral: 'sur le plan moral',
    tecnologia: 'sur le plan technologique',
    diplomacia: 'sur le plan diplomatique'
  },
  compareClosestLine: (adverb, name) => `Vous êtes compatible avec ${name} ${adverb}.`,
  compareFarthestLine: (adverb, name) => `Vous êtes éloigné de ${name} ${adverb}.`,
  compareClosestFallback: (axis, name) => `Sur ${axis}, vous êtes compatible avec ${name}.`,
  compareFarthestFallback: (axis, name) => `Sur ${axis}, vous êtes éloigné de ${name}.`,
  compareIdentical: (name) => `Vous et ${name} avez des positions pratiquement identiques sur tous les axes.`,
  compareNearestLine: (axis, name) => `Votre axe le plus proche de ${name} est ${axis}.`,
  compareNoFarLine: (name) => `Aucun axe n’est éloigné de ${name}.`,
  compareValues: (pole, you, them, name) => `${pole} : vous ${you} % · ${name} ${them} %.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Comparer des profils | 12 Axes',
  comparePageTitle: 'Côte à côte, sur les 12 axes',
  comparePageProfilesTitle: 'Profils',
  comparePageNeedMore: 'Choisissez un autre profil à comparer.',
  comparePageFull: 'Jusqu’à 3 profils. Retirez-en un pour en choisir un autre.',
  comparePageRemove: 'Retirer',
  comparePageRemoveAria: (name) => `Retirer ${name} de la comparaison`,
  comparePageUnknown: 'Profil introuvable',
  comparePageNotFound: 'Un des profils de ce lien n’existe pas. Retirez-le et choisissez-en un autre.',
  comparePageAxesTitle: 'Les 12 axes',
  comparePageAxisAria: (axis, values) => `${axis} : ${values}`,
  comparePageCompassAria: (points) => `Boussole politique : ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right} % à droite, ${authoritarian} % autoritaire, ${traditional} % traditionaliste`,
  comparePageLegendAria: 'Légende de la boussole',
  comparePagePairsTitle: 'Compatibilité entre eux',
  comparePageSignatureTitle: 'Ce qui les distingue',
  comparePageIdeologyTitle: 'Idéologie la plus proche',
  comparePageNavIdeologies: 'Idéologies',
  comparePageNavAxes: '12 axes',
  comparePageNavSignature: 'Distinction',
  comparePageNavCountries: 'Pays',
  comparePageNavParties: 'Partis',
  comparePageNavCompass: 'Boussole',
  comparePageNavCompatibility: 'Compatibilité',
  comparePageCommonLabel: 'En commun',
  comparePageNearestFor: (name) => `Le plus proche de ${name}`,
  comparePageCountriesTitle: 'Pays les plus proches',
  comparePagePartiesTitle: 'Partis les plus proches',
  comparePageBalanced: 'Équilibré',
  comparePageUnitPoints: 'pts',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) => `${high} et ${low} sont à ${points} point${points > 1 ? 's' : ''} d’écart sur cet axe.`,
  comparePageAgreeCap: (points) => `C’est ici qu’ils se rejoignent : seulement ${points} point${points > 1 ? 's' : ''} d’écart.`,
  comparePageOpposite: 'Côtés opposés',
  comparePageOppositeCount: (count, total) => `Ils se retrouvent de côtés opposés sur ${count} axe${count > 1 ? 's' : ''} sur ${total}.`,
  comparePageNoOpposite: 'Aucun axe ne place ces profils de côtés opposés.',
  comparePageDiverge: 'Là où ils diffèrent le plus',
  comparePageAgree: 'Là où ils s’accordent le plus',
  comparePagePairLabel: 'Compatibilité',
  peopleTitle: 'Comparer avec quelqu’un d’autre',
  peopleLead: 'Collez le lien de résultat d’une autre personne et voyez, axe par axe, où vous êtes proches ou éloignés.',
  peopleNameLabel: 'Nom de l’autre personne',
  peopleNameCaption: 'Nom',
  peopleUrlCaption: 'Lien du résultat',
  peopleNamePlaceholder: 'ex. Jean',
  peopleUrlLabel: 'Lien du résultat de l’autre personne',
  peopleUrlPlaceholder: 'Collez le lien ici',
  peoplePaste: 'Coller',
  peoplePasteBlocked: 'Le navigateur n’a pas autorisé la lecture du presse-papiers. Collez le lien dans le champ avec Ctrl+V.',
  peoplePasteBlockedTouch: 'Impossible de lire le presse-papiers. Appuyez longuement sur le champ du lien et choisissez Coller.',
  peoplePasteEmpty: 'Rien n’a encore été copié. Copiez le lien du résultat et appuyez sur Coller.',
  peopleCompare: 'Comparer',
  peopleNameRequired: 'Saisissez le nom de l’autre personne.',
  peopleLinkMissing: (keys) => `Ce lien ne contient pas tous les axes (manquants : ${keys}). Collez le lien complet du résultat.`,
  peopleLinkInvalid: (keys) => `Valeur invalide dans le lien (${keys}). Chaque axe va de 0 à 100.`,
  peopleYou: 'Vous',
  peopleOther: 'Quelqu’un d’autre',
  peopleBoth: 'Vous deux',
  compareBoth: 'Les deux',
  peopleShare: 'Partager la comparaison',
  shareCompareLabel: 'COMPARAISON',
  shareCompareFilePrefix: '12axes-comparaison',
  shareCompareTitle: (percent) => `Notre compatibilité politique : ${percent} % | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `J’ai comparé mon profil politique à celui de ${other} sur le test politique 12 Axes !\n\n` +
    `🤝 Compatibilité entre nous : ${percent} %\n\n` +
    `💡 Mon idéologie :\n${mine}\n\n` +
    `💡 L’idéologie de ${other} :\n${theirs}\n\n` +
    `👉 Voyez la comparaison et passez le test :\n${url}`,
  peopleSignatureTitle: 'Ce qui vous distingue',
  peopleDiverge: 'Là où vous différez le plus',
  peopleAgree: 'Là où vous vous accordez le plus',
  peopleAgreeCap: (points) => `C’est ici que vous vous rejoignez : seulement ${points} point${points > 1 ? 's' : ''} d’écart.`,
  peopleOppositeCount: (count, total) => `Vous vous retrouvez de côtés opposés sur ${count} axe${count > 1 ? 's' : ''} sur ${total}.`,
  peopleNoOpposite: 'Aucun axe ne vous place de côtés opposés.',
  peopleBlocked: 'Le navigateur a bloqué le nouvel onglet.',
  peopleRename: (name) => `Modifier le nom de ${name}`,
  peopleNameInputLabel: 'Nom',
  peopleOpenLink: 'Ouvrir la comparaison',
  peoplePersonalitiesTitle: 'Personnalités les plus proches',
  peopleValuesTitle: 'Valeurs',
  peopleSharedValuesTitle: 'Valeurs communes',
  peoplePairsTitle: 'Compatibilité entre vous',
  peopleNavPersonalities: 'Personnalités',
  peopleNavValues: 'Valeurs',
  peopleNavSharedValues: 'En commun',
  peoplePageDocTitle: 'Comparer avec quelqu’un d’autre | 12 Axes',
  peoplePageTitle: 'Vous deux, sur les 12 axes',
  peoplePagePeopleTitle: 'Personnes',
  peoplePageBadLink: 'Ce lien de comparaison est incomplet. Ouvrez votre résultat et utilisez « Comparer avec quelqu’un d’autre ».',
  peoplePageLoadError: 'Impossible de charger la comparaison. Veuillez réessayer.',
  peoplePageLoading: 'Comparaison en cours…',
  axisExplanations: {
    estrutura:
      'Mesure si vous préférez un pouvoir réparti entre États, villes et communautés locales ou un État national unitaire, aux lois et au commandement plus uniformes.',
    representacao:
      'Compare la confiance dans les élections, l’opposition et les institutions démocratiques à une préférence pour un leadership fort, la technocratie, la monarchie ou les régimes autoritaires.',
    poder:
      'Évalue l’équilibre entre ordre, surveillance, sanction et contrôle de l’État d’une part, vie privée, liberté individuelle et autonomie civile d’autre part.',
    imigracao:
      'Regarde si vous valorisez l’assimilation culturelle, la langue et l’identité nationale ou le multiculturalisme, la migration ouverte et la pluralité des coutumes.',
    diplomacia:
      'Analyse votre position sur les forces armées, les armes, la dissuasion et l’intervention militaire, face à la négociation, au pacifisme et aux organisations internationales.',
    intervencao:
      'Mesure la tendance entre la non-ingérence extérieure et une souveraineté nationale plus affirmée, un nationalisme géopolitique et une défense active des intérêts nationaux.',
    economia:
      'Compare une préférence pour la propriété publique, les entreprises d’État et les services collectifs à la propriété privée, la privatisation et le leadership des entreprises.',
    controle:
      'Évalue la planification de l’État, la régulation et la politique économique active face aux marchés libres, à la faible ingérence, à l’autonomie monétaire et à la concurrence.',
    comercio:
      'Mesure le protectionnisme, la souveraineté productive et la défense de l’industrie nationale face au mondialisme, au libre-échange et à l’intégration économique internationale.',
    religiao:
      'Compare la laïcité, la séparation de la religion et de l’État et la critique des privilèges religieux à l’influence publique de la foi et des valeurs religieuses.',
    moral:
      'Évalue le progressisme culturel, les droits civils et le changement social face à la tradition, à la famille, aux mœurs et au conservatisme moral.',
    tecnologia:
      'Mesure l’enthousiasme pour la technologie, l’IA, le génie génétique et le développement technique face à la prudence biologique, environnementale et préservationniste.'
  },
  homeAxes: {
    estrutura: { label: 'Structure', leftPole: 'Fédéral', rightPole: 'Unitaire' },
    representacao: { label: 'Représentation', leftPole: 'Démocratie', rightPole: 'Autocratie' },
    poder: { label: 'Pouvoir', leftPole: 'Sécurité', rightPole: 'Liberté' },
    imigracao: { label: 'Immigration', leftPole: 'Assimilation', rightPole: 'Multiculturel' },
    diplomacia: { label: 'Diplomatie', leftPole: 'Militariste', rightPole: 'Pacifiste' },
    intervencao: { label: 'Intervention', leftPole: 'Non-ingérence', rightPole: 'Nationaliste' },
    economia: { label: 'Économie', leftPole: 'Public', rightPole: 'Privé' },
    controle: { label: 'Contrôle', leftPole: 'Planification', rightPole: 'Libre marché' },
    comercio: { label: 'Commerce', leftPole: 'Protectionnisme', rightPole: 'Mondialisme' },
    religiao: { label: 'Religion', leftPole: 'Irréligieux', rightPole: 'Religieux' },
    moral: { label: 'Morale', leftPole: 'Progressiste', rightPole: 'Traditionaliste' },
    tecnologia: { label: 'Technologie', leftPole: 'Technologie', rightPole: 'Biologie' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Gauche radicale',
      tone: 'darkred',
      description:
        'Communisme révolutionnaire ou totalitaire à parti unique, avec une économie planifiée, une forte centralisation et un pouvoir d’État concentré.'
    },
    {
      id: 'left',
      label: 'Gauche',
      tone: 'green',
      description:
        'Prône la social-démocratie, le progressisme et une plus grande intervention de l’État dans l’économie, dans le cadre de la démocratie libérale.'
    },
    {
      id: 'center',
      label: 'Centre',
      tone: 'gray',
      description:
        'Cherche l’équilibre entre gauche et droite, marché et État, réforme et stabilité, avec une posture politique modérée ou pragmatique.'
    },
    {
      id: 'right',
      label: 'Droite',
      tone: 'blue',
      description:
        'Prône le conservatisme, le libéralisme économique et un nationalisme modéré, dans le cadre de la démocratie libérale.'
    },
    {
      id: 'right-extreme',
      label: 'Extrême droite',
      tone: 'navy',
      description:
        'Fascisme, nationalisme racial et théocraties oppressives, avec un rejet explicite de la démocratie et une concentration autoritaire du pouvoir.'
    },
    {
      id: 'third-position',
      label: 'Troisième position',
      tone: 'purple',
      description:
        'Une synthèse nationaliste et corporatiste qui rejette à la fois le capitalisme libéral et le marxisme, en dehors de l’axe traditionnel gauche-droite.'
    },
    {
      id: 'libertarian',
      label: 'Libertarien',
      tone: 'amber',
      description:
        'Prône un État minimal, des marchés libres, la propriété privée et les libertés individuelles, sans proposer l’abolition totale de l’État.'
    },
    {
      id: 'anarchist',
      label: 'Anarchiste',
      tone: 'charcoal',
      description:
        'Rejette l’État et toute autorité coercitive, prônant une organisation sociale libre, volontaire et autogérée, de gauche comme de droite.'
    }
  ],
  faqItems: [
    {
      question: 'Le test est-il fiable ?',
      answer:
        'Le test politique 12 Axes est fiable en tant qu’outil de lecture et de comparaison des positions politiques. Il utilise des questions réparties sur 12 axes pour réduire le biais d’un seul sujet, mais il ne remplace ni l’étude, ni le débat, ni l’analyse universitaire.'
    },
    {
      question: 'Combien de temps dure-t-il ?',
      answer:
        'La version courte prend environ 5 minutes. La version complète prend environ 9 minutes. La version extrême, avec 240 questions, peut prendre environ 30 minutes.'
    },
    {
      question: 'Puis-je le repasser ?',
      answer:
        'Oui. Vous pouvez repasser le test politique autant de fois que vous le souhaitez, y compris en choisissant une autre profondeur pour vérifier si votre résultat change.'
    },
    {
      question: 'Y a-t-il une bonne réponse ?',
      answer:
        'Il n’y a pas de bonne réponse. Le test d’idéologie mesure des préférences sur la démocratie, la monarchie, le fédéralisme, l’immigration, la religion en politique, la politique économique, le commerce international, le libéralisme, le conservatisme, le progressisme et d’autres sujets.'
    },
    {
      question: 'Comment l’algorithme calcule-t-il ?',
      answer:
        'Chaque réponse ajoute des points à un pôle précis. L’algorithme calcule des pourcentages par axe, compare votre vecteur idéologique aux profils des courants politiques, des pays et des personnalités, et renvoie les plus fortes compatibilités.'
    },
    {
      question: 'Le résultat change-t-il ?',
      answer:
        'Il peut changer si vos opinions changent, si vous répondez avec plus de nuance ou si vous passez une version plus longue. La version extrême tend à réduire les fluctuations en utilisant davantage de questions.'
    },
    {
      question: 'Le test est-il scientifique ?',
      answer:
        '12 Axes n’est pas un instrument scientifique validé cliniquement. C’est un test politique éducatif, inspiré de modèles de spectre politique et de quiz d’idéologie, utile pour la réflexion et la comparaison.'
    },
    {
      question: 'Puis-je le partager ?',
      answer:
        'Oui. Une fois terminé, vous pouvez partager votre résultat pour discuter d’idéologie politique, de spectre politique, de gauche, de droite, de centre et des 12 axes avec d’autres personnes.'
    },
    {
      question: 'Le test collecte-t-il des données ?',
      answer:
        'Le test est anonyme et ne demande aucune inscription. Les réponses servent à calculer le résultat au moment du test, sans demander votre nom, votre e-mail ni aucune identification personnelle.'
    },
    {
      question: 'Puis-je le passer sur mon téléphone ?',
      answer:
        'Oui. L’interface a été conçue pour le mobile et l’ordinateur : vous pouvez passer le test politique dans le navigateur de votre smartphone.'
    },
    {
      question: 'Qu’est-ce que 12 Axes ?',
      answer: '12 Axes est un test politique gratuit qui mesure votre position sur 12 axes (structure de l’État, représentation, libertés, immigration, diplomatie, intervention, économie, contrôle économique, commerce, religion, morale et technologie) et vous montre l’idéologie politique, le pays et la figure politique qui vous correspondent.'
    },
    {
      question: '12 Axes propose-t-il une boussole politique ?',
      answer: 'Oui. À la fin du résultat, une boussole politique à deux axes, gauche × droite et autoritaire × libertaire, est accompagnée d’une barre progressiste × traditionaliste. Elle résume visuellement vos 12 axes, mais ne remplace pas l’analyse complète.'
    },
    {
      question: 'Comment trouver l’idéologie politique qui me correspond ?',
      answer: 'Passez le test politique, avec 36, 60 ou 240 questions. Le résultat montre les idéologies les plus compatibles avec vos réponses, avec le pourcentage de compatibilité et la position de chacune sur les 12 axes.'
    },
    {
      question: 'Puis-je savoir quel pays ou quelle figure politique me correspond ?',
      answer: 'Oui. Outre l’idéologie, le résultat compare votre profil aux pays actuels, aux régimes historiques et aux figures politiques, en montrant les plus compatibles et les plus éloignés de vous.'
    },
    {
      question: 'Combien de questions compte le test politique ?',
      answer: 'Il existe trois versions : rapide, avec 36 questions, complète, avec 60, et extrême, avec 240. Toutes couvrent les mêmes 12 axes ; plus il y a de questions, plus le résultat tend à être précis.'
    }
  ],
  howTitle: 'Comment fonctionne le test politique 12 Axes',
  howLead:
    'Un test d’idéologie politique simple et visuel : vous répondez à des affirmations, 12 Axes calcule vos pourcentages et montre où vous vous situez sur le spectre politique dans chaque dimension.',
  steps: [
    {
      title: 'Répondez aux questions',
      text: 'Soyez d’accord ou non avec des affirmations sur l’économie, l’État, les libertés civiles, les valeurs, la religion, la politique étrangère et la technologie.'
    },
    {
      title: 'Analyse sur 12 axes',
      text: 'Chaque réponse vous place sur 12 axes idéologiques indépendants, du libre marché à la planification, du nationalisme au mondialisme.'
    },
    {
      title: 'Découvrez votre profil',
      text: 'Recevez votre profil idéologique, les idéologies les plus compatibles, le pays le plus proche, la personnalité associée et les résultats axe par axe.'
    }
  ],
  axesGuideTitle: 'Que signifie chaque axe ?',
  axesGuideLead:
    'Le test d’idéologie 12 Axes analyse le fédéralisme, la représentation politique, la démocratie, les élections, l’immigration, le commerce international, la religion en politique, la politique économique, la morale et la technologie dans des dimensions séparées.',
  discoveryTitle: 'Un portrait complet de vos convictions politiques',
  discoveryLead:
    'Plus que gauche ou droite : votre résultat montre qui, où et avec quelle force vos idées s’alignent réellement.',
  discoveryItems: [
    { icon: 'ideology', title: 'Votre idéologie', text: 'Quel courant politique vous correspond' },
    { icon: 'country', title: 'Votre pays', text: 'Quelle nation pense le plus comme vous' },
    { icon: 'personality', title: 'Votre dirigeant politique', text: 'Quelle figure historique est votre alter ego idéologique' },
    { icon: 'books', title: 'Livres recommandés', text: 'Un livre marquant de chaque figure politique qui vous correspond' },
    { icon: 'profile', title: 'Votre profil', text: 'Un portrait complet de vos convictions' },
    { icon: 'compatibility', title: 'Compatibilité', text: 'À quel point vous adhérez réellement à votre propre idéologie' }
  ],
  exampleTitle: 'Voici à quoi ressemble votre résultat',
  exampleCaption: 'Exemple illustratif utilisant des données réelles du catalogue 12 Axes.',
  exampleCta: 'Je veux voir mon résultat',
  spectrumTitle: 'Découvrez votre spectre politique',
  spectrumLead:
    'Le résultat vous aide à visualiser votre position politique entre gauche, droite et centre, et identifie aussi des formes plus radicales, autoritaires ou libertaires qui sortent de cet axe, comme l’extrême droite, la gauche radicale, la troisième position, le libertarianisme et l’anarchisme.',
  faqTitle: 'Questions fréquentes',
  faqLead: 'Tout ce que l’on demande habituellement avant de passer le test.',
  navStart: 'Accueil',
  navTakeTest: 'Passer le test',
  menuAria: 'Ouvrir le menu',
  roseAria: 'Rose des 12 axes',
  spectrumBarAria: 'Barre du spectre politique avec les huit catégories',
  versionsTitle: 'Choisissez la profondeur',
  versionsLead:
    'Commencez par le test rapide ou allez plus loin pour un portrait plus précis de votre profil idéologique. Toutes les versions utilisent les mêmes 12 axes et renvoient le résultat immédiatement.',
  variantTitlePre: 'Voulez-vous de la vitesse ou de la ',
  variantTitleEm: 'précision ?',
  backToStart: 'Retour au début',
  depthLabel: 'Profondeur',
  depthAria: (level) => `Profondeur ${level} sur 3`,
  recommended: 'Recommandé',
  formatNotes: ['Toutes les versions utilisent les mêmes 12 axes', 'Anonyme, sans inscription', 'Résultat immédiat'],
  variantLead:
    'La version courte révèle rapidement le résultat. La version complète augmente la précision pour rapprocher votre résultat des profils idéologiques.',
  quizNavAria: 'Navigation du test',
  autoAdvance: 'Avancer dès la réponse',
  swapQuestion: 'Changer',
  swapQuestionAria: 'Remplacer cette question par une autre sur le même sujet',
  back: 'Retour',
  next: 'Suivant',
  calculating: 'Calcul en cours…',
  seeResult: 'Voir les résultats',
  archetypeSkip: 'Passer',
  errMissingAnswer: 'Vous devez encore répondre à cette question avant de voir le résultat.',
  errLoadQuiz: 'Impossible de charger le test.',
  errCalc: 'Impossible de calculer le résultat.',
  errImage: 'Impossible de générer l’image du résultat.',
  errHttp: (status) => `Erreur HTTP ${status}`,
  resultsH1Pre: 'Votre ',
  resultsH1Em: 'profil',
  resultsLead: (count) =>
    `Analyse fondée sur ${count} réponses réparties sur 12 dimensions fondamentales de l’idéologie politique. Consultez votre position sur chaque axe et vos correspondances idéologiques.`,
  resultsLeadShared:
    'Résultat partagé : la position sur chacun des 12 axes politiques et les correspondances idéologiques calculées à partir de celle-ci. Passez le test pour découvrir les vôtres.',
  resultsSummaryAria: 'Résumé de l’analyse',
  metaTop: 'Meilleure correspondance',
  axesSectionEyebrow: 'Axes politiques',
  axesSectionTitle: 'Vos 12 axes',
  proximityEyebrow: 'Proximité idéologique',
  otherMatches: 'Autres idéologies',
  navOnThisPage: 'Sur cette page',
  resultsNavReport: 'Analyse complète',
  resultsNavPremiumGroup: 'Rapport complet',
  resultsNavAxisByAxis: 'Axe par axe',
  resultsNavDisagree: 'Désaccords',
  resultsNavGovernment: 'Gouvernement idéal',
  resultsNavAreaCountries: 'Pays par domaine',
  resultsNavTimeline: 'Chronologie',
  resultsNavLiving: 'Où vivre',
  resultsNavAxes: '12 axes',
  resultsNavSignature: 'Distinction',
  resultsNavCountries: 'Pays',
  resultsNavPersonalities: 'Personnalités',
  resultsNavElections: 'Élections',
  resultsNavAreas: 'Domaines',
  resultsNavBooks: 'Livres',
  resultsNavParties: 'Partis',
  resultsNavIdeologies: 'Idéologies',
  resultsNavCompass: 'Boussole',
  resultsNavValues: 'Valeurs',
  valuesSectionTitle: 'Vos valeurs',
  valuesNeutralTag: 'Position équilibrée',
  valueInfoAria: (name) => `Détails sur ${name}`,
  compassTitle: 'Boussole politique',
  compassAuthoritarian: 'Autoritarisme',
  compassLibertarian: 'Anarchisme',
  compassLeft: 'Gauche',
  compassRight: 'Droite',
  compassProgressive: 'Progressiste',
  compassTraditionalist: 'Traditionaliste',
  compassQuadrants: {
    authLeft: 'Gauche autoritaire',
    authRight: 'Droite autoritaire',
    libLeft: 'Gauche libertaire',
    libRight: 'Droite libertaire'
  },
  compassInfo: {
    aria: 'Voir ce que signifie votre position sur la boussole'
  },
  compassSpectrumLabels: {
    'esq-radical': 'Gauche radicale',
    esquerda: 'Gauche',
    centro: 'Centre',
    direita: 'Droite',
    'ext-direita': 'Extrême droite',
    terceira: 'Troisième position',
    libertario: 'Libertarien',
    anarquismo: 'Anarchiste'
  },
  compassEconomicLabels: {
    left: 'Gauche',
    centerLeft: 'Centre gauche',
    center: 'Centre',
    centerRight: 'Centre droit',
    right: 'Droite'
  },
  compassSpectrumDescriptions: {
    'esq-radical': 'Vous tendez à chercher une transformation profonde de la société, avec l’égalité matérielle, la propriété collective et un État fort au service de ceux qui travaillent, en rupture avec l’ordre économique actuel.',
    esquerda: 'Vous tendez à défendre plus d’égalité et de protection sociale, avec un État qui réduit les inégalités par les services publics, les droits des travailleurs et la redistribution.',
    centro: 'Vous tendez à chercher l’équilibre entre des positions opposées, en combinant marché et État, changement et stabilité, et à vous méfier des solutions venues d’un seul camp.',
    direita: 'Vous tendez à valoriser l’ordre, la tradition, la responsabilité individuelle et la libre entreprise, avec un État plus limité dans l’économie et attentif à la sécurité et aux valeurs de la nation.',
    'ext-direita': 'Vous tendez à privilégier la hiérarchie, l’identité nationale et une autorité forte, en plaçant la sécurité et l’ordre au-dessus du pluralisme et de la contestation.',
    terceira: 'Vous tendez à rejeter à la fois le capitalisme libéral et le communisme, en unissant un État fort et une économie dirigée à la nation, à la communauté et à la tradition.',
    libertario: 'Vous tendez à placer la liberté individuelle au-dessus de tout : le minimum d’État, le marché libre et le respect des choix de chacun, dans la vie privée comme dans l’économie.',
    anarquismo: 'Vous tendez à vous méfier de toute autorité centralisée et à défendre une société organisée par la coopération volontaire et l’autogestion, sans État ni hiérarchies imposées.'
  },
  compassEconomicDescriptions: {
    left: 'Vous tendez à défendre la propriété collective ou publique des moyens de production, avec l’État et la société, et non le marché, au centre de l’économie.',
    centerLeft: 'Vous tendez à accepter le marché, mais avec une forte présence de l’État : de larges services publics, des entreprises publiques dans les secteurs clés et de la redistribution pour réduire les inégalités.',
    center: 'Vous tendez à chercher un juste milieu économique, avec des rôles équilibrés pour le marché et l’État : des entreprises publiques là où elles sont stratégiques et de la place pour l’initiative privée.',
    centerRight: 'Vous tendez à faire davantage confiance au marché et à l’initiative privée, avec un État plus petit et des règles claires, sans renoncer à une certaine protection sociale.',
    right: 'Vous tendez à défendre la propriété privée et le libre marché, avec peu d’entreprises d’État et la concurrence comme moteur de l’économie.'
  },
  compassSocialLabels: {
    veryProgressive: 'Très progressiste',
    progressive: 'Progressiste',
    moderate: 'Modéré',
    traditional: 'Traditionaliste',
    veryTraditional: 'Très traditionaliste'
  },
  compassSocialDescriptions: {
    veryProgressive: 'Vous tendez à défendre fermement la liberté des mœurs, la diversité et le changement social, en voyant les traditions comme quelque chose à questionner et à renouveler.',
    progressive: 'Vous tendez à soutenir la liberté des mœurs, la diversité et l’égalité des droits, avec une ouverture à de nouvelles formes de famille, de culture et d’identité.',
    moderate: 'Vous tendez à équilibrer tradition et changement, en préservant ce qui fonctionne dans les mœurs et en acceptant des changements graduels, sans positions extrêmes sur les questions morales.',
    traditional: 'Vous tendez à valoriser la famille, la religion et les coutumes héritées, en préférant les changements graduels et en vous méfiant des ruptures rapides dans les valeurs sociales.',
    veryTraditional: 'Vous tendez à défendre fermement la famille, la foi et les coutumes traditionnelles comme fondement de la société, en résistant aux changements qui les altèrent.'
  },
  compassAria: (right, authoritarian, traditional) =>
    `Votre position : ${right} % vers la droite, ${authoritarian} % vers l’autoritaire et ${traditional} % vers le traditionaliste.`,
  countriesSectionTitle: 'Pays les plus proches de vous',
  countryCurrentTab: 'Aujourd’hui',
  countryHistoricalTab: 'Historiques',
  countriesDistantTitle: 'Les plus éloignés de vous',
  partiesSectionTitle: 'Partis les plus proches de vous',
  partyCurrentTab: 'Parti actif',
  partyHistoricalTab: 'Parti historique',
  partiesDistantTitle: 'Les plus éloignés de vous',
  partyLogoAlt: (name) => `Symbole de ${name}`,
  partyLogoUnavailable: 'Symbole indisponible',
  personalitiesSectionTitle: 'Figures les plus proches de vous',
  personalitiesByAreaTitle: 'Aussi proches de vous, par domaine',
  dimensionsTitle: 'Aussi proches de vous, par dimension de votre profil',
  dimensionLabels: {
    political: 'Politiquement',
    social: 'Socialement',
    economic: 'Économiquement',
  },
  booksEyebrow: 'Aller plus loin',
  booksTitle: 'Pour aller plus loin',
  booksTopLabel: 'Le plus proche de vous',
  booksAuthorLabel: 'Auteur',
  booksLead: 'Une œuvre de chacune des figures les plus proches de vos résultats.',
  booksWhy: (pct) => `${pct} % compatible`,
  booksYearBc: (year) => `${year} av. J.-C.`,
  booksCta: 'Voir sur Amazon',
  areasGeneralTitle: 'Les figures les plus proches de vos résultats',
  areasSectionTitle: 'Les figures les plus proches par domaine',
  areasTabsAria: 'Comment les figures sont regroupées',
  areasGeneralTab: 'Compatibilité globale',
  areasByAreaTab: 'Domaine',
  exportCsv: 'Exporter le tableur',
  paywallTitle: 'Rapport complet',
  paywallLead: 'Comprenez comment vous voyez le monde axe par axe, découvrez quel pays ou quelle région actuelle vous ressemble le plus, et bien plus encore.',
  paywallUnlockTitle: 'Accédez au résultat complet de vos opinions politiques',
  paywallPreviewTitles: [
    'Analyse complète, axe par axe',
    'Là où vous êtes le plus en désaccord',
    'Votre gouvernement idéal',
    'Votre chronologie idéologique',
    '10 pays ou régions où vivre'
  ],
  paywallModalTag: 'Votre rapport complet',
  paywallModalTitle: 'Accédez au résultat complet de vos opinions politiques',
  paywallModalLead: 'Comprenez comment vous voyez le monde axe par axe, découvrez quel pays ou quelle région actuelle vous ressemble le plus, et bien plus encore.',
  paywallPdfTitle: 'Emportez votre rapport complet en PDF',
  paywallPdfLead: 'L’analyse des 12 axes, votre gouvernement idéal et les pays où vivre, dans un PDF à conserver et à relire quand vous voulez.',
  paywallIncludesTitle: 'Ce que vous débloquez :',
  paywallIncludes: [
    { lead: 'Votre gouvernement idéal :', text: 'neuf postes occupés par des personnes qui pensent comme vous.' },
    { lead: 'Dans quel pays déménager :', text: 'les 10 pays les plus proches de vos idéaux.' },
    { lead: 'Là où vous êtes le plus en désaccord :', text: 'avec l’idéologie, la figure et le pays les plus proches de vous.' },
    { lead: 'Les 12 axes, un par un :', text: 'ce que révèle chacune de vos positions, pourquoi elle est louée et pourquoi elle est critiquée.' },
    { lead: 'Votre chronologie :', text: 'qui pensait comme vous, de l’Antiquité au XXIe siècle.' },
    { lead: 'Votre dirigeant idéal par domaine :', text: 'politique, économie, philosophie et plus encore.' },
    { lead: 'Classement complet et PDF :', text: 'tout le catalogue dans un tableur, et le rapport à conserver.' }
  ],
  paywallOnce: 'paiement unique, sans abonnement',
  paywallBlockCta: {
    axes: 'Débloquer mon analyse complète',
    disagree: 'Débloquer mon rapport complet',
    government: 'Débloquer mon gouvernement idéal',
    timeline: 'Débloquer ma chronologie',
    countries: 'Débloquer mes 10 régions'
  },
  paywallTeaser: {
    axisTag: 'Votre axe le plus marquant',
    disagreeWith: (name) => `Les 3 axes sur lesquels vous différez le plus de ${name}.`,
    seats: ['Chef politique', 'Chef politique adjoint', 'Chef de l’économie'],
    eras: ['Antiquité', 'Moyen Âge'],
    topCountry: 'Le plus proche aujourd’hui'
  },
  paywallInstant: 'Débloqué dès le paiement.',
  paywallGuarantee: 'Garantie de 14 jours',
  paywallPayWith: 'Moyens de paiement : cartes, PayPal, Apple Pay, Google Pay et plus, selon votre pays',
  paywallPrice: '3,99 $ US',
  paywallCta: 'Débloquer mon rapport complet',
  paywallChecking: 'Confirmation de votre paiement…',
  paywallProblems: {
    denied: 'Ce paiement ne correspond pas à ce résultat, ou il a été remboursé.',
    unavailable: 'Service indisponible pour le moment, veuillez réessayer dans quelques instants.',
    timeout: 'Le paiement n’a pas encore été confirmé.'
  },
  paywallRetry: 'Vérifier à nouveau',
  paywallOpening: 'Ouverture du paiement…',
  paywallEmailLabel: 'Votre e-mail',
  paywallEmailPlaceholder: 'vous@exemple.fr',
  paywallEmailInvalid: 'Saisissez une adresse e-mail valide.',
  unlockedTag: 'Paiement confirmé',
  unlockedTitle: 'Votre rapport complet est débloqué !',
  unlockedLead: 'Vous pouvez désormais accéder à votre rapport complet. Pour l’ouvrir plus tard, enregistrez le lien d’accès ci-dessous.',
  unlockedCta: 'Voir le rapport',
  unlockedCopy: 'Copier le lien d’accès',
  unlockedCopied: 'Lien copié !',
  areasLockedTitle: 'Quelle figure vous est la plus compatible dans chaque domaine ?',
  areasLockedText: 'Voyez la figure qui vous est la plus compatible en politique, en économie, en philosophie et dans les autres domaines.',
  areasLockedCta: 'Débloquer mon rapport complet',
  personalitiesDistantTitle: 'Les plus éloignées de vous',
  ideologyDistantTitle: 'L’idéologie la plus éloignée de vous',
  aboutIdeology: (ideology) => `À propos : ${ideology}`,
  knowMoreAbout: (name) => `En savoir plus sur ${name}`,
  showLess: 'Voir moins',
  matchTopKicker: 'Le plus compatible',
  dimensionsTitleShort: 'Aussi proches, par dimension',
  phraseNote: (ideology) => `Voici comment une personne de l’idéologie « ${ideology} » résumerait la société qu’elle souhaite.`,
  signatureTitle: 'Ce qui vous distingue',
  signatureUnusualLabel: 'Votre position la plus inhabituelle',
  signatureCommonLabel: 'Votre position la plus typique',
  signatureUnusualLead: (pole, percent) => `Vous penchez davantage vers ${pole.toLowerCase()} que ${Math.round(percent)} % des idéologies du catalogue.`,
  signatureUnusualLeadMax: (pole) => `Aucune idéologie du catalogue ne penche aussi loin vers ${pole.toLowerCase()} que vous.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Votre position sur ${axis} est plutôt centrale. Elle vous place néanmoins plus près de ${pole.toLowerCase()} que ${Math.round(percent)} % des idéologies du catalogue.`,
  signatureUnusualNote: (axis) => `Sur l’ensemble des 12 axes, ${axis} est celui où vous vous écartez le plus du lot. C’est le trait qui vous distingue.`,
  signatureCommonLead: (axis) => `Votre position sur ${axis} se situe presque exactement à la médiane du catalogue.`,
  signatureCommonNote: (pole) => `C’est un terrain commun. Vous ne penchez ni vers ${pole.toLowerCase()} ni vers le pôle opposé.`,
  signatureCommonNoteBalanced: (axis) => `Vous êtes au centre sur ${axis}, tout comme le catalogue. C’est là que votre profil se démarque le moins.`,
  tensionLabel: 'Votre tension interne',
  tensionCombo: (firstPole, secondPole) => `${firstPole} et ${secondPole} à la fois`,
  tensionRare: (count, total) => `Seules ${count} des ${total} idéologies du catalogue tiennent ces deux positions.`,
  tensionUnique: 'Aucune idéologie du catalogue ne tient ces deux positions.',
  tensionExamples: (names) => `Correspondances les plus proches : ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `Dans le catalogue, ${firstAxis} et ${secondAxis} évoluent généralement ensemble. Vous inversez ce schéma.`,
  signatureMedian: 'Médiane des idéologies',
  signatureYou: 'Vous',
  signatureBigCap: (pole) => `des idéologies penchent moins que vous vers ${pole.toLowerCase()}.`,
  signatureAtMedian: 'À la médiane',
  signatureAtCentre: 'Au centre',
  tensionRareShort: (count, total) => `Seules ${count} idéologies sur ${total} tiennent ces deux positions.`,
  personalityCategories: {
    politico: 'Politique',
    religioso: 'Religion',
    economista: 'Économie',
    filosofo: 'Philosophie',
    teorico: 'Théorie politique',
    empresario: 'Entreprise',
    intelectual: 'Vie intellectuelle',
    ativista: 'Militantisme',
  },
  redoAnalysis: 'Refaire l’analyse',
  share: 'Partager',
  saveOrShare: 'Partager le résultat',
  generatingPng: 'Génération du PNG…',
  sharePreviewTitle: 'Votre carte de résultat',
  sharePreviewCompareTitle: 'Carte de comparaison',
  sharePreviewAlt: 'Aperçu de votre carte de résultat à partager',
  sharePreviewLoading: 'Génération de l’aperçu de votre carte',
  generatingPdf: 'Génération du PDF…',
  downloadPdf: 'Télécharger le PDF',
  downloadPdfFull: 'Télécharger votre rapport complet en PDF',
  report: {
    fileName: '12axes-rapport',
    docLabel: 'Rapport complet',
    headerLabel: (ideology) => `Rapport de profil politique · ${ideology}`,
    kpiCountry: 'Pays le plus proche',
    kpiPersonality: 'Figure',
    kpiAxes: 'Axes analysés',
    kpiAnswered: (count) => `${count} questions répondues`,
    tocTitle: 'Dans ce rapport',
    generatedOn: (date) => `Généré le ${date}`,
    axesIntro: 'Votre position sur chacun des 12 axes. La barre part du centre (50 %) et s’étend vers le pôle vers lequel vous penchez ; le badge indique l’intensité.',
    intensityLegend: 'Intensité',
    intensityLevels: ['Équilibré · jusqu’à 57 %', 'Tendance · de 58 à 72 %', 'Fort · de 73 à 87 %', 'Très fort · 88 % ou plus'],
    alsoClose: 'Aussi proches, par dimension de votre profil',
    continued: 'suite',
    areasIntro: 'Les figures du catalogue dont le profil sur les 12 axes ressemble le plus au vôtre.',
    booksIntro: 'Une œuvre de chacune des figures les plus proches de vos résultats.',
    aboutTitle: 'À propos de ce rapport',
    aboutText: '12 Axes compare vos réponses aux profils d’idéologies, de pays et de figures sur les mêmes 12 axes. La compatibilité mesure la proximité entre profils ; ce n’est ni un diagnostic scientifique ni une étiquette définitive. Vos réponses ne sont pas conservées.',
    ctaTitle: 'Repassez le test ou partagez-le'
  },
  shareFilePrefix: '12axes-profil',
  shareCountriesFilePrefix: '12axes-pays',
  shareCountriesTitle: 'Les pays les plus proches de mon profil | 12axes.vercel.app',
  shareCountriesMessage: (country, percent) =>
    `Voyez les pays les plus proches de mon profil politique sur le test politique 12 Axes !\n\n` +
    `🌎 Pays actuel le plus compatible :\n` +
    `${country} - ${percent} % de compatibilité\n\n` +
    `👉 Passez le test et trouvez le vôtre :\nhttps://12axes.vercel.app/fr`,
  shareCountriesCta: 'Partager les pays proches',
  sharePersonalitiesCta: 'Partager les personnalités proches',
  electionsClosestLabel: 'Candidat le plus proche de vous',
  electionsEnded: 'Terminée',
  electionsPickAria: 'Choisir le pays de l’élection',
  shareElectionsHeader: 'Élections',
  electionsNotice: 'Affinité idéologique avec les positions du candidat, pas une recommandation de vote.',
  shareElectionsCta: 'Partager le résultat',
  electionsShareHeadline: (name, party) => `Mon candidat le plus compatible est ${name}${party ? `, ${party}` : ''}`,
  shareElectionsFilePrefix: '12axes-elections',
  shareElectionsTitle: 'Le candidat le plus proche de mon profil | 12axes.vercel.app',
  shareElectionsMessage: (candidate, party, percent) => `${candidate}${party ? `, ${party}` : ''} : ${percent} % d’affinité avec moi. Faites le test et trouvez le vôtre : 12axes.vercel.app`,
  sharePartiesCta: 'Partager les partis proches',
  shareCompassCta: 'Partager les valeurs et la boussole',
  shareGovernmentCta: 'Partager le gouvernement idéal',
  shareAreasCta: 'Partager les pays par domaine',
  shareAreasHeader: 'Pays par domaine',
  shareAreasFilePrefix: '12axes-pays-par-domaine',
  shareAreasTitle: 'Les pays les plus proches de moi par domaine | 12axes.vercel.app',
  shareAreasMessage: 'Découvrez quels pays vous ressemblent le plus en politique, économie, société et plus encore avec le test politique 12 Axes : 12axes.vercel.app',
  shareTimelineCta: 'Partager la chronologie',
  shareLivingCta: 'Partager les pays où vivre',
  shareIdealGovernment: 'GOUVERNEMENT IDÉAL',
  shareTimeline: 'CHRONOLOGIE',
  shareLiving: 'PAYS OÙ VIVRE',
  shareBestEra: 'ÉPOQUE LA PLUS COMPATIBLE',
  shareGovernmentFilePrefix: '12axes-gouvernement-ideal',
  shareGovernmentTitle: 'Mon gouvernement idéal | 12axes.vercel.app',
  shareGovernmentMessage: (leader) =>
    `Voyez mon gouvernement idéal sur le test politique 12 Axes !\n\n` +
    `🏛️ Chef politique :\n${leader}\n\n` +
    `👉 Passez le test et construisez le vôtre :\nhttps://12axes.vercel.app/fr`,
  shareTimelineFilePrefix: '12axes-chronologie',
  shareTimelineTitle: 'Ma chronologie idéologique | 12axes.vercel.app',
  shareTimelineMessage: (era) =>
    `Voyez ma chronologie idéologique sur le test politique 12 Axes !\n\n` +
    `⏳ Époque la plus compatible :\n${era}\n\n` +
    `👉 Passez le test et trouvez la vôtre :\nhttps://12axes.vercel.app/fr`,
  shareLivingFilePrefix: '12axes-pays-ou-vivre',
  shareLivingTitle: 'Les pays où je vivrais | 12axes.vercel.app',
  shareLivingMessage: (country, percent) =>
    `Voyez les pays où je me sentirais chez moi, selon le test politique 12 Axes !\n\n` +
    `🌎 Le plus compatible :\n${country} - ${percent} % de compatibilité\n\n` +
    `👉 Passez le test et trouvez le vôtre :\nhttps://12axes.vercel.app/fr`,
  shareNearbyPersonalities: 'PERSONNALITÉS PROCHES',
  shareNearbyParties: 'PARTIS PROCHES',
  shareValuesCompass: 'VALEURS ET BOUSSOLE',
  sharePersonalitiesFilePrefix: '12axes-personnalites',
  sharePersonalitiesTitle: 'Les personnalités les plus proches de mon profil | 12axes.vercel.app',
  sharePersonalitiesMessage: (name, percent) =>
    `Voyez les personnalités les plus proches de mon profil politique sur le test politique 12 Axes !\n\n` +
    `👤 Personnalité la plus compatible :\n` +
    `${name} - ${percent} % de compatibilité\n\n` +
    `👉 Passez le test et trouvez la vôtre :\nhttps://12axes.vercel.app/fr`,
  sharePartiesFilePrefix: '12axes-partis',
  sharePartiesTitle: 'Les partis les plus proches de mon profil | 12axes.vercel.app',
  sharePartiesMessage: (name, percent) =>
    `Voyez les partis les plus proches de mon profil politique sur le test politique 12 Axes !\n\n` +
    `🏛️ Parti actuel le plus compatible :\n` +
    `${name} - ${percent} % de compatibilité\n\n` +
    `👉 Passez le test et trouvez le vôtre :\nhttps://12axes.vercel.app/fr`,
  shareCompassFilePrefix: '12axes-boussole',
  shareCompassTitle: 'Mes valeurs et ma boussole politique | 12axes.vercel.app',
  shareCompassMessage: (ideology) =>
    `Voyez mes valeurs et ma boussole politique sur le test politique 12 Axes !\n\n` +
    `💡 Mon idéologie :\n${ideology}\n\n` +
    `👉 Passez le test et trouvez la vôtre :\nhttps://12axes.vercel.app/fr`,
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `J’ai découvert mon profil idéologique sur le test politique 12 Axes !\n\n` +
    `💡 Idéologie la plus compatible :\n` +
    `${ideology} - ${ideologyPct} % de compatibilité\n\n` +
    `🌎 Pays/nation le plus compatible :\n` +
    `${country} - ${countryPct} % de compatibilité\n\n` +
    `👤 Personnalité la plus compatible :\n` +
    `${personality} - ${personalityPct} % de compatibilité\n\n` +
    `👉 Passez le test et partagez votre résultat :\nhttps://12axes.vercel.app/fr`,
  progress: (current, total) => `Question ${current} sur ${total}`,
  progressDone: (percent) => `${percent} % terminé`,
  archetypeHeader: 'Identification de votre archétype',
  archetypeStep: (current, total) => `${current} sur ${total}`,
  progressAria: (percent) => `Progression du test : ${percent} %`,
  answersAria: 'Options de réponse',
  countryKicker: 'Pays le plus compatible',
  flagLabel: 'Drapeau',
  flagHistoricLabel: 'Drapeau / symbole historique',
  flagAlt: (label, name) => `${label} : ${name}`,
  flagUnavailable: 'Drapeau indisponible',
  flagUnavailableAria: (name) => `Drapeau indisponible pour ${name}`,
  personalityKicker: 'Personnalité la plus compatible',
  portraitAlt: (name) => `Portrait de ${name}`,
  portraitUnavailableAria: (name) => `Portrait indisponible pour ${name}`,
  compatibilityAria: (pct) => `Compatibilité : ${pct} pour cent`,
  matchWord: 'affinité',
  compatibilityLevels: {
    veryHigh: 'Compatibilité très élevée',
    high: 'Compatibilité élevée',
    medium: 'Compatibilité moyenne',
    low: 'Compatibilité faible',
    veryLow: 'Compatibilité très faible'
  },
  shareTitle: 'Mon profil idéologique | 12axes.vercel.app',
  shareTopMatch: 'Meilleure correspondance',
  shareCountry: 'Pays le plus compatible',
  sharePersonality: 'Personnalité',
  shareResultLabel: 'MON RÉSULTAT',
  shareMostCompatible: 'LE PLUS COMPATIBLE',
  shareYourAxes: 'VOS 12 AXES',
  shareOtherPersonalities: 'AUTRES PERSONNALITÉS',
  shareNearbyCountries: 'PAYS PROCHES',
  shareFooterCta: 'DÉCOUVREZ VOTRE PROFIL',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportTitle: '',
  ossTitle: 'Un projet indépendant et transparent',
  ossLead: 'Vous n’avez pas à nous croire sur parole. Le code de 12 Axes est public : vous pouvez voir comment chaque réponse est notée, comment la compatibilité est calculée et d’où viennent les profils.',
  ossCards: [
    { title: 'Indépendant', text: 'Aucun lien avec des partis, des gouvernements ou des campagnes. Personne ne paie pour apparaître dans votre résultat.' },
    { title: 'Auditable', text: 'La notation des réponses et le calcul de la compatibilité vivent dans le code, sans boîte noire.' },
    { title: 'Vérifiable', text: 'Les questions, idéologies, pays et personnalités sont stockés dans des fichiers versionnés dont l’historique est public.' },
    { title: 'Collaboratif', text: 'Vous avez trouvé une question biaisée ou un profil inexact ? Ouvrez une issue ou envoyez une pull request.' }
  ],
  ossBarText: 'Lisez le code, auditez les données et contribuez sur GitHub.',
  ossGithubCta: 'Voir sur GitHub',
  footerRights: '© 2026. Tous droits réservés',
  footerProject: 'Projet',
  footerExplore: 'Explorer',
  footerAbout: 'À propos',
  footerContribute: 'Contribuer',
  footerLicense: 'Licence',
  footerFullReport: 'Rapport complet',
  footerTerms: 'Conditions d’utilisation',
  footerPrivacy: 'Confidentialité',
  footerRefund: 'Remboursement',
  footerReport: 'Signaler',
  supportTitleEm: 'Soutenir',
  supportLead:
    '12 Axes est indépendant et gratuit. Si le test vous a aidé à mieux comprendre votre idéologie politique, pensez à faire un don par Pix ou en cryptomonnaie pour aider à faire vivre le projet.',
  supportPrivacyNote: 'Nous ne collectons aucune donnée. Pour donner sans vous identifier, utilisez la cryptomonnaie.',
  supportCopy: 'Copier',
  supportCopied: 'Copié !',
  supportCopyAria: (label) => `Copier l’adresse ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Clé aléatoire',
      address: 'bf3e8e0b-27fe-4845-b5e2-358ca0281847'
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      network: 'On-chain',
      address: 'bc1qsuy8r8gvl39apjykqzlgh7hku79ecarezhz2zj'
    },
    {
      id: 'lightning',
      name: 'Bitcoin',
      network: 'Lightning',
      address: 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhk2ctnw3jhymnsv96kcwfsa0gczg'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      network: 'ERC-20',
      address: '0xDe821e55D6101AA42D05DBf2C07ad0BB866C23a5'
    },
    {
      id: 'usdt',
      name: 'Tether (USDT)',
      network: 'Ethereum',
      address: '0xDe821e55D6101AA42D05DBf2C07ad0BB866C23a5'
    },
    {
      id: 'xmr',
      name: 'Monero',
      network: 'XMR',
      address:
        '85Du1EuRPkybMVXTVptC6z31dsGPpTthsiMKM3yjY7YE24BUCkyNMd9Q82kwe5CvE7BegtDTNxaG8VwYdVvTgbjDU6DpuN1'
    }
  ]
};
