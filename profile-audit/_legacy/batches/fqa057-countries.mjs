// FQA057 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// hungria-de-kadar: 1956-89 "Goulash Communism" — installed after the Soviet Union crushed the 1956
//   uprising, single-party MSZMP rule with no multi-party elections, but the 1968 New Economic
//   Mechanism introduced real market elements (private plots, small business) making Hungary "the
//   happiest barracks in the socialist camp" with the Eastern Bloc's highest consumer living standards.
// chile-de-allende: 1970-73 Unidad Popular — nationalized the copper industry and banks via
//   constitutional/parliamentary means (the "vía chilena al socialismo"), accelerated agrarian reform,
//   kept elections, opposition parties, and a free press largely intact until the 1973 Pinochet coup
//   ended the experiment.
// burkina-faso-de-sankara: 1983-87 — Sankara renamed Upper Volta to Burkina Faso, vaccinated 2.5
//   million children in weeks, planted 10 million trees against desertification, repudiated foreign
//   debt at the OAU ("those who feed you control you"), banned FGM/forced marriage/polygamy, sold the
//   government's Mercedes fleet, and was assassinated in a 1987 coup with alleged French complicity.
// eua-confederados: 1861-65 — 11 states seceded explicitly to preserve slavery (stated as the primary
//   cause in several states' own secession declarations), a radical states'-rights confederal design
//   that nonetheless centralized war powers dramatically via 1862 conscription, an agrarian slave-
//   plantation economy seeking open cotton trade with Europe.
// macau: Chinese Special Administrative Region since the 1999 Portuguese handover — "one country, two
//   systems" with even less political contestation than Hong Kong (no meaningful universal suffrage,
//   pro-Beijing establishment unchallenged), the world's largest gambling/casino revenue center,
//   Portuguese-Catholic colonial heritage still visible architecturally and in the small Macanese community.

const HUNGRIA_DE_KADAR = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A one-party state (MSZMP) with no genuine multi-party electoral competition, though the "goulash"
  // social contract traded political liberalization for consumer prosperity/quiet acquiescence rather
  // than pursuing maximal Stalinist-style mobilization.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // The secret police (successor to the ÁVH) and one-party surveillance apparatus persisted, but Kádár
  // deliberately relaxed the harshest post-1956 repression over time (relatively freer travel, cultural
  // life, and consumer choice than the USSR or East Germany) — real, if bounded, moderation.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Firmly within the Warsaw Pact/Soviet alliance system (Soviet troops remained stationed in Hungary
  // throughout), no independent foreign-policy or military posture of consequence.
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // The 1968 New Economic Mechanism decentralized enterprise decision-making and permitted small
  // private plots/businesses within an overall socialist framework — a genuinely hybridized economy
  // more market-tolerant than most of the Eastern Bloc, though still fundamentally state-planned at the
  // macro level.
  economia: ["C","D","C","D","C","D","C","C","C","D","N","C","C","D","N","D","C","D","C","D"],
  controle: ["CT","D","C","D","C","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // Trade remained overwhelmingly oriented toward COMECON/Soviet-bloc partners rather than global
  // markets — a genuinely closed, bloc-protected trading system despite the domestic market reforms.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // Officially atheist Marxist-Leninist ideology with state monitoring of churches, though pragmatic
  // tolerance of private religious practice grew markedly compared to the harsher 1950s Rákosi era.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const CHILE_DE_ALLENDE = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  // A democratically elected government that deliberately pursued socialism through existing
  // constitutional institutions — kept Congress, opposition parties, courts, and a free (often hostile)
  // press functioning throughout, a genuinely unusual "democratic road to socialism" case right up
  // until the 1973 coup ended it by force.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","D"],
  // Real domestic instability and political violence grew sharply (far-left MIR activity, right-wing
  // paramilitary resistance, a devastating 1972-73 trucking strike) that the state struggled to fully
  // contain, alongside comparatively restrained ordinary policing by regional-crisis standards.
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","D","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Maintained diplomatic relations with Cuba and the USSR (alarming Washington during the Cold War)
  // while officially pursuing a non-aligned foreign posture rather than joining any formal bloc.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Nationalized the "Gran Minería del Cobre" (copper industry, Chile's principal export) and major
  // banks, accelerated agrarian land reform — a decisive, explicit, and rapid shift toward state
  // ownership of the commanding heights of the economy.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  // Introduced comprehensive central economic planning (price controls, production targets) that
  // triggered severe shortages and black markets by 1972-73 — real, aggressive dirigisme, whatever its
  // ultimate economic consequences.
  controle: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","CT","N","CT","DT","CT","DT","CT","DT","CT","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  // Chile remained a historically Catholic-majority society, but the Allende government itself operated
  // as a secular state without pursuing an anti-religious campaign of the Soviet or Sankara-Burkinabè type.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["C","N","C","N","C","D","C","N","C","D","N","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const BURKINA_FASO_DE_SANKARA = {
  // Sankara centralized power dramatically at the national level (Comités de Défense de la Révolution
  // enforced policy down to village level under central direction) while deliberately dismantling
  // traditional/feudal chieftaincy authority structures in the countryside — a real recentralization
  // away from customary local power toward the revolutionary state.
  estrutura: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D","CT"],
  // A revolutionary military-council government with no multi-party elections — but unlike Kádár's
  // top-down bureaucratic one-party rule, Sankara's CDRs (Comités de Défense de la Révolution) were
  // genuinely mass-participatory grassroots bodies at the neighborhood/village level, even while formal
  // electoral representation remained absent.
  representacao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","D","C","C","D","D"],
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  // Explicitly Pan-Africanist rather than assimilationist — promoted local languages and traditional
  // Burkinabè cultural pride against French colonial cultural dominance specifically, a nation-building
  // project centered on reclaiming, not suppressing, indigenous identity.
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  // Built a small People's Militia rather than a large conventional force, and was famously
  // confrontational rhetorically (his OAU debt-repudiation speech) rather than militarily aggressive —
  // low militarism, high moral/rhetorical assertiveness.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  // Explicitly, aggressively anti-imperialist and anti-neocolonial (rejected foreign aid/debt, expelled
  // French cultural influence, supported other African liberation movements) — a defiantly
  // sovereignty-asserting, non-aligned "Nacionalista" posture rather than either quiet neutrality or
  // alliance-embeddedness.
  intervencao: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D"],
  // Unlike Allende's nationalization-of-existing-industry approach, Sankara's economic
  // transformation centered on debt/aid repudiation and land redistribution from customary chiefs to
  // peasant cooperatives specifically, prioritizing food self-sufficiency over any large industrial or
  // banking-sector nationalization (Burkina Faso had little of either to nationalize).
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","D","N","CT","DT","CT","DT","D","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // Deliberately reduced dependence on imports/foreign trade in favor of domestic food self-sufficiency
  // — an explicit, ideologically driven protectionist/self-reliance economic doctrine.
  comercio: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // A secular revolutionary government operating in a religiously mixed (Muslim/Christian/traditional)
  // society, without imposing a state ideology on religious practice directly, though prioritizing
  // revolutionary/national identity over religious identity in public life.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  // Aggressively promoted women's rights (banned FGM, forced marriage, and polygamy by decree,
  // appointed women to cabinet posts, mandated men experience traditionally female labor on a "men's
  // market day") — an exceptionally progressive, deliberately enforced social-transformation agenda for
  // its era and region.
  moral: ["C","D","C","D","C","DT","C","D","C","DT","C","D","C","N","N","D","N","DT","C","D"],
  // Prioritized appropriate/low-cost technology for rural development (well-drilling, basic
  // vaccination-cold-chain logistics, reforestation techniques) over industrial-scale modernization —
  // pragmatic, development-focused rather than high-tech-maximalist.
  tecnologia: ["C","D","N","N","C","N","D","C","N","N","N","N","D","N","D","N","N","C","N","D"],
};

const EUA_CONFEDERADOS = {
  // Explicitly founded on radical states'-rights confederalism (the Confederate Constitution
  // deliberately weakened the central government relative to even the US Articles of Confederation
  // era), though the war itself forced real centralization (the 1862 Conscription Act, government
  // impressment of goods) that many state governors bitterly resisted as a betrayal of the founding
  // states-rights ideology itself.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // A one-party (effectively no formal party system) planter-oligarchy republic with elections limited
  // to a small white male electorate, no meaningful role for the enslaved majority-adjacent population
  // in several states, suspended habeas corpus and conscripted dissenters as the war ground on.
  representacao: ["C","C","C","C","D","D","C","C","D","D","C","D","D","C","D","D","D","D","C","D"],
  // A slave society maintained by extensive, brutal coercive control (slave patrols, fugitive-recapture
  // laws) alongside wartime martial law and conscription enforcement — maximal domestic coercion by design.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Founded explicitly to preserve a racial-caste slave society (several states' secession
  // declarations name slavery preservation as the primary cause) — the most extreme, explicitly
  // codified assimilation/exclusion-based social hierarchy audited in this entire project.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Fought a defensive war on its own territory without any expansionist ambition beyond its own
  // claimed borders, seeking European (especially British) diplomatic recognition rather than conquest.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // An overwhelmingly agrarian, slave-plantation economy with minimal industrial base (a major
  // structural weakness against the industrialized Union) and explicit hostility to protective tariffs
  // that had favored Northern manufacturing.
  economia: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A minimal-state plantation aristocracy with essentially no regulatory apparatus at all (beyond
  // slave-patrol enforcement) — a rawer, pre-industrial economic laissez-faire than Macau's modern
  // licensed-casino-concession regulatory model.
  controle: ["D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C"],
  // Sought to break the Union's tariff regime and trade cotton freely and directly with European
  // markets (especially Britain and France) — a single-staple-crop export economy seeking market access,
  // a fundamentally different globalism from Macau's tourism/gaming-concession model.
  comercio: ["DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Explicitly framed itself in devout Christian nationalist terms ("Deo Vindice" as the national
  // motto, slavery itself was defended in explicitly biblical terms by its political and religious
  // leadership) — religion was deeply, deliberately fused with the state's founding ideology.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // A rigidly patriarchal, racially hierarchical social order defended in explicitly traditionalist and
  // religious terms — the most extreme traditionalist profile audited among contemporary-era political
  // entities in this project.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // An agrarian economy with a comparatively small industrial/technological base relative to the Union
  // — a genuine, decisive material weakness of the Confederate war effort.
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","D","N","D","N","D","N","N","D"],
};

const MACAU = {
  // A Special Administrative Region under "one country, two systems," retaining its own legal/economic
  // system but with final authority resting in Beijing — real local administrative continuity
  // (Portuguese-derived civil-law system preserved) without genuine political sovereignty.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","D","C","D","D"],
  // The Chief Executive is chosen by a small Beijing-vetted committee and the Legislative Assembly is
  // only partly directly elected — even less political contestation or opposition space than Hong
  // Kong, with essentially no organized pro-democracy movement of consequence.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // Extremely low ordinary crime (the casino industry itself is tightly regulated/licensed by the
  // government) alongside real political-speech constraints under the national-security framework
  // extended from Beijing, though daily life is not heavily securitized in the way Hong Kong became
  // post-2020.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Extremely low taxation and a hyper-open economy built almost entirely around licensed casino
  // concessions and mainland tourism — one of the most laissez-faire, market-driven small economies
  // audited, despite its politically unfree status.
  economia: ["DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The world's largest gambling-revenue center (surpassing Las Vegas), deeply dependent on and open to
  // mainland Chinese tourism flows and foreign casino-operator capital — a maximally globalist
  // tourism/gaming trade posture.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // Portuguese Catholic colonial heritage remains visible (historic churches, a small Macanese
  // Catholic community) alongside a majority Buddhist/folk-religion Chinese population — a genuinely
  // syncretic, low-state-imposition religious landscape.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // A socially conservative Chinese-Catholic-heritage population coexists with an adult
  // entertainment/gambling-industry economy operating alongside it — a genuinely split, compartmentalized
  // moral profile (conservative family norms, permissive commercial vice industry).
  moral: ["C","N","C","N","C","D","C","N","C","D","N","D","N","N","N","D","N","N","N","N"],
  // A modern, wealthy casino-resort economy with significant digital-payments and hospitality-tech
  // investment, though not an independent innovation hub of its own.
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

export const PROFILES = {
  "hungria-de-kadar": HUNGRIA_DE_KADAR,
  "chile-de-allende": CHILE_DE_ALLENDE,
  "burkina-faso-de-sankara": BURKINA_FASO_DE_SANKARA,
  "eua-confederados": EUA_CONFEDERADOS,
  "macau": MACAU,
};
