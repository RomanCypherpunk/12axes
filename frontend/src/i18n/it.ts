// Dicionário de UI em italiano: só é baixado por quem abre o site em italiano. Chave ausente usa o inglês.
import type { Strings } from './index';
import type { DeepPartial } from './mergeStrings';

export const it: DeepPartial<Strings> = {
  htmlLang: 'it',
  docTitle: 'Test politico gratuito: che ideologia sei? | 12 Axes',
  loadingAnalysis: "Caricamento dell'analisi politica...",
  loadingQuiz: 'Caricamento del test...',
  loadingResult: 'Caricamento dei risultati...',
  tryAgain: 'Riprova',
  crashTitle: 'Qualcosa è andato storto',
  crashBody: 'La pagina ha incontrato un errore imprevisto. Ricaricala e riprova.',
  crashBodyWithProgress: 'La pagina ha incontrato un errore imprevisto, ma le tue risposte sono salvate. Ricarica e scegli di continuare da dove eri rimasto.',
  crashReload: 'Ricarica la pagina',
  resumeEyebrow: 'Test in corso',
  resumeTitle: 'Riprendi da dove eri rimasto',
  resumeBody: (answered, total) => `Hai risposto a ${answered} ${answered === 1 ? 'domanda' : 'domande'} su ${total}. Le tue risposte sono salvate in questo browser.`,
  resumeContinue: 'Continua',
  resumeDiscard: 'Ricomincia',
  resumeUnavailable: 'Non è stato possibile riprendere il test precedente. Avviane uno nuovo.',
  doneEyebrow: 'Test completato',
  doneTitle: 'Hai già fatto il test',
  doneBody: (name) => `Il tuo risultato era ${name}. È salvato in questo browser, basta riaprirlo.`,
  doneView: 'Vedi i risultati',
  doneRetake: 'Rifai il test',
  editAnswersButton: 'Modifica le risposte',
  editAnswersTitle: 'Modifica le risposte',
  editAnswersGroupsAria: 'Assi',
  editAnswersArchetype: 'Archetipo',
  editAnswersReligion: 'La tua religione',
  editAnswersChanged: (count) => (count === 0 ? 'Nessuna modifica' : count === 1 ? '1 risposta modificata' : `${count} risposte modificate`),
  editAnswersCancel: 'Annulla',
  editAnswersSave: 'Salva le risposte',
  editAnswersSaving: 'Ricalcolo in corso…',
  editAnswersDiscard: 'Scartare le modifiche non salvate?',
  editAnswersLoading: 'Caricamento delle tue risposte…',
  editAnswersUnavailable: 'Non è stato possibile aprire le tue risposte: le domande sono cambiate dopo che hai fatto il test.',
  skipToContent: 'Vai al contenuto',
  backToStartAria: "Torna all'inizio",
  mainNavAria: 'Navigazione principale',
  navHow: 'Come funziona',
  navAxes: '12 assi',
  navSpectrum: 'Spettro',
  navFaq: 'FAQ',
  navBooks: 'Libri',
  navIdeologies: 'Ideologie',
  navPersonalities: 'Personalità',
  navCountries: 'Paesi',
  navParties: 'Partiti',
  navCompare: 'Confronta',
  navSupport: 'Sostienici',
  langToggleLabel: 'PT',
  langToggleAria: 'Lingua',
  redoQuiz: 'Rifai il test',
  religionLabel: 'Religione',
  religionQuestion: 'Appartieni a una religione? Lo usiamo solo per adattare i tuoi consigli.',
  religionNone: 'Nessuna religione, agnostico o ateo',
  religionNames: {
    christianity: 'Cristianesimo',
    judaism: 'Ebraismo',
    islam: 'Islam',
    buddhism: 'Buddismo',
    hinduism: 'Induismo',
    other: 'Altra religione'
  },
  denominationLabel: 'Tradizione cristiana',
  denominationQuestion: 'Quale tradizione cristiana segui?',
  denominationNames: { catholic: 'Cattolica', protestant: 'Protestante', orthodox: 'Ortodossa' },
  restartQuiz: 'Ricomincia il test',
  heroEyebrow: 'Scoperta politica',
  h1Pre: 'Conosci davvero la tua ',
  h1Em: 'ideologia politica',
  h1Post: '?',
  introLead:
    "Forse ti stai etichettando male. In pochi minuti scopri la tua vera ideologia, il paese che la pensa più come te e il leader politico più vicino alle tue idee.",
  startQuiz: 'Scopri il mio profilo',
  seeAxes: 'Vedi i 12 assi',
  heroLabels: ['Gratis', 'Anonimo', 'Veloce', 'Risultato immediato'],
  heroTeaserLabel: 'compatibilità',
  heroTeaserTag: 'Risultato di esempio',
  heroDeckDot: (position, total) => `Mostra l'esempio ${position} di ${total}`,
  heroDeckAlt: (ideology) => `Esempio della scheda del risultato condivisibile: ${ideology}`,
  formats: {
    short: {
      label: 'Breve',
      questionCount: '36 domande',
      description: 'Un risultato rapido, ideale per una prima lettura del tuo profilo',
      duration: 'Circa 5 min',
      action: 'Avvia la versione breve'
    },
    extended: {
      label: 'Completa',
      questionCount: '60 domande',
      description: 'Più precisione per avvicinare il tuo risultato ai profili ideologici.',
      duration: 'Circa 9 min',
      action: 'Avvia la versione completa'
    },
    extreme: {
      label: 'Estrema',
      questionCount: '240 domande',
      description: 'Conosci la sintesi esatta del tuo pensiero con una precisione del 100%.',
      duration: 'Circa 30 min',
      action: 'Avvia la versione estrema'
    }
  },
  axisInfoAria: (label) => `Che cosa significa l'asse ${label}?`,
  questionHelpAria: 'Spiega questa domanda',
  questionHelpLabel: 'Spiegazione',
  themeToDarkAria: 'Passa alla modalità scura',
  themeToLightAria: 'Passa alla modalità chiara',
  questionHelpTitle: 'Su questa domanda',
  questionHelpAgree: 'Se sei d\'accordo',
  questionHelpDisagree: 'Se non sei d\'accordo',
  questionHelpNote: 'Da ricordare',
  questionHelpExample: 'Esempio',
  closeLabel: 'Chiudi',
  personalityInfoAria: (name) => `Vedi i dettagli su ${name}`,
  closenessTitle: 'Che cosa ti avvicina',
  closenessYou: 'Tu',
  insight: {
    closeTitle: (name) => `Che cosa ti avvicina a ${name}`,
    closeNone: (name) => `Tu e ${name} non condividete chiaramente una posizione su nessun asse.`,
    closeAxis: (axis, phrase, youPct, otherPct, name, gap) =>
      `Sull'asse ${axis}, entrambi mostrate ${phrase}. Tu sei al ${youPct}% da quel lato e ${name} al ${otherPct}%${gap < 8 ? ', praticamente nello stesso punto' : gap < 15 ? ', molto vicini' : ', con intensità diversa'}.`,
    apartTitle: 'Dove vi separate',
    apartNone: (name) => `Tu e ${name} non siete lontani su nessun asse.`,
    apartAxis: (axis, you, other, name, gap) => `Sull'asse ${axis} vi separate: tu mostri ${you}, mentre ${name} mostra ${other}. La distanza tra voi su questo asse è di ${gap} ${gap === 1 ? 'punto' : 'punti'}.`,
    apartTiny: (axis, name, gap) =>
      `Sull'asse ${axis}, la differenza maggiore tra te e ${name} è di soli ${gap} ${gap === 1 ? 'punto' : 'punti'}: siete praticamente nello stesso punto.`,
    apartSame: (axis, phrase, youPct, otherPct, name, gap) =>
      `Sull'asse ${axis} vi inclinate dalla stessa parte ma con intensità diversa: entrambi mostrate ${phrase}, tu al ${youPct}% e ${name} al ${otherPct}%. La distanza tra voi su questo asse è di ${gap} ${gap === 1 ? 'punto' : 'punti'}.`,
    balanced: 'una posizione equilibrata',
    poles: {
      estrutura: { left: 'una preferenza per più autonomia a Stati e regioni', right: 'una preferenza per un governo centrale più forte' },
      representacao: { left: 'sostegno a democrazia ed elezioni libere', right: 'sostegno al potere concentrato in un capo o in un gruppo' },
      poder: { left: 'una priorità a sicurezza e ordine', right: 'una priorità alle libertà individuali' },
      imigracao: { left: "una preferenza per l'assimilazione nella cultura nazionale", right: 'sostegno a più culture che convivono fianco a fianco' },
      diplomacia: { left: 'fiducia nella forza militare', right: 'una preferenza per pace e negoziazione' },
      intervencao: { left: 'una preferenza per restare fuori dalle dispute straniere', right: "un'enfasi sulla difesa dell'interesse nazionale" },
      economia: { left: 'enfasi su proprietà e servizi pubblici', right: "enfasi su proprietà privata e impresa" },
      controle: { left: "una preferenza per un'economia pianificata e regolamentata", right: 'una preferenza per il libero mercato e una regolamentazione leggera' },
      comercio: { left: "sostegno alla protezione dell'industria nazionale", right: "sostegno all'apertura al commercio internazionale" },
      religiao: { left: 'una preferenza per la separazione tra religione e politica', right: 'sostegno a più religione nella vita pubblica' },
      moral: { left: 'valori sociali progressisti', right: 'valori sociali tradizionali' },
      tecnologia: { left: "fiducia nella tecnologia e nell'industria", right: 'una preferenza per soluzioni più naturali e biologiche' }
    }
  },
  compareEyebrow: 'Analisi comparativa',
  compareTitle: 'Analisi comparativa',
  compareLead: 'Scegli una personalità, un paese o un\'ideologia e vedi, asse per asse, dove siete vicini o lontani.',
  compareSearchLabel: 'Cerca un profilo da confrontare',
  compareSearchPlaceholder: "Cerca una personalità, un paese o un'ideologia",
  compareView: 'Vedi',
  compareFieldCaption: "Personalità, paese o ideologia",
  compareFullView: 'Vedi il confronto completo',
  compareExamplePlaceholder: 'Es.: Donald Trump',
  compareAxesTitle: 'I tuoi 12 assi',
  compareNoResults: 'Nessun profilo trovato.',
  compareLoading: 'Confronto in corso…',
  compareLoadError: 'Non è stato possibile caricare il confronto. Riprova.',
  compareTypeLabels: { personality: 'Personalità', country: 'Paese', ideology: 'Ideologia', party: 'Partito o organizzazione' },
  compareAxisAdverbs: {
    estrutura: 'strutturalmente',
    economia: 'economicamente',
    moral: 'moralmente',
    tecnologia: 'tecnologicamente',
    diplomacia: 'diplomaticamente'
  },
  compareClosestLine: (adverb, name) => `Sei ${adverb} compatibile con ${name}.`,
  compareFarthestLine: (adverb, name) => `Sei ${adverb} distante da ${name}.`,
  compareClosestFallback: (axis, name) => `Sull'asse ${axis} sei compatibile con ${name}.`,
  compareFarthestFallback: (axis, name) => `Sull'asse ${axis} sei distante da ${name}.`,
  compareIdentical: (name) => `Tu e ${name} avete posizioni praticamente identiche su ogni asse.`,
  compareNearestLine: (axis, name) => `Il tuo asse più vicino a ${name} è ${axis}.`,
  compareNoFarLine: (name) => `Nessun asse è lontano da ${name}.`,
  compareValues: (pole, you, them, name) => `${pole}: tu ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Confronta profili — 12 Axes',
  comparePageEyebrow: 'Confronta profili',
  comparePageTitle: 'Fianco a fianco, sui 12 assi',
  comparePageProfilesTitle: 'Profili',
  comparePageNeedMore: 'Scegli un altro profilo da confrontare.',
  comparePageFull: 'Fino a 3 profili. Rimuovine uno per sceglierne un altro.',
  comparePageRemove: 'Rimuovi',
  comparePageRemoveAria: (name) => `Rimuovi ${name} dal confronto`,
  comparePageUnknown: 'Profilo non trovato',
  comparePageNotFound: 'Uno dei profili di questo link non esiste. Rimuovilo e scegline un altro.',
  comparePageAxesTitle: 'I 12 assi',
  comparePageAxisAria: (axis, values) => `${axis}: ${values}`,
  comparePageCompassAria: (points) => `Bussola politica: ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% destra, ${authoritarian}% autoritario, ${traditional}% tradizionalista`,
  comparePageLegendAria: 'Legenda della bussola',
  comparePagePairsTitle: 'Compatibilità tra loro',
  comparePageSignatureTitle: 'Che cosa li distingue',
  comparePageIdeologyTitle: 'Ideologia più vicina',
  comparePageNavIdeologies: 'Ideologie',
  comparePageNavAxes: '12 assi',
  comparePageNavSignature: 'Distinzione',
  comparePageNavCountries: 'Paesi',
  comparePageNavParties: 'Partiti',
  comparePageNavCompass: 'Bussola',
  comparePageNavCompatibility: 'Compatibilità',
  comparePageCommonLabel: 'In comune',
  comparePageNearestFor: (name) => `Più vicini a ${name}`,
  comparePageCountriesTitle: 'Paesi più vicini',
  comparePagePartiesTitle: 'Partiti più vicini',
  comparePageBalanced: 'Equilibrato',
  comparePageUnitPoints: 'pt',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) => `${high} e ${low} distano ${points} ${points === 1 ? 'punto' : 'punti'} su questo asse.`,
  comparePageAgreeCap: (points) => `Qui si incontrano: distano solo ${points} ${points === 1 ? 'punto' : 'punti'}.`,
  comparePageOpposite: 'Lati opposti',
  comparePageOppositeCount: (count, total) => `Si trovano su lati opposti in ${count} ${count === 1 ? 'asse' : 'assi'} su ${total}.`,
  comparePageNoOpposite: 'Nessun asse mette questi profili su lati opposti.',
  comparePageDiverge: 'Dove differiscono di più',
  comparePageAgree: 'Dove concordano di più',
  comparePagePairLabel: 'Compatibilità',
  peopleTitle: 'Confrontati con qualcun altro',
  peopleLead: "Incolla il link del risultato di un'altra persona e vedi, asse per asse, dove siete vicini o lontani.",
  peopleNameLabel: "Nome dell'altra persona",
  peopleNameCaption: 'Nome',
  peopleUrlCaption: 'Link del risultato',
  peopleNamePlaceholder: 'es. Marco',
  peopleUrlLabel: "Link del risultato dell'altra persona",
  peopleUrlPlaceholder: 'Incolla qui il link',
  peoplePaste: 'Incolla',
  peoplePasteBlocked: 'Il browser non ha permesso di leggere gli appunti. Incolla il link nel campo con Ctrl+V.',
  peoplePasteBlockedTouch: 'Non è stato possibile leggere gli appunti. Tieni premuto il campo del link e scegli Incolla.',
  peoplePasteEmpty: 'Non hai ancora copiato nulla. Copia il link del risultato e tocca Incolla.',
  peopleCompare: 'Confronta',
  peopleNameRequired: "Inserisci il nome dell'altra persona.",
  peopleLinkMissing: (keys) => `Questo link non contiene tutti gli assi (mancano: ${keys}). Incolla il link completo del risultato.`,
  peopleLinkInvalid: (keys) => `Valore non valido nel link (${keys}). Ogni asse va da 0 a 100.`,
  peopleYou: 'Tu',
  peopleOther: "Un'altra persona",
  peopleBoth: 'Voi due',
  compareBoth: 'Entrambi',
  peopleShare: 'Condividi il confronto',
  shareCompareLabel: 'CONFRONTO',
  shareCompareFilePrefix: '12axes-confronto',
  shareCompareTitle: (percent) => `La nostra compatibilità politica: ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `Ho confrontato il mio profilo politico con quello di ${other} nel Test Politico 12 Axes!\n\n` +
    `🤝 Compatibilità tra di noi: ${percent}%\n\n` +
    `💡 La mia ideologia:\n${mine}\n\n` +
    `💡 L'ideologia di ${other}:\n${theirs}\n\n` +
    `👉 Vedi il confronto e fai il test:\n${url}`,
  peopleSignatureTitle: 'Che cosa vi distingue',
  peopleDiverge: 'Dove differite di più',
  peopleAgree: 'Dove concordate di più',
  peopleAgreeCap: (points) => `Qui vi incontrate: distate solo ${points} ${points === 1 ? 'punto' : 'punti'}.`,
  peopleOppositeCount: (count, total) => `Vi trovate su lati opposti in ${count} ${count === 1 ? 'asse' : 'assi'} su ${total}.`,
  peopleNoOpposite: 'Nessun asse vi mette su lati opposti.',
  peopleBlocked: 'Il browser ha bloccato la nuova scheda.',
  peopleRename: (name) => `Modifica il nome di ${name}`,
  peopleNameInputLabel: 'Nome',
  peopleOpenLink: 'Apri il confronto',
  peoplePersonalitiesTitle: 'Personalità più vicine',
  peopleValuesTitle: 'Valori',
  peopleSharedValuesTitle: 'Valori condivisi',
  peoplePairsTitle: 'Compatibilità tra di voi',
  peopleNavPersonalities: 'Personalità',
  peopleNavValues: 'Valori',
  peopleNavSharedValues: 'In comune',
  peoplePageDocTitle: 'Confrontati con qualcun altro — 12 Axes',
  peoplePageTitle: 'Voi due, sui 12 assi',
  peoplePagePeopleTitle: 'Persone',
  peoplePageBadLink: 'Questo link di confronto è incompleto. Apri il tuo risultato e usa «Confrontati con qualcun altro».',
  peoplePageLoadError: 'Non è stato possibile caricare il confronto. Riprova.',
  peoplePageLoading: 'Confronto in corso…',
  axisExplanations: {
    estrutura:
      "Misura se preferisci il potere distribuito tra Stati, città e comunità locali oppure uno Stato nazionale unitario con leggi e comando più uniformi.",
    representacao:
      'Confronta la fiducia in elezioni, opposizione e istituzioni democratiche con la preferenza per una leadership forte, la tecnocrazia, la monarchia o i regimi autoritari.',
    poder:
      "Valuta l'equilibrio tra ordine, sorveglianza, punizione e controllo statale da un lato e privacy, libertà individuale e autonomia civile dall'altro.",
    imigracao:
      "Osserva se dai valore ad assimilazione culturale, lingua e identità nazionale oppure a multiculturalismo, migrazione aperta e pluralità di costumi.",
    diplomacia:
      'Analizza la tua posizione su forze armate, armi, deterrenza e intervento militare in contrasto con negoziazione, pacifismo e organizzazioni internazionali.',
    intervencao:
      "Misura l'inclinazione tra non interventismo esterno e una sovranità nazionale più assertiva, nazionalismo geopolitico e difesa attiva degli interessi nazionali.",
    economia:
      'Confronta la preferenza per proprietà pubblica, imprese statali e servizi collettivi con proprietà privata, privatizzazione e guida imprenditoriale.',
    controle:
      "Valuta pianificazione statale, regolamentazione e politica economica attiva rispetto a libero mercato, scarsa interferenza, autonomia monetaria e concorrenza.",
    comercio:
      "Misura protezionismo, sovranità produttiva e difesa dell'industria nazionale rispetto a globalismo, libero scambio e integrazione economica internazionale.",
    religiao:
      "Confronta laicismo, separazione tra religione e Stato e critica dei privilegi religiosi con l'influenza pubblica della fede e dei valori religiosi.",
    moral:
      'Valuta progressismo culturale, diritti civili e cambiamento sociale in contrasto con tradizione, famiglia, costumi e conservatorismo morale.',
    tecnologia:
      "Misura l'entusiasmo per tecnologia, IA, ingegneria genetica e sviluppo tecnico rispetto alla cautela biologica, ambientale e conservazionista."
  },
  homeAxes: {
    estrutura: { label: 'Struttura', leftPole: 'Federale', rightPole: 'Unitario' },
    representacao: { label: 'Rappresentanza', leftPole: 'Democrazia', rightPole: 'Autocrazia' },
    poder: { label: 'Potere', leftPole: 'Sicurezza', rightPole: 'Libertà' },
    imigracao: { label: 'Immigrazione', leftPole: 'Assimilazione', rightPole: 'Multiculturalismo' },
    diplomacia: { label: 'Diplomazia', leftPole: 'Militarista', rightPole: 'Pacifista' },
    intervencao: { label: 'Intervento', leftPole: 'Non interventista', rightPole: 'Nazionalista' },
    economia: { label: 'Economia', leftPole: 'Pubblico', rightPole: 'Privato' },
    controle: { label: 'Controllo', leftPole: 'Pianificazione', rightPole: 'Libero mercato' },
    comercio: { label: 'Commercio', leftPole: 'Protezionismo', rightPole: 'Globalismo' },
    religiao: { label: 'Religione', leftPole: 'Irreligioso', rightPole: 'Religioso' },
    moral: { label: 'Morale', leftPole: 'Progressista', rightPole: 'Tradizionalista' },
    tecnologia: { label: 'Tecnologia', leftPole: 'Tecnologia', rightPole: 'Biologia' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Sinistra radicale',
      tone: 'darkred',
      description:
        'Comunismo rivoluzionario o totalitario a partito unico, con economia pianificata, forte centralizzazione e potere statale concentrato.'
    },
    {
      id: 'left',
      label: 'Sinistra',
      tone: 'green',
      description:
        "Sostiene socialdemocrazia, progressismo e maggiore intervento dello Stato nell'economia all'interno della democrazia liberale."
    },
    {
      id: 'center',
      label: 'Centro',
      tone: 'gray',
      description:
        'Cerca equilibrio tra sinistra e destra, mercato e Stato, riforma e stabilità, con una posizione politica moderata o pragmatica.'
    },
    {
      id: 'right',
      label: 'Destra',
      tone: 'blue',
      description:
        "Sostiene conservatorismo, liberalismo economico e nazionalismo moderato all'interno della democrazia liberale."
    },
    {
      id: 'right-extreme',
      label: 'Estrema destra',
      tone: 'navy',
      description:
        'Fascismo, nazionalismo razziale e teocrazie oppressive, con esplicito rifiuto della democrazia e concentrazione autoritaria del potere.'
    },
    {
      id: 'third-position',
      label: 'Terza posizione',
      tone: 'purple',
      description:
        "Una sintesi nazionalista e corporativa che rifiuta sia il capitalismo liberale sia il marxismo, fuori dal tradizionale asse sinistra-destra."
    },
    {
      id: 'libertarian',
      label: 'Libertario',
      tone: 'amber',
      description:
        "Sostiene uno Stato minimo, libero mercato, proprietà privata e libertà individuali, senza proporre l'abolizione totale dello Stato."
    },
    {
      id: 'anarchist',
      label: 'Anarchico',
      tone: 'charcoal',
      description:
        "Rifiuta lo Stato e ogni autorità coercitiva, sostenendo un'organizzazione sociale libera, volontaria e autogestita, da sinistra o da destra."
    }
  ],
  faqItems: [
    {
      question: 'Il test è affidabile?',
      answer:
        "Il test politico 12 Axes è affidabile come strumento per leggere e confrontare posizioni politiche. Usa domande distribuite su 12 assi per ridurre la distorsione su un singolo tema, ma non sostituisce studio, dibattito o analisi accademica."
    },
    {
      question: 'Quanto dura?',
      answer:
        'La versione breve dura circa 5 minuti. La versione completa circa 9 minuti. La versione estrema, con 240 domande, può durare circa 30 minuti.'
    },
    {
      question: 'Posso rifarlo?',
      answer:
        'Sì. Puoi rifare il test politico quante volte vuoi, anche scegliendo un\'altra profondità per vedere se il tuo risultato cambia.'
    },
    {
      question: "C'è una risposta giusta?",
      answer:
        "Non c'è una risposta giusta. Il test sulle ideologie misura preferenze su democrazia, monarchia, federalismo, immigrazione, religione in politica, politica economica, commercio internazionale, liberalismo, conservatorismo, progressismo e altri temi."
    },
    {
      question: "Come calcola l'algoritmo?",
      answer:
        "Ogni risposta aggiunge punti a un polo specifico. L'algoritmo calcola le percentuali per asse, confronta il tuo vettore ideologico con i profili di correnti politiche, paesi e personalità e restituisce le compatibilità più alte."
    },
    {
      question: 'Il risultato cambia?',
      answer:
        'Può cambiare se cambiano le tue opinioni, se rispondi con più sfumature o se fai una versione più lunga. La versione estrema tende a ridurre le oscillazioni usando più domande.'
    },
    {
      question: 'Il test è scientifico?',
      answer:
        "12 Axes non è uno strumento scientifico validato clinicamente. È un test politico educativo, ispirato ai modelli dello spettro politico e ai quiz sulle ideologie, utile per la riflessione e il confronto."
    },
    {
      question: 'Posso condividerlo?',
      answer:
        'Sì. Quando finisci, puoi condividere il tuo risultato per discutere con altre persone di ideologia politica, spettro politico, sinistra, destra, centro e dei 12 assi.'
    },
    {
      question: 'Il test raccoglie dati?',
      answer:
        'Il test è anonimo e non richiede registrazione. Le risposte servono a calcolare il risultato al momento del test, senza chiedere il tuo nome, la tua email o un\'identificazione personale.'
    },
    {
      question: 'Posso farlo dal telefono?',
      answer:
        "Sì. L'interfaccia è pensata per mobile e desktop, quindi puoi fare il test politico nel browser del tuo smartphone."
    },
    {
      question: "Che cos'è 12 Axes?",
      answer: "12 Axes è un test politico gratuito che misura la tua posizione su 12 assi (struttura dello Stato, rappresentanza, libertà, immigrazione, diplomazia, intervento, economia, controllo economico, commercio, religione, morale e tecnologia) e mostra l'ideologia politica, il paese e la figura politica compatibili con te."
    },
    {
      question: 'Ha una bussola politica?',
      answer: "Sì. Alla fine del risultato c'è una bussola politica a due assi, sinistra × destra e autoritario × libertario, con una barra progressista × tradizionalista. Riassume visivamente i tuoi 12 assi, ma non sostituisce l'analisi completa."
    },
    {
      question: 'Come trovo la mia ideologia politica compatibile?',
      answer: 'Fai il quiz politico, con 36, 60 o 240 domande. Il risultato mostra le ideologie più compatibili con le tue risposte, con la percentuale di compatibilità e la posizione di ciascuna sui 12 assi.'
    },
    {
      question: 'Posso scoprire quale paese o figura politica mi corrisponde?',
      answer: 'Sì. Oltre all\'ideologia, il risultato confronta il tuo profilo con paesi attuali, regimi storici e figure politiche, mostrando i più compatibili e i più lontani da te.'
    },
    {
      question: 'Quante domande ha il quiz politico?',
      answer: 'Ci sono tre versioni: rapida, con 36 domande, completa, con 60, ed estrema, con 240. Tutte coprono gli stessi 12 assi; più domande ci sono, più il risultato tende a essere preciso.'
    }
  ],
  howEyebrow: 'Come funziona',
  howTitle: 'Come funziona il quiz politico 12 Axes',
  howLead:
    'Un test sull\'ideologia politica semplice e visivo: rispondi ad affermazioni, 12 Axes calcola le tue percentuali e mostra dove ti collochi nello spettro politico in ogni dimensione.',
  steps: [
    {
      title: 'Rispondi alle domande',
      text: 'Indica se sei d\'accordo o in disaccordo con affermazioni su economia, Stato, libertà civili, valori, religione, politica estera e tecnologia.'
    },
    {
      title: 'Analisi su 12 assi',
      text: 'Ogni risposta ti colloca su 12 assi ideologici indipendenti, dal libero mercato alla pianificazione, dal nazionalismo al globalismo.'
    },
    {
      title: 'Scopri il tuo profilo',
      text: 'Ricevi il tuo profilo ideologico, le ideologie più compatibili, il paese più vicino, la personalità collegata e i risultati per ogni asse.'
    }
  ],
  axesGuideEyebrow: '12 assi',
  axesGuideTitle: 'Che cosa significa ogni asse?',
  axesGuideLead:
    'Il test sulle ideologie 12 Axes analizza federalismo, rappresentanza politica, democrazia, elezioni, immigrazione, commercio internazionale, religione in politica, politica economica, morale e tecnologia in dimensioni separate.',
  discoveryEyebrow: 'Che cosa scoprirai',
  discoveryTitle: 'Un ritratto completo delle tue convinzioni politiche',
  discoveryLead:
    'Più che sinistra o destra: il tuo risultato mostra chi, dove e con quale intensità le tue idee si allineano davvero.',
  discoveryItems: [
    { icon: 'ideology', title: 'La tua ideologia', text: 'Quale corrente politica ti corrisponde' },
    { icon: 'country', title: 'Il tuo paese', text: 'Quale nazione la pensa più come te' },
    { icon: 'personality', title: 'Il tuo leader politico', text: 'Quale figura storica è la tua corrispondenza ideologica' },
    { icon: 'books', title: 'Libri consigliati', text: 'Un libro notevole di ciascuna figura politica che ti corrisponde' },
    { icon: 'profile', title: 'Il tuo profilo', text: 'Un ritratto completo delle tue convinzioni' },
    { icon: 'compatibility', title: 'Compatibilità', text: 'Quanto sei davvero d\'accordo con la tua stessa ideologia' }
  ],
  exampleEyebrow: 'Esempio reale',
  exampleTitle: 'Ecco come appare il tuo risultato',
  exampleCaption: 'Esempio illustrativo con dati reali del catalogo di 12 Axes.',
  exampleCta: 'Voglio vedere il mio risultato',
  spectrumEyebrow: 'Spettro politico',
  spectrumTitle: 'Scopri il tuo spettro politico',
  spectrumLead:
    "Il risultato ti aiuta a visualizzare la tua posizione politica tra sinistra, destra e centro, e individua anche forme più radicali, autoritarie o libertarie che escono da quell'asse, come estrema destra, sinistra radicale, terza posizione, libertarismo e anarchismo.",
  faqTitle: 'Domande frequenti',
  faqLead: 'Tutto ciò che di solito si chiede prima di fare il test.',
  navStart: 'Inizio',
  navTakeTest: 'Fai il test',
  menuAria: 'Apri il menu',
  roseAria: 'Rosa dei 12 assi',
  spectrumBarAria: 'Barra dello spettro politico con le otto categorie',
  versionsEyebrow: 'Versioni',
  versionsTitle: 'Scegli la profondità',
  versionsLead:
    'Inizia con il quiz rapido o vai più a fondo per un ritratto più preciso del tuo profilo ideologico. Tutte le versioni usano gli stessi 12 assi e restituiscono subito il risultato.',
  variantEyebrow: 'Scegli il formato',
  variantTitlePre: 'Vuoi velocità o ',
  variantTitleEm: 'precisione?',
  backToStart: "Torna all'inizio",
  depthLabel: 'Profondità',
  depthAria: (level) => `Profondità ${level} di 3`,
  recommended: 'Consigliata',
  formatNotes: ['Tutte le versioni usano gli stessi 12 assi', 'Anonimo, senza registrazione', 'Risultato immediato'],
  variantLead:
    'La versione breve rivela il risultato rapidamente. La versione completa aumenta la precisione per avvicinare il tuo risultato ai profili ideologici.',
  quizNavAria: 'Navigazione del test',
  autoAdvance: 'Avanza dopo la risposta',
  swapQuestion: 'Cambia',
  swapQuestionAria: 'Sostituisci questa domanda con un\'altra sullo stesso tema',
  back: 'Indietro',
  next: 'Avanti',
  calculating: 'Calcolo in corso…',
  seeResult: 'Vedi i risultati',
  archetypeSkip: 'Salta',
  errMissingAnswer: 'Devi ancora rispondere a questa domanda prima di vedere il risultato.',
  errLoadQuiz: 'Non è stato possibile caricare il test.',
  errCalc: 'Non è stato possibile calcolare il risultato.',
  errImage: "Non è stato possibile generare l'immagine del risultato.",
  errHttp: (status) => `Errore HTTP ${status}`,
  resultsEyebrow: 'Analisi completata',
  resultsH1Pre: 'Il tuo ',
  resultsH1Em: 'profilo',
  resultsLead: (count) =>
    `Analisi basata su ${count} risposte distribuite su 12 dimensioni fondamentali dell'ideologia politica. Controlla la tua posizione su ogni asse e le tue corrispondenze ideologiche.`,
  resultsLeadShared:
    'Risultato condiviso: la posizione su ciascuno dei 12 assi politici e le corrispondenze ideologiche calcolate da essa. Fai il test per scoprire il tuo.',
  resultsSummaryAria: "Riepilogo dell'analisi",
  metaTop: 'Più compatibile',
  axesSectionEyebrow: 'Assi politici',
  axesSectionTitle: 'I tuoi 12 assi',
  proximityEyebrow: 'Vicinanza ideologica',
  otherMatches: 'Altre ideologie',
  navOnThisPage: 'In questa pagina',
  resultsNavReport: 'Analisi completa',
  resultsNavPremiumGroup: 'Rapporto completo',
  resultsNavAxisByAxis: 'Asse per asse',
  resultsNavDisagree: 'Disaccordi',
  resultsNavGovernment: 'Governo ideale',
  resultsNavTimeline: 'Linea del tempo',
  resultsNavLiving: 'Dove vivere',
  resultsNavAxes: '12 assi',
  resultsNavSignature: 'Distinzione',
  resultsNavCountries: 'Paesi',
  resultsNavPersonalities: 'Personalità',
  resultsNavAreas: 'Ambiti',
  resultsNavBooks: 'Libri',
  resultsNavParties: 'Partiti',
  resultsNavIdeologies: 'Ideologie',
  resultsNavCompass: 'Bussola',
  resultsNavValues: 'Valori',
  valuesSectionTitle: 'I tuoi valori',
  valuesNeutralTag: 'Posizione equilibrata',
  valueInfoAria: (name) => `Dettagli su ${name}`,
  compassTitle: 'Bussola politica',
  compassAuthoritarian: 'Autoritarismo',
  compassLibertarian: 'Anarchismo',
  compassLeft: 'Sinistra',
  compassRight: 'Destra',
  compassProgressive: 'Progressista',
  compassTraditionalist: 'Tradizionalista',
  compassInfo: {
    aria: 'Come è costruita la bussola politica',
    title: 'Come è costruita la bussola',
    authLead: "L'asse autoritario × libertario",
    authText: "misura il grado di concentrazione del potere politico e di intervento dello Stato nella vita degli individui. Considera tre dimensioni principali: libertà individuali, rappresentanza politica e struttura dello Stato.",
    econLead: "L'asse sinistra × destra",
    econText: "misura quanto sei a sinistra o a destra in base all'organizzazione economica: dalla proprietà collettiva e dalla pianificazione statale da un lato alla proprietà privata e al libero mercato dall'altro. Considera le dimensioni fondamentali di economia (proprietà dei mezzi di produzione) e controllo (mercato contro pianificazione e regolamentazione).",
    socialLead: "L'asse sociale",
    socialText: "misura l'orientamento dei tuoi valori tra progressismo e tradizionalismo, riflettendo la tua posizione su costumi, cultura e valori sociali."
  },
  compassWith: 'con',
  compassSocialValues: 'valori sociali',
  compassCenterLeft: 'Centro-sinistra',
  compassCenterRight: 'Centro-destra',
  compassSpectrumLabels: {
    'esq-radical': 'Sinistra radicale',
    esquerda: 'Sinistra',
    centro: 'Centrista',
    direita: 'Destra',
    'ext-direita': 'Estrema destra',
    terceira: 'Terza posizione',
    libertario: 'Libertario',
    anarquismo: 'Anarchico'
  },
  compassSocialLabels: {
    veryProgressive: 'Fortemente progressista',
    progressive: 'Progressista',
    moderate: 'Moderato',
    traditional: 'Tradizionalista',
    veryTraditional: 'Fortemente tradizionalista'
  },
  compassNote: {
    label: 'Sulla bussola:',
    hints: {
      terceira: 'La Terza Posizione unisce uno Stato forte a nazione e tradizione. La bussola misura economia e potere; nazione, morale e religione restano fuori.',
      'ext-direita': "L'estrema destra è definita da gerarchia e identità. La bussola misura economia e potere; morale, religione e nazione restano fuori.",
      'esq-radical': 'La sinistra radicale è definita da rivoluzione e collettivizzazione. La bussola misura economia e potere; il progetto rivoluzionario resta fuori.',
      libertarian: 'La tua ideologia si trova al confine tra due regioni. La bussola misura economia e potere, e una piccola differenza in uno dei due decide da che parte stai.',
      generic: 'La bussola misura 5 dei 12 assi; gli altri 7 restano fuori.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `La tua posizione: ${right}% verso destra, ${authoritarian}% verso l'autoritario e ${traditional}% verso il tradizionalista.`,
  countriesSectionTitle: 'I paesi più vicini a te',
  countryCurrentTab: 'Attuali',
  countryHistoricalTab: 'Storici',
  countriesDistantTitle: 'I più lontani da te',
  partiesSectionTitle: 'I partiti più vicini a te',
  partyCurrentTab: 'Partito attivo',
  partyHistoricalTab: 'Partito storico',
  partiesDistantTitle: 'I più lontani da te',
  partyLogoAlt: (name) => `Simbolo di ${name}`,
  partyLogoUnavailable: 'Simbolo non disponibile',
  personalitiesSectionTitle: 'Le figure più vicine a te',
  personalitiesByAreaTitle: 'Vicine a te anche per ambito',
  dimensionsTitle: 'Vicine a te anche per dimensione del tuo profilo',
  dimensionLabels: {
    political: 'Politicamente',
    social: 'Socialmente',
    economic: 'Economicamente',
  },
  booksEyebrow: 'Vai più a fondo',
  booksTitle: 'Letture consigliate',
  booksTopLabel: 'Il più vicino a te',
  booksAuthorLabel: 'Autore',
  booksLead: 'Un\'opera di ciascuna delle figure più vicine ai tuoi risultati.',
  booksWhy: (pct) => `${pct}% compatibile`,
  booksYearBc: (year) => `${year} a.C.`,
  booksCta: 'Vedi su Amazon',
  areasGeneralTitle: 'Le figure più vicine ai tuoi risultati',
  areasSectionTitle: 'Le figure più vicine per ambito',
  areasTabsAria: 'Come sono raggruppate le figure',
  areasGeneralTab: 'Compatibilità generale',
  areasByAreaTab: 'Ambito',
  exportCsv: 'Esporta il foglio di calcolo',
  paywallTitle: 'Rapporto completo',
  paywallLead: 'Capisci come vedi il mondo asse per asse, scopri quale paese o regione attuale ti somiglia di più e molto altro.',
  paywallUnlockTitle: 'Accedi al risultato completo delle tue idee politiche',
  paywallPreviewTitles: [
    'Analisi completa, asse per asse',
    'Dove sei più in disaccordo',
    'Il tuo governo ideale',
    'La tua linea del tempo ideologica',
    '10 paesi o regioni in cui vivere'
  ],
  paywallModalTag: 'Il tuo rapporto completo',
  paywallModalTitle: 'Accedi al risultato completo delle tue idee politiche',
  paywallModalLead: 'Capisci come vedi il mondo asse per asse, scopri quale paese o regione attuale ti somiglia di più e molto altro.',
  paywallPdfTitle: 'Porta con te il rapporto completo in PDF',
  paywallPdfLead: "L'analisi di tutti i 12 assi, il tuo governo ideale e i paesi in cui vivere, in un PDF da conservare e rileggere quando vuoi.",
  paywallIncludesTitle: 'Che cosa sblocchi:',
  paywallIncludes: [
    { lead: 'Il tuo governo ideale:', text: 'nove incarichi ricoperti da persone che la pensano come te.' },
    { lead: 'In quale paese trasferirti:', text: 'i 10 paesi più vicini ai tuoi ideali.' },
    { lead: 'Dove sei più in disaccordo:', text: 'con l\'ideologia, la figura e il paese più vicini a te.' },
    { lead: 'Tutti i 12 assi, uno per uno:', text: 'che cosa rivela ciascuna delle tue posizioni, perché viene lodata e perché viene criticata.' },
    { lead: 'La tua linea del tempo:', text: "chi la pensava come te, dall'Antichità al XXI secolo." },
    { lead: 'Il tuo leader ideale per ambito:', text: 'politica, economia, filosofia e altro.' },
    { lead: 'Classifica completa e PDF:', text: 'tutto il catalogo in un foglio di calcolo e il rapporto da conservare.' }
  ],
  paywallOnce: 'pagamento unico, senza abbonamento',
  paywallBlockCta: {
    axes: "Sblocca la mia analisi completa",
    disagree: 'Sblocca il mio rapporto completo',
    government: 'Sblocca il mio governo ideale',
    timeline: 'Sblocca la mia linea del tempo',
    countries: 'Sblocca le mie 10 regioni'
  },
  paywallTeaser: {
    axisTag: 'Il tuo asse più sorprendente',
    disagreeWith: (name) => `I 3 assi su cui differisci di più da ${name}.`,
    seats: ['Leader politico', 'Vice leader politico', "Capo dell'economia"],
    eras: ['Antichità', 'Medioevo'],
    topCountry: 'Il più vicino oggi'
  },
  paywallInstant: 'Sbloccato subito dopo il pagamento.',
  paywallGuarantee: 'Garanzia di 14 giorni',
  paywallPayWith: 'Metodi di pagamento: carte, PayPal, Apple Pay, Google Pay e altri, a seconda del tuo paese',
  paywallPrice: 'US$ 3.99',
  paywallCta: 'Sblocca il mio rapporto completo',
  paywallChecking: 'Conferma del pagamento in corso...',
  paywallProblems: {
    denied: 'Questo pagamento non si applica a questo risultato oppure è stato rimborsato.',
    unavailable: 'Servizio al momento non disponibile, riprova tra qualche istante.',
    timeout: 'Il pagamento non è ancora stato confermato.'
  },
  paywallRetry: 'Controlla di nuovo',
  paywallOpening: 'Apertura del pagamento...',
  paywallEmailLabel: 'La tua email',
  paywallEmailPlaceholder: 'tu@esempio.com',
  paywallEmailInvalid: 'Inserisci un\'email valida.',
  unlockedTag: 'Pagamento confermato',
  unlockedTitle: 'Il tuo rapporto completo è sbloccato!',
  unlockedLead: 'Ora puoi accedere al tuo rapporto completo. Per riaprirlo in seguito, salva il link di accesso qui sotto.',
  unlockedCta: 'Vedi il rapporto',
  unlockedCopy: 'Copia il link di accesso',
  unlockedCopied: 'Link copiato!',
  areasLockedTitle: 'Quale figura è più compatibile con te in ogni ambito?',
  areasLockedText: 'Vedi la figura più compatibile con te in politica, economia, filosofia e negli altri ambiti.',
  areasLockedCta: 'Sblocca il mio rapporto completo',
  personalitiesDistantTitle: 'I più lontani da te',
  ideologyDistantTitle: "L'ideologia più lontana da te",
  phraseTitle: 'Una frase che ti descrive',
  aboutIdeology: (ideology) => `Su ${ideology}`,
  knowMoreAbout: (name) => `Scopri di più su ${name}`,
  showLess: 'Mostra meno',
  matchTopKicker: 'Più compatibile',
  dimensionsTitleShort: 'Vicine anche per dimensione',
  phraseNote: (ideology) => `Così una persona di ${ideology} riassumerebbe la società che vuole.`,
  signatureTitle: 'Che cosa ti distingue',
  signatureUnusualLabel: 'La tua posizione più insolita',
  signatureCommonLabel: 'La tua posizione più tipica',
  signatureUnusualLead: (pole, percent) => `Ti spingi più verso ${pole.toLowerCase()} del ${Math.round(percent)}% delle ideologie del catalogo.`,
  signatureUnusualLeadMax: (pole) => `Nessuna ideologia del catalogo si spinge verso ${pole.toLowerCase()} quanto te.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `La tua posizione sull'asse ${axis} è a metà strada. Eppure questo ti porta più verso ${pole.toLowerCase()} del ${Math.round(percent)}% delle ideologie del catalogo.`,
  signatureUnusualNote: (axis) => `Su tutti i 12 assi, ${axis} è quello su cui ti discosti di più dal resto. È il tratto che ti distingue.`,
  signatureCommonLead: (axis) => `La tua posizione sull'asse ${axis} si colloca quasi esattamente sulla mediana del catalogo.`,
  signatureCommonNote: (pole) => `È un terreno comune. Non ti inclini né verso ${pole.toLowerCase()} né verso il polo opposto.`,
  signatureCommonNoteBalanced: (axis) => `Sull'asse ${axis} sei al centro, e lo è anche il catalogo. È qui che il tuo profilo si distingue di meno.`,
  tensionLabel: 'La tua tensione interna',
  tensionCombo: (firstPole, secondPole) => `${firstPole} e ${secondPole} allo stesso tempo`,
  tensionRare: (count, total) => `Solo ${count} delle ${total} ideologie del catalogo sostengono entrambe queste posizioni.`,
  tensionUnique: 'Nessuna ideologia del catalogo sostiene entrambe queste posizioni.',
  tensionExamples: (names) => `Corrispondenze più vicine: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `Nel catalogo, ${firstAxis} e ${secondAxis} di solito vanno di pari passo. Tu inverti questo schema.`,
  signatureMedian: 'Mediana delle ideologie',
  signatureYou: 'Tu',
  signatureBigCap: (pole) => `delle ideologie si inclina verso ${pole.toLowerCase()} meno di te.`,
  signatureAtMedian: 'Sulla mediana',
  signatureAtCentre: 'Al centro',
  tensionRareShort: (count, total) => `Solo ${count} ideologie su ${total} sostengono entrambe queste posizioni.`,
  personalityCategories: {
    politico: 'Politica',
    religioso: 'Religione',
    economista: 'Economia',
    filosofo: 'Filosofia',
    teorico: 'Teoria politica',
    empresario: 'Imprenditoria',
    intelectual: 'Vita intellettuale',
    ativista: 'Attivismo',
  },
  redoAnalysis: "Rifai l'analisi",
  share: 'Condividi',
  saveOrShare: 'Condividi il risultato',
  generatingPng: 'Generazione del PNG...',
  sharePreviewTitle: 'La scheda del tuo risultato',
  sharePreviewCompareTitle: 'Scheda del confronto',
  sharePreviewAlt: 'Anteprima della scheda condivisibile del tuo risultato',
  sharePreviewLoading: "Generazione dell'anteprima della tua scheda",
  generatingPdf: 'Generazione del PDF...',
  downloadPdf: 'Scarica il PDF',
  downloadPdfFull: 'Scarica il rapporto completo in PDF',
  report: {
    fileName: '12axes-rapporto',
    docLabel: 'Rapporto completo',
    profileEyebrow: 'Il tuo profilo ideologico',
    headerLabel: (ideology) => `Rapporto sul profilo politico · ${ideology}`,
    kpiCountry: 'Paese più vicino',
    kpiPersonality: 'Figura',
    kpiAxes: 'Assi analizzati',
    kpiAnswered: (count) => `${count} risposte`,
    tocTitle: 'In questo rapporto',
    generatedOn: (date) => `Generato il ${date}`,
    axesIntro: "La tua posizione su ciascuno dei 12 assi. La barra parte dal centro (50%) e si estende verso il polo a cui ti inclini; il badge mostra l'intensità.",
    intensityLegend: 'Intensità',
    intensityLevels: ['Equilibrato · fino al 57%', 'Tendente · dal 58 al 72%', 'Forte · dal 73 all\'87%', 'Molto forte · 88% o più'],
    alsoClose: 'Vicine anche per dimensione del tuo profilo',
    continued: 'continua',
    areasIntro: 'Le figure del catalogo il cui profilo sui 12 assi somiglia di più al tuo.',
    booksIntro: "Un'opera di ciascuna delle figure più vicine ai tuoi risultati.",
    aboutTitle: 'Su questo rapporto',
    aboutText: "12 Axes confronta le tue risposte con i profili di ideologie, paesi e figure sugli stessi 12 assi. La compatibilità misura la vicinanza tra profili; non è una diagnosi scientifica né un'etichetta definitiva. Le tue risposte non vengono conservate.",
    ctaTitle: 'Rifai il quiz o condividilo'
  },
  shareFilePrefix: '12axes-profilo',
  shareCountriesFilePrefix: '12axes-paesi',
  shareCountriesTitle: 'I paesi più vicini al mio profilo | 12axes.vercel.app',
  shareCountriesMessage: (country, percent) =>
    `Guarda i paesi più vicini al mio profilo politico nel Test Politico 12 Axes!\n\n` +
    `🌎 Paese attuale più compatibile:\n` +
    `${country} - ${percent}% di compatibilità\n\n` +
    `👉 Fai il test e scopri il tuo:\nhttps://12axes.vercel.app/it`,
  shareCountriesCta: 'Condividi i paesi vicini',
  sharePersonalitiesCta: 'Condividi le personalità vicine',
  sharePartiesCta: 'Condividi i partiti vicini',
  shareCompassCta: 'Condividi valori e bussola',
  shareGovernmentCta: 'Condividi il governo ideale',
  shareTimelineCta: 'Condividi la linea del tempo',
  shareLivingCta: 'Condividi i paesi in cui vivere',
  shareIdealGovernment: 'GOVERNO IDEALE',
  shareTimeline: 'LINEA DEL TEMPO',
  shareLiving: 'PAESI IN CUI VIVERE',
  shareBestEra: 'EPOCA PIÙ COMPATIBILE',
  shareGovernmentFilePrefix: '12axes-governo-ideale',
  shareGovernmentTitle: 'Il mio governo ideale | 12axes.vercel.app',
  shareGovernmentMessage: (leader) =>
    `Guarda il mio governo ideale nel Test Politico 12 Axes!\n\n` +
    `🏛️ Leader politico:\n${leader}\n\n` +
    `👉 Fai il test e costruisci il tuo:\nhttps://12axes.vercel.app/it`,
  shareTimelineFilePrefix: '12axes-linea-del-tempo',
  shareTimelineTitle: 'La mia linea del tempo ideologica | 12axes.vercel.app',
  shareTimelineMessage: (era) =>
    `Guarda la mia linea del tempo ideologica nel Test Politico 12 Axes!\n\n` +
    `⏳ Epoca più compatibile:\n${era}\n\n` +
    `👉 Fai il test e scopri la tua:\nhttps://12axes.vercel.app/it`,
  shareLivingFilePrefix: '12axes-paesi-in-cui-vivere',
  shareLivingTitle: 'I paesi in cui vivrei | 12axes.vercel.app',
  shareLivingMessage: (country, percent) =>
    `Guarda i paesi in cui mi sentirei a casa, secondo il Test Politico 12 Axes!\n\n` +
    `🌎 Più compatibile:\n${country} - ${percent}% di compatibilità\n\n` +
    `👉 Fai il test e scopri i tuoi:\nhttps://12axes.vercel.app/it`,
  shareNearbyPersonalities: 'PERSONALITÀ VICINE',
  shareNearbyParties: 'PARTITI VICINI',
  shareValuesCompass: 'VALORI E BUSSOLA',
  sharePersonalitiesFilePrefix: '12axes-personalita',
  sharePersonalitiesTitle: 'Le personalità più vicine al mio profilo | 12axes.vercel.app',
  sharePersonalitiesMessage: (name, percent) =>
    `Guarda le personalità più vicine al mio profilo politico nel Test Politico 12 Axes!\n\n` +
    `👤 Personalità più compatibile:\n` +
    `${name} - ${percent}% di compatibilità\n\n` +
    `👉 Fai il test e scopri la tua:\nhttps://12axes.vercel.app/it`,
  sharePartiesFilePrefix: '12axes-partiti',
  sharePartiesTitle: 'I partiti più vicini al mio profilo | 12axes.vercel.app',
  sharePartiesMessage: (name, percent) =>
    `Guarda i partiti più vicini al mio profilo politico nel Test Politico 12 Axes!\n\n` +
    `🏛️ Partito attuale più compatibile:\n` +
    `${name} - ${percent}% di compatibilità\n\n` +
    `👉 Fai il test e scopri il tuo:\nhttps://12axes.vercel.app/it`,
  shareCompassFilePrefix: '12axes-bussola',
  shareCompassTitle: 'I miei valori e la mia bussola politica | 12axes.vercel.app',
  shareCompassMessage: (ideology) =>
    `Guarda i miei valori e la mia bussola politica nel Test Politico 12 Axes!\n\n` +
    `💡 La mia ideologia:\n${ideology}\n\n` +
    `👉 Fai il test e scopri la tua:\nhttps://12axes.vercel.app/it`,
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Ho scoperto il mio profilo ideologico nel Test Politico 12 Axes!\n\n` +
    `💡 Ideologia più compatibile:\n` +
    `${ideology} - ${ideologyPct}% di compatibilità\n\n` +
    `🌎 Paese/nazione più compatibile:\n` +
    `${country} - ${countryPct}% di compatibilità\n\n` +
    `👤 Personalità più compatibile:\n` +
    `${personality} - ${personalityPct}% di compatibilità\n\n` +
    `👉 Fai il test e condividi il tuo risultato:\nhttps://12axes.vercel.app/it`,
  progress: (current, total) => `Domanda ${current} di ${total}`,
  progressDone: (percent) => `${percent}% completato`,
  archetypeHeader: 'Identificazione del tuo archetipo',
  archetypeStep: (current, total) => `${current} di ${total}`,
  progressAria: (percent) => `Avanzamento del test: ${percent}%`,
  answersAria: 'Opzioni di risposta',
  countryKicker: 'Paese più compatibile',
  flagLabel: 'Bandiera',
  flagHistoricLabel: 'Bandiera / simbolo storico',
  flagAlt: (label, name) => `${label} di ${name}`,
  flagUnavailable: 'Bandiera non disponibile',
  flagUnavailableAria: (name) => `Bandiera non disponibile per ${name}`,
  personalityKicker: 'Personalità più compatibile',
  portraitAlt: (name) => `Ritratto di ${name}`,
  portraitUnavailableAria: (name) => `Ritratto non disponibile per ${name}`,
  compatibilityAria: (pct) => `Compatibilità: ${pct} per cento`,
  matchWord: 'compatibilità',
  compatibilityLevels: {
    veryHigh: 'Compatibilità molto alta',
    high: 'Compatibilità alta',
    medium: 'Compatibilità media',
    low: 'Compatibilità bassa',
    veryLow: 'Compatibilità molto bassa'
  },
  shareTitle: 'Il mio profilo ideologico | 12axes.vercel.app',
  shareTopMatch: 'Più compatibile',
  shareCountry: 'Paese più compatibile',
  sharePersonality: 'Personalità',
  shareResultLabel: 'IL MIO RISULTATO',
  shareMostCompatible: 'PIÙ COMPATIBILE',
  shareYourAxes: 'I TUOI 12 ASSI',
  shareOtherPersonalities: 'ALTRE PERSONALITÀ',
  shareNearbyCountries: 'PAESI VICINI',
  shareFooterCta: 'SCOPRI IL TUO PROFILO',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Sostieni il progetto',
  supportTitle: '',
  ossEyebrow: 'Open source',
  ossTitle: 'Un progetto indipendente e trasparente',
  ossLead: "Non devi fidarti sulla parola. Il codice di 12 Axes è pubblico: puoi vedere come viene valutata ogni risposta, come si calcola la compatibilità e da dove arrivano i profili.",
  ossCards: [
    { title: 'Indipendente', text: 'Nessun legame con partiti, governi o campagne. Nessuno paga per comparire nel tuo risultato.' },
    { title: 'Verificabile', text: 'La valutazione delle risposte e il calcolo della compatibilità stanno nel codice, senza scatole nere.' },
    { title: 'Controllabile', text: 'Domande, ideologie, paesi e personalità sono archiviati in file versionati con una cronologia pubblica.' },
    { title: 'Collaborativo', text: 'Hai trovato una domanda di parte o un profilo impreciso? Apri una issue o invia una pull request.' }
  ],
  ossBarText: 'Leggi il codice, verifica i dati e contribuisci su GitHub.',
  ossGithubCta: 'Vedi su GitHub',
  footerRights: '© 2026. Tutti i diritti riservati',
  footerProject: 'Progetto',
  footerExplore: 'Esplora',
  footerAbout: 'Informazioni',
  footerContribute: 'Contribuire',
  footerLicense: 'Licenza',
  footerFullReport: 'Rapporto completo',
  footerTerms: "Termini d'uso",
  footerPrivacy: 'Privacy',
  footerRefund: 'Rimborso',
  footerReport: 'Segnala',
  supportTitleEm: 'Sostieni',
  supportLead:
    "12 Axes è indipendente e gratuito. Se il quiz ti ha aiutato a capire meglio la tua ideologia politica, valuta di donare tramite Pix o criptovalute per aiutare a mantenere vivo il progetto.",
  supportPrivacyNote: "Non raccogliamo dati. Per donare senza identificarti, usa le criptovalute.",
  supportCopy: 'Copia',
  supportCopied: 'Copiato!',
  supportCopyAria: (label) => `Copia l'indirizzo ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Chiave casuale',
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
