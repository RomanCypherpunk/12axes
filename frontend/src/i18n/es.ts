// Dicionário de UI em espanhol: só é baixado por quem abre o site em espanhol. Chave ausente usa o inglês.
import type { Strings } from './index';
import type { DeepPartial } from './mergeStrings';

export const es: DeepPartial<Strings> = {
  htmlLang: 'es',
  docTitle: 'Test político gratis: ¿qué ideología política eres? | 12 Axes',
  loadingAnalysis: 'Cargando el análisis político...',
  loadingQuiz: 'Cargando el test...',
  loadingResult: 'Cargando los resultados...',
  tryAgain: 'Intentar de nuevo',
  crashTitle: 'Algo salió mal',
  crashBody: 'La página tuvo un error inesperado. Recárgala para intentarlo de nuevo.',
  crashBodyWithProgress: 'La página tuvo un error inesperado, pero tus respuestas están guardadas. Recarga y elige continuar donde lo dejaste.',
  crashReload: 'Recargar la página',
  resumeEyebrow: 'Test en curso',
  resumeTitle: 'Retoma donde lo dejaste',
  resumeBody: (answered, total) => `Has respondido ${answered} de ${total} preguntas. Tus respuestas están guardadas en este navegador.`,
  resumeContinue: 'Continuar',
  resumeDiscard: 'Empezar de nuevo',
  resumeUnavailable: 'No se pudo retomar el test anterior. Empieza uno nuevo.',
  doneEyebrow: 'Test completado',
  doneTitle: 'Ya hiciste el test',
  doneBody: (name) => `Tu resultado fue ${name}. Está guardado en este navegador, solo tienes que abrirlo de nuevo.`,
  doneView: 'Ver resultados',
  doneRetake: 'Repetir el test',
  editAnswersButton: 'Editar respuestas',
  editAnswersTitle: 'Editar respuestas',
  editAnswersGroupsAria: 'Ejes',
  editAnswersArchetype: 'Arquetipo',
  editAnswersReligion: 'Tu religión',
  editAnswersChanged: (count) => (count === 0 ? 'Sin cambios' : count === 1 ? '1 respuesta cambiada' : `${count} respuestas cambiadas`),
  editAnswersCancel: 'Cancelar',
  editAnswersSave: 'Guardar respuestas',
  editAnswersSaving: 'Recalculando…',
  editAnswersDiscard: '¿Descartar los cambios que no has guardado?',
  editAnswersLoading: 'Cargando tus respuestas…',
  editAnswersUnavailable: 'No se pudieron abrir tus respuestas: las preguntas cambiaron después de que hicieras el test.',
  skipToContent: 'Saltar al contenido',
  backToStartAria: 'Volver al inicio',
  mainNavAria: 'Navegación principal',
  navHow: 'Cómo funciona',
  navAxes: '12 Axes',
  navSpectrum: 'Espectro',
  navFaq: 'Preguntas frecuentes',
  navBooks: 'Libros',
  navIdeologies: 'Ideologías',
  navPersonalities: 'Personalidades',
  navCountries: 'Países',
  navParties: 'Partidos',
  navCompare: 'Comparar',
  navSupport: 'Apoyar',
  langToggleLabel: 'PT',
  langToggleAria: 'Idioma',
  redoQuiz: 'Repetir el test',
  religionLabel: 'Religión',
  religionQuestion: '¿Sigues alguna religión? Solo lo usamos para adaptar tus recomendaciones.',
  religionNone: 'Sin religión, agnóstico o ateo',
  religionNames: {
    christianity: 'Cristianismo',
    judaism: 'Judaísmo',
    islam: 'Islam',
    buddhism: 'Budismo',
    hinduism: 'Hinduismo',
    other: 'Otra religión'
  },
  denominationLabel: 'Tradición cristiana',
  denominationQuestion: '¿Qué tradición cristiana sigues?',
  denominationNames: { catholic: 'Católica', protestant: 'Protestante', orthodox: 'Ortodoxa' },
  restartQuiz: 'Reiniciar el test',
  heroEyebrow: 'Descubrimiento político',
  h1Pre: '¿Conoces de verdad tu ',
  h1Em: 'ideología política',
  h1Post: '?',
  introLead:
    'Puede que te estés etiquetando mal. En pocos minutos descubre tu ideología real, el país que piensa más como tú y al líder político más cercano a tus ideas.',
  startQuiz: 'Descubrir mi perfil',
  seeAxes: 'Ver los 12 ejes',
  heroLabels: ['Gratis', 'Anónimo', 'Rápido', 'Resultado al instante'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Resultado de ejemplo',
  heroDeckDot: (position, total) => `Mostrar ejemplo ${position} de ${total}`,
  heroDeckAlt: (ideology) => `Ejemplo de la tarjeta de resultado para compartir: ${ideology}`,
  formats: {
    short: {
      label: 'Corto',
      questionCount: '36 preguntas',
      description: 'Un resultado rápido, ideal para una primera lectura de tu perfil',
      duration: 'Unos 5 min',
      action: 'Empezar versión corta'
    },
    extended: {
      label: 'Completo',
      questionCount: '60 preguntas',
      description: 'Más precisión para acercar tu resultado a los perfiles ideológicos.',
      duration: 'Unos 9 min',
      action: 'Empezar versión completa'
    },
    extreme: {
      label: 'Extremo',
      questionCount: '240 preguntas',
      description: 'Conoce la síntesis exacta de tu pensamiento con una precisión del 100%.',
      duration: 'Unos 30 min',
      action: 'Empezar versión extrema'
    }
  },
  axisInfoAria: (label) => `¿Qué significa el eje ${label}?`,
  questionHelpAria: 'Entender esta pregunta',
  questionHelpLabel: 'Entender',
  themeToDarkAria: 'Cambiar a modo oscuro',
  themeToLightAria: 'Cambiar a modo claro',
  questionHelpTitle: 'Sobre esta pregunta',
  questionHelpAgree: 'Si estás de acuerdo',
  questionHelpDisagree: 'Si no estás de acuerdo',
  questionHelpNote: 'Conviene recordar',
  questionHelpExample: 'Ejemplo',
  closeLabel: 'Cerrar',
  personalityInfoAria: (name) => `Ver detalles sobre ${name}`,
  closenessTitle: 'Lo que más te acerca',
  closenessYou: 'Tú',
  insight: {
    closeTitle: (name) => `Lo que te acerca a ${name}`,
    closeNone: (name) => `Tú y ${name} no comparten claramente una posición en ningún eje.`,
    closeAxis: (axis, phrase, youPct, otherPct, name, gap) =>
      `En ${axis}, los dos muestran ${phrase}. Tú estás en ${youPct}% de ese lado y ${name} en ${otherPct}%${gap < 8 ? ', prácticamente en el mismo punto' : gap < 15 ? ', muy cerca' : ', con distinta intensidad'}.`,
    apartTitle: 'Dónde se separan',
    apartNone: (name) => `Tú y ${name} no quedan muy lejos en ningún eje.`,
    apartAxis: (axis, you, other, name, gap) => `En ${axis} sus caminos se separan: tú muestras ${you}, y ${name} muestra ${other}. La distancia entre ustedes en este eje es de ${gap} ${gap === 1 ? 'punto' : 'puntos'}.`,
    apartTiny: (axis, name, gap) =>
      `En ${axis}, la mayor diferencia entre tú y ${name} es de solo ${gap} ${gap === 1 ? 'punto' : 'puntos'}: están prácticamente en el mismo punto.`,
    apartSame: (axis, phrase, youPct, otherPct, name, gap) =>
      `En ${axis} se inclinan hacia el mismo lado, pero con distinta intensidad: los dos muestran ${phrase}, tú en ${youPct}% y ${name} en ${otherPct}%. La distancia entre ustedes en este eje es de ${gap} ${gap === 1 ? 'punto' : 'puntos'}.`,
    balanced: 'una posición equilibrada',
    poles: {
      estrutura: { left: 'preferencia por más autonomía para estados y regiones', right: 'preferencia por un gobierno central más fuerte' },
      representacao: { left: 'defensa de la democracia y de las elecciones libres', right: 'defensa de un poder concentrado en un líder o grupo' },
      poder: { left: 'prioridad a la seguridad y el orden', right: 'prioridad a las libertades individuales' },
      imigracao: { left: 'preferencia por la asimilación a la cultura del país', right: 'defensa de la convivencia entre varias culturas' },
      diplomacia: { left: 'confianza en la fuerza militar', right: 'preferencia por la paz y la negociación' },
      intervencao: { left: 'preferencia por mantenerse al margen de disputas externas', right: 'énfasis en defender el interés nacional' },
      economia: { left: 'énfasis en la propiedad y los servicios públicos', right: 'énfasis en la propiedad y la iniciativa privada' },
      controle: { left: 'preferencia por una economía planificada y regulada', right: 'preferencia por el libre mercado y poca regulación' },
      comercio: { left: 'defensa de proteger la industria nacional', right: 'defensa de abrirse al comercio internacional' },
      religiao: { left: 'preferencia por separar religión y política', right: 'defensa de más religión en la vida pública' },
      moral: { left: 'valores sociales progresistas', right: 'valores sociales tradicionales' },
      tecnologia: { left: 'confianza en la tecnología y la industria', right: 'preferencia por soluciones más naturales y biológicas' }
    }
  },
  compareEyebrow: 'Análisis comparativo',
  compareTitle: 'Análisis comparativo',
  compareLead: 'Elige una personalidad, un país o una ideología y mira, eje por eje, dónde estás cerca o lejos.',
  compareSearchLabel: 'Busca un perfil para comparar',
  compareSearchPlaceholder: 'Busca una personalidad, un país o una ideología',
  compareView: 'Ver',
  compareFieldCaption: 'Personalidad, país o ideología',
  compareFullView: 'Ver comparación completa',
  compareExamplePlaceholder: 'Ej.: Donald Trump',
  compareAxesTitle: 'Tus 12 ejes',
  compareNoResults: 'No se encontraron perfiles.',
  compareLoading: 'Comparando…',
  compareLoadError: 'No se pudo cargar la comparación. Inténtalo de nuevo.',
  compareTypeLabels: { personality: 'Personalidad', country: 'País', ideology: 'Ideología', party: 'Partido u organización' },
  compareAxisAdverbs: {
    estrutura: 'estructuralmente',
    economia: 'económicamente',
    moral: 'moralmente',
    tecnologia: 'tecnológicamente',
    diplomacia: 'diplomáticamente'
  },
  compareClosestLine: (adverb, name) => `Eres ${adverb} compatible con ${name}.`,
  compareFarthestLine: (adverb, name) => `Estás ${adverb} lejos de ${name}.`,
  compareClosestFallback: (axis, name) => `En ${axis}, eres compatible con ${name}.`,
  compareFarthestFallback: (axis, name) => `En ${axis}, estás lejos de ${name}.`,
  compareIdentical: (name) => `Tú y ${name} tienen posiciones prácticamente idénticas en todos los ejes.`,
  compareNearestLine: (axis, name) => `Tu eje más cercano a ${name} es ${axis}.`,
  compareNoFarLine: (name) => `Ningún eje está lejos de ${name}.`,
  compareValues: (pole, you, them, name) => `${pole}: tú ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Comparar perfiles — 12 Axes',
  comparePageEyebrow: 'Comparar perfiles',
  comparePageTitle: 'Lado a lado, en los 12 ejes',
  comparePageProfilesTitle: 'Perfiles',
  comparePageNeedMore: 'Elige un perfil más para comparar.',
  comparePageFull: 'Hasta 3 perfiles. Quita uno para elegir otro.',
  comparePageRemove: 'Quitar',
  comparePageRemoveAria: (name) => `Quitar a ${name} de la comparación`,
  comparePageUnknown: 'Perfil no encontrado',
  comparePageNotFound: 'Uno de los perfiles de este enlace no existe. Quítalo y elige otro.',
  comparePageAxesTitle: 'Los 12 ejes',
  comparePageAxisAria: (axis, values) => `${axis}: ${values}`,
  comparePageCompassAria: (points) => `Brújula política: ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% derecha, ${authoritarian}% autoritario, ${traditional}% tradicionalista`,
  comparePageLegendAria: 'Leyenda de la brújula',
  comparePagePairsTitle: 'Compatibilidad entre ellos',
  comparePageSignatureTitle: 'Lo que los distingue',
  comparePageIdeologyTitle: 'Ideología más cercana',
  comparePageNavIdeologies: 'Ideologías',
  comparePageNavAxes: '12 Axes',
  comparePageNavSignature: 'Distinción',
  comparePageNavCountries: 'Países',
  comparePageNavParties: 'Partidos',
  comparePageNavCompass: 'Brújula',
  comparePageNavCompatibility: 'Compatibilidad',
  comparePageCommonLabel: 'En común',
  comparePageNearestFor: (name) => `Más cercano a ${name}`,
  comparePageCountriesTitle: 'Países más cercanos',
  comparePagePartiesTitle: 'Partidos más cercanos',
  comparePageBalanced: 'Equilibrado',
  comparePageUnitPoints: 'pts',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) => `${high} y ${low} están a ${points} ${points === 1 ? 'punto' : 'puntos'} de distancia en este eje.`,
  comparePageAgreeCap: (points) => `Aquí coinciden: solo ${points} ${points === 1 ? 'punto' : 'puntos'} de distancia.`,
  comparePageOpposite: 'Lados opuestos',
  comparePageOppositeCount: (count, total) => `Quedan en lados opuestos en ${count} de ${total} ejes.`,
  comparePageNoOpposite: 'Ningún eje pone a estos perfiles en lados opuestos.',
  comparePageDiverge: 'Donde más difieren',
  comparePageAgree: 'Donde más coinciden',
  comparePagePairLabel: 'Compatibilidad',
  peopleTitle: 'Compara con otra persona',
  peopleLead: 'Pega el enlace del resultado de otra persona y mira, eje por eje, dónde están cerca o lejos.',
  peopleNameLabel: 'Nombre de la otra persona',
  peopleNameCaption: 'Nombre',
  peopleUrlCaption: 'Enlace del resultado',
  peopleNamePlaceholder: 'p. ej. Juan',
  peopleUrlLabel: 'Enlace del resultado de la otra persona',
  peopleUrlPlaceholder: 'Pega el enlace aquí',
  peoplePaste: 'Pegar',
  peoplePasteBlocked: 'El navegador no permitió leer el portapapeles. Pega el enlace en el campo con Ctrl+V.',
  peoplePasteBlockedTouch: 'No se pudo leer el portapapeles. Mantén pulsado el campo del enlace y elige Pegar.',
  peoplePasteEmpty: 'Todavía no hay nada copiado. Copia el enlace del resultado y toca Pegar.',
  peopleCompare: 'Comparar',
  peopleNameRequired: 'Escribe el nombre de la otra persona.',
  peopleLinkMissing: (keys) => `Este enlace no tiene todos los ejes (faltan: ${keys}). Pega el enlace completo del resultado.`,
  peopleLinkInvalid: (keys) => `Valor no válido en el enlace (${keys}). Cada eje va de 0 a 100.`,
  peopleYou: 'Tú',
  peopleOther: 'Otra persona',
  peopleBoth: 'Ustedes dos',
  compareBoth: 'Ambos',
  peopleShare: 'Compartir comparación',
  shareCompareLabel: 'COMPARACIÓN',
  shareCompareFilePrefix: '12axes-comparacion',
  shareCompareTitle: (percent) => `Nuestra compatibilidad política: ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `¡Comparé mi perfil político con el de ${other} en el Test Político 12 Axes!\n\n` +
    `🤝 Compatibilidad entre nosotros: ${percent}%\n\n` +
    `💡 Mi ideología:\n${mine}\n\n` +
    `💡 Ideología de ${other}:\n${theirs}\n\n` +
    `👉 Mira la comparación y haz el test:\n${url}`,
  peopleSignatureTitle: 'Lo que los distingue',
  peopleDiverge: 'Donde más difieren',
  peopleAgree: 'Donde más coinciden',
  peopleAgreeCap: (points) => `Aquí coinciden: solo ${points} ${points === 1 ? 'punto' : 'puntos'} de distancia.`,
  peopleOppositeCount: (count, total) => `Quedan en lados opuestos en ${count} de ${total} ejes.`,
  peopleNoOpposite: 'Ningún eje los pone en lados opuestos.',
  peopleBlocked: 'El navegador bloqueó la nueva pestaña.',
  peopleRename: (name) => `Editar el nombre de ${name}`,
  peopleNameInputLabel: 'Nombre',
  peopleOpenLink: 'Abrir la comparación',
  peoplePersonalitiesTitle: 'Personalidades más cercanas',
  peopleValuesTitle: 'Valores',
  peopleSharedValuesTitle: 'Valores compartidos',
  peoplePairsTitle: 'Compatibilidad entre ustedes',
  peopleNavPersonalities: 'Personalidades',
  peopleNavValues: 'Valores',
  peopleNavSharedValues: 'En común',
  peoplePageDocTitle: 'Compara con otra persona — 12 Axes',
  peoplePageTitle: 'Ustedes dos, en los 12 ejes',
  peoplePagePeopleTitle: 'Personas',
  peoplePageBadLink: 'Este enlace de comparación está incompleto. Abre tu resultado y usa "Compara con otra persona".',
  peoplePageLoadError: 'No se pudo cargar la comparación. Inténtalo de nuevo.',
  peoplePageLoading: 'Comparando…',
  axisExplanations: {
    estrutura: 'Mide si prefieres el poder repartido entre estados, ciudades y comunidades locales, o un Estado nacional unitario con leyes y mando más uniformes.',
    representacao: 'Compara la confianza en las elecciones, la oposición y las instituciones democráticas con la preferencia por un liderazgo fuerte, la tecnocracia, la monarquía o los regímenes autoritarios.',
    poder: 'Evalúa el equilibrio entre orden, vigilancia, castigo y control estatal frente a privacidad, libertad individual y autonomía civil.',
    imigracao: 'Observa si valoras la asimilación cultural, el idioma y la identidad nacional, o el multiculturalismo, la migración abierta y la pluralidad de costumbres.',
    diplomacia: 'Analiza tu posición sobre las fuerzas armadas, las armas, la disuasión y la intervención militar, frente a la negociación, el pacifismo y los organismos internacionales.',
    intervencao: 'Mide la inclinación entre el no intervencionismo exterior y una soberanía nacional más firme, el nacionalismo geopolítico y la defensa activa de los intereses nacionales.',
    economia: 'Compara la preferencia por la propiedad pública, las empresas estatales y los servicios colectivos con la propiedad privada, la privatización y el liderazgo empresarial.',
    controle: 'Evalúa la planificación estatal, la regulación y la política económica activa frente al libre mercado, la baja interferencia, la autonomía monetaria y la competencia.',
    comercio: 'Mide el proteccionismo, la soberanía productiva y la defensa de la industria nacional frente al globalismo, el libre comercio y la integración económica internacional.',
    religiao: 'Compara el laicismo, la separación entre religión y Estado y la crítica a los privilegios religiosos con la influencia pública de la fe y de los valores religiosos.',
    moral: 'Evalúa el progresismo cultural, los derechos civiles y el cambio social frente a la tradición, la familia, las costumbres y el conservadurismo moral.',
    tecnologia: 'Mide el entusiasmo por la tecnología, la IA, la ingeniería genética y el desarrollo técnico frente a la cautela biológica, ambiental y conservacionista.'
  },
  homeAxes: {
    estrutura: { label: 'Estructura', leftPole: 'Federal', rightPole: 'Unitario' },
    representacao: { label: 'Representación', leftPole: 'Democracia', rightPole: 'Autocracia' },
    poder: { label: 'Poder', leftPole: 'Seguridad', rightPole: 'Libertad' },
    imigracao: { label: 'Inmigración', leftPole: 'Asimilación', rightPole: 'Multiculturalismo' },
    diplomacia: { label: 'Diplomacia', leftPole: 'Militarista', rightPole: 'Pacifista' },
    intervencao: { label: 'Intervención', leftPole: 'No intervencionista', rightPole: 'Nacionalista' },
    economia: { label: 'Economía', leftPole: 'Público', rightPole: 'Privado' },
    controle: { label: 'Control', leftPole: 'Planificación', rightPole: 'Libre mercado' },
    comercio: { label: 'Comercio', leftPole: 'Proteccionismo', rightPole: 'Globalismo' },
    religiao: { label: 'Religión', leftPole: 'Irreligioso', rightPole: 'Religioso' },
    moral: { label: 'Moral', leftPole: 'Progresista', rightPole: 'Tradicionalista' },
    tecnologia: { label: 'Tecnología', leftPole: 'Tecnología', rightPole: 'Biología' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Izquierda radical',
      tone: 'darkred',
      description:
        'Comunismo revolucionario o totalitario de partido único, con economía planificada, fuerte centralización y poder estatal concentrado.'
    },
    {
      id: 'left',
      label: 'Izquierda',
      tone: 'green',
      description:
        'Defiende la socialdemocracia, el progresismo y una mayor intervención del Estado en la economía dentro de la democracia liberal.'
    },
    {
      id: 'center',
      label: 'Centro',
      tone: 'gray',
      description:
        'Busca el equilibrio entre izquierda y derecha, mercado y Estado, reforma y estabilidad, con una postura política moderada o pragmática.'
    },
    {
      id: 'right',
      label: 'Derecha',
      tone: 'blue',
      description:
        'Defiende el conservadurismo, el liberalismo económico y un nacionalismo moderado dentro de la democracia liberal.'
    },
    {
      id: 'right-extreme',
      label: 'Extrema derecha',
      tone: 'navy',
      description:
        'Fascismo, nacionalismo racial y teocracias opresivas, con rechazo explícito de la democracia y concentración autoritaria del poder.'
    },
    {
      id: 'third-position',
      label: 'Tercera posición',
      tone: 'purple',
      description:
        'Una síntesis nacionalista y corporativista que rechaza tanto el capitalismo liberal como el marxismo, fuera del eje tradicional izquierda-derecha.'
    },
    {
      id: 'libertarian',
      label: 'Libertario',
      tone: 'amber',
      description:
        'Defiende un Estado mínimo, el libre mercado, la propiedad privada y las libertades individuales, sin proponer la abolición total del Estado.'
    },
    {
      id: 'anarchist',
      label: 'Anarquista',
      tone: 'charcoal',
      description:
        'Rechaza el Estado y toda autoridad coercitiva, y defiende una organización social libre, voluntaria y autogestionada, desde la izquierda o desde la derecha.'
    }
  ],
  faqItems: [
    {
      question: '¿Es fiable el test?',
      answer:
        'El test político 12 Axes es fiable como herramienta para leer y comparar posiciones políticas. Usa preguntas repartidas en 12 ejes para reducir el sesgo de un solo tema, pero no sustituye el estudio, el debate ni el análisis académico.'
    },
    {
      question: '¿Cuánto tarda?',
      answer:
        'La versión corta tarda unos 5 minutos. La versión completa, unos 9 minutos. La versión extrema, con 240 preguntas, puede tardar unos 30 minutos.'
    },
    {
      question: '¿Puedo repetirlo?',
      answer:
        'Sí. Puedes repetir el test político tantas veces como quieras, incluso eligiendo otra profundidad para comparar si tu resultado cambia.'
    },
    {
      question: '¿Hay una respuesta correcta?',
      answer:
        'No hay una respuesta correcta. El test de ideología mide preferencias sobre democracia, monarquía, federalismo, inmigración, religión en la política, política económica, comercio internacional, liberalismo, conservadurismo, progresismo y otros temas.'
    },
    {
      question: '¿Cómo calcula el algoritmo?',
      answer:
        'Cada respuesta suma puntos a un polo concreto. El algoritmo calcula porcentajes por eje, compara tu vector ideológico con los perfiles de corrientes políticas, países y personalidades, y devuelve las mayores compatibilidades.'
    },
    {
      question: '¿Cambia el resultado?',
      answer:
        'Puede cambiar si cambian tus opiniones, si respondes con más matices o si haces una versión más larga. La versión extrema tiende a reducir las fluctuaciones al usar más preguntas.'
    },
    {
      question: '¿Es científico el test?',
      answer:
        '12 Axes no es un instrumento científico validado clínicamente. Es un test político educativo, inspirado en modelos de espectro político y en cuestionarios de ideología, útil para la reflexión y la comparación.'
    },
    {
      question: '¿Puedo compartirlo?',
      answer:
        'Sí. Al terminar, puedes compartir tu resultado para hablar de ideología política, espectro político, izquierda, derecha, centro y los 12 ejes con otras personas.'
    },
    {
      question: '¿El test recopila datos?',
      answer:
        'El test es anónimo y no requiere registro. Las respuestas se usan para calcular el resultado en el momento del test, sin pedir tu nombre, tu correo ni ninguna identificación personal.'
    },
    {
      question: '¿Puedo hacerlo desde el celular?',
      answer:
        'Sí. La interfaz está diseñada para celular y computadora, así que puedes hacer el test político en el navegador de tu smartphone.'
    },
    {
      question: '¿Qué es 12 Axes?',
      answer: '12 Axes es un test político gratuito que mide tu posición en 12 ejes (estructura del Estado, representación, libertades, inmigración, diplomacia, intervención, economía, control económico, comercio, religión, moral y tecnología) y te muestra tu ideología política, tu país y tu figura política compatibles.'
    },
    {
      question: '¿12 Axes tiene una brújula política?',
      answer: 'Sí. Al final del resultado hay una brújula política de dos ejes, izquierda × derecha y autoritario × libertario, con una barra progresista × tradicionalista. Resume tus 12 ejes de forma visual, pero no sustituye el análisis completo.'
    },
    {
      question: '¿Cómo encuentro mi ideología política compatible?',
      answer: 'Haz el test político, con 36, 60 o 240 preguntas. El resultado muestra las ideologías más compatibles con tus respuestas, con el porcentaje de compatibilidad y la posición de cada una en los 12 ejes.'
    },
    {
      question: '¿Puedo saber qué país o figura política se parece a mí?',
      answer: 'Sí. Además de la ideología, el resultado compara tu perfil con países actuales, regímenes históricos y figuras políticas, y muestra los más compatibles y los más alejados de ti.'
    },
    {
      question: '¿Cuántas preguntas tiene el test político?',
      answer: 'Hay tres versiones: rápida, con 36 preguntas, completa, con 60, y extrema, con 240. Todas cubren los mismos 12 ejes; cuantas más preguntas, más preciso tiende a ser el resultado.'
    }
  ],
  howEyebrow: 'Cómo funciona',
  howTitle: 'Cómo funciona el test político 12 Axes',
  howLead:
    'Un test de ideología política simple y visual: respondes a afirmaciones, 12 Axes calcula tus porcentajes y muestra dónde te sitúas en el espectro político en cada dimensión.',
  steps: [
    {
      title: 'Responde las preguntas',
      text: 'Di si estás de acuerdo o no con afirmaciones sobre economía, Estado, libertades civiles, valores, religión, política exterior y tecnología.'
    },
    {
      title: 'Análisis en 12 ejes',
      text: 'Cada respuesta te sitúa en 12 ejes ideológicos independientes, del libre mercado a la planificación, del nacionalismo al globalismo.'
    },
    {
      title: 'Descubre tu perfil',
      text: 'Recibe tu perfil ideológico, las ideologías más compatibles, el país más cercano, la personalidad afín y los resultados por eje.'
    }
  ],
  axesGuideEyebrow: '12 ejes',
  axesGuideTitle: '¿Qué significa cada eje?',
  axesGuideLead:
    'El test de ideología 12 Axes analiza en dimensiones separadas el federalismo, la representación política, la democracia, las elecciones, la inmigración, el comercio internacional, la religión en la política, la política económica, la moral y la tecnología.',
  discoveryEyebrow: 'Lo que descubrirás',
  discoveryTitle: 'Un retrato completo de tus convicciones políticas',
  discoveryLead:
    'Más que izquierda o derecha: tu resultado muestra con quién, dónde y con qué intensidad se alinean realmente tus ideas.',
  discoveryItems: [
    { icon: 'ideology', title: 'Tu ideología', text: 'Qué corriente política se parece a ti' },
    { icon: 'country', title: 'Tu país', text: 'Qué nación piensa más como tú' },
    { icon: 'personality', title: 'Tu líder político', text: 'Qué figura histórica es tu afinidad ideológica' },
    { icon: 'books', title: 'Libros recomendados', text: 'Una obra destacada de cada figura política afín a ti' },
    { icon: 'profile', title: 'Tu perfil', text: 'Un retrato completo de tus convicciones' },
    { icon: 'compatibility', title: 'Compatibilidad', text: 'Cuánto coincides de verdad con tu propia ideología' }
  ],
  exampleEyebrow: 'Ejemplo real',
  exampleTitle: 'Así se ve tu resultado',
  exampleCaption: 'Ejemplo ilustrativo con datos reales del catálogo de 12 Axes.',
  exampleCta: 'Quiero ver mi resultado',
  spectrumEyebrow: 'Espectro político',
  spectrumTitle: 'Descubre tu espectro político',
  spectrumLead:
    'El resultado te ayuda a visualizar tu posición política entre izquierda, derecha y centro, e identifica también formas más radicales, autoritarias o libertarias que quedan fuera de ese eje, como la extrema derecha, la izquierda radical, la tercera posición, el libertarismo y el anarquismo.',
  faqTitle: 'Preguntas frecuentes',
  faqLead: 'Todo lo que la gente suele preguntar antes de hacer el test.',
  navStart: 'Inicio',
  navTakeTest: 'Hacer el test',
  menuAria: 'Abrir menú',
  roseAria: 'Rosa de los 12 ejes',
  spectrumBarAria: 'Barra del espectro político con las ocho categorías',
  versionsEyebrow: 'Versiones',
  versionsTitle: 'Elige la profundidad',
  versionsLead:
    'Empieza con el test rápido o profundiza para obtener un retrato más preciso de tu perfil ideológico. Todas las versiones usan los mismos 12 ejes y devuelven el resultado al instante.',
  variantEyebrow: 'Elige el formato',
  variantTitlePre: '¿Quieres rapidez o ',
  variantTitleEm: 'precisión?',
  backToStart: 'Volver al inicio',
  depthLabel: 'Profundidad',
  depthAria: (level) => `Profundidad ${level} de 3`,
  recommended: 'Recomendado',
  formatNotes: ['Todas las versiones usan los mismos 12 ejes', 'Anónimo, sin registro', 'Resultado al instante'],
  variantLead:
    'La versión corta revela el resultado rápidamente. La versión completa aumenta la precisión para acercar tu resultado a los perfiles ideológicos.',
  quizNavAria: 'Navegación del test',
  autoAdvance: 'Avanzar al responder',
  swapQuestion: 'Cambiar',
  swapQuestionAria: 'Cambiar esta pregunta por otra del mismo tema',
  back: 'Atrás',
  next: 'Siguiente',
  calculating: 'Calculando…',
  seeResult: 'Ver resultados',
  archetypeSkip: 'Omitir',
  errMissingAnswer: 'Todavía tienes que responder esta pregunta antes de ver el resultado.',
  errLoadQuiz: 'No se pudo cargar el test.',
  errCalc: 'No se pudo calcular el resultado.',
  errImage: 'No se pudo generar la imagen del resultado.',
  errHttp: (status) => `Error HTTP ${status}`,
  resultsEyebrow: 'Análisis completo',
  resultsH1Pre: 'Tu ',
  resultsH1Em: 'perfil ideológico',
  resultsLead: (count) =>
    `Análisis basado en ${count} respuestas repartidas en 12 dimensiones fundamentales de la ideología política. Consulta tu posición en cada eje y tus afinidades ideológicas.`,
  resultsLeadShared:
    'Resultado compartido: la posición en cada uno de los 12 ejes políticos y las afinidades ideológicas calculadas a partir de ella. Haz el test para descubrir las tuyas.',
  resultsSummaryAria: 'Resumen del análisis',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Ejes políticos',
  axesSectionTitle: 'Tus 12 ejes',
  proximityEyebrow: 'Proximidad ideológica',
  otherMatches: 'Otras ideologías',
  navOnThisPage: 'En esta página',
  resultsNavReport: 'Análisis completo',
  resultsNavPremiumGroup: 'Informe completo',
  resultsNavAxisByAxis: 'Eje por eje',
  resultsNavDisagree: 'Discrepancias',
  resultsNavGovernment: 'Gobierno ideal',
  resultsNavTimeline: 'Línea del tiempo',
  resultsNavLiving: 'Para vivir',
  resultsNavAxes: '12 ejes',
  resultsNavSignature: 'Distinción',
  resultsNavCountries: 'Países',
  resultsNavPersonalities: 'Personalidades',
  resultsNavAreas: 'Áreas',
  resultsNavBooks: 'Libros',
  resultsNavParties: 'Partidos',
  resultsNavIdeologies: 'Ideologías',
  resultsNavCompass: 'Brújula',
  resultsNavValues: 'Valores',
  valuesSectionTitle: 'Tus valores',
  valuesNeutralTag: 'Posición equilibrada',
  valueInfoAria: (name) => `Detalles sobre ${name}`,
  valuesSourceButton: 'Fuente original',
  valuesSourceAuthor: 'Autor',
  valuesSourceLicense: 'Licencia',
  valuesSourceModified: 'imagen modificada',
  compassTitle: 'Brújula política',
  compassAuthoritarian: 'Autoritarismo',
  compassLibertarian: 'Anarquismo',
  compassLeft: 'Izquierda',
  compassRight: 'Derecha',
  compassProgressive: 'Progresista',
  compassTraditionalist: 'Tradicionalista',
  compassInfo: {
    aria: 'Cómo se construye la brújula política',
    title: 'Cómo se construye la brújula',
    authLead: 'El eje autoritario × libertario',
    authText: 'mide el grado de concentración del poder político y de intervención del Estado en la vida de las personas. Considera tres dimensiones principales: libertades individuales, representación política y estructura del Estado.',
    econLead: 'El eje izquierda × derecha',
    econText: 'mide cuánto te sitúas a la izquierda o a la derecha según la organización económica: de la propiedad colectiva y la planificación estatal en un extremo a la propiedad privada y el libre mercado en el otro. Considera las dimensiones fundamentales de economía (propiedad de los medios de producción) y control (mercado frente a planificación y regulación).',
    socialLead: 'El eje social',
    socialText: 'mide la orientación de tus valores entre el progresismo y el tradicionalismo, y refleja tu posición sobre costumbres, cultura y valores sociales.'
  },
  compassWith: 'con valores sociales',
  compassSocialValues: '',
  compassCenterLeft: 'Centroizquierda',
  compassCenterRight: 'Centroderecha',
  compassSpectrumLabels: {
    'esq-radical': 'Izquierda radical',
    esquerda: 'Izquierda',
    centro: 'Centrista',
    direita: 'Derecha',
    'ext-direita': 'Extrema derecha',
    terceira: 'Tercera posición',
    libertario: 'Libertario',
    anarquismo: 'Anarquista'
  },
  compassSocialLabels: {
    veryProgressive: 'Muy progresistas',
    progressive: 'Progresistas',
    moderate: 'Moderados',
    traditional: 'Tradicionalistas',
    veryTraditional: 'Muy tradicionalistas'
  },
  compassNote: {
    label: 'En la brújula:',
    hints: {
      terceira: 'La tercera posición une un Estado fuerte con la nación y la tradición. La brújula mide economía y poder; nación, moral y religión quedan fuera.',
      'ext-direita': 'La extrema derecha se define por la jerarquía y la identidad. La brújula mide economía y poder; moral, religión y nación quedan fuera.',
      'esq-radical': 'La izquierda radical se define por la revolución y la colectivización. La brújula mide economía y poder; el proyecto revolucionario queda fuera.',
      libertarian: 'Tu ideología está en el límite entre dos regiones. La brújula mide economía y poder, y una pequeña diferencia en cualquiera de los dos decide de qué lado queda.',
      generic: 'La brújula mide 5 de los 12 ejes; los otros 7 quedan fuera.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `Tu posición: ${right}% hacia la derecha, ${authoritarian}% hacia lo autoritario y ${traditional}% hacia lo tradicionalista.`,
  countriesSectionTitle: 'Países más cercanos a ti',
  countryCurrentTab: 'Actuales',
  countryHistoricalTab: 'Históricos',
  countriesDistantTitle: 'Más alejados de ti',
  partiesSectionTitle: 'Partidos más cercanos a ti',
  partyCurrentTab: 'Partido activo',
  partyHistoricalTab: 'Partido histórico',
  partiesDistantTitle: 'Más alejados de ti',
  partyLogoAlt: (name) => `Símbolo de ${name}`,
  partyLogoUnavailable: 'Símbolo no disponible',
  personalitiesSectionTitle: 'Figuras más cercanas a ti',
  personalitiesByAreaTitle: 'También cerca de ti, por ámbito',
  dimensionsTitle: 'También cerca de ti, por dimensión de tu perfil',
  dimensionLabels: {
    political: 'Políticamente',
    social: 'Socialmente',
    economic: 'Económicamente',
  },
  booksEyebrow: 'Ve más allá',
  booksTitle: 'Lecturas recomendadas',
  booksTopLabel: 'La más cercana a ti',
  booksAuthorLabel: 'Autor',
  booksLead: 'Una obra de cada una de las figuras más cercanas a tus resultados.',
  booksWhy: (pct) => `${pct}% compatible`,
  booksYearBc: (year) => `${year} a. C.`,
  booksCta: 'Ver en Amazon',
  areasGeneralTitle: 'Las figuras más cercanas a tus resultados',
  areasSectionTitle: 'Las figuras más cercanas por ámbito',
  areasTabsAria: 'Cómo se agrupan las figuras',
  areasGeneralTab: 'Compatibilidad general',
  areasByAreaTab: 'Ámbito',
  exportCsv: 'Exportar hoja de cálculo',
  paywallTitle: 'Informe completo',
  paywallLead: 'Entiende cómo ves el mundo eje por eje, descubre qué país o región actual se parece más a ti y mucho más.',
  paywallUnlockTitle: 'Accede al resultado completo de tus opiniones políticas',
  paywallPreviewTitles: [
    'Análisis completo, eje por eje',
    'Donde más discrepas',
    'Tu gobierno ideal',
    'Tu línea del tiempo ideológica',
    '10 países o regiones para vivir'
  ],
  paywallModalTag: 'Tu informe completo',
  paywallModalTitle: 'Accede al resultado completo de tus opiniones políticas',
  paywallModalLead: 'Entiende cómo ves el mundo eje por eje, descubre qué país o región actual se parece más a ti y mucho más.',
  paywallPdfTitle: 'Llévate tu informe completo en PDF',
  paywallPdfLead: 'El análisis de los 12 ejes, tu gobierno ideal y los países para vivir, en un PDF para guardar y releer cuando quieras.',
  paywallIncludesTitle: 'Lo que desbloqueas:',
  paywallIncludes: [
    { lead: 'Tu gobierno ideal:', text: 'nueve cargos ocupados por personas que piensan como tú.' },
    { lead: 'A qué país mudarte:', text: 'los 10 países más cercanos a tus ideales.' },
    { lead: 'Donde más discrepas:', text: 'con la ideología, la figura y el país más cercanos a ti.' },
    { lead: 'Los 12 ejes, uno por uno:', text: 'qué revela cada una de tus posiciones, por qué se elogia y por qué se critica.' },
    { lead: 'Tu línea del tiempo:', text: 'quién pensaba como tú, de la Antigüedad al siglo XXI.' },
    { lead: 'Tu líder ideal por ámbito:', text: 'política, economía, filosofía y más.' },
    { lead: 'Ranking completo y PDF:', text: 'todo el catálogo en una hoja de cálculo y el informe para guardar.' }
  ],
  paywallOnce: 'pago único, sin suscripción',
  paywallBlockCta: {
    axes: 'Desbloquear mi análisis completo',
    disagree: 'Desbloquear mi informe completo',
    government: 'Desbloquear mi gobierno ideal',
    timeline: 'Desbloquear mi línea del tiempo',
    countries: 'Desbloquear mis 10 regiones'
  },
  paywallTeaser: {
    axisTag: 'Tu eje más llamativo',
    disagreeWith: (name) => `Los 3 ejes donde más te diferencias de ${name}.`,
    seats: ['Líder político', 'Vicelíder político', 'Responsable de Economía'],
    eras: ['Antigüedad', 'Edad Media'],
    topCountry: 'El más cercano hoy'
  },
  paywallInstant: 'Se desbloquea justo después del pago.',
  paywallGuarantee: 'Garantía de 14 días',
  paywallPayWith: 'Medios de pago: tarjetas, PayPal, Apple Pay, Google Pay y más, según tu país',
  paywallPrice: 'US$ 3.99',
  paywallCta: 'Desbloquear mi informe completo',
  paywallChecking: 'Confirmando tu pago...',
  paywallProblems: {
    denied: 'Este pago no corresponde a este resultado, o fue reembolsado.',
    unavailable: 'Servicio no disponible en este momento, inténtalo de nuevo en unos instantes.',
    timeout: 'El pago todavía no se ha confirmado.'
  },
  paywallRetry: 'Comprobar de nuevo',
  paywallOpening: 'Abriendo el pago...',
  paywallEmailLabel: 'Tu correo electrónico',
  paywallEmailPlaceholder: 'tu@ejemplo.com',
  paywallEmailInvalid: 'Escribe un correo electrónico válido.',
  unlockedTag: 'Pago confirmado',
  unlockedTitle: '¡Tu informe completo está desbloqueado!',
  unlockedLead: 'Ya puedes acceder a tu informe completo. Para abrirlo más tarde, guarda el enlace de acceso de abajo.',
  unlockedCta: 'Ver informe',
  unlockedCopy: 'Copiar enlace de acceso',
  unlockedCopied: '¡Enlace copiado!',
  areasLockedTitle: '¿Qué figura es la más compatible contigo en cada ámbito?',
  areasLockedText: 'Mira la figura más compatible contigo en política, economía, filosofía y los demás ámbitos.',
  areasLockedCta: 'Desbloquear mi informe completo',
  personalitiesDistantTitle: 'Más alejadas de ti',
  ideologyDistantTitle: 'La ideología más alejada de ti',
  phraseTitle: 'Una frase que te describe',
  aboutIdeology: (ideology) => `Sobre ${ideology}`,
  knowMoreAbout: (name) => `Saber más sobre ${name}`,
  showLess: 'Ver menos',
  matchTopKicker: 'Más compatible',
  dimensionsTitleShort: 'También cerca, por dimensión',
  phraseNote: (ideology) => `Así resumiría alguien de ${ideology} la sociedad que desea.`,
  signatureTitle: 'Lo que te distingue',
  signatureUnusualLabel: 'Tu posición más inusual',
  signatureCommonLabel: 'Tu posición más típica',
  signatureUnusualLead: (pole, percent) => `Te inclinas más hacia ${pole.toLowerCase()} que el ${Math.round(percent)}% de las ideologías del catálogo.`,
  signatureUnusualLeadMax: (pole) => `Ninguna ideología del catálogo se inclina tanto como tú hacia ${pole.toLowerCase()}.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Tu posición en ${axis} es intermedia. Aun así, eso te sitúa más hacia ${pole.toLowerCase()} que el ${Math.round(percent)}% de las ideologías del catálogo.`,
  signatureUnusualNote: (axis) => `De los 12 ejes, ${axis} es donde más te apartas del conjunto. Es el rasgo que te distingue.`,
  signatureCommonLead: (axis) => `Tu posición en ${axis} está casi exactamente en la mediana del catálogo.`,
  signatureCommonNote: (pole) => `Es terreno común. No te inclinas ni hacia ${pole.toLowerCase()} ni hacia el polo opuesto.`,
  signatureCommonNoteBalanced: (axis) => `Estás en el centro en ${axis}, y el catálogo también. Es donde tu perfil menos destaca.`,
  tensionLabel: 'Tu tensión interna',
  tensionCombo: (firstPole, secondPole) => `${firstPole} y ${secondPole} a la vez`,
  tensionRare: (count, total) => `Solo ${count} de las ${total} ideologías del catálogo mantienen ambas posiciones.`,
  tensionUnique: 'Ninguna ideología del catálogo mantiene ambas posiciones.',
  tensionExamples: (names) => `Afinidades más cercanas: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `En el catálogo, ${firstAxis} y ${secondAxis} suelen ir juntos. Tú inviertes ese patrón.`,
  signatureMedian: 'Mediana de las ideologías',
  signatureYou: 'Tú',
  signatureBigCap: (pole) => `de las ideologías se inclinan menos que tú hacia ${pole.toLowerCase()}.`,
  signatureAtMedian: 'En la mediana',
  signatureAtCentre: 'En el centro',
  tensionRareShort: (count, total) => `Solo ${count} de ${total} ideologías mantienen ambas posiciones.`,
  personalityCategories: {
    politico: 'Política',
    religioso: 'Religión',
    economista: 'Economía',
    filosofo: 'Filosofía',
    teorico: 'Teoría política',
    empresario: 'Negocios',
    intelectual: 'Vida intelectual',
    ativista: 'Activismo',
  },
  redoAnalysis: 'Repetir el análisis',
  share: 'Compartir',
  saveOrShare: 'Compartir resultado',
  generatingPng: 'Generando PNG...',
  sharePreviewTitle: 'Tu tarjeta de resultado',
  sharePreviewCompareTitle: 'Tarjeta de comparación',
  sharePreviewAlt: 'Vista previa de tu tarjeta de resultado para compartir',
  sharePreviewLoading: 'Generando la vista previa de tu tarjeta',
  generatingPdf: 'Generando PDF...',
  downloadPdf: 'Descargar PDF',
  downloadPdfFull: 'Descarga tu informe completo en PDF',
  report: {
    fileName: '12axes-informe',
    docLabel: 'Informe completo',
    profileEyebrow: 'Tu perfil ideológico',
    headerLabel: (ideology) => `Informe de perfil político · ${ideology}`,
    kpiCountry: 'País más cercano',
    kpiPersonality: 'Figura',
    kpiAxes: 'Ejes analizados',
    kpiAnswered: (count) => `${count} preguntas respondidas`,
    tocTitle: 'En este informe',
    generatedOn: (date) => `Generado el ${date}`,
    axesIntro: 'Tu posición en cada uno de los 12 ejes. La barra parte del centro (50%) y se extiende hacia el polo al que te inclinas; la insignia muestra la intensidad.',
    intensityLegend: 'Intensidad',
    intensityLevels: ['Equilibrado · hasta 57%', 'Inclinado · 58 a 72%', 'Fuerte · 73 a 87%', 'Muy fuerte · 88% o más'],
    alsoClose: 'También cerca, por dimensión de tu perfil',
    continued: 'continuación',
    areasIntro: 'Las figuras del catálogo cuyo perfil en los 12 ejes más se parece al tuyo.',
    booksIntro: 'Una obra de cada una de las figuras más cercanas a tus resultados.',
    aboutTitle: 'Sobre este informe',
    aboutText: '12 Axes compara tus respuestas con perfiles de ideologías, países y figuras en los mismos 12 ejes. La compatibilidad mide la cercanía entre perfiles; no es un diagnóstico científico ni una etiqueta definitiva. Tus respuestas no se almacenan.',
    ctaTitle: 'Repite el test o compártelo'
  },
  shareFilePrefix: '12axes-perfil',
  shareCountriesFilePrefix: '12axes-paises',
  shareCountriesTitle: 'Los países más cercanos a mi perfil | 12axes.vercel.app',
  shareCountriesMessage: (country, percent) =>
    `¡Mira los países más cercanos a mi perfil político en el Test Político 12 Axes!\n\n` +
    `🌎 País actual más compatible:\n` +
    `${country} - ${percent}% de compatibilidad\n\n` +
    `👉 Haz el test y descubre el tuyo:\nhttps://12axes.vercel.app/es`,
  shareCountriesCta: 'Compartir países cercanos',
  sharePersonalitiesCta: 'Compartir personalidades cercanas',
  sharePartiesCta: 'Compartir partidos cercanos',
  shareCompassCta: 'Compartir valores y brújula',
  shareGovernmentCta: 'Compartir gobierno ideal',
  shareTimelineCta: 'Compartir línea del tiempo',
  shareLivingCta: 'Compartir países para vivir',
  shareIdealGovernment: 'GOBIERNO IDEAL',
  shareTimeline: 'LÍNEA DEL TIEMPO',
  shareLiving: 'PAÍSES PARA VIVIR',
  shareBestEra: 'ÉPOCA MÁS COMPATIBLE',
  shareGovernmentFilePrefix: '12axes-gobierno-ideal',
  shareGovernmentTitle: 'Mi gobierno ideal | 12axes.vercel.app',
  shareGovernmentMessage: (leader) =>
    `¡Mira mi gobierno ideal en el Test Político 12 Axes!\n\n` +
    `🏛️ Líder político:\n${leader}\n\n` +
    `👉 Haz el test y arma el tuyo:\nhttps://12axes.vercel.app/es`,
  shareTimelineFilePrefix: '12axes-linea-del-tiempo',
  shareTimelineTitle: 'Mi línea del tiempo ideológica | 12axes.vercel.app',
  shareTimelineMessage: (era) =>
    `¡Mira mi línea del tiempo ideológica en el Test Político 12 Axes!\n\n` +
    `⏳ Época más compatible:\n${era}\n\n` +
    `👉 Haz el test y descubre la tuya:\nhttps://12axes.vercel.app/es`,
  shareLivingFilePrefix: '12axes-paises-para-vivir',
  shareLivingTitle: 'Los países donde viviría | 12axes.vercel.app',
  shareLivingMessage: (country, percent) =>
    `¡Mira los países donde me sentiría en casa, según el Test Político 12 Axes!\n\n` +
    `🌎 Más compatible:\n${country} - ${percent}% de compatibilidad\n\n` +
    `👉 Haz el test y descubre los tuyos:\nhttps://12axes.vercel.app/es`,
  shareNearbyPersonalities: 'PERSONALIDADES CERCANAS',
  shareNearbyParties: 'PARTIDOS CERCANOS',
  shareValuesCompass: 'VALORES Y BRÚJULA',
  sharePersonalitiesFilePrefix: '12axes-personalidades',
  sharePersonalitiesTitle: 'Las personalidades más cercanas a mi perfil | 12axes.vercel.app',
  sharePersonalitiesMessage: (name, percent) =>
    `¡Mira las personalidades más cercanas a mi perfil político en el Test Político 12 Axes!\n\n` +
    `👤 Personalidad más compatible:\n` +
    `${name} - ${percent}% de compatibilidad\n\n` +
    `👉 Haz el test y descubre las tuyas:\nhttps://12axes.vercel.app/es`,
  sharePartiesFilePrefix: '12axes-partidos',
  sharePartiesTitle: 'Los partidos más cercanos a mi perfil | 12axes.vercel.app',
  sharePartiesMessage: (name, percent) =>
    `¡Mira los partidos más cercanos a mi perfil político en el Test Político 12 Axes!\n\n` +
    `🏛️ Partido actual más compatible:\n` +
    `${name} - ${percent}% de compatibilidad\n\n` +
    `👉 Haz el test y descubre los tuyos:\nhttps://12axes.vercel.app/es`,
  shareCompassFilePrefix: '12axes-brujula',
  shareCompassTitle: 'Mis valores y mi brújula política | 12axes.vercel.app',
  shareCompassMessage: (ideology) =>
    `¡Mira mis valores y mi brújula política en el Test Político 12 Axes!\n\n` +
    `💡 Mi ideología:\n${ideology}\n\n` +
    `👉 Haz el test y descubre la tuya:\nhttps://12axes.vercel.app/es`,
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `¡Descubrí mi perfil ideológico en el Test Político 12 Axes!\n\n` +
    `💡 Ideología más compatible:\n` +
    `${ideology} - ${ideologyPct}% de compatibilidad\n\n` +
    `🌎 País/nación más compatible:\n` +
    `${country} - ${countryPct}% de compatibilidad\n\n` +
    `👤 Personalidad más compatible:\n` +
    `${personality} - ${personalityPct}% de compatibilidad\n\n` +
    `👉 Haz el test y comparte tu resultado:\nhttps://12axes.vercel.app/es`,
  progress: (current, total) => `Pregunta ${current} de ${total}`,
  progressDone: (percent) => `${percent}% completado`,
  archetypeHeader: 'Identificando tu arquetipo',
  archetypeStep: (current, total) => `${current} de ${total}`,
  progressAria: (percent) => `Progreso del test: ${percent}%`,
  answersAria: 'Opciones de respuesta',
  countryKicker: 'País más compatible',
  flagLabel: 'Bandera',
  flagHistoricLabel: 'Bandera / símbolo histórico',
  flagAlt: (label, name) => `${label} de ${name}`,
  flagUnavailable: 'Bandera no disponible',
  flagUnavailableAria: (name) => `Bandera no disponible para ${name}`,
  personalityKicker: 'Personalidad más compatible',
  portraitAlt: (name) => `Retrato de ${name}`,
  portraitUnavailableAria: (name) => `Retrato no disponible para ${name}`,
  compatibilityAria: (pct) => `Compatibilidad: ${pct} por ciento`,
  matchWord: 'match',
  compatibilityLevels: {
    veryHigh: 'Compatibilidad muy alta',
    high: 'Compatibilidad alta',
    medium: 'Compatibilidad media',
    low: 'Compatibilidad baja',
    veryLow: 'Compatibilidad muy baja'
  },
  shareTitle: 'Mi perfil ideológico | 12axes.vercel.app',
  shareTopMatch: 'Top match',
  shareCountry: 'País más compatible',
  sharePersonality: 'Personalidad',
  shareResultLabel: 'MI RESULTADO',
  shareMostCompatible: 'MÁS COMPATIBLE',
  shareYourAxes: 'TUS 12 EJES',
  shareOtherPersonalities: 'OTRAS PERSONALIDADES',
  shareNearbyCountries: 'PAÍSES CERCANOS',
  shareFooterCta: 'DESCUBRE TU PERFIL',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Apoya el proyecto',
  supportTitle: '',
  ossEyebrow: 'Código abierto',
  ossTitle: 'Un proyecto independiente y transparente',
  ossLead: 'No tienes que fiarte de nuestra palabra. El código de 12 Axes es público: puedes ver cómo se puntúa cada respuesta, cómo se calcula la compatibilidad y de dónde salen los perfiles.',
  ossCards: [
    { title: 'Independiente', text: 'Sin vínculos con partidos, gobiernos ni campañas. Nadie paga por aparecer en tu resultado.' },
    { title: 'Auditable', text: 'La puntuación de las respuestas y el cálculo de compatibilidad están en el código, sin cajas negras.' },
    { title: 'Verificable', text: 'Las preguntas, ideologías, países y personalidades se guardan en archivos versionados con historial público.' },
    { title: 'Colaborativo', text: '¿Encontraste una pregunta sesgada o un perfil inexacto? Abre un issue o envía un pull request.' }
  ],
  ossBarText: 'Lee el código, audita los datos y contribuye en GitHub.',
  ossGithubCta: 'Ver en GitHub',
  footerRights: '© 2026. Todos los derechos reservados',
  footerProject: 'Proyecto',
  footerExplore: 'Explorar',
  footerAbout: 'Acerca de',
  footerContribute: 'Contribuir',
  footerLicense: 'Licencia',
  footerFullReport: 'Informe completo',
  footerTerms: 'Términos de uso',
  footerPrivacy: 'Privacidad',
  footerRefund: 'Reembolso',
  footerReport: 'Informe',
  supportTitleEm: 'Apoya',
  supportLead:
    '12 Axes es independiente y gratuito. Si el test te ayudó a entender mejor tu ideología política, considera donar por Pix o con criptomonedas para ayudar a mantener el proyecto.',
  supportPrivacyNote: 'No recopilamos datos. Para donar sin identificarte, usa criptomonedas.',
  supportCopy: 'Copiar',
  supportCopied: '¡Copiado!',
  supportCopyAria: (label) => `Copiar dirección de ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Clave aleatoria',
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
