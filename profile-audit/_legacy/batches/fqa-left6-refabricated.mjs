// Re-derivation of the 6 non-anarchist profiles that were also target-fabricated this morning
// (record-target-value-batch.mjs) but were not part of the anti-statist premise-conflict cluster:
// socialismo-cristao, trabalhismo-cristao, socialismo-religioso, social-democracia, socialismo,
// socialismo-liberal. Genuine per-question answers, all 12 axes.

export const PROFILES = {
  // Christian socialism (social-gospel tradition, "held all things in common"): faith-driven
  // redistribution, pro-poor, communitarian/grassroots, strongly pro-democracy (dignity of every
  // person), pacifist, compassionate-not-punitive on crime/drugs, welcoming of the stranger,
  // family-grounded but not harsh on culture-war issues, cautious-but-not-hostile to tech.
  "socialismo-cristao": {
    estrutura:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    representacao:  "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,C,DT,CT,DT,C,DT,CT,DT".split(","),
    poder:          "D,C,D,C,D,C,D,DT,C,D,D,C,N,C,DT,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,D,CT,D,CT,C,CT,D,C,D,D,D,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,DT,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "C,D,N,D,CT,DT,C,DT,C,D,D,N,C,DT,C,N,D,N,CT,DT".split(","),
    comercio:       "C,D,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "DT,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT".split(","),
    moral:          "C,C,C,N,C,D,C,N,N,N,C,N,N,N,C,D,N,N,C,N".split(","),
    tecnologia:     "N,N,N,C,N,CT,C,CT,N,CT,N,C,N,C,N,C,N,C,D,C".split(","),
  },

  // Christian labourism (Christian-Democratic labor wing / church-affiliated trade unionism):
  // similar moral grounding to Christian socialism but institutional, patriotic, pro-union welfare
  // state rather than radical redistribution, moderate on crime, family-values moral centrism.
  "trabalhismo-cristao": {
    estrutura:      "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    representacao:  "CT,D,CT,D,C,D,CT,D,CT,D,C,D,D,D,CT,D,C,D,CT,DT".split(","),
    poder:          "C,C,C,C,N,C,N,D,C,N,N,C,N,N,D,N,C,N,C,N".split(","),
    imigracao:      "C,D,N,C,N,D,C,N,C,CT,C,CT,C,C,C,N,D,D,D,D".split(","),
    diplomacia:     "N,C,D,C,N,C,D,C,C,C,C,C,D,C,D,C,D,C,N,C".split(","),
    intervencao:    "N,N,C,N,N,C,D,C,N,N,N,N,C,N,N,N,D,C,N,C".split(","),
    economia:       "N,D,CT,D,C,D,CT,D,CT,DT,C,D,C,D,N,D,CT,N,C,D".split(","),
    controle:       "C,D,CT,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,CT,D".split(","),
    comercio:       "CT,D,C,N,C,N,C,D,C,N,C,C,CT,N,C,D,C,N,C,N".split(","),
    religiao:       "DT,CT,D,CT,D,C,D,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT".split(","),
    moral:          "C,C,N,N,C,N,C,D,N,N,N,N,D,D,N,N,D,N,C,N".split(","),
    tecnologia:     "N,N,C,D,C,N,N,N,N,D,C,N,C,N,C,N,N,C,N,N".split(","),
  },

  // Generic religious socialism (faith-grounded egalitarianism, broader than one confession):
  // similar to Christian socialism but slightly less pacifist/institutional, more purely
  // redistributive-communitarian, still low religiao and moderate-traditional moral centrism.
  "socialismo-religioso": {
    estrutura:      "C,D,C,D,C,D,C,D,N,D,C,D,C,D,C,D,C,D,N,D".split(","),
    representacao:  "CT,DT,CT,D,C,D,CT,D,CT,DT,CT,D,C,DT,CT,DT,C,DT,CT,DT".split(","),
    poder:          "D,C,D,C,D,C,D,DT,C,D,D,C,N,C,DT,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,N,C,D,C,D,CT,D,CT,C,CT,D,C,D,D,D,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,DT,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "C,D,N,D,CT,DT,C,DT,C,D,D,N,C,DT,C,N,D,N,CT,DT".split(","),
    comercio:       "C,D,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "DT,CT,D,CT,D,C,DT,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT".split(","),
    moral:          "C,C,C,N,C,D,C,N,N,N,C,N,N,N,C,D,N,N,C,N".split(","),
    tecnologia:     "N,N,N,C,N,CT,C,CT,N,CT,N,C,N,C,N,C,N,C,D,C".split(","),
  },

  // Nordic-style social democracy: market economy disciplined by a strong universal welfare
  // state (not nationalization), strongly pro-democratic institutions, secular, culturally
  // progressive, internationalist-peaceful, moderately open to trade, pro-technology.
  "social-democracia": {
    estrutura:      "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,N,C,D,C".split(","),
    representacao:  "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,C,DT,CT,DT,C,DT,CT,DT".split(","),
    poder:          "N,C,N,C,D,C,D,DT,C,N,D,C,N,C,D,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,D,CT,D,CT,C,C,C,C,D,D,D,C".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "C,C,C,C,D,C,D,C,C,D,C,D,D,C,D,C,D,C,D,C".split(","),
    economia:       "N,D,CT,D,C,D,C,D,C,D,C,D,C,D,N,D,CT,N,C,D".split(","),
    controle:       "C,D,CT,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,CT,D".split(","),
    comercio:       "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    religiao:       "CT,DT,CT,DT,C,D,CT,DT,CT,D,C,D,CT,D,CT,D,CT,D,CT,D".split(","),
    moral:          "CT,D,CT,N,C,D,CT,N,CT,DT,CT,DT,C,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,D".split(","),
  },

  // Generic (democratic) socialism: broader and more collectivist than social-democracia --
  // favors actual public/collective ownership of major industry, not just welfare-state
  // redistribution within capitalism; still electoral-democratic, secular, progressive, patriotic
  // enough to want national economic sovereignty (protectionist-leaning).
  "socialismo": {
    estrutura:      "C,D,C,D,N,D,C,C,D,C,N,C,N,C,D,C,N,D,C,D".split(","),
    representacao:  "CT,D,CT,D,C,D,CT,D,CT,D,C,D,N,D,CT,D,C,D,CT,D".split(","),
    poder:          "N,C,N,C,D,C,D,DT,C,N,D,C,N,C,D,C,D,C,D,C".split(","),
    imigracao:      "C,D,N,C,C,D,C,D,C,CT,C,C,C,C,C,C,D,D,C,D".split(","),
    diplomacia:     "N,C,D,C,N,C,D,C,C,D,C,D,C,C,C,C,D,D,C,D".split(","),
    intervencao:    "C,C,C,C,D,C,D,C,C,D,C,D,D,C,D,C,D,C,D,C".split(","),
    economia:       "C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,N,C,D".split(","),
    controle:       "CT,D,C,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "CT,DT,CT,DT,C,D,CT,DT,CT,D,C,D,CT,D,CT,D,CT,D,CT,D".split(","),
    moral:          "CT,D,CT,N,CT,D,CT,N,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:     "C,N,C,D,C,C,C,C,C,C,C,D,C,D,C,D,C,D,C,D".split(","),
  },

  // Liberal socialism (Rosselli/Croce-adjacent synthesis): socialism's economic egalitarianism
  // fused with liberalism's insistence on individual/civil liberty -- the strongest civil-liberties
  // score of the six, strong redistribution but market-compatible (not full nationalization),
  // secular, maximally progressive on culture, pro-democracy, pro-technology.
  "socialismo-liberal": {
    estrutura:      "C,D,C,D,N,D,C,C,D,C,N,C,N,C,D,C,N,D,C,D".split(","),
    representacao:  "CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    poder:          "D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,N,CT,DT,CT,D,CT,D,CT".split(","),
    imigracao:      "D,C,D,C,D,C,D,C,D,CT,D,CT,C,CT,D,C,D,DT,D,D".split(","),
    diplomacia:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,DT,CT,D,CT".split(","),
    intervencao:    "CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT,D,C,D".split(","),
    economia:       "C,D,CT,D,C,D,C,D,C,D,C,D,C,D,N,D,CT,N,C,D".split(","),
    controle:       "C,D,CT,D,CT,D,C,D,C,D,C,N,C,D,C,N,C,D,CT,D".split(","),
    comercio:       "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    moral:          "CT,DT,CT,DT,C,DT,CT,N,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,D".split(","),
  },
};
