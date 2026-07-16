// FQA032: populismo-libertario, teocratismo-cristao, socialismo-titoista, socialismo-anticolonial,
// socialismo-juche

export const PROFILES = {
  // Libertarian populism (Ron Paul / Milei-style): anti-establishment, radical free-market,
  // distrust of institutions/media/central banks, assimilationist-skeptical-of-open-immigration
  // populist strain (not the cosmopolitan wing of libertarianism), anti-interventionist abroad.
  "populismo-libertario": {
    estrutura:      "CT,D,CT,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    representacao:  "CT,D,CT,D,C,D,CT,D,C,D,C,D,C,D,CT,D,CT,D,C,D".split(","),
    poder:          "D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,C".split(","),
    intervencao:    "CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT".split(","),
    controle:       "DT,CT,D,CT,D,CT,DT,C,D,CT,DT,CT,DT,CT,D,C,DT,CT,D,CT".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,C,D,C,D,C,D,CT,D,C,D,C".split(","),
    religiao:       "C,D,C,D,N,C,C,D,C,C,C,D,C,C,C,D,N,D,C,D".split(","),
    moral:          "C,D,C,D,N,D,C,N,N,D,C,D,N,D,N,DT,C,D,C,D".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,D,C,N,C,D,C,N,C,D".split(","),
  },

  // Christian theocracy: rule by religious law, low representacao (religious authority outranks
  // popular vote), maximal religiosity and moral traditionalism, morals-focused authoritarianism,
  // economic system is secondary/mixed.
  "teocratismo-cristao": {
    estrutura:      "N,C,N,C,D,C,N,C,D,C,N,C,D,C,N,C,D,C,D,C".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,CT,D,C,D,CT,D,C,D,C,D,CT".split(","),
    poder:          "C,D,C,D,C,D,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "CT,DT,C,D,C,D,CT,D,C,N,CT,N,C,D,C,DT,CT,DT,C,DT".split(","),
    diplomacia:     "C,D,C,D,C,D,N,C,C,D,C,D,C,C,C,D,D,D,C,D".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    controle:       "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    comercio:       "C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    moral:          "DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    tecnologia:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
  },

  // Titoism: worker self-management market-socialism (unusual for the bloc), federal multi-republic
  // decentralization, non-aligned foreign policy (between blocs, not neutral-pacifist), one-party
  // state but less totalitarian than the Soviet model.
  "socialismo-titoista": {
    estrutura:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    representacao:  "D,C,C,C,D,C,C,D,D,C,C,D,D,C,D,C,C,C,C,D".split(","),
    poder:          "C,C,C,D,C,D,C,D,C,N,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,C,D,C,C,C,D,C,C,D,C,D,C,C,C,C,D,D,N,C".split(","),
    intervencao:    "C,D,C,D,C,D,D,C,C,D,C,D,C,D,C,D,C,D,D,D".split(","),
    economia:       "C,D,CT,D,C,D,C,D,C,D,C,D,CT,D,C,D,C,N,C,D".split(","),
    controle:       "C,D,C,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,C,D".split(","),
    comercio:       "C,C,C,C,C,C,C,D,C,C,C,C,C,C,C,D,C,C,C,C".split(","),
    religiao:       "C,D,C,N,N,C,C,D,C,C,D,C,C,C,D,C,N,D,C,C".split(","),
    moral:          "C,C,N,N,N,N,C,N,N,D,N,N,N,D,N,N,D,N,C,N".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,D".split(","),
  },

  // Anti-colonial / Third-Worldist socialism (Nkrumah/Fanon-adjacent): anti-imperialist, nationalist
  // sovereignty, collectivist economically, anti-Western, non-aligned/pan-regional solidarity,
  // moderate authoritarian centralization typical of post-liberation single-party states.
  "socialismo-anticolonial": {
    estrutura:      "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    representacao:  "D,C,C,C,D,C,C,D,C,C,C,C,D,C,D,D,C,C,C,C".split(","),
    poder:          "C,N,C,D,C,D,C,D,C,N,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "CT,DT,C,DT,C,D,CT,D,C,D,CT,D,CT,D,C,DT,CT,DT,C,DT".split(","),
    diplomacia:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "C,D,C,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    moral:          "C,C,N,N,C,N,C,N,N,D,C,D,N,D,N,N,D,N,C,N".split(","),
    tecnologia:     "D,C,D,D,D,C,C,C,D,C,D,D,C,D,C,D,D,D,D,D".split(","),
  },

  // Juche (North Korea): total self-reliance/autarky, extreme authoritarian personality-cult state,
  // maximal surveillance/control, closed militarized economy, anti-globalization to the point of
  // total isolation, quasi-religious reverence for the leader/ideology substituting for religion.
  "socialismo-juche": {
    estrutura:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    representacao:  "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    poder:          "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,C,DT,CT,DT,CT,DT".split(","),
    diplomacia:     "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:    "C,D,C,D,D,C,D,D,CT,D,C,D,C,D,C,D,C,D,C,D".split(","),
    economia:       "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:       "CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,C,D,CT,D,CT,DT".split(","),
    comercio:       "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:       "D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "N,N,N,D,D,C,N,C,N,C,D,D,D,D,N,D,D,D,D,D".split(","),
  },
};
