// FQA058 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// estados-papais: the Pope's temporal state over central Italy until the 1870 Capture of Rome —
//   absolute clerical monarchy applying canon law, Inquisition-era heresy trials and the Index of
//   Forbidden Books, historic Roman Jewish ghetto policy, ended by Italian unification.
// imperio-bizantino: c. 330-1453 — Caesaropapist Orthodox autocracy (the emperor headed both church and
//   state, unlike the Western pope/emperor split), Justinian's Code codified Roman law comprehensively,
//   Constantinople anchored Silk-Road/Bosphorus trade, a long-lived, elaborately bureaucratic and
//   ceremonial state that fell to Ottoman conquest in 1453.
// espanha-habsburgos: especially under Philip II (r. 1556-98) — Counter-Reformation Catholic champion,
//   the Spanish Inquisition, the 1492 expulsion of Jews and 1609 expulsion of Moriscos, limpieza de
//   sangre blood-purity laws, fought the Dutch Revolt and sent the Armada against Protestant England,
//   funded by American silver, repeatedly bankrupted by war spending.
// imperio-russo-czarista: pre-1917 Romanov autocracy — Orthodox Tsarist divine-right rule (a limited
//   Duma only after the 1905 Revolution), serfdom persisted until 1861, Russification and Pale-of-
//   Settlement restrictions on Jewish residence with periodic pogroms, the Okhrana secret police
//   suppressed revolutionary activity until the 1917 collapse.
// genebra-calvinista: Calvin's Geneva, 1541-64 — the Consistory church court disciplined public
//   morality (dancing, dress, tavern behavior, church attendance), executed the heretic Michael
//   Servetus (1553), became a refuge for Protestant refugees fleeing Catholic persecution while itself
//   enforcing strict reformed orthodoxy, Calvin's Academy exported trained ministers across Europe.

const ESTADOS_PAPAIS = {
  // Absolute clerical centralization under the Pope, with no provincial autonomy of consequence over
  // the papal territories of central Italy.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The Pope held absolute temporal and spiritual authority with no elected assembly of any kind
  // governing the population — among the least representative polities audited in this project.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Roman Inquisition prosecuted heresy (the Index of Forbidden Books censored publications,
  // Giordano Bruno was burned at the stake in Rome in 1600) and enforced a mandatory Jewish ghetto in
  // Rome from 1555 — extensive, doctrinally justified coercive social control.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The Roman Jewish ghetto (established 1555, walled and curfewed) enforced segregation rather than
  // assimilation, while also refusing genuine multicultural accommodation — a coercive, exclusionary
  // model distinct from either celebrated pluralism or voluntary assimilation.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","DT"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // A patrimonial, church-revenue-dependent economy (tithes, papal estates, indulgence-adjacent
  // revenues in earlier centuries) rather than a market or industrial system.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A purely patrimonial, tithe-and-estate-revenue fiscal system with no real currency-management or
  // industrial-policy apparatus of its own — the simplest, least sophisticated economic-control
  // mechanism of the five pre-modern theocracies/autocracies in this batch.
  controle: ["C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","C","C","D","N","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Church and state were not merely allied but identical — the Pope was simultaneously the
  // spiritual head of global Catholicism and the temporal sovereign, applying canon law as civil law.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // The Inquisition's heresy trials and the Index of Forbidden Books enforced maximal doctrinal and
  // moral conformity across both belief and daily conduct.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // The Church patronized Renaissance art/architecture extensively (the direct commissioning of St.
  // Peter's Basilica, the Sistine Chapel) but was institutionally cautious toward challenging natural
  // philosophy (the Galileo affair) — genuine artistic-technical patronage alongside doctrinal caution.
  tecnologia: ["C","D","D","C","N","N","D","C","DT","N","N","C","D","DT","C","N","D","C","N","D"],
};

const IMPERIO_BIZANTINO = {
  // An elaborate central bureaucracy administered themes (military-administrative provinces) directly
  // from Constantinople, with provincial strategoi (governors) appointed by and answerable to the
  // emperor — centralized administration, though themes held real regional military autonomy in practice.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // An absolute hereditary (though frequently contested/usurped) autocracy with no popular assembly —
  // legitimacy flowed from divine sanction and army/court acclamation, not any electoral mechanism.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Maintained a large, sophisticated professional military (including elite units like the Varangian
  // Guard) that defended the empire against centuries of invasion (Arab, Bulgar, Turkish, Crusader) —
  // a defensively-oriented but genuinely formidable militarized state.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Primarily defensive/reactive over its long history (protecting core territory against repeated
  // invasion) rather than sustained expansionist conquest, notwithstanding periodic reconquests
  // (Justinian's Western campaigns being a partial exception).
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // A sophisticated state-managed economy: the gold solidus/nomisma coin remained stable for centuries
  // under tight imperial monetary control, silk production was a closely guarded state monopoly.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  // The gold solidus/nomisma remained a stable, tightly state-managed currency for over 700 years
  // (debased only gradually from the 11th century) and silk production was a closely guarded imperial
  // monopoly — a genuinely sophisticated, currency-and-trade-focused state economic apparatus, distinct
  // from the Papal States' simpler tithe-based patrimonialism.
  controle: ["CT","D","CT","D","C","D","CT","D","CT","D","CT","D","N","D","C","C","CT","D","C","D"],
  // Constantinople was the great terminus of Silk Road and Mediterranean trade, and the state actively
  // regulated/taxed commerce (guild-like corporations, the Book of the Eparch regulating city trades)
  // rather than leaving it to a free market.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Caesaropapism fused church and state uniquely: the emperor convened and presided over ecumenical
  // councils and effectively headed the Orthodox Church — an even tighter religion-state fusion than
  // the Papal States' model, where the roles were at least nominally distinct people wearing one hat vs two.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Preserved and transmitted classical Greek scientific/philosophical texts and developed "Greek
  // fire" as a genuinely advanced, closely guarded military technology — real innovation specifically
  // in preservation-of-knowledge and applied military engineering, distinct from Rome's Catholic
  // artistic patronage or Spain's colonial-administrative focus.
  tecnologia: ["N","C","N","N","N","N","D","N","DT","N","N","N","D","DT","N","N","D","N","N","D"],
};

const ESPANHA_HABSBURGOS = {
  // A composite monarchy (Castile, Aragon, Naples, the Netherlands, Portugal after 1580) that retained
  // some regional fueros (Aragonese/Catalan privileges) even as the crown pursued increasing
  // centralization, especially under the Bourbon successors — real, if uneven and contested, regional
  // variation within an overall absolutist project.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Spanish Inquisition (founded 1478) systematically prosecuted heresy, conversos, and moriscos
  // with torture and execution (autos-da-fé) for over three centuries — among history's most
  // sustained, institutionalized religious-coercion apparatuses.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The 1492 expulsion of Jews and 1609 expulsion of the Moriscos, combined with limpieza de sangre
  // ("blood purity") laws formally discriminating against descendants of Jewish/Muslim converts even
  // generations later — one of the most extreme, legally codified assimilation-or-expulsion regimes in
  // world history.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Fought the Dutch Revolt for eight decades, sent the Armada against Protestant England (1588), and
  // led the Catholic cause throughout the Thirty Years War — maximal militarism in defense of Counter-
  // Reformation Catholicism.
  diplomacia: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT","DT","CT","D"],
  // Explicitly sought to reimpose Catholic religious/political control over the Netherlands and
  // intervened militarily across Europe to defend Catholic interests wherever threatened — a maximally
  // interventionist great-power religious-ideological foreign policy.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // American silver (Potosí especially) funded the crown directly, financing wars rather than
  // productive domestic investment — repeated sovereign bankruptcies (1557, 1575, 1596, 1607...) despite
  // the vast bullion inflows, a genuinely dysfunctional patrimonial-extractive economic model.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  // The Casa de Contratación's legal monopoly over all American trade (a single licensed port,
  // Seville) combined with repeated sovereign-debt defaults funding war rather than production — a
  // more extraction-and-war-finance-driven state control than Byzantium's currency-stability focus.
  controle: ["C","D","C","D","C","D","C","D","C","D","CT","D","D","D","C","D","CT","D","N","D"],
  // The Crown tightly monopolized American trade through the Casa de Contratación in Seville
  // (all colonial trade legally had to pass through a single licensed port) — deliberate mercantilist
  // state control rather than open commerce.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // The self-declared champion of Counter-Reformation Catholicism — religious orthodoxy was the
  // organizing principle of the state's domestic and foreign policy alike.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // A cultural Golden Age (Cervantes, Velázquez, Lope de Vega) flourished institutionally alongside,
  // not because of, the Inquisition's intellectual censorship, while colonial administration drove real
  // advances in cartography/navigation/mining engineering (Potosí's mercury-amalgamation silver
  // process) — practical/colonial-extractive innovation rather than pure natural philosophy.
  tecnologia: ["C","D","N","C","N","N","D","N","DT","N","N","N","D","DT","C","N","D","N","N","D"],
};

const IMPERIO_RUSSO_CZARISTA = {
  // Governors-general were purely appointed administrative delegates with no independent legal
  // authority, separate courts, or taxation power of their own — provinces had no autonomy whatsoever
  // distinct from the Tsar's will (Finland's pre-Russification special status and Congress Poland's
  // early autonomy were narrow historical exceptions, not the general rule) — one of the most
  // thoroughly centralized unitary states in this entire project.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Absolute divine-right autocracy for most of the imperial period; the October Manifesto (1905)
  // conceded a Duma only after revolutionary upheaval, and the Tsar retained veto and dissolution power
  // over it throughout — a real but grudging and reversible late concession, not genuine power-sharing.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // The Okhrana secret police, exile to Siberia, and periodic pogroms against Jewish communities
  // (often state-tolerated or encouraged) reflect an extensive, systematic coercive apparatus.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Aggressive "Russification" policy suppressed Polish, Ukrainian, Baltic, and other minority
  // languages/institutions, while the Pale of Settlement legally confined Jewish residence and
  // periodic pogroms terrorized Jewish communities — a severe, state-enforced assimilationist regime.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Fielded one of the era's largest standing armies and pursued sustained territorial expansion across
  // Siberia, Central Asia, and the Caucasus over centuries — a maximally militarized, expansionist
  // great power.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Serfdom persisted until 1861 (binding the majority peasant population to the land under noble
  // landlords), and Witte's late-1890s state-driven industrialization push (railways, heavy industry)
  // was itself a top-down dirigiste project rather than organic market development.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","CT","D","C","D"],
  // Serfdom bound the peasant majority directly to noble-owned land until 1861, and Witte's late-1890s
  // state-directed railway/heavy-industry push was explicit top-down industrial policy — a
  // labor-bondage-plus-late-industrialization control model distinct from Spain's silver-extraction
  // war-finance model.
  controle: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","N","D","C","D","CT","D","C","N"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // The Orthodox Church was directly subordinated to the state via the Holy Synod (established by
  // Peter the Great, with no Patriarch until 1917) — the Tsar functioned as the Church's effective
  // supreme governor, an even more direct state-capture-of-religion model than mere alliance.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Rapid late-19th-century state-driven industrialization (the Trans-Siberian Railway, heavy industry)
  // narrowed but did not close a real, persistent technological gap with Western Europe.
  tecnologia: ["N","C","D","N","N","N","D","N","DT","N","N","N","D","DT","N","N","D","N","N","D"],
};

const GENEBRA_CALVINISTA = {
  // A small, self-governing city-republic council structure, though Calvin's religious authority
  // (never holding formal civic office himself) dominated the councils' practical decision-making —
  // formally republican, substantively theocratic.
  estrutura: ["C","D","C","D","D","C","D","C","D","C","N","C","D","C","C","D","N","C","D","D"],
  // Governed by elected councils (the Small Council, Council of Two Hundred) drawing on Geneva's
  // republican civic tradition, though eligibility and real influence were sharply constrained by
  // religious conformity requirements policed by the Consistory.
  representacao: ["C","C","C","C","D","C","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  // The Consistory (church court) disciplined public morality extensively — regulating dancing, card-
  // playing, tavern attendance, dress, and church attendance — and the city executed the heretic
  // Michael Servetus by burning in 1553, a stark demonstration of genuine, lethal doctrinal enforcement.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // Became a genuine refuge for Protestant religious refugees fleeing Catholic persecution across
  // Europe (Huguenots, Marian exiles from England/Scotland) — welcoming to those sharing its specific
  // reformed faith, while enforcing strict conformity and expelling or executing doctrinal dissenters
  // (Servetus was an outsider executed precisely for theological deviation) — a genuinely double-edged,
  // faith-conditional openness rather than either pure assimilation or pure pluralism.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A small city-state with no capacity for territorial conquest, though it actively exported trained
  // Calvinist ministers across Europe via the Academy — an ideological/religious rather than military
  // form of outward influence.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // A modest craft/trade economy (early roots of the watchmaking industry, partly encouraged by
  // Calvinist sumptuary restrictions on jewelry redirecting craftsmen toward clockwork) with no
  // significant state industrial planning beyond religious-moral regulation.
  economia: ["N","C","N","D","N","D","C","C","N","D","N","C","N","D","N","D","N","C","N","N"],
  // The Ordonnances Ecclésiastiques (1541) regulated both religious and civic life comprehensively —
  // interest-rate limits, sumptuary laws restricting luxury dress, and moral-conduct codes were all
  // directly state/church-enforced.
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // A landlocked, modest-sized craft-trading city dependent on regional Swiss/French commerce rather
  // than global trade — moderate, regionally-oriented rather than either maximally protectionist or
  // globalist.
  comercio: ["C","D","C","D","C","D","C","N","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A theocratic reformed Protestant city where religious doctrine was the explicit organizing
  // principle of both civic law and daily life — church and state governance were institutionally
  // distinct (Consistory vs. councils) but operated in lockstep under Calvin's doctrinal authority.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // The Consistory's detailed regulation of dancing, dress, tavern behavior, and even naming children
  // after Catholic saints reflects one of history's most intensively enforced civic-moral codes.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Calvin's Academy (founded 1559) was a genuine center of theological and humanist scholarship
  // exporting trained ministers across Europe; Calvinist sumptuary restrictions on jewelry/luxury
  // craftsmanship indirectly redirected skilled artisans toward precision clockmaking, planting the
  // seed of Geneva's watchmaking industry — a narrow, craft-specific technical legacy quite unlike the
  // Papal States' fine-art patronage or Byzantium's military/preservation focus.
  tecnologia: ["N","C","N","N","N","N","N","N","D","N","N","N","C","D","N","N","D","N","N","N"],
};

export const PROFILES = {
  "estados-papais": ESTADOS_PAPAIS,
  "imperio-bizantino": IMPERIO_BIZANTINO,
  "espanha-habsburgos": ESPANHA_HABSBURGOS,
  "imperio-russo-czarista": IMPERIO_RUSSO_CZARISTA,
  "genebra-calvinista": GENEBRA_CALVINISTA,
};
