// FQA078 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// buber: "I and Thou" (1923) distinguished genuine relational "I-Thou" encounter from objectifying
//   "I-It" relation, advocated communitarian/cooperative socialism inspired by the kibbutz movement, and
//   was a cultural (not political) Zionist who favored Jewish spiritual renewal and explicitly advocated
//   a binational Arab-Jewish state over exclusivist nationalism.
// olof-palme: Swedish PM and Social Democratic leader — expanded the Nordic welfare state extensively,
//   vocally opposed the Vietnam War (comparing US bombing to Nazi atrocities), supported liberation
//   movements (ANC, Sandinistas), championed nuclear disarmament via the Palme Commission, assassinated
//   in 1986.
// karl-marx: historical materialism and the critique of capitalism (surplus-value exploitation theory
//   in "Das Kapital"), the "Communist Manifesto" call to revolutionary proletarian action, believed
//   capitalism's internal contradictions would produce its own collapse toward a stateless, classless
//   communist society via a transitional "dictatorship of the proletariat," explicit atheist
//   materialism ("religion is the opium of the people").
// rosselli: "Liberal Socialism" (written in prison/exile) explicitly synthesized liberal freedom with
//   socialist economic justice, rejecting Marxist determinism for ethical/voluntarist reform; founded
//   the "Giustizia e Libertà" anti-fascist resistance, fought in the Spanish Civil War against Franco,
//   assassinated by fascist agents in France in 1937.
// orwell: fought in the Spanish Civil War with the anti-Stalinist POUM militia — "Homage to Catalonia"
//   documented his disillusionment with Soviet-backed Communist suppression of anarchist/POUM
//   revolutionaries; a democratic socialist whose "1984" and "Animal Farm" fiercely attacked
//   totalitarianism specifically from the left, targeting Stalinism's betrayal of revolutionary ideals.

const BUBER = {
  // Advocated decentralized, cooperative kibbutz-style communities as the authentic model of communal
  // social organization, explicitly favoring a binational federated Arab-Jewish state over an
  // exclusivist unitary nationalist one.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  poder: ["N","D","N","D","N","D","N","C","N","D","N","D","N","D","D","D","N","D","D","D"],
  // As a cultural Zionist, favored Jewish spiritual/communal renewal in Palestine while explicitly
  // advocating Arab-Jewish binational coexistence and dialogue over exclusivist territorial nationalism
  // — a genuinely pluralistic, non-assimilationist, non-exclusivist vision distinct from political
  // Zionism's state-nationalist current.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // The "I-Thou" dialogical ethic extended into a genuinely pacifist-leaning approach to the Arab-Jewish
  // conflict, favoring dialogue and coexistence over conquest or forced territorial partition.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Communitarian/cooperative socialism inspired by the kibbutz model — collective ownership and
  // shared labor organized at the community level, per the established collectivist-economics treatment.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  // A profoundly religious Jewish existentialist philosopher (deeply influenced by Hasidic thought) for
  // whom the "I-Thou" relation with the eternal "Thou" (God) was foundational — religion was central,
  // not peripheral, to his entire philosophical project.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const OLOF_PALME = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["D","C","D","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Vocally opposed the Vietnam War (comparing US bombing tactics to Nazi-era atrocities in a famous
  // 1972 speech, straining Swedish-US relations), pursued a deliberately non-aligned, morally assertive
  // internationalist foreign policy independent of both Cold War blocs.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Chaired the Palme Commission on international disarmament/security and actively supported national
  // liberation movements (ANC against apartheid, Sandinistas in Nicaragua, Vietnamese independence) as
  // a matter of consistent international solidarity — genuinely assertive moral internationalism.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Expanded the Swedish welfare state significantly (universal healthcare, generous parental leave,
  // strong union bargaining power) within a fundamentally mixed economy retaining a large, globally
  // competitive private industrial sector (Volvo, Ericsson) — the defining "Swedish model" synthesis.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const KARL_MARX = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Believed genuine proletarian democracy would emerge only after the revolutionary transitional
  // "dictatorship of the proletariat" phase dismantled bourgeois-state institutions — a developmental,
  // not immediately liberal-representative, theory of political transformation.
  representacao: ["C","C","D","C","D","CT","C","C","D","CT","C","D","D","D","C","D","D","D","C","D"],
  poder: ["N","D","N","D","N","D","N","C","N","D","N","D","N","D","D","D","N","D","D","D"],
  imigracao: ["D","CT","D","C","D","C","D","C","D","CT","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["C","C","D","C","C","C","D","C","C","D","C","N","C","N","C","D","D","D","C","N"],
  // "Workers of the world, unite!" — explicitly internationalist, believing proletarian revolution must
  // be a cross-border phenomenon undermining the capitalist world system as a whole, not confined to
  // one nation.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Das Kapital" theorized capitalist exploitation via surplus value extraction from labor and called
  // for abolishing private ownership of the means of production entirely in favor of collective/
  // proletarian ownership — the foundational, maximal anti-capitalist economic theory.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  // Believed a transitional revolutionary state must actively direct the expropriation and
  // reorganization of the economy (the "dictatorship of the proletariat") before the state itself
  // eventually withers away — extensive, deliberate transitional state economic direction.
  controle: ["CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // "Religion is the opium of the people" — a foundational, explicit materialist critique treating
  // religion as ideological superstructure obscuring class exploitation, among the most emphatically
  // atheist economic theorists of the 19th century.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Believed bourgeois family structure and morality were themselves products of capitalist property
  // relations to be transformed alongside the economic revolution, though his own writings engaged
  // social-liberation questions less systematically than economic ones.
  moral: ["C","D","C","N","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Viewed industrial technological development under capitalism as simultaneously exploitative and a
  // necessary precondition for the material abundance that would make communism possible — a genuinely
  // dialectical, not simply anti- or pro-tech, position.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","D"],
};

const ROSSELLI = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // "Liberal Socialism" explicitly fused liberal political freedoms (free press, competitive elections,
  // civil liberties) with socialist economic justice — a genuinely synthesized, not merely tactical,
  // commitment to both traditions simultaneously.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Founded "Giustizia e Libertà" to organize active anti-fascist resistance against Mussolini,
  // including armed resistance in the Spanish Civil War — a genuinely committed anti-authoritarian
  // activist, not merely an academic theorist.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Personally fought against Franco's forces in the Spanish Civil War as part of an internationalist
  // anti-fascist volunteer commitment — genuinely interventionist in defense of democratic/anti-fascist
  // causes abroad.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Rejected Marxist economic determinism for an ethical, voluntarist socialism — favored gradual,
  // democratically-achieved redistribution and worker empowerment over revolutionary expropriation,
  // a genuinely more moderate "liberal socialist" economic program than Marx's.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const ORWELL = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // "Homage to Catalonia" documented his firsthand experience of genuine grassroots worker-council
  // self-organization in revolutionary Barcelona, and his lasting political commitment centered
  // explicitly on preserving genuine democratic accountability against any concentration of power —
  // left or right.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Fought with the anti-Stalinist POUM militia and personally witnessed Soviet-backed Communist forces
  // violently suppress anarchist and POUM revolutionaries in Barcelona (1937) — this firsthand
  // experience of "revolution betrayed" directly shaped "1984"'s and "Animal Farm"'s fierce warnings
  // against surveillance-state coercion and manufactured propaganda from any authority, left or right.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Volunteered to fight fascism directly in the Spanish Civil War as an internationalist anti-fascist
  // commitment, though his later writing emphasized skepticism of imperial power projection generally
  // (drawing on his own early anti-imperialist turn after serving in the Burma colonial police).
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // A committed democratic socialist ("The Road to Wigan Pier" documented working-class poverty with
  // sympathy for redistribution) who nonetheless rejected Soviet-style total state economic control as
  // a betrayal of genuine socialist ideals — favored British Labour-style democratic economic reform.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  // "1984"'s central warning is precisely against total state economic/informational control (the
  // Ministry of Plenty's rigged statistics, permanent scarcity) — deeply suspicious of unchecked state
  // planning apparatus even while supporting genuine democratic redistribution.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","C","N","DT","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // A fierce advocate of intellectual honesty and plain, undistorted language against propaganda and
  // "doublethink" — a defining moral commitment to truth-telling and individual conscience against
  // manufactured official narratives from any authority.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "buber": BUBER,
  "olof-palme": OLOF_PALME,
  "karl-marx": KARL_MARX,
  "rosselli": ROSSELLI,
  "orwell": ORWELL,
};
