// FQA054 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// republica-de-weimar: 1919-1933 first German democracy — extreme proportional representation
//   produced fragmented, unstable coalitions, Article 48 emergency presidential decree powers were
//   progressively abused (paving the road to 1933), hyperinflation (1923) followed by the culturally
//   vibrant "Golden Twenties" (Bauhaus, cabaret, Institute for Sexual Research), Versailles capped the
//   Reichswehr at 100,000 troops.
// gra-colombia: 1819-1831 Bolívar's short-lived union of modern Colombia/Venezuela/Ecuador/Panama —
//   deliberately centralist and militarized, Bolívar assumed dictatorial emergency powers in 1828 amid
//   Santander's federalist opposition, collapsed from regional rivalry within a decade, convened the
//   1826 Congress of Panama attempting hemispheric Pan-American alliance.
// vaticano: absolute elective monarchy (Pope chosen by the College of Cardinals), smallest sovereign
//   state in the world, no meaningful standing military beyond the ceremonial Swiss Guard, funded by
//   donations/real estate/the IOR "Vatican Bank" rather than a real market economy, the doctrinal seat
//   of the global Catholic Church.
// monaco: constitutional monarchy and tax haven (no resident income tax since 1869), tourism/casino/
//   private-banking economy, highest police-per-capita density in the world, defense treaty with
//   France rather than an independent military, notoriously difficult path to citizenship despite a
//   cosmopolitan wealthy-resident population.
// estonia: Baltic parliamentary republic and "e-Estonia" digital-government pioneer (e-residency,
//   i-voting, digital ID), pioneered the flat personal-income tax in Europe (1994), deep euro-Atlantic
//   alignment driven by historical Soviet-occupation trauma and current Russian-threat perception,
//   large ethnic-Russian minority (~25%) with contested citizenship/language-integration debates.

const REPUBLICA_DE_WEIMAR = {
  // The Länder retained real constitutional power (their own governments/police), though the 1919
  // constitution centralized considerably more authority in Berlin than the old German Empire had.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Full proportional representation and universal suffrage (including women, a first for Germany)
  // produced a genuinely open, competitive multi-party democracy — but Article 48 let the President
  // rule by emergency decree bypassing the Reichstag, a power progressively abused after 1930 and the
  // direct legal mechanism through which Hitler later dismantled the constitution itself.
  representacao: ["CT","C","CT","D","C","D","CT","D","C","DT","C","DT","D","C","CT","D","D","DT","CT","C"],
  // The Freikorps paramilitaries and later a fragile state police apparatus struggled to maintain a
  // monopoly on violence amid continual street-fighting between communist and proto-fascist militias
  // (Spartacist uprising 1919, Kapp Putsch 1920, Beer Hall Putsch 1923) — a genuinely weak, contested
  // security state rather than either a strong-security or strong-liberty extreme.
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  // Berlin in particular became a genuinely cosmopolitan cultural capital (large Jewish, Slavic, and
  // international artistic communities), while a resurgent völkisch nationalist current simultaneously
  // pushed ethnic-German exclusivist rhetoric — a deeply split, unresolved national identity.
  imigracao: ["N","C","D","C","N","C","D","C","N","C","N","C","N","C","N","D","D","D","N","N"],
  // The Versailles Treaty capped the Reichswehr at 100,000 troops with no air force, tanks, or U-boats
  // — a deliberately, externally-imposed military weakness, not a chosen pacifist doctrine.
  diplomacia: ["D","C","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  // Reparations resentment fueled deep revanchist nationalist currents (demanding treaty revision,
  // rearmament, and reclaiming lost territories) that grew stronger as the Republic weakened.
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // The 1927 unemployment-insurance law and expansive Weimar-era welfare/labor protections were
  // genuinely progressive for the era, alongside a still-substantial private industrial base (Krupp,
  // IG Farben) — a real mixed economy under severe reparations/hyperinflation strain.
  economia: ["C","D","C","D","D","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  // The Reichsbank fought a losing battle to control the 1923 hyperinflation, and the state built
  // genuine new regulatory institutions (compulsory wage-arbitration boards, the 1927 unemployment-
  // insurance fund) — real, documented state economic machinery, unlike Gran Colombia's essentially
  // policy-less wartime survival economy.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D","C","N"],
  // Crushing reparations obligations and 1920s hyperinflation forced deep dependence on foreign loans
  // (the 1924 Dawes Plan), but the underlying economy remained a major industrial exporter with an
  // established pre-war global trade network to rebuild upon.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // The "Golden Twenties" produced genuinely radical sexual-liberation culture (Magnus Hirschfeld's
  // Institute for Sexual Research, an openly visible Berlin gay-nightlife scene, avant-garde art and
  // cinema) coexisting uneasily with a strongly traditionalist rural/religious counter-current — one of
  // the most internally split "moral" profiles in this project.
  moral: ["C","D","C","D","N","D","C","N","C","D","C","D","N","N","N","D","C","D","C","N"],
  // Home to a scientific golden age (Einstein, Planck, the birth of quantum mechanics at Göttingen) and
  // architectural/design modernism (the Bauhaus school, founded 1919).
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const GRA_COLOMBIA = {
  // Bolívar deliberately designed a highly centralist state explicitly to prevent the regional
  // fragmentation he feared — a direct rejection of Santander's federalist counter-proposal, which
  // became the central ideological fault line that eventually broke the union apart.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // A constitutional republic on paper (1821 Cúcuta Constitution) that Bolívar himself suspended in
  // 1828 by assuming dictatorial emergency powers amid the Santander-led federalist rebellion and an
  // assassination attempt against him — democratic forms present but overridden in practice at the top.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","D","D","CT"],
  // A young state still fighting to consolidate independence-war gains (against remaining Spanish
  // royalist forces) used substantial military authority domestically, including against internal
  // federalist rebellions (Santander's 1828 revolt).
  poder: ["CT","D","C","D","CT","D","C","D","D","CT","CT","D","N","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Bolívar convened the 1826 Congress of Panama, an explicit attempt to forge a hemispheric Pan-
  // American defensive alliance — an assertive, if ultimately unsuccessful, diplomatic ambition well
  // beyond the state's own borders.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","N"],
  // Explicitly sought regional leadership/unification of northern South America and actively supported
  // independence movements in Peru and Bolivia beyond its own borders — a maximally interventionist,
  // continental-liberation-project posture.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A war-ravaged, primarily agrarian economy with minimal industrial base; the state's overriding
  // priority was military consolidation rather than economic institution-building of any particular
  // ideological stripe.
  economia: ["N","C","N","D","N","D","C","D","N","D","N","D","N","D","N","D","N","D","N","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A staunchly Catholic-heritage society (colonial Spanish legacy), the Church retained major
  // institutional and educational authority even as the new republic's laws were secular in form.
  religiao: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // A pre-industrial, war-torn agrarian society with essentially no independent technological or
  // industrial development capacity in its brief decade of existence.
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","D","N","D","N","D","N","N","D"],
};

const VATICANO = {
  // The most centralized conceivable polity — a single elective absolute monarch (the Pope) governs a
  // territory of 0.49 km² with no subdivisions of any kind.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The Pope is elected for life by the College of Cardinals (themselves Vatican appointees) in a
  // process with zero popular input of any kind — about as far from electoral democracy as a modern
  // state can be, while still being a genuine (if narrow) elective process rather than pure heredity.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Corpo della Gendarmeria maintains tight internal security and surveillance of a uniquely
  // information-sensitive institution (conclave secrecy, canonical/criminal investigations including
  // the 2019-23 financial-corruption trials), though physical violent crime is essentially nonexistent.
  poder: ["C","D","C","D","CT","D","C","D","D","C","C","D","N","C","D","D","C","D","C","D"],
  // Vatican citizenship is granted only functionally/temporarily to those holding a Curia office or
  // diplomatic role, and revoked on leaving the post — an extreme, deliberately narrow
  // religious/institutional membership model with no path for ordinary immigration or assimilation
  // debate in any conventional sense.
  imigracao: ["N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D","N","D"],
  // No standing military beyond the ceremonial ~135-strong Swiss Guard — reliant entirely on Italian
  // protection and international diplomatic immunity rather than any hard-power capacity of its own.
  diplomacia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The Holy See has no capacity for military intervention anywhere, though it exercises enormous
  // doctrinal/moral influence over hundreds of millions of Catholics worldwide via non-military means —
  // on this specifically geopolitical/military axis, an entirely non-interventionist actor by necessity.
  intervencao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Funded by Peter's Pence donations, real-estate holdings, and the IOR ("Vatican Bank") rather than
  // any productive market economy of its own — an essentially non-market, patrimonial-institutional
  // economic model with no meaningful private sector or labor market to speak of.
  economia: ["N","D","CT","D","N","D","C","D","N","D","N","D","N","D","N","D","N","D","N","D"],
  controle: ["C","D","N","D","C","D","C","D","N","D","C","D","N","D","C","D","N","D","N","D"],
  // Trade volume is negligible and largely ceremonial (coins, stamps, tourism-adjacent goods) — the
  // question of tariffs/globalism barely applies to an entity with no real productive export sector.
  comercio: ["N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N","N"],
  // The literal doctrinal seat and central governing authority of the global Catholic Church — the
  // maximally religious polity conceivable, where church and state are not merely fused but identical.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Official Catholic doctrine opposes abortion, contraception, divorce, and same-sex marriage in
  // absolute terms — the maximally traditionalist position on every question in this axis by design.
  moral: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The Vatican Observatory maintains a genuine, centuries-old scientific research tradition
  // (astronomy specifically), though the institution's broader posture toward biotechnology/genetic
  // engineering is doctrinally cautious (opposing embryo research, for instance).
  tecnologia: ["N","C","D","C","N","N","D","C","DT","N","N","C","D","DT","N","N","D","C","N","D"],
};

const MONACO = {
  // A single small unitary principality (2 km²) with no internal subdivisions of governance
  // consequence.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A constitutional monarchy where the Prince retains substantial reserved executive powers
  // (appoints the Minister of State, can dissolve the National Council) alongside a genuinely elected
  // National Council with real, if limited, legislative role — a real but constrained representative system.
  representacao: ["C","C","C","C","C","D","C","C","C","D","C","D","D","C","C","D","D","D","C","D"],
  // The highest police-officer-to-resident ratio in the world and an extremely dense CCTV-surveillance
  // network keep street crime essentially at zero — deliberate maximal security policing, though very
  // low actual coercive violence given the wealthy, small, orderly population it's policing.
  poder: ["C","C","C","C","CT","C","C","C","CT","D","C","C","N","C","D","D","CT","C","D","C"],
  // Extraordinarily internationally cosmopolitan in its wealthy-resident population (over 130
  // nationalities represented) while making Monegasque citizenship itself exceptionally difficult to
  // obtain even after decades of residency — a unique split between celebrated lifestyle multiculturalism
  // and a tightly closed formal-citizenship regime.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","D","DT","D"],
  // No independent military of any real capacity — defense is guaranteed entirely by a treaty
  // obligation with France, the diplomatic opposite of a self-reliant militarist posture.
  diplomacia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","C","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Zero personal income tax for residents since 1869 (funded instead by VAT, tourism, and casino/
  // gambling revenue) makes Monaco perhaps the purest low-tax, private-capital-attracting economy
  // audited in this project.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // A deliberately engineered wealth-attraction tax haven (zero income tax since 1869) rather than
  // Estonia's flat-tax post-Soviet liberalization story — Monaco additionally imposes real property/
  // residency-permit gatekeeping that functions as a form of controlled access to its economy.
  controle: ["D","CT","D","CT","N","C","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  // Deeply globalized private-banking, tourism, and real-estate-driven micro-economy with essentially
  // no domestic industry to protect — a maximally open, capital-magnet trade posture.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","D","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // A socially conservative Catholic-heritage local population coexists with an extremely cosmopolitan,
  // permissive lifestyle culture among its ultra-wealthy international resident class (nightlife,
  // yacht-set social norms) — a genuinely split, class-stratified moral profile.
  moral: ["C","N","C","N","C","D","C","N","C","D","N","D","N","N","N","D","N","D","N","N"],
  // High per-capita wealth funds significant tech/biotech investment ambitions (Monaco has pushed
  // "smart city"/sustainability tech initiatives) despite its tiny physical footprint limiting any
  // large-scale industrial application.
  tecnologia: ["C","D","C","N","C","N","N","C","N","C","C","D","C","D","C","D","C","D","C","N"],
};

const ESTONIA = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // Roughly a quarter of the population is ethnic Russian (concentrated in Narva and Ida-Viru county),
  // and Estonia has maintained genuinely strict citizenship-by-naturalization language requirements
  // since independence — a real, still-contested assimilationist integration policy, sharpened further
  // by post-2022 security anxiety toward Russia.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","D"],
  // A NATO frontline state bordering Russia directly, dramatically increased defense spending and
  // reintroduced serious territorial-defense planning after 2014 (Crimea) and especially 2022 (the
  // full-scale invasion of Ukraine) — genuine, externally-driven militarization from a previously
  // modest defense posture.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Pioneered Europe's flat personal-income tax (1994) as part of an aggressively market-liberal
  // post-Soviet transition, minimal state-owned-enterprise legacy retained — one of the most
  // economically liberal post-communist transitions anywhere.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  // Extremely light-touch regulatory state (top-ranked in the EU for ease of doing business, minimal
  // bureaucracy thanks to the digital-government infrastructure reducing compliance friction rather
  // than adding it).
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A small, deeply trade-dependent open economy fully integrated into the EU single market and
  // Eurozone — strongly globalist by both policy and structural necessity.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // One of the least religious societies on Earth by self-reported belief — Soviet-era secularization
  // combined with a historically weak pre-Soviet church presence left minimal religious revival after
  // independence, unlike Poland's strong Catholic-identity post-communist trajectory.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // The "e-Estonia" digital-government pioneer (e-residency since 2014, i-voting since 2005, near-total
  // digital public-service delivery) makes Estonia among the most tech-forward states in the world by
  // deliberate national strategy.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

export const PROFILES = {
  "republica-de-weimar": REPUBLICA_DE_WEIMAR,
  "gra-colombia": GRA_COLOMBIA,
  "vaticano": VATICANO,
  "monaco": MONACO,
  "estonia": ESTONIA,
};
