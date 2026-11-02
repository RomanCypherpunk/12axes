// French UI dictionary: loaded only when the site opens in French.
import type { PersonalityCategory, ProfileDimension } from '../types/quiz';
import type { Strings } from './index';

// "de" + nom propre, avec élision devant une voyelle : « de Paris », « d’Allemagne ».
function de(name: string): string {
  return /^[AEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜŒ]/i.test(name.trim()) ? `d’${name}` : `de ${name}`;
}

export const fr: Strings = {
  htmlLang: 'fr',
  docTitle: '12 Axes — Test politique gratuit, quiz et boussole sur 12 axes',
  loadingAnalysis: "Chargement de l'analyse politique...",
  loadingQuiz: 'Chargement du quiz...',
  loadingResult: 'Chargement des résultats...',
  tryAgain: 'Réessayer',
  crashTitle: "Une erreur s'est produite",
  crashBody: 'La page a rencontré une erreur inattendue. Rechargez pour réessayer.',
  crashBodyWithProgress:
    'La page a rencontré une erreur inattendue, mais vos réponses sont enregistrées. Rechargez la page et choisissez de reprendre là où vous en étiez.',
  crashReload: 'Recharger la page',
  resumeEyebrow: 'Quiz en cours',
  resumeTitle: 'Reprenez là où vous en étiez',
  resumeBody: (answered, total) =>
    `Vous avez répondu à ${answered} questions sur ${total}. Vos réponses sont enregistrées dans ce navigateur.`,
  resumeContinue: 'Continuer',
  resumeDiscard: 'Recommencer',
  resumeUnavailable: "Le quiz précédent n'a pas pu être repris. Veuillez en commencer un nouveau.",
  doneEyebrow: 'Test terminé',
  doneTitle: 'Vous avez déjà passé le test',
  doneBody: (name) => `Votre résultat était ${name}. Il est enregistré dans ce navigateur, rouvrez-le simplement.`,
  doneView: 'Voir les résultats',
  doneRetake: 'Refaire le test',
  editAnswersButton: 'Modifier les réponses',
  editAnswersTitle: 'Modifier les réponses',
  editAnswersGroupsAria: 'Axes',
  editAnswersArchetype: 'Archétype',
  editAnswersReligion: 'Votre religion',
  editAnswersChanged: (count) =>
    count === 0 ? 'Aucune modification' : count === 1 ? '1 réponse modifiée' : `${count} réponses modifiées`,
  editAnswersCancel: 'Annuler',
  editAnswersSave: 'Enregistrer les réponses',
  editAnswersSaving: 'Recalcul…',
  editAnswersDiscard: 'Abandonner les modifications non enregistrées ?',
  editAnswersLoading: 'Chargement de vos réponses…',
  editAnswersUnavailable:
    "Vos réponses n'ont pas pu être ouvertes : les questions ont changé depuis votre test.",
  skipToContent: 'Aller au contenu',
  backToStartAria: 'Retour au début',
  mainNavAria: 'Navigation principale',
  navHow: 'Comment ça marche',
  navAxes: '12 Axes',
  navSpectrum: 'Spectre',
  navFaq: 'FAQ',
  navBooks: 'Livres',
  navIdeologies: 'Idéologies',
  navPersonalities: 'Personnalités',
  navCountries: 'Pays',
  navParties: 'Partis',
  navCompare: 'Comparer',
  navSupport: 'Soutenir',
  langToggleLabel: 'PT',
  langToggleAria: 'Passer en portugais',
  redoQuiz: 'Refaire le quiz',
  religionLabel: 'Religion',
  religionQuestion:
    "Suivez-vous une religion ? Nous l'utilisons uniquement pour adapter vos recommandations.",
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
  denominationQuestion: 'Quelle tradition chrétienne suivez-vous ?',
  denominationNames: { catholic: 'Catholique', protestant: 'Protestant', orthodox: 'Orthodoxe' },
  restartQuiz: 'Recommencer le quiz',
  heroEyebrow: 'Découverte politique',
  h1Pre: 'Connaissez-vous vraiment votre ',
  h1Em: 'idéologie politique',
  h1Post: '\u00A0?',
  introLead:
    "Vous vous trompez peut-être d'étiquette. En quelques minutes, découvrez votre véritable idéologie, le pays qui pense le plus comme vous, et le dirigeant politique le plus proche de vos idées.",
  startQuiz: 'Découvrir mon profil',
  seeAxes: 'Voir les 12 axes',
  heroLabels: ['Gratuit', 'Anonyme', 'Rapide', 'Résultat immédiat'],
  heroTeaserLabel: 'affinité',
  heroTeaserTag: 'Exemple de résultat',
  heroDeckDot: (position, total) => `Afficher l'exemple ${position} sur ${total}`,
  heroDeckAlt: (ideology) => `Exemple de carte de résultat partageable : ${ideology}`,
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
      description: 'Découvrez la synthèse exacte de votre pensée avec une précision de 100%.',
      duration: 'Environ 30 min',
      action: 'Commencer la version extrême'
    }
  },
  axisInfoAria: (label) => `Que signifie l'axe ${label} ?`,
  questionHelpAria: 'Comprendre cette question',
  questionHelpLabel: 'Comprendre',
  themeToDarkAria: 'Passer en mode sombre',
  themeToLightAria: 'Passer en mode clair',
  questionHelpTitle: 'À propos de cette question',
  questionHelpAgree: "Si vous êtes d'accord",
  questionHelpDisagree: "Si vous n'êtes pas d'accord",
  questionHelpNote: 'À retenir',
  questionHelpExample: 'Exemple',
  closeLabel: 'Fermer',
  personalityInfoAria: (name) => `Voir les détails sur ${name}`,
  closenessTitle: 'Ce qui vous rapproche',
  closenessYou: 'Vous',
  compareEyebrow: 'Analyse comparative',
  compareTitle: 'Analyse comparative',
  compareLead:
    'Choisissez une personnalité, un pays ou une idéologie et voyez, axe par axe, où vous êtes proches ou éloignés.',
  compareSearchLabel: 'Rechercher un profil à comparer',
  compareSearchPlaceholder: 'Rechercher une personnalité, un pays ou une idéologie',
  compareView: 'Voir',
  compareFieldCaption: 'Personnalité, pays ou idéologie',
  compareFullView: 'Voir la comparaison complète',
  compareExamplePlaceholder: 'Ex. : Donald Trump',
  compareAxesTitle: 'Vos 12 axes',
  compareNoResults: 'Aucun profil trouvé.',
  compareLoading: 'Comparaison en cours…',
  compareLoadError: 'Impossible de charger la comparaison. Réessayez.',
  compareTypeLabels: {
    personality: 'Personnalité',
    country: 'Pays',
    ideology: 'Idéologie',
    party: 'Parti ou organisation'
  },
  compareAxisAdverbs: {
    estrutura: 'structurellement',
    economia: 'économiquement',
    moral: 'moralement',
    tecnologia: 'technologiquement',
    diplomacia: 'diplomatiquement'
  },
  compareClosestLine: (adverb, name) => `Vous êtes ${adverb} compatible avec ${name}.`,
  compareFarthestLine: (adverb, name) => `Vous êtes ${adverb} éloigné ${de(name)}.`,
  compareClosestFallback: (axis, name) => `Sur ${axis}, vous êtes compatible avec ${name}.`,
  compareFarthestFallback: (axis, name) => `Sur ${axis}, vous êtes éloigné ${de(name)}.`,
  compareIdentical: (name) =>
    `Vous et ${name} avez des positions pratiquement identiques sur chaque axe.`,
  compareNearestLine: (axis, name) => `L’axe où vous êtes le plus proche ${de(name)} est ${axis}.`,
  compareNoFarLine: (name) => `Aucun axe ne vous éloigne ${de(name)}.`,
  compareValues: (pole, you, them, name) => `${pole} : vous ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Comparer des profils — 12 Axes',
  comparePageEyebrow: 'Comparer des profils',
  comparePageTitle: 'Côte à côte, sur les 12 axes',
  comparePageProfilesTitle: 'Profils',
  comparePageNeedMore: 'Choisissez un profil de plus à comparer.',
  comparePageFull: "Jusqu'à 3 profils. Retirez-en un pour en choisir un autre.",
  comparePageRemove: 'Retirer',
  comparePageRemoveAria: (name) => `Retirer ${name} de la comparaison`,
  comparePageUnknown: 'Profil introuvable',
  comparePageNotFound:
    "Un des profils de ce lien n'existe pas. Retirez-le et choisissez-en un autre.",
  comparePageAxesTitle: 'Les 12 axes',
  comparePageAxisAria: (axis, values) => `${axis} : ${values}`,
  comparePageCompassAria: (points) => `Boussole politique : ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% à droite, ${authoritarian}% autoritaire, ${traditional}% traditionaliste`,
  comparePageLegendAria: 'Légende de la boussole',
  comparePagePairsTitle: 'Compatibilité entre eux',
  comparePageSignatureTitle: 'Ce qui les distingue',
  comparePageIdeologyTitle: 'Idéologie la plus proche',
  comparePageNavIdeologies: 'Idéologies',
  comparePageNavAxes: '12 Axes',
  comparePageNavSignature: 'Singularité',
  comparePageNavCountries: 'Pays',
  comparePageNavParties: 'Partis',
  comparePageNavCompass: 'Boussole',
  comparePageNavCompatibility: 'Compatibilité',
  comparePageCommonLabel: 'En commun',
  comparePageNearestFor: (name) => `Le plus proche ${de(name)}`,
  comparePageCountriesTitle: 'Pays les plus proches',
  comparePagePartiesTitle: 'Partis les plus proches',
  comparePageBalanced: 'Équilibré',
  comparePageUnitPoints: 'pts',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) =>
    `${high} et ${low} sont à ${points} ${points === 1 ? 'point' : 'points'} d'écart sur cet axe.`,
  comparePageAgreeCap: (points) =>
    `C'est là qu'ils se rejoignent : seulement ${points} ${points === 1 ? 'point' : 'points'} d'écart.`,
  comparePageOpposite: 'Camps opposés',
  comparePageOppositeCount: (count, total) =>
    `Ils se trouvent dans des camps opposés sur ${count} des ${total} axes.`,
  comparePageNoOpposite: 'Aucun axe ne place ces profils dans des camps opposés.',
  comparePageDiverge: 'Là où ils divergent le plus',
  comparePageAgree: "Là où ils s'accordent le plus",
  comparePagePairLabel: 'Compatibilité',
  peopleTitle: "Comparer avec quelqu'un d'autre",
  peopleLead:
    "Collez le lien de résultat de quelqu'un d'autre et voyez, axe par axe, où vous êtes proches ou éloignés.",
  peopleNameLabel: "Nom de l'autre personne",
  peopleNameCaption: 'Nom',
  peopleUrlCaption: 'Lien du résultat',
  peopleNamePlaceholder: 'ex. Jean',
  peopleUrlLabel: "Lien de résultat de l'autre personne",
  peopleUrlPlaceholder: 'Collez le lien ici',
  peoplePaste: 'Coller',
  peoplePasteBlocked:
    "Le navigateur n'a pas autorisé la lecture du presse-papiers. Collez le lien dans le champ avec Ctrl+V.",
  peoplePasteBlockedTouch:
    'Impossible de lire le presse-papiers. Appuyez longuement sur le champ du lien et choisissez Coller.',
  peoplePasteEmpty: "Rien n'est encore copié. Copiez le lien du résultat et appuyez sur Coller.",
  peopleCompare: 'Comparer',
  peopleNameRequired: "Entrez le nom de l'autre personne.",
  peopleLinkMissing: (keys) =>
    `Ce lien ne contient pas tous les axes (manquants : ${keys}). Collez le lien de résultat complet.`,
  peopleLinkInvalid: (keys) =>
    `Valeur invalide dans le lien (${keys}). Chaque axe va de 0 à 100.`,
  peopleYou: 'Vous',
  peopleOther: "Quelqu'un d'autre",
  peopleBoth: 'Vous deux',
  compareBoth: 'Les deux',
  peopleShare: 'Partager la comparaison',
  shareCompareLabel: 'COMPARAISON',
  shareCompareFilePrefix: '12axes-comparaison',
  shareCompareTitle: (percent) => `Notre compatibilité politique : ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `J'ai comparé mon profil politique avec celui ${de(other)} sur le quiz politique 12 Axes !\n\n` +
    `🤝 Compatibilité entre nous : ${percent}%\n\n` +
    `💡 Mon idéologie :\n${mine}\n\n` +
    `💡 Idéologie ${de(other)} :\n${theirs}\n\n` +
    `👉 Voir la comparaison et passer le quiz :\n${url}`,
  peopleSignatureTitle: 'Ce qui vous distingue',
  peopleDiverge: 'Là où vous divergez le plus',
  peopleAgree: "Là où vous êtes le plus d'accord",
  peopleAgreeCap: (points) =>
    `C'est là que vous vous rejoignez : seulement ${points} ${points === 1 ? 'point' : 'points'} d'écart.`,
  peopleOppositeCount: (count, total) =>
    `Vous êtes dans des camps opposés sur ${count} des ${total} axes.`,
  peopleNoOpposite: 'Aucun axe ne vous place dans des camps opposés.',
  peopleBlocked: 'Le navigateur a bloqué le nouvel onglet.',
  peopleRename: (name) => `Modifier le nom ${de(name)}`,
  peopleNameInputLabel: 'Nom',
  peopleOpenLink: 'Ouvrir la comparaison',
  peoplePersonalitiesTitle: 'Personnalités les plus proches',
  peopleValuesTitle: 'Valeurs',
  peopleSharedValuesTitle: 'Valeurs partagées',
  peoplePairsTitle: 'Compatibilité entre vous',
  peopleNavPersonalities: 'Personnalités',
  peopleNavValues: 'Valeurs',
  peopleNavSharedValues: 'En commun',
  peoplePageDocTitle: "Comparer avec quelqu'un d'autre — 12 Axes",
  peoplePageTitle: 'Vous deux, sur les 12 axes',
  peoplePagePeopleTitle: 'Personnes',
  peoplePageBadLink:
    "Ce lien de comparaison est incomplet. Ouvrez votre résultat et utilisez « Comparer avec quelqu'un d'autre ».",
  peoplePageLoadError: 'Impossible de charger la comparaison. Réessayez.',
  peoplePageLoading: 'Comparaison en cours…',
  axisExplanations: {
    estrutura:
      'Mesure si vous préférez un pouvoir réparti entre États, villes et communautés locales ou un État national unitaire avec des lois et un commandement plus uniformes.',
    representacao:
      'Compare la confiance dans les élections, l’opposition et les institutions démocratiques avec une préférence pour un leadership fort, la technocratie, la monarchie ou des régimes autoritaires.',
    poder:
      'Évalue l’équilibre entre ordre, surveillance, sanction et contrôle étatique face à la vie privée, la liberté individuelle et l’autonomie civile.',
    imigracao:
      'Examine si vous valorisez l’assimilation culturelle, la langue et l’identité nationale ou le multiculturalisme, une migration ouverte et la pluralité des coutumes.',
    diplomacia:
      'Analyse votre position sur les forces armées, les armes, la dissuasion et l’intervention militaire face à la négociation, au pacifisme et aux organisations internationales.',
    intervencao:
      'Mesure l’inclination entre le non-interventionnisme extérieur et une souveraineté nationale plus affirmée, le nationalisme géopolitique et la défense active des intérêts nationaux.',
    economia:
      'Compare une préférence pour la propriété publique, les entreprises d’État et les services collectifs avec la propriété privée, la privatisation et le rôle moteur des entrepreneurs.',
    controle:
      'Évalue la planification étatique, la régulation et une politique économique active face aux marchés libres, à une faible ingérence de l’État, à l’autonomie monétaire et à la concurrence.',
    comercio:
      'Mesure le protectionnisme, la souveraineté productive et la défense de l’industrie nationale face au mondialisme, au libre-échange et à l’intégration économique internationale.',
    religiao:
      'Compare la laïcité, la séparation de la religion et de l’État, et la critique des privilèges religieux avec l’influence publique de la foi et des valeurs religieuses.',
    moral:
      'Évalue le progressisme culturel, les droits civils et le changement social face à la tradition, à la famille, aux coutumes et au conservatisme moral.',
    tecnologia:
      'Mesure l’enthousiasme pour la technologie, l’IA, l’ingénierie génétique et le développement technique face à une prudence biologique, environnementale et préservationniste.'
  },
  homeAxes: {
    estrutura: { label: 'Structure', leftPole: 'Fédéral', rightPole: 'Unitaire' },
    representacao: { label: 'Représentation', leftPole: 'Démocratie', rightPole: 'Autocratie' },
    poder: { label: 'Pouvoir', leftPole: 'Sécurité', rightPole: 'Liberté' },
    imigracao: { label: 'Immigration', leftPole: 'Assimilation', rightPole: 'Multiculturalisme' },
    diplomacia: { label: 'Diplomatie', leftPole: 'Militariste', rightPole: 'Pacifiste' },
    intervencao: { label: 'Intervention', leftPole: 'Non-interventionniste', rightPole: 'Nationaliste' },
    economia: { label: 'Économie', leftPole: 'Public', rightPole: 'Privé' },
    controle: { label: 'Contrôle', leftPole: 'Planification', rightPole: 'Libre marché' },
    comercio: { label: 'Commerce', leftPole: 'Protectionnisme', rightPole: 'Mondialisme' },
    religiao: { label: 'Religion', leftPole: 'Non religieux', rightPole: 'Religieux' },
    moral: { label: 'Morale', leftPole: 'Progressiste', rightPole: 'Traditionaliste' },
    tecnologia: { label: 'Technologie', leftPole: 'Technologie', rightPole: 'Biologie' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Gauche radicale',
      tone: 'darkred',
      description:
        'Communisme révolutionnaire ou totalitaire à parti unique, avec économie planifiée, forte centralisation et pouvoir d’État concentré.'
    },
    {
      id: 'left',
      label: 'Gauche',
      tone: 'green',
      description:
        'Défend la social-démocratie, le progressisme et une plus grande intervention de l’État dans l’économie au sein de la démocratie libérale.'
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
        'Défend le conservatisme, le libéralisme économique et un nationalisme modéré au sein de la démocratie libérale.'
    },
    {
      id: 'right-extreme',
      label: 'Extrême droite',
      tone: 'navy',
      description:
        'Fascisme, nationalisme racial et théocraties oppressives, avec rejet explicite de la démocratie et concentration autoritaire du pouvoir.'
    },
    {
      id: 'third-position',
      label: 'Troisième position',
      tone: 'purple',
      description:
        'Synthèse nationaliste et corporatiste qui rejette à la fois le capitalisme libéral et le marxisme, hors de l’axe gauche-droite traditionnel.'
    },
    {
      id: 'libertarian',
      label: 'Libertarien',
      tone: 'amber',
      description:
        'Défend un État minimal, les marchés libres, la propriété privée et les libertés individuelles, sans proposer l’abolition totale de l’État.'
    },
    {
      id: 'anarchist',
      label: 'Anarchiste',
      tone: 'charcoal',
      description:
        'Rejette l’État et toute autorité coercitive, en défendant une organisation sociale libre, volontaire et autogérée, de gauche ou de droite.'
    }
  ],
  faqItems: [
    {
      question: 'Le test est-il fiable ?',
      answer:
        'Le test politique 12 Axes est fiable comme outil de lecture et de comparaison des positions politiques. Il utilise des questions réparties sur 12 axes pour réduire le biais d’un seul thème, mais il ne remplace pas l’étude, le débat ou l’analyse académique.'
    },
    {
      question: 'Combien de temps cela prend-il ?',
      answer:
        'La version courte prend environ 5 minutes. La version complète environ 9 minutes. La version extrême, avec 240 questions, peut prendre environ 30 minutes.'
    },
    {
      question: 'Puis-je le refaire ?',
      answer:
        'Oui. Vous pouvez refaire le quiz politique autant de fois que vous voulez, y compris en choisissant une autre profondeur pour voir si votre résultat change.'
    },
    {
      question: 'Y a-t-il une bonne réponse ?',
      answer:
        'Il n’y a pas de bonne réponse. Le test d’idéologie mesure des préférences sur la démocratie, la monarchie, le fédéralisme, l’immigration, la religion en politique, la politique économique, le commerce international, le libéralisme, le conservatisme, le progressisme et d’autres sujets.'
    },
    {
      question: 'Comment l’algorithme calcule-t-il ?',
      answer:
        'Chaque réponse ajoute des points à un pôle précis. L’algorithme calcule des pourcentages par axe, compare votre vecteur idéologique aux profils de courants politiques, de pays et de personnalités, et renvoie les plus hautes compatibilités.'
    },
    {
      question: 'Le résultat change-t-il ?',
      answer:
        'Il peut changer si vos opinions évoluent, si vous répondez avec plus de nuances, ou si vous prenez une version plus longue. La version extrême tend à réduire les fluctuations en utilisant plus de questions.'
    },
    {
      question: 'Le test est-il scientifique ?',
      answer:
        '12 Axes n’est pas un instrument scientifique cliniquement validé. C’est un test politique éducatif, inspiré des modèles de spectre politique et des quizzes d’idéologie, utile pour la réflexion et la comparaison.'
    },
    {
      question: 'Puis-je le partager ?',
      answer:
        'Oui. Une fois terminé, vous pouvez partager votre résultat pour discuter d’idéologie politique, du spectre politique, de la gauche, de la droite, du centre et des 12 axes avec d’autres personnes.'
    },
    {
      question: 'Le test collecte-t-il des données ?',
      answer:
        'Le test est anonyme et ne demande aucune inscription. Les réponses servent à calculer le résultat au moment du quiz, sans demander votre nom, e-mail ou identification personnelle.'
    },
    {
      question: 'Puis-je le faire sur mon téléphone ?',
      answer:
        'Oui. L’interface est conçue pour mobile et ordinateur, afin que vous puissiez passer le test politique dans le navigateur de votre smartphone.'
    },
    {
      question: 'Qu’est-ce que 12 Axes ?',
      answer:
        '12 Axes est un test politique gratuit qui mesure votre position sur 12 axes (structure de l’État, représentation, libertés, immigration, diplomatie, intervention, économie, contrôle économique, commerce, religion, morale et technologie) et montre votre idéologie politique, pays et figure politique compatibles.'
    },
    {
      question: '12 Axes a-t-il une boussole politique ?',
      answer:
        'Oui. À la fin du résultat, il y a une boussole politique à deux axes, gauche × droite et autoritaire × libertaire, avec une barre progressiste × traditionaliste. Elle résume visuellement vos 12 axes, mais ne remplace pas l’analyse complète.'
    },
    {
      question: 'Comment trouver mon idéologie politique compatible ?',
      answer:
        'Passez le quiz politique, avec 36, 60 ou 240 questions. Le résultat montre les idéologies les plus compatibles avec vos réponses, avec le pourcentage de compatibilité et la position de chacune sur les 12 axes.'
    },
    {
      question: 'Puis-je savoir quel pays ou figure politique me correspond ?',
      answer:
        'Oui. Outre l’idéologie, le résultat compare votre profil avec des pays actuels, des régimes historiques et des figures politiques, en montrant les plus compatibles et les plus éloignés de vous.'
    },
    {
      question: 'Combien de questions le quiz politique comporte-t-il ?',
      answer:
        'Il y a trois versions : rapide, avec 36 questions, complète, avec 60, et extrême, avec 240. Toutes couvrent les mêmes 12 axes ; plus il y a de questions, plus le résultat tend à être précis.'
    }
  ],
  howEyebrow: 'Comment ça marche',
  howTitle: 'Comment fonctionne le quiz politique 12 Axes',
  howLead:
    'Un test d’idéologie politique simple et visuel : vous répondez à des affirmations, 12 Axes calcule vos pourcentages et montre où vous vous situez sur le spectre politique dans chaque dimension.',
  steps: [
    {
      title: 'Répondez aux questions',
      text: 'Approuvez ou désapprouvez des affirmations sur l’économie, l’État, les libertés civiles, les valeurs, la religion, la politique étrangère et la technologie.'
    },
    {
      title: 'Analyse sur 12 axes',
      text: 'Chaque réponse vous positionne sur 12 axes idéologiques indépendants — du libre marché à la planification, du nationalisme au mondialisme.'
    },
    {
      title: 'Découvrez votre profil',
      text: 'Recevez votre profil idéologique, les idéologies les plus compatibles, le pays le plus proche, une personnalité liée et les résultats par axe.'
    }
  ],
  axesGuideEyebrow: '12 axes',
  axesGuideTitle: 'Que signifie chaque axe ?',
  axesGuideLead:
    'Le test d’idéologie 12 Axes analyse le fédéralisme, la représentation politique, la démocratie, les élections, l’immigration, le commerce international, la religion en politique, la politique économique, la morale et la technologie dans des dimensions séparées.',
  discoveryEyebrow: 'Ce que vous découvrirez',
  discoveryTitle: 'Un portrait complet de vos convictions politiques',
  discoveryLead:
    'Plus que gauche ou droite : votre résultat montre qui, où, et avec quelle force vos idées s’alignent réellement.',
  discoveryItems: [
    { icon: 'ideology', title: 'Votre idéologie', text: 'Quel courant politique vous correspond' },
    { icon: 'country', title: 'Votre pays', text: 'Quelle nation pense le plus comme vous' },
    { icon: 'personality', title: 'Votre dirigeant politique', text: 'Quelle figure historique est votre match idéologique' },
    { icon: 'books', title: 'Livres recommandés', text: 'Un ouvrage notable de chaque figure politique qui vous correspond' },
    { icon: 'profile', title: 'Votre profil', text: 'Un portrait complet de vos convictions' },
    { icon: 'compatibility', title: 'Compatibilité', text: 'À quel point vous êtes vraiment d’accord avec votre propre idéologie' }
  ],
  exampleEyebrow: 'Exemple réel',
  exampleTitle: 'Voici à quoi ressemble votre résultat',
  exampleCaption: 'Exemple illustratif à partir de données réelles du catalogue 12 Axes.',
  exampleCta: 'Je veux voir mon résultat',
  spectrumEyebrow: 'Spectre politique',
  spectrumTitle: 'Découvrez votre spectre politique',
  spectrumLead:
    'Le résultat vous aide à visualiser votre position politique entre gauche, droite et centre, et identifie aussi des formes plus radicales, autoritaires ou libertaires hors de cet axe, comme l’extrême droite, la gauche radicale, la troisième position, le libertarianisme et l’anarchisme.',
  faqTitle: 'Questions fréquentes',
  faqLead: 'Tout ce que les gens demandent d’habitude avant de passer le test.',
  navStart: 'Début',
  navTakeTest: 'Passer le test',
  menuAria: 'Ouvrir le menu',
  roseAria: 'Rose des 12 axes',
  spectrumBarAria: 'Barre du spectre politique avec les huit catégories',
  versionsEyebrow: 'Versions',
  versionsTitle: 'Choisissez la profondeur',
  versionsLead:
    'Commencez par le quiz rapide ou allez plus loin pour un portrait plus précis de votre profil idéologique. Toutes les versions utilisent les mêmes 12 axes et renvoient le résultat immédiatement.',
  variantEyebrow: 'Choisissez le format',
  variantTitlePre: 'Préférez-vous la rapidité ou la ',
  variantTitleEm: 'précision\u00A0?',
  backToStart: 'Retour au début',
  depthLabel: 'Profondeur',
  depthAria: (level) => `Profondeur ${level} sur 3`,
  recommended: 'Recommandé',
  formatNotes: ['Toutes les versions utilisent les mêmes 12 axes', 'Anonyme, sans inscription', 'Résultat immédiat'],
  variantLead:
    'La version courte révèle le résultat rapidement. La version complète augmente la précision pour rapprocher votre résultat des profils idéologiques.',
  quizNavAria: 'Navigation du quiz',
  autoAdvance: 'Avancer après chaque réponse',
  swapQuestion: 'Changer',
  swapQuestionAria: 'Remplacer cette question par une autre sur le même thème',
  back: 'Retour',
  next: 'Suivant',
  calculating: 'Calcul…',
  seeResult: 'Voir les résultats',
  archetypeSkip: 'Passer',
  errMissingAnswer: 'Vous devez encore répondre à cette question avant de voir le résultat.',
  errLoadQuiz: 'Impossible de charger le quiz.',
  errCalc: 'Impossible de calculer le résultat.',
  errImage: "Impossible de générer l'image du résultat.",
  errHttp: (status) => `Erreur HTTP ${status}`,
  resultsEyebrow: 'Analyse terminée',
  resultsH1Pre: 'Votre profil ',
  resultsH1Em: 'idéologique',
  resultsLead: (count) =>
    `Analyse fondée sur ${count} réponses réparties sur 12 dimensions fondamentales de l’idéologie politique. Consultez votre position sur chaque axe et vos correspondances idéologiques.`,
  resultsLeadShared:
    'Résultat partagé : la position sur chacun des 12 axes politiques et les correspondances idéologiques calculées à partir de celle-ci. Passez le test pour découvrir le vôtre.',
  resultsSummaryAria: "Résumé de l'analyse",
  metaTop: 'Meilleure affinité',
  axesSectionEyebrow: 'Axes politiques',
  axesSectionTitle: 'Vos 12 axes',
  proximityEyebrow: 'Proximité idéologique',
  otherMatches: 'Autres idéologies',
  navOnThisPage: 'Sur cette page',
  resultsNavReport: 'Analyse complète',
  resultsNavAxes: '12 axes',
  resultsNavSignature: 'Singularité',
  resultsNavCountries: 'Pays',
  resultsNavPersonalities: 'Personnalités',
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
  compassInfo: {
    aria: 'Comment la boussole politique est construite',
    title: 'Comment la boussole est construite',
    authLead: "L'axe autoritaire × libertaire",
    authText:
      'mesure le degré de concentration du pouvoir politique et d’intervention de l’État dans la vie des individus. Il prend en compte trois dimensions principales : libertés individuelles, représentation politique et structure de l’État.',
    econLead: "L'axe gauche × droite",
    econText:
      'mesure à quel point vous êtes à gauche ou à droite selon l’organisation économique : de la propriété collective et de la planification étatique d’un côté à la propriété privée et aux marchés libres de l’autre. Il prend en compte les dimensions fondamentales de l’économie (propriété des moyens de production) et du contrôle (marché contre planification et régulation).',
    socialLead: "L'axe social",
    socialText:
      'mesure l’orientation de vos valeurs entre progressisme et traditionalisme, et reflète votre position sur les coutumes, la culture et les valeurs sociales.'
  },
  compassWith: 'avec',
  compassSocialValues: 'valeurs sociales',
  compassCenterLeft: 'Centre gauche',
  compassCenterRight: 'Centre droit',
  compassSpectrumLabels: {
    'esq-radical': 'Gauche radicale',
    esquerda: 'Gauche',
    centro: 'Centriste',
    direita: 'Droite',
    'ext-direita': 'Extrême droite',
    terceira: 'Troisième position',
    libertario: 'Libertarien',
    anarquismo: 'Anarchiste'
  },
  compassSocialLabels: {
    veryProgressive: 'Fortement progressiste',
    progressive: 'Progressiste',
    moderate: 'Modéré',
    traditional: 'Traditionaliste',
    veryTraditional: 'Fortement traditionaliste'
  },
  compassNote: {
    label: 'Sur la boussole :',
    hints: {
      terceira:
        'La troisième position unit un État fort à la nation et à la tradition. La boussole mesure l’économie et le pouvoir ; la nation, la morale et la religion n’y figurent pas.',
      'ext-direita':
        'L’extrême droite se définit par la hiérarchie et l’identité. La boussole mesure l’économie et le pouvoir ; la morale, la religion et la nation n’y figurent pas.',
      'esq-radical':
        'La gauche radicale se définit par la révolution et la collectivisation. La boussole mesure l’économie et le pouvoir ; le projet révolutionnaire n’y figure pas.',
      libertarian:
        'Votre idéologie se situe à la frontière de deux régions. La boussole mesure l’économie et le pouvoir, et une petite différence de part et d’autre décide du côté.',
      generic: 'La boussole mesure 5 des 12 axes ; les 7 autres restent hors champ.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `Votre position : ${right}% vers la droite, ${authoritarian}% vers l’autoritaire et ${traditional}% vers le traditionaliste.`,
  countriesSectionTitle: 'Pays les plus proches de vous',
  countryCurrentTab: 'Actuels',
  countryHistoricalTab: 'Historiques',
  countriesDistantTitle: 'Les plus éloignés de vous',
  partiesSectionTitle: 'Partis les plus proches de vous',
  partyCurrentTab: 'Parti actif',
  partyHistoricalTab: 'Parti historique',
  partiesDistantTitle: 'Les plus éloignés de vous',
  partyLogoAlt: (name) => `Symbole ${de(name)}`,
  partyLogoUnavailable: 'Symbole indisponible',
  personalitiesSectionTitle: 'Figures les plus proches de vous',
  personalitiesByAreaTitle: 'Aussi proches de vous, par domaine',
  dimensionsTitle: 'Aussi proches de vous, par dimension de votre profil',
  dimensionLabels: {
    political: 'Politiquement',
    social: 'Socialement',
    economic: 'Économiquement'
  },
  booksEyebrow: 'Aller plus loin',
  booksTitle: 'Pour aller plus loin',
  booksTopLabel: 'Les plus proches de vous',
  booksAuthorLabel: 'Auteur',
  booksLead: 'Une œuvre de chacune des figures les plus proches de vos résultats.',
  booksWhy: (pct) => `${pct}% compatible`,
  booksYearBc: (year) => `${year} av. J.-C.`,
  booksCta: 'Voir sur Amazon',
  areasGeneralTitle: 'Les figures les plus proches de vos résultats',
  areasSectionTitle: 'Les figures les plus proches par domaine',
  areasTabsAria: 'Comment les figures sont regroupées',
  areasGeneralTab: 'Compatibilité globale',
  areasByAreaTab: 'Domaine',
  exportCsv: 'Exporter le tableur',
  paywallTitle: 'Rapport complet',
  paywallLead: 'Obtenez le rapport complet pour découvrir votre profil politique en profondeur.',
  paywallUnlockTitle: 'Débloquer maintenant',
  paywallPreviewTitles: [
    'Analyse complète, axe par axe',
    'Là où vous êtes le plus en désaccord',
    'Votre gouvernement idéal',
    'Votre frise idéologique',
    '10 pays ou régions où vivre'
  ],
  paywallModalTag: 'Votre rapport complet',
  paywallModalTitle: 'Comprenez votre profil politique en profondeur',
  paywallModalLead:
    'Allez au-delà du résultat : voyez ce qui se cache derrière chaque axe, où vous êtes le plus en désaccord et qui gouvernerait à vos côtés.',
  paywallIncludesTitle: 'Ce que vous obtiendrez :',
  paywallIncludes: [
    {
      lead: 'Analyse des 12 axes, un par un :',
      text: 'ce que votre position sur chaque axe signifie et ce qui a le plus pesé dans vos réponses.'
    },
    {
      lead: 'Là où vous êtes le plus en désaccord :',
      text: 'avec l’idéologie, la figure et le pays les plus proches de vous, axe par axe.'
    },
    {
      lead: 'Votre gouvernement idéal :',
      text: 'neuf postes pourvus par les figures les plus compatibles avec vous.'
    },
    {
      lead: 'Votre frise idéologique :',
      text: 'les profils les plus proches de chaque époque, de l’Antiquité au XXIe siècle.'
    },
    {
      lead: 'Vers quel pays déménager :',
      text: 'les 10 pays actuels les plus proches de vos idéaux politiques, pour savoir où vous vous sentiriez chez vous.'
    },
    {
      lead: 'Figures par domaine :',
      text: 'la figure la plus compatible avec vous en politique, en philosophie, en économie et dans les autres domaines.'
    },
    {
      lead: 'Classement complet et tableur :',
      text: 'votre compatibilité avec tout le catalogue, à exporter dans Excel.'
    }
  ],
  paywallGuarantee: 'Remboursement garanti pendant 7 jours',
  paywallPayWith:
    'Moyens de paiement : cartes, PayPal, Apple Pay, Google Pay et plus, selon votre pays',
  paywallPrice: '3,99 US$',
  paywallCta: 'Débloquer le rapport complet',
  paywallChecking: 'Confirmation de votre paiement...',
  paywallProblems: {
    denied: 'Ce paiement ne s’applique pas à ce résultat, ou il a été remboursé.',
    unavailable: 'Service indisponible pour le moment, réessayez dans quelques instants.',
    timeout: 'Le paiement n’a pas encore été confirmé.'
  },
  paywallRetry: 'Vérifier à nouveau',
  paywallOpening: 'Ouverture du paiement...',
  paywallEmailLabel: 'Votre e-mail',
  paywallEmailPlaceholder: 'vous@exemple.com',
  paywallEmailInvalid: 'Entrez un e-mail valide.',
  unlockedTag: 'Paiement confirmé',
  unlockedTitle: 'Votre rapport complet est débloqué !',
  unlockedLead:
    'Vous pouvez maintenant accéder à votre rapport complet. Pour l’ouvrir plus tard, enregistrez le lien d’accès ci-dessous.',
  unlockedCta: 'Voir le rapport',
  unlockedCopy: 'Copier le lien d’accès',
  unlockedCopied: 'Lien copié !',
  areasLockedTitle: 'Disponible dans le rapport complet',
  areasLockedText:
    'Voyez la figure la plus proche de vous dans chaque domaine, de la politique à la philosophie, et bien plus dans le rapport complet de votre résultat.',
  areasLockedCta: 'Voir le rapport complet',
  personalitiesDistantTitle: 'Les plus éloignées de vous',
  ideologyDistantTitle: 'L’idéologie la plus éloignée de vous',
  phraseTitle: 'Une phrase qui vous décrit',
  aboutIdeology: (ideology) => `À propos ${de(ideology)}`,
  knowMoreAbout: (name) => `En savoir plus sur ${name}`,
  showLess: 'Afficher moins',
  matchTopKicker: 'La plus compatible',
  dimensionsTitleShort: 'Aussi proches, par dimension',
  phraseNote: (ideology) =>
    `C’est ainsi que quelqu’un issu de ${ideology} résumerait la société qu’il souhaite.`,
  signatureTitle: 'Ce qui vous distingue',
  signatureUnusualLabel: 'Votre position la plus inhabituelle',
  signatureCommonLabel: 'Votre position la plus typique',
  signatureUnusualLead: (pole, percent) =>
    `Vous penchez davantage vers ${pole.toLowerCase()} que ${Math.round(percent)}% des idéologies du catalogue.`,
  signatureUnusualLeadMax: (pole) =>
    `Aucune idéologie du catalogue ne penche autant vers ${pole.toLowerCase()} que vous.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Votre position sur ${axis} est plutôt centrale. Elle vous place malgré tout davantage vers ${pole.toLowerCase()} que ${Math.round(percent)}% des idéologies du catalogue.`,
  signatureUnusualNote: (axis) =>
    `Sur les 12 axes, ${axis} est celui où vous vous écartez le plus des autres idéologies du catalogue. C’est ce qui vous distingue.`,
  signatureCommonLead: (axis) =>
    `Votre position sur ${axis} se situe presque exactement à la médiane du catalogue.`,
  signatureCommonNote: (pole) =>
    `C’est un terrain commun. Vous ne penchez ni vers ${pole.toLowerCase()} ni vers le pôle opposé.`,
  signatureCommonNoteBalanced: (axis) =>
    `Vous êtes au centre sur ${axis}, et le catalogue aussi. C’est là que votre profil se démarque le moins.`,
  tensionLabel: 'Votre tension interne',
  tensionCombo: (firstPole, secondPole) => `${firstPole} et ${secondPole} en même temps`,
  tensionRare: (count, total) =>
    `Seules ${count} des ${total} idéologies du catalogue combinent ces deux positions.`,
  tensionUnique: 'Aucune idéologie du catalogue ne combine ces deux positions.',
  tensionExamples: (names) => `Correspondances les plus proches : ${names}.`,
  tensionNote: (firstAxis, secondAxis) =>
    `Dans le catalogue, ${firstAxis} et ${secondAxis} évoluent en général ensemble. Vous inversez ce schéma.`,
  signatureMedian: 'Médiane des idéologies',
  signatureYou: 'Vous',
  signatureBigCap: (pole) =>
    `des idéologies penchent moins vers ${pole.toLowerCase()} que vous.`,
  signatureAtMedian: 'À la médiane',
  signatureAtCentre: 'Au centre',
  tensionRareShort: (count, total) =>
    `Seules ${count} idéologies sur ${total} combinent ces deux positions.`,
  personalityCategories: {
    politico: 'Politique',
    religioso: 'Religion',
    economista: 'Économie',
    filosofo: 'Philosophie',
    teorico: 'Théorie politique',
    empresario: 'Affaires',
    intelectual: 'Vie intellectuelle',
    ativista: 'Activisme'
  },
  redoAnalysis: "Refaire l'analyse",
  share: 'Partager',
  saveOrShare: 'Partager le résultat',
  generatingPng: 'Génération du PNG...',
  sharePreviewTitle: 'Votre carte de résultat',
  sharePreviewCompareTitle: 'Carte de comparaison',
  sharePreviewAlt: 'Aperçu de votre carte de résultat partageable',
  sharePreviewLoading: 'Génération de l’aperçu de votre carte',
  generatingPdf: 'Génération du PDF...',
  downloadPdf: 'Télécharger le PDF',
  report: {
    fileName: '12axes-rapport',
    docLabel: 'Rapport complet',
    profileEyebrow: 'Votre profil idéologique',
    headerLabel: (ideology) => `Rapport de profil politique · ${ideology}`,
    kpiCountry: 'Pays le plus proche',
    kpiPersonality: 'Figure',
    kpiAxes: 'Axes analysés',
    kpiAnswered: (count) => `${count} questions répondues`,
    tocTitle: 'Dans ce rapport',
    generatedOn: (date) => `Généré le ${date}`,
    axesIntro:
      'Votre position sur chacun des 12 axes. La barre part du centre (50%) et s’étend du côté où vous penchez ; le badge indique l’intensité.',
    intensityLegend: 'Intensité',
    intensityLevels: [
      'Équilibré · jusqu’à 57%',
      'Incliné · 58 à 72%',
      'Fort · 73 à 87%',
      'Très fort · 88% ou plus'
    ],
    alsoClose: 'Aussi proches, par dimension de votre profil',
    continued: 'suite',
    areasIntro: 'Les figures du catalogue dont le profil sur les 12 axes ressemble le plus au vôtre.',
    booksIntro: 'Une œuvre de chacune des figures les plus proches de vos résultats.',
    aboutTitle: 'À propos de ce rapport',
    aboutText:
      '12 Axes compare vos réponses avec des profils d’idéologies, de pays et de figures sur les mêmes 12 axes. La compatibilité mesure la proximité entre profils ; ce n’est ni un diagnostic scientifique ni une étiquette définitive. Vos réponses ne sont pas stockées.',
    ctaTitle: 'Refaire le quiz ou le partager'
  },
  shareFilePrefix: '12axes-profil',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `J'ai découvert mon profil idéologique sur le quiz politique 12 Axes !\n\n` +
    `💡 Idéologie la plus compatible :\n` +
    `${ideology} - ${ideologyPct}% de compatibilité\n\n` +
    `🌎 Pays/nation le plus compatible :\n` +
    `${country} - ${countryPct}% de compatibilité\n\n` +
    `👤 Personnalité la plus compatible :\n` +
    `${personality} - ${personalityPct}% de compatibilité\n\n` +
    `👉 Passez le test et partagez votre résultat :\nhttps://12axes.vercel.app/fr`,
  progress: (current, total) => `Question ${current} sur ${total}`,
  progressDone: (percent) => `${percent}% terminé`,
  archetypeHeader: 'Identification de votre archétype',
  archetypeStep: (current, total) => `${current} sur ${total}`,
  progressAria: (percent) => `Progression du quiz : ${percent}%`,
  answersAria: 'Options de réponse',
  countryKicker: 'Pays le plus compatible',
  flagLabel: 'Drapeau',
  flagHistoricLabel: 'Drapeau / symbole historique',
  flagAlt: (label, name) => `${label} ${de(name)}`,
  flagUnavailable: 'Drapeau indisponible',
  flagUnavailableAria: (name) => `Drapeau indisponible pour ${name}`,
  personalityKicker: 'Personnalité la plus compatible',
  portraitAlt: (name) => `Portrait ${de(name)}`,
  portraitUnavailableAria: (name) => `Portrait indisponible pour ${name}`,
  compatibilityAria: (pct) => `Compatibilité : ${pct} pour cent`,
  matchWord: 'affinité',
  compatibilityLevels: {
    veryHigh: 'Compatibilité très élevée',
    high: 'Compatibilité élevée',
    medium: 'Compatibilité moyenne',
    low: 'Compatibilité faible',
    veryLow: 'Compatibilité très faible'
  },
  shareTitle: 'Mon profil idéologique | 12axes.vercel.app',
  shareTopMatch: 'Meilleure affinité',
  shareCountry: 'Pays le plus compatible',
  sharePersonality: 'Personnalité',
  shareResultLabel: 'MON RÉSULTAT',
  shareMostCompatible: 'LES PLUS COMPATIBLES',
  shareYourAxes: 'VOS 12 AXES',
  shareOtherPersonalities: 'AUTRES PERSONNALITÉS',
  shareNearbyCountries: 'PAYS PROCHES',
  shareFooterCta: 'DÉCOUVREZ VOTRE PROFIL',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Soutenir le projet',
  supportTitle: '',
  ossEyebrow: 'Open source',
  ossTitle: 'Un projet indépendant et transparent',
  ossLead:
    "Vous n'avez pas à nous croire sur parole. Le code de 12 Axes est public : vous pouvez voir comment chaque réponse est notée, comment la compatibilité est calculée et d'où viennent les profils.",
  ossCards: [
    {
      title: 'Indépendant',
      text: "Aucun lien avec des partis, des gouvernements ou des campagnes. Personne ne paie pour apparaître dans votre résultat."
    },
    {
      title: 'Auditable',
      text: 'La notation des réponses et le calcul de compatibilité sont dans le code, sans boîte noire.'
    },
    {
      title: 'Vérifiable',
      text: 'Questions, idéologies, pays et personnalités sont stockés dans des fichiers versionnés avec un historique public.'
    },
    {
      title: 'Collaboratif',
      text: 'Vous avez trouvé une question biaisée ou un profil inexact ? Ouvrez une issue ou envoyez une pull request.'
    }
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
  footerTerms: "Conditions d'utilisation",
  footerPrivacy: 'Confidentialité',
  footerRefund: 'Remboursement',
  footerReport: 'Signaler un problème',
  supportTitleEm: 'Soutenir',
  supportLead:
    '12 Axes est indépendant et gratuit. Si le quiz vous a aidé à mieux comprendre votre idéologie politique, envisagez un don via Pix ou crypto pour aider à faire vivre le projet.',
  supportPrivacyNote: "Nous ne collectons pas de données. Pour donner sans vous identifier, utilisez la crypto.",
  supportCopy: 'Copier',
  supportCopied: 'Copié !',
  supportCopyAria: (label) => `Copier l'adresse ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Random key',
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
