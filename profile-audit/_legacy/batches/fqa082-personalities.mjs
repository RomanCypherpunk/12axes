// FQA082 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// leonard-peikoff: Ayn Rand's designated intellectual heir — systematized Objectivism (reason as
//   absolute, rational self-interest, laissez-faire capitalism as the only moral economic system,
//   rejected altruism as immoral), founded the Ayn Rand Institute, militantly atheist/anti-mysticism.
// elon-musk: tech entrepreneur (Tesla, SpaceX, X, Neuralink) championing techno-accelerationism (rapid
//   AI/space/EV/brain-computer-interface development as civilizational insurance), libertarian-adjacent
//   rhetoric alongside real reliance on government contracts/subsidies for his companies, increasingly
//   engaged in right-leaning US politics (DOGE government-efficiency role).
// scruton: British conservative philosopher defending tradition, beauty, national identity, and
//   inherited institutions against relativism and progressive ideology, Burkean in temperament, wrote
//   extensively on aesthetics (favoring traditional/classical forms over modernist reaction), skeptical
//   of EU supranationalism and mass immigration's effect on national cohesion.
// friedrich-list: German-American economist — "The National System of Political Economy" (1841)
//   explicitly opposed British free-trade orthodoxy as serving an already-industrialized Britain while
//   harming developing economies, argued temporary "infant industry" tariff protection lets
//   less-developed nations industrialize before competing openly — directly influenced German,
//   American, Japanese, and Asian Tiger industrial-policy history.
// konkin: created "agorism"/counter-economics — believed building underground black-market economic
//   activity would gradually starve the state of resources and legitimacy, rejected both electoral
//   politics (voting legitimizes the state) and violent revolution in favor of tax resistance and
//   informal-market activity as the path to a stateless society.

const LEONARD_PEIKOFF = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  // Objectivism holds government's only legitimate function is protecting individual rights (police,
  // courts, military) against force/fraud — genuinely liberty-maximizing, rejecting any paternalistic
  // or redistributive coercion as immoral.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Strongly pro-Israel and explicitly anti-Islamist in his foreign-policy commentary, favoring
  // assertive Western civilizational self-defense against theocratic totalitarianism.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Objectivism holds laissez-faire capitalism is the only moral economic system, rejecting altruism-
  // based redistribution as a violation of rational self-interest — among the most absolute free-market
  // moral-philosophical positions of any figure audited.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // A militant, systematic atheist who treated religious faith as a form of anti-rational "mysticism"
  // fundamentally incompatible with Objectivism's absolute reliance on reason — among the most
  // emphatically anti-religious philosophers of the 20th century.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Objectivism celebrates technology and industrial achievement as expressions of rational human
  // productive capacity — genuinely maximal pro-technology, pro-industrial-progress conviction.
  tecnologia: ["CT","DT","CT","D","C","N","N","D","CT","N","CT","D","C","D","CT","D","C","D","CT","N"],
};

const ELON_MUSK = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","C","C","C","D","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  // Free-speech-absolutist rhetoric around the X/Twitter acquisition alongside real reliance on strict
  // internal company control and litigious responses to critics — a genuinely mixed liberty-rhetoric-
  // vs-practice record, distinct from a purely consistent civil-libertarian position.
  poder: ["N","CT","N","CT","N","CT","N","C","D","CT","N","CT","N","C","D","C","N","C","D","C"],
  // Himself an immigrant (South Africa, Canada, US) who supports high-skill immigration (H-1B visa
  // advocacy) while holding more mixed, increasingly restrictionist rhetoric on general/illegal
  // immigration in recent years — a genuinely split, not uniformly open, position.
  imigracao: ["C","C","D","C","N","C","C","C","C","C","C","C","N","C","N","D","D","D","D","N"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","D","D","C","D","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Libertarian-leaning rhetoric on markets and deregulation coexists with substantial, real reliance
  // on government contracts and subsidies (NASA/SpaceX contracts, EV tax credits for Tesla) — a
  // genuinely mixed, not consistently laissez-faire-in-practice, economic record that critics
  // repeatedly note as a real tension.
  economia: ["D","C","D","C","D","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Explicit "techno-accelerationism" — pushes AI, space colonization (Mars as civilizational
  // insurance), electric vehicles, and brain-computer interfaces as fast as possible, viewing rapid
  // technological development as an unambiguous civilizational good — among the most maximally
  // pro-technology figures in this entire project.
  tecnologia: ["CT","DT","CT","DT","CT","DT","N","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
};

const SCRUTON = {
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  // A Burkean conservative who valued inherited parliamentary institutions and organic constitutional
  // tradition, skeptical of both radical democratic mass mobilization and technocratic EU supranational
  // governance eroding British parliamentary sovereignty.
  representacao: ["C","C","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  poder: ["C","D","C","D","C","D","C","D","C","D","C","D","D","C","D","D","C","D","D","D"],
  // Explicitly concerned that mass immigration and multiculturalism erode national cohesion and shared
  // cultural inheritance — favored assimilation into a nation's traditional identity over
  // celebrated cultural fragmentation, a defining conservative-nationalist conviction.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Skeptical of EU supranational integration as eroding British national sovereignty, favored a
  // restrained, nationally-rooted rather than either isolationist or globally-interventionist foreign posture.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  economia: ["D","C","D","C","D","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A traditionalist Anglican who valued religion's essential role in binding communities together and
  // providing shared meaning against secular relativism — favored religion's continued public/cultural
  // presence over a strictly secular public sphere.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  // Explicitly and consistently defended traditional family structure, inherited moral norms, and
  // aesthetic/cultural conservatism against what he saw as corrosive relativism and progressive
  // ideology — among the most deliberately, philosophically traditionalist figures audited.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Wrote extensively on aesthetics defending traditional/classical architectural and musical forms
  // against modernist reaction, and expressed real skepticism toward industrial/technological
  // modernity's corrosive effect on beauty, place, and rooted tradition — a genuinely pro-nature,
  // anti-technological-modernism aesthetic-philosophical position.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const FRIEDRICH_LIST = {
  // Believed a strong, unified national state (he advocated German unification specifically) was a
  // necessary precondition for successful economic development and industrial catch-up — favored
  // national economic coordination over fragmented local autonomy.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  // Favored a strong, activist state directing industrial development strategy — real, deliberate state
  // economic authority in service of national industrial catch-up, though not domestic political repression.
  poder: ["C","C","N","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Believed nations should assertively pursue their own economic-development interests and industrial
  // catch-up rather than either passive free-trade universalism or territorial military expansion —
  // economic nationalism, not military interventionism.
  intervencao: ["D","C","D","C","D","C","N","CT","D","C","D","C","D","C","D","C","D","D","D","C"],
  economia: ["N","D","N","D","C","D","N","D","C","D","N","D","N","D","N","D","N","D","C","D"],
  // Argued the state must actively direct and nurture "infant industries" through their vulnerable
  // early development phase — a genuinely dirigiste, though explicitly temporary and developmental
  // (not permanent), economic-control philosophy.
  controle: ["C","D","C","D","C","D","CT","D","CT","D","CT","D","D","D","C","D","C","D","C","D"],
  // The foundational "infant industry" protectionist argument: temporary tariffs are necessary for
  // developing nations to industrialize before competing against already-industrialized powers on open
  // terms — a deliberate, historically enormously influential protectionist economic-nationalist doctrine.
  comercio: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["D","C","D","C","N","D","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["C","D","N","N","N","D","D","C","D","N","D","C","D","N","D","C","N","D","N","D"],
};

const KONKIN = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Agorism's defining rejection: the state's coercive apparatus is entirely illegitimate, to be
  // starved of resources and legitimacy through informal counter-economic activity rather than either
  // reformed or violently overthrown.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  // Rejected the legitimacy of state-to-state diplomacy and international relations entirely as just
  // another manifestation of illegitimate coercive authority — the most extreme rejection of
  // conventional statecraft of any figure in this project.
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Counter-economics" — build a thriving informal/black-market economy explicitly outside state
  // taxation and regulation as the practical mechanism for gradually replacing the state entirely — a
  // maximal, action-oriented anarcho-capitalist economics distinct from Rothbard's more theoretical framework.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Advocated smuggling, tax evasion, and unlicensed/untaxed trade explicitly as legitimate
  // counter-economic resistance to state-imposed trade restrictions — a deliberately illegal-by-design
  // maximal free-trade practice.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Agorist counter-economics was later directly embraced by cryptocurrency/decentralized-technology
  // movements as the practical infrastructure for stateless informal markets — a genuinely tech-forward
  // strand of libertarianism, anticipating crypto-agorism.
  tecnologia: ["CT","DT","CT","D","C","N","N","D","CT","N","CT","D","C","D","CT","D","C","D","CT","N"],
};

export const PROFILES = {
  "leonard-peikoff": LEONARD_PEIKOFF,
  "elon-musk": ELON_MUSK,
  "scruton": SCRUTON,
  "friedrich-list": FRIEDRICH_LIST,
  "konkin": KONKIN,
};
