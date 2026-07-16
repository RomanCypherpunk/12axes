// FQA070 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// ludwig-erhard: architect of the German "economic miracle" — ordoliberal "social market economy"
//   combines a strong state framework actively enforcing competition/anti-monopoly law with monetary
//   stability (the 1948 currency reform) and welfare provisions ("Wohlstand für Alle" — prosperity for
//   all), distinct from pure laissez-faire since the state must actively police market concentration.
// gk-chesterton: popularized "distributism" — wide distribution of small property/production as an
//   explicit third way against both monopoly capitalism and state socialism, a devout Catholic convert
//   who wrote extensively on Christian apologetics, opposed eugenics and the Boer War, romantically
//   sympathetic to medieval guild structures.
// henri-de-saint-simon: precursor of technocracy — proposed society be governed by scientists,
//   engineers, and industrialists rather than politicians/aristocrats/clergy, his late "New
//   Christianity" reframed religion around improving the condition of the poor, directly influenced
//   Comte's positivism and later utopian socialism.
// michael-sandel: leading communitarian critic of liberal proceduralism — argues justice and virtue
//   are rooted in community bonds, not abstract individual rights (critiquing Rawls), and explicitly
//   argues in "The Tyranny of Merit" that meritocratic ideology breeds hubris in winners and
//   humiliation in losers, undermining social solidarity — a direct intellectual opponent of Wooldridge.
// adrian-wooldridge: leading contemporary defender of meritocracy ("The Aristocracy of Talent") —
//   argues talent-and-effort-based selection drove modern progress and must be renewed against both
//   hereditary privilege and non-merit-based alternative sorting criteria — the direct opposite
//   position from Sandel's critique of meritocracy.

const LUDWIG_ERHARD = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","N","D","D","D","C","N"],
  // Ordoliberalism explicitly rejects pure laissez-faire: the state must actively design and enforce
  // a competitive framework (anti-cartel law) so markets don't collapse into monopoly — a deliberate,
  // moderate middle path between Friedman's minimal-state libertarianism and full state planning.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  // The 1948 currency reform and sustained anti-cartel enforcement reflect real, active state
  // institutional design of the market's rules — regulation to preserve competition, not to replace it.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  // Deeply committed to European economic integration and export-oriented trade as the engine of the
  // "economic miracle" — genuinely globalist, low-protectionism economic policy.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // "Prosperity for all" rested on rebuilding West Germany's industrial base rapidly using modern
  // technology and productivity gains as the mechanism for shared prosperity.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const GK_CHESTERTON = {
  // Distributism explicitly favors widely dispersed small property/production (family farms, small
  // guild-like businesses) over both monopoly-capitalist concentration and centralized state control —
  // a genuinely decentralist, anti-concentration vision on both the private and public-power axes.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // Distributism's romantic localism extended to valuing rooted, small national/regional communities
  // with their own distinct customs — sympathetic to preserving cultural particularity against
  // homogenizing large-scale forces, whether imperial, capitalist, or socialist.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Explicitly opposed British imperialism (opposed the Boer War specifically) as a betrayal of the
  // small-property, human-scale values distributism championed — genuinely anti-militarist for his era
  // and class.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Distributism is explicitly a "third way" against both monopoly capitalism and state socialism —
  // favors small private property widely distributed rather than either concentrated private capital
  // or collectivized state ownership.
  economia: ["N","D","N","D","N","D","C","D","N","D","N","D","N","D","N","D","N","D","N","N"],
  // Explicitly wary of both "Big Business" and "Big Government" equally — favored guild-like local
  // self-regulation over either corporate monopoly power or centralized state economic direction.
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","D","N","C","D","C"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A devout Catholic convert who wrote extensively on Christian apologetics ("Orthodoxy," "The
  // Everlasting Man") — religion was central and explicit to his entire intellectual and social
  // program, not merely instrumental.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Wrote a book-length polemic against eugenics ("Eugenics and Other Evils") and championed
  // traditional family/community structures grounded in Christian humanism against both state and
  // corporate encroachment on the person.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","C","N","CT","N","C","D","CT"],
  // A romantic skeptic of industrial mass-production's dehumanizing scale, though not opposed to
  // technology per se — favored human-scale craft production over large-scale mechanization.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","D","C","D","D","D","C","N","D"],
};

const HENRI_DE_SAINT_SIMON = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Explicitly favored governance by qualified scientific/industrial experts over elected politicians
  // — genuinely skeptical of popular electoral sovereignty as an organizing principle, preferring
  // technocratic selection by demonstrated competence.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Believed industrial productive capacity, organized and planned by qualified experts, should
  // replace inherited aristocratic and political privilege as society's organizing economic principle
  // — a genuinely technocratic-planning vision, an important precursor to utopian socialism.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","C","C","D","N","D","CT","D","C","D"],
  // Envisioned comprehensive expert-led economic planning (industrialists and scientists directing
  // production) as the antidote to the waste and disorder of politically-directed governance.
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // His late work "New Christianity" reframed religious ethics explicitly around improving the material
  // condition of the poorest class — religion instrumentalized toward social/industrial progress
  // rather than either traditional dogma or pure secularism.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","D","D","D","D","D","C","D"],
  moral: ["C","D","C","D","C","D","C","N","CT","D","C","D","N","N","N","D","N","D","C","D"],
  // The absolute, defining center of his entire philosophy: a society reorganized around scientific
  // and industrial progress, governed by engineers and scientists as the vanguard of social advancement
  // — among the most maximal pro-technology, pro-industrial-modernity positions of any pre-20th-century
  // figure audited.
  tecnologia: ["CT","DT","CT","D","C","N","CT","D","CT","N","CT","D","C","D","CT","D","CT","D","CT","D"],
};

const MICHAEL_SANDEL = {
  // Communitarianism explicitly favors strong local/communal institutions and traditions as the site
  // where justice and virtue are actually formed, rejecting abstract universalist liberal proceduralism
  // that treats individuals as unencumbered choosers detached from their communities.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // A genuine deliberative democrat who believes robust civic participation and public reasoning about
  // the common good (not merely aggregating individual preferences) are essential to legitimate
  // self-government.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "What Money Can't Buy" explicitly argues markets have expanded into domains (education, health,
  // civic life) where they corrode rather than serve moral/civic values — a real, substantive critique
  // of market triumphalism favoring protected non-market social spheres.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  // "The Tyranny of Merit" explicitly argues meritocratic ideology breeds arrogance among winners and
  // humiliation/resentment among those it deems "losers," corroding the social solidarity a healthy
  // democracy requires — a direct, substantive critique of meritocracy as a moral/social organizing
  // principle, the polar opposite of Wooldridge's defense of it.
  moral: ["C","N","C","D","C","N","C","N","C","D","C","N","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const ADRIAN_WOOLDRIDGE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Believes competitive, merit-based selection (testing, open competition) rather than either
  // hereditary privilege or identity-based allocation should determine political and institutional
  // leadership — a genuinely meritocratic-institutionalist, not populist or traditionalist, democratic vision.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Generally pro-market and pro-globalization, believing competitive economic openness (like
  // competitive meritocratic selection generally) rewards genuine talent and effort over inherited
  // advantage — market competition as the economic analogue of his meritocratic social philosophy.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","N","C","D","C"],
  // A committed free-trade globalist (writes for The Economist) who sees open competitive markets as
  // the natural extension of meritocratic principles to international economic life.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  // "The Aristocracy of Talent" explicitly argues meritocratic selection — advancement by demonstrated
  // talent and effort rather than birth or identity-based quotas — is a moral good that modern
  // societies must renew and defend against both persistent hereditary privilege and newer non-merit
  // sorting criteria — the direct opposite of Sandel's "Tyranny of Merit" critique.
  moral: ["D","N","D","C","D","N","D","N","D","C","D","N","N","N","N","C","N","C","D","N"],
  // A committed techno-optimist who sees technological and economic dynamism as engines of the same
  // meritocratic progress he champions institutionally.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

export const PROFILES = {
  "ludwig-erhard": LUDWIG_ERHARD,
  "gk-chesterton": GK_CHESTERTON,
  "henri-de-saint-simon": HENRI_DE_SAINT_SIMON,
  "michael-sandel": MICHAEL_SANDEL,
  "adrian-wooldridge": ADRIAN_WOOLDRIDGE,
};
