// FQA053 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// el-salvador: Bukele's presidential republic — a March 2022 "state of exception" (still renewed
//   monthly) suspended constitutional rights to enable mass gang arrests (~1.7% of the adult population
//   detained, mega-prison CECOT), homicide rate collapsed dramatically, a constitutionally contested
//   2024 re-election, and the 2021 adoption (and later partial rollback under IMF pressure) of Bitcoin
//   as legal tender.
// colombia: presidential republic under its first leftist president (Gustavo Petro, since 2022), the
//   landmark 2016 FARC peace accord's transitional-justice process is still unfolding while ELN
//   guerrilla and drug-trafficking violence persists in parts of the country, historic US security
//   partnership (Plan Colombia).
// uruguai: the most secular state in Latin America (church-state separation since the 1917
//   constitution), first country in the world to fully legalize the cannabis market (2013), legalized
//   same-sex marriage and abortion in 2012-13, highest democracy-index ranking in the region, retains
//   significant historic public utilities (ANCAP, ANTEL, UTE).
// japao-meiji: 1868-1912 — abolished the feudal han/samurai system, built a modern conscript
//   army/navy that won the First Sino-Japanese (1894-95) and Russo-Japanese (1904-05) wars and annexed
//   Taiwan (1895) and Korea (1910), the 1889 Meiji Constitution created a limited constitutional
//   monarchy with property-restricted suffrage, State Shinto fused emperor-worship with governance,
//   state-sponsored zaibatsu-led industrialization.
// republica-holandesa: 1581-1795 Dutch Republic — a genuine confederation of 7 sovereign provinces
//   (Holland dominant) run by an oligarchic merchant-class "regent" government, remarkable religious
//   tolerance for its era (safe haven for Descartes, Spinoza, Sephardic Jews), pioneered modern
//   financial capitalism (Amsterdam Stock Exchange, the VOC as the first multinational corporation).

const EL_SALVADOR = {
  // A small, historically centralized unitary republic — municipalities exist but hold little
  // independent policy weight relative to the strong presidency.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The March 2022 "state of exception" has been renewed monthly ever since, suspending the right to
  // legal counsel and extending detention limits; Bukele's 2024 re-election required a constitutionally
  // contested Supreme Court reinterpretation of the one-term-limit rule — extraordinarily popular
  // (~90% approval) but a genuine, documented erosion of constitutional constraint.
  representacao: ["C","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // Mass gang crackdown has jailed an estimated 1.7%+ of the entire adult population, largely without
  // individual due process, in facilities including the mega-prison CECOT — one of the most extreme,
  // deliberately publicized "poder"-maximalist security campaigns audited in this project, credited
  // domestically with a dramatic homicide-rate collapse.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Bukele has repeatedly threatened unilateral action against gang leadership networks operating
  // across the Central American isthmus, a more assertively nationalist regional posture than
  // Colombia's UN/OAS-multilateral-anchored peace diplomacy.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  // Beyond the security state, Bukele's government has also directly intervened in monetary policy
  // (mandatory Bitcoin acceptance for businesses, 2021) and built a state-run Bitcoin/"Volcano Bonds"
  // apparatus — real, if unconventional, dirigiste economic experimentation, later partially walked
  // back under a 2024 IMF loan agreement.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","N"],
  // A remittance/dollarized micro-economy (El Salvador adopted the US dollar outright in 2001, unlike
  // Colombia's own currency and larger diversified export base) — deeply globalized by structural
  // necessity rather than deliberate trade-policy choice.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT","D","CT"],
  // Historically majority Catholic but with fast-growing Evangelical Protestant churches (now roughly
  // equal in adherents), religion remains highly salient in public and political life.
  religiao: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C"],
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","D"],
};

const COLOMBIA = {
  // Formally unitary but with real departmental/municipal administrative weight, especially where the
  // central state's presence has historically been weak (rural conflict zones).
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A genuinely competitive, if violence-scarred, democracy — Petro's 2022 win was the first-ever
  // peaceful transfer of power to the political left in Colombian history, achieved through ordinary
  // elections, not a coup or crisis-rule mechanism.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","C","D","D","D","CT","D","D","D","C","D"],
  // Persistent ELN guerrilla activity, drug-trafficking violence, and army/paramilitary human-rights
  // abuses documented by the post-2016 Truth Commission coexist with a large, still-forming
  // transitional-justice (JEP) system attempting genuine accountability — a real, unresolved mid-range
  // security-state profile, not a clean extreme.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","C","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Historic US security partnership (Plan Colombia) built one of Latin America's largest standing
  // militaries and most extensive counter-narcotics/counter-insurgency apparatus — a modern land-power
  // buildup aimed at internal conflict, a wholly different logic from the Dutch Republic's trade-route
  // naval-power model.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","D","D","C","DT","C","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Petro's government has pushed a "Total Peace" negotiation strategy and expanded state social
  // spending/land reform commitments (part of the 2016 accord's rural-reform pillar), a real leftward
  // shift from the historically market-oriented Colombian economic consensus.
  economia: ["C","D","C","D","D","D","C","D","C","D","N","D","C","D","C","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D"],
  // Multiple free-trade agreements (US, EU, Pacific Alliance) alongside real informal-sector/coca-
  // substitution economic realities that complicate a purely globalist reading.
  comercio: ["C","C","D","C","C","C","C","C","C","C","C","C","C","C","N","C","C","C","D","C"],
  // Strong historic Catholic tradition, though secularizing faster than Central America; the Church
  // retains real influence over family-law and moral-legislation debates.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Colombia's Constitutional Court has been unusually progressive by regional standards — legalizing
  // same-sex marriage (2016) and decriminalizing/regulating abortion up to 24 weeks (2022) via court
  // rulings, ahead of most Latin American legislatures.
  moral: ["C","N","CT","N","C","D","C","N","CT","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const URUGUAI = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  // Consistently ranked the highest-scoring Latin American democracy on every major index (V-Dem,
  // EIU), stable two-and-a-half-party alternation in power since the 1985 return to democracy, strong
  // judicial independence.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Legalized recreational cannabis nationwide in 2013 — the first country in the world to fully
  // regulate the cannabis market state-to-consumer — alongside comparatively light-touch, rights-
  // respecting policing by regional standards; abolished the death penalty in 1907, among the earliest
  // in the world.
  poder: ["D","CT","D","C","D","CT","D","C","DT","C","D","CT","N","C","DT","C","D","C","D","C"],
  imigracao: ["D","C","D","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  // A historically small, low-military-spending state with a strong non-interventionist "no
  // entanglements" foreign-policy tradition dating to the 19th-century Battle-of-neutrality doctrine.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Retains significant historic state utility monopolies (ANCAP fuel, ANTEL telecom, UTE electricity)
  // dating to early-20th-century "batllismo" reformism, alongside an otherwise open, agro-export-driven
  // market economy — a genuinely distinctive hybrid, more public than most of its neighbors on core
  // utilities specifically.
  economia: ["C","D","C","D","D","DT","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // A small, deeply trade-dependent economy (beef, soy, Mercosur integration), strongly globalist by
  // structural necessity.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // The 1917 constitution's explicit separation of church and state (removing religious references
  // from public holidays, e.g. "Día de la Familia" replacing Christmas officially) makes Uruguay the
  // most consistently secular state in Latin America by design, not merely by declining practice.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Legalized same-sex marriage (2013) and abortion (2012) years ahead of most of the region, alongside
  // the cannabis legalization — a consistent, deliberate progressive-legislative pattern.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","N","C","C","D","C","D","C","D","N","D","C","N"],
};

const JAPAO_MEIJI = {
  // The 1871 haihan-chiken abolished the feudal han (domains) and replaced them with centrally
  // administered prefectures reporting directly to Tokyo — a deliberate, rapid, and total
  // centralization ending centuries of decentralized samurai-domain autonomy.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The 1889 Meiji Constitution created an Imperial Diet, but suffrage was restricted to a small
  // property-owning male elite (~1% of the population could vote initially), sovereignty was
  // explicitly vested in the divine Emperor rather than the people, and the military retained
  // independent access to the Emperor outside civilian cabinet control.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Built a modern conscript army/navy and a police/surveillance state (Peace Preservation Law
  // precursors targeting political dissent) explicitly to serve national-strengthening ("fukoku
  // kyohei") goals.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Deliberate nation-building fused Japanese ethnic/cultural identity with loyalty to the Emperor;
  // newly annexed Taiwan (1895) and Korea (1910) were subjected to explicit assimilation policy
  // (language, Shinto shrine worship, name-change pressure in later phases).
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Won two major wars (First Sino-Japanese 1894-95, Russo-Japanese 1904-05) through deliberate,
  // sustained military-industrial buildup — a defining, explicit "fukoku kyohei" (rich country, strong
  // army) state doctrine.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Territorial annexation of Taiwan and Korea and the assertion of a sphere of influence in Manchuria
  // represent explicit, successful imperial expansionism — the opposite of a non-interventionist posture.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The state directly sponsored and subsidized the founding zaibatsu conglomerates (Mitsubishi,
  // Mitsui) as instruments of national industrial policy — a deliberate state-guided-capitalism model,
  // not laissez-faire market development.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  controle: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","D","D","C","D","CT","D","C","D"],
  // Initially bound by 19th-century "unequal treaties" fixing low tariffs (imposed by Western powers),
  // Meiji Japan worked deliberately to renegotiate full tariff autonomy (achieved 1911) precisely so it
  // could protect strategic infant industries.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // State Shinto was elevated to a quasi-official ideology fused with emperor-worship and taught in
  // schools as patriotic duty rather than mere private religious belief.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // The 1898 Civil Code codified the patriarchal "ie" (household) family system, subordinating women's
  // legal personhood to the male household head — a deliberately reinforced, codified traditionalism.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Rapid, state-driven industrialization (railways, telegraph, modern shipyards, textile mills) was
  // the central Meiji project — a deliberate, explicit embrace of Western technology as the path to
  // "civilization and enlightenment" (bunmei kaika).
  tecnologia: ["C","D","C","D","C","D","N","D","N","D","N","D","C","D","N","D","N","D","C","D"],
};

const REPUBLICA_HOLANDESA = {
  // A genuine confederation of 7 sovereign provinces (Holland dominant but each retaining its own
  // Estates, army contribution quota, and veto in the States-General) — one of the most decentralized
  // state structures in early-modern Europe, deliberately designed after rejecting Spanish
  // centralizing rule.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Governed by an oligarchic merchant-class "regent" patriciate through the States-General and
  // provincial Estates rather than by popular election — a real, if collegial and consensus-based,
  // limitation on popular sovereignty (no universal suffrage, urban elites dominated).
  representacao: ["C","D","C","D","D","C","C","C","D","D","C","D","D","N","C","D","D","D","C","D"],
  // Remarkable de facto religious tolerance for its era despite a nominally established Calvinist
  // church — safe haven for Descartes, Spinoza, and Sephardic Jewish refugees from Iberia — alongside
  // real domestic religious-conformity pressure on public office-holding (only Reformed church members
  // could hold most political posts).
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // The tolerant, commercially-driven Republic deliberately welcomed diverse refugee communities
  // (Sephardic Jews, French Huguenots, Flemish Protestants) as an economic and intellectual asset
  // rather than demanding cultural assimilation.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Built one of the most powerful navies in the world (to protect trade routes) while maintaining a
  // comparatively small standing land army for much of the 17th century — sea power over land militarism.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Fought sustained wars (against Spain for independence, later against England and France) to protect
  // trade and sovereignty, and the VOC/WIC waged their own semi-independent colonial wars — a
  // genuinely assertive, commercially-driven interventionist posture abroad.
  intervencao: ["D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","DT","D","C"],
  // The VOC (Dutch East India Company, chartered 1602) was the world's first major joint-stock
  // multinational corporation, and the Amsterdam Stock Exchange pioneered modern securities trading —
  // among the most privately-driven, capitalist economies of the early-modern world.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  // The VOC held state-chartered monopoly trading rights and quasi-sovereign war-making powers in Asia
  // — a real, if privately-run, form of state-sanctioned economic direction over strategic trade routes.
  controle: ["C","D","N","D","C","D","C","D","D","C","CT","N","D","D","C","C","D","D","C","D"],
  // The pioneering "staple market" (stapelmarkt) system made Amsterdam the entrepôt of world trade —
  // about as globalist and free-trade-oriented an economy as existed anywhere in the 17th century.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  moral: ["N","C","N","C","N","D","N","N","N","D","N","D","N","N","N","D","N","D","N","N"],
  // Led early-modern Europe in scientific instrumentation (microscopy, telescopes — Huygens, van
  // Leeuwenhoek) and applied hydraulic/naval engineering (land reclamation, shipbuilding innovation).
  tecnologia: ["C","D","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

export const PROFILES = {
  "el-salvador": EL_SALVADOR,
  "colombia": COLOMBIA,
  "uruguai": URUGUAI,
  "japao-meiji": JAPAO_MEIJI,
  "republica-holandesa": REPUBLICA_HOLANDESA,
};
