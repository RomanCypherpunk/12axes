// FQA051 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// cazaquistao: unitary presidentially-appointed-akim state, managed-democracy authoritarianism
//   (Nazarbayev/Tokayev), violently suppressed the Jan 2022 "Qandy Qantar" protests with CSTO/Russian
//   troop assistance, "multi-vector" foreign policy balancing Russia/China/West, Samruk-Kazyna
//   sovereign fund alongside major Western oil majors (Tengiz/Kashagan).
// catar: absolute monarchy, Shura Council mostly advisory despite partial 2021 elections, ~90% of
//   population is non-citizen migrant labor under a kafala-style system, hosts the massive US Al Udeid
//   airbase while cultivating a neutral-mediator diplomatic image (Taliban talks, Gaza ceasefire
//   negotiations), LNG-export/QIA sovereign-wealth economy, strict Islamic social law.
// egito-atual: El-Sisi's military-backed authoritarian republic since the 2013 coup, tens of thousands
//   of political prisoners, military-owned conglomerates control an estimated 20-40% of GDP, Suez Canal
//   chokepoint revenue, IMF-driven liberalization reforms alongside continued state economic dominance.
// libano: formally unitary but genuinely fragmented by 1943/1989 confessional power-sharing — Hezbollah
//   runs an armed wing and foreign policy outside state control, the state itself has been near-
//   collapsed since the 2019-20 financial crisis and 2020 port explosion.
// siria: post-Assad transitional state (HTS/al-Sharaa government since Dec 2024) — no elections held
//   yet, struggling to establish authority over the Kurdish-run northeast, Druze south, and Alawite
//   coast, seeking international sanctions relief while rebuilding from a devastated war economy.

const CAZAQUISTAO = {
  // 17 oblys run by presidentially-appointed akims, though rural/city-district akim elections were
  // introduced starting 2021 — a narrow but real local-election opening that Egypt's governorate system
  // (100% presidentially appointed, no elected local-executive layer at all) simply does not have.
  estrutura: ["D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C"],
  // Nazarbayev's Nur Otan/Amanat party has dominated every election since independence and Tokayev's
  // 2022 re-election lacked credible competition, but the 2022 constitutional referendum did impose a
  // single 7-year presidential term limit and re-legalized some independent party registration — a
  // real, if narrow, post-Qandy-Qantar liberalization gesture distinct from Egypt's trajectory.
  representacao: ["D","C","D","C","N","C","D","C","D","CT","D","C","D","N","D","C","D","N","D","C"],
  // The January 2022 "Qandy Qantar" unrest was crushed with live ammunition and CSTO/Russian troop
  // support (~230 deaths, thousands detained) — a decisive, recent, documented use of maximal state
  // coercion against domestic dissent.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // A real, growing state-led "Kazakhification" push (Kazakh as sole state language in more domains,
  // Latin-script transition from Cyrillic by 2031) creates genuine assimilationist pressure on the
  // large ethnic-Russian minority (~15-18% of the population).
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // "Multi-vector" foreign policy deliberately avoids over-committing to any single power bloc — no
  // major offensive military posture, but sizable defense spending to hedge against regional instability.
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Refused to recognize Russia's 2022 annexations of Ukrainian territory despite CSTO membership and
  // deep economic ties — a genuinely cautious, non-expansionist, sovereignty-protective regional posture.
  intervencao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Samruk-Kazyna sovereign fund holds controlling stakes in major national firms (KazMunayGas,
  // Kazatomprom — world's largest uranium producer) alongside genuine Western majority-foreign-owned
  // joint ventures (Chevron/ExxonMobil at Tengiz) — a real mixed economy, not uniformly state-run.
  economia: ["D","C","C","D","D","D","C","C","C","D","N","C","C","D","N","D","C","D","N","N"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  // Landlocked and building the post-2022 "Middle Corridor" trade route bypassing Russia; Eurasian
  // Economic Union (Russia-led customs bloc) membership imposes real tariff coordination.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Officially secular (Soviet-legacy state control of religious registration/imams), Sunni-majority
  // population but comparatively low religious observance relative to the Gulf or Pakistan.
  religiao: ["C","C","C","D","C","D","C","D","C","D","C","D","D","D","C","D","D","D","C","D"],
  // More socially liberal than the Gulf states or Pakistan (no criminalization of homosexuality since
  // Soviet-era decriminalization in 1998, women in the workforce at high rates) but still a
  // conservative, patriarchal Central Asian culture overall.
  moral: ["C","C","N","C","N","D","C","D","C","D","N","C","D","N","N","D","N","D","N","N"],
  // Heavy e-government digitalization push (one of the more advanced digital-ID/e-services systems in
  // the former USSR) and the world's largest uranium/nuclear-fuel industry.
  tecnologia: ["C","D","C","N","C","N","N","N","N","N","N","N","D","N","C","N","N","N","C","N"],
};

const CATAR = {
  // A small unitary emirate with no federal subdivisions of consequence — power concentrated entirely
  // in Doha and the Al Thani ruling family.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The Shura Council gained a partially-elected component only in 2021 (2/3 elected, 1/3 appointed)
  // but retains only advisory/limited legislative power; no political parties are permitted; the Emir
  // holds near-total executive authority.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Kafala-style labor sponsorship, strict public-morality policing, extensive surveillance
  // capacity, no independent press — but also very low street crime given the tight social control.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","CT","D","CT","D","CT","D","CT","D"],
  // ~90% of the resident population is foreign migrant labor with essentially no path to citizenship or
  // integration — a distinct model of permanent labor segregation rather than either assimilation or
  // celebrated multiculturalism; citizenship and rights remain sharply reserved for the small native
  // Qatari minority.
  imigracao: ["C","D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","DT","D","CT","DT"],
  // Hosts the largest US military base in the Middle East (Al Udeid) while cultivating an image as a
  // neutral mediator (Taliban political office, Gaza ceasefire shuttle diplomacy, Iran back-channel) —
  // a genuinely split profile between military hosting and diplomatic neutrality branding.
  diplomacia: ["C","CT","D","C","C","CT","D","C","D","CT","C","N","D","C","D","CT","D","D","C","C"],
  // Funded various factions across the 2011 Arab Spring uprisings and the Syrian and Libyan civil wars
  // (real interventionism-by-proxy), while also brokering ceasefires and hostage negotiations —
  // genuinely inconsistent, but net leans toward active regional involvement rather than neutrality.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // QatarEnergy (majority state-owned) and the Qatar Investment Authority sovereign wealth fund
  // dominate the economy, though the state actively courts foreign investment with business-friendly,
  // low-tax rules — a state-anchored but foreign-capital-welcoming model.
  economia: ["D","C","C","D","D","D","C","C","C","D","N","C","C","D","DT","D","C","D","N","N"],
  controle: ["C","D","C","D","N","D","C","D","C","D","C","D","D","D","C","C","C","D","N","C"],
  // The LNG-export economy and the Qatar Financial Centre are built explicitly for global capital
  // integration — one of the most trade/finance-globalist small states in the world.
  comercio: ["D","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Wahhabi/Salafi-influenced Islamic legal framework underpins state legitimacy; alcohol tightly
  // restricted, Islamic identity central to governance, though somewhat less extreme in daily
  // enforcement than Saudi Arabia historically.
  religiao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Homosexuality is criminalized, strict public-decency/dress codes, gender-guardianship elements
  // remain in family law — one of the most socially traditionalist profiles in this cohort, moderated
  // only marginally by 2022 World-Cup-era tourism accommodations.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // Built explicit "smart city" mega-projects (Lusail, Msheireb Downtown) and hosts major AI/education
  // investment (Qatar Foundation, Hamad Bin Khalifa University) — a genuinely tech-forward petrostate.
  tecnologia: ["C","D","C","N","C","N","N","N","C","N","C","D","C","D","C","D","C","D","C","N"],
};

const EGITO_ATUAL = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // El-Sisi's 2018 and 2024 re-elections lacked credible opposition (candidates jailed, barred, or
  // withdrew under pressure); 2019 constitutional amendments extended presidential terms and expanded
  // military authority over civilian governance.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D","CT"],
  // Tens of thousands of political prisoners documented by human-rights groups, extensive use of
  // military/emergency courts against civilians, sweeping anti-protest and NGO-restriction laws since 2013.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  // Strong Arab-nationalist assimilationist identity heritage (Nasserist legacy), YET Egypt hosts an
  // estimated ~9 million Sudanese, Syrian, and other refugees with relatively open day-to-day access to
  // work/schools even without formal citizenship pathways — a genuinely more accommodating de facto
  // reality than Kazakhstan's language-politics-driven minority tension.
  imigracao: ["C","C","D","C","N","C","C","D","C","C","C","C","N","D","N","D","D","D","C","D"],
  // One of the largest militaries in the region, major recipient of US military aid, maintains the 1979
  // peace treaty with Israel but has repeatedly reinforced Sinai/Rafah border security amid the Gaza war.
  diplomacia: ["C","C","D","C","C","C","D","C","N","C","C","N","C","N","C","C","D","D","C","N"],
  // Generally cautious about expeditionary intervention beyond direct border-security concerns (Sinai
  // counter-terrorism, periodic Libya-border involvement) rather than offensive regional power projection.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Military-owned conglomerates (estimated 20-40% of GDP) control construction, food processing, and
  // infrastructure sectors alongside IMF-mandated privatization/liberalization reforms since 2016 — a
  // genuinely state-heavy mixed economy.
  economia: ["C","D","C","D","C","DT","C","D","C","D","N","D","C","D","N","D","C","D","C","D"],
  // Chronic currency crises and periodic capital controls, massive state bread/fuel subsidies (though
  // IMF programs have forced partial subsidy cuts), heavy state role in staples pricing.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D"],
  // Suez Canal toll revenue (a globalist chokepoint asset by nature) sits alongside acute food-security
  // anxiety given Egypt is the world's largest wheat importer — a genuinely sharper, import-dependency-
  // driven protectionist streak on staples specifically than Kazakhstan's customs-union-driven pattern.
  comercio: ["CT","D","CT","D","C","D","C","D","C","D","CT","D","C","D","N","D","CT","D","C","D"],
  // Islam is the constitutionally established state religion, Al-Azhar functions as a state-linked
  // religious authority, blasphemy laws are enforced; the Coptic Christian minority (~10%) faces real
  // church-building restrictions and periodic sectarian violence.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // Homosexuality is criminalized in practice via public-morality laws, FGM remains widespread despite
  // a legal ban, patriarchal personal-status law — deeply conservative, though a visible feminist/civil-
  // society reform movement exists that has no real counterpart in Qatar's more tightly closed system.
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  // The New Administrative Capital "smart city" mega-project and a fast-growing fintech/mobile-payment
  // sector, though overall tech investment lags well behind the Gulf states.
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","C","N","C","N","N","N","C","N"],
};

const LIBANO = {
  // The 1943 National Pact and 1989 Taif Agreement entrench confessional power-sharing so deeply that
  // the central state is genuinely weak relative to sect-based parties/militias operating with real
  // autonomy in their own zones — a de facto high-decentralization outcome despite formal unitary status.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","C","D"],
  // Regular parliamentary elections (2022) and a genuinely pluralistic press/civil society by regional
  // standards, but deep dysfunction: the presidency sat vacant for over two years (2022-2025) amid
  // sectarian-quota gridlock, and power remains entrenched among warlord-descended dynasties.
  representacao: ["C","D","C","D","C","D","C","D","C","N","C","D","N","D","C","D","N","D","C","D"],
  // The state's own security forces are underfunded and weakened by the post-2019 economic collapse,
  // while Hezbollah maintains a large, independently-controlled armed wing outside state command — an
  // unusual split between a comparatively weak formal "poder" apparatus and a powerful non-state one.
  poder: ["D","C","D","C","D","C","N","C","D","C","D","C","N","C","DT","C","D","C","D","C"],
  // A historic Levantine trading/cosmopolitan hub whose entire political system is built around
  // religious-sectarian pluralism coexisting (if often in tension) rather than assimilation into a
  // single national identity.
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Lebanon-the-state has a comparatively small, underfunded army, but Hezbollah's independent arsenal
  // (larger than the national army's) is a major regional military factor — a genuinely split profile
  // between a weak state military and a powerful non-state armed actor.
  diplomacia: ["N","C","D","C","N","D","N","C","D","C","N","N","N","N","N","C","D","D","N","N"],
  // Hezbollah's direct military involvement fighting for the Assad regime in Syria's civil war and its
  // ongoing cross-border exchanges with Israel represent genuine non-state interventionism, even as the
  // formal Lebanese state itself avoids expeditionary intervention.
  intervencao: ["C","D","C","D","D","C","N","C","D","C","C","C","C","D","C","D","N","C","C","C"],
  // Historically a laissez-faire, banking-secrecy "Switzerland of the Middle East" economy; the 2019-20
  // collapse exposed a Ponzi-like banking sector, but the underlying economic model remained private-
  // sector- and services-oriented rather than state-directed.
  economia: ["D","C","D","C","DT","D","C","C","D","D","N","D","D","D","DT","D","D","C","N","C"],
  // Chronically weak state regulatory capacity — the banking sector operated with minimal oversight for
  // decades, and the state currently lacks the institutional capacity to enforce most economic controls.
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","DT","C","D","C","D","C","D","C"],
  // A historic entrepôt/free-trade economy (Beirut port, though devastated by the 2020 explosion),
  // strongly outward-oriented and dependent on remittances and trade services.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Religion is not merely present but structurally embedded in the *political architecture itself*
  // (18 recognized sects with constitutionally allocated offices, personal-status law run separately by
  // each sect's own courts) — a qualitatively different, institutionalized-pluralism kind of religious
  // salience than Egypt's single-state-religion model or Syria's Islamist-governance-legitimacy model.
  religiao: ["D","C","D","CT","C","C","D","CT","D","D","D","CT","D","C","D","C","D","CT","D","D"],
  // Beirut has a real, if fragile, cosmopolitan/liberal-leaning nightlife and civil-society reputation
  // relative to the region, sharply contrasted with the social conservatism of rural and religious
  // strongholds — a genuinely mixed, moderate profile.
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // A once-promising Beirut tech/startup scene has been devastated by the electricity crisis and
  // chronic blackouts since the 2019-20 collapse.
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","C","N","D","N","D","N","N","D"],
};

const SIRIA = {
  // The transitional HTS-led government struggles to project real authority beyond Damascus and the
  // Sunni-Arab heartland — the Kurdish-led Autonomous Administration in the northeast, the Druze south,
  // and Alawite coastal areas all retain significant de facto autonomy or armed resistance.
  estrutura: ["CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D","CT","D","CT","D","C","D"],
  // No elections have been held under the transitional government at all — al-Sharaa's authority
  // derives entirely from the December 2024 military takeover, with a promised new constitution and
  // elections still pending; a genuinely different situation from Egypt's *staged*-but-held elections —
  // Syria currently has no electoral process to even stage.
  representacao: ["D","D","D","N","D","C","D","N","D","D","D","N","D","N","D","C","D","N","D","D"],
  // Ongoing security crackdowns and documented 2025 sectarian violence against Alawite and Druze
  // communities by transitional-government-aligned factions reflect an unstable, coercion-heavy
  // security environment even as the old Assad-era mukhabarat apparatus has been dismantled.
  poder: ["CT","D","C","D","CT","D","C","D","D","CT","CT","D","N","D","CT","D","CT","D","C","D"],
  // A Sunni-Islamist-oriented transitional government emphasizing Arab-Sunni national identity has
  // generated acute, sometimes violent, tension with Kurdish, Alawite, Druze, and Christian minorities
  // over language rights and regional autonomy — a sharper, more volatile fracture than Egypt's
  // comparatively settled Coptic-minority arrangement or Kazakhstan's language-policy gradualism.
  imigracao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","C","D","C","DT"],
  // Rebuilding a shattered, factionalized military almost from scratch (largely former rebel
  // brigades merged ad hoc) rather than fielding the large standing conventional army Egypt maintains —
  // heavy Turkish patronage shapes the transition far more than any independent power-projection capacity.
  diplomacia: ["D","CT","D","C","D","CT","DT","C","D","CT","D","C","N","C","D","CT","D","C","D","N"],
  // Focused overwhelmingly on internal consolidation and reconstruction rather than external power
  // projection, though entangled with Turkish and Israeli cross-border military actions it does not control.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Moving away from the Assad-era Ba'athist state-command economy — HTS's prior governance of Idlib
  // showed a relatively market-oriented, fee-based administrative model — but institutional capacity
  // remains too devastated for a clear economic model to have consolidated yet.
  economia: ["D","C","D","C","D","D","C","C","C","D","N","C","C","D","N","D","D","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D","C","D"],
  // Sanctions-isolated even post-Assad and desperately seeking reconstruction financing/trade
  // reintegration — the transitional government has strong incentive to court foreign investment and
  // open trade wherever sanctions allow, a more externally-dependent-and-eager posture than Egypt's
  // established chokepoint-revenue model.
  comercio: ["D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C","D","CT"],
  // The transitional government's Sunni-Islamist roots (HTS) mean religion carries heavy weight in
  // governance and legitimacy claims, even amid rhetorical moderation aimed at international acceptance.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // International observers have raised concerns about women's-rights rollbacks and conservative
  // Islamist social policy under the transitional government, despite some moderating rhetoric.
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // War-devastated infrastructure (electricity, internet, industry) leaves minimal capacity for
  // technology development — reconstruction of basic services, not innovation, dominates the agenda.
  tecnologia: ["N","C","N","D","N","N","D","N","N","N","N","N","D","N","D","N","D","N","N","D"],
};

export const PROFILES = {
  "cazaquistao": CAZAQUISTAO,
  "catar": CATAR,
  "egito-atual": EGITO_ATUAL,
  "libano": LIBANO,
  "siria": SIRIA,
};
