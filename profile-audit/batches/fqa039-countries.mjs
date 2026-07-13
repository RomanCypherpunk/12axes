// FQA039: coreia-do-norte, india, singapura, vietna, indonesia.
// Same methodology: grounded in real constitutional/institutional/policy facts, N where contested.

export const PROFILES = {
  // Coreia do Norte: totalitarian one-party dynasty, Juche/Songun doctrine.
  // estrutura/representacao/poder: most extreme unitario/autocratic/seguranca profile alongside
  // Alemanha Nazista (Kim-dynasty personality cult, songbun caste surveillance, political-prison
  // camps). imigracao: Juche ethnic-purity self-reliance doctrine plus near-total isolation ->
  // extreme assimilacao, corrected upward from the placeholder's near-center reading. diplomacia:
  // explicit Songun "military-first" policy, ~25% of GDP on the military, nuclear program -> extreme
  // militarista. intervencao: doesn't project power abroad but is extremely defiant/assertive about
  // its own sovereignty against international pressure -> leans nacionalista, moderately. economia/
  // controle: centrally planned command economy despite real informal jangmadang markets -> very
  // strongly publico/planejamento. comercio: near-total isolation/sanctions, explicit self-
  // sufficiency doctrine -> very strongly protecionista. religiao: constitutionally atheist, the
  // Kim personality cult functions as an explicit religion-substitute -> very strongly irreligioso.
  // moral: strict dress/hairstyle/media regulation, harsh punishment for "decadent" foreign culture
  // -> leans tradicionalista. tecnologia: real missile/nuclear technical achievement despite an
  // otherwise stagnant, isolated civilian economy -> near-center.
  "coreia-do-norte": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,C,D,C,D,C,C,C,D,C,D,C,C,D,D,C,D,N,D,C".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,D,C,DT,C,C,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,N,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,N,N".split(","),
  },

  // India: real federal republic (28 states) with real centralizing pull under BJP (2019 Kashmir
  // Article-370 revocation) -> leans federal. World's largest democracy, competitive elections,
  // though real concerns about press-freedom decline/opposition harassment -> leans democratic.
  // Vibrant civil society/free press alongside real colonial-era sedition laws still used and AFSPA
  // extensive-powers zones (Kashmir, Northeast) -> near-center poder. Rising Hindutva nationalism,
  // the 2019 Citizenship Amendment Act explicitly excludes Muslims from fast-track citizenship ->
  // leans assimilacao. Nuclear power with real Pakistan/China border tensions but historically the
  // Non-Aligned Movement's founder -> near-center diplomacia/intervencao. Post-1991 liberalization
  // built on a real License-Raj public-sector legacy -> near-center economia/controle, tempered by
  // the real recent "Atmanirbhar Bharat" (self-reliant India) protectionist push -> leans
  // protecionista. Constitutionally secular but Hindutva politics (Ram Mandir construction) blur
  // this against a deeply religious population -> strongly religioso. Decriminalized homosexuality
  // in 2018 but the Supreme Court declined to mandate gay marriage in 2023 -> leans tradicionalista.
  // Major IT-services/space-program (ISRO)/generic-pharma hub -> leans pro-Tecnologia.
  india: {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,N,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,N,C,N,D,DT,D,N,D".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,N,C,D".split(","),
    economia:      "N,N,C,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,D,D,C,D,C,D,C,C,C,D,D,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,D,C,N,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "C,N,C,N,N,N,C,N,D,N,D,N,D,C,N,N,D,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,C,N,N,N,C,N".split(","),
  },

  // Singapura: unitary city-state, definitionally no internal federal divisions -> extreme
  // unitario. PAP has ruled continuously since 1959, formally competitive elections but real
  // defamation-suit pressure on opposition and restricted press -> leans autocratic. Famously strict
  // laws (caning, mandatory death penalty for drug trafficking, protest confined to a single legal
  // "Speakers' Corner") delivering very low crime -> strongly seguranca. Explicit state-managed
  // multiculturalism by design (constitutionally mandated CMIO ethnic-housing quotas to prevent
  // enclaves) plus pragmatic foreign-talent immigration -> leans multicultura. Small but very
  // well-funded military and mandatory National Service under a "poison shrimp" deterrence doctrine
  // -> near-center diplomacia. Pragmatic small-state neutrality, hosted the 2018 Trump-Kim summit ->
  // leans nao-intervencionista. Famous global financial/capitalist hub, YET ~80% of the population
  // lives in state-built HDB public housing and Temasek Holdings is a massive state-linked-company
  // sovereign fund -> genuinely mixed economia/controle, more state-involved than the "free-market
  // hub" reputation alone suggests. One of the world's most trade-open economies (entrepot port,
  // extensive FTAs) -> extremely globalista. Managed religious pluralism (Buddhist/Christian/
  // Muslim/Hindu/secular all significant, actively regulated for "harmony") -> near-center religiao.
  // Criminalized gay sex until only 2022 (Section 377A repeal), gay marriage still unrecognized ->
  // leans tradicionalista. Explicit "Smart Nation" government tech-vision plus biotech-hub ambition,
  // balanced by a genuine "City in a Garden" green-urbanism ethos -> strongly pro-Tecnologia.
  singapura: {
    estrutura:     "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,D,CT,DT,CT".split(","),
    representacao: "C,C,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,D,C,N,C,D,C,N,CT,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,N,C,D".split(","),
    economia:      "D,C,C,C,N,D,N,C,C,D,D,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,C,D,C,N,N,C,C,D,CT,D,CT,DT,CT,N,CT,D,DT,N,C".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "N,C,N,C,D,C,D,N,N,C,D,C,N,C,N,N,D,N,C,C".split(","),
    moral:         "D,C,D,C,N,N,D,N,D,N,D,C,D,C,D,N,D,C,N,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,DT,CT,D,CT,DT,C,DT,CT,D,C,C,CT,DT".split(","),
  },

  // Vietna: unitary one-party state (Communist Party sole legal party) -> very strongly unitario/
  // autocratic. Real internet censorship and dissident/blogger suppression, though genuine economic
  // personal freedom has expanded hugely since Doi Moi -> strongly seguranca. Strong ethnic-
  // Vietnamese (Kinh) national identity despite official Communist internationalist rhetoric ->
  // leans assimilacao. Modernizing military given South China Sea disputes with China, but a real
  // "bamboo diplomacy" (flexible non-alignment) doctrine post-American War -> leans pacifista.
  // Explicit multi-directional non-alignment (doesn't want to be forced to choose between the US and
  // China) -> leans nao-intervencionista, more than the placeholder's near-center reading. "Socialist-
  // oriented market economy" since 1986 Doi Moi reforms, real substantial private-sector growth
  // alongside continued strategic state-owned enterprises and Five-Year Plans -> leans publico/
  // planejamento. Became a major "China+1" manufacturing/export hub (Samsung's largest plant
  // outside Korea) with extensive FTAs (CPTPP, EU-Vietnam) -> leans globalista, more than the
  // placeholder. Officially atheist Communist doctrine with real religious diversity monitored but
  // not fully suppressed -> leans irreligioso. Real growing LGBT tolerance (removed from the "social
  // evils" list) despite no gay marriage -> near-center moral. Rapid tech/manufacturing growth and
  // a real government tech-modernization push -> leans pro-Tecnologia.
  vietna: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "C,D,CT,D,C,N,C,D,C,D,C,C,C,C,D,C,C,N,D,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,N,C,N,D,DT,D,N,D".split(","),
    diplomacia:    "D,CT,D,CT,D,CT,N,CT,N,CT,N,C,C,C,N,CT,DT,D,D,C".split(","),
    intervencao:   "C,D,C,C,C,C,C,C,C,C,C,C,CT,DT,C,C,C,C,C,D".split(","),
    economia:      "C,D,CT,D,C,DT,CT,N,CT,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,DT,C,D".split(","),
    comercio:      "N,C,N,CT,D,CT,N,CT,N,CT,N,CT,N,CT,N,CT,N,CT,N,CT".split(","),
    religiao:      "C,D,C,D,C,C,C,DT,N,C,D,C,C,C,C,C,D,N,C,C".split(","),
    moral:         "C,N,C,N,N,N,D,N,D,N,N,C,N,N,N,N,D,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,N,D,N,N,D,C,N,C,N,D,N,C,N".split(","),
  },

  // Indonesia: constitutionally a unitary "Negara Kesatuan" state, though real significant regional
  // autonomy since the 2001 decentralization (Aceh sharia autonomy, Papua special status) -> near-
  // center estrutura. Democratized since 1998, real competitive elections and peaceful transfers of
  // power -> leans democratic. Generally vibrant press/civil society, but the Papua conflict
  // involves real heavy security presence and blasphemy laws are actively used -> leans seguranca,
  // moderately. Pancasila state ideology explicitly enshrines "unity in diversity" (Bhinneka Tunggal
  // Ika, the literal national motto) across 300+ ethnic groups -> leans multicultura, a correction
  // from the placeholder's assimilacao-leaning reading. "Free and active" (bebas aktif) non-
  // alignment has been Indonesia's explicit constitutional foreign-policy doctrine since
  // independence -> leans nao-intervencionista, more than the placeholder's dead-center reading;
  // moderate military, not particularly militarized -> leans pacifista. Mixed economy with real
  // significant state enterprises (Pertamina, PLN) -> leans publico. Real recent resource-
  // nationalist protectionism (the 2020 raw-nickel export ban to force domestic smelting, an
  // explicit "Indonesia Incorporated" strategy) -> leans planejamento/protecionista. Pancasila
  // requires every citizen to hold an officially recognized religion (atheism has no legal status),
  // world's largest Muslim population -> strongly religioso. The 2022 new criminal code
  // criminalizing extramarital sex/cohabitation nationally was a real, widely-criticized regressive
  // shift -> leans tradicionalista. Real growing tech/startup scene (Gojek, Tokopedia) set against a
  // real major deforestation/palm-oil environmental controversy -> near-center tecnologia.
  indonesia: {
    estrutura:     "C,C,C,C,C,D,C,C,D,D,CT,D,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,N,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "N,C,D,C,N,C,D,C,N,CT,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "D,CT,D,CT,D,CT,N,CT,N,CT,N,C,C,C,N,CT,DT,D,D,C".split(","),
    intervencao:   "C,D,C,C,C,C,CT,C,CT,C,C,C,CT,DT,C,C,CT,C,C,D".split(","),
    economia:      "N,N,C,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,C,C,C,D,C,D,C,C,C,D,D,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,D,C,N,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,DT,C,CT".split(","),
    moral:         "D,C,D,C,N,N,D,N,D,N,D,C,D,C,D,N,D,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,N,N,D,N,C,N".split(","),
  },
};
