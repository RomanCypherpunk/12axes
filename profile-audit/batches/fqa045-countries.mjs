// FQA045: argentina, liechtenstein, rojava, iugoslavia-socialista, espanha-franquista.

export const PROFILES = {
  // Argentina (contemporary): real federal republic (23 provinces + CABA, own constitutions/
  // governors) -> leans federal. Competitive democracy since 1983, robust institutions stressed by
  // real recurring economic crises -> leans democratic. Strong post-dictatorship human-rights
  // consciousness ("Nunca Mas" legacy of the Dirty War), first in Latin America to legalize gay
  // marriage (2010) -> leans liberdade. Historically a major immigrant-receiving nation (huge
  // Italian/Spanish heritage, "Argentines descend from ships") -> near-center imigracao. Modest
  // military relative to size, though the 1982 Falklands/Malvinas War shows real militarist capacity
  // when triggered -> leans pacifista. Not interventionist beyond the ongoing Malvinas sovereignty
  // claim -> leans nao-intervencionista. THE current defining trait: the Milei government (since
  // 2023) is pursuing radical libertarian shock-therapy privatization and deregulation ("the
  // chainsaw") -> very strongly privado and very strongly livre mercado, reflecting the current
  // moment. Pursuing trade liberalization despite a historical protectionist/import-substitution
  // legacy -> leans globalista. Historically Catholic-majority, increasingly secular -> near-center
  // religiao. Landmark progressive achievements: first-in-region gay marriage (2010) and legalized
  // abortion (2020, after years of "Marea Verde" feminist mobilization) -> leans progressive. Real
  // significant software/agtech sector and a historical nuclear program -> leans pro-Tecnologia.
  argentina: {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,D".split(","),
    representacao: "C,N,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "D,C,D,CT,D,C,D,C,D,C,D,C,D,CT,DT,C,D,C,D,CT".split(","),
    imigracao:     "N,C,D,CT,D,C,D,CT,D,CT,N,CT,D,CT,D,CT,DT,C,DT,N".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,DT,CT,C,CT,C,CT,C,C,C,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,CT,D,CT,D,CT,D,C,D,CT,DT,C,D,CT,C,C,D".split(","),
    economia:      "DT,CT,DT,CT,DT,CT,N,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "N,C,N,C,D,C,D,N,N,C,D,C,N,C,N,N,D,N,C,N".split(","),
    moral:         "C,N,C,N,C,N,C,N,C,C,C,N,D,C,N,N,C,D,C,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,C,N,C,D,C,N,C,N,N,N,C,N".split(","),
  },

  // Liechtenstein: 11 communes have real direct-democracy rights, INCLUDING a constitutional right
  // for any commune to secede from the principality itself -- an extraordinary, genuinely unique
  // fact -> extremely federal. A constitutional monarchy where the Prince retains real significant
  // reserve powers (veto, can dissolve parliament) -- an unusually monarch-empowered hybrid for a
  // modern European "democracy" -> leans democratic, moderately. Small, wealthy, low-crime, strong
  // civil-liberties tradition, historically a notable tax-haven/banking-secrecy jurisdiction ->
  // leans liberdade. About a third of residents are foreign, a genuinely very high share -> leans
  // multicultura, more than the placeholder's near-center reading. Abolished its own army in 1868 --
  // one of very few countries with zero armed forces -> extremely pacifista. Permanently neutral,
  // relies on Switzerland for some diplomatic representation -> extremely nao-intervencionista. A
  // major financial-services/banking hub with a real strong industrial base (Hilti tools) ->
  // extremely privado and extremely livre mercado. Currency union with Switzerland, an EEA member
  // (unlike Switzerland itself), a tiny extremely trade-open economy -> extremely globalista.
  // Catholicism holds special constitutional status even in an otherwise small, pragmatic, secular-
  // leaning modern society -> leans religioso, moderately. Women's suffrage was only granted in
  // 1984 -- remarkably late for Western Europe -- though real recent liberalization followed
  // (registered partnerships for gay couples since 2011) -> leans tradicionalista. Strong precision-
  // manufacturing/industrial-tech base (Hilti, Ivoclar dental technology) -> leans pro-Tecnologia.
  liechtenstein: {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,C,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,N,D,C,D,C,C,C,D".split(","),
    poder:         "D,C,N,CT,N,C,D,C,D,CT,D,C,C,CT,D,C,N,C,D,CT".split(","),
    imigracao:     "N,C,D,C,N,C,D,C,N,C,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,C,D,CT,DT,CT,DT,CT".split(","),
    intervencao:   "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT,D,CT,DT".split(","),
    economia:      "DT,CT,DT,CT,DT,CT,N,CT,DT,CT,DT,C,N,C,DT,N,DT,CT,N,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "N,CT,N,CT,D,CT,N,CT,C,CT,N,CT,N,CT,D,C,N,CT,N,CT".split(","),
    religiao:      "C,D,C,D,C,C,N,D,N,C,D,C,N,C,N,N,D,N,C,C".split(","),
    moral:         "D,C,D,C,N,N,D,N,D,N,D,C,D,C,N,N,D,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,C,N,C,D,C,N,C,D,N,C,C,N".split(","),
  },

  // Rojava: explicit "democratic confederalism" (Ocalan's ideology) -- radically decentralized,
  // bottom-up commune-based self-governance, explicit anti-nation-state doctrine -> extremely
  // federal. Real grassroots communal-council democracy with an explicit gender co-chair system
  // (every leadership position held jointly by a man and a woman) -> very strongly democratic. An
  // explicitly libertarian-socialist ideology emphasizing individual/community liberty even amid a
  // real active war-zone security context (fighting ISIS) -> strongly liberdade. Explicit ethnic-
  // pluralist ideology (Kurdish-Arab-Assyrian-Turkmen co-existence formally enshrined, multilingual
  // governance) -> extremely multicultura. Actively fighting ISIS (real intense warfare via the
  // YPG/SDF) even though the broader ideology is community-defense-oriented rather than expansionist
  // -> near-center diplomacia. Explicitly NOT seeking to expand or dominate -- a purely defensive,
  // autonomy-seeking project (albeit reliant on US alliance support to survive) -> leans nao-
  // intervencionista. Explicit "social ecology" (Bookchin-influenced) communalist economics, real
  // cooperative structures -> strongly publico. Per the established methodology for scoring
  // libertarian-socialist economics (the collectivized-coordination SPIRIT, not literal state-
  // agency): commune-based cooperative economics leans planejamento despite the absence of a central
  // state. Under real severe blockade/isolation (hostile Turkey and the Syrian government, limited
  // international recognition) forcing real self-sufficiency -> leans protecionista. Explicitly
  // secularist governance (separates religion from administration) while genuinely protecting
  // religious pluralism (Muslim, Christian, Yazidi communities) -> strongly irreligioso in the
  // governance sense. THE defining ideological commitment: radical gender equality (the co-chair
  // system, the YPJ women's protection units) and ecological consciousness -> among the most
  // extreme progressive profiles in the dataset. Ecology is explicitly one of the movement's three
  // ideological pillars (alongside democracy and women's liberation) -> leans toward the Biologia
  // pole rather than a techno-futurist orientation, and the war-zone/blockade context leaves the
  // society genuinely under-resourced technologically.
  rojava: {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,CT,DT,CT,CT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    poder:         "DT,CT,DT,CT,D,C,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    imigracao:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,CT,CT,D,CT".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,D,D,D,D,N,C,D,C,D,C".split(","),
    intervencao:   "CT,D,C,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,C,CT,D".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,D,C,D,CT,D,CT,D,CT,DT".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "C,D,C,N,C,D,C,DT,C,N,CT,D,CT,N,CT,D,CT,D,CT,N".split(","),
    religiao:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    moral:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,CT,CT,DT,CT,DT".split(","),
    tecnologia:    "N,C,D,C,N,C,D,C,D,N,N,C,D,C,D,C,D,C,D,C".split(","),
  },

  // Iugoslavia Socialista: a real federal structure (6 constituent republics + 2 autonomous
  // provinces), "self-management" ideology extended to genuine regional autonomy, more decentralized
  // than most communist states -> leans federal. A one-party state (League of Communists), though
  // real worker-council self-management institutions provided some grassroots participation distinct
  // from Soviet top-down control -> strongly autocratic overall given the fundamentally one-party
  // character. UDBA secret-police suppression of dissent, though generally less totalizing than
  // Stalinist USSR after Tito's 1948 break with Stalin -> leans seguranca. The explicit "Brotherhood
  // and Unity" doctrine united diverse South Slavic peoples under one federal identity with real
  // recognition of distinct republics/languages (even if it ultimately suppressed rather than
  // resolved ethnic tensions that exploded after Tito's death) -> near-center imigracao, leaning
  // multicultura given this real institutional accommodation. A real significant, well-armed
  // military (non-aligned but "total national defense" doctrine given its Cold-War position between
  // blocs) -> near-center diplomacia. Tito co-FOUNDED the Non-Aligned Movement with Nehru and Nasser
  // -- an explicit doctrine of non-alignment between the US and USSR blocs -> strongly nao-
  // intervencionista, a correction from the placeholder's dead-center reading. A unique "self-
  // management socialism" (worker-managed enterprises, distinct from Soviet state-ownership) ->
  // strongly publico. A genuine market-socialist hybrid, more decentralized than Five-Year-Plan
  // Soviet planning yet still fundamentally socialist coordination -> leans planejamento,
  // moderately. Uniquely open to BOTH Western and Eastern trade given its non-aligned position
  // (unlike Warsaw Pact states restricted to COMECON) -> near-center comercio, more open than typical
  // communist states. Officially secular/atheist doctrine, tempered by real pragmatic tolerance
  // given its genuinely multi-religious composition (Orthodox, Catholic, Muslim populations) ->
  // strongly irreligioso, tempered. Real progressive social policies (women's-rights advances,
  // secular education) within a broader socialist-conformist framework -> near-center moral. Non-
  // aligned status allowed access to both Western and Eastern technology and trade -> moderate
  // tecnologia.
  "iugoslavia-socialista": {
    estrutura:     "C,D,C,D,C,D,C,N,D,D,CT,D,C,D,C,N,CT,D,C,D".split(","),
    representacao: "DT,CT,DT,C,DT,CT,DT,CT,D,CT,D,CT,DT,C,DT,CT,DT,C,D,CT".split(","),
    poder:         "CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "N,C,D,C,N,C,D,C,N,CT,N,C,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "CT,D,C,C,CT,D,CT,C,CT,C,CT,D,CT,DT,CT,C,CT,C,CT,D".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,D,C,D,CT,D,CT,D,CT,DT".split(","),
    controle:      "C,D,C,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,DT,C,D".split(","),
    comercio:      "N,C,N,C,D,C,N,C,N,C,N,C,N,C,N,C,N,C,C,N".split(","),
    religiao:      "C,D,C,DT,C,C,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "C,N,C,N,C,D,C,D,D,N,D,C,N,C,N,N,C,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,N,D,C,N,D,C,N,C,N,D,N,C,N".split(","),
  },

  // Espanha Franquista: a highly centralized dictatorship that suppressed the Catalan/Basque
  // regional autonomy that existed under the Republic, forcing linguistic/cultural homogenization ->
  // strongly unitario. The Movimiento Nacional was the only legal political organization, Franco as
  // Caudillo held near-total power -> extremely autocratic. Extensive repression (executions, forced-
  // labor camps especially in the early post-Civil-War period, banning public use of Catalan/Basque/
  // Galician for decades) -> extremely seguranca. An explicit "one Spain" nationalist ideology
  // suppressing regional/linguistic minorities -> strongly assimilacao. A real significant military
  // given the regime's Civil-War origins, though Spain stayed formally neutral in WWII (despite Axis
  // sympathies) -> near-center diplomacia. Relatively isolated/non-expansionist after the Civil War
  // (unlike fascist Italy/Germany, it did not pursue foreign conquest, focusing on internal
  // consolidation) -> leans nao-intervencionista, a correction from the placeholder's nationalist-
  // assertive-leaning reading. Real significant state economic role especially in the early autarkic
  // period (INI, a state industrial holding company modeled partly on Italy's IRI), tempered by real
  // later liberalization (the 1959 Stabilization Plan opened the economy) -> near-center economia.
  // Strong early autarkic state planning, though the regime's later phase saw real market-oriented
  // reforms -> leans planejamento given the defining early character. Real severe early-period
  // international isolation and autarky, tempered by the later tourism-driven opening -> leans
  // protecionista, reflecting the regime's defining character. "National Catholicism" was explicit
  // state doctrine (Catholicism was the official state religion, with the Church holding real
  // institutional power over education, marriage, and censorship) -> among the most extreme religioso
  // profiles. Extremely traditionalist Catholic social doctrine (divorce was illegal, severe
  // restrictions on women's legal rights, harsh persecution of homosexuality) -> among the most
  // extreme tradicionalista profiles. Real limited/stagnant technological development especially
  // during the autarkic period, though the 1960s "Spanish Miracle" brought some real industrial
  // modernization -> near-center tecnologia, leaning traditional.
  "espanha-franquista": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    intervencao:   "C,D,C,C,C,C,D,C,C,N,C,D,D,D,C,C,D,C,C,D".split(","),
    economia:      "N,D,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,C,N,D".split(","),
    controle:      "CT,D,C,C,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:      "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "D,CT,D,C,D,C,D,C,N,D,D,C,D,C,D,C,C,C,D,C".split(","),
  },
};
