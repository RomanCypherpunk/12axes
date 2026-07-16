// FQA060 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// islandia: contemporary parliamentary republic — home to the world's oldest parliament (the Althing,
//   930 AD), maintains no standing army at all (only a coast guard) despite NATO membership, highest
//   gender-equality rankings globally, elected the world's first popularly-elected female head of state
//   (1980), suffered a catastrophic 2008 banking-system collapse.
// finlandia: contemporary parliamentary republic — shaped by the 1939-40 Winter War resistance and
//   decades of Cold War "Finlandization" neutrality, joined NATO only in 2023 after Russia's invasion
//   of Ukraine ended that non-alignment, maintains a comprehensive conscription-based "total defense"
//   doctrine with a large reserve force relative to its population.
// imperio-mongol: founded by Genghis Khan (r. 1206-27), became history's largest contiguous land
//   empire — devastating conquest campaigns (city-destroying massacres for resisting cities) alongside
//   pragmatic religious tolerance across the conquered realm, the Yam postal-relay system and enforced
//   trade-route security enabled the flourishing Pax Mongolica Silk Road commerce, governed mostly
//   through light-footprint tribute/vassalage rather than dense permanent bureaucracy.
// brasil-regime-militar: 1964-85 — censorship intensified sharply after the 1968 AI-5 decree, DOI-CODI
//   torture/repression targeted dissidents, state-led "economic miracle" developmentalism (Transamazônica
//   highway, Itaipu dam, a nuclear program) combined with import-substitution market-reserve
//   protectionism (the computer-industry "reserva de mercado" law), moralistic conservative social policy.
// mexico-de-cardenas: 1934-40 — the 1938 oil expropriation (creating Pemex by nationalizing mostly
//   US/British oil firms) was a landmark anti-imperialist act, the most extensive ejido agrarian land
//   redistribution of any Mexican president, incorporated labor and peasant sectors directly into the
//   ruling party's corporatist structure, welcomed Spanish Civil War Republican refugees.

const ISLANDIA = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  // Home to the Althing (930 AD), among the oldest continuously-referenced parliamentary institutions
  // in the world in its modern form since 1844 — an exceptionally strong democratic self-image and
  // genuinely high institutional trust by international survey rankings.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Maintains literally no standing army — only a small coast guard — despite founding NATO membership
  // (1949), relying entirely on allied collective defense; among the most demilitarized sovereign
  // states in the world by hard capability.
  diplomacia: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The catastrophic 2008 collapse of its hyper-leveraged private banking sector (Kaupthing, Landsbanki,
  // Glitnir, which had grown to ~10x GDP through aggressive 2000s deregulation) forced the state to
  // nationalize the entire banking system overnight and impose capital controls until 2017 — a far more
  // dramatic, crisis-driven swing between deregulation and state control than Finland's steadier
  // welfare-capitalist trajectory.
  economia: ["C","D","C","D","D","D","C","C","C","D","N","C","C","D","N","D","C","D","CT","D"],
  // Imposed strict capital controls (2008-2017) restricting money leaving the country after the crash —
  // a real, extreme, if temporary, state intervention unlike anything in Finland's more stable
  // regulatory history.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","CT","DT","C","DT"],
  // A small fishing/tourism/aluminum-smelting economy uniquely exposed by its tiny, over-leveraged
  // banking sector's 2008 collapse — trade openness coexists with a documented history of acute
  // financial-sector fragility distinct from Finland's Nokia-diversified tech-export model.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","N"],
  // Among the most secular societies in the world by practice despite a nominal Lutheran state-church
  // affiliation (formally disestablished ties loosened further in recent constitutional reform
  // discussions).
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Elected the world's first popularly-elected female head of state (Vigdís Finnbogadóttir, 1980),
  // consistently ranks #1 globally on the Gender Gap Index, broadly progressive on LGBT rights and
  // family policy.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Geothermal/hydroelectric energy powers a genuinely advanced green-tech and data-center industry,
  // alongside strong fisheries-management science.
  tecnologia: ["C","D","C","N","C","D","N","C","N","D","C","D","C","D","C","D","N","D","C","D"],
};

const FINLANDIA = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // The 1939-40 Winter War against a vastly larger Soviet invasion force forged a deep, lasting
  // "total defense" strategic culture (universal male conscription, one of Europe's largest reserve
  // forces relative to population) — real, historically-grounded, not merely nominal militarization.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Abandoned decades of Cold War-era "Finlandization" neutrality by joining NATO in 2023, directly in
  // response to Russia's 2022 invasion of Ukraine — a decisive, historic reversal of its
  // non-interventionist non-alignment doctrine.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A Nordic welfare-state economy (Nokia's rise and diversification legacy, strong public education/
  // healthcare investment) blending private-sector dynamism with substantial state social spending.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A nominal Evangelical Lutheran state church persists, but actual religious practice/belief is
  // very low by international comparison, and church-state formal ties have loosened over recent decades.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // World-leading PISA education rankings and a deep engineering/tech culture (the Nokia legacy seeded
  // a broad startup ecosystem — Supercell, Rovio) — genuinely technology-forward by deliberate national
  // strategy.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

const IMPERIO_MONGOL = {
  // Ruled through a loose confederation of vassal khanates and tribute-paying local elites rather than
  // dense centralized bureaucracy — governance was deliberately light-footprint, delegating day-to-day
  // administration to conquered local rulers/officials under Mongol overlordship.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // An absolute khanate confirmed through a khuriltai (assembly of Mongol nobles/generals) rather than
  // popular election — real elite consultative input in choosing the Great Khan, but no representation
  // whatsoever for the vastly larger conquered/subject populations.
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // Resisting cities faced deliberate, systematic massacre (Baghdad 1258, Merv, Nishapur) as a calculated
  // policy to terrorize future opponents into surrender without a fight — among history's most
  // extreme, deliberately weaponized coercive-violence doctrines.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Pragmatic religious/cultural tolerance across the conquered realm (Nestorian Christians, Buddhists,
  // Muslims, and shamanists all served in the Mongol administration and military) rather than forced
  // cultural assimilation — conquered peoples' local customs and religions were generally left intact
  // so long as tribute and loyalty were rendered.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Built the era's most feared and effective military machine (composite-bow cavalry, sophisticated
  // siege-engine adoption from conquered Chinese/Persian engineers) explicitly to conquer and subjugate.
  diplomacia: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","DT","CT","D"],
  // Sustained the most extensive campaign of territorial conquest in world history (from Korea to
  // Hungary within a few generations) — maximal expansionism by any measure.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // A tribute-based economy extracting wealth from conquered agrarian/urban populations rather than
  // any productive economic model of its own, though it also actively facilitated (and taxed) the
  // enormous Silk Road trade flows the "Pax Mongolica" enabled.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Deliberately secured and policed the Silk Road trade routes across an entire continent (the Yam
  // postal-relay system doubled as route security) by state military fiat rather than institutional
  // market openness — a conquest-enforced trade-facilitation model, not a voluntary open-economy policy.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Shamanism was the Mongols' own traditional faith, but state policy deliberately and consistently
  // patronized multiple religions simultaneously (funding Buddhist, Christian, and Muslim institutions
  // alike) as a matter of pragmatic imperial administration rather than doctrinal conviction.
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // A nomadic steppe warrior society with its own distinct gender/family customs (Mongol women held
  // comparatively more property and social latitude than settled contemporaries) — genuinely different
  // from, not simply "traditional" by, the standards of the agrarian societies it conquered.
  moral: ["N","C","N","N","N","D","N","N","N","D","N","N","D","N","N","D","N","D","N","N"],
  // Rapidly absorbed and deployed conquered civilizations' technology (Chinese gunpowder weapons and
  // siege engineering, Persian astronomy) rather than originating much of its own — a highly effective
  // technology-adopting, not technology-inventing, military machine.
  tecnologia: ["C","D","N","N","N","N","D","N","DT","N","N","N","D","DT","N","N","D","N","N","D"],
};

const BRASIL_REGIME_MILITAR = {
  // A federal republic on paper, but the 1969 constitutional amendments and Institutional Acts (AI-5
  // especially) let the federal executive intervene directly in states, suspend elected officials'
  // mandates, and appoint state governors of the largest states directly — real, severe recentralization.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Indirect presidential elections via an electoral college the regime controlled, Congress
  // periodically closed (1968-69 recess under AI-5), two officially sanctioned parties (ARENA/MDB)
  // replacing genuine multi-party competition — a tightly managed, non-competitive system with a thin
  // electoral veneer.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // The DOI-CODI apparatus systematically tortured and disappeared political dissidents, especially
  // after AI-5 (1968); press censorship was extensive and formalized — a severe, well-documented
  // security-state coercion campaign.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Fought no external wars but maintained a large, modernizing military and pursued an ambitious
  // (later-abandoned-for-civilian-oversight) nuclear-technology program — a security-focused,
  // moderately assertive regional posture without actual conflict engagement.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","D","D","C","DT","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // "Milagre econômico" state-led developmentalism: massive public infrastructure investment
  // (Itaipu, Transamazônica), expanded state enterprises (Petrobras, Eletrobras growth), alongside real
  // private-sector industrial growth under state direction and heavy foreign borrowing.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  controle: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","CT","D","C","D"],
  // The "reserva de mercado" informatics law (1984) explicitly banned foreign computer imports/
  // investment to nurture a protected domestic tech industry — deliberate, aggressive
  // import-substitution protectionism as a matter of stated national-security doctrine.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Explicitly moralistic conservative social policy (censorship of "subversive" art/behavior,
  // traditional-family propaganda) enforced alongside the broader political repression apparatus.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Founded Embraer (aerospace) and pursued an independent nuclear program alongside major
  // infrastructure/computing investment — genuine state-driven strategic-technology ambition, distinct
  // from more purely military-repressive regimes.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","D"],
};

const MEXICO_DE_CARDENAS = {
  // A federal republic in constitutional form, though the ruling party (PNR, reorganized as the PRM in
  // 1938) dominated state and local politics so thoroughly that federalism functioned more as
  // administrative delegation within one-party rule than genuine multi-power-center governance.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","C","D"],
  // Regular elections occurred but within an essentially single-dominant-party system (the PRM's
  // corporatist sectoral structure channeled political participation through party-controlled labor/
  // peasant/military/popular sectors rather than open multi-party competition).
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Welcomed thousands of Spanish Civil War Republican refugees (intellectuals, professionals) as an
  // explicit act of anti-fascist international solidarity — genuine, deliberate openness distinct from
  // the era's more common restrictive immigration postures.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The 1938 oil expropriation was a landmark, explicitly anti-imperialist assertion of economic
  // sovereignty against foreign (mostly US/British) corporate interests, defying threatened
  // retaliation — a defining act of nationalist economic self-assertion.
  intervencao: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D"],
  // Nationalized the oil industry (creating Pemex) and undertook the most extensive agrarian land
  // redistribution (ejido communal grants) of any Mexican president — a decisive, deliberate shift of
  // the economy's commanding heights toward state and collective ownership.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  // Incorporated organized labor and the peasantry directly into the ruling party's formal corporatist
  // structure (the CTM labor confederation, the CNC peasant confederation) — deliberate, comprehensive
  // state direction of both economic sectors and their political representation simultaneously.
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // The oil-nationalization confrontation with foreign companies triggered a real boycott/trade
  // retaliation from international oil markets, pushing Mexico toward more self-reliant, protected
  // domestic economic development in the immediate aftermath.
  comercio: ["CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // Pursued a "socialist education" secularizing reform (Article 3 amendment, 1934) reducing Church
  // influence over schooling, continuing tension from the 1920s Cristero War era, though pursued more
  // gradually/pragmatically than his predecessors' harsher anti-clerical campaigns.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["C","N","C","N","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Agrarian-reform priorities (land redistribution, rural education/literacy campaigns) took clear
  // precedence over industrial-technology investment during this presidency.
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

export const PROFILES = {
  "islandia": ISLANDIA,
  "finlandia": FINLANDIA,
  "imperio-mongol": IMPERIO_MONGOL,
  "brasil-regime-militar": BRASIL_REGIME_MILITAR,
  "mexico-de-cardenas": MEXICO_DE_CARDENAS,
};
