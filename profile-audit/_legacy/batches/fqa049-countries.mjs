// FQA049 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// paises-baixos: unitary but decentralized (strong municipal autonomy), fragmented multi-party PR
//   democracy, pioneer of same-sex marriage (2001)/euthanasia/drug tolerance, very secular, deeply
//   globalized trade economy (Rotterdam, ASML), strict gun control, consensus "polder model" welfare state.
// italia: unitary with 5 special-autonomy regions, unstable coalition parliamentary republic,
//   Catholic-influenced but secularizing, large historical state-owned-industry legacy (IRI), strict
//   gun laws, NATO member with below-target defense spending, deep EU integration.
// espanha: genuinely quasi-federal "State of Autonomies" (Basque/Catalan fiscal & policing autonomy),
//   parliamentary constitutional monarchy, rapid post-Franco secularization, early (2005) marriage
//   equality, strict gun control, NATO/EU member.
// noruega: unitary, NOT an EU member (EEA only, rejected membership twice by referendum), oil-fund
//   sovereign wealth state with major public ownership of Equinor, very low religiosity (disestablished
//   state church 2012), peacekeeping/mediator diplomatic reputation, strict gun control despite large
//   hunting culture.
// dinamarca: unitary, EU member with major opt-outs (defense, JHA, euro), among the most restrictive
//   immigration policies in Western Europe since the 2019 "paradigm shift" and "ghetto laws", flexicurity
//   labor-market model, pioneer of registered same-sex partnerships (1989), high-trust low-corruption state.

const PAISES_BAIXOS = {
  // Constitutionally unitary, but provinces/municipalities hold real fiscal and policy autonomy in
  // practice (housing, welfare delivery); no serious federalist movement.
  estrutura: ["C","D","C","D","D","C","C","C","D","C","C","D","C","D","C","D","D","D","C","D"],
  // Highly fragmented proportional-representation democracy (typically 15+ parties in parliament),
  // strong constitutional protections, referendums rare (advisory referendum abolished 2018).
  representacao: ["CT","DT","CT","D","C","DT","CT","D","N","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Famous "gedoogbeleid" tolerance policy for cannabis coffeeshops, liberal drug/euthanasia (2002
  // Termination of Life Act) and sex-work regulation (legal prostitution), balanced by strong digital-
  // surveillance capacity (leading signals-intelligence agency) and strict gun licensing.
  poder: ["N","CT","C","C","N","CT","N","CT","CT","C","N","CT","N","C","DT","CT","N","C","D","C"],
  // Multicultural integration debates intensified post-2000s (Fortuyn/Wilders), but official policy
  // still emphasizes civic integration ("inburgering") requirements over pure assimilation, and the
  // country remains one of the most religiously/ethnically diverse and internationally-oriented in Europe.
  imigracao: ["C","C","D","C","N","C","D","C","C","C","C","C","D","C","C","D","DT","C","D","N"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","CT","D","C","D","C","D","C","D","D","D","C"],
  // Strongly multilateralist, hosts the ICJ/ICC in The Hague, EU/NATO core member without regional
  // hegemonic ambitions.
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Highly market-oriented for a European welfare state (extensive privatization since the 1980s,
  // strong private-pension-fund system) alongside a generous universal social safety net — a genuinely
  // moderate, "polder model" mixed economy.
  economia: ["D","C","D","C","DT","D","C","C","N","D","N","C","C","D","DT","D","D","C","N","C"],
  controle: ["N","C","D","C","C","D","C","D","C","D","D","C","D","C","C","C","D","D","C","D"],
  // Rotterdam is Europe's largest port and the country runs one of the world's most trade-dependent
  // economies (exports ~90% of GDP) — a global-trade economy almost by definition.
  comercio: ["D","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Post-pillarization secularization is dramatic — majority non-religious since the 2000s, strong
  // church-state separation norms, euthanasia/abortion legal and largely settled issues.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // First country to legalize same-sex marriage (2001), legal euthanasia, legal sex work, generally the
  // most socially liberal large profile in this cohort.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","C","D","C","D","C","DT","CT","D"],
  // ASML (world's most advanced lithography-equipment maker) anchors a genuinely tech-forward economy,
  // tempered by strong environmental-precaution culture (nitrogen/farming crisis politics).
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const ITALIA = {
  // Unitary but with 5 special-autonomy regions (Sicily, Sardinia, Trentino-Alto Adige/South Tyrol,
  // Friuli-Venezia Giulia, Valle d'Aosta) holding real extra fiscal/legislative powers — genuine
  // regional variation without a federalist constitution.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","C","D"],
  // Notoriously unstable coalition governments (68+ governments since 1946) but robust constitutional
  // court and free press; recent Meloni government has raised some centralization/press-independence
  // concerns without a clear democratic-backsliding verdict yet.
  representacao: ["C","D","C","N","C","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  // Strict gun-ownership licensing regime, relatively harsh drug laws historically (though cannabis
  // decriminalized for personal use), strong state security apparatus with a long history of anti-
  // Mafia/anti-terrorism special powers (post-Years of Lead legislation).
  poder: ["C","D","C","C","C","D","C","D","C","D","C","C","N","C","N","D","C","C","D","D"],
  // Post-2015 migration-crisis politics (Lampedusa arrivals) pushed mainstream politics toward
  // assimilationist/border-control rhetoric (Meloni government's Albania offshore-processing deal),
  // despite deep historical emigration identity.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","DT"],
  // Meloni government has pushed a more assertive/sovereigntist NATO-southern-flank posture (Libya,
  // Mediterranean migration security) than the EU-mainstream diplomatic style.
  diplomacia: ["C","C","D","C","C","C","D","C","D","C","C","N","N","C","D","C","D","DT","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Historically massive state-owned industrial sector (IRI conglomerate, largest in Europe until
  // 1990s privatizations); still significant state stakes in energy (Eni), rail, and post — a moderately
  // public-leaning mixed economy relative to Northern Europe.
  economia: ["C","D","C","D","D","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  // Heavy public debt (>140% of GDP), significant labor-market rigidity historically (Article 18
  // protections, since partially reformed), high tax burden.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Deep EU single-market integration but a real protectionist instinct on food/agriculture identity
  // ("Made in Italy" branding laws, resistance to lab-grown meat, opposition to some EU trade deals like
  // Mercosur over agricultural competition).
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","C","C","D","C","D"],
  // Historically deeply Catholic (Vatican enclave), still culturally influential though church
  // attendance has declined sharply; civil unions legalized 2016 but full marriage equality not yet.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Legal civil unions since 2016 but no full same-sex marriage/adoption rights; abortion legal since
  // 1978 but access constrained by high rates of conscientious-objector doctors; more socially
  // traditional than Northern/Western Europe on family structure.
  moral: ["C","C","N","C","N","D","C","N","C","D","N","C","D","N","N","D","N","D","N","N"],
  tecnologia: ["N","C","N","C","N","N","N","C","N","N","N","C","C","N","N","N","N","C","N","N"],
};

const ESPANHA = {
  // The "State of Autonomies" is genuinely quasi-federal: Basque Country and Navarre have full fiscal
  // autonomy (own tax collection), Catalonia and the Basque Country have their own police forces
  // (Mossos d'Esquadra, Ertzaintza) — far more devolved than Italy's special regions.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Stable parliamentary constitutional monarchy since 1978 transition, but the 2017 Catalan
  // independence referendum crisis (declared illegal, leaders jailed/exiled, later pardoned) remains a
  // real unresolved fault line in the representation/territorial-legitimacy story.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","C","DT"],
  poder: ["C","C","C","C","C","C","C","C","C","D","C","C","N","C","DT","D","C","C","D","C"],
  // 2015 migration debates and Vox's rise pushed border/assimilation rhetoric into the mainstream, but
  // Spain's actual policy has stayed comparatively open (regularizations, work-visa pathways) relative
  // to its neighbors.
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  // NATO membership itself was contentious (won a 1986 referendum only after guarantees against
  // nuclear weapons/full military integration); diplomacy oriented heavily toward Latin America
  // (Ibero-American Summit) and the Maghreb (Ceuta/Melilla, Western Sahara) rather than a Mediterranean-
  // security-hawk posture.
  diplomacia: ["D","C","D","C","D","C","D","C","D","CT","D","C","D","N","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Milder state-industrial legacy than Italy's IRI (INI conglomerate was smaller and dismantled
  // earlier), but retains a large public banking/savings-bank sector footprint and strong regional
  // fiscal transfers — moderate, slightly less public-leaning than Italy.
  economia: ["D","C","C","D","D","DT","C","C","C","D","N","D","C","D","N","D","C","D","C","D"],
  // Persistently high youth unemployment (historically 30%+) drove significant 2012 labor-market
  // deregulation reforms; less rigid than Italy's traditional Article 18 protections, but strong
  // regional-government spending autonomy (health/education run by the autonomous communities).
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","D","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","N","C","D","C"],
  // Post-Franco secularization is one of the most dramatic in Europe — mass church attendance collapsed
  // from near-universal under Franco to a minority practice within two generations; explicitly secular
  // 1978 Constitution.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","C","DT"],
  // Legalized same-sex marriage in 2005 — among the first countries in the world — plus liberal
  // abortion law (2010) and progressive gender-identity legislation (2023 "trans law") — one of the
  // most socially liberal Catholic-heritage countries.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Real solar/wind-energy build-out and a fast-growing tech/startup scene (Madrid, Barcelona) but
  // without Italy's equivalent industrial-engineering-export identity — modestly more nature/renewable-
  // leaning than tech-maximalist in framing.
  tecnologia: ["C","D","N","C","C","C","N","C","N","D","N","C","C","N","C","N","N","C","C","D"],
};

const NORUEGA = {
  // Unitary state (no serious federalist tradition), though Sámi Parliament (Sápmi self-governance
  // body) gives limited indigenous self-rule in the north.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Strict gun-ownership regime despite large hunting culture (licensing, storage rules tightened
  // further after the 2011 Utøya massacre); progressive on drugs/decriminalization debates; very high
  // institutional trust reduces perceived need for heavy surveillance/security powers.
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // Comparatively restrictive/cautious asylum policy relative to its Nordic self-image (tightened
  // rules after 2015 migrant crisis, cross-party consensus favoring integration-with-limits over open
  // multiculturalism).
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Not NATO-neutral like Sweden/Finland historically were — founding NATO member since 1949 (shares a
  // border with Russia), but strong peacekeeping/mediator diplomatic identity (Oslo Accords host).
  diplomacia: ["C","C","D","C","C","C","D","C","D","C","C","N","D","C","D","C","D","D","C","C"],
  // Bigger defense-industrial and territorial-defense footprint than Denmark given its long land/sea
  // border with Russia and High North (Svalbard, Barents Sea) strategic exposure, but the mediator
  // tradition (Oslo Accords, Colombia peace process host) tempers a purely nationalist posture.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","C","D","C","D"],
  // The sovereign wealth "Oil Fund" (largest in the world) and majority state ownership of Equinor
  // (energy) and other strategic firms make Norway's economy genuinely one of the most publicly-owned
  // in the developed world, despite a market-friendly business climate otherwise.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  // The Oil Fund's fiscal rule (spending only the expected real return) is itself a form of disciplined
  // long-term state economic planning; strong labor-market coordination (centralized wage bargaining).
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  // Not an EU member (rejected membership 1972 and 1994 referendums) but deeply integrated via the EEA;
  // fiercely protects its agricultural and fisheries sectors from full liberalization — a genuinely
  // more protectionist trade stance than its EU Nordic neighbors on those specific sectors.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D"],
  // Disestablished the Lutheran state church in 2012; one of the least religious societies in the
  // world by self-reported belief and practice.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Major oil/gas exporter creating real tension with a strong domestic climate/environmental identity
  // and electric-vehicle leadership (highest EV adoption rate in the world) — genuinely mixed.
  tecnologia: ["C","D","C","N","C","C","N","C","N","C","C","D","C","D","C","D","C","D","C","N"],
};

const DINAMARCA = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // The 2019 Social Democrat-led "paradigm shift" explicitly reoriented policy from integration to
  // repatriation-where-possible; "ghetto laws" (renamed "parallel societies" laws) mandate mixed-
  // ethnicity housing quotas and compulsory childcare for children in designated areas — the most
  // assimilationist/restrictive immigration regime in Scandinavia by a wide margin.
  imigracao: ["CT","D","C","D","C","D","CT","D","CT","D","CT","D","C","D","C","D","D","DT","CT","DT"],
  diplomacia: ["C","C","D","C","C","C","D","C","C","C","C","N","N","C","D","C","D","D","C","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","C","D","C","D"],
  // "Flexicurity" model: very easy hiring/firing (flexible, market-style) combined with a generous
  // state-funded unemployment/retraining safety net — a genuinely hybrid economy, not simply high or
  // low public.
  economia: ["C","C","D","C","D","D","C","C","C","D","N","C","C","D","N","D","D","D","C","D"],
  controle: ["N","C","D","C","C","D","C","D","C","D","D","C","D","C","C","C","D","D","C","D"],
  // Small, highly trade-dependent economy (Maersk shipping, pharma exports like Novo Nordisk, Vestas
  // wind turbines) — fundamentally pro-free-trade/pro-EU-single-market, with only a narrow carve-out of
  // genuine protective sympathy for its dairy/pork agricultural export lobby within EU CAP negotiations.
  comercio: ["D","C","D","C","DT","C","D","C","N","CT","C","C","N","C","N","C","D","C","D","C"],
  // Formally has a state Lutheran church (unlike Norway/Sweden which disestablished), but actual
  // religious practice/belief is very low — one of the most secular societies in practice despite the
  // formal establishment.
  religiao: ["C","D","C","D","C","D","C","C","C","D","C","DT","D","D","C","DT","C","DT","C","C"],
  // Pioneer of registered same-sex partnerships (1989, world first), generally very socially liberal,
  // though the immigration "paradigm shift" shows real limits to Danish social-liberal consensus when
  // it intersects with cultural-integration anxiety.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Novo Nordisk (pharma/biotech, GLP-1 drugs) and Maersk (shipping-logistics tech) anchor a genuinely
  // innovation-forward economy, but the country is also Europe's most livestock-export-intensive per
  // capita, keeping agricultural/animal-welfare-precaution instincts strong (e.g. mink-farm ban 2020).
  tecnologia: ["C","D","C","N","C","D","N","D","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "paises-baixos": PAISES_BAIXOS,
  "italia": ITALIA,
  "espanha": ESPANHA,
  "noruega": NORUEGA,
  "dinamarca": DINAMARCA,
};
