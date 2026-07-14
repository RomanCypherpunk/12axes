// FQA047 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// ucrania-territorio-livre: Makhnovshchina / Free Territory (1918-1921), anarchist peasant-worker
//   federation in southern Ukraine led by Nestor Makhno. Historical entity — uses the "spirit of the
//   question" interpretive method for anachronistic items (per FQA041+ convention) and the anarchist
//   controle-axis exception (score by collectivized-economic-coordination spirit, not literal state
//   agency — same treatment as Aragão-Catalunha and Rojava).
// brasil-era-vargas: Brazil 1930-1945 (Provisional Govt + Estado Novo dictatorship 1937-45) under
//   Getúlio Vargas — centralizing interventors replacing state governors, corporatist labor law (CLT),
//   import-substitution industrialization, Congress closed 1937-45, DIP press censorship.
// tchequia: contemporary Czech Republic — unitary state w/ regional self-government, parliamentary
//   democracy, EU/NATO member, among the most irreligious countries on Earth, liberal-ish gun/drug laws
//   by EU standards, open trade economy.
// eua-california: contemporary US state — sanctuary-state immigration policy, strict gun control, high
//   regulation/taxation, tech-hub economy, very secular/progressive on social issues.
// eua-texas: contemporary US state — strong states-rights posture, permissive gun laws, low
//   tax/regulation, border-security hawk, Bible-belt-adjacent religiosity, socially conservative,
//   oil/gas economy.

const UCRANIA_TERRITORIO_LIVRE = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["C","D","C","D","N","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","CT","DT"],
  poder: ["D","CT","DT","CT","DT","CT","D","C","DT","CT","N","C","N","C","D","CT","DT","C","DT","CT"],
  imigracao: ["D","C","DT","C","DT","C","DT","C","DT","C","D","C","D","C","D","C","DT","C","DT","C"],
  diplomacia: ["N","C","D","C","C","C","N","C","DT","C","C","D","N","C","N","C","D","DT","C","D"],
  intervencao: ["CT","DT","C","D","CT","DT","N","D","D","DT","CT","DT","CT","DT","C","N","N","D","C","N"],
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","DT","C","DT","C","DT","C","DT","C","D","N","N","D","DT","C","DT","N","N","C","DT"],
  comercio: ["C","DT","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["CT","DT","CT","DT","C","D","C","DT","C","D","C","DT","C","D","C","DT","C","DT","CT","DT"],
  moral: ["C","D","C","D","C","D","C","N","C","D","C","D","C","N","N","D","C","D","C","D"],
  tecnologia: ["N","C","D","N","N","C","D","C","DT","N","D","C","D","C","D","C","D","C","D","C"],
};

const BRASIL_ERA_VARGAS = {
  // Estado Novo (1937-45): governors replaced by federally appointed "interventores"; states stripped
  // of autonomy; Congress and state assemblies dissolved.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Estado Novo: no elections 1937-45, press censored by DIP, Constitution of 1937 ("Polaca") granted
  // Vargas near-total power; earlier 1930-37 phase somewhat more open but trending authoritarian.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // Political police (DOPS) repression of communists/integralistas, censorship, but not a maximal
  // security state on ordinary crime; strong on political control specifically.
  poder: ["C","D","C","D","C","N","CT","D","C","D","C","D","N","D","C","D","CT","D","CT","D"],
  // "Whitening"/European immigration incentives coexisted with strong nationalist assimilationism
  // (banned foreign-language schools/press for immigrant colonies, 1938 nationalization campaign).
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","C","D","C","D"],
  // Vargas kept Brazil neutral for most of the era, joined WWII late (1942) on Allied side after
  // pressure; built up Volta Redonda steel partly for military-industrial capacity but not militarist.
  diplomacia: ["C","C","D","C","C","C","D","C","C","C","C","N","C","N","N","C","D","DT","C","N"],
  // Pragmatic "equidistant" diplomacy between US and Germany until 1942, non-expansionist,
  // South American regional influence via economic leverage more than force.
  intervencao: ["C","D","D","C","C","C","D","C","N","C","N","C","C","D","C","D","C","C","D","D"],
  // Created state enterprises (CSN/Volta Redonda 1941, precursors to Petrobras), corporatist labor
  // law, but did not expropriate private industry wholesale — mixed economy tilted public.
  economia: ["D","C","C","D","D","DT","C","C","C","D","D","C","C","D","N","D","C","D","C","D"],
  // Corporatist state: price/wage controls, obligatory unions (sindicatos), National Steel Plan,
  // heavy dirigisme — one of the most controle-heavy governments in Brazilian history.
  controle: ["CT","DT","D","D","C","D","C","D","C","D","C","N","C","D","C","D","C","D","C","D"],
  // Import-substitution industrialization, high tariffs to build national industry, "Marcha para o
  // Oeste" self-sufficiency rhetoric.
  comercio: ["CT","DT","C","D","C","D","C","DT","C","D","CT","D","C","D","CT","D","C","D","CT","D"],
  // Church-state rapprochement after 1930 (unlike the 1891 secular constitution), religious education
  // reinstated in public schools 1931, but state remained formally secular/instrumental about religion.
  religiao: ["C","C","C","D","D","C","C","D","C","C","D","C","D","C","D","C","D","D","C","C"],
  // Deeply patriarchal, traditional-family corporatist social order; no space for the era's social
  // liberalism; women's suffrage granted 1932 but broader social conservatism dominant.
  moral: ["D","C","D","C","N","C","D","N","D","C","D","C","D","C","N","D","D","C","D","C"],
  // Industrialization drive (steel, energy) was a centerpiece, "Marcha para o Oeste" land expansion.
  tecnologia: ["C","D","N","N","N","D","D","C","D","N","D","C","D","N","D","C","N","D","N","D"],
};

const TCHEQUIA = {
  // Unitary state with 13 self-governing regions (kraje) since 2000 — real but modest devolution,
  // no serious federalist tradition (unlike Germany or Switzerland).
  estrutura: ["N","C","C","C","D","C","N","C","D","C","N","D","D","C","D","C","N","D","N","D"],
  // Stable parliamentary democracy since 1993 velvet divorce, strong Constitutional Court, free press,
  // occasional populist rhetoric (Zeman/Babiš) but no serious democratic backsliding.
  representacao: ["CT","D","CT","N","C","D","CT","D","C","DT","C","D","D","N","CT","DT","D","D","CT","DT"],
  // EU-average policing; Czechia decriminalized marijuana possession (2010) and has comparatively
  // liberal gun-ownership laws (constitutional right to bear arms added 2021, rare in EU).
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","N","D","C"],
  // Czech nationalism runs moderate-assimilationist; wary of large-scale Muslim immigration
  // (rejected EU refugee quotas 2015-16) but accepted large Ukrainian/Slovak/Vietnamese communities
  // integrating into Czech life.
  imigracao: ["C","D","C","N","C","D","C","N","C","N","C","N","N","D","C","N","D","D","C","D"],
  // Small NATO member, modest defense spending historically below 2% until Ukraine war prompted
  // increases; not militarist, favors alliance-based deterrence over unilateral action.
  diplomacia: ["N","C","D","C","N","C","D","C","D","C","N","C","N","C","D","C","D","D","N","C"],
  // Firmly Atlantacist/pro-NATO, strong supporter of Ukraine post-2022 (arms supplier), engaged
  // multilaterally via EU rather than unilateral regional leadership ambitions.
  intervencao: ["C","C","D","D","D","C","D","C","C","D","D","C","C","C","D","D","D","C","D","C"],
  // Post-1989 rapid privatization (voucher privatization under Klaus), market economy, though retains
  // public healthcare and some state utilities.
  economia: ["D","C","D","C","D","D","D","C","D","C","D","C","D","D","D","C","D","C","D","C"],
  // Fairly light-touch economic management for a European state — flat-ish tax historically, market-
  // liberal Klaus legacy still influential, independent central bank (ČNB).
  controle: ["D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C"],
  // Deep integration into EU single market and German industrial supply chains (auto parts, Škoda);
  // small open economy highly dependent on exports — globalism dominates over protectionism.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C"],
  // Czechia is routinely ranked among the world's most atheist/agnostic societies (majority non-
  // religious since communist-era secularization, unlike neighboring Poland/Slovakia).
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","CT","DT"],
  // Moderately progressive on personal-liberty issues (legal registered partnerships since 2006,
  // liberal abortion access since communist era) but more conservative than Western Europe on
  // full marriage equality (achieved 2024) and gender-identity politics.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Strong engineering/industrial tradition (automotive, nuclear power expansion at Dukovany/Temelín),
  // pragmatic pro-nuclear energy stance, not a nature-romanticist culture.
  tecnologia: ["C","D","C","D","C","N","N","N","N","N","D","N","D","N","C","N","N","N","C","D"],
};

const EUA_CALIFORNIA = {
  // Strong "state's rights" posture against federal immigration/environmental enforcement (sanctuary
  // state, own emissions waiver under Clean Air Act), but simultaneously imposes uniform statewide
  // mandates on localities (housing law overriding local zoning, statewide minimum wage).
  estrutura: ["C","D","C","D","C","D","C","D","D","D","D","C","C","D","D","C","D","D","C","D"],
  // Robust democratic institutions, referendum/initiative culture (direct democracy heritage from
  // Progressive Era), aggressive recall provisions (recalled Gray Davis 2003).
  representacao: ["CT","DT","CT","D","C","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","D","DT","CT","DT"],
  // Strict gun control (assault weapons ban, waiting periods), progressive on drugs (legal cannabis),
  // strong digital-privacy law (CCPA) but also aggressive on surveillance for public-safety causes.
  poder: ["N","CT","N","CT","N","CT","N","C","CT","D","N","CT","C","C","DT","C","N","C","D","C"],
  // Sanctuary-state law (SB 54) limits cooperation with federal immigration enforcement; large
  // immigrant population seen as economic asset; multicultural/multilingual public policy norm.
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Not a defense-policy actor as a state; population skews toward diplomacy-over-force framing
  // nationally (large anti-war/tech-pacifist constituencies), though hosts major defense contractors.
  diplomacia: ["D","C","D","C","N","C","D","C","D","C","D","C","N","C","D","C","D","C","D","C"],
  // Politically among the most non-interventionist-leaning US electorates (large progressive/tech
  // constituencies skeptical of foreign wars), though defense industry presence complicates this.
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // High taxation, extensive regulation, large public university/healthcare-subsidy systems, strong
  // labor protections — most "public-sector-oriented" large US state economy.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // High minimum wage, aggressive environmental/labor regulation, progressive taxation on high
  // earners, strong tenant protections — high controle relative to other US states.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  // Deeply globalized economy (Pacific trade gateway, Hollywood/tech exports), generally favors open
  // trade though supports "buy American" content-quota style rules in some contexts.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Among the least religious US states, large secular/unaffiliated and religiously diverse population,
  // strict church-state separation norms in public institutions.
  religiao: ["CT","DT","CT","DT","C","D","CT","DT","CT","D","C","DT","C","D","C","DT","C","DT","CT","DT"],
  // National leader in LGBT rights, abortion-rights protection (post-Dobbs sanctuary), cannabis/sex-
  // work-adjacent decriminalization debates, progressive social-issue trendsetter.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Silicon Valley/AI hub, aggressive EV mandates, but also strong environmental-precaution culture
  // (CEQA, coastal protection) creating real tension between tech-max and nature-preservation impulses.
  tecnologia: ["CT","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const EUA_TEXAS = {
  // Strongest states-rights identity of any major US state (10th Amendment invoked constantly,
  // border-wall/immigration-enforcement standoffs with federal government, own electric grid ERCOT
  // deliberately isolated from federal interstate regulation).
  estrutura: ["CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","DT","C","D","C","DT","CT","DT"],
  // Functioning democracy but with notable restrictive-voting-law trend (voter-ID, redistricting
  // fights) and a strong "strong governor/lt. governor" executive culture.
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  // Very permissive gun laws (permitless open/concealed carry since 2021), leads the nation in
  // executions, strong law-and-order/border-security enforcement culture.
  poder: ["CT","D","C","C","CT","D","C","D","D","CT","CT","D","D","D","CT","C","C","D","CT","C"],
  // Aggressive border-security posture (Operation Lone Star, state-funded wall segments), strong
  // assimilationist rhetoric despite large long-standing Hispanic population integrated into state
  // identity ("Texan" as unifying identity over separate cultural enclaves).
  imigracao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","C","DT","CT","DT"],
  // Home to massive defense/energy infrastructure, strong military-culture identity (many bases,
  // veteran population), hawkish political culture generally.
  diplomacia: ["CT","D","C","D","CT","D","C","D","C","D","C","N","C","D","C","D","C","DT","CT","D"],
  // Politically hawkish electorate favoring firm assertion of national/state interest, skeptical of
  // international bodies constraining US action, historically favors robust regional posture.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // No state income tax, minimal regulation, right-to-work state, oil/gas free-market-oriented
  // economy — one of the most economically "private"-leaning large US states.
  economia: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Minimal business regulation, no state minimum wage above federal floor, deregulated electricity
  // market (ERCOT), strong low-tax-low-regulation identity.
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  // Major export hub (oil, petrochemicals, tech via Austin), generally free-trade-oriented business
  // culture though supportive of protecting domestic energy production from external pressure.
  comercio: ["D","C","D","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","D","C"],
  // Bible Belt-adjacent, high church attendance, strong evangelical/Southern Baptist political
  // influence, religious-liberty legislation prominent (though large secular urban centers exist too).
  religiao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Among the most socially conservative large US states post-Dobbs (near-total abortion ban), strong
  // traditional-family legislative agenda, restrictions on gender-affirming care for minors.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","C","D","CT","D","CT"],
  // Major energy state (oil/gas dominant identity) alongside a booming tech sector (Austin, SpaceX
  // Starbase), pragmatic pro-growth industrial posture rather than nature-romanticism.
  tecnologia: ["C","D","C","D","C","D","N","D","C","N","C","D","D","D","C","D","C","D","C","D"],
};

export const PROFILES = {
  "ucrania-territorio-livre": UCRANIA_TERRITORIO_LIVRE,
  "brasil-era-vargas": BRASIL_ERA_VARGAS,
  "tchequia": TCHEQUIA,
  "eua-california": EUA_CALIFORNIA,
  "eua-texas": EUA_TEXAS,
};
