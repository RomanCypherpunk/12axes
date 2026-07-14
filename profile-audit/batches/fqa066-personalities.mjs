// FQA066 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// hendrik-verwoerd: "architect of apartheid" — systematized comprehensive racial segregation into law
//   (Group Areas Act, Bantu Education Act, pass laws, forced relocation to "Bantustan" homelands),
//   banned interracial marriage, banned the ANC, theologically justified apartheid via Dutch Reformed
//   Church Afrikaner nationalism, withdrew South Africa from the Commonwealth (1961), assassinated 1966.
// irving-kristol: "godfather of neoconservatism" — a former Trotskyist who turned rightward, fused
//   free-market economics with social traditionalism and an assertively interventionist Cold War (and
//   later democracy-promotion) foreign policy, believed markets require moral/cultural underpinning
//   ("two cheers for capitalism") rather than pure libertarianism.
// louis-xiv: the absolutist "Sun King" — "L'état, c'est moi," centralized power by relocating the
//   nobility to Versailles to neutralize regional autonomy, revoked the Edict of Nantes (1685, ending
//   Huguenot Protestant toleration and forcing conversion/exile), pursued Colbertist state-directed
//   mercantilism and repeated wars of territorial expansion that ultimately overextended French finances.
// salazar: led Portugal's Estado Novo (1932-1968) — Catholic corporatist authoritarianism that
//   deliberately kept Portugal rural/underdeveloped and demobilized (low-key PIDE secret-police
//   repression rather than mass spectacle), fought colonial wars in Angola/Mozambique/Guinea-Bissau
//   into the 1970s refusing decolonization, stayed formally neutral in WWII.
// viktor-orban: Hungarian PM who self-describes his project as "illiberal democracy" — packed courts
//   and media with loyalists, gerrymandered the electoral system to entrench Fidesz, built a border
//   fence against the 2015 migrant crisis, remains a formal EU/NATO member while asserting
//   sovereigntist resistance to EU rule-of-law and migration policy.

const HENDRIK_VERWOERD = {
  // Centralized authority explicitly to impose a uniform national racial-legal system, while also
  // creating nominally "independent" ethnic homelands (Bantustans) as a device to strip Black South
  // Africans of citizenship — a coercive, purpose-built territorial fragmentation rather than genuine
  // federalism.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","CT","D","C","D","C","DT","C"],
  // Ruled through an all-white electorate excluding the Black majority entirely from any political
  // representation, banned the ANC and other opposition organizations — among the most extreme
  // representation-denial systems audited in this project.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Pass laws, banning orders, and detention without trial enforced the apartheid system with
  // extensive, systematic state coercion against the Black majority population.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The Group Areas Act, Bantu Education Act, forced removals into ethnic "homelands," and a legal ban
  // on interracial marriage represent among the most extreme, comprehensively codified racial-
  // segregation systems in modern history — the defining, singular achievement of his political career.
  imigracao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Withdrew South Africa from the Commonwealth (1961) rather than face growing international
  // criticism of apartheid — a defensive, sovereignty-asserting retreat rather than active foreign
  // military expansionism.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  // Directed extensive state machinery toward enforcing and administering the apartheid system itself
  // (pass-law bureaucracy, forced-removal logistics) — a state deeply, coercively interventionist in
  // controlling where people could live and work, organized around racial administration specifically.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Apartheid was explicitly theologically justified by the Dutch Reformed Church's Afrikaner
  // nationalist theology, which framed racial separation as divinely ordained — religion deeply fused
  // with the ideological legitimation of the state's core project.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // Banned interracial marriage and sexual relationships by law (Immorality Act, Prohibition of Mixed
  // Marriages Act) as central pillars of the apartheid system — an extreme, legally codified
  // traditionalist-racialist social order.
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","C","N","N","N","D","N","N","D"],
};

const IRVING_KRISTOL = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed defender of American constitutional democracy and its institutions, valuing
  // electoral legitimacy while also expressing intellectual skepticism of unchecked populism/mass
  // egalitarian leveling — genuinely pro-democratic-institution, if culturally conservative.
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Championed an assertively interventionist US foreign policy throughout the Cold War and into the
  // post-Cold-War era (his intellectual circle's "democracy promotion" doctrine directly shaped the
  // neoconservative case for the Iraq War) — a defining, explicit pillar of neoconservatism.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Explicitly rejected non-interventionism as naive isolationism — believed American power should be
  // actively projected abroad to promote democracy and confront authoritarian/communist threats.
  intervencao: ["DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT","DT","CT"],
  // "Two cheers for capitalism" — a genuine, deliberate qualification of pure free-market libertarianism,
  // believing markets needed moral/cultural underpinning and some welfare-state elements to remain
  // socially sustainable, rather than laissez-faire absolutism.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","N","C","D","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A secular American Jew who was not personally devout but explicitly valued religion's social
  // function in sustaining bourgeois moral order and civic virtue — instrumentally pro-religion rather
  // than devotionally religious himself.
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  // A committed cultural traditionalist critical of the 1960s counterculture and New Left, believing
  // social/moral order needed defending against radical cultural change, though less extreme than the
  // outright authoritarian traditionalists in this batch.
  moral: ["D","C","D","C","D","C","D","N","D","C","D","C","D","N","N","C","N","C","D","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const LOUIS_XIV = {
  // "L'état, c'est moi" — the defining act of his reign was relocating the nobility to Versailles
  // specifically to strip regional aristocratic power centers of independent authority, achieving one
  // of history's most successful deliberate centralization projects.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Absolute divine-right monarchy with no representative assembly convened during most of his reign
  // (the Estates-General did not meet from 1614 until 1789) — sovereignty resided entirely in the
  // person of the king.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Pursued repeated wars of territorial expansion (Dutch War, War of the Spanish Succession, War of
  // the League of Augsburg) that ultimately overextended French finances — sustained, deliberate
  // military assertion of dynastic and territorial ambition.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Colbertist mercantilism directed the state to actively build domestic manufacturing (royal
  // manufactories for tapestries, glass, luxury goods) and protect it via tariffs — deliberate,
  // sustained state economic direction rather than laissez-faire.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  // Colbert's mercantilist doctrine explicitly sought to minimize imports and maximize exports through
  // tariffs and state-chartered trading companies — deliberate, textbook protectionism.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Revoked the Edict of Nantes (1685), ending decades of Protestant Huguenot toleration and forcing
  // mass conversion or exile — one of the most consequential state religious-intolerance acts of the
  // early-modern era, explicitly fusing "one king, one law, one faith" as state doctrine.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Founded and patronized the Royal Academy of Sciences (1666) and funded major engineering projects
  // (the Canal du Midi, Versailles' elaborate hydraulic systems) as prestige projects, though this
  // predates the Enlightenment's full scientific flowering.
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","D","N","N","N","D","N","N","D"],
};

const SALAZAR = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Banned all political parties except the regime's own National Union, ruled through a corporate
  // (non-elected, sector-based) chamber rather than genuine parliamentary competition — no meaningful
  // electoral accountability for nearly four decades.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The PIDE secret police enforced censorship and suppressed dissent through targeted, low-visibility
  // repression (imprisonment, torture of specific opponents) rather than the mass-spectacle violence of
  // Nazi/Soviet totalitarianism — severe and systematic, but deliberately less publicly demonstrative.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Fought sustained colonial wars in Angola, Mozambique, and Guinea-Bissau from 1961 into the 1970s,
  // refusing decolonization even as other European empires withdrew — a deliberate, costly, prolonged
  // imperial-retention military commitment, though he kept Portugal formally neutral in WWII itself.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Deliberately pursued fiscal austerity and slow, controlled economic development to preserve
  // traditional rural Catholic social order rather than rapid industrialization — a genuinely
  // conservative-corporatist economic caution, distinct from Mussolini's more dynamic industrial corporatism.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  // Deliberately kept Portugal's economy relatively closed and colonial-trade-oriented rather than
  // integrating into wider European economic development — isolation as explicit policy, not mere
  // backwardness.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // A devout Catholic (briefly trained for the priesthood) who built the Estado Novo explicitly on
  // Catholic corporatist social doctrine, maintaining close church-state alignment throughout his rule.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Deliberately resisted industrial/technological modernization to preserve a traditional rural
  // social order — "orgulhosamente sós" (proudly alone) isolationism extended to technological
  // development itself, among the most anti-modernization stances of any 20th-century leader audited.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","D","C","D","D","D","C","N","D"],
};

const VIKTOR_ORBAN = {
  // Rewrote Hungary's constitution (2011) and gerrymandered electoral districts to entrench Fidesz
  // dominance, while formally retaining Hungary's status as an EU member state with nominal regional/
  // municipal self-government — real central-government power concentration within an outwardly
  // still-federal-adjacent EU structure.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Self-describes his project as "illiberal democracy" — elections are held and opposition parties
  // exist (distinguishing him from outright dictators like Verwoerd or Louis XIV), but captured media,
  // gerrymandering, and judicial packing have made genuine alternation in power extremely difficult.
  representacao: ["C","C","C","C","D","C","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  // Packed courts and media regulatory bodies with loyalists and used state resources against
  // independent press/NGOs, though without the mass detention/violence apparatus of the more extreme
  // authoritarians in this batch — real but comparatively bureaucratic-institutional coercion.
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  // Built a border fence and adopted explicitly hardline anti-migrant rhetoric during the 2015
  // European migrant crisis, framing Hungary's Christian national identity as under demographic threat
  // — a defining, deliberately assimilationist/exclusionary policy centerpiece.
  imigracao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Asserts national sovereignty against EU integration on migration/social policy specifically while
  // remaining a formal NATO/EU member — a real, deliberate sovereigntist friction, though stopping
  // short of Putin-level rupture with the West.
  intervencao: ["C","D","C","D","C","D","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // A moderately dirigiste economic nationalism: windfall taxes on foreign-owned banks/retailers/energy
  // firms alongside selective courting of favored foreign investors (especially Chinese EV/battery
  // manufacturers) — real, if inconsistent, state economic direction.
  economia: ["C","D","C","D","D","D","C","C","C","D","N","C","C","D","N","D","C","D","N","N"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["C","C","D","C","C","C","C","C","C","C","C","C","C","C","N","C","C","C","D","C"],
  // Explicitly champions "Christian democracy" and Hungary's Christian national identity as central to
  // his political project, positioning it against secular EU liberalism.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // Restricted LGBT rights (banning "promotion" of homosexuality/gender-identity content to minors,
  // 2021) and promotes explicit pronatalist "family policy" (tax breaks for large families) as core
  // planks of his conservative-Christian program.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["C","D","C","N","C","N","N","C","N","N","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "hendrik-verwoerd": HENDRIK_VERWOERD,
  "irving-kristol": IRVING_KRISTOL,
  "louis-xiv": LOUIS_XIV,
  "salazar": SALAZAR,
  "viktor-orban": VIKTOR_ORBAN,
};
