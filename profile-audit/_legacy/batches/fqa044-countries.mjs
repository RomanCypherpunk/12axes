// FQA044: aragao-e-catalunha-anarquistas-revolucao-espanhola, argentina-peronista, egito-de-nasser,
// africa-do-sul-do-apartheid, hong-kong. Same interpretive method as prior historical batches.

export const PROFILES = {
  // Aragao e Catalunha Anarquistas: radically decentralized worker/peasant collectives organized
  // federally (CNT-FAI), no central state authority -> extremely federal. Direct grassroots-assembly
  // democracy replacing formal state hierarchy -> very strongly democratic in the participatory
  // sense. Anarchist ideology is explicitly anti-authoritarian/pro-liberty, minimal coercive
  // apparatus -> very strongly liberdade. Internationalist anarchist solidarity (welcomed the
  // International Brigades), genuinely pluralist/anti-nationalist ideology -> strongly multicultura.
  // Fighting the Spanish Civil War through decentralized worker militias ("milicianos") rather than
  // a standing professional army, with an anti-militarist ideological core -> leans pacifista despite
  // real active combat. Purely a defensive revolutionary project within Spain, no expansionist
  // ambition -> strongly nao-intervencionista. Explicitly abolished private capitalist ownership of
  // land and factories in favor of worker/peasant collectives -> extremely publico. Per the
  // established methodology for anarchist economics (score the collectivized-coordination SPIRIT,
  // not literal state-agency): anarcho-syndicalist worker-council self-management is genuinely
  // collectivized economic coordination, not market-driven -> leans planejamento despite the absence
  // of a central state. Real wartime necessity drove practical self-sufficiency even without
  // nationalist protectionist ideology -> leans protecionista, moderately. Anarchists were famously
  // and fiercely ANTICLERICAL (real church burnings and killings of clergy during the revolution,
  // explicitly atheist/anti-religious as part of anti-authoritarian politics) -> extremely
  // irreligioso. Genuinely radical progressive ideology (the Mujeres Libres women's-liberation
  // organization, free-love ideals, anti-traditional-family sentiment, anticlericalism) -> extremely
  // progressive. Agrarian/industrial worker collectives pursued real but modest modernization within
  // the collectivized framework -> near-center tecnologia.
  "aragao-e-catalunha-anarquistas-revolucao-espanhola": {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "CT,DT,CT,C,CT,DT,CT,D,CT,DT,CT,CT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    poder:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    imigracao:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,CT,CT,D,CT".split(","),
    diplomacia:    "D,C,D,C,N,C,D,C,N,C,D,D,D,D,N,C,D,C,D,C".split(","),
    intervencao:   "CT,D,C,D,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,C,CT,D".split(","),
    economia:      "CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,D,C,D,CT,D,CT,D,CT,DT".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "C,D,C,N,C,D,C,DT,C,N,CT,D,CT,N,CT,D,CT,D,CT,N".split(","),
    religiao:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    moral:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,CT,CT,DT,CT,DT".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,C,N,C,D,C,N,C,N,N,N,C,D".split(","),
  },

  // Argentina Peronista: centralized populist-nationalist state within a formally federal structure
  // -> near-center estrutura. Real legitimate elections (1946, 1951) alongside real authoritarian
  // tendencies (press control, opposition harassment, overthrown by a 1955 coup) -> leans autocratic,
  // moderately. Real repression of opposition plus a strong corporatist union-control apparatus ->
  // leans seguranca. Real strong nationalist rhetoric ("Argentina for Argentines") despite a
  // historical immigrant-receiving identity -> near-center imigracao. "Third Position" foreign
  // policy explicitly rejected alignment with either the US or USSR bloc -> leans nao-
  // intervencionista as an assertive-sovereigntist doctrine, moderate militarism -> near-center
  // diplomacia. Real significant nationalization (railways, utilities) and import-substitution
  // industrialization -> leans publico. Real strong state economic direction (IAPI state trading
  // monopoly, Five-Year Plans) -> leans planejamento. Import-substitution industrialization was
  // explicitly protectionist doctrine -> leans protecionista. An initial close Church-Peronist
  // alliance gave way to real conflict (Peron was excommunicated by the Vatican in 1955) -> leans
  // religioso given the broader Catholic-nationalist milieu despite the later break. Real 1947
  // women's-suffrage expansion (an Eva Peron-driven achievement) alongside real socially conservative
  // Catholic-nationalist currents -> near-center moral. A real industrialization push (Argentina's
  // nuclear program began under Peron, aviation-industry development) -> near-center tecnologia.
  "argentina-peronista": {
    estrutura:     "C,N,C,C,C,N,C,N,D,C,N,C,C,N,D,C,C,N,C,D".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "C,D,C,C,C,N,CT,D,C,C,C,C,N,C,D,C,C,N,C,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,N,C,D,N,C,N,D,D,D,N,D".split(","),
    diplomacia:    "N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C,N,C".split(","),
    intervencao:   "C,D,C,C,C,C,D,C,C,N,C,D,D,D,C,C,D,C,C,D".split(","),
    economia:      "N,D,C,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,D,D,C,D,C,D,C,C,C,D,D,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,D,C,D,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "N,C,N,C,N,C,D,N,D,N,N,C,N,C,N,N,N,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,N,N,D,N,C,N".split(","),
  },

  // Egito de Nasser: unitary, centralized Arab-nationalist state -> leans unitario. One-party state
  // (Arab Socialist Union) with real popular charismatic legitimacy but no competitive elections ->
  // strongly autocratic. Extensive Mukhabarat intelligence apparatus, suppression of the Muslim
  // Brotherhood and communists -> strongly seguranca. Pan-Arabism was explicitly a unifying pan-
  // ethnic Arab identity project, not pluralist multiculturalism -> leans assimilacao. Real
  // significant military buildup, fought wars with Israel (1956 Suez Crisis, 1967 Six-Day War) ->
  // leans militarist. Pan-Arabist leadership ambitions (intervened in the Yemen Civil War 1962-1970,
  // pursued Arab unity/the UAR with Syria) -> leans nationalist-assertive. Nationalized the Suez
  // Canal in 1956 -- the regime's defining act -- plus extensive nationalization of industry/banking
  // -> strongly publico. Arab Socialism was explicit state-planning doctrine (the Aswan High Dam
  // mega-project, Five-Year Plans) -> strongly planejamento. Nationalizing the Suez Canal was
  // explicitly about controlling this strategic global trade route -> leans protecionista.
  // Officially secular-nationalist Arab Socialism, with real tension/suppression toward the Muslim
  // Brotherhood specifically, in a still-majority-Muslim society -> near-center religiao, leaning
  // religioso. Real progressive land-reform and social-modernization push (land redistribution,
  // expanded education, state-feminist advances), though still fairly socially traditional overall
  // -> near-center moral. The Aswan High Dam was a real massive engineering/development achievement
  // -> leans pro-Tecnologia, moderately.
  "egito-de-nasser": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "N,C,N,N,C,D,C,D,C,C,N,D,C,D,N,D,DT,D,N,D".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,D,C,D,CT,C,CT,C,C,D,C,DT,CT,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,C,D,D,C,D,C,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,N,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,CT,D,CT,D,C,D,C,D,CT,DT,CT,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,C,D,C,D,C,D,C,D,D,C,C".split(","),
    moral:         "C,N,C,N,C,D,C,N,C,N,N,C,N,C,N,N,C,D,N,C".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,C,D,C,N,C,N,N,N,C,D".split(","),
  },

  // Africa do Sul do Apartheid: centralized white-minority rule; the "homelands"/Bantustan system
  // was a real (though illegitimate) attempt at fragmenting Black citizenship, but the core state's
  // political power was tightly centralized -> leans unitario. Only the white minority could vote
  // nationally; Black, Coloured, and Indian South Africans were excluded outright -> among the most
  // extreme autocratic profiles given this fundamental exclusion. An extreme security apparatus
  // built specifically to enforce racial segregation (pass laws, detention without trial, banning
  // the ANC) -> among the most extreme seguranca profiles. THE defining case of enforced racial
  // boundary-maintenance ("separate development" doctrine, the Group Areas Act, pass laws) -> among
  // the most extreme assimilacao-pole profiles (enforced in-group/out-group separation rather than
  // pluralist integration). Real significant military buildup, fought the "Border War" in Namibia/
  // Angola against SWAPO and Cuban-backed forces, secretly developed (and later dismantled) nuclear
  // weapons -> leans militarist. Real cross-border interventions and destabilization campaigns
  // against neighboring "frontline states" -> leans nationalist-assertive. Real significant state
  // direction of the economy for the white minority's benefit alongside genuine private mining-
  // capital strength -> near-center economia. Real extensive labor-market racial regulation (job-
  // reservation laws reserving skilled work for whites) -> leans planejamento, moderately. Faced
  // real international sanctions/boycotts, forcing real import-substitution self-sufficiency
  // including a domestic arms industry built specifically to evade arms embargoes -> leans
  // protecionista. The Dutch Reformed Church provided real, well-documented theological
  // justification for apartheid ideology -- a defining church-state ideological fusion -> strongly
  // religioso. Explicit racial hierarchy, patriarchal Afrikaner nationalist culture, and the
  // Immorality Act criminalizing interracial relationships -> among the most extreme tradicionalista
  // profiles. Real significant technological development in specific areas (the nuclear program, an
  // arms industry built to evade sanctions) driven by isolation/necessity rather than cosmopolitan
  // tech-embrace -> near-center tecnologia.
  "africa-do-sul-do-apartheid": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "C,D,C,D,CT,D,C,D,C,D,C,C,CT,D,C,D,C,DT,C,D".split(","),
    intervencao:   "D,CT,D,C,D,C,D,CT,D,C,D,CT,C,D,D,C,D,C,D,CT".split(","),
    economia:      "N,C,C,D,N,D,C,N,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,D,D,C,C,D,C,D,C,C,C,D,DT,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,C,D,C,N,C,D,D,N,C,D".split(","),
  },

  // Hong Kong: real "one country, two systems" autonomy from the mainland, historically its own
  // legal/economic system, though this has been real significantly eroded since the 2020 National
  // Security Law -> leans federal, reflecting the real (if diminishing) autonomous status. LegCo has
  // some directly elected seats (never fully democratic even under British rule), and the 2020 law
  // severely curtailed opposition/media freedom and disqualified pro-democracy legislators -> leans
  // autocratic given this real, significant recent erosion. Real extensive post-2020 prosecution of
  // dissidents/journalists (the Jimmy Lai case, the Apple Daily shutdown) despite a historical
  // British-common-law civil-liberties tradition -> leans seguranca given the recent trajectory. A
  // genuinely cosmopolitan international financial hub (huge expatriate population) with a real,
  // distinct "Hong Kong identity" especially salient since the 2019 protests -> leans multicultura,
  // a correction from the placeholder's assimilacao-leaning reading. No independent military (the
  // PLA garrison is present but Hong Kong itself has no armed forces) -> strongly pacifista. No
  // independent foreign policy at all (a mainland Chinese prerogative under the Basic Law) ->
  // strongly nao-intervencionista by structural necessity. THE defining trait: one of the world's
  // most laissez-faire economies historically, with "positive non-interventionism" literally the
  // official economic-policy doctrine for decades -> among the most extreme privado/livre-mercado
  // profiles in the dataset. The quintessential free port with historically zero tariffs -> among
  // the most extreme globalista profiles. Genuinely religiously diverse and historically pragmatic/
  // business-focused -> leans irreligioso. Real relatively liberal, cosmopolitan social attitudes for
  // the region (though no gay marriage yet, courts have granted partial recognition), notably more
  // socially liberal than the mainland -> leans progressive, a correction from the placeholder's
  // tradicionalista-leaning reading. A real significant fintech/international-finance-tech hub,
  // though more a services/financial economy than a hardware/manufacturing leader -> strongly pro-
  // Tecnologia.
  "hong-kong": {
    estrutura:     "C,D,C,D,C,D,C,N,D,D,CT,D,C,D,C,C,C,CT,C,D".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,DT,CT,D,CT,D,CT,C,C,D,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D".split(","),
    economia:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "C,D,C,D,C,D,N,D,C,D,C,D,C,D,C,D,D,D,C,N".split(","),
    moral:         "C,N,C,N,C,D,C,N,C,D,C,N,D,C,N,N,C,D,C,C".split(","),
    tecnologia:    "CT,DT,C,D,C,D,C,D,N,C,CT,D,C,N,CT,D,N,C,CT,D".split(","),
  },
};
