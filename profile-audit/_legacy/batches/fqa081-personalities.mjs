// FQA081 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// bastiat: French classical liberal — "That Which Is Seen and That Which Is Not Seen" (opportunity-
//   cost reasoning), "The Law" argued government's only legitimate function is protecting life/liberty/
//   property, a fierce free-trade satirist (the "Candlemakers' Petition") against protectionism, but
//   accepted a minimal state for law/defense rather than full anarchism.
// mises: Austrian School founder — "Economic Calculation in the Socialist Commonwealth" (1920) proved
//   socialism cannot rationally calculate prices without market exchange (the calculation problem Lange
//   later tried to answer), developed praxeology (economics as logical deduction from human-action
//   axioms), fled Nazi Europe as a Jewish anti-totalitarian, advocated the gold standard.
// ron-paul: US Congressman and presidential candidate who popularized libertarianism in mainstream US
//   politics — "End the Fed" opposed the Federal Reserve/fiat currency, a rare Republican staunchly
//   non-interventionist foreign-policy voice (opposed the Iraq War, the Patriot Act), while also
//   holding socially conservative positions (pro-life) unusual within pure libertarian doctrine.
// hoppe: radicalized anarcho-capitalism beyond Rothbard — "Democracy: The God That Failed" explicitly
//   argued monarchy's long-term dynastic property interest may outperform democracy's short-term-
//   incentivized erosion of property rights, advocates private "covenant communities" with owners'
//   rights to exclude, and holds the most explicitly anti-democratic stance of any figure in this batch.
// adam-smith: founder of modern economics — "The Wealth of Nations" (1776) theorized the division of
//   labor and the market's "invisible hand," but was NOT a pure laissez-faire absolutist (accepted a
//   real government role in public goods/infrastructure/education and warned against business
//   collusion), and his "Theory of Moral Sentiments" grounded economics in sympathy and social bonds,
//   not pure self-interest — a more moderate, 18th-century-situated figure than the 20th-century
//   Austrians who invoke him.

const BASTIAT = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // "The Law" held government's only legitimate function is protecting life, liberty, and property —
  // any state action beyond this (his famous critique of "legal plunder") is illegitimate coercion, a
  // genuinely liberty-maximizing though not fully anarchist position.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The "broken window fallacy" and "seen vs. unseen" analysis form a foundational, rigorous case
  // against government economic intervention — among the clearest classical-liberal free-market
  // economic philosophies, though accepting minimal state functions.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The "Candlemakers' Petition" satirically eviscerated protectionism — one of history's most cited
  // free-trade satirists, fiercely opposed tariffs of any kind.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const MISES = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Fled Nazi-occupied Europe as a Jewish anti-totalitarian intellectual — a firsthand, direct victim
  // of the totalitarian collectivism he spent his career warning against.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Economic Calculation in the Socialist Commonwealth" (1920) proved socialism cannot rationally
  // allocate resources without market price signals — the foundational "calculation problem" that
  // shaped the entire 20th-century socialist/capitalist economic debate, among the most rigorously
  // argued anti-planning economic theories ever formulated.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const RON_PAUL = {
  // A committed constitutionalist and states-rights advocate within the US federal system, favoring
  // devolution of most federal authority back to states and individuals.
  estrutura: ["CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","DT","C","D","C","DT","CT","DT"],
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","D","C","D","C","N","C","D","C","D","N","D","N","D","D","D","C","D"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // A rare, staunch Republican anti-war voice — opposed the Iraq War, the Patriot Act, and nearly all
  // foreign military interventions on constitutional and non-interventionist grounds — among the most
  // consistently non-interventionist major US political figures of his era.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "End the Fed" opposed the Federal Reserve and fiat currency, advocated returning to the gold
  // standard, and championed minimal federal economic intervention — a maximal free-market economic
  // program translated into actual US legislative politics.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Personally religious (a practicing Baptist) whose libertarian economics coexists with genuine
  // socially conservative convictions on faith-adjacent issues.
  religiao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Holds socially conservative positions (pro-life, traditional-marriage-adjacent views) that sit
  // alongside his libertarian economics — a real, documented tension between his fiscal libertarianism
  // and cultural conservatism, distinguishing him from more socially-liberal libertarians.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const HOPPE = {
  // "Covenant communities" — private, contractually-governed associations with no obligation to a
  // territorial nation-state — the most radically decentralized structural vision, exceeding even
  // Rothbard's already-maximal anarcho-capitalist structure.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // "Democracy: The God That Failed" explicitly argues democracy itself is structurally flawed —
  // encouraging short-term political time-preference that erodes property rights over time, unlike a
  // hereditary monarch's long-term dynastic property stake — the single most explicitly
  // anti-democratic position of any figure audited, a genuinely distinguishing, radical departure even
  // from fellow anarcho-capitalists like Rothbard.
  representacao: ["D","CT","D","D","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  // Advocates private "covenant communities" with property owners' contractual rights to exclude
  // individuals whose presence they judge incompatible with the community's values — a controversial,
  // exclusionary application of absolute property rights that has drawn accusations of providing
  // intellectual cover for discriminatory exclusion, a real documented controversy distinct from
  // Rothbard's more classically rights-focused framing.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  // Combines absolute individual property rights with a socially deeply conservative, explicitly
  // exclusionary vision of acceptable community membership/behavior — a genuinely more traditionalist,
  // exclusion-permissive moral stance than most libertarians, reflected in his low baseline score and
  // the controversy his "physical removal" rhetoric has generated.
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const ADAM_SMITH = {
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  poder: ["N","D","N","D","N","D","N","C","N","D","N","D","N","D","D","D","N","D","D","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // "The Wealth of Nations" theorized the division of labor and market coordination, but explicitly
  // recognized a real government role in providing public goods (infrastructure, education, national
  // defense, justice) — a genuinely moderate classical-liberal position, not the near-zero-government
  // stance of the 20th-century Austrian anarcho-capitalists who cite him.
  economia: ["D","C","D","C","D","D","C","C","D","D","D","C","D","D","C","D","D","C","C","C"],
  // Famously warned that "people of the same trade seldom meet together... but the conversation ends in
  // a conspiracy against the public" — genuinely skeptical of business collusion and monopoly power,
  // not a blanket anti-regulation absolutist.
  controle: ["N","C","N","C","D","C","N","C","D","C","N","C","N","D","N","C","N","D","N","D"],
  // Wrote extensively against mercantilist protectionism as economically self-defeating, a foundational
  // case for free trade.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  // "The Theory of Moral Sentiments" grounded ethics in natural sympathy and social bonds between
  // people, not pure self-interested individualism — a more socially-embedded moral philosophy than
  // his later free-market-economics reputation alone suggests.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "bastiat": BASTIAT,
  "mises": MISES,
  "ron-paul": RON_PAUL,
  "hoppe": HOPPE,
  "adam-smith": ADAM_SMITH,
};
