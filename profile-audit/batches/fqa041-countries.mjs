// FQA041: atenas-democratica, esparta, imperio-macedonico, imperio-romano,
// sacro-imperio-romano-germanico -- the first historical (non-contemporary) country-catalog batch.
// Modern quiz questions are necessarily anachronistic for ancient/medieval polities (no view on "IA"
// or "transgenicos"). Method: interpret each question through the SPIRIT of the underlying
// disposition it probes (centralized vs. dispersed authority, coercive control vs. personal liberty,
// closed vs. open citizenship, martial vs. peaceable posture, planned vs. market allocation, state-
// fused vs. separate religion, hierarchical-traditional vs. innovation-embracing), grounded in real,
// specific, well-documented historical facts about each polity -- not vibes.

export const PROFILES = {
  // Atenas Democratica: a single unified polis (not a federation), but its demes (local wards) had
  // real functions (local assemblies, elected officials, citizenship rolls, local cults) providing
  // genuine subsidiarity even though the central Ecclesia held final sovereignty -> moderately
  // federal, less extreme than the placeholder's very-high reading. THE original direct democracy:
  // all male citizens spoke/voted directly in the Assembly, and most public offices were filled by
  // sortition (lottery among citizens) rather than election -- a literal real-world match for "cargos
  // sorteados como num juri" -> very strongly democratic. Real parrhesia (free-speech) ideal for
  // citizens, but also real ostracism (banishing perceived threats without trial) and the execution
  // of Socrates for "corrupting the youth", plus a slave-labor-dependent economy foundational to
  // citizen leisure for political life -> leans seguranca despite the free-speech ideal. Metics
  // (resident foreigners) had NO path to citizenship, and Pericles' 451 BC Citizenship Law actually
  // TIGHTENED requirements (both parents had to be Athenian) -> leans assimilacao, a closed citizen
  // body. Its navy was literally the basis of its democracy (thetes/rowers earned political
  // inclusion via naval service) and it fought the Peloponnesian War -> leans militarist. Extremely
  // imperial toward its "allies" (Delian League tribute extraction, the Melian Massacre, the
  // unprovoked Sicilian Expedition) -> strongly nationalist-assertive. State silver mines (Laurion)
  // funded the navy and wealthy citizens funded festivals/theater via mandatory liturgies -- real
  // state-directed resource use -- alongside a genuine private-trade economy -> near-center economia,
  // leaning publico. Grain-supply regulation was a real state concern given import-dependency ->
  // moderate controle. Heavily trade-dependent (grain imports essential, extensive Mediterranean
  // network, tribute partly secured trade routes) -> leans globalista. Civic religion was fused with
  // political life (state festivals, oracles consulted before major decisions, the Parthenon as a
  // religious-political monument) -> leans religioso. Deeply patriarchal (women had no political/
  // legal rights) and slavery-dependent -> leans tradicionalista. Real philosophical/scientific
  // ferment (the birthplace of Western philosophy, rational inquiry genuinely prized) -> leans
  // toward the innovation/Tecnologia pole relative to its era.
  "atenas-democratica": {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,C,C,C,D,D,C,C,C,C,D".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,CT,DT,CT,CT,C,DT,CT,DT,D,DT,CT,DT".split(","),
    poder:         "C,D,C,C,N,D,C,D,C,D,C,D,C,D,C,D,C,N,C,D".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D,C,D,CT,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "N,D,C,D,N,DT,C,N,C,DT,N,C,C,D,N,D,C,N,N,D".split(","),
    controle:      "C,D,N,C,N,D,C,D,C,D,C,D,N,D,C,D,C,DT,N,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,C,N,C,CT,C,N,CT,N,C,N,CT,C,C".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,C,N,C,D,C,N,C,N,N,N,C,D".split(","),
  },

  // Esparta: a unique "mixed constitution" (dual hereditary kings + elected Ephors + Gerousia +
  // limited Apella) providing real internal checks, but as a SINGLE unified polis directly ruling
  // subjugated Messenian territory -> unitario in structure. Genuinely oligarchic, not democratic:
  // the Apella could only vote yes/no on proposals put to it, never debate or amend -> strongly
  // autocratic. The most militarized/regimented society imaginable: the agoge total-immersion
  // military training from childhood, reported infanticide of "weak" infants, total subordination of
  // private life to the state -> the most extreme seguranca profile in this batch. Famously
  // xenophobic (xenelasia -- periodic expulsion of foreigners, deep suspicion of outside corrupting
  // influence) -> the most extreme assimilacao profile. "With your shield or on it": the entire
  // society existed to produce warriors -> extreme militarist. Historically a somewhat reluctant
  // hegemon focused on controlling the Peloponnese/Messenia rather than far-flung conquest (unlike
  // Athens), though it ultimately projected real power (Peloponnesian War) -> leans nationalist-
  // assertive but not maximally. Land was allocated to citizens (Spartiates) via kleros allotments
  // worked by Helot slaves; Spartiates were explicitly FORBIDDEN from trade/commerce/manual labor ->
  // strongly publico/collective, a genuinely unique anti-commercial model. Deliberately used
  // near-worthless iron-bar currency specifically to discourage trade and wealth accumulation ->
  // extremely protecionista/anti-trade and strongly planejamento (state-mandated communal messes,
  // state control over marriage/reproduction in service of producing warriors). Consulted Delphi
  // like other Greeks but defined its identity through militarism more than piety -> near-center
  // religiao. Extremely rigid, conformist, hierarchical (though genuinely unusual: Spartan women had
  // more property rights/physical education than Athenian women) -> strongly tradicionalista.
  // Deliberately conservative and suspicious of new/foreign ideas, resistant to change for centuries
  // -> strongly leans toward the traditional/Biologia pole, the opposite of innovation-embracing.
  esparta: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,D,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,CT,D,CT,DT".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,C,D,C,D,C,C,C,D,C,D,C,C,D,D,C,D,N,D,C".split(","),
    economia:      "C,DT,CT,DT,C,DT,CT,D,CT,DT,N,D,C,D,C,D,CT,DT,C,DT".split(","),
    controle:      "CT,DT,C,DT,C,D,CT,D,CT,D,CT,DT,C,D,C,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:      "N,N,N,N,N,C,N,D,N,C,N,C,N,C,N,N,N,N,C,C".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,D,D,CT".split(","),
    tecnologia:    "D,CT,D,C,D,C,D,C,N,D,D,C,D,C,D,C,C,C,D,C".split(","),
  },

  // Imperio Macedonico: an absolute military monarchy, though Alexander pragmatically retained/
  // adapted existing Persian satrapal administration -> leans unitario but with real administrative
  // pluralism tempering it. No elected institutions; Alexander's authority stemmed from conquest and
  // self-proclaimed divine descent -> extremely autocratic. A military-conquest empire that
  // brutally suppressed revolts (the destruction of Thebes as a deterrent example) alongside a real
  // cultural-tolerance/fusion policy -> leans seguranca. Famous for an explicit fusion policy
  // (promoted Greek-Persian intermarriage, adopted local customs, founded diverse multicultural
  // cities like Alexandria) -- one of history's most deliberate multicultural-fusion imperial
  // projects -> strongly multicultura, the opposite pole from Sparta/Athens. Definitionally the most
  // militarist entity conceivable (Alexander's legacy is conquest from Greece to India) -> extreme
  // militarist and extreme nationalist-assertive/expansionist. Took over and adapted Persian
  // imperial economic infrastructure (royal roads, tribute) -> near-center economia. Standardized
  // coinage across the empire as a deliberate economic-integration policy -> leans planejamento.
  // Promoted trade integration (standardized currency, founded trade-hub cities) -> leans globalista.
  // Practiced real religious syncretism (adopted Egyptian pharaonic divine status, Persian
  // traditions) rather than dogmatic religious governance -> near-center religiao. Hierarchical
  // military-aristocratic values but genuinely unusual openness to cultural mixing/intermarriage for
  // its era -> near-center moral. Real significant military-engineering innovation (siege engines)
  // and urbanization (~20 cities founded, most named Alexandria) -> leans pro-Tecnologia relative to
  // its era.
  "imperio-macedonico": {
    estrutura:     "D,C,D,C,D,C,D,C,DT,C,N,C,D,C,DT,C,D,C,D,C".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,C,N,C,C".split(","),
    imigracao:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,CT,CT,D,CT".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "N,C,C,D,N,D,C,N,C,D,N,C,C,D,N,D,C,N,N,D".split(","),
    controle:      "C,D,N,C,C,D,C,D,C,C,C,D,N,D,C,C,C,DT,N,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,CT,N,C,C,CT,N,CT,N,C,N,CT,C,CT".split(","),
    religiao:      "N,N,N,N,N,C,N,D,N,C,N,C,N,C,N,N,N,N,C,C".split(","),
    moral:         "N,C,D,C,N,C,N,D,N,N,D,C,N,C,N,N,N,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,C,D,C,N,C,N,N,N,C,D".split(","),
  },

  // Imperio Romano: highly centralized under the emperor, though "municipia" retained real local
  // charters/self-government within the imperial framework -> leans unitario with real nuance. The
  // imperial period (post-27 BC) reduced the Senate to a largely ceremonial role under the emperor's
  // supreme authority -> strongly autocratic. Extensive control apparatus (legions, road network for
  // rapid response), crucifixion as public terror-deterrent, harsh suppression of revolts (Judea,
  // Boudica), yet also a real developed legal system with citizen appeal rights (provocatio) ->
  // leans seguranca. Famous for RELATIVELY open naturalization -- the 212 AD Edict of Caracalla
  // extended citizenship to nearly all free inhabitants of the empire, unusually inclusive by
  // ancient standards -> leans multicultura, distinctly more than the Greek city-states. Definitionally
  // militarist (the legions, Pax Romana maintained by military dominance) and definitionally
  // expansionist (conquered across three continents) -> extreme militarist and extreme nationalist-
  // assertive. Real state welfare functions (the annona grain dole for Rome's population, state
  // ownership of mines) alongside a vibrant private Mediterranean trade economy -> leans publico.
  // Diocletian's 301 AD Edict on Maximum Prices is a famous real historical instance of state price
  // control -> leans planejamento. Extensive Mediterranean-wide trade facilitated by Roman roads/
  // peace/currency, though real customs duties existed at provincial borders -> leans globalista.
  // State religion (emperor cult, official pantheon, state-sponsored festivals) deeply fused with
  // political authority throughout most of its history -> leans religioso. Hierarchical, patriarchal,
  // slavery-dependent -> leans tradicionalista. Real major engineering achievements (roads, aqueducts,
  // concrete) -> leans pro-Tecnologia relative to its era.
  "imperio-romano": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,N".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,N,CT,DT,C,D,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,C,C,C,D,C,D,C,C,C,D,N,D,C,C,C,DT,N,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,CT,N,C,CT,CT,N,CT,N,C,N,CT,C,CT".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,C,D,C,N,C,N,N,N,C,D".split(","),
  },

  // Sacro Imperio Romano-Germanico: THE textbook case of extreme decentralization -- hundreds of
  // semi-autonomous principalities, free cities, and bishoprics; the emperor was elected by
  // Prince-Electors with limited real power over member territories (Voltaire's "neither holy, nor
  // Roman, nor an empire" precisely because of this weak center) -> extremely federal, the highest
  // reading in this batch. Real elective element for the emperor plus genuine republican/oligarchic
  // self-government in many free cities, but fundamentally a feudal hierarchy for most territories
  // (hereditary princes/bishops) -> near-center representacao, genuinely mixed. Real feudal social
  // control (serfdom in many territories) and religious-conformity enforcement, though intensity
  // varied hugely by principality given the fragmented legal patchwork -> moderate seguranca.
  // Each principality/free city had its own laws and guild membership rules restricting who could
  // settle/practice trades -- a genuinely "closed," insular local-identity system -- even though the
  // empire as a whole spanned German, Italian, Czech, and Dutch-speaking territories -> leans
  // assimilacao at the local level. Real major warfare, above all the catastrophic Thirty Years' War
  // (1618-1648), though the decentralized structure meant limited unified military capacity ->
  // near-center diplomacia. The fragmented structure meant individual princes largely pursued
  // independent foreign policies rather than unified external assertion -> leans nao-
  // intervencionista, the empire as a whole rarely acted as a single expansionist actor. A real mix
  // of feudal agrarian economy in most territories alongside vibrant free-city mercantile economies
  // (the Hanseatic League, Augsburg, Nuremberg) -> near-center economia. No unified imperial economic
  // planning existed, but local guild-regulation was real and pervasive within each territory ->
  // near-center controle. Real significant internal trade networks (Hanseatic League, trade fairs)
  // undercut by notoriously fragmented territorial tolls (a merchant might pay tolls at dozens of
  // checkpoints along the Rhine) -> leans protecionista at the local/territorial level. The empire
  // whose fracturing over religion defined much of its history (the Reformation, the 1555 Peace of
  // Augsburg's "cuius regio, eius religio", prince-bishoprics as literal ecclesiastical territories)
  // -> among the most strongly religioso profiles in the dataset. Feudal-hierarchical, deeply
  // traditional social order, Reformation-era religious conflict -> strongly tradicionalista. The
  // printing press was invented within the Empire (Gutenberg, Mainz) -- a hugely significant
  // innovation -- yet most of the population lived a traditional agrarian-feudal existence -> near-
  // center tecnologia, leaning traditional given the lived reality of most subjects.
  "sacro-imperio-romano-germanico": {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "C,N,C,C,C,N,C,D,C,D,C,D,N,D,C,D,C,N,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,N,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,D,D,N,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "C,D,C,C,C,C,C,C,C,N,C,D,CT,DT,C,C,C,N,C,D".split(","),
    economia:      "N,N,C,D,N,DT,C,N,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "N,N,DT,C,N,D,N,N,D,C,N,N,DT,C,N,DT,N,DT,N,N".split(","),
    comercio:      "C,D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,N".split(","),
    religiao:      "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "N,C,D,C,N,C,D,C,D,N,C,C,N,C,N,D,D,D,N,N".split(","),
  },
};
