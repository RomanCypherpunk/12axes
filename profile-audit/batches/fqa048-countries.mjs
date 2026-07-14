// FQA048 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// eua-nova-york: Democratic-leaning US state, Wall Street/finance-globalist hub, high tax/regulation,
//   strong public unions, SAFE Act gun control, secular/diverse NYC vs more conservative upstate.
// eua-new-hampshire: "Live Free or Die" — no income/sales tax, no seatbelt law, town-meeting direct
//   democracy tradition, strongly libertarian on economics and personal liberty, first-in-nation primary.
// eua-washington-dc: federal capital district — no voting representation in Congress (home-rule
//   subject to congressional override), federal-government-dependent economy, overwhelmingly
//   Democratic electorate, diplomatic-community concentration.
// eua-massachusetts: deep-blue state, Romneycare/ACA precursor universal healthcare, Boston/Cambridge
//   biotech-university hub, strict gun control, town-meeting democratic tradition, secular relative to
//   its Catholic heritage.
// canada: federal parliamentary democracy, official multiculturalism policy, strict gun control vs US,
//   universal healthcare, modest defense spending, peacekeeping diplomatic reputation, USMCA/CPTPP
//   open-trade economy, progressive social policy (legal cannabis, MAID, same-sex marriage since 2005).

const EUA_NOVA_YORK = {
  // Strong home-rule/local-control tradition (NYC vs Albany tension) but state government also
  // imposes uniform mandates (rent regulation, SAFE Act) statewide over local objection.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","D","CT","D","C","D","CT","D","C","DT","C","DT","D","D","C","D","D","DT","CT","DT"],
  // SAFE Act (2013) among strictest US gun laws; NYPD historically aggressive (stop-and-frisk legacy)
  // balanced against strong civil-liberties/privacy advocacy culture in NYC politics.
  poder: ["C","C","C","C","C","C","C","C","CT","D","C","C","C","C","D","D","C","C","D","C"],
  // Historic immigrant-gateway state (Ellis Island legacy), sanctuary-city policies in NYC, large
  // multilingual/multicultural population, progressive on immigrant integration without forced
  // assimilation.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","C","D","C","N","C","D","C","D","C","D","N","N","C","D","C","D","C","D","N"],
  intervencao: ["C","D","C","D","C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D"],
  // Genuine tension: Wall Street is the core private-capital identity of the state, but NYC/Albany
  // also run the nation's most generous Medicaid program, free CUNY/SUNY tuition heritage, huge public
  // hospital and housing systems, and historically powerful public-sector unions — net roughly balanced
  // rather than uniformly public-leaning like a federal-dependent economy.
  economia: ["D","C","C","N","DT","DT","C","C","C","DT","N","D","N","D","N","DT","N","C","N","N"],
  // NYC rent stabilization covers roughly 1 million apartments — one of the most extensive price-
  // control regimes in the US — a genuinely distinguishing, concrete fact, not just general blue-state
  // lean.
  controle: ["C","D","C","D","C","D","C","D","CT","DT","C","D","D","D","CT","D","C","D","C","D"],
  // Global finance capital (Wall Street) built on open capital flows, but also historic manufacturing-
  // protection nostalgia (upstate industrial decline) creates real tension.
  comercio: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","D","N","C","N","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Finance/media/tech (NYC tech scene, Cornell Tech, biotech Albany) hub, generally tech-embracing,
  // tempered by strong environmental-regulation instincts (upstate conservation, climate law).
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const EUA_NEW_HAMPSHIRE = {
  // "Live Free or Die" — deep local-control tradition, town-meeting government is the literal
  // mechanism of local governance in most NH towns; state resists federal mandates fiercely.
  estrutura: ["CT","D","CT","D","CT","D","CT","D","C","D","CT","DT","CT","DT","CT","D","C","DT","CT","DT"],
  // First-in-the-nation primary state, strong direct-democracy town-meeting tradition (literal
  // assemblies deciding local budgets), high civic-participation culture.
  representacao: ["CT","D","CT","D","C","D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","CT","D"],
  // No permit needed to carry (constitutional carry since 2017), no seatbelt law for adults over 18 —
  // maximal personal-liberty state on both drugs-adjacent and self-defense fronts.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","C","D","CT","DT","CT","DT","CT","DT","CT"],
  imigracao: ["C","D","C","D","C","D","C","N","C","D","C","D","N","D","N","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","N"],
  // Fiercely anti-entanglement, low defense-industry footprint relative to other states, strong
  // libertarian non-interventionist streak.
  intervencao: ["CT","DT","C","D","C","DT","C","D","CT","DT","CT","DT","CT","DT","C","DT","C","D","CT","DT"],
  // No state income or sales tax (one of only a handful in US), minimal state government footprint —
  // one of the most economically "private"-oriented US states.
  economia: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Minimal regulation, no state minimum wage above federal floor, low-tax libertarian identity is the
  // state's core political brand.
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // New England historically Congregationalist/mainline Protestant but now among the least religious
  // regions of the US, strong secular-libertarian streak.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Libertarian-leaning on personal-liberty social issues (legal same-sex marriage since 2010, medical
  // cannabis, no-fault views on private conduct) but culturally more traditional New England on family.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Not a tech-industry state, but Seabrook's nuclear plant is a source of libertarian-tinged pride
  // and the state has genuine White Mountains land-conservation culture — a real rural/outdoorsy lean
  // rather than a blank neutral profile.
  tecnologia: ["C","D","C","D","C","N","N","C","N","N","N","N","D","N","N","N","N","C","N","N"],
};

const EUA_WASHINGTON_DC = {
  // The ultimate anti-federalism case study inverted: DC has essentially NO structural autonomy —
  // Congress can override any DC law (Home Rule Act 1973) and controls its budget; the opposite of a
  // "federal" arrangement despite home-rule government existing since 1973.
  estrutura: ["C","D","C","D","D","C","C","C","D","C","C","C","C","C","D","D","D","C","D","C"],
  // Deep irony at the heart of this profile: DC residents pay federal taxes and are subject to federal
  // law with zero voting representation in Congress ("Taxation Without Representation" is literally on
  // DC license plates) — a glaring democratic-representation gap despite a normal local electoral system.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","C","D","D","D","CT","D","D","D","CT","D"],
  // DC v. Heller (2008) originated from DC's handgun ban being struck down; historically among the
  // strictest US gun-control jurisdictions; large federal law-enforcement/security presence.
  poder: ["C","D","C","C","C","C","C","C","CT","D","C","C","C","C","D","D","C","C","D","C"],
  // Major immigrant-gateway metro area, strongly pro-immigration political culture, multicultural
  // diplomatic-community population.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  // Home to the Pentagon, State Department, and the entire US foreign-policy apparatus — the seat of
  // American military and diplomatic power, though electorate itself leans anti-war/progressive.
  diplomacia: ["C","C","D","C","C","C","D","C","N","C","C","N","C","N","C","C","D","D","C","N"],
  intervencao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Federal-government/contractor-dominated local economy — nearly the entire employment base is tied
  // directly or indirectly to federal spending and lobbying/legal services around it, distinct from a
  // finance (NY) or biotech (MA) private-industry identity.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // One of the most Democratic-voting jurisdictions in the US (consistently >90% in presidential
  // elections), strongly progressive on LGBT rights, abortion access, gender-identity policy.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Government-policy/legal-services economy, not a hardware/biotech innovation hub in the way MA or
  // CA are — federal bureaucratic and regulatory-precaution instincts temper any tech-maximalist lean.
  tecnologia: ["C","D","C","N","N","C","N","C","D","C","N","C","C","D","N","C","C","D","C","N"],
};

const EUA_MASSACHUSETTS = {
  // Town-meeting government is the literal governing mechanism in most MA municipalities (oldest
  // continuous form of direct local democracy in the US, dating to colonial era).
  estrutura: ["C","D","C","D","C","D","C","D","D","D","CT","DT","CT","DT","C","D","C","DT","C","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Among strictest state gun laws in the US (assault weapons ban, red-flag law); strong privacy/
  // civil-liberties advocacy culture (birthplace of much US civil-liberties litigation).
  poder: ["D","CT","D","CT","D","CT","D","C","CT","D","D","CT","C","C","DT","C","D","C","D","C"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","C","D","C","D","DT","D","C","DT","C","D","C","D","C","D","C","DT","C","D","C"],
  // Historically the "Live Free or Die" neighbor's opposite on foreign entanglement rhetoric but
  // electorate strongly favors diplomacy-first, anti-war positions (Kennedy-era internationalism mixed
  // with modern progressive anti-militarism).
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Romneycare (2006) achieved near-universal coverage through an individual mandate atop *private*
  // insurers, not a single-payer public system — the direct opposite economic mechanism from Canada's
  // Medicare. Boston/Cambridge's economy is dominated by private biotech, venture capital, and asset
  // management (Fidelity, State Street, Bain) — a strongly private-capital identity beneath the
  // progressive politics, closer to the original moderate baseline than a high-public score.
  economia: ["DT","C","D","C","DT","DT","C","C","N","DT","N","N","N","N","DT","D","D","C","N","C"],
  // MA voters banned local rent control statewide by referendum in 1994; employment is at-will like
  // most US states; the biotech/finance boom is VC- and private-capital-driven, not state-planned
  // (though the state does offer targeted life-sciences tax incentives and passed a 2022 "millionaire's
  // tax" surcharge) — a genuinely mixed, moderate controle profile, not NY-level dirigisme.
  controle: ["D","C","N","C","C","D","C","D","N","C","D","N","DT","D","C","C","DT","D","C","C"],
  comercio: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","D","N","C","N","C"],
  // Historically deeply Catholic (Irish/Italian immigrant heritage) but now among the more secular US
  // states in practice — first state to legalize same-sex marriage (2004).
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // First state to legalize same-sex marriage (2004), strongly progressive on LGBT rights, abortion
  // access protections codified post-Dobbs.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Boston/Cambridge biotech-university-AI hub (MIT, Harvard, Moderna), strong innovation economy,
  // tempered by New England environmental-conservation instincts.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const CANADA = {
  // Genuine federal system (provinces control healthcare, education, natural resources) with real
  // asymmetric arrangements (Quebec's distinct status, Indigenous self-government agreements).
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Stable Westminster parliamentary democracy, independent judiciary, Charter of Rights and Freedoms
  // (1982) strongly protects minority/opposition rights.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Strict gun control relative to the US (1991/2020 assault-weapons restrictions, long-gun registry
  // history), legal recreational cannabis nationwide since 2018, no death penalty (abolished 1976).
  poder: ["D","CT","D","C","D","CT","D","C","DT","D","D","CT","N","C","DT","C","D","C","D","C"],
  // Official multiculturalism policy since 1971 (constitutionally entrenched 1988) — the explicit
  // opposite of an assimilationist model; large-scale points-based immigration widely seen as a
  // national economic asset.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Modest defense spending historically below NATO's 2% target, peacekeeping-reputation legacy
  // (Pearson/Suez), favors diplomacy and multilateral institutions over unilateral force.
  diplomacia: ["D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","DT","D","C"],
  // Strongly multilateralist (UN, NATO, G7 as consensus-builder rather than unilateral actor), avoids
  // unilateral regional dominance posture, historically a middle-power broker.
  intervencao: ["C","D","C","D","C","D","C","D","C","DT","C","D","C","D","C","D","C","D","C","D"],
  // Universal single-payer Medicare is a defining national institution (strong public consensus), but
  // most crown corporations were privatized in the 1980s-90s (CN Rail, Air Canada, Petro-Canada) and
  // the economy runs on large private banks (Big Five), resource extraction, and finance — a genuinely
  // mixed economy, not uniformly public-leaning.
  economia: ["DT","C","C","DT","D","DT","C","C","C","DT","C","N","C","D","DT","D","N","C","N","N"],
  // Bank of Canada independence is a strong, explicit institutional norm (not subordinate to the
  // government of the day); no capital controls on the free-floating CAD; supply management and a few
  // strategic subsidies (EV battery plants, historically Bombardier) are real but narrow exceptions in
  // an otherwise moderate regulatory regime.
  controle: ["N","C","DT","C","C","D","C","D","D","C","C","N","DT","D","C","CT","DT","DT","C","C"],
  // Heavily trade-dependent economy (USMCA/CUSMA, CPTPP member), open to foreign investment though
  // protects supply-managed sectors (dairy, poultry) with real tariff walls.
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  // Officially secular state, church-state separation well established, religiosity has declined
  // sharply, especially in Quebec post-Quiet Revolution.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Legal same-sex marriage since 2005, Medical Assistance in Dying (MAID) legalized 2016 and
  // expanded, legal cannabis, generally progressive social-policy leader.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Strong resource-extraction economy (oil sands, mining) alongside a real climate-policy commitment
  // (carbon pricing) — genuine tension between extraction and environmental precaution.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

export const PROFILES = {
  "eua-nova-york": EUA_NOVA_YORK,
  "eua-new-hampshire": EUA_NEW_HAMPSHIRE,
  "eua-washington-dc": EUA_WASHINGTON_DC,
  "eua-massachusetts": EUA_MASSACHUSETTS,
  "canada": CANADA,
};
