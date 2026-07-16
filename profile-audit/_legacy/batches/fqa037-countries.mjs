// FQA037: alemanha, franca, uniao-europeia, reino-unido, hungria.
// Same methodology as FQA035/036: grounded in real constitutional/institutional/policy facts.

export const PROFILES = {
  // Alemanha: real strong federation (16 Lander, Bundesrat, "Kulturhoheit der Lander" over
  // education/policing) -> very strongly federal. Stable "wehrhafte Demokratie" (militant democracy
  // that can ban anti-democratic parties), strong Verfassungsgericht -> very strongly democratic.
  // Strong post-Stasi/Gestapo privacy culture (GDPR spirit) vs. real hate-speech/Nazi-symbol
  // restrictions (Volksverhetzung) unusually strict by US standards -> genuinely mixed, moderate
  // liberdade lean. 2015 "Wir schaffen das" open-door refugee policy vs. real recent AfD-driven
  // backlash -> near-center imigracao. Post-WWII pacifist constitutional culture ("Nie wieder
  // Krieg") but a real historic "Zeitenwende" rearmament shift after 2022 -> less extremely
  // pacifist than the placeholder. Deeply NATO/EU-embedded multilateralism, not isolationist ->
  // near-center intervencao. "Soziale Marktwirtschaft" genuinely balances labor co-determination
  // and a robust private Mittelstand -> near-center economia. Ordoliberal rules-based tradition
  // (Bundesbank legacy, anti-inflation obsession from Weimar trauma) -> leans market. World's
  // 3rd-largest exporter, EU single-market architect -> very strongly globalista. Church-tax
  // institutional entanglement vs. very fast real secularization -> leans irreligioso, moderately.
  // Gay marriage since 2017 vs. real CDU/CSU conservative and AfD backlash currents -> leans
  // progressive. Major engineering/auto-tech power, BUT completed a full nuclear phase-out in 2023
  // (Atomausstieg) and is notably GMO-skeptical -> closer to center tecnologia than the placeholder.
  alemanha: {
    estrutura:     "CT,DT,CT,DT,CT,DT,C,D,DT,D,C,D,CT,DT,D,C,C,D,CT,DT".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,C,DT,C,D,D,D,CT,DT,D,D,CT,DT".split(","),
    poder:         "D,C,C,C,N,C,C,D,C,C,N,C,D,C,D,C,C,N,D,C".split(","),
    imigracao:     "N,C,D,C,D,C,D,C,N,CT,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "C,C,C,C,N,C,C,C,C,N,C,D,C,DT,C,C,C,N,C,D".split(","),
    economia:      "D,C,C,C,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "N,C,DT,C,C,D,N,N,D,C,N,C,DT,C,N,CT,D,DT,N,C".split(","),
    comercio:      "N,CT,N,CT,D,CT,N,CT,C,CT,N,CT,N,CT,D,C,N,CT,N,CT".split(","),
    religiao:      "C,D,C,D,C,C,N,D,N,C,D,C,N,C,N,C,D,N,C,C".split(","),
    moral:         "C,N,C,N,N,N,C,D,C,D,C,D,N,C,N,D,C,D,C,C".split(","),
    tecnologia:    "C,D,C,N,D,CT,D,CT,D,N,C,CT,C,C,N,D,D,C,N,N".split(","),
  },

  // Franca: the historically most centralized/unitary state in Europe ("Republique une et
  // indivisible" is literal constitutional text), real 1982+ decentralization softened this but did
  // not change its unitary character -> very strongly unitario. Semi-presidential democracy, though
  // extensive Article 49.3 use (bypassing parliamentary votes) and gilets-jaunes-era unrest show
  // real executive-power concentration -> strongly but not maximally democratic. State-of-emergency
  // powers extended for years post-2015 terror attacks, documented heavy-handed protest policing ->
  // moderate seguranca lean. Fiercely explicit LAICITE-driven ASSIMILATIONIST state doctrine
  // (2004 school-headscarf ban, 2010 burqa ban) that formally REJECTS multiculturalism as a policy
  // concept, unlike the UK/Canadian model -> strongly assimilacao, a real correction from the
  // placeholder's near-center reading. Independent nuclear deterrent ("force de frappe"), permanent
  // UNSC seat, active expeditionary interventions (Mali, Libya, Syria), largest EU defense budget
  // -> strongly militarist, again a correction upward. Extensive real history of unilateral military
  // intervention in former African colonies ("Francafrique" -- Mali, CAR, Chad, Cote d'Ivoire) plus
  // De Gaulle's sovereigntist independent-deterrent doctrine -> strongly nationalist-assertive,
  // correction downward on intervencao. Dirigiste tradition (EDF/SNCF state ownership, highest
  // public-spending share in the OECD at ~57% of GDP) -> leans publico and planejamento more than
  // the placeholder. EU member with real agricultural-protectionism (CAP) and "economic patriotism"
  // blocking foreign takeovers of strategic firms -> leans globalista but with real carve-outs.
  // The strictest state-secularism regime among major democracies (1905 laicite law) -> strongly
  // irreligioso, corrected upward. Gay marriage since 2013 despite the massive "Manif pour tous"
  // conservative backlash -> leans progressive. World-unique nuclear-power commitment (~70% of
  // electricity, explicit state pride) plus Airbus/CNES aerospace strength, tempered by a real GMO
  // cultivation ban -> strongly pro-Tecnologia.
  franca: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "CT,D,CT,C,C,D,CT,D,C,D,C,D,D,C,CT,D,D,D,C,D".split(","),
    poder:         "C,D,C,C,C,N,C,D,C,C,C,C,D,C,D,C,C,N,C,C".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,C,D,CT,DT,C,DT,C,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,D,C,D,CT,C,CT,C,C,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "C,D,CT,D,N,DT,C,N,CT,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,C,C,C,D,CT,D,C,C,C,D,D,D,C,C,C,DT,C,D".split(","),
    comercio:      "N,C,N,CT,D,C,C,CT,C,CT,N,CT,N,CT,C,C,N,CT,N,C".split(","),
    religiao:      "C,D,CT,DT,C,C,CT,DT,C,C,DT,C,CT,C,CT,C,C,DT,C,C".split(","),
    moral:         "C,N,C,N,N,N,C,D,N,N,N,D,N,C,N,D,C,D,C,C".split(","),
    tecnologia:    "CT,DT,C,DT,C,D,C,DT,CT,D,CT,DT,C,DT,CT,D,C,D,CT,DT".split(","),
  },

  // Uniao Europeia: a supranational body, not a state -- its own treaties define its character. The
  // subsidiarity principle (Art.5 TEU: the EU only acts where member states can't act as
  // effectively) and the fact member states retain fiscal/defense sovereignty, no EU army, most
  // decisions still need unanimity -> very strongly federal/confederal in nature. Directly elected
  // European Parliament, but a real, widely-discussed "democratic deficit" (unelected Commission,
  // opaque multi-layer governance) -> strongly but not maximally democratic. GDPR is literally the
  // world's strongest privacy framework, EU-pioneered -> strongly liberdade. Official "unity in
  // diversity" motto, Schengen free movement, though genuinely contested internally (Dublin
  // asylum-burden tensions, Hungary/Poland resisting relocation quotas) -> leans multicultura but
  // contested. No unified EU military (defense stays a national competence even with PESCO
  // cooperation); explicitly a "civilian power" peace project (2012 Nobel Peace Prize precisely for
  // preventing war among its own members) -> very strongly pacifist. Strong multilateralist,
  // international-law-first doctrine, sanctions as primary tool over force -> very strongly non-
  // interventionist. "Social market economy" is literally a Treaty goal (Art.3 TEU) alongside a
  // fundamentally market-based single market of free capital/goods movement -> near-center economia.
  // ECB is by treaty design one of the most independent central banks in the world, yet the EU is
  // simultaneously famous for extensive market regulation (GDPR, AI Act, single-market rules) ->
  // genuinely mixed controle. The EU IS the world's largest single trading bloc, deeply globalist
  // architecture, tempered by real CAP agricultural protectionism -> leans globalista. Officially
  // secular in institutional operation (the "Christian roots of Europe" language was deliberately
  // excluded from the failed EU constitutional treaty after fierce debate) -> leans irreligioso.
  // EU institutions use LGBT-rights/gender-equality protections as explicit membership-conditionality
  // leverage (used against Hungary and Poland specifically) -> very strongly progressive. "Green
  // Deal" carbon-neutral-by-2050 target, a strongly precautionary/GMO-skeptical regulatory culture,
  // and a cautious AI Act -> leans toward Biologia despite real Horizon Europe R&D investment.
  "uniao-europeia": {
    estrutura:     "CT,DT,CT,DT,CT,DT,C,D,DT,D,C,DT,CT,DT,C,C,CT,DT,CT,DT".split(","),
    representacao: "CT,D,CT,C,CT,D,C,C,C,D,C,D,D,D,CT,D,C,D,CT,DT".split(","),
    poder:         "D,C,D,CT,D,C,D,C,D,CT,D,C,C,CT,DT,C,C,C,DT,CT".split(","),
    imigracao:     "N,C,D,CT,N,C,D,CT,D,CT,N,CT,D,CT,N,C,DT,C,D,N".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,DT,CT,D,CT,C,CT,C,C,D,CT,DT,C,DT,CT".split(","),
    intervencao:   "CT,D,C,C,CT,D,CT,C,CT,D,CT,D,CT,DT,CT,D,CT,C,CT,D".split(","),
    economia:      "D,N,C,D,N,N,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "N,N,DT,C,N,D,N,N,D,C,N,N,DT,C,N,DT,N,DT,N,N".split(","),
    comercio:      "N,C,N,CT,D,C,C,CT,C,CT,N,CT,N,CT,C,N,N,CT,N,CT".split(","),
    religiao:      "C,D,CT,DT,C,C,C,D,C,C,D,C,C,C,C,C,C,D,C,C".split(","),
    moral:         "CT,DT,CT,DT,C,DT,CT,D,C,D,CT,DT,C,DT,C,DT,CT,DT,CT,D".split(","),
    tecnologia:    "N,C,D,C,D,CT,D,CT,D,CT,N,C,D,C,N,C,D,C,N,N".split(","),
  },

  // Reino Unido: parliamentary-sovereignty doctrine formally unitary, but real substantial 1998+
  // devolution (Scottish Parliament, Welsh Senedd, NI Assembly all have genuine lawmaking power,
  // asymmetric since England itself has none) -> leans federal more than the doctrine implies.
  // "Mother of Parliaments", very old continuous democracy, though the unlawful 2019 prorogation
  // and Brexit-referendum turmoil are real recent stress -> strongly democratic. Magna Carta/habeas
  // corpus liberty tradition vs. one of the world's densest CCTV networks and post-9/11/7-7 extended-
  // detention anti-terror law -> genuinely mixed, moderate liberdade lean. Brexit was substantially
  // an explicit "take back control of our borders" immigration-restriction mandate -> leans
  // assimilacao more than the placeholder's near-center reading, despite London's real historic
  // multicultural diversity. Independent nuclear deterrent, permanent UNSC seat, NATO founder,
  // extensive real expeditionary interventions (Iraq, Afghanistan, Libya) -> strongly militarist,
  // correction upward. That same extensive interventionist record (Iraq alongside the US especially)
  // -> strongly nationalist-assertive, correction downward on intervencao. Thatcher-era privatization
  // pioneer (BT, British Gas, British Airways) but the NHS remains a beloved universal-free-
  // healthcare institution -> leans privado but genuinely mixed. Bank of England independent since
  // 1997, "Big Bang" 1986 financial deregulation legacy -> leans livre mercado. Pioneer of 19th-
  // century global free trade, joined CPTPP 2023 post-Brexit -> very strongly globalista. Church of
  // England is a literal ESTABLISHED STATE CHURCH (monarch as Supreme Governor, bishops sit in the
  // Lords) even as lived religiosity is among the lowest in Europe -> genuinely contested, near-
  // center religiao. Gay marriage since 2014, strong LGBT legal protections, tempered by real
  // contentious trans-rights debate in UK media/politics -> leans progressive but contested. Strong
  // fintech/AI hub (DeepMind, London tech scene) and major pharma sector, tempered by unusually
  // strong historical anti-GMO sentiment -> leans pro-Tecnologia.
  "reino-unido": {
    estrutura:     "C,D,C,D,C,D,C,N,D,D,CT,D,C,D,C,C,C,D,C,D".split(","),
    representacao: "CT,D,CT,C,CT,D,CT,D,C,DT,C,D,D,D,CT,D,D,D,C,DT".split(","),
    poder:         "C,C,C,C,N,C,D,D,D,CT,N,C,D,CT,N,C,C,N,D,CT".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,N,C,N,D,DT,D,N,D".split(","),
    diplomacia:    "CT,D,C,DT,CT,D,C,DT,N,D,CT,D,CT,D,CT,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,CT,D,C,D,CT,D,C,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "D,CT,D,CT,D,C,D,CT,D,C,D,C,N,CT,D,CT,D,CT,N,CT".split(","),
    controle:      "C,CT,DT,CT,N,N,C,C,DT,CT,D,CT,DT,CT,N,CT,DT,DT,N,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "N,C,N,C,D,C,D,N,N,C,D,C,N,C,N,N,D,N,C,C".split(","),
    moral:         "C,N,C,N,N,N,C,N,N,N,C,N,D,C,N,D,C,D,N,C".split(","),
    tecnologia:    "C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,N,D,C,D".split(","),
  },

  // Hungria: unitary, historically centralized, and real further centralization under Orban (local-
  // government funding/autonomy cut, education centralized under KLIK) -> strongly unitario. Orban
  // himself labels his system "illiberal democracy": gerrymandering, ~80% of media under government-
  // aligned ownership, weakened judicial independence, yet elections remain formally competitive
  // (real opposition, real vote counts) -> leans autocratic, moderately. Government-info-control and
  // NGO-restriction laws (targeting Soros-linked groups), though short of full authoritarian control
  // -> leans seguranca. Orban's signature issue: explicit anti-immigration policy (2015 border
  // fence, flat rejection of EU relocation quotas, "illiberal Christian democracy" framed around
  // ethnic-cultural homogeneity) -> very strongly assimilacao, the most extreme of this batch.
  // Modest NATO-member military, but a notably Russia/China-friendlier foreign policy than peers
  // (repeatedly delayed EU Ukraine aid) -> near-center diplomacia. Explicit "sovereigntist" doctrine
  // resisting EU foreign-policy consensus -> leans nacionalista. Real state intervention/re-
  // nationalization of previously privatized utilities/banks alongside courting foreign (especially
  // Chinese/German) FDI -> near-center economia. MNB (central bank) has faced real political capture
  // under Orban-aligned leadership, strong dirigiste favoritism toward government-connected
  // businesses -> leans planejamento, more than the placeholder. Genuine mixed protectionist-populist
  // rhetoric against Brussels alongside pragmatic courting of strategic Chinese EV/battery FDI ->
  // leans protecionista. "Illiberal Christian democracy" foregrounds Christianity explicitly in the
  // constitutional preamble as core to national identity and EU-resistance -> strongly religioso.
  // Explicit anti-LGBT law (2021, banning LGBT content accessible to minors, condemned EU-wide) plus
  // aggressive pro-natalist traditional-family policy -> very strongly tradicionalista. Courts
  // significant EV/battery manufacturing FDI (BYD, CATL) as economic strategy without being an
  // innovation hub itself -> near-center tecnologia.
  hungria: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "C,D,C,C,C,N,C,D,C,C,C,C,N,C,D,C,C,N,C,C".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,D,C,D,C,C,N,C,D,D,N,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,N,D,C".split(","),
    economia:      "N,C,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,D,DT,C,C,D,C,D,C,C,C,D,DT,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,D,C,D,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "D,C,DT,CT,DT,C,D,CT,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "N,C,D,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,N,N".split(","),
  },
};
