// FQA029: progressismo-cristao, autoritarismo-modernizador, desenvolvimentismo-de-estado,
// atlantismo, federalismo-privado

export const PROFILES = {
  // Christian left / liberation-theology adjacent: pro-poor, communitarian, faith-rooted (not
  // secular), pro-democracy, anti-militarist, environmentally sympathetic, culturally moderate
  // (compassionate but not libertine -- family/community language stays present).
  "progressismo-cristao": {
    estrutura:      "C,D,C,D,C,D,C,D,N,D,C,D,N,D,C,D,C,D,N,D".split(","),
    representacao:  "CT,DT,CT,D,C,D,CT,D,CT,DT,CT,DT,C,D,CT,DT,C,D,CT,DT".split(","),
    poder:          "N,C,N,C,D,C,D,DT,C,N,D,C,N,C,D,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,D,C,N,C,D,CT,D,CT,C,C,C,C,D,D,D,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,DT,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "C,D,N,D,CT,DT,C,DT,C,D,D,N,C,DT,C,N,D,N,CT,DT".split(","),
    comercio:       "C,D,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "D,C,D,C,N,C,D,N,D,C,D,C,D,C,D,C,D,C,D,CT".split(","),
    moral:          "C,C,C,N,C,D,C,N,N,N,C,N,N,N,C,D,N,N,C,N".split(","),
    tecnologia:     "N,N,N,C,N,CT,C,CT,N,CT,N,CT,N,C,N,CT,N,C,D,C".split(","),
  },

  // Developmental-dictatorship modernizer (Park Chung-hee / Pinochet-Chicago hybrid): authoritarian
  // politically, orderly, nationalist, industrial-technocratic, uses the state to jump-start
  // capitalism then leans market -- suppresses dissent in the name of growth, embraces technology.
  "autoritarismo-modernizador": {
    estrutura:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,CT,D,C,D,CT,D,C,D,C,D,C".split(","),
    poder:          "CT,N,CT,D,CT,D,CT,D,C,D,CT,C,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "C,D,N,C,D,C,C,C,C,D,C,C,D,C,C,D,C,D,D,C".split(","),
    comercio:       "C,D,C,N,C,N,C,D,C,N,C,C,C,C,C,D,C,N,C,D".split(","),
    religiao:       "C,N,C,N,N,C,N,D,C,C,C,D,N,C,C,D,C,D,C,C".split(","),
    moral:          "D,C,N,C,D,C,D,N,N,N,D,C,D,C,D,N,D,C,D,C".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D".split(","),
  },

  // Vargas-style state developmentalism (ISI): state-guided industrialization, protectionist
  // nationalism, corporatist labor pacts, moderate authoritarian streak but not a full dictatorship,
  // pro-industry/pro-tech, redistributive within a nationalist-capitalist frame.
  "desenvolvimentismo-de-estado": {
    estrutura:      "D,CT,D,CT,D,C,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,D,CT".split(","),
    representacao:  "C,C,D,C,C,C,C,C,C,C,C,C,D,C,C,C,C,C,C,C".split(","),
    poder:          "C,N,C,D,C,D,C,D,C,N,C,C,C,N,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,C,N,C,C,C,C,C,C,D,C,D,C,C,C,C,D,D,N,C".split(","),
    intervencao:    "D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,N,C,D".split(","),
    controle:       "CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "N,N,N,N,N,C,N,D,N,C,D,C,N,N,D,N,N,D,C,C".split(","),
    moral:          "D,C,N,C,N,N,D,N,N,D,D,C,D,C,D,N,D,C,D,C".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,D".split(","),
  },

  // Atlanticism: pro-Western/NATO alliance orientation, prefers acting through the alliance over
  // unilateral nationalism (low intervencao independence, high diplomacia deterrence-within-alliance),
  // liberal-market economically, pro-democracy, pro-technology, moderate on culture.
  "atlantismo": {
    estrutura:      "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    representacao:  "CT,D,C,D,C,D,CT,D,C,D,C,D,D,D,CT,D,C,D,CT,DT".split(","),
    poder:          "C,C,C,C,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,N,CT,D,CT,C,C,C,C,D,D,D,C".split(","),
    diplomacia:     "CT,C,C,D,C,C,D,C,C,D,C,D,C,C,C,C,DT,C,CT,C".split(","),
    intervencao:    "D,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,C,D,CT,D,C".split(","),
    economia:       "D,CT,D,C,D,CT,D,C,D,C,N,C,D,C,D,C,D,CT,D,C".split(","),
    controle:       "D,C,N,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,CT,D,CT".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:       "C,D,C,D,N,C,C,D,C,C,C,D,C,C,C,D,N,D,C,C".split(","),
    moral:          "C,D,C,D,N,D,C,N,N,D,N,D,N,N,N,D,D,N,C,N".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,D,C,D,C,N,C,D,C,N,C,D".split(","),
  },

  // "Private federalism" / network-state style: extreme decentralization into private-law
  // governance zones, market-anarchist economically, skeptical of universal-suffrage democracy
  // (prefers contractual/exit-based legitimacy), pro-technology, low intervencao (no permanent
  // national projects at all, everything is voluntary/contractual).
  "federalismo-privado": {
    estrutura:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao:  "N,C,C,D,N,C,N,D,C,C,C,N,CT,C,N,C,CT,D,N,D".split(","),
    poder:          "D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT".split(","),
    imigracao:      "D,C,N,C,D,C,D,C,N,C,D,C,N,C,D,N,D,CT,D,C".split(","),
    diplomacia:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    intervencao:    "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    economia:       "DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT".split(","),
    controle:       "DT,CT,D,CT,D,CT,DT,C,D,CT,DT,CT,DT,CT,D,C,DT,CT,D,CT".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:       "C,D,C,D,N,C,C,D,C,C,C,D,C,C,C,D,N,D,C,D".split(","),
    moral:          "C,D,C,D,N,D,C,N,C,D,C,D,N,D,C,DT,C,D,C,D".split(","),
    tecnologia:     "CT,DT,CT,D,C,N,C,N,CT,N,CT,D,C,D,CT,D,C,D,CT,D".split(","),
  },
};
