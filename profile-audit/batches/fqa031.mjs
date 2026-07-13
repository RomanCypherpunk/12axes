// FQA031: nacionalismo-progressista, ecofascismo, comunismo-agrario, socialismo-bolivariano,
// nacional-desenvolvimentismo

export const PROFILES = {
  // Progressive nationalism: redistributive/collectivist economically, culturally progressive,
  // but nationalist on sovereignty/trade (protectionist, wary of foreign entanglement), retains
  // real electoral democracy.
  "nacionalismo-progressista": {
    estrutura:      "C,D,C,D,N,D,C,C,D,C,N,C,N,C,D,C,N,D,C,D".split(","),
    representacao:  "CT,D,CT,D,C,D,CT,D,CT,D,C,D,N,D,CT,D,C,D,CT,D".split(","),
    poder:          "N,C,N,C,D,C,D,DT,C,N,D,C,N,C,D,C,D,C,D,C".split(","),
    imigracao:      "C,D,N,C,C,D,C,D,C,CT,C,C,C,C,C,C,D,D,C,D".split(","),
    diplomacia:     "C,C,D,C,C,C,C,C,C,D,C,D,C,C,C,C,D,D,C,D".split(","),
    intervencao:    "D,C,D,C,D,C,D,CT,D,C,D,C,D,CT,D,C,D,CT,D,C".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "C,D,C,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "C,D,C,N,N,C,C,D,C,C,D,C,C,C,D,C,N,D,C,C".split(","),
    moral:          "CT,D,CT,N,CT,D,CT,N,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "C,N,C,D,C,C,C,C,C,C,C,D,C,D,C,D,C,D,C,D".split(","),
  },

  // Eco-fascism: ultranationalist authoritarian fused with "blood and soil" radical
  // environmentalism -- tech-skeptical (contrast tecno-fascismo), anti-industrial, racially
  // exclusionary, militarist.
  "ecofascismo": {
    estrutura:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    representacao:  "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    poder:          "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "CT,DT,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT".split(","),
    diplomacia:     "CT,D,CT,D,C,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:    "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    economia:       "D,C,D,C,D,C,C,D,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "C,D,C,D,D,C,C,D,C,D,C,C,D,C,C,D,C,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "N,C,N,C,N,C,N,D,N,C,D,C,N,C,N,D,N,C,N,C".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
  },

  // Agrarian communism (peasant-collectivist, Khmer-Rouge-adjacent generic): extreme collectivized
  // property, anti-industrial and anti-urban, authoritarian, autarkic/anti-trade, deeply
  // anti-technology (radical ruralism as ideology, not conservation).
  "comunismo-agrario": {
    estrutura:      "N,D,N,D,D,C,N,D,D,C,N,D,D,C,N,D,N,D,D,C".split(","),
    representacao:  "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    poder:          "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "CT,DT,C,DT,CT,D,CT,DT,C,D,CT,D,CT,D,C,DT,CT,DT,C,DT".split(","),
    diplomacia:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:       "CT,DT,C,DT,CT,DT,CT,DT,CT,DT,C,N,CT,DT,C,N,CT,N,CT,DT".split(","),
    comercio:       "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:       "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    moral:          "D,CT,D,C,D,C,D,C,D,DT,D,DT,D,C,D,N,D,CT,D,C".split(","),
    tecnologia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
  },

  // Chavismo / Bolivarianism: populist-authoritarian left, personalist leadership eroding formal
  // democracy, state-oil-economy collectivism, anti-imperialist/anti-US, protectionist, culturally
  // moderate (popular Catholic-influenced culture, not theocratic).
  "socialismo-bolivariano": {
    estrutura:      "N,C,N,C,D,C,N,C,D,C,N,C,N,C,D,C,N,C,N,C".split(","),
    representacao:  "C,C,D,C,C,C,C,D,C,C,C,C,D,C,D,D,C,C,C,C".split(","),
    poder:          "C,C,C,C,C,D,C,D,C,N,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    intervencao:    "C,C,C,C,C,C,C,C,C,C,D,C,C,C,D,C,D,C,C,C".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    religiao:       "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    moral:          "C,C,N,N,C,N,C,N,N,D,C,D,N,D,N,N,D,N,C,N".split(","),
    tecnologia:     "N,N,N,D,N,C,N,C,N,C,N,D,N,D,C,D,N,D,N,D".split(","),
  },

  // National developmentalism: nationalist ISI (import-substitution) industrialization -- more
  // explicitly nationalist/protectionist than "desenvolvimentismo-de-estado", moderate
  // authoritarian streak, moderate electoral legitimacy, pro-industry/tech.
  "nacional-desenvolvimentismo": {
    estrutura:      "D,C,D,C,D,C,D,CT,D,CT,D,C,D,C,D,C,D,CT,D,C".split(","),
    representacao:  "C,C,D,C,C,C,C,C,C,C,C,C,D,C,C,C,C,C,C,C".split(","),
    poder:          "C,N,C,D,C,D,C,D,C,N,C,C,C,N,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,C,N,C,C,C,C,C,C,D,C,D,C,C,C,C,D,D,N,C".split(","),
    intervencao:    "C,C,C,C,D,C,D,C,C,C,D,C,D,C,D,C,D,C,C,C".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,C,D,C,D,C,D,C,D,CT,N,C,D".split(","),
    controle:       "CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "N,N,N,N,N,C,N,D,N,C,D,C,N,N,D,N,N,D,C,C".split(","),
    moral:          "D,C,N,C,N,N,D,N,N,D,D,C,D,C,D,N,D,C,D,C".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,D".split(","),
  },
};
