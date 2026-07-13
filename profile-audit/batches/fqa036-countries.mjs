// FQA036: venezuela, cuba, costa-rica, suica, suecia.
// Same methodology as FQA035: grounded in real constitutional/institutional/policy facts, N where
// genuinely contested. Axis polarity: score = % leftPole (Federal/Democracia/Seguranca/Assimilacao/
// Militarista/Nao-intervencionista/Publico/Planejamento/Protecionismo/Irreligioso/Progressista/
// Tecnologia are all the HIGH-score poles).

export const PROFILES = {
  // Venezuela: federal on paper, extremely centralized in practice (opposition governors stripped
  // of power via appointed "protectores", PSUV central control) -> leans unitario despite formal
  // structure. 2024 election widely viewed as stolen, jailed opposition candidates, captured
  // judiciary -> very strongly autocratic. Mass political prisoners, "colectivos" repression ->
  // strongly seguranca. Chavista rhetoric mixes Bolivarian pan-Latin-American solidarity with
  // nationalist populism -> near-center imigracao. Confrontational "civic-military union" posture
  // and the active Essequipo territorial claim/mobilization against Guyana -> militarist and
  // strongly nationalist-assertive on intervencao, despite anti-imperialist rhetoric. Deep
  // nationalization history (PDVSA, banking, agriculture expropriations) -> strongly publico.
  // Extensive historical price/currency controls -> strongly planejamento. Embargo-isolated,
  // import-substitution legacy -> protecionista. Catholic-majority population despite quasi-secular
  // Bolivarian civic rhetoric -> leans religioso. Socialist rhetoric on equality but no gay marriage
  // (unlike most of the region) -> near-center moral. Oil-extraction economy with collapsed
  // infrastructure -> modest, uncertain tecnologia.
  venezuela: {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,C,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,C,N,N,N,C,N,C,C,N,C,N,N,N,N,D,D,N,N".split(","),
    diplomacia:    "CT,D,C,D,C,D,C,D,C,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    intervencao:   "D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,C,D,C,D,CT,D,D,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "N,C,D,C,N,C,N,D,N,N,D,C,N,C,N,N,D,D,N,C".split(","),
    tecnologia:    "C,D,N,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,N,N".split(","),
  },

  // Cuba: unitary one-party socialist state, no federalism -> very strongly unitario. PCC is the
  // sole legal party (constitutionally, since 1976/2019) -> very strongly autocratic. CDR
  // neighborhood surveillance committees, political prisoners -> strongly seguranca. Net-emigration
  // country ("balseros") with internationalist rhetoric but restrictive internal travel controls
  // historically -> leans multicultura moderately. Outsized historical military
  // internationalism (Angola, Cold War proxy wars) despite currently weak capability -> near-center
  // diplomacia. Confrontational anti-embargo sovereigntist doctrine plus historical revolution-
  // exporting legacy -> leans nacionalista. Overwhelmingly state-owned economy outside small
  // "cuentapropista" reforms -> very strongly publico. Central planning, rationing (libreta),
  // dual-currency history -> very strongly planejamento. US embargo plus own trade restrictions
  // -> strongly protecionista. Constitutionally atheist state until 1992, still officially secular
  // -> strongly irreligioso. 2022 Family Code legalized gay marriage/adoption by referendum,
  // abortion legal since 1965 -> genuinely progressive moral record, more so than the placeholder.
  // Real biomedical/vaccine-development strength despite general technological stagnation from the
  // embargo -> moderate tecnologia.
  cuba: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,D,C,D,C,D,C,D,C,N,C,N,C,N,C,D,D,N,N".split(","),
    diplomacia:    "C,D,C,D,N,C,D,C,C,D,C,D,C,C,N,C,C,D,C,C".split(","),
    intervencao:   "D,CT,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,N,D,C".split(","),
    economia:      "C,DT,CT,DT,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,DT,C,DT".split(","),
    controle:      "CT,DT,C,DT,C,D,CT,D,CT,D,CT,DT,CT,D,C,DT,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,D,C,D,C,C,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "C,D,C,D,C,D,C,D,C,D,C,D,C,D,N,D,C,DT,C,N".split(","),
    tecnologia:    "C,D,N,N,C,D,N,N,C,N,N,N,C,N,N,N,D,N,N,N".split(","),
  },

  // Costa Rica: constitutionally unitary but real strong municipal (81 cantones) autonomy tradition
  // -> near-center estrutura. One of Latin America's oldest, most stable democracies, no coups since
  // 1948 -> very strongly democratic. Abolished its military in 1948 (defining national trait),
  // abolished the death penalty in 1877 (one of the first countries in the world) -> very strongly
  // liberdade. Real Nicaraguan-immigrant integration tension vs. historical welcoming-refugee record
  // -> near-center imigracao. No armed forces at all -> the single most pacifist country in this
  // sample. UN University for Peace host, Arias Nobel Peace Prize for brokering Central American
  // peace -> very strongly non-interventionist. Admired universal public healthcare (Caja) alongside
  // a real free-trade-zone tech/medical-device private sector -> near-center economia. Genuinely
  // trade-open (CAFTA-DR, huge tech/medical-device FDI) -> strongly globalista. Catholicism is still
  // the constitutionally OFFICIAL state religion (Art. 75, unique in Latin America) even as lived
  // practice secularizes -> leans religioso, more than the placeholder suggests. First Central
  // American country to legalize gay marriage (2020), but a genuine deep split shown by an
  // anti-gay-marriage evangelical candidate nearly winning the 2018 presidency -> moderately
  // progressive but contested. World-renowned environmental/ecotourism identity (25%+ protected
  // land, carbon-neutral goals) alongside a real medical-device/tech manufacturing hub (Intel,
  // Boston Scientific) -> genuinely mixed, closer to center than the placeholder's high score.
  "costa-rica": {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,C,DT,C,DT,D,D,CT,DT,D,D,CT,DT".split(","),
    poder:         "D,C,D,CT,D,C,D,C,D,C,D,C,D,CT,DT,C,D,C,D,CT".split(","),
    imigracao:     "N,C,N,C,N,C,D,C,N,CT,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,C,D,CT,DT,CT,DT,CT".split(","),
    intervencao:   "CT,D,C,C,CT,D,CT,D,CT,D,C,D,CT,DT,C,D,CT,C,C,D".split(","),
    economia:      "D,N,C,D,D,DT,C,N,CT,D,C,C,C,D,N,D,C,N,N,D".split(","),
    controle:      "D,CT,D,C,N,C,D,D,N,C,D,D,DT,D,N,C,D,D,N,C".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,C,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,C,C,C".split(","),
    moral:         "C,N,C,N,N,N,C,N,N,N,C,N,D,C,N,N,C,D,C,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,N,N,N,D,C,N,C,N,N,C,N,N".split(","),
  },

  // Suica (Switzerland): arguably the most federal country in the world -- 26 cantons with real
  // sovereignty (own constitutions, tax rates, some own laws) -> very strongly federal. Direct
  // democracy (constant referendums/initiatives) -> very strongly democratic. Classical-liberal
  // civil-liberties tradition, though real restrictive referendums exist (2009 minaret ban) ->
  // strongly liberdade. High foreign-born share (~25%) well-integrated economically, but SVP
  // (largest party) is immigration-restrictionist and won real referendums (2014 "mass immigration
  // initiative") -> moderate assimilacao lean. Famous permanent ARMED neutrality since 1815 (not
  // disarmed like Costa Rica -- mandatory militia conscription, real defense capability) -> only
  // moderately pacifist, not extreme. Definitionally neutral, avoids military alliances/NATO,
  // cautious even about joining sanctions regimes -> extremely strongly non-interventionist. Major
  // private banking/pharma hub with mandatory-but-private health insurance -> leans privado.
  // Fiercely independent SNB, strong free-market tradition tempered by real agricultural
  // protectionism -> leans livre mercado. Outside the EU by deliberate choice but extensive
  // bilateral trade openness -> strongly globalista. Cantonal established churches (church tax
  // still exists in many cantons) alongside real secularization -> near-center religiao. Legalized
  // gay marriage 2021 (64% referendum approval) alongside the controversial 2009 minaret ban and
  // 2021 burqa ban -> genuinely mixed moral record. Major pharma/precision-industry/CERN hub ->
  // strongly pro-Tecnologia.
  suica: {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,C,DT,CT,DT,CT,DT,C,DT,CT,DT".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,CT,DT,CT,C,C,DT,CT,DT,D,DT,CT,DT".split(","),
    poder:         "D,C,N,CT,N,C,D,C,D,CT,D,C,D,CT,DT,C,N,C,D,CT".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,D,DT,C,D".split(","),
    diplomacia:    "N,C,D,CT,N,C,DT,CT,C,C,C,D,C,D,N,C,DT,D,D,C".split(","),
    intervencao:   "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT,D,CT,DT".split(","),
    economia:      "D,C,D,C,D,C,N,C,D,C,D,C,N,C,D,N,D,C,N,C".split(","),
    controle:      "D,C,DT,C,N,C,N,C,D,C,D,C,DT,C,N,C,D,DT,N,C".split(","),
    comercio:      "N,CT,N,CT,D,CT,N,CT,C,C,N,CT,N,CT,D,C,N,CT,N,CT".split(","),
    religiao:      "C,D,N,C,D,C,N,D,N,C,D,N,N,C,N,N,D,N,C,N".split(","),
    moral:         "C,N,C,N,N,N,C,D,N,N,N,D,N,C,N,D,D,D,N,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,N,N,C,N,C,D,C,D,C,D,N,N,C,DT".split(","),
  },

  // Suecia (Sweden): unitary state with real strong municipal/regional self-government but
  // constitutionally unitary -> leans unitario. Strong parliamentary democracy, world's first
  // Freedom of the Press Act (1766), very high institutional trust -> very strongly democratic.
  // Strong privacy/civil-liberties tradition, BUT one of Europe's most restrictive drug policies
  // (zero-tolerance, unusual among Nordics) -> moderately (not extremely) liberdade-leaning.
  // Historically one of Europe's most generous per-capita refugee-acceptance records (2015 crisis)
  // and official multiculturalism policy, tempered by real recent backlash (rise of Sweden
  // Democrats, tightened asylum law post-2015) -> near-center imigracao, more contested than the
  // placeholder suggests. Was neutral 200+ years but JOINED NATO in 2024 after Russia's invasion of
  // Ukraine, with a real sharp defense-spending increase -> a genuine, significant recent shift away
  // from the placeholder's extreme pacifism. Strong UN-peacekeeping/mediator legacy (Dag
  // Hammarskjold) now sits alongside NATO membership -> still leans non-interventionist but
  // meaningfully less than the placeholder given the 2024 alliance shift. Welfare state icon, but
  // genuinely more market-oriented than assumed since 1990s reforms (school vouchers, privatized
  // pension elements, wages set by union-employer bargaining not law) -> near-center economia/
  // controle rather than the placeholder's strong-public reading. Very open trade economy (IKEA,
  // Volvo, Ericsson, Spotify) -> strongly globalista. Lutheran state church disestablished 2000, one
  // of the most secular societies on Earth -> very strongly irreligioso. Gay marriage since 2009,
  // "feminist foreign policy" doctrine -> very strongly progressive. Major tech hub (Spotify,
  // Klarna, Ericsson) alongside world-leading climate-policy ambition (Greta Thunberg's home
  // country) -> genuinely closer to center than the placeholder's high pro-tech score.
  suecia: {
    estrutura:     "C,D,C,CT,D,C,C,C,D,C,C,C,D,C,D,C,C,CT,C,D".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,CT,DT,CT,D,D,DT,CT,DT,D,D,CT,DT".split(","),
    poder:         "D,N,D,CT,N,N,D,D,D,C,N,C,C,CT,D,C,N,C,D,CT".split(","),
    imigracao:     "N,C,D,CT,D,C,D,C,D,C,N,CT,D,CT,N,C,DT,C,N,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,C,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,N,C,D".split(","),
    economia:      "D,C,C,C,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "N,C,DT,C,C,D,N,N,D,C,N,C,DT,C,N,CT,D,DT,N,C".split(","),
    comercio:      "N,CT,N,CT,D,CT,N,CT,C,CT,N,CT,N,CT,D,C,N,CT,N,CT".split(","),
    religiao:      "CT,DT,CT,DT,CT,C,CT,DT,C,D,CT,D,CT,D,CT,D,CT,D,C,D".split(","),
    moral:         "CT,DT,CT,DT,C,DT,CT,D,C,D,CT,DT,C,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:    "C,D,C,N,C,DT,N,C,D,CT,N,C,C,C,C,D,N,N,C,N".split(","),
  },
};
