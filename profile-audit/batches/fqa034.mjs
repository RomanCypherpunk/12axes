// FQA034: centrismo-social, centrismo-liberal, centrismo-ambientalista, centrismo-conservador
// (nacional-liberalismo intentionally excluded -- bespoke vector explicitly approved by the
// project owner per CLAUDE.md sec.8, not something the audit should override)

export const PROFILES = {
  // Social centrism: moderate on most axes, mild lean left on economia/controle (pragmatic
  // welfare-state centrism, not doctrinaire).
  "centrismo-social": {
    estrutura:      "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    representacao:  "C,D,C,D,C,N,C,D,C,D,C,D,N,D,C,D,N,D,C,D".split(","),
    poder:          "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    imigracao:      "N,N,N,N,N,N,N,N,N,C,N,C,N,N,N,N,N,D,N,N".split(","),
    diplomacia:     "N,N,N,N,N,N,D,N,N,N,N,D,N,N,N,N,D,N,N,N".split(","),
    intervencao:    "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    economia:       "N,D,C,D,C,D,C,D,C,D,N,D,C,D,N,N,C,N,N,D".split(","),
    controle:       "C,D,C,D,C,D,C,D,C,D,N,N,N,D,C,N,C,D,C,D".split(","),
    comercio:       "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    religiao:       "N,N,N,N,N,C,N,D,N,C,D,C,N,N,D,N,N,D,C,C".split(","),
    moral:          "C,C,N,N,N,N,C,N,N,D,N,N,D,D,N,D,D,N,C,N".split(","),
    tecnologia:     "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
  },

  // Liberal centrism: classical-liberal-adjacent moderate -- somewhat market-friendly, socially
  // liberal, pro-democratic-process, but without the radicalism of full libertarianism.
  "centrismo-liberal": {
    estrutura:      "C,D,C,D,N,D,N,C,D,C,N,D,N,D,C,C,N,D,C,D".split(","),
    representacao:  "CT,D,C,D,C,D,C,D,C,D,C,D,D,D,CT,D,C,D,C,D".split(","),
    poder:          "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    imigracao:      "D,C,D,C,D,C,N,C,D,C,D,C,N,C,N,C,D,N,D,N".split(","),
    diplomacia:     "D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,N,D,N".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,N,C,D,C".split(","),
    comercio:       "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    religiao:       "C,D,C,D,N,D,C,DT,C,D,C,D,C,D,C,D,N,D,C,D".split(","),
    moral:          "C,D,C,D,N,D,C,D,N,D,C,D,N,D,C,D,C,D,C,D".split(","),
    tecnologia:     "C,D,C,D,C,N,C,N,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
  },

  // Environmentalist centrism: moderate green politics -- center on most axes, tilts toward the
  // "Biologia" pole on tecnologia and mildly left on economia/controle (favors regulation of
  // industry/pollution) without radical anti-industrial politics.
  "centrismo-ambientalista": {
    estrutura:      "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    representacao:  "C,D,C,D,C,N,C,D,C,D,C,D,N,D,C,D,N,D,C,D".split(","),
    poder:          "N,C,N,N,N,C,N,N,N,N,N,C,N,C,N,C,N,C,N,C".split(","),
    imigracao:      "N,N,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,N,N,N".split(","),
    diplomacia:     "D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,N".split(","),
    intervencao:    "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    economia:       "N,D,C,D,C,D,C,D,C,D,N,D,C,D,N,N,C,N,N,D".split(","),
    controle:       "C,D,C,D,C,D,C,D,C,D,N,N,N,D,C,N,C,D,C,D".split(","),
    comercio:       "N,N,N,N,N,N,C,N,C,N,C,N,N,N,C,N,C,N,N,N".split(","),
    religiao:       "N,N,N,N,N,C,N,D,N,C,D,C,N,N,D,N,N,D,C,C".split(","),
    moral:          "C,C,N,N,C,N,C,N,N,N,N,N,N,N,N,N,N,N,C,N".split(","),
    tecnologia:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,N,C,D,C,D,C".split(","),
  },

  // Conservative centrism: moderate right-of-center -- center on structural/economic axes, tilts
  // traditionalist on moral/religiao and mildly assimilationist on imigracao, without the
  // authoritarian or nationalist intensity of the hard-right cluster.
  "centrismo-conservador": {
    estrutura:      "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
    representacao:  "C,D,C,D,C,N,C,D,C,D,C,D,N,D,C,D,N,D,C,D".split(","),
    poder:          "N,D,N,D,N,D,N,DT,N,N,N,D,N,D,N,D,N,D,N,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,N,C,N,C,D,C,D,C,DT,C,DT".split(","),
    diplomacia:     "N,N,N,N,N,N,D,N,N,N,N,D,N,N,N,N,D,D,N,N".split(","),
    intervencao:    "D,C,N,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "N,C,N,C,D,C,N,C,D,C,N,C,D,C,N,N,D,C,N,C".split(","),
    controle:       "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    comercio:       "C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,D,C,N,C,D".split(","),
    religiao:       "D,C,D,C,N,C,D,N,D,C,D,C,D,C,D,C,N,C,D,C".split(","),
    moral:          "D,C,D,C,D,C,D,N,D,C,D,C,D,C,D,N,D,C,D,C".split(","),
    tecnologia:     "N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N,N".split(","),
  },
};
