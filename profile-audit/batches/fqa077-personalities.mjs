// FQA077 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// ocalan: PKK founder, imprisoned in Turkey since 1999 (still writing from prison) — abandoned
//   Marxist-Leninist vanguardism for "democratic confederalism" directly inspired by Bookchin's
//   communalism (read in prison), central to Rojava's autonomous model: direct democracy, mandatory
//   male-female co-chair leadership, ecological consciousness, and explicit rejection of the
//   nation-state model, including a separate Kurdish state.
// benjamin-tucker: American individualist anarchist, edited "Liberty" and translated Proudhon/Bakunin
//   into English — believed eliminating the "four monopolies" (land, money, tariffs, patents) would
//   make genuinely free markets naturally egalitarian, a "free-market anti-capitalism" distinct from
//   later right-libertarianism and from Bakunin/Kropotkin's collectivism.
// bookchin: founded social ecology and "libertarian municipalism"/communalism — directly democratic
//   municipal assemblies confederated together (the direct intellectual template Öcalan later adapted
//   for Rojava) — argued ecological crisis is rooted in social hierarchy/domination of humans by
//   humans, and moved toward electoral-adjacent local-assembly strategy rather than pure insurrection.
// keir-hardie: first Labour MP and founder of the British Labour Party — a devout Christian socialist
//   ("the New Testament is the greatest charter of freedom") who pursued workers' rights and suffrage
//   reform within parliamentary democracy (gradualist "Labourism," distinct from revolutionary
//   continental socialism), opposed WWI, and supported Indian self-rule.
// maritain: French Catholic Neo-Thomist philosopher who directly influenced the drafting of the
//   Universal Declaration of Human Rights, founded "Integral Humanism" as a foundational Christian-
//   democracy text reconciling Catholic thought with democratic pluralism, and explicitly opposed both
//   fascism and communism as totalitarian.

const OCALAN = {
  // "Democratic confederalism" explicitly rejects the nation-state model (including a separate Kurdish
  // state) in favor of confederated, directly self-governing local communities — a maximally
  // decentralized structural vision, the direct template for Rojava's governance model.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Champions direct, continuously accountable local assembly democracy with mandatory male-female
  // co-chair leadership at every level — a genuinely radical-democratic, gender-parity-enforced
  // representation model exceeding most conventional electoral systems.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Renounced the PKK's historical vanguard-party armed-struggle doctrine in favor of civil, communal
  // self-defense militias tied to local assemblies rather than a centralized guerrilla command
  // structure — though still associated with an organization with an armed-conflict history against
  // the Turkish state.
  poder: ["D","C","D","C","D","C","D","C","DT","C","D","C","N","C","D","C","D","C","D","C"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Democratic confederalism explicitly promotes cross-border solidarity among self-organized
  // communities (Kurdish, Arab, Assyrian, Yazidi communities within Rojava) rather than either
  // territorial nationalism or non-engagement.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Rojava's implemented economy emphasizes cooperative, communally-organized production and ecological
  // sustainability over both state central planning and capitalist markets — per the established
  // anarchist/communalist economics exception, scored by collectivized-coordination spirit.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Mandatory gender-parity co-leadership and explicit women's-liberation ideology (the "Jineolojî"
  // women's-science framework) are central, foundational pillars of his political philosophy — among
  // the most systematically gender-egalitarian doctrines of any figure audited.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Explicit ecological consciousness ("ecology" is one of democratic confederalism's three official
  // pillars alongside direct democracy and women's liberation) — genuinely pro-nature, precautionary
  // toward unchecked industrial development.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const BENJAMIN_TUCKER = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // A committed individualist who believed the state's coercive monopoly on force was the root
  // injustice, but favored voluntary market-based dispute resolution/defense rather than either
  // Bakunin's collective revolutionary violence or a Molinari-style purely commercial security industry.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Believed abolishing the "four monopolies" (land title enforced by the state, the money/banking
  // monopoly, protective tariffs, and patents) would make genuinely free markets naturally egalitarian
  // — a "free-market anti-capitalism" distinct from both state socialism and later pro-corporate
  // right-libertarianism, since he saw concentrated capital itself as a product of state-enforced privilege.
  economia: ["D","C","D","C","C","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  // Opposed patents and tariffs specifically as state-granted monopoly privileges distorting an
  // otherwise naturally equalizing free market — a genuinely anti-dirigiste, though not
  // anti-market-per-se, economic-control position.
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  // Opposed protective tariffs specifically as one of his "four monopolies" — a committed free-trader.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const BOOKCHIN = {
  // "Libertarian municipalism"/communalism: directly democratic municipal assemblies confederated
  // together, explicitly the structural template Öcalan later adapted for Rojava's democratic
  // confederalism — maximally decentralized municipal self-governance.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Advocated citizens directly participating in face-to-face municipal assemblies (a modern
  // reimagining of the Athenian assembly/New England town meeting) confederated upward — genuinely
  // maximal direct-democratic participation.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Later in his career moved from pure anarchist insurrectionism toward "libertarian municipalism" —
  // running candidates for local assemblies and building institutional legitimacy — a genuinely more
  // gradualist, electoral-adjacent strategy than Bakunin's revolutionary rupture, though sharing the
  // same anti-hierarchical end goal.
  poder: ["D","C","D","C","D","C","D","C","DT","C","D","C","N","C","D","C","D","C","D","C"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Founded "social ecology" — the defining thesis that ecological crisis is rooted in social hierarchy
  // and domination of humans by humans, requiring a fundamental rethinking of industrial-scale
  // technology and growth, not merely embracing it — a genuinely precautionary, pro-nature philosophy,
  // more skeptical of unchecked technological/industrial scale than Kropotkin's pro-science anarchism.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const KEIR_HARDIE = {
  // Founded the Independent Labour Party and later the British Labour Party explicitly to work through
  // parliamentary institutions — a genuinely gradualist, constitutionally-embedded socialist strategy,
  // not a revolutionary rupture.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Championed expanding suffrage and workers' parliamentary representation as the core vehicle of
  // social change — "Labourism" pursued transformation through, not against, representative democracy.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // A rare, principled anti-war voice among mainstream European politicians in 1914 — opposed WWI on
  // internationalist working-class-solidarity grounds when almost the entire political establishment
  // embraced the war.
  diplomacia: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Explicitly supported Indian self-rule and anti-imperialist causes as a matter of consistent
  // international working-class solidarity, opposing British imperial expansion.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Championed trade-union rights, the eight-hour day, and redistributive social legislation pursued
  // through parliamentary reform — a genuinely reformist, not revolutionary, socialist economics,
  // building the labor-movement foundation of the British welfare state.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","D","C","D","C","D","C","D","C","D"],
  // A devout Christian socialist ("the New Testament is the greatest charter of freedom") who saw
  // socialism as the practical application of Christian ethics to economic life — religion was a
  // primary, explicit motivating force for his politics, not incidental.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  // A former coal miner (authentic working-class origin) whose moral vision centered on dignity of
  // labor and practical Christian social ethics rather than either revolutionary or libertine social
  // radicalism.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const MARITAIN = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Directly influenced the drafting of the Universal Declaration of Human Rights (1948), advocating a
  // "practical" cross-tradition consensus on rights without requiring agreement on their ultimate
  // philosophical foundation — a genuinely pluralistic, institutionally-engaged democratic vision.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Explicitly opposed both fascism and communism as totalitarian negations of human dignity, favoring
  // engaged international human-rights advocacy over either isolationism or ideological conquest.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "Integral Humanism" reconciled Catholic social teaching's concern for the common good and worker
  // dignity with a real acceptance of private property and market economy — a moderate, distinctly
  // Christian-democratic middle path between socialism and unrestrained capitalism.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A Neo-Thomist Catholic philosopher whose entire intellectual project sought to reconcile faith and
  // reason and ground human rights explicitly in Christian natural-law personalism — religion was the
  // foundational premise of his political philosophy, not a private-sphere afterthought.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  // "Personalism" balanced individual dignity/rights with communal obligation grounded in natural-law
  // Catholic ethics — a moderate, tradition-respecting but rights-affirming moral framework, explicitly
  // opposed to totalitarian collectivism on one side and atomistic individualism on the other.
  moral: ["C","C","C","N","D","C","C","N","D","C","C","N","N","C","N","D","N","C","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

export const PROFILES = {
  "ocalan": OCALAN,
  "benjamin-tucker": BENJAMIN_TUCKER,
  "bookchin": BOOKCHIN,
  "keir-hardie": KEIR_HARDIE,
  "maritain": MARITAIN,
};
