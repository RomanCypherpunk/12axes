// FQA043: italia-fascista-mussolini, chile-de-pinochet, uniao-sovietica-urss, china-maoista,
// camboja-do-khmer-vermelho-pol-pot. Historical/regime profiles, same interpretive method as
// FQA041/042: spirit-of-the-question grounded in documented facts.

export const PROFILES = {
  // Italia Fascista: abolished regional/local autonomy (podesta appointed, not elected) -> strongly
  // unitario. One-party dictatorship after 1926 opposition ban, Duce cult -> extremely autocratic.
  // OVRA secret police, suppression of dissent -> strongly seguranca. Explicit "Italianization" of
  // annexed territories (South Tyrol, Istria) plus the 1938 anti-Jewish Racial Laws -> strongly
  // assimilacao. Invaded Ethiopia (1935) and Albania (1939), entered WWII, explicit "Roman Empire"
  // revival rhetoric -> strongly militarist and strongly nationalist-assertive. The Stato
  // Corporativo blended private ownership with state-coordinated syndicates; IRI (Istituto per la
  // Ricostruzione Industriale) was a massive state holding company -> leans publico. Autarky was
  // explicit doctrine especially after League of Nations sanctions over Ethiopia (Battle for Grain,
  // Battle for Lira) -> strongly planejamento and strongly protecionista. The 1929 Lateran Treaty
  // made Catholicism the state religion, a real formal church-state fusion -> strongly religioso.
  // Pronatalist policy, patriarchal family ideology -> strongly tradicionalista. A real modernization
  // push (aviation records, infrastructure) sat alongside a romanticized agrarian "ruralism"
  // ideology (the Battle for Grain was partly about agrarian self-sufficiency virtue) -> near-center
  // tecnologia.
  "italia-fascista-mussolini": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "N,D,C,D,N,C,N,C,C,D,N,C,C,D,N,N,C,C,N,D".split(","),
    controle:      "CT,DT,C,C,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:      "D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,C".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "C,D,C,D,C,D,C,D,N,C,C,D,C,N,C,N,D,N,C,D".split(","),
  },

  // Chile de Pinochet: military-junta centralized political power (banned Congress/parties) ->
  // leans unitario. Extremely autocratic (no elections, dissolved Congress). DINA secret police,
  // real severe documented human-rights abuses (Villa Grimaldi, forced disappearances) -> extremely
  // seguranca. Cold-War anticommunist military buildup and Operation Condor cross-border repression
  // coordination (including the 1976 assassination of Orlando Letelier in Washington DC, a real
  // direct extraterritorial operation) -> leans militarist and leans nationalist-assertive despite
  // officially "internal" security framing. THE defining trait: the "Chicago Boys" pioneered radical
  // free-market privatization of pensions, healthcare, and utilities -> extremely privado and
  // extremely livre mercado. Pioneered real unilateral trade-tariff liberalization -> strongly
  // globalista. Real significant Catholic Church institutional presence (even as the Church became a
  // real center of human-rights resistance via the Vicaria de la Solidaridad) -> leans religioso.
  // Authoritarian-conservative social order suppressing leftist/progressive movements -> strongly
  // tradicionalista. Not particularly defined by technology policy either way -> near-center.
  "chile-de-pinochet": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,C,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,N,N,C,N,N,N,C,C,N,N,N,C,N,N,D,D,N,N".split(","),
    diplomacia:    "C,D,C,D,CT,D,C,D,C,D,C,C,CT,D,C,D,C,DT,C,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,CT,D,C,D,CT,C,D,D,C,D,C,D,CT".split(","),
    economia:      "D,CT,D,CT,D,CT,N,CT,D,CT,D,C,N,C,D,CT,D,CT,C,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "N,C,C,N,C,D,N,N,D,N,N,D,C,N,N,N,D,N,C,N".split(","),
  },

  // Uniao Sovietica: constitutionally federal (15 republics) but "democratic centralism" gave the
  // CPSU total real control over all republics -> leans unitario despite the formal federal
  // structure. One-party state, no competitive elections -> extremely autocratic, near the dataset
  // floor. KGB, the Gulag system -> among the most extreme seguranca profiles. Real internationalist
  // "Soviet peoples" rhetoric coexisted with real forced ethnic deportations (Chechens, Crimean
  // Tatars, Volga Germans) and Russification pressure -> leans assimilacao, a correction from the
  // placeholder's multicultura-leaning reading given the severe deportation record. Superpower
  // military (nuclear arsenal, Warsaw Pact) -> strongly militarist. Extremely interventionist
  // (Hungary 1956, Czechoslovakia 1968, Afghanistan 1979, extensive proxy wars) -> strongly
  // nationalist-assertive. Fully collectivized/nationalized economy, Gosplan central planning, no
  // private property in the means of production -> among the most extreme publico/planejamento
  // profiles. Largely isolated from global capitalist trade (COMECON bloc) -> strongly protecionista.
  // Officially atheist state doctrine with systematic religious persecution (destroyed churches,
  // persecuted clergy) -> among the most extreme irreligioso profiles. A genuine complexity: the
  // 1920s had real progressive elements (early legal abortion, women's-equality rhetoric) that
  // Stalin later reversed (recriminalized homosexuality 1934, restricted divorce/abortion) -> near-
  // center moral, reflecting this real trajectory. Real significant technological achievement
  // (Sputnik, Gagarin, the nuclear/space program) -> strongly pro-Tecnologia.
  "uniao-sovietica-urss": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:      "CT,DT,C,C,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,D,C,DT,C,C,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "C,N,C,N,C,D,C,D,D,D,D,C,D,D,N,D,C,D,D,D".split(","),
    tecnologia:    "CT,DT,C,D,CT,D,C,D,CT,D,CT,D,C,D,CT,D,C,C,CT,D".split(","),
  },

  // China Maoista: unitary one-party state, extreme centralization especially during the Cultural
  // Revolution -> strongly unitario. Mao personality cult, no competitive elections -> among the
  // most extreme autocratic profiles. Extreme mass mobilization/surveillance (Red Guards, extensive
  // purges, laogai labor camps) -> among the most extreme seguranca profiles. Han-centric national
  // unification ideology plus real suppression of Tibet (post-1950 invasion) and other minorities ->
  // leans assimilacao, a correction from the placeholder's multicultura-leaning reading. Korean War
  // intervention, border conflicts with the USSR/India/Vietnam -> leans militarist. Supported
  // communist insurgencies globally and fought border wars -> leans nationalist-assertive. Total
  // collectivization (Great Leap Forward communes, abolished private property) -> among the most
  // extreme publico/planejamento profiles. Extreme isolation/autarky (Great Leap Forward self-
  // sufficiency ideology, minimal foreign trade) -> strongly protecionista. Officially atheist,
  // extreme religious persecution especially during the Cultural Revolution (destroyed temples,
  // persecuted religious leaders) -> among the most extreme irreligioso profiles. Genuine radical
  // gender-equality rhetoric ("women hold up half the sky") and upheaval against traditional
  // Confucian hierarchy, alongside extreme totalitarian conformity -> near-center moral, leaning
  // progressive given the real anti-traditional rhetoric. Pursued a real nuclear-weapons program yet
  // the Great Leap Forward's backyard-furnace campaign was a technologically primitive disaster, and
  // the Cultural Revolution was explicitly anti-intellectual (persecuted scientists/educated people)
  // -> near-center tecnologia, reflecting this genuine mixed record.
  "china-maoista": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,CT,D,CT,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:      "CT,DT,C,C,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,D,C,DT,C,C,C,DT,C,D,C,D,C,D,C,D,C,DT,C,D".split(","),
    moral:         "C,N,C,N,C,D,C,D,D,D,D,C,D,D,N,D,C,D,D,D".split(","),
    tecnologia:    "C,D,N,D,C,D,C,D,D,D,N,D,C,D,N,D,D,N,C,D".split(","),
  },

  // Camboja do Khmer Vermelho: total Angkar ("the Organization") control -> the most extreme
  // unitario/autocratic profile in the dataset alongside Alemanha Nazista. The most extreme
  // totalitarian security state possible: genocide (the Killing Fields, S-21 Tuol Sleng), forced
  // labor, execution for wearing glasses or speaking a foreign language -> among the most extreme
  // seguranca profiles. Explicit ethnic-purity genocidal ideology (targeted ethnic Vietnamese,
  // Chinese, and Cham Muslims specifically) with a radical agrarian-Khmer-purity doctrine -> among
  // the most extreme assimilacao profiles. Real cross-border raids into Vietnam provoked the 1979
  // Vietnamese invasion that toppled the regime -> leans militarist and leans nationalist-assertive.
  // THE most extreme case conceivable: literally abolished money and private property entirely,
  // forced total agrarian collectivization, evacuated the cities -> the most extreme publico/
  // planejamento profile in the dataset. Abolished currency and trade entirely -> among the most
  // extreme protecionista profiles. Officially abolished religion (banned Buddhism, the traditional
  // majority faith, executed monks) -> among the most extreme irreligioso profiles. "Year Zero"
  // ideology explicitly sought to destroy ALL prior culture/tradition, abolishing family structures
  // and imposing Angkar-arranged marriages -- yet what replaced the old order was itself an
  // extremely rigid, conformist new order, not a liberatory one -> leans tradicionalista overall.
  // THE most extreme anti-technology regime conceivable: deliberately evacuated cities, destroyed
  // modern education, executed the literate/educated as class enemies -> the most extreme
  // Biologia-pole (anti-Tecnologia) profile in the dataset.
  "camboja-do-khmer-vermelho-pol-pot": {
    estrutura:     "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,C,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    controle:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:      "C,D,C,DT,C,C,C,DT,C,D,C,D,C,D,C,D,C,DT,C,D".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "DT,CT,DT,CT,DT,CT,DT,CT,D,DT,DT,CT,DT,CT,DT,CT,CT,CT,DT,CT".split(","),
  },
};
