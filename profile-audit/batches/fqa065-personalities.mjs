// FQA065 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// lee-kuan-yew: founded modern Singapore's "Asian values" authoritarian capitalism — extremely open,
//   low-tax, foreign-investment-friendly free market combined with a dominant-party state (PAP),
//   systematic legal suppression of opposition via defamation suits, caning as corporal punishment,
//   and colonial-era anti-gay laws retained until after his death.
// putin: built Russia's "power vertical" (crushed elected regional governorships in 2004), state
//   capitalism concentrating strategic industries (Gazprom, oil) under Kremlin-aligned control,
//   imprisoned/killed political opponents (Navalny), annexed Crimea (2014) and launched the full-scale
//   invasion of Ukraine (2022), partnered with the Russian Orthodox Church on "traditional values"
//   rhetoric against Western liberalism.
// richard-spencer: coined "alt-right," advocates a white-ethnostate "peaceful ethnic cleansing" —
//   explicitly white-nationalist and supremacist, organized largely through internet media, widely
//   repudiated across the political spectrum.
// steve-bannon: architect of Trump-era "economic nationalism" against "globalist elites" —
//   protectionist trade policy, nativist immigration restrictionism framed in civilizational/Judeo-
//   Christian terms, built Breitbart News, actively organizes transnational right-wing populist
//   movements across Europe and the US.
// nick-land: founded accelerationism (push capitalism/technology to their logical extreme to
//   destabilize and transcend current social structures) and the neoreactionary "Dark Enlightenment"
//   (explicitly anti-democratic, favors "exit" over "voice" — polycentric corporate/technocratic
//   micro-sovereignties replacing the nation-state, influenced by Curtis Yarvin/Moldbug).

const LEE_KUAN_YEW = {
  // A small unitary city-state with no internal federal subdivisions of consequence — power
  // concentrated in a highly centralized, technocratically efficient national government.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The PAP has won every election since 1959 through a mix of genuine popularity, gerrymandered
  // Group Representation Constituencies, and systematic defamation lawsuits that bankrupted opposition
  // figures — elections are held, but the playing field is deliberately, legally tilted.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // Retained caning as corporal punishment for vandalism and other offenses, extensive libel/
  // defamation law used against critics, strict social-order laws (chewing-gum ban, harsh drug
  // penalties including mandatory death sentences for trafficking) — a genuinely severe, if
  // low-corruption and low-violent-crime, security state.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // Managed multiracial "meritocratic" integration explicitly (ethnic quotas in public housing to
  // prevent enclave formation) alongside a genuinely assimilationist expectation that all groups adopt
  // a shared civic-national Singaporean identity and (increasingly) English as the working language.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Pursued a deliberately pragmatic, small-state balancing strategy between the US and China rather
  // than either alliance-embeddedness or non-aligned isolation — avoided both major-power confrontation
  // and unilateral regional ambition.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Built one of the world's most open, foreign-investment-friendly free-market economies (low
  // corporate tax, minimal capital controls, a global financial hub) alongside significant state-linked
  // enterprises (Temasek, GIC sovereign funds) — genuinely mixed but market-forward.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A deliberately globalist trading and financial-hub economy (Singapore's entire growth strategy
  // rests on openness to foreign trade/investment) with essentially no protectionist instinct.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // Managed religious harmony actively as state policy (the Maintenance of Religious Harmony Act)
  // across a genuinely multi-religious population (Buddhist, Muslim, Christian, Hindu, Taoist) rather
  // than either establishing or suppressing any single faith.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Retained the colonial-era Section 377A criminalizing gay sex until after his death (repealed 2022),
  // strict censorship of media/pornography, socially conservative "Asian values" family rhetoric.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Deliberately built Singapore's tech/infrastructure base from a resource-poor port town into a
  // global electronics/finance/biotech hub through sustained state investment in education and
  // technology policy — a genuinely tech-forward development strategy.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const PUTIN = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Ended direct election of regional governors in 2004 (replaced with Kremlin appointment/confirmation,
  // partially restored later but under tight central vetting), systematically eliminated genuine
  // opposition through imprisonment (Navalny), exile, or death — elections held but outcomes tightly managed.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Alexei Navalny's poisoning, imprisonment, and 2024 death in an Arctic penal colony; the FSB's
  // extensive domestic surveillance and suppression of independent media/protest — extensive,
  // well-documented state coercion of political dissent.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Promotes "Russian World" (Russkiy Mir) ideology asserting cultural/linguistic dominance over
  // Russian-speaking populations in neighboring states, alongside restrictive domestic minority-
  // language and religious-minority policies within Russia itself.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Rebuilt Russian military power explicitly to project force (Georgia 2008, Crimea 2014, Syria 2015,
  // full-scale Ukraine invasion 2022) — a decisively militarist geopolitical posture.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Annexed Crimea and launched the full invasion of Ukraine explicitly to assert regional hegemony and
  // reverse post-Soviet territorial "losses" — among the most direct, sustained acts of interstate
  // territorial aggression audited among contemporary (non-historical) figures in this project.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // "State capitalism": renationalized or brought under Kremlin-aligned oligarch control the major
  // strategic industries (Gazprom, Rosneft) while retaining a broader nominally market economy for
  // smaller enterprises — genuinely mixed, tilted toward strategic state control.
  economia: ["C","D","C","D","C","D","C","C","C","D","N","C","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Post-2022 Western sanctions forced a real, dramatic pivot toward trade with China/the "Global
  // South" and import-substitution self-reliance — a genuinely more protectionist/isolated trade
  // posture than pre-invasion Russia's deeper integration with European energy markets.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Formed an explicit state partnership with the Russian Orthodox Church (Patriarch Kirill blessed
  // the Ukraine invasion), promoting "traditional values" as an ideological counter to Western
  // liberalism — genuine, deliberate religious-political alliance.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // The 2013 "gay propaganda" law and subsequent expansion of anti-LGBT legislation, explicit
  // "traditional family values" state rhetoric positioned against Western social liberalism.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Pursues military and nuclear technology modernization aggressively while civilian tech sectors
  // have been badly damaged by sanctions and brain-drain emigration since 2022.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

const RICHARD_SPENCER = {
  // Advocates a strong, racially-defined ethnostate — favors centralized national authority capable of
  // enforcing demographic homogeneity over any localist/federalist arrangement that might preserve
  // diverse regional populations.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // Advocates a strong state explicitly empowered to enforce racial/demographic policy ("peaceful
  // ethnic cleansing") — real, if not fully specified in operational detail, coercive state authority
  // over population composition.
  poder: ["CT","D","C","D","CT","D","C","D","D","CT","CT","D","N","D","CT","D","CT","D","CT","D"],
  // The explicit, defining, maximal position of his entire public career: an ethnically homogeneous
  // white "ethnostate," achieved through what he has termed "peaceful ethnic cleansing" — among the
  // most extreme documented positions on this axis in the entire project.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Frames his project as fundamentally about internal racial-demographic transformation of Western
  // nations rather than external military conquest — his primary interventionist energy is directed
  // domestically (immigration/demographics), not toward foreign territorial ambition.
  intervencao: ["C","D","C","D","C","D","N","C","D","D","C","D","C","D","C","D","D","C","D","D"],
  // Economic policy is secondary to identity in his platform, expressing some sympathy for a strong
  // state managing "his people's" economic interests without a fully developed alternative economic
  // program — moderate, identity-subordinated economic nationalism.
  economia: ["C","D","N","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","N","N"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","C","N","D","C","D"],
  // Favors protecting what he frames as Western/white economic and cultural interests from global
  // integration seen as demographically dissolving — genuinely protectionist framing tied to identity
  // rather than conventional industrial-policy economics.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","N"],
  // Expresses sympathy for a racialized, "European heritage"-coded Christian/pagan cultural identity
  // more than orthodox institutional religious practice — religion instrumentalized for identity rather
  // than devotional in itself.
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Explicitly patriarchal, anti-feminist, and hostile to LGBT rights as part of a broader "traditional
  // Western civilization" identitarian framework — one of the most extreme traditionalist positions
  // audited among contemporary figures.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // The alt-right movement he helped popularize organized and recruited overwhelmingly through internet
  // media/forums — genuinely tech-savvy in movement-building method, though without a substantive
  // technology policy platform of its own.
  tecnologia: ["C","D","C","N","N","N","N","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const STEVE_BANNON = {
  // Champions "economic nationalism" and national sovereignty explicitly against transnational
  // institutions (EU, WTO) and "globalist" governance — favors strong national-level authority,
  // skeptical of both supranational bodies and internal administrative-state bureaucracy ("deconstruction
  // of the administrative state").
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  // Frames immigration restriction in explicitly civilizational/cultural-Christian terms ("Judeo-
  // Christian West") rather than Spencer's biological-racial framing — nativist and assimilationist,
  // but pitched as cultural/religious preservation rather than racial ethnostate-building.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Actively organizes and funds transnational right-wing populist movements across Europe (courting
  // Le Pen, Orbán-aligned figures, Italian and Brazilian populists) — genuinely interventionist in
  // spreading his political project internationally, despite "America First" domestic rhetoric.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // "Economic nationalism" explicitly rejects free-trade globalism in favor of protecting domestic
  // industry and labor from offshoring/globalization — tariffs and trade-war rhetoric as central policy.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Explicit protectionism against China and globalized supply chains is a centerpiece of his
  // "economic nationalism" — trade policy as the core mechanism of his entire political project.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // A practicing traditionalist Catholic who explicitly invokes "Judeo-Christian civilization"
  // rhetoric as the foundation of Western identity worth defending against secular-globalist elites.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  moral: ["DT","CT","DT","C","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const NICK_LAND = {
  // "Patchwork" theory explicitly envisions the nation-state dissolving into thousands of competing,
  // radically autonomous micro-sovereignties/corporate city-states ("exit" over "voice") — one of the
  // most extreme decentralization visions audited, going well beyond conventional federalism.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The "Dark Enlightenment" explicitly rejects democratic legitimacy itself ("the Cathedral" critique
  // of egalitarian democratic ideology), favoring technocratic/corporate-sovereign governance instead —
  // among the most explicitly anti-democratic positions audited in this project.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Favors "exit" (competitive jurisdictional choice) over centralized coercive enforcement — a
  // genuinely libertarian-adjacent, low-domestic-security-apparatus vision, since patchwork
  // micro-sovereignties compete for residents rather than coercively holding a captive population.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  // Neoreactionary "patchwork" sovereignties are explicitly conceived as exclusive, self-selecting
  // jurisdictions free to set their own entry/exit criteria — closed by design where their governing
  // logic demands it, though framed as market-like self-selection rather than ethnic assimilationism per se.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C"],
  // Accelerationism explicitly champions radical, unregulated capitalism as a self-organizing,
  // intelligence-generating process to be accelerated rather than tempered — among the most extreme
  // pro-market, anti-planning economic positions audited in this project.
  economia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT"],
  // Explicitly hostile to regulation as an impediment to the generative "hypercapitalist" chaos he
  // believes drives technological/social evolution forward — minimal state economic direction by doctrine.
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // An explicitly atheist, materialist philosopher whose accelerationism treats technological/
  // capitalist processes themselves as the closest thing to a transcendent force, displacing
  // traditional religion entirely.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Explicitly rejects egalitarian moral frameworks in favor of new hierarchies determined by
  // capability/intelligence — an amoral-technocratic rather than conventionally traditionalist stance,
  // genuinely distinct from religious-traditionalist conservatism.
  moral: ["N","N","D","C","N","D","N","N","N","D","D","D","N","N","C","D","N","D","D","N"],
  // Technological acceleration to its logical extreme (embracing AI, biotechnology, and machine
  // intelligence as the vehicle of a coming post-human transition) is the absolute center of his entire
  // philosophical project — among the most maximal pro-technology positions audited.
  tecnologia: ["CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
};

export const PROFILES = {
  "lee-kuan-yew": LEE_KUAN_YEW,
  "putin": PUTIN,
  "richard-spencer": RICHARD_SPENCER,
  "steve-bannon": STEVE_BANNON,
  "nick-land": NICK_LAND,
};
