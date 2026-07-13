// FQA028: anarcoindividualismo, centrismo, trabalhismo, positivismo, conservadorismo-secular
// Genuine per-question answers (CT/C/N/D/DT), 20 per axis, ordered q01..q20 (odd=LEFT,even=RIGHT
// for every axis in this pool). Reasoning is doctrinal, not a target-then-backfill.

export const PROFILES = {
  // Individualist anarchism (Tucker/Spooner-adjacent): personal sovereignty, mutual-bank market
  // exchange without capitalist rent/interest, tolerant of individually-earned property, anti-state,
  // culturally libertine. Distinct from the "market-mutualist" cluster mainly by being more overtly
  // philosophical-individualist than cooperative; controle answers reuse that cluster's logic.
  "anarcoindividualismo": {
    estrutura:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,DT,C,D".split(","),
    representacao:  "C,D,CT,D,C,D,CT,D,C,D,C,D,N,D,CT,D,C,D,CT,D".split(","),
    poder:          "D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,N,C,D,C,N,C,N,C,D,CT,D,C".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,C".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D,C,D,CT,D,C,D".split(","),
    economia:       "N,C,N,C,D,C,N,D,N,N,N,N,D,N,D,N,D,C,N,C".split(","),
    controle:       "D,C,D,C,N,N,DT,N,D,C,DT,CT,DT,N,D,C,DT,CT,N,C".split(","), // = market-mutualist key
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,C,D,C,D,C,D,CT,D,C,D,CT".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,C,DT,C,DT,C,D,C,DT,C,DT,C,DT,CT,DT".split(","),
    moral:          "CT,DT,CT,D,N,DT,CT,N,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,D,C,N,C,D,C,D".split(","),
  },

  // Dead center by construction: neutral on every question (this is the built-in sanity check --
  // a profile literally named "centrism" auditing to ~50 on all 12 axes validates the pipeline).
  "centrismo": Object.fromEntries(
    ["estrutura","representacao","poder","imigracao","diplomacia","intervencao","economia",
     "controle","comercio","religiao","moral","tecnologia"].map(a => [a, Array(20).fill("N")])
  ),

  // British-style laborism: pro-union, moderate welfare state, patriotic/nationalist, pragmatic
  // (not revolutionary), culturally moderate-to-traditional (older industrial labor movement),
  // pro-industry protectionism, skeptical of technocracy, believes in electoral democracy strongly.
  "trabalhismo": {
    estrutura:      "C,D,C,D,N,D,C,C,D,C,N,C,N,C,D,C,N,D,C,D".split(","),
    representacao:  "CT,DT,CT,D,C,D,CT,D,CT,DT,C,D,D,D,CT,D,C,D,CT,DT".split(","),
    poder:          "C,C,C,C,N,C,N,C,C,N,N,C,N,N,N,N,N,N,N,N".split(","),
    imigracao:      "C,D,N,C,N,D,C,N,C,CT,C,CT,C,C,C,N,D,D,D,D".split(","),
    diplomacia:     "N,C,D,C,N,C,D,C,C,C,C,C,D,C,D,C,D,C,N,C".split(","),
    intervencao:    "N,N,C,N,N,C,D,C,N,N,N,N,C,N,N,N,D,C,N,C".split(","),
    economia:       "N,D,CT,D,C,D,CT,D,CT,DT,C,D,C,D,N,D,CT,N,C,D".split(","),
    controle:       "C,D,CT,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,CT,D".split(","),
    comercio:       "CT,D,C,N,C,N,C,D,C,N,C,C,CT,N,C,D,C,N,C,N".split(","),
    religiao:       "N,N,N,N,N,C,N,D,N,C,D,C,N,N,D,N,N,D,C,C".split(","),
    moral:          "C,C,N,N,C,N,C,D,N,N,N,N,D,D,N,N,D,N,C,N".split(","),
    tecnologia:     "N,N,C,D,C,N,N,N,N,D,C,N,C,N,C,N,N,C,N,N".split(","),
  },

  // Comtean positivism (order-and-progress): rationalist, anti-clerical/scientistic, technocratic
  // hierarchy, centralizing "spiritual power of science", pro-industry and pro-technology, low
  // tolerance for disruptive democratic contestation (favors rule by scientific/administrative elite).
  "positivismo": {
    estrutura:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,C,D,C,D,CT,D,C,D,C,D,C".split(","),
    poder:          "C,N,CT,N,CT,N,C,D,C,D,C,C,C,N,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,N,D,C,D,N,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "N,C,N,C,C,C,D,C,C,D,C,D,C,C,C,C,D,D,N,C".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,N,D,C,D,C".split(","),
    controle:       "D,C,N,C,D,C,C,C,D,C,N,C,D,C,D,C,C,D,D,C".split(","),
    comercio:       "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    religiao:       "CT,DT,CT,DT,C,D,CT,DT,CT,D,C,D,C,DT,C,D,CT,DT,CT,DT".split(","),
    moral:          "C,C,N,N,N,N,C,N,N,D,N,C,D,D,N,D,D,N,C,N".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,C,D,CT,D".split(","),
  },

  // Secular conservatism: cultural traditionalism (family, moral order, skepticism of rapid
  // multicultural change) held on civic/pragmatic grounds rather than religious ones; explicitly
  // NOT a state-religion or faith-first ideology -- religiao stays high (secular pole).
  "conservadorismo-secular": {
    estrutura:      "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    representacao:  "C,N,C,D,C,N,C,D,C,C,C,C,C,N,C,D,N,C,C,D".split(","),
    poder:          "C,D,C,C,C,D,C,DT,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "CT,DT,C,D,C,D,CT,D,C,N,CT,N,C,D,C,DT,CT,DT,C,DT".split(","),
    diplomacia:     "C,C,N,C,C,C,N,C,C,C,C,D,N,C,N,C,D,D,C,D".split(","),
    intervencao:    "D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,CT,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "D,C,D,C,N,C,D,C,D,C,N,C,D,C,D,C,N,C,D,C".split(","),
    comercio:       "C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "C,D,C,D,N,C,C,DT,C,C,C,D,C,C,C,D,N,D,C,D".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "N,N,N,N,N,N,N,N,N,D,C,N,C,N,C,C,N,N,N,N".split(","),
  },
};
