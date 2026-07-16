// FQA033: tecno-comunismo, tecno-anarquismo, tecno-cristianismo, populismo-de-direita,
// populismo-de-esquerda

export const PROFILES = {
  // Fully-automated-luxury-communism style: maximal collectivized ownership fused with maximal
  // tech embrace (automation abolishes scarcity), vanguard-planned rather than liberal-democratic,
  // still nominally egalitarian in spirit.
  "tecno-comunismo": {
    estrutura:      "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,C,D,C,D,CT,D,C,D,C,D,C".split(","),
    poder:          "C,N,C,D,C,D,C,D,C,D,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "D,C,D,C,N,C,D,C,N,CT,D,CT,C,C,C,C,D,C,D,C".split(","),
    diplomacia:     "N,C,D,C,N,C,D,C,C,C,C,C,D,C,D,C,D,C,N,C".split(","),
    intervencao:    "N,C,N,C,N,C,D,C,N,N,N,N,C,N,N,N,D,C,N,C".split(","),
    economia:       "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:       "CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,C,D,CT,D,CT,DT".split(","),
    comercio:       "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,D,N,C,N,C".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,C,DT,CT,DT,C,DT,C,DT,C,DT,CT,DT,CT,DT".split(","),
    moral:          "CT,D,C,N,CT,D,CT,N,C,D,CT,D,C,D,C,DT,C,D,CT,D".split(","),
    tecnologia:     "CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT".split(","),
  },

  // Techno-anarchism: decentralized-tech-enabled non-state coordination (DAOs/commons/open-source
  // ethos rather than either capitalist markets or state planning) -- anti-state, pro-tech,
  // moderately collectivist economically (commons > private capital, but not centrally planned).
  "tecno-anarquismo": {
    estrutura:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao:  "C,D,CT,D,C,D,CT,D,C,D,C,D,C,D,CT,D,CT,D,C,D".split(","),
    poder:          "D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,N,C,D,C,N,C,N,C,D,CT,D,C".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,C".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,C,D,C,D,C,D,C,D,N,D,C,D,N,D,C,C,C,D".split(","),
    controle:       "C,D,N,D,C,D,C,D,C,D,D,C,C,D,C,N,D,C,C,D".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,C,D,C,D,C,D,CT,D,C,D,CT".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,C,DT,CT,DT,C,D,C,DT,C,DT,CT,DT,CT,DT".split(","),
    moral:          "CT,D,CT,D,N,DT,CT,N,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
  },

  // Christian transhumanism / tech-accelerationism fusion: technology embraced as extension of
  // divine "dominion" mandate, while remaining religiously conservative and morally traditionalist
  // -- an unusual but coherent hybrid (tech-optimist means, traditionalist ends).
  "tecno-cristianismo": {
    estrutura:      "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    representacao:  "C,C,C,D,C,N,C,D,C,C,C,C,D,C,C,D,N,C,C,D".split(","),
    poder:          "C,D,C,C,C,D,C,DT,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "CT,DT,C,D,C,D,CT,D,C,N,CT,N,C,D,C,DT,CT,DT,C,DT".split(","),
    diplomacia:     "C,C,N,C,C,C,N,C,C,C,C,D,N,C,N,C,D,D,C,D".split(","),
    intervencao:    "D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,CT,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "D,C,D,C,N,C,D,C,D,C,N,C,D,C,D,C,N,C,D,C".split(","),
    comercio:       "C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "DT,CT,DT,CT,C,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D".split(","),
  },

  // Right populism (Trump/Bolsonaro style): nationalist, anti-immigration, morally conservative,
  // anti-establishment/anti-institution rhetoric, economically mixed (nationalist-protectionist
  // more than doctrinaire free-market), moderately authoritarian instincts.
  "populismo-de-direita": {
    estrutura:      "N,C,N,C,N,C,N,CT,N,CT,D,C,N,C,N,C,N,CT,N,C".split(","),
    representacao:  "D,CT,C,C,D,CT,C,C,D,C,C,C,D,C,C,C,C,C,C,C".split(","),
    poder:          "C,C,C,C,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "CT,DT,C,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT".split(","),
    diplomacia:     "C,D,C,D,C,D,N,C,C,D,C,D,N,C,C,C,D,D,C,C".split(","),
    intervencao:    "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    economia:       "N,C,N,C,D,C,N,C,D,C,N,C,D,C,N,D,N,C,C,C".split(","),
    controle:       "C,D,C,C,N,C,C,C,N,D,C,C,D,C,N,D,C,D,N,C".split(","),
    comercio:       "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "D,C,D,C,D,CT,D,C,D,CT,DT,CT,D,CT,DT,C,D,C,D,CT".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "N,N,N,N,N,N,N,N,N,D,C,N,C,N,C,N,N,N,N,N".split(","),
  },

  // Left populism (Podemos/Mélenchon style): anti-elite/anti-technocracy, redistributive
  // economically, economic-sovereignty nationalism (against globalized finance/EU-style
  // technocracy) paired with culturally progressive values, pro-participatory-democracy
  // (not authoritarian -- populist against elites, not against voting).
  "populismo-de-esquerda": {
    estrutura:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    representacao:  "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    poder:          "N,C,N,C,D,C,D,DT,C,N,D,C,N,C,D,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,D,CT,D,C,C,C,D,C,D,D,D,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "CT,D,C,D,CT,DT,C,DT,C,D,D,N,C,DT,C,N,D,N,CT,DT".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "C,D,C,N,N,C,C,D,C,C,D,C,C,C,D,C,N,D,C,C".split(","),
    moral:          "CT,D,CT,N,CT,D,CT,N,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "N,N,C,D,N,C,C,C,N,C,N,D,C,D,C,D,N,D,N,D".split(","),
  },
};
