// FQA055 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// luxemburgo: small parliamentary constitutional monarchy hosting core EU institutions (Court of
//   Justice, European Investment Bank), a major global private-banking/investment-fund center, ~47% of
//   residents are foreign nationals, trilingual (Luxembourgish/French/German), legalized same-sex
//   marriage (2014) and euthanasia (2009).
// eua-florida: DeSantis-era conservative US state — no state income tax, aggressive "culture war"
//   legislation (Parental Rights in Education Act, 6-week abortion ban, book-removal laws), hardline
//   E-Verify immigration enforcement, permitless concealed carry since 2023, large Cuban-American
//   conservative community, tourism/retiree-driven economy.
// imperio-do-japao: the 1930s-45 militarist/fascist phase of Imperial Japan — the 1940 Imperial Rule
//   Assistance Association dissolved political parties into a single mobilization body, State Shinto
//   emperor-worship reached its most extreme form, the "Greater East Asia Co-Prosperity Sphere" drove
//   expansionist conquest (Manchukuo, Nanking Massacre, comfort-women system), total-war mobilization
//   and the Tokkō thought police enforced near-total social conformity until the 1945 unconditional surrender.
// imperio-austro-hungaro: 1867-1918 dual monarchy — the Ausgleich compromise created separate Austrian
//   and Hungarian governments sharing only monarch/military/foreign-affairs (a genuinely dualist-
//   federal structure), curial (property-weighted) suffrage systems limited real representation, 11+
//   nationalities' rising nationalist agitation (Czech, Serb, Croat, Romanian) was the direct catalyst
//   for WWI and the empire's 1918 collapse.
// butao: constitutional monarchy since a 2008 voluntary royal democratization, governs by "Gross
//   National Happiness" over GDP, constitutionally mandates 60% permanent forest cover, expelled or
//   drove out an estimated ~100,000 ethnic-Nepali Lhotshampa in the 1990s, only permitted television/
//   internet nationally in 1999, pursues a deliberate high-value-low-volume tourism policy.

const LUXEMBURGO = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // ~47% of residents are foreign nationals (the highest share of any EU state) integrated as a
  // structural pillar of the workforce (many commute daily from France/Belgium/Germany too) — genuine,
  // large-scale multicultural accommodation is close to the country's defining social fact, not a
  // marginal policy debate.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // A tiny military (under 1,000 personnel) hosted within NATO's collective framework — reliant almost
  // entirely on alliance structures rather than any independent capacity, and hosts the EU's own
  // institutions rather than projecting national power.
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // One of the world's largest private-banking and investment-fund centers (assets under management
  // many multiples of GDP) — an intensely private-capital-driven economy by design.
  economia: ["DT","CT","D","CT","DT","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A financial-services economy built explicitly for cross-border capital flow within the EU single
  // market — among the most globalist small economies in Europe.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Legalized same-sex marriage (2014) and voluntary euthanasia (2009), broadly in line with the
  // progressive Benelux social-policy consensus.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // SES (a major global satellite-communications operator) and a deliberate government push toward
  // fintech/space-mining legal frameworks (the 2017 Space Resources Act) reflect a genuinely
  // tech-forward small-state strategy.
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const EUA_FLORIDA = {
  // A strong states-rights posture (DeSantis repeatedly clashed with federal COVID/immigration policy)
  // combined with an unusually assertive state government that overrode Disney's special self-
  // governing district (Reedy Creek) in 2023 — real state power exercised over both federal and local
  // (corporate-quasi-municipal) authority simultaneously.
  estrutura: ["C","D","C","D","C","D","C","D","C","D","C","DT","C","DT","C","D","C","DT","C","DT"],
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  // Permitless concealed carry since 2023, aggressive "Don't Say Gay"/Parental Rights enforcement and
  // book-removal laws in schools, strong law-and-order rhetoric — high on both the liberty (guns) and
  // security (culture-war enforcement) dimensions simultaneously.
  poder: ["C","CT","C","C","C","CT","C","D","D","CT","C","C","D","D","CT","C","C","CT","D","C"],
  // The 2023 E-Verify mandate and state funding for migrant-relocation flights (sending asylum seekers
  // to Martha's Vineyard) reflect a deliberately hardline assimilationist/border-enforcement posture,
  // despite Florida's own large, long-integrated immigrant population (especially Cuban-American).
  imigracao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","C","DT","CT","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // No state income tax, aggressively pro-business/low-regulation branding ("Free State of Florida"),
  // major insurance-market and property-tax fights show real (if often losing) resistance to regulatory
  // solutions in favor of market mechanisms.
  economia: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["D","C","D","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","D","C"],
  // Large, politically influential Evangelical and Catholic populations (plus a strong conservative
  // Cuban-American Catholic community), religious-liberty legislation prominent in state politics.
  religiao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Among the most socially conservative large US states post-Dobbs (6-week abortion ban), the 2022
  // "Parental Rights in Education" law and subsequent book-removal campaigns in schools, restrictions
  // on gender-affirming care for minors.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","C","D","CT","D","CT"],
  // A booming Miami tech/crypto scene alongside major aerospace activity (Cape Canaveral/SpaceX
  // launches), tempered by acute hurricane/sea-level-rise vulnerability that state policy has been
  // reluctant to frame in climate-change terms.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","C","D","D","D","C","D","C","D","C","D"],
};

const IMPERIO_DO_JAPAO = {
  // Total-war mobilization under the Emperor's supreme authority fused with a rigidly centralized
  // military command structure (Imperial General Headquarters) directing every prefecture's economy
  // and manpower toward the war effort.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The 1940 Imperial Rule Assistance Association dissolved all political parties into a single
  // mandatory mobilization body; the 1925 Peace Preservation Law and the Tokkō ("thought police")
  // criminalized any deviation from state ideology — a totalitarian near-elimination of independent
  // political representation.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Maximal wartime security-state coercion: the Tokkō secret police, mandatory conscription, forced
  // labor mobilization, and brutal suppression of any dissent — among the most extreme "poder" readings
  // in this entire project.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The "Greater East Asia Co-Prosperity Sphere" ideology explicitly subordinated conquered peoples
  // (Korea, Manchuria, occupied China, Southeast Asia) to enforced Japanese cultural/linguistic
  // assimilation (name-changing policy in Korea, State Shinto shrine worship mandates).
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Built one of the era's most powerful military machines (the Imperial Japanese Navy briefly rivaled
  // any in the world) explicitly to seize resources and territory by force — maximal militarism.
  diplomacia: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Systematic, sustained territorial conquest (Manchuria 1931, full-scale war with China 1937, Pearl
  // Harbor and Pacific conquest 1941-42) — about as maximally expansionist/interventionist as any state
  // audited in this project.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Total-war command economy: zaibatsu conglomerates were directed by military planning boards, labor
  // and materials were centrally rationed and conscripted for war production.
  economia: ["C","D","C","D","C","DT","C","D","C","D","C","D","C","D","N","D","CT","D","C","D"],
  controle: ["CT","DT","CT","DT","C","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","D","C","D"],
  // Explicit resource-conquest logic (the strategic goal of the Pacific War was securing oil, rubber,
  // and metals cut off by Western embargo) rather than voluntary market trade.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // State Shinto was compulsory and fused emperor-worship directly into governance and daily civic
  // ritual — religion and state authority were not merely allied but doctrinally identical.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Deeply patriarchal, militarist social order (women mobilized into wartime labor/reproduction roles
  // under explicit state ideology, no space for personal-liberty social movements) — maximal
  // traditionalism reinforced coercively.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Genuinely rapid, state-directed industrial/military technology development (naval engineering,
  // aviation, the Zero fighter) explicitly for war production, though ultimately overmatched by Allied
  // industrial capacity.
  tecnologia: ["C","D","C","D","C","D","N","D","N","D","N","D","C","D","N","D","N","D","C","D"],
};

const IMPERIO_AUSTRO_HUNGARO = {
  // The 1867 Ausgleich (Compromise) created genuinely separate Austrian (Cisleithania) and Hungarian
  // (Transleithania) governments and parliaments sharing only the monarch, military, and foreign
  // ministry — a real dualist-federal structure, unusual for a 19th-century European monarchy.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D"],
  // Curial (property/tax-weighted) suffrage systems in both halves of the monarchy sharply limited
  // real representation despite nominal parliaments; the 1907 Austrian reform introduced male universal
  // suffrage but Hungary's system remained far more restrictive throughout.
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // An 11+-nationality empire (Germans, Hungarians, Czechs, Poles, Serbs, Croats, Romanians, Slovaks,
  // Ruthenians, Italians, Slovenes) governed under German/Hungarian administrative dominance, generating
  // sustained nationalist agitation for greater autonomy or independence — the direct structural
  // catalyst for WWI (the June 1914 Sarajevo assassination targeted precisely this fault line).
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","D","D","C","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  economia: ["C","D","C","D","C","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // The Habsburg monarchy maintained Catholicism as the politically dominant, privileged faith
  // ("political Catholicism") even while formally tolerating Protestant and Orthodox minorities within
  // its multi-confessional territories.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Uneven industrialization (Bohemia/Austria proper heavily industrialized, Hungary and the eastern
  // periphery remained largely agrarian) — a real internal technological divide within one state.
  tecnologia: ["N","C","N","C","N","N","N","C","N","N","N","C","C","N","N","N","N","C","N","N"],
};

const BUTAO = {
  // The King voluntarily transferred power to an elected parliament in a 2008 constitutional
  // democratization he himself initiated (a rare top-down, monarch-driven devolution rather than one
  // won through struggle) — real elections now occur, though the monarchy retains major reserved influence.
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  representacao: ["C","C","C","C","D","C","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Expelled or drove into refugee flight an estimated ~100,000 ethnic-Nepali Lhotshampa in the early
  // 1990s under a "One Nation, One People" cultural-assimilation policy (mandatory national dress code,
  // Dzongkha-language requirements) — one of the most severe, explicitly documented forced-assimilation
  // episodes audited among contemporary (non-historical) states in this project, though targeted at one
  // specific minority rather than Imperial Japan's empire-wide, multi-nation assimilation doctrine.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT"],
  // Extremely limited formal diplomatic relations (no formal ties with any UN Security Council
  // permanent member) and deliberately minimal international military engagement.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  // A small state under an informal but deep Indian security guarantee (1949/2007 treaties), avoids any
  // independent power projection whatsoever, historically closed itself off almost entirely from
  // outside entanglement.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // "Gross National Happiness" governance explicitly subordinates GDP growth to state-directed
  // wellbeing/cultural/environmental planning, but the actual productive economy is tiny and
  // hydropower-export-dependent rather than a total-war command economy — a much gentler, welfare-
  // oriented dirigisme than Imperial Japan's wartime mobilization model.
  economia: ["C","D","N","D","C","D","C","C","C","D","C","D","N","D","N","D","C","D","N","N"],
  // Constitutionally mandates a minimum 60% permanent forest cover and tightly regulates tourism (a
  // steep daily "Sustainable Development Fee") — genuinely strong, deliberate state economic/
  // environmental direction.
  controle: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","D","D","C","D","CT","D","C","D"],
  // A deliberate high-value-low-volume tourism policy (steep mandatory daily fees) and heavy dependence
  // on hydropower exports specifically to India (a single-partner reliance, not a total-conquest
  // resource-extraction logic like wartime Japan's) — cautious, managed openness rather than free trade.
  comercio: ["C","D","C","N","C","D","C","N","C","D","CT","N","C","N","N","D","CT","N","C","D"],
  // Vajrayana Buddhism is constitutionally established as the "spiritual heritage" and is deeply fused
  // with national identity, monastic institutions hold real formal political influence.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Deeply traditionalist Buddhist-monarchical social order, though relatively less patriarchal in
  // inheritance customs than many neighbors (matrilineal land inheritance in parts of the country is a
  // genuine, distinguishing cultural fact).
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  // Television and the internet were banned entirely until 1999 — one of the last countries in the
  // world to permit them — reflecting a deliberate, cautious "GNH"-driven wariness of unmediated
  // outside technological/cultural influence, despite recent smartphone-adoption catch-up.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","C","C","D","D","D","C","N","D"],
};

export const PROFILES = {
  "luxemburgo": LUXEMBURGO,
  "eua-florida": EUA_FLORIDA,
  "imperio-do-japao": IMPERIO_DO_JAPAO,
  "imperio-austro-hungaro": IMPERIO_AUSTRO_HUNGARO,
  "butao": BUTAO,
};
