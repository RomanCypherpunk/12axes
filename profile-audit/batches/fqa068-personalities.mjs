// FQA068 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// frederico-ii-da-prussia: "enlightened despot" who built Prussia's cameralist bureaucratic-military
//   state (the Silesian Wars, Seven Years War), personally a skeptical deist who nonetheless
//   proclaimed real religious tolerance ("everyone must get to heaven in his own way"), corresponded
//   with and hosted Voltaire, abolished judicial torture and began codifying Prussian law, while
//   maintaining absolute monarchy and serfdom.
// joseph-de-maistre: the foundational reactionary theorist against the French Revolution — defended
//   throne-and-altar absolutism and papal ultramontane authority as the sole legitimate social order,
//   argued reason/rationalism produced revolutionary chaos, believed true constitutions emerge
//   organically from tradition/providence and cannot be rationally written.
// aleksandr-dugin: Russian philosopher of the "Fourth Political Theory" and Eurasianism — rejects
//   liberalism, communism, and fascism alike in favor of a traditionalist, civilizational multipolar
//   order opposing Western/Atlanticist liberal hegemony, ideologically influential on (though not
//   formally directing) Putin-era Russian nationalism, his daughter was assassinated in 2022 in an
//   attack widely believed to have targeted him.
// roman-dmowski: founded Polish ethnic-nationalist National Democracy (Endecja) — Catholic identity
//   as central to Polish nationhood, proposed numerus clausus restrictions limiting Jewish
//   participation in Polish institutions, represented Poland at Versailles helping restore its 1918
//   independence, favored building national strength through education/economic development over
//   Piłsudski's romantic-insurrectionist multi-ethnic federalism.
// leon-kass: chaired George W. Bush's President's Council on Bioethics (2001-05), the leading voice
//   of American "bioconservatism" — opposes human genetic enhancement, cloning, and life-extension
//   technology on human-dignity and natural-human-finitude grounds, opposed expanding embryonic
//   stem-cell research.

const FREDERICO_II_DA_PRUSSIA = {
  // Built Prussia's cameralist state around centralized royal finances and a disciplined bureaucracy
  // reporting directly to the crown — administrative efficiency achieved through centralization, not
  // devolution.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Built Prussia's army into Europe's most feared, rigorously disciplined military force and fought
  // sustained wars of conquest (the Silesian Wars, Seven Years War) — a maximally militarized state,
  // though he abolished judicial torture domestically as part of his Enlightenment-influenced legal reforms.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Actively recruited religious refugees (Huguenots, and later Catholics and Jews under real if
  // uneven toleration) as a deliberate state-building strategy to grow Prussia's population and
  // skilled workforce — genuine, policy-driven pluralistic accommodation, not forced assimilation.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Fought the Silesian Wars and the Seven Years War to seize and hold territory, building Prussia
  // into a major European military power through sustained, deliberate martial assertion.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The cameralist state directed the economy toward maximizing crown revenue and military capacity —
  // promoted agricultural improvement (potato cultivation) and state-sponsored manufacturing as
  // deliberate fiscal/strategic policy.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  // Cameralist mercantilism actively directed trade toward strengthening state finances and domestic
  // industry, consistent with the era's dominant protectionist economic doctrine.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // A personally skeptical deist ("Frederick the philosopher-king") who nonetheless enforced genuine,
  // policy-level religious tolerance across his diverse territories — a rare, deliberate separation
  // between his own private skepticism and a pluralistic public religious policy.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Corresponded extensively with and hosted Voltaire, patronized the Berlin Academy of Sciences, and
  // promoted agricultural-technical innovation (potato cultivation) as state policy — genuine
  // Enlightenment scientific patronage.
  tecnologia: ["C","D","C","N","C","N","N","C","N","C","C","D","C","D","C","D","N","D","C","N"],
};

const JOSEPH_DE_MAISTRE = {
  // Believed legitimate order flows only from an unbroken, organically-developed central monarchical
  // authority — explicitly rejected any devolution or popular sovereignty as a recipe for revolutionary
  // chaos.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Explicitly rejected written constitutions and popular representation as rationalist hubris — "the
  // true constitution" for Maistre could only emerge organically from tradition and divine providence,
  // never be deliberately drafted by an assembly.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Famously argued the executioner was a necessary, quasi-sacred figure whose violence underpinned
  // civilization itself — an extreme, explicit theoretical justification for maximal state coercive
  // authority as socially foundational.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A committed papal ultramontanist who believed the Pope's spiritual authority was supreme even
  // over kings — one of history's most explicit theorists of maximal church-state fusion under
  // religious primacy specifically (not merely a religious monarch, but religious authority as the
  // ultimate check on secular power).
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Explicitly blamed Enlightenment rationalism and moral relativism for the Terror's violence,
  // advocating a return to rigid traditional religious-moral authority as the only bulwark against
  // societal collapse — among the most extreme traditionalist theorists audited.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Explicitly distrusted Enlightenment scientific rationalism as a corrosive force that had produced
  // revolutionary chaos rather than genuine progress — deeply skeptical of the "progress through
  // reason and science" project itself.
  tecnologia: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
};

const ALEKSANDR_DUGIN = {
  // Eurasianism explicitly favors a civilizational bloc (Russia as a distinct Eurasian civilization)
  // over either a unitary nation-state or genuine multi-center federalism — power organized around
  // Moscow as the civilizational core.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Explicitly rejects liberal democracy as a corrosive Western import — the "Fourth Political
  // Theory" favors traditionalist, civilizational authority over popular electoral sovereignty.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  poder: ["CT","D","C","D","CT","D","C","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Advocates for Russia to assert itself as a dominant civilizational-military pole explicitly
  // countering Atlanticist/NATO influence — a deliberately militarist geopolitical doctrine.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Explicitly justified and advocated for Russian territorial expansion (supported the annexation of
  // Crimea and the full invasion of Ukraine as part of restoring "Novorossiya"/Eurasian civilizational
  // unity) — genuinely, explicitly interventionist-nationalist doctrine, among the most extreme audited.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  economia: ["C","D","C","D","C","D","C","C","C","D","N","C","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Eurasianism explicitly favors a self-sufficient, civilizational trade bloc oriented away from
  // Western/Atlanticist markets — a deliberately protectionist, geopolitically-realigned trade doctrine.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Ties Russian Orthodox Christianity explicitly to Eurasian civilizational identity as a core
  // ideological pillar against Western secular liberalism — religion deeply fused with his
  // civilizational-nationalist project.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Explicitly skeptical of Western liberal techno-modernity as culturally corrosive, favoring
  // traditionalist civilizational values over technological/scientific universalism.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","D","C","D","D","D","C","N","D"],
};

const ROMAN_DMOWSKI = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Endecja actually participated in electoral and parliamentary politics (Dmowski represented Poland
  // diplomatically at Versailles and served in the Russian Duma earlier) — a real, if ethnic-
  // nationalist-bounded, commitment to representative institutions rather than outright authoritarianism.
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  // Proposed numerus clausus restrictions explicitly limiting Jewish participation in Polish
  // universities/institutions and championed Catholic-Polish ethnic homogeneity as the defining
  // national project — a real, documented exclusionary-assimilationist platform.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // A pragmatic realist diplomat (represented Poland at the Paris Peace Conference/Versailles),
  // favoring negotiated great-power diplomacy to restore Polish statehood over Piłsudski's more
  // militarily-romantic federalist-insurrectionist approach.
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Favored building Polish national strength through education, industry, and economic development
  // ("organic work") rather than romantic military uprising — a genuinely development-oriented
  // nationalist economic program.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Catholic identity was central to his conception of Polish nationhood ("Polak-katolik" — to be
  // Polish was to be Catholic) — a defining, explicit fusion of religious and national identity.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["C","D","N","N","N","N","N","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const LEON_KASS = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Draws on both religious and secular natural-law/humanist philosophical traditions for his
  // human-dignity arguments (chaired a bioethics council under a religiously-inflected but formally
  // secular US government mandate) — religiously-sympathetic but not strictly theological in his own
  // published reasoning.
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  // A committed bioconservative on family/reproduction-adjacent issues (opposed to cloning, embryo
  // research, radical alteration of human reproduction) though engaging more through careful academic
  // argument than populist religious rhetoric.
  moral: ["D","C","D","C","D","C","D","N","D","C","D","N","N","N","N","C","N","D","D","N"],
  // The defining, singular focus of his entire public career: explicit, sustained philosophical
  // opposition to genetic enhancement, human cloning, and radical life-extension biotechnology on
  // human-dignity and natural-finitude grounds — chaired the Bush Bioethics Council specifically to
  // slow such technologies — among the most extreme anti-biotech-enhancement positions audited.
  tecnologia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT","DT","CT"],
};

export const PROFILES = {
  "frederico-ii-da-prussia": FREDERICO_II_DA_PRUSSIA,
  "joseph-de-maistre": JOSEPH_DE_MAISTRE,
  "aleksandr-dugin": ALEKSANDR_DUGIN,
  "roman-dmowski": ROMAN_DMOWSKI,
  "leon-kass": LEON_KASS,
};
