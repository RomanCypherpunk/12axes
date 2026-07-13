// FQA038: russia, japao, coreia-do-sul, coreia-do-sul-de-park-chung-hee, china.
// Same methodology as FQA035/036/037: grounded in real constitutional/institutional/policy facts.

export const PROFILES = {
  // Russia: constitutionally federal (89 subjects) but extremely centralized in practice under
  // Putin's "power vertical" (governors Kremlin-controlled/filtered since 2004) -> strongly
  // unitario. Sham 2024 election (~87%), Navalny died in prison, near-total state media control ->
  // very strongly autocratic. FSB surveillance, "foreign agent" laws, wartime censorship
  // criminalizing "discrediting" the military -> very strongly seguranca. "Russkiy Mir" ethno-
  // civilizational doctrine plus real xenophobia toward Central Asian migrant workers -> strongly
  // assimilacao. Actively at war (Ukraine since 2022), nuclear saber-rattling, massive wartime
  // remilitarization -> very strongly militarist. Literally invaded a neighboring sovereign country
  // (Ukraine 2022, Georgia 2008, Crimea 2014), explicit "near abroad" sphere-of-influence doctrine
  // -> very strongly nationalist-assertive. State-dominated strategic energy giants (Gazprom,
  // Rosneft) plus wartime economic mobilization -> leans publico. Historically technocratic/
  // independent central bank now overridden by wartime capital controls and forced-conversion rules
  // -> leans planejamento. Sanctioned and isolated since 2022, forced "friendly countries"
  // reorientation (China, India) -> strongly protecionista. Russian Orthodox Church explicitly
  // fused with state ideology (Patriarch Kirill blessed the invasion) as core to "traditional
  // values" anti-Western doctrine -> strongly religioso. Explicit anti-LGBT law (2013 "gay
  // propaganda" ban expanded 2023 to a full "extremist movement" designation) -> very strongly
  // tradicionalista. Real space/nuclear military-tech legacy undercut by post-2022 Western sanctions
  // and severe tech-sector brain drain -> moderate tecnologia.
  russia: {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,C,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,C,D,CT,DT,C,DT,C,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "C,D,C,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,DT,C,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,C,D,C,D,CT,D,D,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "D,C,DT,CT,DT,C,D,CT,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,N,N,C,D,N,N,C,N,N,D,C,N,N,N,D,N,N,N".split(","),
  },

  // Japao: unitary (47 prefectures, no federal structure) with real strong local-administration
  // tradition -> leans unitario. Stable parliamentary democracy since 1947, though near-continuous
  // LDP dominance since 1955 is a real one-party-dominant nuance within genuinely competitive
  // elections -> leans democratic. Low crime achieved through social conformity more than harsh
  // formal coercion, death penalty still used, strict gun control, but strong privacy/due-process
  // tradition -> near-center poder. Historically one of the most ethnically homogeneous/restrictive-
  // immigration developed nations ("Nihonjinron" ethnic-identity concept), despite recent labor-
  // shortage-driven visa loosening -> strongly assimilacao. Article 9 constitutionally renounces war
  // (Self-Defense Forces only) -- historically pacifist identity, tempered by a real recent 2022
  // National Security Strategy defense-budget doubling amid China/North Korea tensions -> leans
  // pacifista but less extreme than pure Article-9 doctrine alone. Article 9 also constrains
  // offensive intervention, deeply alliance-bound to the US rather than independently assertive,
  // though real growing regional assertiveness re: Taiwan -> near-center intervencao. Strong
  // private export-industrial base (Toyota, Sony) alongside a real historical MITI-style industrial-
  // coordination legacy ("Japan Inc.") -> near-center economia/controle. Famously protectionist rice
  // tariffs alongside major-exporter status -> near-center comercio. Syncretic Shinto-Buddhist
  // culture with genuinely low religious self-identification in surveys, officially secular since
  // postwar State Shinto disestablishment -> leans irreligioso. No national gay marriage yet despite
  // court rulings finding the ban unconstitutional -> strongly tradicionalista. Global robotics/
  // electronics/bullet-train leadership tempered by real post-Fukushima (2011) nuclear-power anxiety
  // and most reactors idled for years -> strongly pro-Tecnologia but not maximal.
  japao: {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,C,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,D,CT,N,CT,N,CT,C,C,C,CT,DT,D,D,CT".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,N,C,D".split(","),
    economia:      "N,N,C,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,D,D,C,D,C,D,C,C,C,D,D,D,C,C,C,DT,C,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,C,N,C,N,CT,N,CT,N,CT,N,CT,N,CT".split(","),
    religiao:      "C,D,C,D,C,C,C,DT,N,C,D,D,C,N,C,N,D,DT,C,C".split(","),
    moral:         "D,C,D,C,C,C,D,C,D,C,D,C,D,C,D,D,D,C,D,C".split(","),
    tecnologia:    "CT,DT,C,D,CT,D,C,D,N,C,C,D,C,N,CT,C,C,C,CT,D".split(","),
  },

  // Coreia do Sul: unitary, formally centralized administration -> leans unitario. Vibrant,
  // genuinely competitive democracy since 1987, real peaceful power transfers, though the December
  // 2024 martial-law declaration attempt by Yoon Suk-yeol -- quickly reversed by parliament/public
  // backlash and followed by impeachment -- is a real, very recent stress test the institutions
  // actually passed -> leans democratic, with that nuance. National Security Law criminalizes pro-
  // North-Korea speech (unusually restrictive for a liberal democracy), mandatory conscription, but
  // a vibrant protest culture that toppled a president (2016-17 candlelight movement) -> near-center
  // poder. Historically ethnically homogeneous with a strong "hanminjok" unified-ethnic-nation
  // identity, despite recent labor-driven visa loosening -> leans assimilacao. Large defense budget
  // and mandatory conscription driven by the active North Korea threat, now also a major arms
  // exporter (K9 howitzers) -> strongly militarist. Historically cautious beyond peninsula defense,
  // deeply alliance-bound to the US rather than independently assertive -> near-center intervencao.
  // Strong private chaebol export economy (Samsung, Hyundai) -> leans privado. Real legacy state-
  // chaebol coordination on strategic tech (semiconductors) persists even with an independent Bank
  // of Korea -> near-center controle. Huge semiconductor/auto/shipbuilding export economy with
  // extensive FTAs, tempered by real agricultural protectionism -> leans globalista. Genuinely
  // religiously plural (large Christian and Buddhist populations alongside a slight secular
  // majority) -> near-center religiao. No national gay marriage, real strong conservative Christian
  // political influence, in tension with strong youth/K-pop-driven progressive currents -> leans
  // tradicionalista, contested. World-leading semiconductor/tech society (Samsung, fastest internet)
  // -> very strongly pro-Tecnologia.
  "coreia-do-sul": {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,N,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,C,C,N,CT,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,N,C,N,D,DT,D,N,D".split(","),
    diplomacia:    "CT,D,C,DT,CT,D,C,DT,C,D,CT,D,CT,D,CT,D,C,DT,CT,D".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,D,C,C,C,N,C,D".split(","),
    economia:      "D,CT,D,CT,D,C,D,CT,D,C,D,C,N,CT,D,CT,D,CT,N,CT".split(","),
    controle:      "C,C,D,C,N,N,C,C,D,CT,D,CT,DT,CT,N,CT,D,DT,N,C".split(","),
    comercio:      "N,C,N,CT,D,C,C,CT,C,CT,N,CT,N,CT,C,N,N,CT,N,CT".split(","),
    religiao:      "N,C,N,C,D,C,D,N,N,C,D,C,N,C,N,N,D,N,C,C".split(","),
    moral:         "D,C,D,C,N,N,D,N,D,N,D,C,D,C,D,N,D,C,N,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,DT,CT,D,CT,DT,C,DT,CT,D,C,D,CT,DT".split(","),
  },

  // Coreia do Sul de Park Chung Hee: a historical military-dictatorship profile (1961-1979),
  // distinct from modern South Korea. Military-command centralization, provincial governors
  // appointed not elected -> very strongly unitario. 1961 coup, 1972 Yushin Constitution
  // established effectively permanent rule, sham elections, opposition leaders persecuted (Kim
  // Dae-jung nearly assassinated by the KCIA) -> very strongly autocratic. KCIA mass-surveillance/
  // repression apparatus, martial-law periods, documented severe human-rights abuses -> very
  // strongly seguranca. Ethnically homogeneous Korea plus heavy "minjok" ethnic-nation-building
  // mobilization ideology central to the regime's legitimacy -> leans assimilacao. Intensely
  // anticommunist, real active military buildup against North Korea, sent one of the largest non-US
  // troop contingents to the Vietnam War -> strongly militarist. Rigid Cold-War anticommunist-bloc
  // alignment, real interventionist willingness (Vietnam) when serving anticommunism, but overall
  // foreign policy US-dependent rather than independently assertive -> near-center intervencao.
  // State-directed developmentalism built explicitly AROUND privately-owned chaebols (Samsung,
  // Hyundai, LG all grew under Park-era subsidized credit) rather than nationalization -> near-
  // center economia. THE defining trait of this era: Five-Year Economic Development Plans, state-
  // directed credit to chosen "national champion" chaebols, government-set export targets -> very
  // strongly planejamento. Explicit export-oriented industrialization combined with real protection
  // of domestic infant industries -- the classic East Asian developmental-state mixed strategy ->
  // near-center comercio. Not a religiously-defined regime; a blend of Confucian tradition and
  // secular-nationalist developmentalist ideology -> near-center religiao. Real documented moral
  // paternalism (banned long hair on men, policed miniskirt length, strict curfews) -> strongly
  // tradicionalista. Laid the literal foundation of Korea's later tech dominance (POSCO steel,
  // shipbuilding, electronics push) via an industrialization-forward, anti-agrarian-nostalgia
  // developmentalist ideology -> strongly pro-Tecnologia.
  "coreia-do-sul-de-park-chung-hee": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    diplomacia:    "CT,D,C,DT,CT,D,C,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,C,D,C,D,C,C,C,D,C,D,C,C,D,D,C,D,N,D,C".split(","),
    economia:      "N,N,C,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "CT,DT,C,C,C,D,CT,D,CT,D,CT,DT,C,D,CT,DT,CT,DT,CT,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,C,N,C,N,CT,N,CT,N,CT,N,CT,N,CT".split(","),
    religiao:      "N,N,N,N,N,C,N,D,N,C,N,C,N,C,N,N,N,N,C,C".split(","),
    moral:         "D,C,D,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,C,D,CT".split(","),
    tecnologia:    "C,DT,C,D,C,D,C,D,N,N,N,D,C,N,N,N,D,N,C,D".split(","),
  },

  // China: constitutionally a "unitary multi-ethnic state" (explicit doctrine, not federal), with
  // Hong Kong's "one country two systems" substantially eroded since the 2020 National Security Law
  // -> very strongly unitario. CCP is constitutionally the sole ruling party, no competitive
  // national elections, Xi removed term limits in 2018, the Great Firewall enforces near-total
  // information control -> very strongly autocratic. Social-credit system, ubiquitous facial
  // recognition, Xinjiang mass-internment of Uyghurs, extensive censorship and death-penalty use ->
  // extremely strongly seguranca. Officially a "unified multi-ethnic nation" (56 recognized groups)
  // on paper, but a real severe assimilationist "sinicization" campaign specifically targets
  // Uyghurs/Tibetans (mass internment, cultural suppression) -> a real correction toward assimilacao,
  // notably more than the placeholder's multicultural-leaning score. Massive, rapidly growing
  // military buildup (world's largest navy by ship count, missile/nuclear modernization), increasing
  // assertiveness in the South China Sea and Taiwan Strait -> strongly militarist, a correction
  // upward. Officially espouses "non-interference" as core doctrine (Five Principles of Peaceful
  // Coexistence) while pursuing real assertive actions (South China Sea militarization, Belt-and-
  // Road debt-leverage, Taiwan reunification-by-force not renounced) -> genuinely mixed, moderate
  // nacionalista lean. "Socialism with Chinese characteristics": massive state-owned enterprises in
  // strategic sectors alongside a large private tech sector reined in by the 2021+ regulatory
  // crackdown -> leans publico. Five-Year Plans, extensive state direction of strategic sectors,
  // capital controls, a managed (not free-floating) currency -> very strongly planejamento. World's
  // largest exporter, yet genuinely protectionist in market access for foreign firms and pursuing
  // "Made in China 2025" import-substitution in strategic tech -> strongly protecionista. CCP
  // membership constitutionally requires atheism; the state tightly controls/restricts religious
  // practice (state-sanctioned churches only, severe repression of Falun Gong and Uyghur Islam) ->
  // very strongly irreligioso, officially. No gay marriage, an explicit recent anti-"sissy"-aesthetic
  // media crackdown, aggressive pro-natalist traditional-family push amid demographic crisis ->
  // strongly tradicionalista. Massive state-directed AI/5G/space/genetic-research investment
  // (including the controversial 2018 CRISPR baby-gene-editing case), an explicit "innovation
  // superpower" strategy -> very strongly pro-Tecnologia.
  china: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,C,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "C,C,D,C,C,C,D,C,C,D,C,D,D,C,C,D,C,N,C,D".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "CT,DT,C,C,C,D,CT,D,CT,D,CT,DT,C,D,CT,DT,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,D,C,D,C,C,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,CT,CT,D,CT,DT,C,DT,CT,D,C,C,CT,DT".split(","),
  },
};
