// FQA074 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// srnicek: "Inventing the Future" (with Alex Williams) argues the left should seize automation/AI to
//   defeat capitalism from within, championing universal basic income, a shortened work week, and full
//   automation toward a post-work society of shared abundance — "Platform Capitalism" critiques tech
//   monopolies, but the underlying economic vision remains anti-capitalist/socialist, not tech-libertarian.
// ray-kurzweil: Google engineer/inventor (OCR, text-to-speech), "The Singularity Is Near" predicts
//   exponential technological growth culminating in human-AI merger (~2045), a leading transhumanist
//   advocating radical life extension, mind uploading, and genetic/nano/robotic enhancement — a
//   techno-optimist who believes market-driven innovation, not state planning, drives this future.
// getulio-vargas: unlike the historical "brasil-era-vargas" country profile (focused specifically on
//   the 1937-45 authoritarian Estado Novo phase), this personality profile spans his full political
//   career — the 1930-45 Estado Novo dictatorship (closed Congress, banned parties, DIP censorship, the
//   foundational CLT labor code) AND his later return as a democratically *elected* president (1951-54,
//   before his 1954 suicide amid political crisis) — a genuinely more mixed authoritarian/democratic record.
// ernest-renan: "What Is a Nation?" (1882) founded civic nationalism — a nation is a "daily plebiscite"
//   grounded in shared memory and present consent to live together, explicitly rejecting race, language,
//   or religion as defining criteria (against German ethnic-nationalist theory); his "Life of Jesus"
//   treated Jesus as a historical rather than theological figure, provoking Catholic backlash, though
//   his other writings held conventional 19th-century racial-hierarchy assumptions.
// evo-morales: Bolivia's first indigenous president (2006-19) — nationalized the hydrocarbons/gas
//   industry (2006), rewrote the constitution (2009) establishing the "Plurinational State of Bolivia"
//   with formal legal recognition of indigenous nations' autonomy and customary justice systems, led
//   significant poverty reduction, was ousted in a disputed 2019 crisis after seeking a term-limit-
//   defying re-election.

const SRNICEK = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","D","N","D","N","D","N","C","N","D","N","D","N","D","D","D","N","D","D","D"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Explicitly anti-capitalist in structural terms (wants to move beyond wage labor and capitalist
  // ownership entirely via automation-funded UBI) — the technology is the *means*, but the economic
  // destination remains a fundamentally post-capitalist, collectively-oriented system.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","CT","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // The defining thesis of left-accelerationism: automation and AI should be maximally embraced and
  // accelerated, not resisted, as the technical foundation for a post-scarcity, post-work future — one
  // of the most emphatically pro-technology economic-left positions of any figure in this project.
  tecnologia: ["CT","DT","CT","DT","CT","D","N","D","CT","D","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
};

const RAY_KURZWEIL = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  // A tech-cosmopolitan Silicon Valley engineer whose worldview centers on globally networked
  // innovation and human-machine convergence rather than any particular national-cultural
  // assimilation project.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Believes market-driven private innovation (not state planning) is the primary engine of the
  // exponential technological progress his "Law of Accelerating Returns" describes — a genuinely
  // pro-market technology-optimist, distinct from Srnicek's collectivist automation politics.
  economia: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // A committed transhumanist who champions radical bodily/cognitive enhancement, life extension, and
  // eventual mind-machine merger as liberating human progress rather than something to fear or restrain.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","C","DT","C","DT","C","DT","CT","DT"],
  // "The Singularity Is Near" — believes exponential technological growth (AI, nanotechnology, genetic
  // engineering, brain-computer interfaces) will fundamentally transform and transcend biological
  // human limits — among the most maximally pro-technology figures conceivable.
  tecnologia: ["CT","DT","CT","DT","CT","DT","N","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
};

const GETULIO_VARGAS = {
  // The Estado Novo (1937-45) was maximally centralizing (federally appointed "interventores" replaced
  // elected governors), but Vargas's later 1951-54 term operated within the restored 1946 federal
  // constitution — a genuinely bimodal record spanning both extremes of his career.
  estrutura: ["D","C","D","C","N","C","D","C","N","C","D","C","D","C","D","C","N","C","D","N"],
  // Closed Congress and banned parties during the Estado Novo (1937-45), but returned to power in 1951
  // via a free, competitive popular election under the restored 1946 constitution — a genuinely split
  // record between dictatorship and democratically legitimated rule across his two eras in office.
  representacao: ["N","C","N","N","D","C","N","C","D","C","N","C","D","N","N","C","D","N","D","C"],
  // Political police (DOPS) repression and censorship (DIP) during the Estado Novo were real and severe,
  // though his later elected term governed under normal constitutional constraints rather than emergency
  // powers — genuinely less totalizing than a full-career reading of only the dictatorship phase.
  poder: ["C","C","C","C","C","N","CT","D","C","D","C","D","N","D","C","D","CT","D","C","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","C","D","C","D"],
  diplomacia: ["C","C","D","C","C","C","D","C","C","C","C","N","C","N","N","C","D","DT","C","N"],
  intervencao: ["C","D","D","C","C","C","D","C","N","C","N","C","C","D","C","D","C","C","D","D"],
  // Founded state enterprises (steel at Volta Redonda, laying groundwork for Petrobras) across both eras
  // of his rule, alongside the enduring CLT labor code — a consistent nationalist-developmentalist
  // economic thread spanning his authoritarian and democratic periods alike.
  economia: ["D","C","C","D","D","DT","C","C","C","D","D","C","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","D","C","D"],
  comercio: ["CT","DT","C","D","C","D","C","DT","C","D","CT","D","C","D","CT","D","C","D","CT","D"],
  religiao: ["C","C","C","D","D","C","C","D","C","C","D","C","D","C","D","C","D","D","C","C"],
  // Corporatist labor paternalism spanned both eras (CLT labor rights framed as a benevolent gift from
  // the state to workers, "pai dos pobres" populist self-image), broadly traditional social order
  // throughout, tempered somewhat in his later populist-democratic phase's more open political culture.
  moral: ["D","C","D","C","N","C","D","N","D","C","D","C","D","C","N","D","D","C","D","N"],
  tecnologia: ["C","D","N","N","N","D","D","C","D","N","D","C","D","N","D","C","N","D","N","D"],
};

const ERNEST_RENAN = {
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  // "What Is a Nation?" defined nationhood as a "daily plebiscite" — a continuous, freely renewed
  // consent to live together — a genuinely voluntarist, participatory theory of collective political
  // legitimacy rather than either pure elite rule or ethnic determinism.
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  poder: ["C","C","N","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Explicitly rejected race, language, and religion as defining criteria of nationhood — a
  // foundational civic-nationalist rather than ethnic-nationalist theory, favoring inclusion based on
  // shared will and memory over ancestry — though his broader scholarly writings elsewhere reflected
  // conventional 19th-century racial-hierarchy assumptions, a real, documented tension.
  imigracao: ["D","C","C","C","D","C","D","C","C","C","D","C","N","C","D","C","D","D","D","N"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  economia: ["C","D","C","D","C","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // "The Life of Jesus" (1863) treated Jesus as a historical human figure subject to critical-historical
  // method rather than theological dogma — a landmark work of secularizing rationalist scholarship that
  // provoked fierce Catholic Church condemnation.
  religiao: ["CT","DT","CT","D","C","D","CT","D","CT","D","C","D","C","D","CT","D","C","D","CT","D"],
  // A philologist-historian whose rationalist historical-critical method (applied even to sacred
  // scripture) reflected Enlightenment-descended intellectual openness, tempered by conventional-for-
  // his-era racial and civilizational hierarchy assumptions found elsewhere in his work — a genuinely
  // mixed, not simply progressive, moral profile.
  moral: ["N","C","N","N","N","D","N","N","N","D","N","N","D","N","N","D","N","D","N","N"],
  // A historian of religion and philologist working within the era's evolving human/social sciences,
  // applying rigorous critical-historical method rather than engaging directly with industrial
  // technology questions.
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const EVO_MORALES = {
  // The 2009 constitution's "Plurinational State" explicitly recognizes indigenous nations' territorial
  // autonomy and customary law/justice systems operating alongside state law — a genuine, formally
  // codified legal pluralism and devolution of authority, among the most concretely federalist
  // indigenous-rights frameworks in the world.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D"],
  // Won competitive elections repeatedly (2005, 2009, 2014) with genuine mass indigenous/campesino
  // support, though his pursuit of a fourth term beyond constitutional term limits after losing a 2016
  // referendum on the question triggered the disputed 2019 crisis — a real, documented erosion of his
  // own democratic-legitimacy record late in his tenure.
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","D","C","D","D","C","C","D"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Rose from a coca-grower (cocalero) union leader background and centered indigenous cultural
  // identity/autonomy explicitly against centuries of assimilationist mestizo-elite rule — a defining
  // reversal of prior Bolivian assimilation politics toward celebrated indigenous pluralism.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Aligned closely with the anti-US "Bolivarian" bloc (Venezuela, Cuba), expelled the US ambassador and
  // DEA in 2008, and pursued an assertively anti-imperialist, sovereignty-first foreign posture.
  intervencao: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D"],
  // Nationalized the hydrocarbons/gas industry (2006, a landmark act redirecting resource rents to the
  // state) and pursued significant land redistribution — a decisive shift of the economy's key sectors
  // toward state and collective indigenous control.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // Nationalist resource-control policy (state renegotiated all foreign gas contracts on much more
  // favorable terms) reflects real economic-sovereignty protectionism over open foreign investment terms.
  comercio: ["CT","D","CT","D","C","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Indigenous "Pachamama" cosmology was elevated to constitutional status (rights of Mother Earth
  // legislation, 2010-11) alongside continued Catholic cultural presence — a genuinely syncretic,
  // indigenous-spirituality-centered rather than conventionally secular or singly-religious framework.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["C","N","C","N","C","D","C","N","C","D","N","D","N","N","N","D","N","D","C","N"],
  // Real tension between indigenous "Pachamama"/environmental rhetoric (rights-of-nature legislation)
  // and continued heavy dependence on extractive gas/mining export revenue to fund social programs —
  // a genuinely mixed, not consistently anti-technology, position.
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

export const PROFILES = {
  "srnicek": SRNICEK,
  "ray-kurzweil": RAY_KURZWEIL,
  "getulio-vargas": GETULIO_VARGAS,
  "ernest-renan": ERNEST_RENAN,
  "evo-morales": EVO_MORALES,
};
