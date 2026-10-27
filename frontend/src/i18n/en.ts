// Dicionário de UI em inglês: só é baixado por quem abre o site em inglês.
import type { PersonalityCategory, ProfileDimension } from '../types/quiz';
import type { Strings } from './index';

export const en: Strings = {
  htmlLang: 'en',
  docTitle: '12 Axes — Free Political Test, Quiz & Compass Across 12 Axes',
  loadingAnalysis: 'Loading political analysis...',
  loadingQuiz: 'Loading quiz...',
  loadingResult: 'Loading results...',
  tryAgain: 'Try again',
  crashTitle: 'Something went wrong',
  crashBody: 'The page hit an unexpected error. Reload to try again.',
  crashBodyWithProgress: 'The page hit an unexpected error, but your answers are saved. Reload and choose to continue where you left off.',
  crashReload: 'Reload the page',
  resumeEyebrow: 'Quiz in progress',
  resumeTitle: 'Pick up where you left off',
  resumeBody: (answered, total) => `You have answered ${answered} of ${total} questions. Your answers are saved in this browser.`,
  resumeContinue: 'Continue',
  resumeDiscard: 'Start over',
  resumeUnavailable: 'The previous quiz could not be resumed. Please start a new one.',
  doneEyebrow: 'Test completed',
  doneTitle: 'You have already taken the test',
  doneBody: (name) => `Your result was ${name}. It is saved in this browser, just open it again.`,
  doneView: 'View results',
  doneRetake: 'Retake the test',
  editAnswersButton: 'Edit answers',
  editAnswersTitle: 'Edit answers',
  editAnswersGroupsAria: 'Axes',
  editAnswersArchetype: 'Archetype',
  editAnswersReligion: 'Your religion',
  editAnswersChanged: (count) => (count === 0 ? 'No changes' : count === 1 ? '1 answer changed' : `${count} answers changed`),
  editAnswersCancel: 'Cancel',
  editAnswersSave: 'Save answers',
  editAnswersSaving: 'Recalculating…',
  editAnswersDiscard: 'Discard the changes you have not saved?',
  editAnswersLoading: 'Loading your answers…',
  editAnswersUnavailable: 'Your answers could not be opened: the questions changed after you took the test.',
  skipToContent: 'Skip to content',
  backToStartAria: 'Back to start',
  mainNavAria: 'Main navigation',
  navHow: 'How it works',
  navAxes: '12 Axes',
  navSpectrum: 'Spectrum',
  navFaq: 'FAQ',
  navBooks: 'Books',
  navIdeologies: 'Ideologies',
  navPersonalities: 'Personalities',
  navCountries: 'Countries',
  navParties: 'Parties',
  navCompare: 'Compare',
  navSupport: 'Support',
  langToggleLabel: 'PT',
  langToggleAria: 'Mudar para português',
  redoQuiz: 'Retake quiz',
  religionLabel: 'Religion',
  religionQuestion: 'Do you follow a religion? We only use this to tailor your recommendations.',
  religionNone: 'No religion, agnostic or atheist',
  religionNames: {
    christianity: 'Christianity',
    judaism: 'Judaism',
    islam: 'Islam',
    buddhism: 'Buddhism',
    hinduism: 'Hinduism',
    other: 'Other religion'
  },
  denominationLabel: 'Christian tradition',
  denominationQuestion: 'Which Christian tradition do you follow?',
  denominationNames: { catholic: 'Catholic', protestant: 'Protestant', orthodox: 'Orthodox' },
  restartQuiz: 'Restart quiz',
  heroEyebrow: 'Political discovery',
  h1Pre: 'Do you really know your ',
  h1Em: 'political ideology',
  h1Post: '?',
  introLead:
    'You might be labeling yourself wrong. In a few minutes, discover your real ideology, the country that thinks most like you, and the political leader closest to your ideas.',
  startQuiz: 'Discover my profile',
  seeAxes: 'See the 12 axes',
  heroLabels: ['Free', 'Anonymous', 'Fast', 'Instant result'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Example result',
  heroDeckDot: (position, total) => `Show example ${position} of ${total}`,
  heroDeckAlt: (ideology) => `Example of the shareable result card: ${ideology}`,
  formats: {
    short: {
      label: 'Short',
      questionCount: '36 questions',
      description: 'A quick result, ideal for a first reading of your profile',
      duration: 'About 5 min',
      action: 'Start short version'
    },
    extended: {
      label: 'Full',
      questionCount: '60 questions',
      description: 'More precision to bring your result closer to the ideological profiles.',
      duration: 'About 9 min',
      action: 'Start full version'
    },
    extreme: {
      label: 'Extreme',
      questionCount: '240 questions',
      description: 'Know the exact synthesis of your thinking with 100% precision.',
      duration: 'About 30 min',
      action: 'Start extreme version'
    }
  },
  axisInfoAria: (label) => `What does the ${label} axis mean?`,
  questionHelpAria: 'Understand this question',
  questionHelpLabel: 'Understand',
  themeToDarkAria: 'Switch to dark mode',
  themeToLightAria: 'Switch to light mode',
  questionHelpTitle: 'About this question',
  questionHelpAgree: 'If you agree',
  questionHelpDisagree: 'If you disagree',
  questionHelpNote: 'Worth remembering',
  questionHelpExample: 'Example',
  closeLabel: 'Close',
  personalityInfoAria: (name) => `See details about ${name}`,
  closenessTitle: 'What brings you closer',
  closenessYou: 'You',
  compareEyebrow: 'Comparative analysis',
  compareTitle: 'Comparative analysis',
  compareLead: 'Pick a personality, country or ideology and see, axis by axis, where you are close or far apart.',
  compareSearchLabel: 'Search a profile to compare',
  compareSearchPlaceholder: 'Search a personality, country or ideology',
  compareView: 'View',
  compareFieldCaption: 'Personality, country or ideology',
  compareFullView: 'See full comparison',
  compareExamplePlaceholder: 'Ex.: Donald Trump',
  compareAxesTitle: 'Your 12 axes',
  compareNoResults: 'No profiles found.',
  compareLoading: 'Comparing…',
  compareLoadError: 'Could not load the comparison. Please try again.',
  compareTypeLabels: { personality: 'Personality', country: 'Country', ideology: 'Ideology', party: 'Party or organization' },
  compareAxisAdverbs: {
    estrutura: 'structurally',
    economia: 'economically',
    moral: 'morally',
    tecnologia: 'technologically',
    diplomacia: 'diplomatically'
  },
  compareClosestLine: (adverb, name) => `You are ${adverb} compatible with ${name}.`,
  compareFarthestLine: (adverb, name) => `You are ${adverb} distant from ${name}.`,
  compareClosestFallback: (axis, name) => `In ${axis}, you are compatible with ${name}.`,
  compareFarthestFallback: (axis, name) => `In ${axis}, you are distant from ${name}.`,
  compareIdentical: (name) => `You and ${name} have practically identical positions on every axis.`,
  compareNearestLine: (axis, name) => `Your closest axis to ${name} is ${axis}.`,
  compareNoFarLine: (name) => `No axis is far from ${name}.`,
  compareValues: (pole, you, them, name) => `${pole}: you ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Compare profiles — 12 Axes',
  comparePageEyebrow: 'Compare profiles',
  comparePageTitle: 'Side by side, on the 12 axes',
  comparePageProfilesTitle: 'Profiles',
  comparePageNeedMore: 'Pick one more profile to compare.',
  comparePageFull: 'Up to 3 profiles. Remove one to pick another.',
  comparePageRemove: 'Remove',
  comparePageRemoveAria: (name) => `Remove ${name} from the comparison`,
  comparePageUnknown: 'Profile not found',
  comparePageNotFound: 'One of the profiles in this link does not exist. Remove it and pick another.',
  comparePageAxesTitle: 'The 12 axes',
  comparePageAxisAria: (axis, values) => `${axis}: ${values}`,
  comparePageCompassAria: (points) => `Political compass: ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% right, ${authoritarian}% authoritarian, ${traditional}% traditionalist`,
  comparePageLegendAria: 'Compass legend',
  comparePagePairsTitle: 'Compatibility between them',
  comparePageSignatureTitle: 'What sets them apart',
  comparePageIdeologyTitle: 'Closest ideology',
  comparePageNavIdeologies: 'Ideologies',
  comparePageNavAxes: '12 Axes',
  comparePageNavSignature: 'Distinction',
  comparePageNavCountries: 'Countries',
  comparePageNavParties: 'Parties',
  comparePageNavCompass: 'Compass',
  comparePageNavCompatibility: 'Compatibility',
  comparePageCommonLabel: 'In common',
  comparePageNearestFor: (name) => `Closest to ${name}`,
  comparePageCountriesTitle: 'Closest countries',
  comparePagePartiesTitle: 'Closest parties',
  comparePageBalanced: 'Balanced',
  comparePageUnitPoints: 'pts',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) => `${high} and ${low} are ${points} ${points === 1 ? 'point' : 'points'} apart on this axis.`,
  comparePageAgreeCap: (points) => `This is where they meet: only ${points} ${points === 1 ? 'point' : 'points'} apart.`,
  comparePageOpposite: 'Opposite sides',
  comparePageOppositeCount: (count, total) => `They land on opposite sides in ${count} of ${total} axes.`,
  comparePageNoOpposite: 'No axis puts these profiles on opposite sides.',
  comparePageDiverge: 'Where they differ most',
  comparePageAgree: 'Where they agree most',
  comparePagePairLabel: 'Compatibility',
  peopleTitle: 'Compare with someone else',
  peopleLead: "Paste another person's result link and see, axis by axis, where you are close or far apart.",
  peopleNameLabel: "Other person's name",
  peopleNameCaption: 'Name',
  peopleUrlCaption: 'Result link',
  peopleNamePlaceholder: 'e.g. John',
  peopleUrlLabel: "Other person's result link",
  peopleUrlPlaceholder: 'Paste the link here',
  peoplePaste: 'Paste',
  peoplePasteBlocked: 'The browser did not allow reading the clipboard. Paste the link into the field with Ctrl+V.',
  peoplePasteBlockedTouch: 'Could not read the clipboard. Tap and hold the link field and choose Paste.',
  peoplePasteEmpty: 'Nothing copied yet. Copy the result link and tap Paste.',
  peopleCompare: 'Compare',
  peopleNameRequired: "Enter the other person's name.",
  peopleLinkMissing: (keys) => `This link does not have every axis (missing: ${keys}). Paste the full result link.`,
  peopleLinkInvalid: (keys) => `Invalid value in the link (${keys}). Each axis goes from 0 to 100.`,
  peopleYou: 'You',
  peopleOther: 'Someone else',
  peopleBoth: 'You two',
  compareBoth: 'Both',
  peopleShare: 'Share comparison',
  shareCompareLabel: 'COMPARISON',
  shareCompareFilePrefix: '12axes-comparison',
  shareCompareTitle: (percent) => `Our political compatibility: ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `I compared my political profile with ${other}'s on the 12 Axes Political Quiz!\n\n` +
    `🤝 Compatibility between us: ${percent}%\n\n` +
    `💡 My ideology:\n${mine}\n\n` +
    `💡 ${other}'s ideology:\n${theirs}\n\n` +
    `👉 See the comparison and take the quiz:\n${url}`,
  peopleSignatureTitle: 'What sets you apart',
  peopleDiverge: 'Where you differ most',
  peopleAgree: 'Where you agree most',
  peopleAgreeCap: (points) => `This is where you meet: only ${points} ${points === 1 ? 'point' : 'points'} apart.`,
  peopleOppositeCount: (count, total) => `You land on opposite sides in ${count} of ${total} axes.`,
  peopleNoOpposite: 'No axis puts you on opposite sides.',
  peopleBlocked: 'The browser blocked the new tab.',
  peopleRename: (name) => `Edit ${name}'s name`,
  peopleNameInputLabel: 'Name',
  peopleOpenLink: 'Open the comparison',
  peoplePersonalitiesTitle: 'Closest personalities',
  peopleValuesTitle: 'Values',
  peopleSharedValuesTitle: 'Shared values',
  peoplePairsTitle: 'Compatibility between you',
  peopleNavPersonalities: 'Personalities',
  peopleNavValues: 'Values',
  peopleNavSharedValues: 'In common',
  peoplePageDocTitle: 'Compare with someone else — 12 Axes',
  peoplePageTitle: 'The two of you, on the 12 axes',
  peoplePagePeopleTitle: 'People',
  peoplePageBadLink: 'This comparison link is incomplete. Open your result and use "Compare with someone else".',
  peoplePageLoadError: 'Could not load the comparison. Please try again.',
  peoplePageLoading: 'Comparing…',
  axisExplanations: {
    estrutura:
      'Measures whether you prefer power distributed among states, cities, and local communities or a unitary national state with more uniform laws and command.',
    representacao:
      'Compares trust in elections, opposition, and democratic institutions with a preference for strong leadership, technocracy, monarchy, or authoritarian regimes.',
    poder:
      'Evaluates the balance between order, surveillance, punishment, and state control versus privacy, individual freedom, and civil autonomy.',
    imigracao:
      'Looks at whether you value cultural assimilation, language, and national identity or multiculturalism, open migration, and plurality of customs.',
    diplomacia:
      'Analyzes your position on armed forces, weapons, deterrence, and military intervention in contrast with negotiation, pacifism, and international organizations.',
    intervencao:
      'Measures the leaning between external non-interventionism and more assertive national sovereignty, geopolitical nationalism, and active defense of national interests.',
    economia:
      'Compares a preference for public ownership, state companies, and collective services with private property, privatization, and business leadership.',
    controle:
      'Evaluates state planning, regulation, and active economic policy against free markets, low interference, monetary autonomy, and competition.',
    comercio:
      'Measures protectionism, productive sovereignty, and defense of national industry against globalism, free trade, and international economic integration.',
    religiao:
      'Compares secularism, separation of religion and state, and criticism of religious privileges with the public influence of faith and religious values.',
    moral:
      'Evaluates cultural progressivism, civil rights, and social change in contrast with tradition, family, customs, and moral conservatism.',
    tecnologia:
      'Measures enthusiasm for technology, AI, genetic engineering, and technical development against biological, environmental, and preservationist caution.'
  },
  homeAxes: {
    estrutura: { label: 'Structure', leftPole: 'Federal', rightPole: 'Unitary' },
    representacao: { label: 'Representation', leftPole: 'Democracy', rightPole: 'Autocracy' },
    poder: { label: 'Power', leftPole: 'Security', rightPole: 'Liberty' },
    imigracao: { label: 'Immigration', leftPole: 'Assimilation', rightPole: 'Multiculturalism' },
    diplomacia: { label: 'Diplomacy', leftPole: 'Militarist', rightPole: 'Pacifist' },
    intervencao: { label: 'Intervention', leftPole: 'Non-interventionist', rightPole: 'Nationalist' },
    economia: { label: 'Economy', leftPole: 'Public', rightPole: 'Private' },
    controle: { label: 'Control', leftPole: 'Planning', rightPole: 'Free market' },
    comercio: { label: 'Trade', leftPole: 'Protectionism', rightPole: 'Globalism' },
    religiao: { label: 'Religion', leftPole: 'Irreligious', rightPole: 'Religious' },
    moral: { label: 'Morality', leftPole: 'Progressive', rightPole: 'Traditionalist' },
    tecnologia: { label: 'Technology', leftPole: 'Technology', rightPole: 'Biology' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Radical left',
      tone: 'darkred',
      description:
        'Revolutionary or totalitarian single-party communism, with a planned economy, strong centralization, and concentrated state power.'
    },
    {
      id: 'left',
      label: 'Left',
      tone: 'green',
      description:
        'Advocates social democracy, progressivism, and greater state intervention in the economy within liberal democracy.'
    },
    {
      id: 'center',
      label: 'Center',
      tone: 'gray',
      description:
        'Seeks balance between left and right, market and state, reform and stability, with a moderate or pragmatic political stance.'
    },
    {
      id: 'right',
      label: 'Right',
      tone: 'blue',
      description:
        'Advocates conservatism, economic liberalism, and moderate nationalism within liberal democracy.'
    },
    {
      id: 'right-extreme',
      label: 'Far-right',
      tone: 'navy',
      description:
        'Fascism, racial nationalism, and oppressive theocracies, with explicit rejection of democracy and authoritarian concentration of power.'
    },
    {
      id: 'third-position',
      label: 'Third position',
      tone: 'purple',
      description:
        'A nationalist, corporatist synthesis that rejects both liberal capitalism and Marxism, outside the traditional left-right axis.'
    },
    {
      id: 'libertarian',
      label: 'Libertarian',
      tone: 'amber',
      description:
        'Advocates a minimal state, free markets, private property, and individual liberties, without proposing the total abolition of the state.'
    },
    {
      id: 'anarchist',
      label: 'Anarchist',
      tone: 'charcoal',
      description:
        'Rejects the state and all coercive authority, advocating free, voluntary, and self-managed social organization, from the left or the right.'
    }
  ],
  faqItems: [
    {
      question: 'Is the test reliable?',
      answer:
        'The 12 Axes political test is reliable as a tool for reading and comparing political positions. It uses questions spread across 12 axes to reduce single-topic bias, but it does not replace study, debate, or academic analysis.'
    },
    {
      question: 'How long does it take?',
      answer:
        'The short version takes about 5 minutes. The full version takes roughly 9 minutes. The extreme version, with 240 questions, can take about 30 minutes.'
    },
    {
      question: 'Can I retake it?',
      answer:
        'Yes. You can retake the political quiz as many times as you like, including choosing another depth to compare whether your result changes.'
    },
    {
      question: 'Is there a right answer?',
      answer:
        'There is no right answer. The ideology test measures preferences about democracy, monarchy, federalism, immigration, religion in politics, economic policy, international trade, liberalism, conservatism, progressivism, and other topics.'
    },
    {
      question: 'How does the algorithm calculate?',
      answer:
        'Each answer adds points to a specific pole. The algorithm calculates percentages per axis, compares your ideological vector with the profiles of political currents, countries, and personalities, and returns the highest compatibilities.'
    },
    {
      question: 'Does the result change?',
      answer:
        'It can change if your opinions change, if you answer with more nuance, or if you take a longer version. The extreme version tends to reduce fluctuations by using more questions.'
    },
    {
      question: 'Is the test scientific?',
      answer:
        '12 Axes is not a clinically validated scientific instrument. It is an educational political test, inspired by political spectrum models and ideology quizzes, useful for reflection and comparison.'
    },
    {
      question: 'Can I share it?',
      answer:
        'Yes. When you finish, you can share your result to discuss political ideology, the political spectrum, left, right, center, and the 12 axes with other people.'
    },
    {
      question: 'Does the test collect data?',
      answer:
        'The test is anonymous and requires no sign-up. Answers are used to calculate the result at quiz time, without asking for your name, email, or personal identification.'
    },
    {
      question: 'Can I take it on my phone?',
      answer:
        'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.'
    },
    {
      question: 'What is 12 Axes?',
      answer: '12 Axes is a free political test that measures your position across 12 axes (state structure, representation, liberties, immigration, diplomacy, intervention, economy, economic control, trade, religion, morals and technology) and shows your compatible political ideology, country and political figure.'
    },
    {
      question: 'Does 12 Axes have a political compass?',
      answer: 'Yes. At the end of the result there is a two-axis political compass, left × right and authoritarian × libertarian, with a progressive × traditionalist bar. It summarizes your 12 axes visually, but it does not replace the full analysis.'
    },
    {
      question: 'How do I find my compatible political ideology?',
      answer: 'Take the political quiz, with 36, 60 or 240 questions. The result shows the ideologies most compatible with your answers, with the compatibility percentage and the position of each one across the 12 axes.'
    },
    {
      question: 'Can I find out which country or political figure matches me?',
      answer: 'Yes. Besides ideology, the result compares your profile with current countries, historical regimes and political figures, showing the most compatible and the furthest from you.'
    },
    {
      question: 'How many questions does the political quiz have?',
      answer: 'There are three versions: quick, with 36 questions, full, with 60, and extreme, with 240. All cover the same 12 axes; the more questions, the more precise the result tends to be.'
    }
  ],
  howEyebrow: 'How it works',
  howTitle: 'How the 12 Axes political quiz works',
  howLead:
    'A simple, visual political ideology test: you respond to statements, 12 Axes calculates your percentages, and shows where you stand on the political spectrum in each dimension.',
  steps: [
    {
      title: 'Answer the questions',
      text: 'Agree or disagree with statements about the economy, the state, civil liberties, values, religion, foreign policy, and technology.'
    },
    {
      title: 'Analysis across 12 axes',
      text: 'Each answer positions you on 12 independent ideological axes - from free markets to planning, from nationalism to globalism.'
    },
    {
      title: 'Discover your profile',
      text: 'Receive your ideological profile, most compatible ideologies, closest country, related personality, and per-axis results.'
    }
  ],
  axesGuideEyebrow: '12 axes',
  axesGuideTitle: 'What does each axis mean?',
  axesGuideLead:
    'The 12 Axes ideology test analyzes federalism, political representation, democracy, elections, immigration, international trade, religion in politics, economic policy, morality, and technology in separate dimensions.',
  discoveryEyebrow: 'What you will discover',
  discoveryTitle: 'A complete portrait of your political convictions',
  discoveryLead:
    'More than left or right: your result shows who, where, and how strongly your ideas actually align.',
  discoveryItems: [
    { icon: 'ideology', title: 'Your ideology', text: 'Which political current matches you' },
    { icon: 'country', title: 'Your country', text: 'Which nation thinks most like you' },
    { icon: 'personality', title: 'Your political leader', text: 'Which historical figure is your ideological match' },
    { icon: 'books', title: 'Recommended books', text: 'A notable book from each political figure matching you' },
    { icon: 'profile', title: 'Your profile', text: 'A complete portrait of your convictions' },
    { icon: 'compatibility', title: 'Compatibility', text: 'How much you truly agree with your own ideology' }
  ],
  exampleEyebrow: 'Real example',
  exampleTitle: "Here's what your result looks like",
  exampleCaption: 'Illustrative example using real data from the 12 Axes catalog.',
  exampleCta: 'I want to see my result',
  spectrumEyebrow: 'Political spectrum',
  spectrumTitle: 'Discover your political spectrum',
  spectrumLead:
    'The result helps you visualize your political position between left, right, and center, and also identifies more radical, authoritarian, or libertarian forms that fall outside that axis, such as far-right, radical left, third position, libertarianism, and anarchism.',
  faqTitle: 'Frequently asked questions',
  faqLead: 'Everything people usually ask before taking the test.',
  navStart: 'Start',
  navTakeTest: 'Take the test',
  menuAria: 'Open menu',
  roseAria: 'Rose of the 12 axes',
  spectrumBarAria: 'Political spectrum bar with the eight categories',
  versionsEyebrow: 'Versions',
  versionsTitle: 'Choose the depth',
  versionsLead:
    'Start with the quick quiz or go deeper for a more precise portrait of your ideological profile. All versions use the same 12 axes and return the result immediately.',
  variantEyebrow: 'Choose the format',
  variantTitlePre: 'Do you want speed or ',
  variantTitleEm: 'precision?',
  backToStart: 'Back to start',
  depthLabel: 'Depth',
  depthAria: (level) => `Depth ${level} of 3`,
  recommended: 'Recommended',
  formatNotes: ['All versions use the same 12 axes', 'Anonymous, no sign-up', 'Instant result'],
  variantLead:
    'The short version reveals the result quickly. The full version increases precision to bring your result closer to the ideological profiles.',
  quizNavAria: 'Quiz navigation',
  autoAdvance: 'Advance on answer',
  back: 'Back',
  next: 'Next',
  calculating: 'Calculating…',
  seeResult: 'See results',
  archetypeSkip: 'Skip',
  errMissingAnswer: 'You still need to answer this question before seeing the result.',
  errLoadQuiz: 'Could not load the quiz.',
  errCalc: 'Could not calculate the result.',
  errImage: 'Could not generate the result image.',
  errHttp: (status) => `HTTP error ${status}`,
  resultsEyebrow: 'Analysis complete',
  resultsH1Pre: 'Your ideological ',
  resultsH1Em: 'profile',
  resultsLead: (count) =>
    `Analysis based on ${count} answers distributed across 12 fundamental dimensions of political ideology. Check your position on each axis and your ideological matches.`,
  resultsLeadShared:
    'Shared result: the position on each of the 12 political axes and the ideological matches calculated from it. Take the test to discover yours.',
  resultsSummaryAria: 'Analysis summary',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Political axes',
  axesSectionTitle: 'Your 12 axes',
  proximityEyebrow: 'Ideological proximity',
  otherMatches: 'Other ideologies',
  navOnThisPage: 'On this page',
  resultsNavAxes: '12 axes',
  resultsNavSignature: 'Distinction',
  resultsNavCountries: 'Countries',
  resultsNavPersonalities: 'Personalities',
  resultsNavAreas: 'Areas',
  resultsNavBooks: 'Books',
  resultsNavParties: 'Parties',
  resultsNavIdeologies: 'Ideologies',
  resultsNavCompass: 'Compass',
  resultsNavValues: 'Values',
  valuesSectionTitle: 'Your values',
  valuesNeutralTag: 'Balanced position',
  valueInfoAria: (name) => `Details about ${name}`,
  compassTitle: 'Political compass',
  compassAuthoritarian: 'Authoritarianism',
  compassLibertarian: 'Anarchism',
  compassLeft: 'Left',
  compassRight: 'Right',
  compassProgressive: 'Progressive',
  compassTraditionalist: 'Traditionalist',
  compassInfo: {
    aria: 'How the political compass is made',
    title: 'How the compass is made',
    authLead: 'The authoritarian × libertarian axis',
    authText: 'measures the degree of concentration of political power and of state intervention in the lives of individuals. It considers three main dimensions: individual liberties, political representation and state structure.',
    econLead: 'The left × right axis',
    econText: 'measures how far left or right you sit based on economic organization: from collective ownership and state planning on one side to private property and free markets on the other. It considers the fundamental dimensions of economy (ownership of the means of production) and control (market versus planning and regulation).',
    socialLead: 'The social axis',
    socialText: 'measures the orientation of your values between progressivism and traditionalism, reflecting your position on customs, culture and social values.'
  },
  compassWith: 'with',
  compassSocialValues: 'social values',
  compassCenterLeft: 'Center-left',
  compassCenterRight: 'Center-right',
  compassSpectrumLabels: {
    'esq-radical': 'Radical left',
    esquerda: 'Left',
    centro: 'Centrist',
    direita: 'Right',
    'ext-direita': 'Far-right',
    terceira: 'Third position',
    libertario: 'Libertarian',
    anarquismo: 'Anarchist'
  },
  compassSocialLabels: {
    veryProgressive: 'Strongly progressive',
    progressive: 'Progressive',
    moderate: 'Moderate',
    traditional: 'Traditionalist',
    veryTraditional: 'Strongly traditionalist'
  },
  compassNote: {
    label: 'On the compass:',
    hints: {
      terceira: 'The Third Position joins a strong state to nation and tradition. The compass measures economy and power; nation, morals and religion are left out.',
      'ext-direita': 'The far right is defined by hierarchy and identity. The compass measures economy and power; morals, religion and nation are left out.',
      'esq-radical': 'The radical left is defined by revolution and collectivization. The compass measures economy and power; the revolutionary project is left out.',
      libertarian: 'Your ideology sits on the border between two regions. The compass measures economy and power, and a small difference in either decides the side.',
      generic: 'The compass measures 5 of the 12 axes; the other 7 are left out.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `Your position: ${right}% toward the right, ${authoritarian}% toward authoritarian and ${traditional}% toward traditionalist.`,
  countriesSectionTitle: 'Countries closest to you',
  countryCurrentTab: 'Present-day',
  countryHistoricalTab: 'Historical',
  countriesDistantTitle: 'Furthest from you',
  partiesSectionTitle: 'Parties closest to you',
  partyCurrentTab: 'Active party',
  partyHistoricalTab: 'Historical party',
  partiesDistantTitle: 'Furthest from you',
  partyLogoAlt: (name) => `Symbol of ${name}`,
  partyLogoUnavailable: 'Symbol unavailable',
  personalitiesSectionTitle: 'Figures closest to you',
  personalitiesByAreaTitle: 'Also close to you, by field',
  dimensionsTitle: 'Also close to you, by dimension of your profile',
  dimensionLabels: {
    political: 'Politically',
    social: 'Socially',
    economic: 'Economically',
  },
  booksEyebrow: 'Go further',
  booksTitle: 'Further reading',
  booksTopLabel: 'Closest to you',
  booksAuthorLabel: 'Author',
  booksLead: 'One work by each of the figures closest to your results.',
  booksWhy: (pct) => `${pct}% compatible`,
  booksYearBc: (year) => `${year} BC`,
  booksCta: 'See on Amazon',
  areasGeneralTitle: 'The closest figures to your results',
  areasSectionTitle: 'The closest figures by field',
  areasTabsAria: 'How figures are grouped',
  areasGeneralTab: 'Overall compatibility',
  areasByAreaTab: 'Field',
  personalitiesDistantTitle: 'Furthest from you',
  ideologyDistantTitle: 'The ideology furthest from you',
  phraseTitle: 'A sentence that describes you',
  aboutIdeology: (ideology) => `About ${ideology}`,
  knowMoreAbout: (name) => `Learn more about ${name}`,
  showLess: 'Show less',
  matchTopKicker: 'Most compatible',
  dimensionsTitleShort: 'Also close, by dimension',
  phraseNote: (ideology) => `This is how someone from ${ideology} would sum up the society they want.`,
  signatureTitle: 'What sets you apart',
  signatureUnusualLabel: 'Your most unusual position',
  signatureCommonLabel: 'Your most typical position',
  signatureUnusualLead: (pole, percent) => `You lean further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualLeadMax: (pole) => `No ideology in the catalog leans as far toward ${pole.toLowerCase()} as you do.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Your position on ${axis} is middle of the road. Even so, that puts you further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualNote: (axis) => `Of all 12 axes, ${axis} is where you depart most from the field. It is the trait that sets you apart.`,
  signatureCommonLead: (axis) => `Your position on ${axis} sits almost exactly at the catalog median.`,
  signatureCommonNote: (pole) => `This is common ground. You lean neither toward ${pole.toLowerCase()} nor to the opposite pole.`,
  signatureCommonNoteBalanced: (axis) => `You sit at the centre on ${axis}, and so does the catalog. This is where your profile stands out least.`,
  tensionLabel: 'Your internal tension',
  tensionCombo: (firstPole, secondPole) => `${firstPole} and ${secondPole} at the same time`,
  tensionRare: (count, total) => `Only ${count} of the ${total} ideologies in the catalog hold both of these positions.`,
  tensionUnique: 'No ideology in the catalog holds both of these positions.',
  tensionExamples: (names) => `Closest matches: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `In the catalog, ${firstAxis} and ${secondAxis} usually move together. You reverse that pattern.`,
  signatureMedian: 'Ideology median',
  signatureYou: 'You',
  signatureBigCap: (pole) => `of the ideologies lean less toward ${pole.toLowerCase()} than you do.`,
  signatureAtMedian: 'At the median',
  signatureAtCentre: 'At the centre',
  tensionRareShort: (count, total) => `Only ${count} of ${total} ideologies hold both of these positions.`,
  personalityCategories: {
    politico: 'Politics',
    religioso: 'Religion',
    economista: 'Economics',
    filosofo: 'Philosophy',
    teorico: 'Political theory',
    empresario: 'Business',
    intelectual: 'Intellectual life',
    ativista: 'Activism',
  },
  redoAnalysis: 'Retake analysis',
  share: 'Share',
  saveOrShare: 'Share result',
  generatingPng: 'Generating PNG...',
  sharePreviewTitle: 'Your result card',
  sharePreviewCompareTitle: 'Comparison card',
  sharePreviewAlt: 'Preview of your shareable result card',
  sharePreviewLoading: 'Generating your card preview',
  generatingPdf: 'Generating PDF...',
  downloadPdf: 'Download PDF',
  report: {
    fileName: '12axes-report',
    docLabel: 'Full report',
    profileEyebrow: 'Your ideological profile',
    headerLabel: (ideology) => `Political profile report · ${ideology}`,
    kpiCountry: 'Closest country',
    kpiPersonality: 'Figure',
    kpiAxes: 'Axes analyzed',
    kpiAnswered: (count) => `${count} questions answered`,
    tocTitle: 'In this report',
    generatedOn: (date) => `Generated on ${date}`,
    axesIntro: 'Your position on each of the 12 axes. The bar starts at the center (50%) and extends toward the pole you lean to; the badge shows the intensity.',
    intensityLegend: 'Intensity',
    intensityLevels: ['Balanced · up to 57%', 'Leaning · 58 to 72%', 'Strong · 73 to 87%', 'Very strong · 88% or more'],
    alsoClose: 'Also close, by dimension of your profile',
    continued: 'continued',
    areasIntro: 'The figures in the catalog whose profile across the 12 axes most resembles yours.',
    booksIntro: 'One work by each of the figures closest to your results.',
    aboutTitle: 'About this report',
    aboutText: '12 Axes compares your answers with profiles of ideologies, countries and figures on the same 12 axes. Compatibility measures closeness between profiles; it is not a scientific diagnosis or a definitive label. Your answers are not stored.',
    ctaTitle: 'Retake the quiz or share it'
  },
  shareFilePrefix: '12axes-profile',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `I discovered my ideological profile on the 12 Axes Political Quiz!\n\n` +
    `💡 Most compatible ideology:\n` +
    `${ideology} - ${ideologyPct}% compatibility\n\n` +
    `🌎 Most compatible country/nation:\n` +
    `${country} - ${countryPct}% compatibility\n\n` +
    `👤 Most compatible personality:\n` +
    `${personality} - ${personalityPct}% compatibility\n\n` +
    `👉 Take the test and share your result:\nhttps://12axes.vercel.app/en`,
  progress: (current, total) => `Question ${current} of ${total}`,
  progressDone: (percent) => `${percent}% complete`,
  archetypeHeader: 'Identifying your archetype',
  archetypeStep: (current, total) => `${current} of ${total}`,
  progressAria: (percent) => `Quiz progress: ${percent}%`,
  answersAria: 'Answer options',
  countryKicker: 'Most compatible country',
  flagLabel: 'Flag',
  flagHistoricLabel: 'Flag / historical symbol',
  flagAlt: (label, name) => `${label} of ${name}`,
  flagUnavailable: 'Flag unavailable',
  flagUnavailableAria: (name) => `Flag unavailable for ${name}`,
  personalityKicker: 'Most compatible personality',
  portraitAlt: (name) => `Portrait of ${name}`,
  portraitUnavailableAria: (name) => `Portrait unavailable for ${name}`,
  compatibilityAria: (pct) => `Compatibility: ${pct} percent`,
  matchWord: 'match',
  compatibilityLevels: {
    veryHigh: 'Very high compatibility',
    high: 'High compatibility',
    medium: 'Medium compatibility',
    low: 'Low compatibility',
    veryLow: 'Very low compatibility'
  },
  shareTitle: 'My ideological profile | 12axes.vercel.app',
  shareTopMatch: 'Top match',
  shareCountry: 'Most compatible country',
  sharePersonality: 'Personality',
  shareResultLabel: 'MY RESULT',
  shareMostCompatible: 'MOST COMPATIBLE',
  shareYourAxes: 'YOUR 12 AXES',
  shareOtherPersonalities: 'OTHER PERSONALITIES',
  shareNearbyCountries: 'NEARBY COUNTRIES',
  shareFooterCta: 'DISCOVER YOUR PROFILE',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Support the project',
  supportTitle: '',
  ossEyebrow: 'Open source',
  ossTitle: 'An independent, transparent project',
  ossLead: "You don't have to take our word for it. The 12 Axes code is public: you can see how every answer is scored, how compatibility is calculated and where the profiles come from.",
  ossCards: [
    { title: 'Independent', text: 'No ties to parties, governments or campaigns. Nobody pays to appear in your result.' },
    { title: 'Auditable', text: 'Answer scoring and the compatibility calculation live in the code, with no black box.' },
    { title: 'Verifiable', text: 'Questions, ideologies, countries and personalities are stored in versioned files with a public history.' },
    { title: 'Collaborative', text: 'Found a biased question or an inaccurate profile? Open an issue or send a pull request.' }
  ],
  ossBarText: 'Read the code, audit the data and contribute on GitHub.',
  ossGithubCta: 'View on GitHub',
  footerRights: '© 2026. All rights reserved',
  footerProject: 'Project',
  footerExplore: 'Explore',
  footerAbout: 'About',
  footerContribute: 'Contributing',
  footerLicense: 'License',
  footerReport: 'Report',
  supportTitleEm: 'Support',
  supportLead:
    '12 Axes is independent and free. If the quiz helped you better understand your political ideology, consider donating via Pix or crypto to help keep the project running.',
  supportPrivacyNote: "We don't collect data. To donate without identifying yourself, use crypto.",
  supportCopy: 'Copy',
  supportCopied: 'Copied!',
  supportCopyAria: (label) => `Copy ${label} address`,
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
