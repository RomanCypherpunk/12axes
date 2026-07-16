// FQA073 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// charles-fourier: utopian socialist who designed the "phalanstère" cooperative-community model,
//   explicitly measured a society's progress by the degree of women's emancipation, radically critiqued
//   marriage/monogamy and moral repression in favor of "passionate attraction" (people should follow
//   natural desire, not suppress it), believed phalanges would spread by attractive voluntary example,
//   not revolution.
// nicolas-de-condorcet: Enlightenment mathematician-philosopher, explicitly advocated women's suffrage
//   ("On the Admission of Women to the Rights of Citizenship," 1790), championed universal public
//   education and a form of public social-insurance assistance, believed in humanity's rational
//   perfectibility — a moderate Girondin revolutionary who was still proscribed and died in a
//   Jacobin prison.
// john-rawls: "A Theory of Justice" (1971) — the "veil of ignorance"/original-position thought
//   experiment and the difference principle (inequality justified only if it benefits the least
//   advantaged) — a systematic liberal-egalitarian reformist working within, not against, liberal-
//   democratic constitutionalism.
// aldo-leopold: "A Sand County Almanac" formulated the "land ethic" — extending moral consideration to
//   soil, water, plants, and animals as a "community" humans belong to rather than dominate; a
//   professional forester/wildlife ecologist more naturalist-philosopher than political theorist.
// theodore-roosevelt: Progressive-era US president (1901-09) — trust-busted Standard Oil/Northern
//   Securities, created the national-park/forest/monument conservation system, passed the Pure Food and
//   Drug Act, pursued "big stick" interventionist foreign policy (Panama Canal, the Roosevelt Corollary
//   asserting US intervention rights in Latin America), later ran on the more radical 1912 Bull Moose
//   Progressive platform (women's suffrage, direct democracy), and held documented eugenics sympathies.

const CHARLES_FOURIER = {
  // Phalanstère communities were explicitly voluntary, small-scale, self-governing cooperative units —
  // a maximally decentralized social-organization vision built from the bottom up, not imposed by any
  // central state.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Believed phalanges would spread by the attractive power of voluntary example, not coercion or
  // revolutionary violence — a genuinely non-coercive utopian-socialist method, distinct from Marxist
  // revolutionary seizure of power.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  // Utopian-socialist internationalism envisioned phalanges federating peacefully worldwide through
  // voluntary attraction rather than diplomatic power politics — genuinely indifferent to, rather than
  // engaged with, conventional statecraft.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Phalanstère economics organized cooperative labor and shared profit distribution based on
  // contribution (capital, labor, and talent all received a share) — a genuinely collectivist, though
  // non-state, economic model.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Radically critiqued marriage, monogamy, and conventional sexual morality as repressive of natural
  // "passionate attraction," explicitly measured civilizational progress by women's emancipation, and
  // envisioned sexual/relational freedom as central to human liberation — among the most sweepingly
  // progressive moral philosophies of his era.
  moral: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","C","DT","CT","DT","CT","DT"],
  // Believed cooperative labor organized around natural passions (rather than industrial drudgery)
  // would unlock abundance, though his technological vision was more social-organizational than
  // industrial/scientific in character.
  tecnologia: ["C","D","N","N","C","N","N","N","N","N","N","N","C","N","C","N","N","N","N","N"],
};

const NICOLAS_DE_CONDORCET = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Explicitly advocated women's suffrage in his 1790 essay "On the Admission of Women to the Rights of
  // Citizenship," championed universal representative government grounded in reason and equal civil
  // rights for all — among the most expansively democratic Enlightenment figures.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  // A mathematician-philosopher with no personal military/diplomatic career (unlike Roosevelt), whose
  // "perpetual peace"-adjacent Enlightenment universalism favored reasoned international cooperation
  // over any nationalist military posture.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Proposed public social-insurance/assistance mechanisms (aid for the elderly, unemployed, and
  // disabled) as a matter of rational social design — a genuinely progressive proto-welfare position
  // grounded in Enlightenment universalism rather than revolutionary class struggle.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A rationalist committed to the "progress of the human mind" through reason and science, skeptical of
  // religious authority's role in public affairs though not stridently anti-religious in Fourier's or
  // Paine's more polemical mode.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Championed universal public education, civil equality regardless of race or sex, and believed
  // humanity's moral progress was achievable through the spread of reason — a defining progressive
  // Enlightenment moral vision.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // A mathematician (Condorcet's paradox/jury theorem) who believed applied reason and science were the
  // primary engines of human moral and material progress — genuinely maximal Enlightenment
  // science-optimism.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

const JOHN_RAWLS = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // The "original position"/veil of ignorance is fundamentally a theory of just, equal democratic
  // representation — designing institutions as if one didn't know one's own place in society, ensuring
  // basic liberties and fair political participation for all.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // The first principle of justice guarantees equal basic liberties (speech, conscience, due process)
  // as the strict lexical priority over any other social goal — a strongly liberty-protective, not
  // security-maximizing, theory of legitimate state coercion.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["N","C","D","C","N","C","D","C","N","C","N","C","N","C","N","D","N","D","N","N"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // The "difference principle" explicitly permits economic inequality only insofar as it benefits the
  // least-advantaged members of society — a systematic, philosophically rigorous liberal-egalitarian
  // redistribution framework operating within, not against, a market economy.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Favored a "property-owning democracy" with wide dispersal of capital ownership and robust public
  // institutions ensuring fair equality of opportunity — real, deliberate structural intervention to
  // maintain fairness, not laissez-faire indifference to outcomes.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // "Political Liberalism" explicitly built toleration and pluralism (an "overlapping consensus" among
  // diverse comprehensive worldviews) into the theory's foundations — a systematically pluralistic,
  // rights-respecting moral framework.
  moral: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const ALDO_LEOPOLD = {
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","D","C","N","C"],
  // As a professional forester/wildlife manager, believed sound ecological stewardship required real
  // scientific regulatory management of land use (game limits, soil conservation districts) — a real,
  // if moderate, endorsement of state ecological planning.
  controle: ["C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","C","N","D","C","D"],
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // The defining "land ethic" argument: soil, water, plants, and animals form a "community" to which
  // humans belong and are answerable, not mere resources to dominate for industrial ends — a
  // foundational pro-nature, precautionary-toward-industrial-technology environmental philosophy.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","C","C","D","D","D","C","N","D"],
};

const THEODORE_ROOSEVELT = {
  // As president, dramatically expanded federal executive authority (trust-busting, conservation
  // designations via the Antiquities Act) over resistant state/private interests — real, assertive
  // federal centralization in service of Progressive-era reform.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  representacao: ["C","C","C","C","D","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  // A muscular, moralistic law-and-order reformer (police commissioner reform in NYC, regulation of
  // corporate abuse) combined with genuine expansion of consumer/worker protections (Pure Food and
  // Drug Act) — real state assertiveness in both security and regulatory dimensions.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Held documented eugenics sympathies and believed strongly in "Americanization"/assimilation of
  // immigrants into a unified national civic culture — real, era-typical assimilationist convictions.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // "Big stick" interventionist diplomacy — built the "Great White Fleet" to project naval power
  // globally, secured the Panama Canal Zone through direct intervention, and issued the Roosevelt
  // Corollary asserting a US right to intervene in Latin American affairs — genuinely militarist and
  // assertive.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // The Roosevelt Corollary to the Monroe Doctrine explicitly asserted a unilateral US right to
  // intervene in Latin American nations' internal affairs to preempt European intervention — a
  // defining, deliberate expansion of interventionist doctrine.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Trust-busted Standard Oil and Northern Securities and regulated railroad rates (Hepburn Act) — real,
  // assertive federal intervention against concentrated corporate power, though within a fundamentally
  // capitalist "Square Deal" framework, not socialism.
  economia: ["C","D","C","D","D","D","C","C","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  // The 1912 Bull Moose platform included protective tariffs balanced against consumer-protection
  // regulation — moderate protectionism typical of the era's Republican economic nationalism.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","C","D","C","N","D","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  // Created the US national-park/forest/monument conservation system (Antiquities Act, dozens of
  // designations) as a defining legacy — genuine, deliberate state-led environmental stewardship,
  // alongside enthusiastic embrace of industrial-era infrastructure (the Panama Canal engineering feat).
  tecnologia: ["C","D","C","N","C","D","N","D","C","D","C","C","C","C","C","D","D","D","C","N"],
};

export const PROFILES = {
  "charles-fourier": CHARLES_FOURIER,
  "nicolas-de-condorcet": NICOLAS_DE_CONDORCET,
  "john-rawls": JOHN_RAWLS,
  "aldo-leopold": ALDO_LEOPOLD,
  "theodore-roosevelt": THEODORE_ROOSEVELT,
};
