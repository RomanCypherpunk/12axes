// FQA030: tecno-monarquismo, progressismo-de-direita, tecno-socialismo, tecno-fascismo,
// liberalismo-autoritario

export const PROFILES = {
  // NRx-style techno-monarchism: single sovereign CEO-monarch, very low representacao, strong
  // internal order/security, corporate/privately-run state economically, tech-maximalist.
  "tecno-monarquismo": {
    estrutura:      "N,C,N,C,D,C,N,C,D,C,N,C,D,C,N,C,D,C,D,C".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,CT,D,C,D,CT,D,C,D,C,D,CT".split(","),
    poder:          "CT,N,CT,D,CT,D,CT,D,C,D,CT,C,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,D,N,C,C,C,C,C,C,D,C,D,C,C,C,C,D,D,C,D".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,CT,D,CT,D,CT,D,C,D,C,N,C,D,C,D,C,D,CT,D,C".split(","),
    controle:       "D,CT,D,CT,D,C,D,C,D,C,D,C,D,C,D,C,D,CT,D,CT".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:       "C,D,C,D,N,D,C,D,C,D,C,D,C,D,C,D,N,D,C,D".split(","),
    moral:          "N,N,N,N,D,N,N,N,D,D,D,C,D,D,N,N,D,C,N,N".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
  },

  // Secular tech-right: rationalist/anti-woke, market-friendly, nationalist, skeptical of PC
  // progressive culture without being religiously motivated, tech-accelerationist.
  "progressismo-de-direita": {
    estrutura:      "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    representacao:  "C,C,C,D,C,N,C,D,C,C,C,C,D,C,C,D,N,C,C,D".split(","),
    poder:          "C,C,C,C,C,D,C,D,C,C,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,C,D,C,D,C,D,C,C,C,C,C,D,C,D,C,DT,C,D".split(","),
    diplomacia:     "C,D,C,D,C,C,N,C,C,D,C,D,N,C,C,C,D,D,C,C".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,CT,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,C,DT,CT,DT,C,DT,C,DT,C,DT,CT,DT,C,DT".split(","),
    moral:          "D,C,D,C,D,C,D,N,D,C,D,C,D,N,N,C,D,N,D,N".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
  },

  // Techno-socialism: collectivized/state-planned ownership fused with maximal tech-embrace and
  // reasonably democratic process (contrast eco-socialism's tech caution).
  "tecno-socialismo": {
    estrutura:      "C,D,C,D,N,D,C,C,D,C,N,C,N,C,D,C,N,D,C,D".split(","),
    representacao:  "CT,D,CT,D,C,D,CT,D,CT,D,C,D,N,D,CT,D,C,D,CT,D".split(","),
    poder:          "C,C,N,C,N,C,N,C,C,N,N,C,C,N,N,N,C,N,N,N".split(","),
    imigracao:      "D,C,D,C,N,C,D,C,N,CT,D,CT,C,C,C,C,D,C,D,C".split(","),
    diplomacia:     "N,C,D,C,N,C,D,C,C,C,C,C,D,C,D,C,D,C,N,C".split(","),
    intervencao:    "N,C,N,C,N,C,D,C,N,N,N,N,C,N,N,N,D,C,N,C".split(","),
    economia:       "C,D,CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D".split(","),
    controle:       "CT,DT,C,D,CT,D,CT,D,C,D,CT,N,C,DT,C,N,C,D,CT,D".split(","),
    comercio:       "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,D,N,C,N,C".split(","),
    religiao:       "CT,DT,CT,DT,C,DT,C,DT,CT,DT,C,DT,C,DT,C,DT,CT,DT,CT,DT".split(","),
    moral:          "CT,D,C,N,CT,D,CT,N,C,D,CT,D,C,D,C,DT,C,D,CT,D".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D".split(","),
  },

  // Techno-fascism: ultranationalist authoritarian, private-property-preserving corporatism
  // (fascist economics), maximal embrace of technology and industrial power (unlike classic
  // fascism's ambivalence) as instruments of national strength.
  "tecno-fascismo": {
    estrutura:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    representacao:  "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    poder:          "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
    imigracao:      "CT,DT,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,DT,CT,DT".split(","),
    diplomacia:     "CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:    "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    economia:       "D,C,D,C,D,C,C,D,D,C,N,C,D,C,D,C,D,C,D,C".split(","),
    controle:       "C,D,C,D,D,C,C,D,C,D,C,C,D,C,C,D,C,D,C,D".split(","),
    comercio:       "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D".split(","),
    religiao:       "N,C,N,C,N,C,N,C,N,C,D,C,N,C,N,C,N,C,N,C".split(","),
    moral:          "D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT".split(","),
    tecnologia:     "CT,DT,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D".split(","),
  },

  // Authoritarian liberalism (Pinochet + Chicago Boys / Fujimori-style hybrid): economically
  // liberal/private, politically authoritarian (order over democratic contestation), pro-tech,
  // culturally moderate (no strong religious or traditionalist project).
  "liberalismo-autoritario": {
    estrutura:      "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    representacao:  "D,CT,D,C,D,CT,D,C,D,C,D,C,D,CT,D,C,D,C,D,C".split(","),
    poder:          "C,C,C,C,C,D,C,D,C,N,C,C,C,D,C,D,C,D,C,D".split(","),
    imigracao:      "C,D,N,C,C,D,C,D,N,C,C,C,C,D,C,D,C,D,C,D".split(","),
    diplomacia:     "C,C,N,C,C,C,N,C,C,D,C,D,C,C,C,C,D,D,N,C".split(","),
    intervencao:    "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    economia:       "D,CT,D,CT,D,CT,D,C,D,C,N,C,D,C,D,C,D,CT,D,C".split(","),
    controle:       "D,CT,D,CT,D,CT,D,C,D,C,D,C,D,C,D,C,D,CT,D,CT".split(","),
    comercio:       "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:       "C,D,C,D,N,C,C,D,C,C,C,D,C,C,C,D,N,D,C,D".split(","),
    moral:          "C,D,C,N,C,D,C,N,N,D,C,D,N,D,N,D,D,N,C,N".split(","),
    tecnologia:     "CT,D,CT,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,D,CT,D".split(","),
  },
};
