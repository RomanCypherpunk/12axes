// FQA084 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// ezra-heywood: American individualist anarchist (publisher of "The Word") who advocated free love
//   (opposing state-sanctioned marriage as a property arrangement over women) and women's sexual/
//   economic emancipation, was imprisoned multiple times under the Comstock anti-obscenity laws for
//   publishing free-love and birth-control literature, part of the Boston individualist-anarchist
//   circle alongside Tucker.
// randolph-bourne: American essayist whose "War Is the Health of the State" (1918) argued war
//   empowers state centralization and conformity at the expense of individual liberty and dissent — a
//   fierce critic of WWI and Wilson's war mobilization who also championed "trans-national America," an
//   early cosmopolitan-pluralist vision explicitly rejecting forced "melting pot" assimilation.
// peter-maurin: French-American Catholic activist who co-founded the Catholic Worker Movement with
//   Dorothy Day (1933) — advocated voluntary poverty, "houses of hospitality," agrarian communes, and
//   distributism (widely distributed property ownership as an alternative to both concentrated
//   capitalism and state socialism), grounded in Catholic social teaching.
// lysander-spooner: American lawyer and individualist anarchist — "No Treason: The Constitution of No
//   Authority" argued the US Constitution binds no one who never explicitly consented to it, ran a
//   private mail company explicitly to challenge the US Postal Service's legal monopoly, and wrote
//   influential natural-rights-grounded abolitionist arguments against slavery.
// macron: French president (2017-) whose centrist "Renaissance" movement was explicitly positioned to
//   transcend the traditional left-right divide — pro-market labor/tax reforms combined with strong
//   pro-EU federalist "European sovereignty" advocacy, a controversial pension-age reform, and
//   technocratic reformist governing style.

const EZRA_HEYWOOD = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Was imprisoned multiple times under the Comstock anti-obscenity laws for publishing free-love and
  // birth-control literature — a direct, personal victim of state coercion against his own free-speech
  // and sexual-liberty advocacy, not merely a theorist of anti-statism in the abstract.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Part of the Boston individualist-anarchist circle sharing Tucker's critique of state-enforced
  // monopolies (especially the "money monopoly") as the source of unjust concentrated wealth — a
  // free-market anti-capitalism distinct from collectivist anarchism.
  economia: ["D","C","D","C","C","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Explicitly advocated "free love" against state-sanctioned marriage's treatment of women as
  // property, and championed women's full sexual and economic emancipation as inseparable from
  // economic liberty — among the most radically libertine, gender-egalitarian moral philosophies of
  // his 19th-century American context.
  moral: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","C","DT","CT","DT","CT","DT"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const RANDOLPH_BOURNE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // "War is the health of the state" — argued state coercive power expands dramatically during wartime
  // mobilization at the direct expense of individual liberty and dissent, a foundational
  // anti-militarist critique of state coercion specifically tied to war.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  // "Trans-national America" explicitly championed cosmopolitan cultural pluralism, rejecting forced
  // "melting pot" assimilation in favor of immigrants contributing genuinely diverse cultural threads
  // to a federated trans-national identity — an early, deliberately articulated multiculturalist vision.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Fiercely opposed US entry into and mobilization for WWI, viewing it as a betrayal of progressive
  // ideals in service of state-power expansion — the defining act of his short public life.
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // "War is the health of the state" is precisely a maximal non-interventionist thesis — war and
  // military mobilization are themselves the mechanism of state coercive growth to be resisted at all costs.
  intervencao: ["CT","DT","CT","DT","CT","DT","C","DT","CT","DT","C","DT","CT","DT","C","DT","C","DT","CT","DT"],
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Championed cultural pluralism and personal liberty against wartime conformity pressure — a
  // genuinely progressive civil-liberties moral vision centered on dissent's legitimacy.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const PETER_MAURIN = {
  // Founded a decentralized network of autonomous "houses of hospitality" and agrarian communes rather
  // than any centralized institutional structure — a genuinely localist, communally self-organizing vision.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // A committed pacifist deeply skeptical of nationalist militarism, favoring charitable direct action
  // and personal moral witness over state power or military force of any kind.
  diplomacia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Distributism — grounded in Catholic social teaching (Rerum Novarum) — favored widely distributed
  // small-scale property ownership (agrarian communes, worker cooperatives) as an explicit alternative
  // to both concentrated capitalism and state socialism, neither pure market nor pure collectivism.
  economia: ["C","C","D","C","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Favored voluntary poverty and mutual-aid community organization over both state welfare bureaucracy
  // and unregulated capitalism — real, deliberate communal economic direction achieved voluntarily
  // rather than imposed by state planning.
  controle: ["C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","C","N","N","C","D"],
  comercio: ["C","D","C","D","CT","D","C","D","C","D","C","D","C","D","CT","D","C","D","C","D"],
  // Devout Catholic activism grounded directly in Church social teaching — religion was the explicit,
  // foundational motivation for his entire social-justice project, not incidental to it.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  // A traditionalist Catholic on personal moral matters (family, sexuality) even while radically
  // progressive on economic justice and voluntary poverty — a genuinely split, not uniformly
  // progressive or conservative, moral profile.
  moral: ["D","C","D","N","D","C","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["D","C","D","C","D","D","N","D","DT","D","D","C","C","C","D","D","D","C","N","D"],
};

const LYSANDER_SPOONER = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // "No Treason: The Constitution of No Authority" explicitly argued the US Constitution binds no one
  // who never personally, explicitly consented to it — a foundational consent-based critique
  // questioning the very legitimacy of representative constitutional government itself.
  representacao: ["C","DT","CT","D","D","DT","C","D","CT","DT","CT","DT","D","D","C","DT","CT","DT","C","D"],
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  economia: ["D","C","D","C","C","D","C","C","D","D","D","C","D","D","C","D","D","C","N","C"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  // Personally founded a private mail-delivery company (the American Letter Mail Company) explicitly
  // to legally challenge the US Postal Service's government monopoly — a rare figure who translated
  // free-market anti-monopoly theory directly into concrete commercial/legal practice.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  // Wrote influential natural-rights-grounded abolitionist arguments against slavery ("The
  // Unconstitutionality of Slavery"), applying his consent-based legal theory to the era's defining
  // moral question — genuinely progressive on the central human-rights issue of his time.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const MACRON = {
  // A centralized French Fifth Republic president (a strong executive tradition), though pursued
  // European federalist integration ("European sovereignty") as a supranational counterweight,
  // reflecting a genuinely dual-level, not simply centralizing, structural politics.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","D"],
  // A democratically elected reformist president governing through France's established institutions,
  // though the controversial use of Article 49.3 (bypassing a parliamentary vote) to force through
  // pension reform drew real criticism as a democratic-legitimacy shortcut.
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","N","C","D","C","D","N","D","N","D","D","D","C","D"],
  // A committed pro-EU-integration Atlanticist, though has also pushed for European "strategic
  // autonomy" from excessive US dependence — genuinely engaged multilateral diplomacy rather than
  // isolationism or unilateral militarism.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","D","C","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Pro-market labor-law liberalization and corporate tax cuts, though within a still substantially
  // large French public sector and welfare state — a genuinely centrist, not radically laissez-faire,
  // economic reform program.
  economia: ["D","C","D","C","D","D","C","C","D","D","C","D","D","D","C","D","D","C","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  // A strong advocate of EU single-market integration and deeper European economic union — genuinely
  // pro-globalist trade posture within the European framework.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Championed a "startup nation" innovation agenda and significant investment in AI/tech development
  // as central to French economic competitiveness.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "ezra-heywood": EZRA_HEYWOOD,
  "randolph-bourne": RANDOLPH_BOURNE,
  "peter-maurin": PETER_MAURIN,
  "lysander-spooner": LYSANDER_SPOONER,
  "macron": MACRON,
};
