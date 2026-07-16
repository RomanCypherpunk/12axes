// FQA040: turquia, ira, arabia-saudita, israel, africa-do-sul.
// Same methodology: grounded in real constitutional/institutional/policy facts, N where contested.

export const PROFILES = {
  // Turquia: unitary, historically centralized (Kemalist tradition), further concentrated by the
  // 2017 referendum switching to a presidential system -> leans unitario. Formally electoral but
  // real severe backsliding under Erdogan (post-2016-coup purges, jailed journalists/opposition,
  // captured judiciary), though genuinely competitive races still occur (2019 Istanbul mayoral
  // result stood) -> leans autocratic. Years-long state-of-emergency powers post-2016, one of the
  // world's top jailers of journalists -> strongly seguranca. Hosts the world's LARGEST refugee
  // population (3.6M+ Syrians) yet real rising domestic anti-refugee backlash and Kurdish-minority
  // repression -> genuinely contested imigracao. NATO's 2nd-largest army, real active interventions
  // (Syria, Libya, Nagorno-Karabakh) -> strongly militarist and strongly nationalist-assertive.
  // Erdogan-era unorthodox economics caused real currency crises; the central bank has faced severe,
  // well-documented political interference (multiple governors fired for resisting his low-rate
  // demands) -> leans planejamento more than the placeholder. Customs-union EU trade integration
  // alongside real "Buy Turkish" nationalist rhetoric -> leans protecionista. Historically strict
  // Kemalist secularism (like France's laicite) has given way to real explicit re-Islamization under
  // the AKP (Hagia Sophia reconverted to a mosque, 2020) -> strongly religioso. Explicit anti-LGBT
  // shift (Istanbul Pride banned/suppressed in recent years) -> strongly tradicionalista. Real
  // significant indigenous defense-tech success (Bayraktar drones globally significant) -> leans
  // pro-Tecnologia.
  turquia: {
    estrutura:     "C,C,C,C,C,D,C,C,D,D,C,D,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "C,D,C,C,C,N,C,D,C,C,C,C,N,C,D,C,C,N,C,C".split(","),
    imigracao:     "N,C,N,N,N,N,C,N,C,C,N,N,N,N,N,C,D,D,N,N".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,D,C,D,CT,C,CT,C,C,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "N,C,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,D,DT,C,C,D,C,D,C,C,C,D,DT,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,D,C,D,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "D,C,DT,CT,DT,C,D,CT,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,C,N".split(","),
  },

  // Ira: unitary Islamic Republic, real centralized clerical authority (Supreme Leader has final say)
  // -> strongly unitario. A unique hybrid: real elections for president/parliament but candidates
  // are vetted by an unelected Guardian Council of clerics, and ultimate power rests with the
  // unelected Supreme Leader (velayat-e faqih) -> very strongly autocratic. Morality police (Gasht-e
  // Ershad, responsible for Mahsa Amini's 2022 death and the ensuing mass protests), extensive
  // surveillance -> very strongly seguranca. Hosts a significant Afghan refugee population but
  // enforces a strong Persian/Shia ethno-religious identity and represses ethnic minorities (Kurds,
  // Baluchis, Arabs) -> leans assimilacao. Significant regional military power pursuing an explicit
  // "Axis of Resistance" proxy-network strategy (Hezbollah, Houthis, Iraqi militias) -> strongly
  // militarist and extremely nationalist-assertive (genuinely one of the most interventionist actors
  // in the sample via proxy warfare). Bonyad religious foundations and the IRGC control huge
  // economic sectors, and severe sanctions force real self-sufficiency ("resistance economy")
  // measures -> leans publico/planejamento, strongly protecionista. Supreme Leader is literally the
  // highest religious authority (velayat-e faqih) -> among the most extreme religioso profiles in
  // the dataset. Mandatory hijab enforcement, criminalized homosexuality with severe penalties ->
  // among the most extreme tradicionalista profiles, notwithstanding a real, well-documented
  // underground youth resistance culture. Real notable achievement in nuclear/missile/drone
  // technology despite sanctions-driven isolation elsewhere -> moderate tecnologia.
  ira: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,N,N,C,D,C,D,C,C,N,D,C,D,N,D,DT,D,N,D".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "C,D,N,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,N,N".split(","),
  },

  // Arabia Saudita: absolute monarchy, no federal structure, all authority flows from the King/Crown
  // Prince -> extreme unitario. No national elections at all -> among the most extreme autocratic
  // profiles alongside North Korea. Real documented human-rights abuses (Khashoggi murder 2018),
  // though MBS-era reforms have curtailed the religious police's power somewhat -> very strongly
  // seguranca. Over 30% of the population is foreign migrant labor under the kafala sponsorship
  // system, yet genuinely NOT integrated (no path to citizenship, kept structurally separate) while
  // state identity remains strongly Arab-Islamic ethnonational for citizens -> leans assimilacao.
  // One of the world's highest defense budgets per capita and a real, costly direct military
  // intervention in Yemen since 2015 -> strongly militarist and strongly nationalist-assertive,
  // tempered by real recent pragmatic diplomacy (China-brokered Iran detente, 2023). Aramco remains
  // majority state-owned despite its 2019 partial IPO, and Vision 2030's Public Investment Fund is a
  // massive top-down state-directed economic-transformation vehicle -> leans publico/planejamento,
  // more than the placeholder. Real "Saudization" labor-nationalization policy alongside efforts to
  // attract foreign investment -> near-center comercio. Home to Islam's two holiest sites, governed
  // historically by strict Wahhabi doctrine -> among the most extreme religioso profiles in the
  // dataset. Real recent social liberalization (cinemas, women driving, reduced guardianship) still
  // criminalizes homosexuality and retains guardianship-system remnants -> among the most extreme
  // tradicionalista profiles, while acknowledging genuine recent softening. The NEOM megaproject and
  // Vision 2030 explicitly brand a hyper-futuristic tech-diversification vision -> leans pro-
  // Tecnologia.
  "arabia-saudita": {
    estrutura:     "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,D,CT,DT,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,N,N,C,D,C,D,C,D,N,D,C,D,N,D,DT,D,N,D".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,DT,C,D,CT,C,CT,C,C,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,C,D,D,C,D,C,D,CT".split(","),
    economia:      "C,D,CT,D,C,D,CT,N,CT,DT,C,D,C,D,C,D,CT,N,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "C,D,C,N,C,C,C,D,C,C,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "C,D,C,D,C,D,C,D,N,C,C,D,C,N,C,D,N,N,C,D".split(","),
  },

  // Israel: unitary state, no federal structure, real local-municipal autonomy -> leans unitario.
  // Vibrant multi-party parliamentary democracy (proportional representation, robust independent
  // judiciary), though the 2023 judicial-reform crisis sparking massive protests over attempts to
  // weaken court power is a real recent stress -> leans democratic. Extensive security apparatus
  // (checkpoints, administrative detention, especially in the occupied territories) with mandatory
  // conscription, alongside a real robust civil-liberties/protest culture for Israeli citizens
  // specifically -> strongly seguranca overall given the occupation's scale. The Law of Return grants
  // automatic citizenship to any Jewish person worldwide -- an explicit ethno-religious immigration
  // system -- while maintaining a very different track for the Arab-Israeli/Palestinian population
  // -> strongly assimilacao. Mandatory military conscription for most citizens, an undeclared but
  // widely acknowledged nuclear capability, frequent military operations (Gaza, Lebanon, Iran-linked
  // strikes) -> very strongly militarist and strongly nationalist-assertive. Real strong private-
  // sector "Start-Up Nation" tech economy alongside a real historical kibbutz/Histadrut labor-
  // socialist heritage (much diminished today) and significant defense-industrial state involvement
  // -> near-center economia/controle. Highly trade-open tech-export economy -> leans globalista. No
  // formal separation of religion and state (the Orthodox rabbinate controls Jewish marriage/divorce/
  // conversion), a defining religious-secular internal divide, alongside a large secular population
  // -> leans religioso, moderately. Tel Aviv is a major global gay-pride destination even though civil
  // marriage (including gay marriage) isn't performed domestically due to rabbinate control -> near-
  // center moral, genuinely contested rather than simply traditionalist. Globally significant tech/
  // biotech/defense-tech hub, world-leading per-capita VC investment -> strongly pro-Tecnologia.
  israel: {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,D,C,C,C,N,C,D,C,D,C,D,N,C,C,D,D,C,C,D".split(","),
    poder:         "CT,D,CT,C,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "CT,DT,C,D,CT,D,CT,D,CT,D,C,D,CT,D,C,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,C,D,CT,D,CT,D,CT,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,C,D,D,C,D,C,D,CT".split(","),
    economia:      "N,C,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,C,DT,C,N,N,C,C,D,CT,D,CT,DT,CT,N,CT,D,DT,N,C".split(","),
    comercio:      "D,C,D,CT,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    religiao:      "D,C,D,C,C,CT,D,D,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "C,N,C,N,N,N,C,N,N,N,C,N,D,C,N,N,C,D,C,N".split(","),
    tecnologia:    "CT,DT,C,D,CT,D,C,D,C,N,CT,D,C,N,CT,D,C,C,CT,D".split(","),
  },

  // Africa do Sul: unitary with real significant provincial (9 provinces) government under the 1996
  // post-apartheid constitution -> near-center estrutura. Vibrant multiparty democracy since 1994,
  // strong constitutional court, and the real 2024 election result (ANC losing its outright
  // majority for the first time, forming a coalition) shows genuine electoral competitiveness ->
  // strongly democratic. Very high crime/security challenges alongside one of the world's most
  // progressive constitutional Bills of Rights -> near-center poder. Explicit "Rainbow Nation"
  // pluralist constitutional identity (Tutu's framing) set against real, documented xenophobic
  // violence against African immigrants (2008/2015/2019 riots) -> leans multicultura, a correction
  // from the placeholder's assimilacao-leaning reading. Moderate military, not regionally
  // militarized, though the real 2024 ICJ genocide case against Israel shows an assertive
  // international-law-based diplomatic posture rather than military assertion -> leans pacifista and
  // leans nao-intervencionista (BRICS non-alignment, active AU peacekeeping role). Most industrialized
  // African economy with a real significant state-owned Eskom electricity utility (despite its
  // well-documented crisis) -> leans publico. Real significant BEE (Black Economic Empowerment)
  // state-directed redistributive program, a defining post-apartheid economic intervention -> leans
  // planejamento. Major commodity exporter (gold, platinum) pursuing diversified BRICS trade ties,
  // with some real local-content protectionism -> near-center comercio. Genuinely religious society
  // (large Christian majority, real historical anti-apartheid church leadership) though
  // constitutionally secular -> leans religioso, moderately. Constitutionally VERY progressive --
  // the first African country to legalize gay marriage (2006), explicit constitutional protection
  // against sexual-orientation discrimination -- a genuine landmark, though real social conservatism
  // persists in practice -> leans progressive, a correction upward from the placeholder. Most
  // industrialized African tech/fintech sector set against a severe, real Eskom energy-crisis
  // constraint and a mining-dependent resource economy -> near-center tecnologia.
  "africa-do-sul": {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,C,C,C,D,D,C,C,C,C,D".split(","),
    representacao: "CT,D,CT,C,CT,D,CT,D,C,DT,C,D,D,D,CT,DT,D,D,CT,DT".split(","),
    poder:         "C,C,C,CT,N,C,C,D,C,C,N,C,C,CT,D,C,N,N,D,C".split(","),
    imigracao:     "N,C,D,CT,D,C,D,CT,D,CT,N,CT,D,CT,D,CT,DT,C,DT,N".split(","),
    diplomacia:    "D,CT,D,CT,D,CT,N,CT,N,CT,N,C,C,C,N,CT,DT,D,D,C".split(","),
    intervencao:   "C,D,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,C,C,D".split(","),
    economia:      "D,N,C,D,D,DT,C,N,CT,D,C,C,C,D,N,D,C,N,N,D".split(","),
    controle:      "C,D,D,C,C,D,C,D,C,C,C,D,DT,D,C,C,C,DT,C,D".split(","),
    comercio:      "N,C,N,CT,D,C,C,C,C,C,N,C,C,N,C,N,N,N,C,C".split(","),
    religiao:      "D,C,D,C,C,CT,D,D,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "C,N,C,N,C,D,C,D,C,D,C,N,C,C,N,N,C,D,C,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,N,D,C,N,N,N,D,N,C,N".split(","),
  },
};
