// FQA050 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// australia: genuine federation (6 states), compulsory voting, among the strictest gun-control regimes
//   in the world (1996 National Firearms Agreement buyback), hardline offshore-processing asylum
//   policy despite official multiculturalism, ANZUS/AUKUS defense-forward, resource-export economy
//   with real foreign-investment protectionism (FIRB).
// nova-zelandia: unitary but bicultural (Treaty of Waitangi Māori co-governance), MMP proportional
//   democracy, tightened gun laws overnight after the 2019 Christchurch massacre, independent nuclear-
//   free foreign policy (effectively exited ANZUS over US nuclear-ship visits), dairy-export-dependent
//   trade-globalist economy, euthanasia legalized by referendum 2020.
// irlanda: unitary parliamentary republic, militarily neutral (not NATO), rapid secularization
//   (divorce 1995, same-sex marriage by popular referendum 2015 — a world first, abortion 2018), a
//   12.5%-corporate-tax FDI haven for US tech/pharma — one of the most globalized small economies on Earth.
// ucrania: contemporary Ukraine under wartime martial law since Feb 2022 — elections suspended,
//   centralizing wartime administration, NATO-aspirant constitutional goal, Ukrainian Orthodox
//   autocephaly break from Moscow (2018), heavily militarized war economy, Western arms-dependent.
// bielorrussia: Lukashenko's authoritarian unitary presidential state since 1994, 2020 protests
//   violently suppressed, one of the least-privatized post-Soviet economies, Union State/close military
//   alliance with Russia (hosted troops for the 2022 invasion, Russian tactical nuclear weapons since 2023).

const AUSTRALIA = {
  // Genuine federation: 6 states + 2 territories with their own constitutions/police/legislatures,
  // though the High Court has steadily favored Commonwealth power ("Engineers case" legacy) — real but
  // eroding federalism.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","C","D"],
  // World's few compulsory-voting democracies (since 1924) — near-universal turnout — alongside a
  // robust bicameral Westminster system and High Court judicial review.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // The 1996 Port Arthur massacre triggered the National Firearms Agreement — a mandatory buyback and
  // among the strictest gun-control regimes among developed democracies; no death penalty; strong
  // digital/metadata-retention security laws post-2014 terrorism concerns.
  poder: ["C","C","C","C","C","C","C","D","CT","D","C","C","C","C","D","D","CT","D","C","C"],
  // Abandoned the explicit "White Australia Policy" only in 1973 and now has an official
  // multiculturalism policy, YET simultaneously runs one of the world's hardest-line asylum regimes
  // (offshore processing at Manus/Nauru, boat turnbacks) — a genuinely split profile between welcoming
  // permanent multicultural immigration and near-zero tolerance for unauthorized arrivals.
  imigracao: ["C","C","C","C","N","C","C","C","C","C","C","C","N","C","N","C","DT","D","DT","D"],
  // ANZUS alliance, AUKUS submarine pact (2021), significant defense-spending increases amid China-
  // Pacific tensions, hosts US Marine rotations in Darwin — a genuinely defense-forward middle power.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","D","C","N","C","D","C","DT","C","N"],
  // Firmly within the US alliance system (not neutral), but geographically and politically wary of
  // entangling itself beyond its own Pacific/Indo-Pacific neighborhood unilaterally.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Broadly market-oriented since the 1980s Hawke-Keating reforms (floated currency, tariff cuts,
  // compulsory-superannuation privatized retirement system) but retains universal public healthcare
  // (Medicare) and a strong mining-royalty state revenue base.
  economia: ["D","C","D","C","DT","D","C","C","C","D","N","C","C","D","DT","D","D","C","N","C"],
  // The Foreign Investment Review Board actively blocks/restricts foreign purchases of farmland and
  // strategic infrastructure — real dirigiste intervention alongside an otherwise light-touch
  // regulatory economy.
  controle: ["N","C","D","C","C","D","C","D","D","C","C","D","D","D","C","C","C","D","C","D"],
  // Resource-export economy (iron ore, LNG, coal) deeply dependent on trade with China, generally
  // pro-free-trade (multiple FTAs) but with real strategic-asset protectionism (FIRB vetoes) and 2020-22
  // trade-war experience with China showing willingness to accept economic cost for sovereignty.
  comercio: ["C","C","D","C","D","C","C","C","C","C","C","C","C","C","N","C","C","C","C","C"],
  // Historically Christian-majority but now roughly a third "no religion" in the census (fastest-growing
  // category since 2011) — moderately secularizing, official church-state separation.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Legalized same-sex marriage via a 2017 national postal survey (61.6% yes) — a genuinely
  // popular-consensus progressive result — broadly socially liberal on LGBT rights and abortion access.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Major mining-and-LNG export economy creating real tension with a strong domestic climate-policy
  // debate and world-leading household rooftop-solar adoption.
  tecnologia: ["C","D","C","N","C","C","N","C","N","C","C","D","C","D","C","D","C","D","C","N"],
};

const NOVA_ZELANDIA = {
  // Unitary state with no written codified constitution (parliamentary sovereignty), BUT genuinely
  // shares governance authority with Māori iwi in specific domains (co-governance arrangements over
  // resource management, Māori seats in Parliament since 1867) — a real, if narrow, power-sharing model.
  estrutura: ["N","C","N","C","D","C","D","C","D","C","C","D","D","C","D","C","N","C","D","C"],
  // MMP proportional representation (adopted via 1993 referendum) produces genuinely representative
  // coalition government; strong constitutional conventions rather than a codified charter.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // The 2019 Christchurch mosque massacre triggered a near-total ban on semi-automatic firearms within
  // days — one of the fastest, most decisive gun-control reversals of any democracy; euthanasia
  // (End of Life Choice) legalized by a 2020 binding referendum.
  poder: ["C","C","C","C","C","C","C","C","CT","DT","C","CT","N","C","DT","C","C","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Effectively exited the ANZUS alliance in the 1980s by banning nuclear-armed/-powered ship visits —
  // a globally unique, deliberately independent, nuclear-free foreign-policy stance still in force.
  diplomacia: ["D","C","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Dairy giant Fonterra and broader agricultural exports dominate the economy; 1980s Rogernomics
  // reforms were among the most aggressive market-liberalization programs of any OECD country, though a
  // universal public healthcare system (ACC no-fault accident compensation) remains distinctive.
  economia: ["D","CT","D","C","DT","D","C","C","C","D","N","C","D","D","DT","D","D","C","N","C"],
  controle: ["D","C","D","C","C","D","C","D","D","C","D","C","DT","D","C","C","D","D","C","D"],
  // One of the most trade-dependent small economies in the world (dairy/meat exports to China/Asia);
  // does restrict foreign purchases of residential land and some farmland (Overseas Investment Act) but
  // otherwise strongly globalist.
  comercio: ["D","C","D","C","DT","C","D","C","C","C","C","C","D","C","N","C","D","C","D","C"],
  // Rapid secularization: "no religion" became the largest single category in the 2018 census,
  // overtaking Christianity for the first time.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // First Commonwealth country in the Pacific to legalize same-sex marriage (2013), legalized
  // euthanasia by binding referendum (2020) — a globally distinctive direct-democracy progressive
  // consensus.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // World-leading household solar/renewable share (already ~85% renewable electricity from hydro/
  // geothermal), but real caution about GMOs (among the strictest GMO-regulation regimes in the OECD).
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","N","C","C","C","C","D","N","C","N","D"],
};

const IRLANDA = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // Historic emigration nation now a major immigration destination — recent housing-crisis-linked
  // backlash (2023-24 anti-immigration protests) has genuinely strained the country's traditionally
  // welcoming self-image, though official policy remains comparatively open.
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  // Constitutionally neutral and not a NATO member (a defining, distinctive feature versus almost every
  // other EU/Western-European state on this list) — "triple lock" requires UN mandate + government +
  // Dáil approval before troops deploy abroad.
  diplomacia: ["D","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // A 12.5% corporate-tax rate deliberately built to attract Apple/Google/Meta/Pfizer European HQs makes
  // Ireland one of the most FDI/private-capital-oriented small economies in the developed world.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The corporate-tax-haven FDI model IS the economy — deeply globalist by design and necessity.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // Rapid secularization from a near-theocratic starting point: divorce legalized only in 1995 (by a
  // wafer-thin referendum margin), same-sex marriage by popular referendum in 2015 (a world first),
  // abortion legalized in 2018 by repealing the constitutional 8th Amendment.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Hosts the European data-center/tech-HQ hub (Dublin's "Silicon Docks") — genuinely tech-forward by
  // economic necessity, tempered by strong EU-standard environmental/data-privacy regulation (GDPR
  // enforcement leader, given how many tech firms are headquartered there).
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const UCRANIA_CONTEMPORANEA = {
  // Unitary with oblast-level administration; wartime martial law (since Feb 2022) has centralized
  // authority further (military administrations replacing some elected local councils in front-line
  // regions), a real, distinctive wartime departure from the pre-war decentralization reforms of
  // 2014-2021 (which had genuinely devolved significant power to local hromadas).
  estrutura: ["D","C","D","C","D","CT","D","CT","DT","CT","D","C","D","C","D","C","D","C","D","C"],
  // A functioning, contested multi-party democracy before 2022 (two peaceful transfers of power via
  // election, 2014 and 2019) — BUT presidential/parliamentary elections have been constitutionally
  // suspended under martial law since the full-scale invasion, a genuine and significant complication
  // for this axis that a simple "democracy" label would miss.
  representacao: ["C","C","C","D","C","C","C","D","D","D","D","D","D","D","C","D","D","D","C","D"],
  // Wartime security state: martial law, conscription, media consolidated into a unified wartime
  // telethon, martial-law restrictions on movement/assembly — extensive emergency security powers,
  // genuinely justified by circumstances but still a real, high "poder" reading.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","N","D","CT","D","CT","D"],
  // Post-2014 language laws promote Ukrainian over Russian in education/media/public life as part of a
  // deliberate nation-building/de-Russification project — a genuine, documented assimilationist policy
  // shift, not merely rhetorical.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","C","D","C","D"],
  // Maximal defense-spending/militarization under existential war, seeking NATO membership and Western
  // heavy-weapons supply, a martial national mobilization on a scale unmatched by any other profile in
  // this batch.
  diplomacia: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT","DT","CT","N"],
  // Fighting a defensive war (no territorial ambitions beyond restoring 1991 borders), but constitutionally
  // committed to NATO/EU integration (not neutral) and willing to use all available leverage internationally.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // War economy: massive state direction of production toward defense, state guarantees/subsidies for
  // arms manufacturing, wartime price controls on essentials, while nominally still committed to the
  // pre-war market-reform/EU-accession economic model.
  economia: ["C","D","C","D","N","D","C","C","C","D","N","D","C","D","N","D","C","D","C","N"],
  controle: ["CT","D","C","D","C","D","CT","D","CT","D","C","N","N","D","CT","D","CT","D","C","D"],
  // Massive Western arms/financial dependency (US/EU aid) and deliberate EU-accession trade integration
  // (DCFTA), but wartime domestic-production protection for the defense-industrial base.
  comercio: ["C","D","C","D","C","D","C","D","C","CT","C","C","C","CT","C","D","C","CT","C","C"],
  // The 2018 creation of the autocephalous Orthodox Church of Ukraine, breaking from the Moscow
  // Patriarchate, was an explicitly nation-building religious-political act; society remains
  // majority-religious (Orthodox/Greek-Catholic) but with real state-driven religious realignment.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Comparatively more socially conservative than Western Europe on LGBT rights (civil-partnership
  // legislation stalled in parliament for years despite EU-accession pressure and some wartime societal
  // shift), but genuinely progressive/Western-oriented on gender-equality and anti-corruption reform.
  moral: ["C","C","N","C","N","D","C","D","N","C","N","C","D","N","N","D","N","D","N","C"],
  tecnologia: ["C","D","N","C","N","N","D","C","N","N","D","C","D","D","D","C","N","D","C","N"],
};

const BIELORRUSSIA = {
  // One of the most centralized post-Soviet states — regions (voblasts) are administered by
  // presidentially-appointed governors with no genuine local self-government of consequence.
  estrutura: ["DT","CT","D","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Lukashenko's 2020 re-election was widely condemned as fraudulent; the resulting mass protests were
  // violently suppressed (thousands detained, opposition leaders jailed or exiled) — one of the least
  // democratic states audited in this project.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Extensive KGB (the agency literally retains the Soviet name) surveillance and political-prisoner
  // apparatus (1,400+ documented as of the mid-2020s); death penalty retained (last in Europe to do so).
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // State-driven Russophone/Soviet-identity promotion over a genuinely distinct Belarusian national
  // culture (Russian is co-official and dominant in practice) — an unusual assimilationist dynamic
  // pointed toward Russia rather than toward a strong independent national identity.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Hosted Russian troops for the February 2022 invasion of Ukraine launched partly from Belarusian
  // territory, and agreed to host Russian tactical nuclear weapons from 2023 — a fully militarily
  // integrated Russian client state.
  diplomacia: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT","D"],
  // Union State integration with Russia and direct military facilitation of the invasion of a neighbor
  // represent about as interventionist/non-neutral a posture as exists in this dataset.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // One of the least-privatized post-Soviet economies — large state-owned industrial enterprises
  // (tractor/truck manufacturing) remain the backbone of the economy, deliberately never subjected to
  // 1990s-style shock-therapy privatization.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  // Extensive state price-setting and directive planning for state enterprises, currency controls, and
  // subsidized state-enterprise employment — a genuinely dirigiste command-adjacent economy.
  controle: ["CT","DT","CT","DT","C","D","CT","D","CT","D","CT","D","C","D","CT","DT","CT","DT","C","DT"],
  // Heavily sanctioned by the West since 2020-21 (and further after facilitating the 2022 invasion),
  // reoriented trade almost entirely toward Russia and the Eurasian Economic Union bloc — a genuinely
  // protectionist, sanctions-isolated trade posture.
  comercio: ["CT","DT","CT","DT","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D"],
  // Officially secular (Soviet-legacy) but Orthodox Christianity retains real cultural influence;
  // religion is state-monitored/regulated rather than either fully suppressed or established.
  religiao: ["C","C","C","C","N","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Deeply socially conservative and traditionalist by state ideology (Lukashenko has made explicitly
  // homophobic public statements, no legal recognition for same-sex couples, restrictive on gender
  // issues) — one of the most traditionalist profiles in this batch.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","C","D","CT","D","CT"],
  // Soviet-legacy heavy-industrial identity (tractors, trucks — MAZ, BelAZ) rather than an innovation
  // economy; minimal domestic tech sector beyond a modest pre-2020 IT-outsourcing industry that has
  // since largely emigrated amid repression.
  tecnologia: ["N","C","N","C","N","N","D","C","N","N","N","D","D","N","N","D","N","C","N","D"],
};

export const PROFILES = {
  "australia": AUSTRALIA,
  "nova-zelandia": NOVA_ZELANDIA,
  "irlanda": IRLANDA,
  "ucrania": UCRANIA_CONTEMPORANEA,
  "bielorrussia": BIELORRUSSIA,
};
