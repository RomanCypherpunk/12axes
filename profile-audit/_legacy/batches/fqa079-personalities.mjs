// FQA079 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// andre-gorz: "Farewell to the Working Class" declared traditional proletariat-centered Marxism
//   obsolete given automation; pioneered political ecology synthesizing environmentalism with anti-
//   capitalism, championed universal basic income and radically reduced working hours as the path to
//   freeing "autonomous" self-realization time from "heteronomous" imposed wage labor — anti-
//   productivist, not anti-technology per se.
// arne-naess: Norwegian philosopher who founded "deep ecology" (1973) — distinguished from "shallow"
//   human-interest-serving environmentalism by insisting on the intrinsic value of all living things
//   regardless of human utility ("biocentric equality"), demanding a radical value-shift and
//   identification with a broader ecological "Self," directly influencing radical environmental
//   movements like Earth First!.
// zapata: Mexican Revolution peasant leader — "Tierra y Libertad" and the 1911 Plan de Ayala demanded
//   immediate land redistribution to indigenous/peasant communities, defended local village (ejido)
//   autonomy against both the old Porfirian hacienda oligarchy and centralizing revolutionary rivals
//   (Carranza) he saw as betraying the agrarian cause, assassinated by government ambush in 1919.
// emile-armand: French individualist anarchist — championed absolute individual sovereignty against
//   all social convention, advocated "camaraderie amoureuse" (free love/plural relationships), was
//   influenced by Stirnerite egoism, and explicitly rejected collectivist/communist anarchism's
//   communal obligations in favor of purely voluntary association.
// daniel-guerin: French historian-activist who tried to synthesize Marxist class analysis with
//   anarchist anti-authoritarianism into "libertarian socialism," championed worker self-management
//   (autogestion), was an openly bisexual pioneering advocate for sexual liberation and gay rights
//   decades before mainstream acceptance, and supported Algerian independence.

const ANDRE_GORZ = {
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Declared the traditional proletariat-vs-capital struggle obsolete given automation, proposing
  // instead a universal basic income and radically shortened working week to free "autonomous"
  // self-realization from "heteronomous" imposed wage labor — a post-Marxist economic vision centered
  // on liberating time, not merely redistributing ownership.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","D","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // "Anti-productivist" — critiqued the goal of maximizing production/growth itself (a "Critique of
  // Economic Reason") as ecologically and humanly destructive, favoring technology's liberating
  // potential only if redirected away from capitalist accumulation toward reduced toil — a genuinely
  // ambivalent, precautionary-toward-growth-obsessed-industrialism position, not blanket tech-optimism.
  tecnologia: ["D","C","D","C","D","D","N","D","D","D","D","C","C","C","D","D","D","C","N","D"],
};

const ARNE_NAESS = {
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","D","C","N","C"],
  // Deep ecology demands a fundamental restructuring of economic priorities around ecological limits
  // rather than either market or state productivism — real, radical value-driven economic direction
  // toward sustainability over growth.
  controle: ["C","D","N","D","CT","D","C","D","CT","D","C","D","N","DT","C","C","N","N","C","DT"],
  comercio: ["N","D","N","D","D","D","N","N","N","D","D","D","N","D","N","D","N","D","N","D"],
  religiao: ["C","D","C","D","C","D","C","N","C","D","N","C","D","N","D","C","D","D","C","N"],
  moral: ["C","D","C","D","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // "Deep ecology" insists on the intrinsic value of all living things independent of human utility and
  // demands radical restraint of industrial/technological expansion in favor of ecological harmony —
  // among the most emphatically anti-industrial-growth, pro-nature positions of any figure audited.
  tecnologia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","DT","CT"],
};

const ZAPATA = {
  // The Plan de Ayala and the broader Zapatista movement defended local village (ejido) communal
  // land autonomy explicitly against both the old Porfirian hacienda system and centralizing
  // revolutionary rivals (Carranza) — a maximally decentralized, community-sovereignty vision rooted
  // in indigenous Morelos village tradition.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Championed direct peasant self-governance and village assemblies as the authentic voice of the
  // agrarian revolution, deeply distrustful of any centralized political authority claiming to
  // represent peasants from above — including rival revolutionary factions.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Led an armed peasant guerrilla army fighting the state and hacienda owners for nearly a decade —
  // his movement used real, sustained armed force, though in defense of land and village autonomy
  // rather than to seize centralized state power for himself.
  poder: ["D","C","D","C","D","C","D","C","DT","C","D","C","N","C","D","C","D","C","D","C"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","D","D","C","DT","C","N"],
  // Fought a sustained, active armed insurgency against both the Porfirio Díaz regime and later
  // revolutionary governments he saw as betraying agrarian reform — genuinely committed to armed
  // struggle to achieve land redistribution.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // "Tierra y Libertad" — the Plan de Ayala demanded immediate expropriation of hacienda lands and
  // restitution to indigenous/peasant communities as communal (ejido) property — a decisive, radical
  // land-redistribution economic program.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  // Focused overwhelmingly on domestic land redistribution rather than any trade-policy program — his
  // movement's economic concern was land ownership and food self-sufficiency for peasant villages, not
  // international commerce.
  comercio: ["C","D","C","D","CT","D","C","D","C","D","C","D","C","D","CT","D","C","D","C","D"],
  // The peasantry of Morelos was deeply Catholic in popular religious practice, and Zapatista imagery
  // itself invoked the Virgin of Guadalupe — religion remained a genuine, unforced cultural presence in
  // the movement rather than either a state-imposed doctrine or a target of suppression.
  religiao: ["D","C","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  moral: ["D","C","D","N","D","C","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  // A pre-industrial peasant agrarian movement whose material concerns centered entirely on land and
  // subsistence agriculture rather than industrial or scientific development.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const EMILE_ARMAND = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Championed absolute individual sovereignty against every form of imposed authority, state or
  // social — the most maximally liberty-maximizing "poder" position conceivable, rejecting any
  // legitimate coercion over the sovereign individual.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Individualist anarchism rejected both capitalist wage labor AND collectivist/communist communal
  // obligation, favoring purely voluntary economic association among sovereign individuals — a
  // genuinely distinct, non-collectivized anarchist economics, more market-individualist in spirit
  // than Bakunin's or Kropotkin's communal models.
  economia: ["D","C","D","C","C","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Advocated "camaraderie amoureuse" (free love/plural relationships outside marriage) and absolute
  // personal autonomy over sexuality, lifestyle, and morality against all social convention — among the
  // most radically libertine moral philosophies of any figure audited, influencing anarchist naturism
  // and free-love movements directly.
  moral: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","C","DT","CT","DT","CT","DT"],
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","D","N","D","N","N","C","N","D"],
};

const DANIEL_GUERIN = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  // A committed anti-colonialist who supported Algerian independence against French rule as a matter
  // of consistent anti-authoritarian principle extended to national liberation.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Actively supported anti-colonial liberation struggles (Algeria) as a matter of consistent
  // anti-authoritarian internationalist solidarity.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Sought to synthesize Marxist class analysis with anarchist anti-authoritarianism into "libertarian
  // socialism," championing worker self-management (autogestion) as the concrete institutional
  // mechanism — genuinely maximal collectivized economics achieved through federated worker control
  // rather than either state planning or market capitalism.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // An openly bisexual pioneering advocate for sexual liberation and gay rights decades before
  // mainstream acceptance, explicitly linking personal/sexual liberation to broader political
  // liberation — among the most genuinely progressive moral profiles of any historical figure audited.
  moral: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","C","DT","CT","DT","CT","DT"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "andre-gorz": ANDRE_GORZ,
  "arne-naess": ARNE_NAESS,
  "zapata": ZAPATA,
  "emile-armand": EMILE_ARMAND,
  "daniel-guerin": DANIEL_GUERIN,
};
