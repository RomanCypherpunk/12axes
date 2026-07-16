// FQA056 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// imperio-persa-aquemenida: c. 550-330 BCE — the first "universal empire," governed dozens of peoples
//   through satrapies with real local autonomy, tolerated local laws/religions/languages (the Cyrus
//   Cylinder, freeing Jews from Babylonian exile to rebuild the Temple), built the Royal Road and a
//   postal relay system, used royal inspectors ("the King's Eyes and Ears") for oversight rather than
//   direct rule.
// comuna-de-paris: 72 days in 1871 — genuine direct democracy with revocable mandates, worker self-
//   management of workshops, church-state separation, salary caps limiting officials to worker-level
//   pay, crushed in the violent "Bloody Week" (an estimated 10,000-20,000 killed by the Versailles army).
// catalunha: contemporary Spanish autonomous region — the 2017 independence referendum was declared
//   illegal by Madrid (leaders jailed/exiled, later pardoned/amnestied), runs its own police force
//   (Mossos d'Esquadra) and an assertive Catalan-language school-immersion policy, Barcelona anchors an
//   industrial/cosmopolitan, deeply trade-open economy.
// florenca-renascentista: 14th-16th century — a guild-restricted republic that became a de facto
//   Medici-family oligarchy after 1434 (with a brief Savonarola theocratic interlude, 1494-98), Medici
//   Bank pioneered international merchant-banking capitalism, extraordinary artistic patronage
//   (Michelangelo, Botticelli), Machiavellian balance-of-power diplomacy fought largely through hired
//   condottieri mercenaries rather than citizen armies.
// roma-republicana: c. 509-27 BCE — Polybius's celebrated "mixed constitution" (consuls, Senate,
//   popular assemblies, tribunes of the plebs), expanded via citizen-legion warfare and an alliance
//   (socii) system before direct annexation, civic religion (augury, pontifex maximus) fused with
//   politics, a slave-based economy alongside a free citizen-farmer class.

const IMPERIO_PERSA_AQUEMENIDA = {
  // Satrapies (roughly 20-30 provinces) were governed by satraps with real day-to-day administrative
  // and local-law authority, subject to oversight by royal inspectors rather than direct micromanagement
  // from Persepolis/Susa — a genuinely delegated, if ultimately autocratic-backstopped, structure.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // An absolute hereditary "King of Kings" monarchy with no popular assembly or electoral mechanism of
  // any kind at the imperial level — satraps and local elites held delegated administrative power, not
  // political representation for the governed populations.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // The Cyrus Cylinder and the empire's actual administrative practice explicitly tolerated local
  // languages, laws, and religions (Jews were funded to rebuild the Jerusalem Temple; Egyptian and
  // Babylonian religious institutions were patronized rather than suppressed) — a deliberate policy of
  // pluralistic accommodation extraordinary for its era, not forced cultural assimilation.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Fielded one of history's largest multi-ethnic armies (drawing levies from across the empire) and
  // fought major wars of conquest (Egypt, Babylon, the Greco-Persian Wars) — a genuinely powerful
  // military state, though it also relied heavily on negotiated loyalty and tribute over pure coercion.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Expansion under Cyrus, Cambyses, and Darius built the empire in a few decisive generations and then
  // shifted toward consolidation/administration (Darius's reforms) rather than Rome's centuries-long,
  // continuously renewed cycle of conquest — comparably expansionist in outcome, but a different
  // conquer-then-administer rhythm than Rome's sustained multi-century war machine.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","C"],
  // A tribute-based economy: satrapies paid fixed annual tribute (partly in the empire's own daric
  // gold coinage, a state-standardized currency) funding the crown and army rather than a free
  // market-price system.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // The Royal Road and a state-run postal relay system (the pre-modern world's fastest long-distance
  // communication network) were built explicitly to move royal tribute, troops, and trade across the
  // empire — deliberately state-integrated commerce rather than laissez-faire trade.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Zoroastrianism was the court/dynastic religion (Ahura Mazda invoked in royal inscriptions) but was
  // never imposed as a state religion on subject peoples — religion mattered greatly to the ruling
  // dynasty's own legitimacy claims while being administratively tolerant of others' faiths.
  religiao: ["C","C","C","D","C","D","C","D","C","D","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","N","D","N","N","N","N","D","D","N"],
  // Pioneered qanat underground-irrigation engineering, a standardized imperial road/postal
  // infrastructure network, and the daric as one of history's first widely standardized state
  // currencies — genuinely sophisticated practical/civil engineering for its era.
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","D","N","D","N","N","N","N","D"],
};

const COMUNA_DE_PARIS = {
  // Paris governed itself independently of the national Versailles government for 72 days, explicitly
  // rejecting Thiers' centralized national authority — a real, if short-lived, radical municipal
  // secession/autonomy experiment.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The Commune Council was directly elected with explicitly revocable mandates (delegates could be
  // recalled by their electing wards at any time) — genuine, radical direct-democratic accountability
  // exceeding even most modern representative systems.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","CT","DT","CT","C"],
  // Abolished the standing police-army in favor of the citizen National Guard, abolished the death
  // penalty and conscription, though it did use revolutionary tribunals against suspected Versailles
  // collaborators as the siege intensified — largely liberty-maximizing with real wartime exceptions.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","D","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","DT","C","DT","C","DT","C","DT","C","D","C","D","C","D","D","DT","C","DT","C"],
  diplomacia: ["D","C","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Mandated worker self-management (autogestion) of abandoned workshops, capped official salaries at
  // the level of an average worker's wage — deliberate, radical economic egalitarianism and
  // collectivized-production experimentation.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","DT","C","DT","C","D","N","N","D","DT","C","DT","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  // Formally separated church and state and secularized public education (removing clergy from schools)
  // — a decisive, explicit break from Second Empire church-state fusion.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Women organized and participated extensively (the Union des Femmes), banned night work for
  // bakers on humanitarian grounds, though formal female suffrage was not enacted within the brief
  // 72-day window — genuinely progressive in practice even where not fully codified in law.
  moral: ["C","D","C","D","C","DT","C","N","C","DT","C","DT","C","N","N","D","C","DT","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","C","N","N","N","N","C","N","C","N","N","N","N","N"],
};

const CATALUNHA = {
  // Runs its own police force (Mossos d'Esquadra), health service, and education system under Spain's
  // "State of Autonomies" — one of the most devolved regional governments in Europe, short of full
  // federal statehood.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D"],
  // A functioning regional democracy nested within Spain's national one, but the 2017 independence
  // referendum crisis (declared illegal, leaders imprisoned or forced into exile, later pardoned/
  // amnestied) exposed a real, unresolved gap between popular mobilization and institutional legitimacy.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","C","DT"],
  // A contemporary EU regional police force (Mossos d'Esquadra) operating under Spanish/EU
  // rule-of-law and human-rights constraints, wholly unlike an ancient empire's coercive apparatus —
  // ordinary, moderate community policing rather than either imperial or wartime-security extremes.
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","D","D","C","D","C"],
  // A deliberate, assertive Catalan-language school-immersion policy (Catalan as the primary
  // instructional language, contested by Spanish-speaking families) sits alongside genuine welcome of
  // immigrants into a distinct Catalan national identity — a real tension between linguistic
  // assimilation and celebrated cosmopolitan diversity in Barcelona specifically.
  imigracao: ["C","C","D","C","N","C","C","C","C","C","C","C","N","C","N","D","D","D","D","N"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // As a sub-state region, Catalonia has no independent military/foreign policy at all, and its
  // political energy is overwhelmingly directed inward toward the independence question rather than
  // outward toward any regional-influence ambition.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Barcelona anchors an industrial, tourism, and tech-startup economy (one of Spain's wealthiest
  // regions), generally market-oriented though with strong regional-government social-welfare spending.
  economia: ["D","C","D","C","D","D","C","C","C","D","N","C","D","D","N","D","D","C","N","C"],
  // A modern EU regional government running healthcare/education/welfare programs under Spanish/EU
  // fiscal and regulatory frameworks — real but constrained institutional controle, distinct in kind
  // from Rome's tribute-and-conquest economic model.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","N","D"],
  // A deeply trade-open economy anchored by the Port of Barcelona and dense EU-single-market
  // integration, with a real independence-driven business-relocation scare (many firms shifted legal
  // headquarters out of Catalonia after 2017) underscoring its dependence on remaining commercially open.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A comparatively secular, cosmopolitan region even by already-secularizing Spanish standards, with a
  // strong tradition of progressive civic/associational culture (castellers, sardana) rather than
  // church-centered public life.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","C","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const FLORENCA_RENASCENTISTA = {
  // A nominal city-state republic that concentrated real power in the Medici family and allied
  // households after 1434, governing through informally controlled councils rather than a formal
  // hereditary monarchy — power was centralized in practice while republican forms persisted on paper.
  estrutura: ["D","C","D","C","N","C","D","C","D","D","N","C","D","C","D","D","N","C","D","D"],
  // Political participation was restricted to guild members (the Arti) eligible for office by lottery
  // (the "Signoria" selected via tratte from qualifying guildsmen) — a real, if narrow and exclusionary,
  // form of oligarchic civic participation rather than either full autocracy or broad democracy.
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","D","C","C","C","D","D","D","C","D"],
  // Savonarola's brief theocratic interlude (1494-98) included book/art burnings ("Bonfire of the
  // Vanities") and harsh moral policing, while the ordinary Medici-era city maintained comparatively
  // conventional (for the era) civic policing without extraordinary coercive apparatus.
  poder: ["C","C","C","C","C","D","C","D","N","D","C","C","N","D","D","D","D","C","D","D"],
  imigracao: ["D","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","D","D","D","N"],
  // Relied on hired condottieri mercenary companies rather than a citizen army, and practiced deliberate
  // Machiavellian balance-of-power diplomacy among the Italian city-states rather than either
  // unilateral militarism or pure pacifism.
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","C","N","D","C","D","D","N","N"],
  // Actively fought wars, shifted alliances, and intervened in neighboring city-state politics as a
  // matter of course within the fragmented Italian peninsula's balance-of-power system.
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // The Medici Bank pioneered international double-entry-bookkeeping merchant banking and financed
  // much of Europe's trade and royalty — among the most privately-capitalist economic models of its
  // era, built on family-controlled finance rather than any state-directed production.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A major international trading and banking hub (wool/textile trade, Medici international bank
  // branches across Europe) — deeply globalist commerce for its era.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Officially Catholic and generally conformist, but real Church-state friction existed (Florence was
  // placed under a papal interdict during the 1478 Pazzi conspiracy conflict, and Savonarola himself
  // was excommunicated and executed by Rome) — religion mattered greatly but was not simple harmony
  // with papal authority.
  religiao: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","D","D","D","C"],
  // Extraordinary artistic and humanist patronage (Michelangelo, Botticelli, Machiavelli's political
  // humanism) coexisted with Savonarola's puritanical "Bonfire of the Vanities" backlash — a genuinely
  // split, era-dependent moral profile within the same city across a few decades.
  moral: ["N","C","N","N","N","D","N","N","N","D","N","D","N","N","N","D","N","D","N","N"],
  // A center of Renaissance scientific/artistic innovation (linear perspective, anatomical study,
  // engineering sketches) though pre-industrial — innovation in art/method more than mass technology.
  tecnologia: ["C","D","N","N","N","N","N","N","N","N","N","N","C","N","C","N","N","N","N","N"],
};

const ROMA_REPUBLICANA = {
  // Polybius's celebrated "mixed constitution": consuls (monarchic element), the Senate (aristocratic
  // element), and the popular assemblies/tribunes of the plebs (democratic element) shared real,
  // mutually-checking power — genuinely balanced rather than purely centralized or purely devolved.
  estrutura: ["C","C","C","C","D","C","C","C","D","C","C","D","D","C","C","D","D","D","C","D"],
  // Annually elected magistrates (consuls, praetors, tribunes) via popular assemblies constituted real,
  // if class-weighted (centuriate assembly voting favored the wealthy), electoral accountability — the
  // tribunes of the plebs specifically existed to check patrician/senatorial power on behalf of
  // ordinary citizens.
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Extended citizenship progressively to conquered Italian peoples through the socii alliance system
  // (and eventually the Social War-driven full extension in 90-89 BCE) — a real, if gradual and
  // often-contested, path to assimilation into Roman civic identity rather than permanent subject status.
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  // Expanded through citizen-legion warfare across three continents (the Punic Wars against Carthage,
  // the Macedonian Wars, Caesar's Gallic conquest) — a militarily formidable, martially-organized
  // society where the legions were the state's central institution.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Sustained, explicit territorial conquest across the Mediterranean world over centuries — among the
  // most successfully expansionist polities in this entire project.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A slave-based agrarian and commercial economy (large slave-worked latifundia estates alongside a
  // free citizen-farmer/soldier class), with no state-planned production system — wealth and land
  // concentrated through conquest and private accumulation.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","C","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D"],
  // War-driven expansion generated massive trade and tribute flows across the Mediterranean (grain from
  // Sicily/Egypt, luxury goods, slaves) built directly on conquest, alongside real protectionist
  // instincts favoring Roman/Italian producers (e.g. restrictions on provincial wine/olive competition
  // with Italian growers) — a more conquest-and-favoritism-driven trade posture than Catalonia's
  // voluntary EU-market integration.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Civic religion (augury, the pontifex maximus office, state cult of Jupiter/Mars) was deeply fused
  // with political legitimacy — magistrates literally could not convene the Senate or hold elections
  // without valid auspices — a tighter, more procedurally mandatory fusion of religion and state
  // machinery than Florence's more socially/culturally (vs. constitutionally) Catholic public life.
  religiao: ["D","C","D","CT","D","C","D","CT","D","C","N","C","D","CT","D","C","D","CT","D","C"],
  // A patriarchal, honor-bound society (paterfamilias legal authority over the household was absolute)
  // with rigid class-based social codes (patrician/plebeian, later patron-client) — deeply traditionalist
  // by design.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Renowned practical/civil engineering (roads, aqueducts, concrete construction, military engineering)
  // rather than theoretical science — technology in service of infrastructure and conquest.
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

export const PROFILES = {
  "imperio-persa-aquemenida": IMPERIO_PERSA_AQUEMENIDA,
  "comuna-de-paris": COMUNA_DE_PARIS,
  "catalunha": CATALUNHA,
  "florenca-renascentista": FLORENCA_RENASCENTISTA,
  "roma-republicana": ROMA_REPUBLICANA,
};
