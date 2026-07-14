// FQA071 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// john-stuart-mill: "On Liberty" formulated the harm principle (the state may only limit liberty to
//   prevent harm to others), advocated women's suffrage ("The Subjection of Women") and proportional
//   representation, but also favored plural voting weighted toward the educated and worked as an East
//   India Company administrator — a genuinely complicated, not purely egalitarian, liberal legacy.
// john-locke: father of classical liberalism — natural rights to life/liberty/property, government by
//   consent, the labor theory of property; his "Letter Concerning Toleration" explicitly excluded
//   atheists and Catholics from toleration, and he personally invested in the Royal African Company
//   and helped draft the slaveholding Carolina constitution — real limits and contradictions in his
//   liberal legacy.
// robert-nozick: "Anarchy, State, and Utopia" (1974) argued only a minimal "night-watchman" state
//   (protecting against force/fraud/theft, enforcing contracts) is justified — any more expansive
//   state violates individual rights; his "entitlement theory" explicitly rejects patterned/end-state
//   distributive justice (directly opposing Rawls) via the Wilt Chamberlain thought experiment.
// al-gore: former US VP, leading climate-action figure ("An Inconvenient Truth," Nobel Peace Prize
//   2007) — advocates market-based solutions (carbon pricing/trading) alongside regulation and strong
//   international climate treaties (Kyoto Protocol), a mainstream liberal internationalist.
// beveridge: authored the 1942 "Beveridge Report," the blueprint for the UK welfare state (NHS
//   precursor, "cradle to grave" social insurance against poverty/sickness/unemployment) — identified
//   the "Five Giants" (Want, Disease, Ignorance, Squalor, Idleness), a Liberal (not socialist) who
//   believed comprehensive social insurance could coexist with a market economy.

const JOHN_STUART_MILL = {
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","D","D"],
  // Championed representative government and proportional representation, though his advocacy of
  // "plural voting" (weighting votes toward the more educated) reflects a real, documented elitist
  // strand within his broader democratic commitment — not a simple one-person-one-vote egalitarian.
  representacao: ["CT","D","CT","C","C","D","CT","C","C","D","CT","D","C","C","CT","D","D","D","CT","C"],
  // The harm principle is the defining, foundational limit on state coercion in his entire philosophy
  // — the state may restrict individual liberty only to prevent harm to others, nothing more.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["N","C","D","C","N","C","D","C","N","C","N","C","N","C","N","D","N","D","N","N"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Personally worked as an administrator for the East India Company for over three decades, reflecting
  // a real, documented accommodation with British imperial rule even while his liberal philosophy
  // emphasized individual liberty — a genuinely complicated, not simply non-interventionist, record.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Generally favored free-market economics but supported labor cooperatives and was notably open to
  // a future "stationary state" economy (not endless growth) and some redistribution via inheritance
  // taxation — a genuinely more socially-inflected classical liberalism than pure laissez-faire.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","N","C","D","C"],
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A committed rationalist and religious skeptic (privately agnostic/atheistic in his mature views,
  // though cautious about publicizing this) who argued strongly for a fully secular public sphere.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // "On Liberty" and "The Subjection of Women" together represent among the most sweeping personal-
  // liberty and gender-equality arguments of the 19th century — a defining, foundational progressive-
  // liberal moral philosophy.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const JOHN_LOCKE = {
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","D","D"],
  // Government by consent and the right of revolution against tyranny — a foundational theory of
  // legitimate, accountable representative government, though articulated for a property-owning
  // electorate rather than universal suffrage in his own era's practical application.
  representacao: ["CT","D","CT","C","C","D","CT","C","C","D","CT","D","C","C","CT","D","D","D","CT","C"],
  // Government exists explicitly to protect natural rights (life, liberty, property) and derives its
  // just power solely from the consent of the governed — a genuinely liberty-maximizing theory of
  // state coercive authority.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  // His "Letter Concerning Toleration" explicitly excluded atheists (deemed incapable of trustworthy
  // oaths) and Catholics (deemed loyal to a foreign sovereign, the Pope) from toleration — a real,
  // documented, significant limit on his celebrated toleration doctrine.
  imigracao: ["C","D","C","D","C","D","CT","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Personally invested in the Royal African Company (a slave-trading enterprise) and helped draft
  // the Fundamental Constitutions of Carolina (which explicitly protected slaveholding) — a real,
  // documented complicity in colonial exploitation that sits uneasily beside his natural-rights theory.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // The labor theory of property ("mixing one's labor" with nature creates just ownership) is the
  // foundational justification for private property rights in his entire political philosophy —
  // among the most explicitly pro-private-property doctrines of any pre-industrial thinker audited.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Advocated religious toleration but with explicit exclusions (atheists, Catholics) rooted in
  // Protestant political anxieties of his era — genuinely more religious than secular in orientation,
  // though within a pluralistic (for Protestants) framework.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","C","D","N","N","C","N","C","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const ROBERT_NOZICK = {
  // Favors a minimal "night-watchman" state limited strictly to protecting against force, fraud, and
  // theft — any more expansive government structure (regardless of federal or unitary form) violates
  // his core entitlement-theory principles, so institutional structure matters less than the state's
  // radically limited scope.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","D","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","C"],
  // The minimal state's sole legitimate coercive function is protecting individuals from force/fraud/
  // theft — the most restrictively liberty-maximizing "poder" position of any figure audited, rejecting
  // essentially all paternalistic or redistributive state coercion as illegitimate.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The minimal state should not use its coercive apparatus for foreign entanglement or paternalistic
  // intervention any more than domestically — a consistent, principled extension of his minimal-
  // government philosophy to the international sphere.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The "entitlement theory" of justice (just acquisition + just transfer = just holdings) explicitly
  // rejects any patterned or end-state redistribution regardless of resulting inequality — the Wilt
  // Chamberlain argument demonstrates that any attempt to maintain an egalitarian "pattern" requires
  // continuous, illegitimate interference with free exchange — among the most consistently anti-
  // redistributive economic philosophies audited.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Consistent with his libertarian commitment to individual self-determination, favored maximal
  // personal autonomy over private/consensual conduct and lifestyle choices.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const AL_GORE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // A committed liberal internationalist who champions binding multilateral treaties (Kyoto Protocol)
  // and diplomatic climate cooperation as the primary mechanism for global action, rather than
  // unilateral national assertion.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Advocates market-based mechanisms (carbon pricing/cap-and-trade) as central climate tools alongside
  // regulation — a genuinely mixed approach combining market incentives with government standard-setting,
  // not pure command-and-control environmentalism.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Advocates carbon pricing and cap-and-trade specifically because they harness market price signals
  // rather than direct production quotas — real, deliberate market-mechanism preference within an
  // overall pro-regulation climate stance.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // A mainstream liberal on social issues (supports LGBT rights, abortion access) as part of the
  // contemporary Democratic Party consensus.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Balances genuine climate-tech optimism (renewable energy investment advocacy) against a real
  // precautionary environmentalist instinct about industrial/extractive technology's ecological costs
  // — a genuinely tempered, not maximalist, tech-optimism.
  tecnologia: ["C","D","C","C","C","D","D","D","C","D","C","C","C","C","C","D","D","D","C","D"],
};

const BEVERIDGE = {
  // A British civil servant/economist writing within the unitary Westminster state — his report
  // presupposed national administration of social insurance, not federalism, distinct from Gore's
  // American federal-vs-state climate-policy battles.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A Liberal party figure operating within wartime/postwar British parliamentary consensus politics
  // (a National Government coalition commissioned his report) rather than contemporary US partisan
  // electoral politics.
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // A domestic-policy architect writing during WWII whose focus was entirely on postwar domestic
  // reconstruction, not international climate diplomacy or treaty-making of Gore's later era.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The 1942 Beveridge Report explicitly designed comprehensive, universal "cradle to grave" social
  // insurance (against Want, Disease, Ignorance, Squalor, Idleness) to coexist with, not replace, a
  // market economy — a Liberal (not socialist) welfare-state architecture built around compulsory
  // flat-rate contributions, a different specific mechanism than Gore's carbon-pricing market tools.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Universal social insurance requires substantial, deliberate state administrative machinery
  // (National Insurance contributions, a national health service) — real, comprehensive state
  // economic involvement specifically in social-protection delivery.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Believed comprehensive social insurance was a moral imperative to abolish the "Five Giants" of
  // poverty and want — a genuinely humanitarian, progressive social-welfare moral vision.
  moral: ["C","D","C","D","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Writing in 1942, decades before genetic engineering, AI, or climate-tech debates existed as
  // political questions — his "modernization" concern was full-employment industrial policy, not the
  // environmental/biotech tradeoffs central to Gore's much later technology politics; largely neutral/
  // not-applicable on this axis's actual questions rather than a strong pro- or anti-tech stance.
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

export const PROFILES = {
  "john-stuart-mill": JOHN_STUART_MILL,
  "john-locke": JOHN_LOCKE,
  "robert-nozick": ROBERT_NOZICK,
  "al-gore": AL_GORE,
  "beveridge": BEVERIDGE,
};
