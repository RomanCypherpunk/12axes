// FQA063 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// garrett-hardin: American ecologist, "The Tragedy of the Commons" (1968) argued unregulated shared
//   resources are inevitably overexploited absent "mutual coercion mutually agreed upon"; his
//   "lifeboat ethics" essay controversially argued rich nations should NOT aid poor/famine-stricken
//   nations or accept mass immigration, framing this in explicitly Malthusian population-limits terms;
//   later writings included eugenics-sympathetic arguments.
// otto-neurath: Austrian Vienna Circle logical positivist, advocated full "economy in kind"
//   (Naturalrechnung) — physical/technical calculation replacing money-price planning entirely,
//   participated as economic planner in the short-lived 1919 Bavarian Soviet Republic, created the
//   Isotype pictogram data-visualization language, a committed atheist rationalist.
// eduard-bernstein: "father of Marxist revisionism" — explicitly rejected Marx's prediction of
//   capitalism's inevitable collapse ("the movement is everything, the final goal is nothing"),
//   advocated gradual, parliamentary, trade-union-based democratic socialism rather than revolution,
//   directly shaping the later German SPD's reformist trajectory.
// ernst-niekisch: leading German "National Bolshevik" — fused radical nationalism with anti-capitalist
//   socialist revolution, explicitly anti-liberal and anti-Western, sought to align Germany
//   geopolitically with Russia against Anglo-American liberalism, imprisoned by the Nazis (1937-45)
//   despite sharing their authoritarian-nationalist instincts.
// gregor-strasser: led the genuinely more anti-capitalist/socialist-content "left" wing of the early
//   Nazi party (nationalization of industry, land reform, anti-big-business rhetoric) — murdered in the
//   1934 Night of the Long Knives when Hitler purged the party's socialist wing to appease industrialists.

const GARRETT_HARDIN = {
  // His commons-management prescriptions (whether privatization or regulation) generally presuppose
  // a capable central/national authority able to enforce "mutual coercion" — decisively less
  // localist than a genuine federalist commitment.
  estrutura: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","C","N","C","D","D"],
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // "Mutual coercion, mutually agreed upon" was his explicit prescription for commons problems —
  // openly endorsing coercive population-control measures, a genuinely authoritarian-technocratic
  // solution to ecological scarcity.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // The "lifeboat ethics" essay explicitly argued for closing borders and refusing to aid or admit
  // populations from resource-poor nations, framing immigration restriction as ecological necessity —
  // among the most starkly, explicitly restrictionist arguments of any figure audited on this axis.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // "Lifeboat ethics" explicitly argued against foreign aid/intervention to help other nations,
  // reasoning that saving lives now only worsens future overpopulation catastrophe — a genuinely
  // harsh, isolationist non-interventionism grounded in population ecology rather than pacifism.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  // Advocated either strict privatization of common-pool resources OR strong government regulation
  // (his essay treats both as valid "mutual coercion" solutions to the commons problem) — genuinely
  // dirigiste regardless of which specific mechanism, so long as unregulated free access ends.
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // A committed Malthusian skeptic of technological solutions to resource scarcity ("the population
  // problem has no technical solution") — explicitly argued against relying on innovation to escape
  // ecological limits, a genuinely anti-tech-optimist position.
  tecnologia: ["D","C","D","C","D","C","DT","C","DT","C","D","C","D","C","D","C","D","C","D","C"],
};

const OTTO_NEURATH = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed democratic socialist (not an authoritarian centralist) who believed technical planning
  // should serve, not replace, democratic deliberation — participated in the Bavarian Soviet Republic's
  // short-lived council-based (not purely top-down) governance experiment.
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "Economy in kind" (Naturalrechnung) explicitly proposed replacing money-price calculation entirely
  // with direct physical/technical accounting of production and needs — one of the most thoroughgoing
  // anti-market planning doctrines of any figure in this project, predating and directly informing the
  // later "socialist calculation debate."
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  // Advocated comprehensive centralized technical administration of the entire economy by expert
  // planners — a genuinely maximal, explicitly theorized planned-economy position.
  controle: ["CT","DT","CT","DT","C","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","DT","C","DT"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","N"],
  // A committed logical-positivist atheist rationalist (Vienna Circle), explicitly rejected
  // metaphysical/religious claims as meaningless within his "unified science" framework.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["C","D","C","D","C","DT","C","N","C","DT","C","D","C","N","N","D","N","DT","C","D"],
  // Created the Isotype pictogram data-visualization language explicitly to make statistics and
  // scientific/technical knowledge accessible to ordinary citizens — a genuinely innovative,
  // technology/communication-forward project central to his life's work.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

const EDUARD_BERNSTEIN = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // "The movement is everything, the final goal is nothing" — explicitly committed to working through
  // existing parliamentary institutions and trade unions rather than revolutionary rupture, a genuinely
  // democratic-gradualist commitment that shaped the modern social-democratic tradition.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","CT","DT","D","D","CT","DT","D","DT","CT","C"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Explicitly rejected Marx's prediction of capitalism's inevitable collapse and argued socialism
  // should be built gradually through legislative reform, cooperatives, and union bargaining within a
  // still-partly-market economy — genuinely less maximalist than Lassalle's state-cooperative model or
  // Neurath's total anti-market planning.
  economia: ["C","D","C","D","D","D","C","C","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Championed evolutionary social reform including support for women's suffrage and broader
  // democratic-rights expansion as part of the gradualist socialist program.
  moral: ["C","D","C","D","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const ERNST_NIEKISCH = {
  // "National Bolshevism" sought a Prussian-militarist-socialist synthesis fused with strong central
  // state authority — explicitly anti-federalist, anti-pluralist, seeking unified national strength.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Explicitly anti-liberal and anti-parliamentary-democracy — viewed Weimar's parliamentary system as
  // a corrupting Western import to be swept away by authoritarian national-revolutionary rule.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Advocated an authoritarian, militarized national-revolutionary state, though he himself was
  // imprisoned and brutally treated by the Nazis (1937-45) for opposing Hitler specifically —
  // ironic given his own authoritarian sympathies in the abstract.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Deeply völkisch German nationalist, though his "Ostorientierung" (turn to the East) sought
  // alignment with Russia specifically against Anglo-American liberal civilization — nationalist
  // exclusivism combined with a geopolitically unusual pro-Russian orientation.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Advocated a militarized Prussian-socialist state explicitly oriented toward confrontation with
  // Anglo-American liberal powers — genuinely militarist doctrine.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // The "Ostorientierung" doctrine explicitly called for Germany to break from the West and align
  // strategically with Russia — a deliberate, assertive geopolitical realignment rather than either
  // neutrality or Western alliance-embeddedness.
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Fused anti-capitalist economic doctrine (opposing both liberal-capitalist markets and Marxist
  // internationalism) with nationalist state control — a genuinely dirigiste "national-revolutionary"
  // economic model distinct from either pure Marxism or fascism.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  // Advocated national economic self-sufficiency oriented toward the Eastern bloc rather than Western
  // liberal trade integration — a deliberately protectionist, geopolitically-realigned trade posture.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Rejected Nazism's neo-pagan/biological racial mysticism, but was not conventionally religious
  // either — his worldview centered on nationalist-revolutionary geopolitics rather than faith.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

const GREGOR_STRASSER = {
  // As a sitting NSDAP Reichsorganisationsleiter, built the actual mass party organization/machine
  // that seized and centralized state power in 1933 — a direct organizational participant in Nazi
  // state centralization, distinct from Niekisch's position as an outside intellectual critic.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","DT","C"],
  // Organized NSDAP electoral campaigns and party structure explicitly to seize mass power through
  // (initially) legal electoral means before governing dictatorially — a mass-movement path to power,
  // distinct from Niekisch's more purely theoretical anti-parliamentary doctrine.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // Personally led SA paramilitary organizing (street violence against political opponents) as a core
  // party function — an actual perpetrator of organized political violence, not merely a theorist
  // advocating authoritarian state coercion in the abstract.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // A committed antisemite within the NSDAP's racial-nationalist framework (though he later broke with
  // Hitler over economic policy, not over antisemitism itself) — racial exclusion was integral to his
  // nationalism, not merely cultural-linguistic as with Niekisch's geopolitical Ostorientierung.
  imigracao: ["CT","DT","C","D","CT","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Focused his political energy on domestic party organization and paramilitary mobilization rather
  // than Niekisch's grand geopolitical realignment theorizing — diplomacia mattered less to Strasser's
  // actual project than internal German power-seizure.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","D","D","C","DT","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // Advocated genuine nationalization of major industry, land reform breaking up large estates, and
  // anti-big-business rhetoric explicitly targeting capitalist elites — real, substantive socialist
  // economic content distinct from Hitler's eventually more capital-accommodating NSDAP program, and a
  // more concretely legislative program than Niekisch's abstract "national-revolutionary" doctrine.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  // Championed protecting German industry and agriculture from foreign competition/finance capital
  // (explicitly targeting "Jewish finance capital" in his rhetoric) as part of the "anti-capitalist"
  // nationalist program — deliberately protectionist and racially coded.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // A nominal Catholic who, unlike Niekisch, operated within a party (the NSDAP) that cultivated an
  // ambivalent, often opportunistic relationship with the churches rather than Niekisch's more purely
  // secular-geopolitical worldview.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  // A committed antisemite and authoritarian nationalist advocating traditional family/social order
  // alongside his economic radicalism — socially reactionary despite the economic-left rhetoric.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["C","D","N","D","N","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

export const PROFILES = {
  "garrett-hardin": GARRETT_HARDIN,
  "otto-neurath": OTTO_NEURATH,
  "eduard-bernstein": EDUARD_BERNSTEIN,
  "ernst-niekisch": ERNST_NIEKISCH,
  "gregor-strasser": GREGOR_STRASSER,
};
