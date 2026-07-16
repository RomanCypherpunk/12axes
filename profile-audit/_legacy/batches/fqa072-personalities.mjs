// FQA072 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// thomas-paine: "Common Sense" (1776) galvanized American independence, "Rights of Man" defended the
//   French Revolution against Burke, "The Age of Reason" was a deist critique of organized religion and
//   biblical literalism, "Agrarian Justice" proposed a progressive inheritance tax funding universal
//   old-age pensions and a citizen's stake — genuinely proto-welfare-state radicalism, plus committed
//   abolitionism.
// edmund-burke: "Reflections on the Revolution in France" (1790) founded modern conservatism — favored
//   gradual reform within existing traditions/institutions ("little platoons") over abstract-rights-
//   based rupture, supported the American Revolution (defending traditional English liberties) while
//   opposing the French one, but also campaigned against the slave trade and East India Company
//   corruption — a genuinely more nuanced reformist than a pure reactionary.
// hayek: "The Road to Serfdom" (1944) warned central planning leads toward totalitarianism, developed
//   "spontaneous order"/catallaxy theory (markets process dispersed knowledge no planner could
//   replicate), favored a minimal but real rule-of-law state (not pure anarcho-capitalism — even
//   accepted a basic safety net in "The Constitution of Liberty"), 1974 Nobel laureate.
// gustave-de-molinari: "The Production of Security" (1849) is the founding text of anarcho-capitalism —
//   proposed competing private protection/security agencies fully replacing the state, more radical
//   than Hayek in rejecting the state's existence entirely rather than merely minimizing it.
// henry-george: "Progress and Poverty" (1879) proposed the "Single Tax" on land value specifically
//   (not labor or capital) — land rent, an unearned increment from location/community development,
//   should be publicly captured while all other economic activity remains untaxed and free; otherwise a
//   committed free-trader who opposed protectionism.

const THOMAS_PAINE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed republican democrat who wrote "Common Sense" explicitly to popularize republican
  // self-government against hereditary monarchy — championed the widest possible popular sovereignty
  // and representative government of his era.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  // Actively supported both the American and French Revolutions as a matter of principle, believing
  // popular revolutionary movements against monarchical tyranny deserved active international solidarity.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Agrarian Justice" (1797) proposed a progressive inheritance/land tax to fund universal cash grants
  // at adulthood and old-age pensions — a genuinely radical proto-welfare-state redistribution proposal,
  // remarkably ahead of its time.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // "The Age of Reason" was an explicit, sweeping deist critique of organized Christianity and biblical
  // literalism, arguing reason and nature (not scripture or clergy) reveal the divine — a genuinely
  // radical anti-clerical position for his era, though not full atheism.
  religiao: ["CT","DT","C","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","D"],
  // A committed abolitionist and early supporter of women's rights within the broader radical-
  // Enlightenment humanist project.
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const EDMUND_BURKE = {
  // Believed legitimate authority and institutions emerge organically from tradition and should be
  // reformed gradually from within, not redesigned from abstract first principles — favored the
  // established constitutional order over either radical centralization or radical devolution.
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  // Supported representative parliamentary government as it organically existed in Britain (Burke
  // himself was an MP who championed constituents' interests) but was deeply skeptical of expanding
  // suffrage or direct-democratic mechanisms he saw as inviting mob-driven abstraction.
  representacao: ["C","C","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  poder: ["C","C","N","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Favored gradual, prudent accommodation of established custom and local particularity over either
  // forced assimilation or radical multicultural rupture — valued organic national tradition highly.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Opposed the French Revolutionary regime as a dangerous, destabilizing ideological threat requiring
  // British counter-revolutionary engagement, while also having supported American colonists' resistance
  // — a nuanced, case-by-case interventionism grounded in defending traditional constitutional liberty
  // rather than either pure principle.
  intervencao: ["C","D","C","D","D","C","N","C","C","D","C","C","C","D","C","D","N","C","C","C"],
  // A classical (Smithian) economic liberal on markets generally, though his conservatism prioritized
  // property and established economic hierarchy over redistributive intervention.
  economia: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Supported the established Anglican Church as a vital social institution binding tradition and
  // public morality together, viewing religion as indispensable social glue rather than a private
  // matter alone.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  // A genuinely more nuanced conservative than a pure reactionary — campaigned prominently against the
  // slave trade and against East India Company corruption/abuse in India, showing real moral limits to
  // his defense of established power.
  moral: ["D","C","D","C","N","D","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const HAYEK = {
  // "Spontaneous order" theory favored decentralized, bottom-up institutional evolution over any
  // deliberately engineered centralized structure — genuinely skeptical of top-down design at every
  // level of governance.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["CT","D","CT","D","C","D","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","D"],
  // Championed the rule of law and constitutionally limited government against both overreaching
  // security-state coercion and, separately, warned that economic central planning inevitably
  // requires coercive enforcement — a genuinely liberty-maximizing position on state power.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Opposed both fascism and communism as equally collectivist central-planning ideologies (a defining
  // "Road to Serfdom" thesis) but did not advocate isolationism — favored engaged Western liberal-
  // democratic solidarity against totalitarian threats.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "The Road to Serfdom" is the century's most influential warning that central economic planning
  // inevitably erodes political liberty — a foundational, maximal free-market economic philosophy.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Advocated the price system and dispersed-knowledge "catallaxy" as radically superior information
  // processors compared to any centralized planning board — among the most systematically anti-
  // dirigiste economic philosophies of the 20th century, though notably not pure anarchism (accepted a
  // minimal regulatory/legal framework and even a basic income floor in his later work).
  controle: ["DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","D","CT","D","CT"],
  // A committed free-trader who saw tariffs and protectionism as another form of the central-planning
  // impulse he opposed throughout his work.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  // A classical liberal on personal-liberty questions consistent with his broader anti-paternalism,
  // though primarily known for economic rather than social-cultural theorizing.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const GUSTAVE_DE_MOLINARI = {
  // Proposed abolishing the territorial state entirely in favor of competing jurisdictions/service
  // providers — the most radically decentralized, anti-monopoly-authority structural vision of any
  // figure in this project.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Rejected the legitimacy of state-based political representation altogether in favor of voluntary
  // contractual "government" chosen individually on the market — neither traditional electoral
  // democracy nor autocracy, but a wholly market-based alternative to political representation as such.
  representacao: ["C","DT","CT","D","D","DT","C","D","CT","DT","CT","DT","D","D","C","DT","CT","DT","C","D"],
  // "The Production of Security" (1849) proposed that even police/courts/defense be provided by
  // competing private firms rather than a coercive state monopoly — the most radically liberty-
  // maximizing "poder" position conceivable, rejecting the state's coercive monopoly on force itself.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A radical free-market internationalist who believed private commercial interests, not state
  // diplomacy or military alliances, would organically produce peace between peoples.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The intellectual root of anarcho-capitalism — proposed that literally every function typically
  // considered a public good, including security itself, be produced and sold on a free market —
  // among the most extreme laissez-faire economic positions ever formulated.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const HENRY_GEORGE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed democrat who ran for New York City mayor on a reformist platform and championed broad
  // popular political participation as essential to breaking entrenched land-monopoly power.
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","C"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The "Single Tax" doctrine held that land rent (an unearned increment from location/community
  // development, not individual labor) should be the sole source of public revenue, freeing labor and
  // capital from taxation entirely — a genuinely unique economic position, neither conventional
  // socialism nor pure laissez-faire, that treats land specifically (not capital broadly) as the
  // legitimate target of collective claim.
  economia: ["C","C","D","C","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Advocated an unusually narrow, singular form of state economic intervention (the land-value tax
  // alone) while otherwise favoring minimal regulation of labor and capital markets — a genuinely
  // distinctive middle position between Hayek's general anti-dirigisme and Molinari's total market
  // provision of everything.
  controle: ["N","D","N","D","CT","DT","N","D","CT","DT","N","D","D","DT","N","C","N","N","N","DT"],
  // A committed free-trader who saw tariffs as protecting land/capital monopolists at ordinary people's
  // expense — opposed protectionism as consistently as he supported the land tax.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // A moral reformer explicitly motivated by reducing poverty and inequality he saw as rooted in land
  // monopoly rather than any inherent flaw in industrial progress itself ("Progress and Poverty").
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "thomas-paine": THOMAS_PAINE,
  "edmund-burke": EDMUND_BURKE,
  "hayek": HAYEK,
  "gustave-de-molinari": GUSTAVE_DE_MOLINARI,
  "henry-george": HENRY_GEORGE,
};
