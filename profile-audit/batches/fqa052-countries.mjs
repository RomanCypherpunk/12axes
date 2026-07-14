// FQA052 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// paquistao: genuinely federal since the 2010 18th Amendment devolved major powers to the 4 provinces,
//   but a "hybrid regime" where the military (via ISI/army chief) has repeatedly shaped or removed
//   civilian governments (2022 Imran Khan ouster, contested 2024 election), constitutionally an
//   Islamic Republic with harsh blasphemy-law enforcement, nuclear-armed, IMF-bailout-dependent economy.
// filipinas: unitary presidential republic with one genuine autonomous exception (Bangsamoro region,
//   2019), political-dynasty-dominated democracy, ~80% Catholic with no divorce law and near-total
//   abortion ban, Duterte-era drug war killed thousands extrajudicially, US Mutual Defense Treaty ally
//   amid South China Sea disputes with China.
// tailandia: constitutional monarchy with frequent military coups (last 2014, current
//   military-appointed Senate legacy), among the world's harshest lese-majeste laws (severe prison
//   terms for criticizing the monarchy), ~95% Buddhist with religion fused to national/royal identity,
//   tourism-dependent open economy, the only Southeast Asian state never colonized.
// malasia: federal elective constitutional monarchy (Yang di-Pertuan Agong rotates among 9 state
//   sultans) — genuine federalism among 13 states, Islam is the official religion with constitutionally
//   entrenched Bumiputera (ethnic-Malay) affirmative-action preferences amid a large Chinese/Indian
//   minority population, state-directed industrial economy (Petronas, Mahathir-era policy legacy).
// taiwan: vibrant multi-party liberal democracy, global semiconductor leader (TSMC), diplomatically
//   isolated (recognized by few states) yet maintains a deliberate status-quo ambiguity toward China
//   rather than seeking formal independence, first in Asia to legalize same-sex marriage (2019).

const PAQUISTAO = {
  // The 2010 18th Constitutional Amendment devolved health, education, agriculture, and more to the 4
  // provinces — a genuine, documented federalization, not merely nominal.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A textbook civilian-military "hybrid regime": elections are held and contested, but the army/ISI
  // has repeatedly engineered outcomes directly against elected leaders — ousting PM Imran Khan via a
  // 2022 no-confidence vote widely seen as military-orchestrated, then allegedly manipulating the 2024
  // election against his party — a pattern of removing/installing specific civilian leaders, distinct
  // from Thailand's monarchy-centered constraint on the political system as a whole.
  representacao: ["C","CT","C","D","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","D","D","CT"],
  // Blasphemy-law convictions can carry the death penalty and have triggered vigilante mob killings of
  // the accused; extensive military/intelligence (ISI) domestic surveillance and enforced
  // disappearances of journalists/activists are well documented — a harsher, more violent security
  // apparatus than Thailand's comparatively narrower (if still severe) lese-majeste-focused repression.
  poder: ["CT","D","CT","D","CT","D","CT","DT","D","CT","CT","D","C","D","CT","DT","CT","D","CT","DT"],
  // Constitutionally an Islamic Republic with Urdu/Islamic-identity nation-building historically
  // prioritized over regional/ethnic identities (Punjabi, Sindhi, Pashtun, Baloch), fueling recurring
  // separatist tension (Balochistan insurgency).
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Nuclear-armed with a security posture built substantially around deterring India, significant
  // domestic counter-terrorism operations against the TTP.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Chronic IMF-bailout dependency (24+ programs since independence), significant state-owned-
  // enterprise losses (PIA, Pakistan Steel), heavy agricultural-sector state involvement.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Constitutionally the Islamic Republic of Pakistan; blasphemy law (Section 295-C) carries a
  // mandatory death sentence; Ahmadis are constitutionally barred from self-identifying as Muslim.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Homosexuality criminalized under colonial-era law, extremely low female labor-force participation,
  // honor-killing persists despite legal reform, strict religious-conservative social order.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const FILIPINAS = {
  // Unitary republic with the one genuine exception of the Bangsamoro Autonomous Region in Muslim
  // Mindanao (2019 organic law, its own parliament and budget) — a real but geographically narrow
  // devolution within an otherwise centralized state; local government units otherwise have
  // meaningfully more fiscal autonomy than Thailand's provinces under the 1991 Local Government Code.
  estrutura: ["C","D","C","D","D","C","D","C","N","C","C","D","D","C","C","D","N","C","D","D"],
  // Regular, competitive presidential elections since 1986, but politics is dominated by a small number
  // of entrenched political-dynasty families controlling most local and national offices across generations.
  representacao: ["C","D","C","C","C","D","C","C","C","D","C","D","D","C","C","D","D","D","C","D"],
  // Duterte's 2016-22 "war on drugs" killed an estimated 6,000-30,000 people extrajudicially (subject of
  // an ongoing ICC investigation) — one of the most severe documented state-violence campaigns audited
  // in this project outside outright authoritarian states.
  poder: ["CT","C","CT","C","CT","C","CT","D","D","CT","CT","C","CT","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","C","D","C","N","C","C","C","N","C","C","C","N","C","N","D","D","D","D","N"],
  // US Mutual Defense Treaty ally with expanded EDCA base access, amid escalating but still lower-
  // intensity South China Sea (West Philippine Sea) confrontations — coast-guard water-cannon
  // skirmishes rather than the near-daily military air/naval incursions Taiwan faces directly.
  diplomacia: ["C","C","D","C","C","C","D","C","C","D","C","N","C","N","C","C","D","D","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Heavily remittance-dependent economy (OFWs — overseas Filipino workers — send home ~9% of GDP)
  // rather than a tourism/monarchy-business-holding model like Thailand's; significant privatization
  // since the 1990s, though a protectionist constitutional cap on foreign land/utility ownership
  // persisted until recent liberalizing amendments.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","C","C"],
  // No Petronas-style state industrial champion and comparatively lighter direct market intervention
  // than Malaysia's Bumiputera-linked equity/procurement quotas — a more purely remittance/services-
  // market-driven economy with weaker regulatory-state capacity.
  controle: ["D","C","D","C","C","D","D","C","C","D","D","C","DT","D","C","C","D","D","N","C"],
  comercio: ["C","C","D","C","C","C","C","C","C","C","C","C","C","C","N","C","C","C","D","C"],
  // ~80% Catholic, with divorce still illegal (one of only two jurisdictions in the world, alongside the
  // Vatican) and abortion fully criminalized without exception — a single-dominant-church model of
  // religious influence over the state, distinct from Malaysia's dual Sharia/civil-court structure.
  religiao: ["D","C","D","CT","D","C","D","CT","D","D","D","CT","D","CT","D","C","D","CT","D","D"],
  // No-divorce and near-total abortion ban reflect deep Catholic-conservative social law, though a
  // 2023 SOGIE anti-discrimination push and a visible LGBT-rights movement show real, if incomplete,
  // liberalizing pressure.
  moral: ["C","C","N","C","N","D","C","D","D","C","N","D","N","N","N","D","N","D","N","D"],
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const TAILANDIA = {
  // The 76 provinces are run by governors appointed from Bangkok's Ministry of Interior (only Bangkok
  // itself elects its governor) — a genuinely more centralized administrative structure than the
  // Philippines' elected-mayor/governor local-government system.
  estrutura: ["D","C","D","C","DT","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // The military has staged 13 successful coups since 1932 (most recently 2014); the current
  // constitution's military-appointed Senate co-selected the Prime Minister until 2024 reforms reduced
  // (but did not eliminate) that role.
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // Article 112 lese-majeste law criminalizes any perceived insult to the monarchy with sentences of
  // 3-15 years per count (some defendants sentenced to decades via multiple counts) — among the
  // harshest speech-restriction regimes of any nominal democracy in the world.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // ASEAN founding member with a historically pragmatic, non-aligned "bending with the wind" diplomatic
  // tradition (the only Southeast Asian state never colonized) — a treaty-adjacent US partner (Manila
  // Pact) that nonetheless leans more openly toward Beijing economically/militarily than Malaysia's
  // more evenly-hedged posture.
  diplomacia: ["C","C","D","C","N","C","D","C","D","C","N","N","C","N","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Tourism (pre-pandemic ~20% of GDP) and export manufacturing anchor a genuinely open, market-driven
  // economy, though the monarchy and military retain major direct business holdings (Crown Property
  // Bureau, army-linked conglomerates).
  economia: ["D","C","D","C","D","D","C","C","C","D","N","C","C","D","N","D","D","C","N","C"],
  // The monarchy and army retain large direct business holdings (Crown Property Bureau, army-linked
  // conglomerates) but there is no Petronas-style state oil major or Bumiputera-style equity-quota
  // regime — a more market-driven economy than Malaysia's, with royal/military capture rather than
  // ethnic-preference dirigisme as its main state-economic feature.
  controle: ["D","C","D","C","C","D","C","D","C","D","D","C","N","D","C","C","D","D","N","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Buddhism (~95% of the population) is constitutionally required to be professed by the monarch and
  // is deeply fused with national and royal identity, distinct from Malaysia's parallel-Sharia-court
  // system or the Philippines' Catholic-Church-lobbying model — religion and nationalism are close to
  // inseparable in Thai public life via the monarchy specifically.
  religiao: ["D","CT","D","CT","C","D","D","CT","D","D","D","CT","D","C","D","C","D","CT","D","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const MALASIA = {
  // A genuine federation of 13 states with a unique rotating elective monarchy (Yang di-Pertuan Agong,
  // chosen every 5 years among 9 hereditary state sultans) — East Malaysian states (Sabah, Sarawak)
  // additionally hold special autonomy protections under the 1963 Malaysia Agreement.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Competitive multi-party elections produced a historic 2018 opposition electoral victory (ending 61
  // years of Barisan Nasional rule) — genuine electoral turnover — but the Sedition Act and restrictions
  // on press/assembly persist, and race/religion-based political mobilization is deeply entrenched.
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["C","C","C","C","C","C","C","D","D","C","C","C","N","C","D","D","C","C","D","C"],
  // The constitutionally entrenched Bumiputera (ethnic-Malay) affirmative-action system (New Economic
  // Policy since 1971) privileges the Malay-Muslim majority explicitly over the large Chinese and
  // Indian minorities in university admissions, civil-service hiring, and business equity quotas — a
  // uniquely codified assimilation-adjacent ethnic-preference system rather than either pure
  // assimilation or celebrated multiculturalism.
  imigracao: ["C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Petronas (fully state-owned oil major) anchors substantial state economic weight, alongside
  // Mahathir-era state-directed industrial policy (heavy-industry national champions) — a genuinely
  // state-guided-capitalism model, more dirigiste than most ASEAN peers.
  economia: ["C","D","C","D","D","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Deeply trade-dependent open economy (electronics/semiconductor exports, palm oil), ASEAN and
  // RCEP/CPTPP member, generally globalist despite the domestic Bumiputera-preference system.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Islam is the official federal religion, Sharia courts operate in parallel to civil courts for
  // Muslim personal-status matters, apostasy from Islam is legally restricted in several states.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // Homosexuality criminalized (retained colonial-era sodomy law, with state-level Sharia enactments
  // adding further penalties), conservative on gender/family issues, though the large secular Chinese/
  // Indian minority population creates real, if politically muted, social pluralism.
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  // Strong electronics/semiconductor-assembly export sector (Penang's "Silicon Valley of the East")
  // alongside continued significant palm-oil agricultural export identity.
  tecnologia: ["C","D","C","N","C","N","N","N","N","N","N","N","D","N","C","N","N","N","C","N"],
};

const TAIWAN = {
  // A unitary state (the old ROC provincial layer was effectively frozen/streamlined out in the
  // 1990s-2000s reforms), but the 6 special municipalities (Taipei, New Taipei, Taichung, Tainan,
  // Kaohsiung, Taoyuan) directly elect powerful mayors with real fiscal and policy autonomy — more
  // genuine municipal self-government in practice than Thailand's MOI-appointed provincial system.
  estrutura: ["C","D","C","D","N","C","D","D","D","C","C","D","D","D","C","D","N","D","D","D"],
  // One of Asia's most vibrant liberal democracies: multiple peaceful transfers of power between the
  // KMT and DPP, a free press ranked among the freest in Asia, and a robust independent judiciary.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Abolished the death penalty's mandatory application in most cases (though retained on the books,
  // rarely used), strong digital-rights and civic-tech culture (vTaiwan participatory platforms),
  // relatively light-touch domestic security posture for a state under direct existential military threat.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Faces direct, escalating Chinese military pressure (near-daily PLA air/naval incursions) and is
  // deliberately building "porcupine strategy" asymmetric defenses and expanding conscription — a real,
  // externally-forced militarization despite no offensive ambitions of its own.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Maintains a deliberate cross-strait status-quo (neither declaring formal independence nor accepting
  // "one country, two systems"), diplomatically isolated (recognized by a small handful of states) but
  // pragmatically engaged everywhere via unofficial representative offices.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // TSMC (the world's dominant advanced-semiconductor foundry) anchors a private-sector-led, deeply
  // market-oriented export economy, though the state has historically played a significant catalytic
  // R&D role (Hsinchu Science Park, ITRI).
  economia: ["D","CT","D","C","DT","D","C","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A deeply globalized, export-dependent tech economy that nonetheless treats semiconductor
  // manufacturing (TSMC especially) as a protected strategic national asset ("silicon shield").
  comercio: ["C","C","D","C","C","C","C","C","CT","C","CT","C","CT","C","N","C","C","C","CT","C"],
  // Highly religiously pluralistic and syncretic (Buddhist/Taoist/folk-religion blend) with genuine
  // freedom of religion and comparatively low state involvement in religious affairs.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // First place in Asia to legalize same-sex marriage (2019) via both court ruling and legislative
  // follow-through — a genuinely progressive social-policy leader in the region.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // World's most advanced semiconductor manufacturing base (TSMC), globally leading tech-export
  // identity, minimal nature-romanticist countercurrent given the island's dense, highly industrialized
  // economic model.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

export const PROFILES = {
  "paquistao": PAQUISTAO,
  "filipinas": FILIPINAS,
  "tailandia": TAILANDIA,
  "malasia": MALASIA,
  "taiwan": TAIWAN,
};
