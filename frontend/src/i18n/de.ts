// Dicionário de UI em alemão: só é baixado por quem abre o site em alemão. Chave ausente usa o inglês.
import type { Strings } from './index';
import type { DeepPartial } from './mergeStrings';

export const de: DeepPartial<Strings> = {
  htmlLang: 'de',
  docTitle: 'Politischer Test kostenlos: Welche Ideologie bist du? | 12 Axes',
  loadingAnalysis: 'Politische Analyse wird geladen...',
  loadingQuiz: 'Test wird geladen...',
  loadingResult: 'Ergebnisse werden geladen...',
  tryAgain: 'Erneut versuchen',
  crashTitle: 'Etwas ist schiefgelaufen',
  crashBody: 'Auf der Seite ist ein unerwarteter Fehler aufgetreten. Lade sie neu und versuche es noch einmal.',
  crashBodyWithProgress: 'Auf der Seite ist ein unerwarteter Fehler aufgetreten, aber deine Antworten sind gespeichert. Lade neu und wähle, dort weiterzumachen, wo du aufgehört hast.',
  crashReload: 'Seite neu laden',
  resumeEyebrow: 'Test läuft',
  resumeTitle: 'Mach dort weiter, wo du aufgehört hast',
  resumeBody: (answered, total) => `Du hast ${answered} von ${total} Fragen beantwortet. Deine Antworten sind in diesem Browser gespeichert.`,
  resumeContinue: 'Weiter',
  resumeDiscard: 'Neu starten',
  resumeUnavailable: 'Der vorherige Test konnte nicht fortgesetzt werden. Starte bitte einen neuen.',
  doneEyebrow: 'Test abgeschlossen',
  doneTitle: 'Du hast den Test schon gemacht',
  doneBody: (name) => `Dein Ergebnis war ${name}. Es ist in diesem Browser gespeichert, öffne es einfach erneut.`,
  doneView: 'Ergebnisse ansehen',
  doneRetake: 'Test wiederholen',
  editAnswersButton: 'Antworten bearbeiten',
  editAnswersTitle: 'Antworten bearbeiten',
  editAnswersGroupsAria: 'Achsen',
  editAnswersArchetype: 'Archetyp',
  editAnswersReligion: 'Deine Religion',
  editAnswersChanged: (count) => (count === 0 ? 'Keine Änderungen' : count === 1 ? '1 Antwort geändert' : `${count} Antworten geändert`),
  editAnswersCancel: 'Abbrechen',
  editAnswersSave: 'Antworten speichern',
  editAnswersSaving: 'Wird neu berechnet…',
  editAnswersDiscard: 'Nicht gespeicherte Änderungen verwerfen?',
  editAnswersLoading: 'Deine Antworten werden geladen…',
  editAnswersUnavailable: 'Deine Antworten konnten nicht geöffnet werden: Die Fragen haben sich geändert, nachdem du den Test gemacht hast.',
  skipToContent: 'Zum Inhalt springen',
  backToStartAria: 'Zurück zum Start',
  mainNavAria: 'Hauptnavigation',
  navHow: 'So funktioniert es',
  navAxes: '12 Achsen',
  navSpectrum: 'Spektrum',
  navFaq: 'FAQ',
  navBooks: 'Bücher',
  navIdeologies: 'Ideologien',
  navPersonalities: 'Persönlichkeiten',
  navCountries: 'Länder',
  navParties: 'Parteien',
  navCompare: 'Vergleichen',
  navSupport: 'Unterstützen',
  langToggleLabel: 'PT',
  langToggleAria: 'Sprache',
  redoQuiz: 'Test wiederholen',
  religionLabel: 'Religion',
  religionQuestion: 'Gehörst du einer Religion an? Wir nutzen das nur, um deine Empfehlungen anzupassen.',
  religionNone: 'Keine Religion, agnostisch oder atheistisch',
  religionNames: {
    christianity: 'Christentum',
    judaism: 'Judentum',
    islam: 'Islam',
    buddhism: 'Buddhismus',
    hinduism: 'Hinduismus',
    other: 'Andere Religion'
  },
  denominationLabel: 'Christliche Tradition',
  denominationQuestion: 'Welcher christlichen Tradition gehörst du an?',
  denominationNames: { catholic: 'Katholisch', protestant: 'Protestantisch', orthodox: 'Orthodox' },
  restartQuiz: 'Test neu starten',
  heroEyebrow: 'Politische Entdeckung',
  h1Pre: 'Kennst du deine ',
  h1Em: 'politische Ideologie',
  h1Post: ' wirklich?',
  introLead:
    'Vielleicht ordnest du dich falsch ein. In wenigen Minuten findest du deine wahre Ideologie heraus, das Land, das am ähnlichsten denkt wie du, und den politischen Anführer, der deinen Ideen am nächsten steht.',
  startQuiz: 'Mein Profil entdecken',
  seeAxes: 'Die 12 Achsen ansehen',
  heroLabels: ['Kostenlos', 'Anonym', 'Schnell', 'Sofort-Ergebnis'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Beispielergebnis',
  heroDeckDot: (position, total) => `Beispiel ${position} von ${total} anzeigen`,
  heroDeckAlt: (ideology) => `Beispiel der teilbaren Ergebniskarte: ${ideology}`,
  formats: {
    short: {
      label: 'Kurz',
      questionCount: '36 Fragen',
      description: 'Ein schnelles Ergebnis, ideal für einen ersten Blick auf dein Profil',
      duration: 'Etwa 5 Min.',
      action: 'Kurzversion starten'
    },
    extended: {
      label: 'Voll',
      questionCount: '60 Fragen',
      description: 'Mehr Genauigkeit, damit dein Ergebnis näher an die ideologischen Profile heranrückt.',
      duration: 'Etwa 9 Min.',
      action: 'Vollversion starten'
    },
    extreme: {
      label: 'Extrem',
      questionCount: '240 Fragen',
      description: 'Erfahre die exakte Synthese deines Denkens mit 100 % Genauigkeit.',
      duration: 'Etwa 30 Min.',
      action: 'Extremversion starten'
    }
  },
  axisInfoAria: (label) => `Was bedeutet die Achse ${label}?`,
  questionHelpAria: 'Diese Frage verstehen',
  questionHelpLabel: 'Verstehen',
  themeToDarkAria: 'Zum dunklen Modus wechseln',
  themeToLightAria: 'Zum hellen Modus wechseln',
  questionHelpTitle: 'Zu dieser Frage',
  questionHelpAgree: 'Wenn du zustimmst',
  questionHelpDisagree: 'Wenn du nicht zustimmst',
  questionHelpNote: 'Gut zu wissen',
  questionHelpExample: 'Beispiel',
  closeLabel: 'Schließen',
  personalityInfoAria: (name) => `Details zu ${name} ansehen`,
  closenessTitle: 'Was euch näherbringt',
  closenessYou: 'Du',
  insight: {
    closeTitle: (name) => `Was dich ${name} näherbringt`,
    closeNone: (name) => `Du und ${name} teilt auf keiner Achse klar eine Position.`,
    closeAxis: (axis, phrase, youPct, otherPct, name, gap) =>
      `Bei ${axis} zeigt ihr beide ${phrase}. Du liegst bei ${youPct}% auf dieser Seite und ${name} bei ${otherPct}%${gap < 8 ? ', praktisch am selben Punkt' : gap < 15 ? ', sehr nah beieinander' : ', mit unterschiedlicher Intensität'}.`,
    apartTitle: 'Wo ihr auseinandergeht',
    apartNone: (name) => `Du und ${name} liegt auf keiner Achse weit auseinander.`,
    apartAxis: (axis, you, other, name, gap) => `Bei ${axis} gehen eure Wege auseinander: Du zeigst ${you}, ${name} zeigt ${other}. Der Abstand zwischen euch auf dieser Achse beträgt ${gap} ${gap === 1 ? 'Punkt' : 'Punkte'}.`,
    apartTiny: (axis, name, gap) =>
      `Bei ${axis} beträgt der größte Unterschied zwischen dir und ${name} nur ${gap} ${gap === 1 ? 'Punkt' : 'Punkte'}: Ihr steht praktisch am selben Punkt.`,
    apartSame: (axis, phrase, youPct, otherPct, name, gap) =>
      `Bei ${axis} neigt ihr in dieselbe Richtung, aber mit unterschiedlicher Intensität: Ihr zeigt beide ${phrase}, du bei ${youPct}% und ${name} bei ${otherPct}%. Der Abstand zwischen euch auf dieser Achse beträgt ${gap} ${gap === 1 ? 'Punkt' : 'Punkte'}.`,
    balanced: 'eine ausgewogene Position',
    poles: {
      estrutura: { left: 'eine Präferenz für mehr Autonomie der Länder und Regionen', right: 'eine Präferenz für eine stärkere Zentralregierung' },
      representacao: { left: 'Unterstützung für Demokratie und freie Wahlen', right: 'Unterstützung für Macht in der Hand eines Anführers oder einer Gruppe' },
      poder: { left: 'Vorrang für Sicherheit und Ordnung', right: 'Vorrang für individuelle Freiheiten' },
      imigracao: { left: 'eine Präferenz für Assimilation in die nationale Kultur', right: 'Unterstützung für das Nebeneinander mehrerer Kulturen' },
      diplomacia: { left: 'Vertrauen in militärische Stärke', right: 'eine Präferenz für Frieden und Verhandlungen' },
      intervencao: { left: 'eine Präferenz dafür, sich aus fremden Konflikten herauszuhalten', right: 'den Schwerpunkt auf der Verteidigung des nationalen Interesses' },
      economia: { left: 'den Schwerpunkt auf öffentlichem Eigentum und öffentlichen Diensten', right: 'den Schwerpunkt auf Privateigentum und Unternehmertum' },
      controle: { left: 'eine Präferenz für eine geplante, regulierte Wirtschaft', right: 'eine Präferenz für freie Märkte und wenig Regulierung' },
      comercio: { left: 'Unterstützung für den Schutz der nationalen Industrie', right: 'Unterstützung für die Öffnung für den internationalen Handel' },
      religiao: { left: 'eine Präferenz für die Trennung von Religion und Politik', right: 'Unterstützung für mehr Religion im öffentlichen Leben' },
      moral: { left: 'progressive gesellschaftliche Werte', right: 'traditionelle gesellschaftliche Werte' },
      tecnologia: { left: 'Vertrauen in Technologie und Industrie', right: 'eine Präferenz für natürlichere, biologische Lösungen' }
    }
  },
  compareEyebrow: 'Vergleichende Analyse',
  compareTitle: 'Vergleichende Analyse',
  compareLead: 'Wähle eine Persönlichkeit, ein Land oder eine Ideologie und sieh Achse für Achse, wo ihr nah beieinander oder weit auseinander liegt.',
  compareSearchLabel: 'Profil zum Vergleichen suchen',
  compareSearchPlaceholder: 'Persönlichkeit, Land oder Ideologie suchen',
  compareView: 'Ansehen',
  compareFieldCaption: 'Persönlichkeit, Land oder Ideologie',
  compareFullView: 'Vollständigen Vergleich ansehen',
  compareExamplePlaceholder: 'z. B. Donald Trump',
  compareAxesTitle: 'Deine 12 Achsen',
  compareNoResults: 'Keine Profile gefunden.',
  compareLoading: 'Vergleich läuft…',
  compareLoadError: 'Der Vergleich konnte nicht geladen werden. Bitte versuche es erneut.',
  compareTypeLabels: { personality: 'Persönlichkeit', country: 'Land', ideology: 'Ideologie', party: 'Partei oder Organisation' },
  compareAxisAdverbs: {
    estrutura: 'strukturell',
    economia: 'wirtschaftlich',
    moral: 'moralisch',
    tecnologia: 'technologisch',
    diplomacia: 'diplomatisch'
  },
  compareClosestLine: (adverb, name) => `Du passt ${adverb} gut zu ${name}.`,
  compareFarthestLine: (adverb, name) => `Du bist ${adverb} weit von ${name} entfernt.`,
  compareClosestFallback: (axis, name) => `Bei ${axis} passt du gut zu ${name}.`,
  compareFarthestFallback: (axis, name) => `Bei ${axis} bist du weit von ${name} entfernt.`,
  compareIdentical: (name) => `Du und ${name} habt auf jeder Achse praktisch identische Positionen.`,
  compareNearestLine: (axis, name) => `Deine nächste Achse zu ${name} ist ${axis}.`,
  compareNoFarLine: (name) => `Keine Achse liegt weit von ${name} entfernt.`,
  compareValues: (pole, you, them, name) => `${pole}: du ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Profile vergleichen — 12 Axes',
  comparePageEyebrow: 'Profile vergleichen',
  comparePageTitle: 'Nebeneinander, auf den 12 Achsen',
  comparePageProfilesTitle: 'Profile',
  comparePageNeedMore: 'Wähle noch ein Profil zum Vergleichen.',
  comparePageFull: 'Bis zu 3 Profile. Entferne eines, um ein anderes zu wählen.',
  comparePageRemove: 'Entfernen',
  comparePageRemoveAria: (name) => `${name} aus dem Vergleich entfernen`,
  comparePageUnknown: 'Profil nicht gefunden',
  comparePageNotFound: 'Eines der Profile in diesem Link existiert nicht. Entferne es und wähle ein anderes.',
  comparePageAxesTitle: 'Die 12 Achsen',
  comparePageAxisAria: (axis, values) => `${axis}: ${values}`,
  comparePageCompassAria: (points) => `Politischer Kompass: ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% rechts, ${authoritarian}% autoritär, ${traditional}% traditionalistisch`,
  comparePageLegendAria: 'Legende des Kompasses',
  comparePagePairsTitle: 'Übereinstimmung untereinander',
  comparePageSignatureTitle: 'Was sie unterscheidet',
  comparePageIdeologyTitle: 'Nächste Ideologie',
  comparePageNavIdeologies: 'Ideologien',
  comparePageNavAxes: '12 Achsen',
  comparePageNavSignature: 'Unterschied',
  comparePageNavCountries: 'Länder',
  comparePageNavParties: 'Parteien',
  comparePageNavCompass: 'Kompass',
  comparePageNavCompatibility: 'Übereinstimmung',
  comparePageCommonLabel: 'Gemeinsam',
  comparePageNearestFor: (name) => `Am nächsten bei ${name}`,
  comparePageCountriesTitle: 'Nächste Länder',
  comparePagePartiesTitle: 'Nächste Parteien',
  comparePageBalanced: 'Ausgewogen',
  comparePageUnitPoints: 'Pkt.',
  comparePageUnitPoint: 'Pkt.',
  comparePageDivergeCap: (high, low, points) => `${high} und ${low} liegen auf dieser Achse ${points} ${points === 1 ? 'Punkt' : 'Punkte'} auseinander.`,
  comparePageAgreeCap: (points) => `Hier treffen sie sich: nur ${points} ${points === 1 ? 'Punkt' : 'Punkte'} Abstand.`,
  comparePageOpposite: 'Gegensätzliche Seiten',
  comparePageOppositeCount: (count, total) => `Sie liegen auf ${count} von ${total} Achsen auf gegensätzlichen Seiten.`,
  comparePageNoOpposite: 'Keine Achse stellt diese Profile auf gegensätzliche Seiten.',
  comparePageDiverge: 'Wo sie sich am meisten unterscheiden',
  comparePageAgree: 'Wo sie sich am meisten einig sind',
  comparePagePairLabel: 'Übereinstimmung',
  peopleTitle: 'Mit jemand anderem vergleichen',
  peopleLead: 'Füge den Ergebnislink einer anderen Person ein und sieh Achse für Achse, wo ihr nah beieinander oder weit auseinander liegt.',
  peopleNameLabel: 'Name der anderen Person',
  peopleNameCaption: 'Name',
  peopleUrlCaption: 'Ergebnislink',
  peopleNamePlaceholder: 'z. B. Johannes',
  peopleUrlLabel: 'Ergebnislink der anderen Person',
  peopleUrlPlaceholder: 'Link hier einfügen',
  peoplePaste: 'Einfügen',
  peoplePasteBlocked: 'Der Browser hat den Zugriff auf die Zwischenablage nicht erlaubt. Füge den Link mit Strg+V in das Feld ein.',
  peoplePasteBlockedTouch: 'Die Zwischenablage konnte nicht gelesen werden. Halte das Linkfeld gedrückt und wähle Einfügen.',
  peoplePasteEmpty: 'Noch nichts kopiert. Kopiere den Ergebnislink und tippe auf Einfügen.',
  peopleCompare: 'Vergleichen',
  peopleNameRequired: 'Gib den Namen der anderen Person ein.',
  peopleLinkMissing: (keys) => `In diesem Link fehlen Achsen (es fehlen: ${keys}). Füge den vollständigen Ergebnislink ein.`,
  peopleLinkInvalid: (keys) => `Ungültiger Wert im Link (${keys}). Jede Achse geht von 0 bis 100.`,
  peopleYou: 'Du',
  peopleOther: 'Jemand anderes',
  peopleBoth: 'Ihr beide',
  compareBoth: 'Beide',
  peopleShare: 'Vergleich teilen',
  shareCompareLabel: 'VERGLEICH',
  shareCompareFilePrefix: '12axes-comparison',
  shareCompareTitle: (percent) => `Unsere politische Übereinstimmung: ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `Ich habe mein politisches Profil im 12 Axes Politiktest mit dem von ${other} verglichen!\n\n` +
    `🤝 Übereinstimmung zwischen uns: ${percent}%\n\n` +
    `💡 Meine Ideologie:\n${mine}\n\n` +
    `💡 Ideologie von ${other}:\n${theirs}\n\n` +
    `👉 Sieh dir den Vergleich an und mach den Test:\n${url}`,
  peopleSignatureTitle: 'Was euch unterscheidet',
  peopleDiverge: 'Wo ihr euch am meisten unterscheidet',
  peopleAgree: 'Wo ihr euch am meisten einig seid',
  peopleAgreeCap: (points) => `Hier trefft ihr euch: nur ${points} ${points === 1 ? 'Punkt' : 'Punkte'} Abstand.`,
  peopleOppositeCount: (count, total) => `Ihr liegt auf ${count} von ${total} Achsen auf gegensätzlichen Seiten.`,
  peopleNoOpposite: 'Keine Achse stellt euch auf gegensätzliche Seiten.',
  peopleBlocked: 'Der Browser hat den neuen Tab blockiert.',
  peopleRename: (name) => `Namen von ${name} bearbeiten`,
  peopleNameInputLabel: 'Name',
  peopleOpenLink: 'Vergleich öffnen',
  peoplePersonalitiesTitle: 'Nächste Persönlichkeiten',
  peopleValuesTitle: 'Werte',
  peopleSharedValuesTitle: 'Gemeinsame Werte',
  peoplePairsTitle: 'Übereinstimmung zwischen euch',
  peopleNavPersonalities: 'Persönlichkeiten',
  peopleNavValues: 'Werte',
  peopleNavSharedValues: 'Gemeinsam',
  peoplePageDocTitle: 'Mit jemand anderem vergleichen — 12 Axes',
  peoplePageTitle: 'Ihr beide, auf den 12 Achsen',
  peoplePagePeopleTitle: 'Personen',
  peoplePageBadLink: 'Dieser Vergleichslink ist unvollständig. Öffne dein Ergebnis und nutze „Mit jemand anderem vergleichen“.',
  peoplePageLoadError: 'Der Vergleich konnte nicht geladen werden. Bitte versuche es erneut.',
  peoplePageLoading: 'Vergleich läuft…',
  axisExplanations: {
    estrutura:
      'Misst, ob du eine auf Länder, Städte und lokale Gemeinschaften verteilte Macht bevorzugst oder einen zentralistischen Nationalstaat mit einheitlicheren Gesetzen und Führung.',
    representacao:
      'Vergleicht Vertrauen in Wahlen, Opposition und demokratische Institutionen mit einer Präferenz für starke Führung, Technokratie, Monarchie oder autoritäre Regime.',
    poder:
      'Bewertet die Balance zwischen Ordnung, Überwachung, Bestrafung und staatlicher Kontrolle einerseits und Privatsphäre, individueller Freiheit und bürgerlicher Autonomie andererseits.',
    imigracao:
      'Untersucht, ob du kulturelle Assimilation, Sprache und nationale Identität wertschätzt oder Multikulturalismus, offene Migration und Vielfalt der Sitten.',
    diplomacia:
      'Analysiert deine Haltung zu Streitkräften, Waffen, Abschreckung und militärischem Eingreifen im Gegensatz zu Verhandlung, Pazifismus und internationalen Organisationen.',
    intervencao:
      'Misst die Neigung zwischen außenpolitischer Nichteinmischung und einer entschlosseneren nationalen Souveränität, geopolitischem Nationalismus und aktiver Verteidigung nationaler Interessen.',
    economia:
      'Vergleicht eine Präferenz für öffentliches Eigentum, Staatsbetriebe und kollektive Dienste mit Privateigentum, Privatisierung und unternehmerischer Führung.',
    controle:
      'Bewertet staatliche Planung, Regulierung und aktive Wirtschaftspolitik im Verhältnis zu freien Märkten, geringem Eingriff, Währungsautonomie und Wettbewerb.',
    comercio:
      'Misst Protektionismus, Produktionssouveränität und Schutz der nationalen Industrie im Verhältnis zu Globalismus, Freihandel und internationaler Wirtschaftsintegration.',
    religiao:
      'Vergleicht Säkularismus, die Trennung von Religion und Staat und Kritik an religiösen Privilegien mit dem öffentlichen Einfluss von Glauben und religiösen Werten.',
    moral:
      'Bewertet kulturellen Progressivismus, Bürgerrechte und gesellschaftlichen Wandel im Gegensatz zu Tradition, Familie, Sitten und moralischem Konservatismus.',
    tecnologia:
      'Misst die Begeisterung für Technologie, KI, Gentechnik und technische Entwicklung im Verhältnis zu biologischer, ökologischer und bewahrender Vorsicht.'
  },
  homeAxes: {
    estrutura: { label: 'Struktur', leftPole: 'Föderal', rightPole: 'Zentralistisch' },
    representacao: { label: 'Repräsentation', leftPole: 'Demokratisch', rightPole: 'Autokratisch' },
    poder: { label: 'Macht', leftPole: 'Sicherheitsorientiert', rightPole: 'Freiheitlich' },
    imigracao: { label: 'Einwanderung', leftPole: 'Assimilierend', rightPole: 'Multikulturell' },
    diplomacia: { label: 'Diplomatie', leftPole: 'Militaristisch', rightPole: 'Pazifistisch' },
    intervencao: { label: 'Intervention', leftPole: 'Nichteinmischend', rightPole: 'Nationalistisch' },
    economia: { label: 'Wirtschaft', leftPole: 'Staatlich', rightPole: 'Privat' },
    controle: { label: 'Kontrolle', leftPole: 'Planwirtschaftlich', rightPole: 'Marktwirtschaftlich' },
    comercio: { label: 'Handel', leftPole: 'Protektionistisch', rightPole: 'Globalistisch' },
    religiao: { label: 'Religion', leftPole: 'Areligiös', rightPole: 'Religiös' },
    moral: { label: 'Moral', leftPole: 'Progressiv', rightPole: 'Traditionalistisch' },
    tecnologia: { label: 'Technologie', leftPole: 'Technologisch', rightPole: 'Biologisch' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Radikale Linke',
      tone: 'darkred',
      description:
        'Revolutionärer oder totalitärer Einparteien-Kommunismus mit Planwirtschaft, starker Zentralisierung und konzentrierter Staatsmacht.'
    },
    {
      id: 'left',
      label: 'Linke',
      tone: 'green',
      description:
        'Befürwortet Sozialdemokratie, Progressivismus und mehr staatliche Eingriffe in die Wirtschaft innerhalb der liberalen Demokratie.'
    },
    {
      id: 'center',
      label: 'Mitte',
      tone: 'gray',
      description:
        'Sucht den Ausgleich zwischen links und rechts, Markt und Staat, Reform und Stabilität, mit einer gemäßigten oder pragmatischen politischen Haltung.'
    },
    {
      id: 'right',
      label: 'Rechte',
      tone: 'blue',
      description:
        'Befürwortet Konservatismus, Wirtschaftsliberalismus und einen gemäßigten Nationalismus innerhalb der liberalen Demokratie.'
    },
    {
      id: 'right-extreme',
      label: 'Extreme Rechte',
      tone: 'navy',
      description:
        'Faschismus, rassischer Nationalismus und unterdrückerische Theokratien, mit ausdrücklicher Ablehnung der Demokratie und autoritärer Machtkonzentration.'
    },
    {
      id: 'third-position',
      label: 'Dritte Position',
      tone: 'purple',
      description:
        'Eine nationalistische, korporatistische Synthese, die sowohl den liberalen Kapitalismus als auch den Marxismus ablehnt und außerhalb der klassischen Links-Rechts-Achse steht.'
    },
    {
      id: 'libertarian',
      label: 'Libertär',
      tone: 'amber',
      description:
        'Befürwortet einen minimalen Staat, freie Märkte, Privateigentum und individuelle Freiheiten, ohne die völlige Abschaffung des Staates zu fordern.'
    },
    {
      id: 'anarchist',
      label: 'Anarchistisch',
      tone: 'charcoal',
      description:
        'Lehnt den Staat und jede erzwingende Autorität ab und strebt eine freie, freiwillige und selbstverwaltete gesellschaftliche Ordnung an, von links oder von rechts.'
    }
  ],
  faqItems: [
    {
      question: 'Ist der Test zuverlässig?',
      answer:
        'Der politische Test von 12 Axes ist zuverlässig als Werkzeug, um politische Positionen einzuordnen und zu vergleichen. Er nutzt Fragen über 12 Achsen verteilt, um die Verzerrung durch ein einzelnes Thema zu verringern, ersetzt aber weder Studium noch Debatte oder wissenschaftliche Analyse.'
    },
    {
      question: 'Wie lange dauert er?',
      answer:
        'Die Kurzversion dauert etwa 5 Minuten. Die Vollversion braucht rund 9 Minuten. Die Extremversion mit 240 Fragen kann etwa 30 Minuten dauern.'
    },
    {
      question: 'Kann ich ihn wiederholen?',
      answer:
        'Ja. Du kannst den politischen Test so oft wiederholen, wie du möchtest, auch mit einer anderen Tiefe, um zu vergleichen, ob sich dein Ergebnis ändert.'
    },
    {
      question: 'Gibt es eine richtige Antwort?',
      answer:
        'Es gibt keine richtige Antwort. Der Ideologietest misst Präferenzen zu Demokratie, Monarchie, Föderalismus, Einwanderung, Religion in der Politik, Wirtschaftspolitik, internationalem Handel, Liberalismus, Konservatismus, Progressivismus und weiteren Themen.'
    },
    {
      question: 'Wie rechnet der Algorithmus?',
      answer:
        'Jede Antwort gibt einem bestimmten Pol Punkte. Der Algorithmus berechnet Prozentwerte pro Achse, vergleicht deinen ideologischen Vektor mit den Profilen politischer Strömungen, Länder und Persönlichkeiten und liefert die höchsten Übereinstimmungen.'
    },
    {
      question: 'Ändert sich das Ergebnis?',
      answer:
        'Es kann sich ändern, wenn sich deine Meinungen ändern, wenn du differenzierter antwortest oder wenn du eine längere Version machst. Die Extremversion schwankt tendenziell weniger, weil sie mehr Fragen nutzt.'
    },
    {
      question: 'Ist der Test wissenschaftlich?',
      answer:
        '12 Axes ist kein klinisch validiertes wissenschaftliches Instrument. Es ist ein politischer Bildungstest, inspiriert von Modellen des politischen Spektrums und Ideologie-Quizzen, nützlich zum Nachdenken und Vergleichen.'
    },
    {
      question: 'Kann ich ihn teilen?',
      answer:
        'Ja. Wenn du fertig bist, kannst du dein Ergebnis teilen, um mit anderen über politische Ideologie, das politische Spektrum, links, rechts, Mitte und die 12 Achsen zu diskutieren.'
    },
    {
      question: 'Sammelt der Test Daten?',
      answer:
        'Der Test ist anonym und erfordert keine Anmeldung. Die Antworten werden nur genutzt, um das Ergebnis im Moment des Tests zu berechnen, ohne nach deinem Namen, deiner E-Mail oder persönlicher Identifikation zu fragen.'
    },
    {
      question: 'Kann ich ihn auf dem Handy machen?',
      answer:
        'Ja. Die Oberfläche wurde für Mobilgeräte und Desktop entwickelt, du kannst den politischen Test also im Browser deines Smartphones machen.'
    },
    {
      question: 'Was ist 12 Axes?',
      answer: '12 Axes ist ein kostenloser politischer Test, der deine Position auf 12 Achsen misst (Staatsstruktur, Repräsentation, Freiheiten, Einwanderung, Diplomatie, Intervention, Wirtschaft, Wirtschaftskontrolle, Handel, Religion, Moral und Technologie) und dir die dazu passende politische Ideologie, das passende Land und die passende politische Persönlichkeit zeigt.'
    },
    {
      question: 'Hat 12 Axes einen politischen Kompass?',
      answer: 'Ja. Am Ende des Ergebnisses gibt es einen politischen Kompass mit zwei Achsen, links × rechts und autoritär × libertär, mit einer Leiste progressiv × traditionalistisch. Er fasst deine 12 Achsen visuell zusammen, ersetzt aber nicht die vollständige Analyse.'
    },
    {
      question: 'Wie finde ich meine passende politische Ideologie?',
      answer: 'Mach den politischen Test mit 36, 60 oder 240 Fragen. Das Ergebnis zeigt die Ideologien, die am besten zu deinen Antworten passen, mit dem Prozentwert der Übereinstimmung und der Position jeder einzelnen auf den 12 Achsen.'
    },
    {
      question: 'Kann ich herausfinden, welches Land oder welche politische Persönlichkeit zu mir passt?',
      answer: 'Ja. Neben der Ideologie vergleicht das Ergebnis dein Profil mit heutigen Ländern, historischen Regimen und politischen Persönlichkeiten und zeigt die größte Übereinstimmung und die größte Distanz zu dir.'
    },
    {
      question: 'Wie viele Fragen hat der politische Test?',
      answer: 'Es gibt drei Versionen: kurz mit 36 Fragen, voll mit 60 und extrem mit 240. Alle decken dieselben 12 Achsen ab; je mehr Fragen, desto genauer wird das Ergebnis in der Regel.'
    }
  ],
  howEyebrow: 'So funktioniert es',
  howTitle: 'So funktioniert der politische Test von 12 Axes',
  howLead:
    'Ein einfacher, visueller Test zur politischen Ideologie: Du antwortest auf Aussagen, 12 Axes berechnet deine Prozentwerte und zeigt, wo du in jeder Dimension im politischen Spektrum stehst.',
  steps: [
    {
      title: 'Fragen beantworten',
      text: 'Stimme Aussagen zu Wirtschaft, Staat, bürgerlichen Freiheiten, Werten, Religion, Außenpolitik und Technologie zu oder lehne sie ab.'
    },
    {
      title: 'Analyse auf 12 Achsen',
      text: 'Jede Antwort ordnet dich auf 12 unabhängigen ideologischen Achsen ein - vom freien Markt bis zur Planung, vom Nationalismus bis zum Globalismus.'
    },
    {
      title: 'Dein Profil entdecken',
      text: 'Du erhältst dein ideologisches Profil, die am besten passenden Ideologien, das nächste Land, eine verwandte Persönlichkeit und die Ergebnisse pro Achse.'
    }
  ],
  axesGuideEyebrow: '12 Achsen',
  axesGuideTitle: 'Was bedeutet jede Achse?',
  axesGuideLead:
    'Der Ideologietest von 12 Axes analysiert Föderalismus, politische Repräsentation, Demokratie, Wahlen, Einwanderung, internationalen Handel, Religion in der Politik, Wirtschaftspolitik, Moral und Technologie in getrennten Dimensionen.',
  discoveryEyebrow: 'Was du entdeckst',
  discoveryTitle: 'Ein vollständiges Porträt deiner politischen Überzeugungen',
  discoveryLead:
    'Mehr als links oder rechts: Dein Ergebnis zeigt, wer, wo und wie stark deine Ideen tatsächlich übereinstimmen.',
  discoveryItems: [
    { icon: 'ideology', title: 'Deine Ideologie', text: 'Welche politische Strömung zu dir passt' },
    { icon: 'country', title: 'Dein Land', text: 'Welche Nation am ähnlichsten denkt wie du' },
    { icon: 'personality', title: 'Dein politischer Anführer', text: 'Welche historische Persönlichkeit ideologisch zu dir passt' },
    { icon: 'books', title: 'Empfohlene Bücher', text: 'Ein bedeutendes Buch von jeder politischen Persönlichkeit, die zu dir passt' },
    { icon: 'profile', title: 'Dein Profil', text: 'Ein vollständiges Porträt deiner Überzeugungen' },
    { icon: 'compatibility', title: 'Übereinstimmung', text: 'Wie sehr du wirklich mit deiner eigenen Ideologie übereinstimmst' }
  ],
  exampleEyebrow: 'Echtes Beispiel',
  exampleTitle: 'So sieht dein Ergebnis aus',
  exampleCaption: 'Anschauliches Beispiel mit echten Daten aus dem Katalog von 12 Axes.',
  exampleCta: 'Ich will mein Ergebnis sehen',
  spectrumEyebrow: 'Politisches Spektrum',
  spectrumTitle: 'Entdecke dein politisches Spektrum',
  spectrumLead:
    'Das Ergebnis hilft dir, deine politische Position zwischen links, rechts und Mitte zu sehen, und erkennt auch radikalere, autoritäre oder libertäre Formen außerhalb dieser Achse, etwa die extreme Rechte, die radikale Linke, die Dritte Position, Libertarismus und Anarchismus.',
  faqTitle: 'Häufig gestellte Fragen',
  faqLead: 'Alles, was man üblicherweise fragt, bevor man den Test macht.',
  navStart: 'Start',
  navTakeTest: 'Test machen',
  menuAria: 'Menü öffnen',
  roseAria: 'Rose der 12 Achsen',
  spectrumBarAria: 'Leiste des politischen Spektrums mit den acht Kategorien',
  versionsEyebrow: 'Versionen',
  versionsTitle: 'Wähle die Tiefe',
  versionsLead:
    'Starte mit dem Kurztest oder geh tiefer für ein genaueres Porträt deines ideologischen Profils. Alle Versionen nutzen dieselben 12 Achsen und liefern das Ergebnis sofort.',
  variantEyebrow: 'Format wählen',
  variantTitlePre: 'Willst du Tempo oder ',
  variantTitleEm: 'Genauigkeit?',
  backToStart: 'Zurück zum Start',
  depthLabel: 'Tiefe',
  depthAria: (level) => `Tiefe ${level} von 3`,
  recommended: 'Empfohlen',
  formatNotes: ['Alle Versionen nutzen dieselben 12 Achsen', 'Anonym, ohne Anmeldung', 'Sofort-Ergebnis'],
  variantLead:
    'Die Kurzversion zeigt das Ergebnis schnell. Die Vollversion erhöht die Genauigkeit, damit dein Ergebnis näher an die ideologischen Profile heranrückt.',
  quizNavAria: 'Test-Navigation',
  autoAdvance: 'Bei Antwort weiter',
  swapQuestion: 'Tauschen',
  swapQuestionAria: 'Diese Frage gegen eine andere zum selben Thema tauschen',
  back: 'Zurück',
  next: 'Weiter',
  calculating: 'Wird berechnet…',
  seeResult: 'Ergebnisse ansehen',
  archetypeSkip: 'Überspringen',
  errMissingAnswer: 'Du musst diese Frage noch beantworten, bevor du das Ergebnis siehst.',
  errLoadQuiz: 'Der Test konnte nicht geladen werden.',
  errCalc: 'Das Ergebnis konnte nicht berechnet werden.',
  errImage: 'Das Ergebnisbild konnte nicht erstellt werden.',
  errHttp: (status) => `HTTP-Fehler ${status}`,
  resultsEyebrow: 'Analyse abgeschlossen',
  resultsH1Pre: 'Dein ideologisches ',
  resultsH1Em: 'Profil',
  resultsLead: (count) =>
    `Analyse auf Basis von ${count} Antworten, verteilt auf 12 grundlegende Dimensionen der politischen Ideologie. Sieh dir deine Position auf jeder Achse und deine ideologischen Übereinstimmungen an.`,
  resultsLeadShared:
    'Geteiltes Ergebnis: die Position auf jeder der 12 politischen Achsen und die daraus berechneten ideologischen Übereinstimmungen. Mach den Test, um deine herauszufinden.',
  resultsSummaryAria: 'Zusammenfassung der Analyse',
  metaTop: 'Beste Übereinstimmung',
  axesSectionEyebrow: 'Politische Achsen',
  axesSectionTitle: 'Deine 12 Achsen',
  proximityEyebrow: 'Ideologische Nähe',
  otherMatches: 'Andere Ideologien',
  navOnThisPage: 'Auf dieser Seite',
  resultsNavReport: 'Vollständige Analyse',
  resultsNavPremiumGroup: 'Vollständiger Bericht',
  resultsNavAxisByAxis: 'Achse für Achse',
  resultsNavDisagree: 'Unterschiede',
  resultsNavGovernment: 'Idealregierung',
  resultsNavTimeline: 'Zeitleiste',
  resultsNavLiving: 'Wo leben',
  resultsNavAxes: '12 Achsen',
  resultsNavSignature: 'Unterschied',
  resultsNavCountries: 'Länder',
  resultsNavPersonalities: 'Persönlichkeiten',
  resultsNavAreas: 'Bereiche',
  resultsNavBooks: 'Bücher',
  resultsNavParties: 'Parteien',
  resultsNavIdeologies: 'Ideologien',
  resultsNavCompass: 'Kompass',
  resultsNavValues: 'Werte',
  valuesSectionTitle: 'Deine Werte',
  valuesNeutralTag: 'Ausgewogene Position',
  valueInfoAria: (name) => `Details zu ${name}`,
  valuesSourceButton: 'Originalquelle',
  valuesSourceAuthor: 'Urheber',
  valuesSourceLicense: 'Lizenz',
  valuesSourceModified: 'bearbeitetes Bild',
  compassTitle: 'Politischer Kompass',
  compassAuthoritarian: 'Autoritarismus',
  compassLibertarian: 'Anarchismus',
  compassLeft: 'Links',
  compassRight: 'Rechts',
  compassProgressive: 'Progressiv',
  compassTraditionalist: 'Traditionalistisch',
  compassInfo: {
    aria: 'Wie der politische Kompass entsteht',
    title: 'Wie der Kompass entsteht',
    authLead: 'Die Achse autoritär × libertär',
    authText: 'misst den Grad der Konzentration politischer Macht und des staatlichen Eingriffs in das Leben der Einzelnen. Sie berücksichtigt drei Hauptdimensionen: individuelle Freiheiten, politische Repräsentation und Staatsstruktur.',
    econLead: 'Die Achse links × rechts',
    econText: 'misst, wie weit links oder rechts du stehst, anhand der Wirtschaftsordnung: von kollektivem Eigentum und staatlicher Planung auf der einen Seite bis zu Privateigentum und freien Märkten auf der anderen. Sie berücksichtigt die grundlegenden Dimensionen Wirtschaft (Eigentum an den Produktionsmitteln) und Kontrolle (Markt gegenüber Planung und Regulierung).',
    socialLead: 'Die soziale Achse',
    socialText: 'misst die Ausrichtung deiner Werte zwischen Progressivismus und Traditionalismus und spiegelt deine Haltung zu Sitten, Kultur und gesellschaftlichen Werten wider.'
  },
  compassWith: 'mit',
  compassSocialValues: 'gesellschaftlichen Werten',
  compassCenterLeft: 'Mitte-links',
  compassCenterRight: 'Mitte-rechts',
  compassSpectrumLabels: {
    'esq-radical': 'Radikale Linke',
    esquerda: 'Linke',
    centro: 'Mitte',
    direita: 'Rechte',
    'ext-direita': 'Extreme Rechte',
    terceira: 'Dritte Position',
    libertario: 'Libertär',
    anarquismo: 'Anarchistisch'
  },
  compassSocialLabels: {
    veryProgressive: 'Stark progressiv',
    progressive: 'Progressiv',
    moderate: 'Gemäßigt',
    traditional: 'Traditionalistisch',
    veryTraditional: 'Stark traditionalistisch'
  },
  compassNote: {
    label: 'Zum Kompass:',
    hints: {
      terceira: 'Die Dritte Position verbindet einen starken Staat mit Nation und Tradition. Der Kompass misst Wirtschaft und Macht; Nation, Moral und Religion bleiben außen vor.',
      'ext-direita': 'Die extreme Rechte ist durch Hierarchie und Identität geprägt. Der Kompass misst Wirtschaft und Macht; Moral, Religion und Nation bleiben außen vor.',
      'esq-radical': 'Die radikale Linke ist durch Revolution und Kollektivierung geprägt. Der Kompass misst Wirtschaft und Macht; das revolutionäre Projekt bleibt außen vor.',
      libertarian: 'Deine Ideologie liegt an der Grenze zwischen zwei Bereichen. Der Kompass misst Wirtschaft und Macht, und ein kleiner Unterschied bei einem von beiden entscheidet über die Seite.',
      generic: 'Der Kompass misst 5 der 12 Achsen; die anderen 7 bleiben außen vor.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `Deine Position: ${right}% in Richtung rechts, ${authoritarian}% in Richtung autoritär und ${traditional}% in Richtung traditionalistisch.`,
  countriesSectionTitle: 'Länder, die dir am nächsten sind',
  countryCurrentTab: 'Gegenwart',
  countryHistoricalTab: 'Historisch',
  countriesDistantTitle: 'Am weitesten von dir entfernt',
  partiesSectionTitle: 'Parteien, die dir am nächsten sind',
  partyCurrentTab: 'Aktive Partei',
  partyHistoricalTab: 'Historische Partei',
  partiesDistantTitle: 'Am weitesten von dir entfernt',
  partyLogoAlt: (name) => `Symbol von ${name}`,
  partyLogoUnavailable: 'Symbol nicht verfügbar',
  personalitiesSectionTitle: 'Persönlichkeiten, die dir am nächsten sind',
  personalitiesByAreaTitle: 'Auch nah bei dir, nach Bereich',
  dimensionsTitle: 'Auch nah bei dir, nach Dimension deines Profils',
  dimensionLabels: {
    political: 'Politisch',
    social: 'Gesellschaftlich',
    economic: 'Wirtschaftlich',
  },
  booksEyebrow: 'Weiter gehen',
  booksTitle: 'Zum Weiterlesen',
  booksTopLabel: 'Dir am nächsten',
  booksAuthorLabel: 'Autor',
  booksLead: 'Ein Werk von jeder der Persönlichkeiten, die deinen Ergebnissen am nächsten sind.',
  booksWhy: (pct) => `${pct}% Übereinstimmung`,
  booksYearBc: (year) => `${year} v. Chr.`,
  booksCta: 'Bei Amazon ansehen',
  areasGeneralTitle: 'Die Persönlichkeiten, die deinen Ergebnissen am nächsten sind',
  areasSectionTitle: 'Die nächsten Persönlichkeiten nach Bereich',
  areasTabsAria: 'Wie die Persönlichkeiten gruppiert werden',
  areasGeneralTab: 'Gesamtübereinstimmung',
  areasByAreaTab: 'Bereich',
  exportCsv: 'Tabelle exportieren',
  paywallTitle: 'Vollständiger Bericht',
  paywallLead: 'Verstehe Achse für Achse, wie du die Welt siehst, finde heraus, welches heutige Land oder welche Region dir am ähnlichsten ist, und vieles mehr.',
  paywallUnlockTitle: 'Erhalte Zugriff auf das vollständige Ergebnis deiner politischen Ansichten',
  paywallPreviewTitles: [
    'Vollständige Analyse, Achse für Achse',
    'Wo du am meisten widersprichst',
    'Deine Idealregierung',
    'Deine ideologische Zeitleiste',
    '10 Länder oder Regionen zum Leben'
  ],
  paywallModalTag: 'Dein vollständiger Bericht',
  paywallModalTitle: 'Erhalte Zugriff auf das vollständige Ergebnis deiner politischen Ansichten',
  paywallModalLead: 'Verstehe Achse für Achse, wie du die Welt siehst, finde heraus, welches heutige Land oder welche Region dir am ähnlichsten ist, und vieles mehr.',
  paywallPdfTitle: 'Nimm deinen vollständigen Bericht als PDF mit',
  paywallPdfLead: 'Die Analyse aller 12 Achsen, deine Idealregierung und die Länder zum Leben, als PDF zum Aufbewahren und Nachlesen, wann immer du willst.',
  paywallIncludesTitle: 'Was du freischaltest:',
  paywallIncludes: [
    { lead: 'Deine Idealregierung:', text: 'neun Posten, besetzt mit Menschen, die denken wie du.' },
    { lead: 'In welches Land du ziehen solltest:', text: 'die 10 Länder, die deinen Idealen am nächsten sind.' },
    { lead: 'Wo du am meisten widersprichst:', text: 'bei der Ideologie, der Persönlichkeit und dem Land, die dir am nächsten sind.' },
    { lead: 'Alle 12 Achsen, eine nach der anderen:', text: 'was jede deiner Positionen verrät, warum sie gelobt und warum sie kritisiert wird.' },
    { lead: 'Deine Zeitleiste:', text: 'wer so dachte wie du, von der Antike bis ins 21. Jahrhundert.' },
    { lead: 'Dein idealer Anführer pro Bereich:', text: 'Politik, Wirtschaft, Philosophie und mehr.' },
    { lead: 'Vollständiges Ranking und PDF:', text: 'der ganze Katalog als Tabelle und der Bericht zum Aufbewahren.' }
  ],
  paywallOnce: 'Einmalzahlung, kein Abo',
  paywallBlockCta: {
    axes: 'Meine vollständige Analyse freischalten',
    disagree: 'Meinen vollständigen Bericht freischalten',
    government: 'Meine Idealregierung freischalten',
    timeline: 'Meine Zeitleiste freischalten',
    countries: 'Meine 10 Regionen freischalten'
  },
  paywallTeaser: {
    axisTag: 'Deine auffälligste Achse',
    disagreeWith: (name) => `Die 3 Achsen, in denen du dich am meisten von ${name} unterscheidest.`,
    seats: ['Politischer Anführer', 'Stellvertretender politischer Anführer', 'Wirtschaftsleiter'],
    eras: ['Antike', 'Mittelalter'],
    topCountry: 'Heute am nächsten'
  },
  paywallInstant: 'Direkt nach der Zahlung freigeschaltet.',
  paywallGuarantee: '14 Tage Garantie',
  paywallPayWith: 'Zahlungsarten: Karten, PayPal, Apple Pay, Google Pay und mehr, je nach Land',
  paywallPrice: 'US$ 3.99',
  paywallCta: 'Meinen vollständigen Bericht freischalten',
  paywallChecking: 'Deine Zahlung wird bestätigt...',
  paywallProblems: {
    denied: 'Diese Zahlung gilt nicht für dieses Ergebnis oder wurde erstattet.',
    unavailable: 'Dienst derzeit nicht verfügbar, bitte versuche es in einigen Augenblicken erneut.',
    timeout: 'Die Zahlung wurde noch nicht bestätigt.'
  },
  paywallRetry: 'Erneut prüfen',
  paywallOpening: 'Zahlung wird geöffnet...',
  paywallEmailLabel: 'Deine E-Mail',
  paywallEmailPlaceholder: 'du@beispiel.de',
  paywallEmailInvalid: 'Gib eine gültige E-Mail-Adresse ein.',
  unlockedTag: 'Zahlung bestätigt',
  unlockedTitle: 'Dein vollständiger Bericht ist freigeschaltet!',
  unlockedLead: 'Du kannst jetzt auf deinen vollständigen Bericht zugreifen. Speichere den Zugangslink unten, um ihn später zu öffnen.',
  unlockedCta: 'Bericht ansehen',
  unlockedCopy: 'Zugangslink kopieren',
  unlockedCopied: 'Link kopiert!',
  areasLockedTitle: 'Welche Persönlichkeit passt in jedem Bereich am besten zu dir?',
  areasLockedText: 'Sieh dir die Persönlichkeit an, die in Politik, Wirtschaft, Philosophie und den anderen Bereichen am besten zu dir passt.',
  areasLockedCta: 'Meinen vollständigen Bericht freischalten',
  personalitiesDistantTitle: 'Am weitesten von dir entfernt',
  ideologyDistantTitle: 'Die Ideologie, die am weitesten von dir entfernt ist',
  phraseTitle: 'Ein Satz, der dich beschreibt',
  aboutIdeology: (ideology) => `Über ${ideology}`,
  knowMoreAbout: (name) => `Mehr über ${name} erfahren`,
  showLess: 'Weniger anzeigen',
  matchTopKicker: 'Beste Übereinstimmung',
  dimensionsTitleShort: 'Auch nah, nach Dimension',
  phraseNote: (ideology) => `So würde jemand aus der Ideologie ${ideology} die Gesellschaft zusammenfassen, die er oder sie sich wünscht.`,
  signatureTitle: 'Was dich unterscheidet',
  signatureUnusualLabel: 'Deine ungewöhnlichste Position',
  signatureCommonLabel: 'Deine typischste Position',
  signatureUnusualLead: (pole, percent) => `Du bist stärker ${pole.toLowerCase()} ausgerichtet als ${Math.round(percent)}% der Ideologien im Katalog.`,
  signatureUnusualLeadMax: (pole) => `Keine Ideologie im Katalog ist so stark ${pole.toLowerCase()} ausgerichtet wie du.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Deine Position bei ${axis} liegt in der Mitte. Trotzdem bist du damit stärker ${pole.toLowerCase()} ausgerichtet als ${Math.round(percent)}% der Ideologien im Katalog.`,
  signatureUnusualNote: (axis) => `Von allen 12 Achsen weichst du bei ${axis} am stärksten vom Feld ab. Das ist das Merkmal, das dich unterscheidet.`,
  signatureCommonLead: (axis) => `Deine Position bei ${axis} liegt fast genau beim Median des Katalogs.`,
  signatureCommonNote: (pole) => `Das ist gemeinsamer Boden. Du bist weder ${pole.toLowerCase()} noch zum Gegenpol hin ausgerichtet.`,
  signatureCommonNoteBalanced: (axis) => `Bei ${axis} stehst du in der Mitte, und der Katalog ebenfalls. Hier fällst du am wenigsten auf.`,
  tensionLabel: 'Deine innere Spannung',
  tensionCombo: (firstPole, secondPole) => `${firstPole} und ${secondPole} zugleich`,
  tensionRare: (count, total) => `Nur ${count} der ${total} Ideologien im Katalog vertreten beide dieser Positionen.`,
  tensionUnique: 'Keine Ideologie im Katalog vertritt beide dieser Positionen.',
  tensionExamples: (names) => `Nächste Übereinstimmungen: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `Im Katalog bewegen sich ${firstAxis} und ${secondAxis} meist gemeinsam. Du kehrst dieses Muster um.`,
  signatureMedian: 'Median der Ideologien',
  signatureYou: 'Du',
  signatureBigCap: (pole) => `der Ideologien sind weniger ${pole.toLowerCase()} ausgerichtet als du.`,
  signatureAtMedian: 'Am Median',
  signatureAtCentre: 'In der Mitte',
  tensionRareShort: (count, total) => `Nur ${count} von ${total} Ideologien vertreten beide dieser Positionen.`,
  personalityCategories: {
    politico: 'Politik',
    religioso: 'Religion',
    economista: 'Wirtschaft',
    filosofo: 'Philosophie',
    teorico: 'Politische Theorie',
    empresario: 'Unternehmertum',
    intelectual: 'Geistesleben',
    ativista: 'Aktivismus',
  },
  redoAnalysis: 'Analyse wiederholen',
  share: 'Teilen',
  saveOrShare: 'Ergebnis teilen',
  generatingPng: 'PNG wird erstellt...',
  sharePreviewTitle: 'Deine Ergebniskarte',
  sharePreviewCompareTitle: 'Vergleichskarte',
  sharePreviewAlt: 'Vorschau deiner teilbaren Ergebniskarte',
  sharePreviewLoading: 'Vorschau deiner Karte wird erstellt',
  generatingPdf: 'PDF wird erstellt...',
  downloadPdf: 'PDF herunterladen',
  downloadPdfFull: 'Vollständigen Bericht als PDF herunterladen',
  report: {
    fileName: '12axes-report',
    docLabel: 'Vollständiger Bericht',
    profileEyebrow: 'Dein ideologisches Profil',
    headerLabel: (ideology) => `Bericht zum politischen Profil · ${ideology}`,
    kpiCountry: 'Nächstes Land',
    kpiPersonality: 'Persönlichkeit',
    kpiAxes: 'Analysierte Achsen',
    kpiAnswered: (count) => `${count} Fragen beantwortet`,
    tocTitle: 'In diesem Bericht',
    generatedOn: (date) => `Erstellt am ${date}`,
    axesIntro: 'Deine Position auf jeder der 12 Achsen. Der Balken beginnt in der Mitte (50%) und reicht zu dem Pol, zu dem du neigst; das Abzeichen zeigt die Intensität.',
    intensityLegend: 'Intensität',
    intensityLevels: ['Ausgewogen · bis 57%', 'Neigend · 58 bis 72%', 'Stark · 73 bis 87%', 'Sehr stark · 88% oder mehr'],
    alsoClose: 'Auch nah, nach Dimension deines Profils',
    continued: 'Fortsetzung',
    areasIntro: 'Die Persönlichkeiten im Katalog, deren Profil auf den 12 Achsen deinem am meisten ähnelt.',
    booksIntro: 'Ein Werk von jeder der Persönlichkeiten, die deinen Ergebnissen am nächsten sind.',
    aboutTitle: 'Über diesen Bericht',
    aboutText: '12 Axes vergleicht deine Antworten mit Profilen von Ideologien, Ländern und Persönlichkeiten auf denselben 12 Achsen. Die Übereinstimmung misst die Nähe zwischen Profilen; sie ist weder eine wissenschaftliche Diagnose noch ein endgültiges Etikett. Deine Antworten werden nicht gespeichert.',
    ctaTitle: 'Mach den Test noch einmal oder teile ihn'
  },
  shareFilePrefix: '12axes-profile',
  shareCountriesFilePrefix: '12axes-countries',
  shareCountriesTitle: 'Die Länder, die meinem Profil am nächsten sind | 12axes.vercel.app',
  shareCountriesMessage: (country, percent) =>
    `Sieh dir die Länder an, die meinem politischen Profil am nächsten sind, im 12 Axes Politiktest!\n\n` +
    `🌎 Am besten passendes heutiges Land:\n` +
    `${country} - ${percent}% Übereinstimmung\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  shareCountriesCta: 'Nahe Länder teilen',
  sharePersonalitiesCta: 'Nahe Persönlichkeiten teilen',
  sharePartiesCta: 'Nahe Parteien teilen',
  shareCompassCta: 'Werte und Kompass teilen',
  shareGovernmentCta: 'Idealregierung teilen',
  shareTimelineCta: 'Zeitleiste teilen',
  shareLivingCta: 'Länder zum Leben teilen',
  shareIdealGovernment: 'IDEALREGIERUNG',
  shareTimeline: 'ZEITLEISTE',
  shareLiving: 'LÄNDER ZUM LEBEN',
  shareBestEra: 'AM BESTEN PASSENDE EPOCHE',
  shareGovernmentFilePrefix: '12axes-ideal-government',
  shareGovernmentTitle: 'Meine Idealregierung | 12axes.vercel.app',
  shareGovernmentMessage: (leader) =>
    `Sieh dir meine Idealregierung im 12 Axes Politiktest an!\n\n` +
    `🏛️ Politischer Anführer:\n${leader}\n\n` +
    `👉 Mach den Test und stelle deine zusammen:\nhttps://12axes.vercel.app/de`,
  shareTimelineFilePrefix: '12axes-timeline',
  shareTimelineTitle: 'Meine ideologische Zeitleiste | 12axes.vercel.app',
  shareTimelineMessage: (era) =>
    `Sieh dir meine ideologische Zeitleiste im 12 Axes Politiktest an!\n\n` +
    `⏳ Am besten passende Epoche:\n${era}\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  shareLivingFilePrefix: '12axes-countries-to-live-in',
  shareLivingTitle: 'Die Länder, in denen ich leben würde | 12axes.vercel.app',
  shareLivingMessage: (country, percent) =>
    `Sieh dir die Länder an, in denen ich mich laut dem 12 Axes Politiktest zu Hause fühlen würde!\n\n` +
    `🌎 Am besten passend:\n${country} - ${percent}% Übereinstimmung\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  shareNearbyPersonalities: 'NAHE PERSÖNLICHKEITEN',
  shareNearbyParties: 'NAHE PARTEIEN',
  shareValuesCompass: 'WERTE UND KOMPASS',
  sharePersonalitiesFilePrefix: '12axes-personalities',
  sharePersonalitiesTitle: 'Die Persönlichkeiten, die meinem Profil am nächsten sind | 12axes.vercel.app',
  sharePersonalitiesMessage: (name, percent) =>
    `Sieh dir die Persönlichkeiten an, die meinem politischen Profil am nächsten sind, im 12 Axes Politiktest!\n\n` +
    `👤 Am besten passende Persönlichkeit:\n` +
    `${name} - ${percent}% Übereinstimmung\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  sharePartiesFilePrefix: '12axes-parties',
  sharePartiesTitle: 'Die Parteien, die meinem Profil am nächsten sind | 12axes.vercel.app',
  sharePartiesMessage: (name, percent) =>
    `Sieh dir die Parteien an, die meinem politischen Profil am nächsten sind, im 12 Axes Politiktest!\n\n` +
    `🏛️ Am besten passende heutige Partei:\n` +
    `${name} - ${percent}% Übereinstimmung\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  shareCompassFilePrefix: '12axes-compass',
  shareCompassTitle: 'Meine Werte und mein politischer Kompass | 12axes.vercel.app',
  shareCompassMessage: (ideology) =>
    `Sieh dir meine Werte und meinen politischen Kompass im 12 Axes Politiktest an!\n\n` +
    `💡 Meine Ideologie:\n${ideology}\n\n` +
    `👉 Mach den Test und finde deine heraus:\nhttps://12axes.vercel.app/de`,
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Ich habe mein ideologisches Profil im 12 Axes Politiktest entdeckt!\n\n` +
    `💡 Am besten passende Ideologie:\n` +
    `${ideology} - ${ideologyPct}% Übereinstimmung\n\n` +
    `🌎 Am besten passendes Land/passende Nation:\n` +
    `${country} - ${countryPct}% Übereinstimmung\n\n` +
    `👤 Am besten passende Persönlichkeit:\n` +
    `${personality} - ${personalityPct}% Übereinstimmung\n\n` +
    `👉 Mach den Test und teile dein Ergebnis:\nhttps://12axes.vercel.app/de`,
  progress: (current, total) => `Frage ${current} von ${total}`,
  progressDone: (percent) => `${percent}% abgeschlossen`,
  archetypeHeader: 'Dein Archetyp wird ermittelt',
  archetypeStep: (current, total) => `${current} von ${total}`,
  progressAria: (percent) => `Fortschritt im Test: ${percent}%`,
  answersAria: 'Antwortmöglichkeiten',
  countryKicker: 'Am besten passendes Land',
  flagLabel: 'Flagge',
  flagHistoricLabel: 'Flagge / historisches Symbol',
  flagAlt: (label, name) => `${label} von ${name}`,
  flagUnavailable: 'Flagge nicht verfügbar',
  flagUnavailableAria: (name) => `Flagge für ${name} nicht verfügbar`,
  personalityKicker: 'Am besten passende Persönlichkeit',
  portraitAlt: (name) => `Porträt von ${name}`,
  portraitUnavailableAria: (name) => `Porträt von ${name} nicht verfügbar`,
  compatibilityAria: (pct) => `Übereinstimmung: ${pct} Prozent`,
  matchWord: 'match',
  compatibilityLevels: {
    veryHigh: 'Sehr hohe Übereinstimmung',
    high: 'Hohe Übereinstimmung',
    medium: 'Mittlere Übereinstimmung',
    low: 'Geringe Übereinstimmung',
    veryLow: 'Sehr geringe Übereinstimmung'
  },
  shareTitle: 'Mein ideologisches Profil | 12axes.vercel.app',
  shareTopMatch: 'Beste Übereinstimmung',
  shareCountry: 'Am besten passendes Land',
  sharePersonality: 'Persönlichkeit',
  shareResultLabel: 'MEIN ERGEBNIS',
  shareMostCompatible: 'BESTE ÜBEREINSTIMMUNG',
  shareYourAxes: 'DEINE 12 ACHSEN',
  shareOtherPersonalities: 'WEITERE PERSÖNLICHKEITEN',
  shareNearbyCountries: 'NAHE LÄNDER',
  shareFooterCta: 'ENTDECKE DEIN PROFIL',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Das Projekt unterstützen',
  supportTitle: '',
  ossEyebrow: 'Open Source',
  ossTitle: 'Ein unabhängiges, transparentes Projekt',
  ossLead: 'Du musst uns nicht einfach glauben. Der Code von 12 Axes ist öffentlich: Du kannst sehen, wie jede Antwort gewertet wird, wie die Übereinstimmung berechnet wird und woher die Profile stammen.',
  ossCards: [
    { title: 'Unabhängig', text: 'Keine Verbindungen zu Parteien, Regierungen oder Kampagnen. Niemand zahlt dafür, in deinem Ergebnis zu erscheinen.' },
    { title: 'Überprüfbar', text: 'Die Wertung der Antworten und die Berechnung der Übereinstimmung stehen im Code, ohne Black Box.' },
    { title: 'Nachprüfbar', text: 'Fragen, Ideologien, Länder und Persönlichkeiten liegen in versionierten Dateien mit öffentlichem Verlauf.' },
    { title: 'Gemeinschaftlich', text: 'Eine verzerrte Frage oder ein ungenaues Profil gefunden? Eröffne ein Issue oder sende einen Pull Request.' }
  ],
  ossBarText: 'Lies den Code, prüfe die Daten und mach auf GitHub mit.',
  ossGithubCta: 'Auf GitHub ansehen',
  footerRights: '© 2026. Alle Rechte vorbehalten',
  footerProject: 'Projekt',
  footerExplore: 'Entdecken',
  footerAbout: 'Über uns',
  footerContribute: 'Mitmachen',
  footerLicense: 'Lizenz',
  footerFullReport: 'Vollständiger Bericht',
  footerTerms: 'Nutzungsbedingungen',
  footerPrivacy: 'Datenschutz',
  footerRefund: 'Erstattung',
  footerReport: 'Bericht',
  supportTitleEm: 'Unterstütze',
  supportLead:
    '12 Axes ist unabhängig und kostenlos. Wenn dir der Test geholfen hat, deine politische Ideologie besser zu verstehen, überlege eine Spende per Pix oder Krypto, damit das Projekt weiterläuft.',
  supportPrivacyNote: 'Wir sammeln keine Daten. Um zu spenden, ohne dich zu identifizieren, nutze Krypto.',
  supportCopy: 'Kopieren',
  supportCopied: 'Kopiert!',
  supportCopyAria: (label) => `Adresse von ${label} kopieren`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Zufälliger Schlüssel',
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
