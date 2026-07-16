// FQA080 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// tolstoy: "The Kingdom of God Is Within You" articulated Christian anarchist pacifism — literal
//   Sermon-on-the-Mount nonresistance to evil, rejected all state violence and war (including
//   revolutionary violence, distinguishing him from Bakunin), was excommunicated by the Russian
//   Orthodox Church (1901) for rejecting institutional dogma while remaining personally devout, and
//   directly influenced Gandhi through correspondence.
// thoreau: "Civil Disobedience" (1849) justified individual conscience-based resistance to unjust laws
//   (jailed briefly for refusing taxes supporting slavery/the Mexican War), "Walden" championed simple
//   living close to nature and minimal government ("That government is best which governs least") — a
//   transcendentalist individualist, not a full anarchist calling for the state's abolition.
// john-zerzan: founded anarcho-primitivism — radically critiques civilization itself (not merely
//   capitalism or the state), arguing agriculture, division of labor, and even symbolic culture
//   (language, number, art) originated domination and hierarchy, advocates a return toward
//   pre-agricultural existence, and has controversially engaged sympathetically with Ted Kaczynski's
//   critique of technology (while explicitly rejecting his violent methods).
// max-stirner: "The Ego and Its Own" (1844) rejected all abstractions ("spooks" — God, state, nation,
//   humanity, even morality) as illegitimate claims on the sovereign individual ego, proposing only a
//   purely voluntary, self-interested "union of egoists" — a foundational influence on individualist
//   anarchism and later Nietzsche, more radically anti-abstraction than Tucker's rights-based individualism.
// rothbard: Austrian School economist and founder of modern anarcho-capitalism ("For a New Liberty")
//   — synthesized Austrian economics with natural-rights libertarianism, advocated privatizing every
//   government function including police/courts/defense, and later in life pursued a controversial
//   "paleo-libertarian" alliance with immigration-restrictionist paleoconservatives.

const TOLSTOY = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Literal Sermon-on-the-Mount nonresistance to evil — rejected ALL coercive violence, including
  // revolutionary or defensive force, as morally illegitimate — a more absolute rejection of coercion
  // even than most anarchists, who typically accept revolutionary or defensive violence.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Advocated a simple agrarian existence and personally renounced much of his own wealth/property
  // rights, believing land specifically should not be privately monopolized — a genuinely radical,
  // Georgist-adjacent critique of concentrated land ownership within his broader Christian communalism.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","CT","D","C","D","C","D","C","D","C","D","CT","D","C","D","C","D"],
  // Was excommunicated by the Russian Orthodox Church (1901) explicitly for rejecting institutional
  // dogma, ritual, and clerical hierarchy — while remaining a devoutly personal, literalist practicing
  // Christian centered on the Sermon on the Mount — anti-institutional but intensely, personally religious.
  religiao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","CT","DT","C","D","CT","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Deeply skeptical of industrial modernity's alienating effects, favoring simple agrarian craft-based
  // living over mechanized/industrial development.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const THOREAU = {
  // Championed radical individual self-sufficiency and minimal government presence in daily life
  // ("That government is best which governs least"), though he explicitly stopped short of Tolstoy's
  // or Stirner's total rejection of any government whatsoever — a minarchist, not full anarchist,
  // structural vision.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  // "Civil Disobedience" justified individual-conscience resistance to unjust laws (refused to pay
  // taxes supporting slavery and the Mexican-American War, accepted jail rather than comply) — a
  // defining, deliberately non-violent but firmly liberty-maximizing stance against state coercion.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Explicitly opposed the Mexican-American War as an unjust war of territorial conquest for slavery's
  // expansion — a committed anti-imperialist, anti-expansionist abolitionist stance.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Walden" championed radical simple living and minimal material need — deliberately reduced his own
  // economic footprint and labor to the bare minimum required for subsistence, a genuinely
  // anti-materialist, though not explicitly collectivist, economic philosophy.
  economia: ["C","D","C","D","D","D","C","D","C","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","N","C","D","C"],
  comercio: ["N","D","N","D","D","D","N","D","N","D","D","D","N","D","N","D","N","D","N","D"],
  // A transcendentalist who valued individual intuition and direct experience of nature over
  // institutional religious authority, though retaining a spiritually-inflected, quasi-pantheist
  // reverence for nature itself.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","D","C","D","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // "Walden" is a foundational text of environmental/simple-living philosophy — favored direct
  // experience of unmediated nature over industrial/technological development.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const JOHN_ZERZAN = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Anarcho-primitivism rejects agriculture, division of labor, and industrial production themselves as
  // the original sources of domination and hierarchy — advocates a return toward pre-agricultural,
  // small-band hunter-gatherer-like economic existence, the most radical anti-industrial economic
  // position of any figure in this project.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","D","D","D","D","D"],
  comercio: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D"],
  religiao: ["C","D","C","D","C","D","C","N","C","D","N","C","D","N","D","C","D","D","C","N"],
  moral: ["C","D","C","N","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // The absolute defining thesis of anarcho-primitivism: civilization, symbolic culture, and
  // technology themselves (not just their capitalist or statist deployment) are the root sources of
  // domination and alienation, requiring complete rejection of industrial/technological society and a
  // return to pre-agricultural life — the single most extreme anti-technology position conceivable,
  // controversially echoed even in his sympathetic engagement with Kaczynski's critique (though not his
  // violent methods).
  tecnologia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
};

const MAX_STIRNER = {
  // Rejected the state as one of many illegitimate "spooks" (abstractions with no real existence
  // beyond collective belief) constraining the sovereign ego — a maximally anti-structural,
  // anti-institutional philosophy exceeding even most anarchists' positive institutional proposals.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Rejected even the abstraction of "the people" or democratic collective will as another "spook"
  // constraining the individual — proposed only a purely voluntary, temporary "union of egoists" with
  // no binding collective authority of any kind, not even a democratic one.
  representacao: ["C","DT","CT","D","D","DT","C","D","CT","DT","CT","DT","D","D","C","DT","CT","DT","C","D"],
  // The sovereign ego owes obedience to no external authority — rejected the state's coercive monopoly
  // on force as illegitimate, alongside rejecting even natural-rights theory itself as another abstraction.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Rejected private property justified by any abstract "right" (natural or legal), instead holding
  // that the ego simply takes and uses what it has the power to take — "property" is whatever the
  // sovereign individual can hold, a purely egoist rather than rights-based or collectivist economics.
  economia: ["D","C","D","C","C","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  // Rejected God as the ultimate "spook" — a foundational, thoroughgoing atheist rejection of all
  // religious as well as secular-humanist abstractions (explicitly including Feuerbach's "humanity" as
  // just another disguised God) — among the most emphatically anti-religious philosophers audited.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Rejected morality itself as another "spook" — no external moral law binds the sovereign ego, only
  // its own self-interest — a radically amoral (not merely permissive) rejection of any imposed ethical
  // framework, distinct even from Armand's still recognizably ethics-of-liberation-oriented individualism.
  moral: ["CT","DT","C","DT","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const ROTHBARD = {
  // Proposed abolishing the territorial state entirely in favor of competing private jurisdictions and
  // contractually-defined communities — building directly on Molinari's foundational anarcho-capitalist
  // structural vision, maximally decentralized.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Rejected the legitimacy of state-based political representation altogether in favor of voluntary
  // contractual governance chosen individually on the market.
  representacao: ["C","DT","CT","D","D","DT","C","D","CT","DT","CT","DT","D","D","C","DT","CT","DT","C","D"],
  // "For a New Liberty" proposed privatizing police, courts, and national defense entirely — the
  // non-aggression principle as the sole legitimate constraint on any use of force, state or private —
  // among the most radically anti-state-coercion positions in this project.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  // His later "paleo-libertarian" turn allied with immigration-restrictionist paleoconservatives,
  // arguing open borders combined with a welfare state created perverse incentives — a real, documented
  // departure toward more assimilationist/restrictionist positions than pure libertarian open-borders
  // logic would otherwise suggest.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The definitive anarcho-capitalist economic position: abolish all state involvement in the economy,
  // absolute private property rights, and free-market provision of literally every good and service —
  // among the most extreme laissez-faire economic philosophies ever formulated.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // An Austrian School economist generally favorable toward technological/market innovation as a
  // product of free entrepreneurial activity.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "tolstoy": TOLSTOY,
  "thoreau": THOREAU,
  "john-zerzan": JOHN_ZERZAN,
  "max-stirner": MAX_STIRNER,
  "rothbard": ROTHBARD,
};
