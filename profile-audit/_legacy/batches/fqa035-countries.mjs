// FQA035: brasil, estados-unidos, mexico, chile, bolivia (country catalog, first country batch).
//
// Methodology: no ideology-text to draw on here, so each answer is grounded in the country's real
// constitutional structure, institutions, and policy record (not a generic left/right vibe). Where
// a country's actual position is genuinely contested/polarized, the answer is N rather than forced
// to a pole -- this is the same "whatever falls out is accepted" principle used for ideologies.
//
// Axis polarity reminder (score = % compatibility with leftPole, per axes.json):
// estrutura: Federal(high)/Unitario(low) | representacao: Democracia(high)/Autocracia(low)
// poder: Seguranca(high)/Liberdade(low) | imigracao: Assimilacao(high)/Multicultura(low)
// diplomacia: Militarista(high)/Pacifista(low) | intervencao: Nao-intervencionista(high)/Nacionalista(low)
// economia: Publico(high)/Privado(low) | controle: Planejamento(high)/Livre-mercado(low)
// comercio: Protecionismo(high)/Globalismo(low) | religiao: Irreligioso(high)/Religioso(low)
// moral: Progressista(high)/Tradicionalista(low) | tecnologia: Tecnologia(high, pro-tech)/Biologia(low)

export const PROFILES = {
  // Brasil: real federation (state constitutions/police/ICMS) but with real centralizing pulls
  // (BNCC national curriculum, CLT national labor law, STF ADI power) -> moderate-strong federal.
  // Stable liberal democracy since 1988, robust judicial review, universal compulsory suffrage ->
  // strongly democratic. Aggressive favela policing vs. strong constitutional due-process/privacy
  // protections and no death penalty -> genuinely mixed on poder. Official multicultural
  // self-narrative + real generous refugee policy (Acolhida) -> multicultural-leaning. Itamaraty
  // pacifist-diplomacy tradition, Tlatelolco non-proliferation -> strongly pacifist. Art.4 CF
  // non-intervencao/autodeterminacao constitutional principles -> strongly non-interventionist.
  // Large state sector (Petrobras, BNDES, SUS) -> public/planning-leaning. High historical tariffs,
  // recent EV tariff reinstatement -> protectionist. Formally secular but highly religious
  // population/evangelical political bloc -> leans religioso. Legal gay marriage/cotas but
  // restrictive abortion law and contested "ideologia de genero" debates -> genuinely mixed moral.
  // Real environmental-steward identity (COP30 host, Amazon salience) tempers otherwise real tech
  // sectors (Embraer, agtech, nuclear) -> near-center tecnologia.
  brasil: {
    estrutura:     "C,C,C,C,CT,D,C,N,D,C,CT,C,C,D,D,C,C,CT,C,DT".split(","),
    representacao: "CT,D,CT,C,CT,D,CT,D,C,DT,C,D,D,D,CT,DT,D,D,CT,DT".split(","),
    poder:         "C,D,C,D,C,N,C,DT,C,D,C,D,CT,C,D,C,C,N,D,C".split(","),
    imigracao:     "N,C,D,CT,D,C,D,CT,D,CT,N,CT,D,CT,D,CT,DT,C,DT,N".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,DT,CT,C,CT,C,CT,C,C,C,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,D,C,C,D,CT,C,C,D,CT,DT,C,D,CT,N,C,D".split(","),
    economia:      "D,N,CT,DT,D,DT,CT,N,CT,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "CT,D,D,D,C,D,CT,D,C,C,CT,D,D,D,C,C,C,DT,CT,D".split(","),
    comercio:      "CT,DT,C,N,C,D,CT,DT,C,N,CT,C,CT,N,CT,C,CT,C,C,N".split(","),
    religiao:      "D,C,C,C,C,CT,D,D,N,CT,DT,C,D,CT,D,C,D,C,C,CT".split(","),
    moral:         "C,C,C,C,CT,C,C,D,N,N,N,N,C,C,N,N,D,D,C,C".split(","),
    tecnologia:    "C,D,N,N,CT,D,C,C,D,CT,N,C,C,C,N,C,D,N,N,N".split(","),
  },

  // Estados Unidos: extreme federalism (states run education/criminal law/elections, no national
  // police) -> very strongly federal. Oldest continuous democracy w/ strong judicial review, but
  // fixed term limits and stable electoral calendar -> strongly democratic. Bill of Rights liberty
  // tradition (1A/2A/4A/5A) is genuinely strong even amid mass incarceration -> net liberty-leaning
  // poder. Deeply polarized/contested on imigracao -> near-center. World's largest defense budget,
  // Bush-Doctrine preventive-strike precedent, deterrence-doctrine nuclear posture -> very strongly
  // militarist. Extensive regime-change/sanctions/~750-base-network history and ICC non-membership
  // -> very strongly nationalist-assertive (well below baseline's near-center placement -- the real
  // interventionist record does not support a dovish reading). Private-market-dominant healthcare/
  // education/labor model, sacred Fed independence -> strongly private and free-market. Real,
  // significant, bipartisan post-2016 protectionist turn (Section 301, CHIPS Act, EV tariffs,
  // USMCA renegotiation) -> moderately protectionist, a real correction from the baseline's
  // strongly-globalist placement, which reflected an older pre-2016 consensus. Secular constitution
  // but high religiosity relative to peer democracies -> moderate religioso lean. Deep culture-war
  // polarization (Obergefell/legal gay marriage vs. Dobbs overturning Roe and 2023 SFFA ending
  // affirmative action) -> genuinely near-center moral. Silicon Valley/NASA-SpaceX/CRISPR global
  // leadership -> very strongly pro-Tecnologia.
  "estados-unidos": {
    estrutura:     "C,D,CT,D,CT,DT,C,D,D,N,C,D,C,D,D,D,C,D,C,DT".split(","),
    representacao: "CT,D,CT,C,CT,D,CT,D,C,DT,C,D,D,D,CT,D,D,D,C,DT".split(","),
    poder:         "C,C,C,CT,N,C,D,D,D,CT,N,C,D,CT,N,C,C,N,D,CT".split(","),
    imigracao:     "C,N,N,C,N,N,N,N,C,CT,C,N,N,C,N,C,DT,D,N,D".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,CT,DT,N,D,CT,D,CT,D,CT,D,C,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "D,CT,D,CT,D,C,D,CT,D,C,D,C,N,CT,D,CT,D,CT,N,CT".split(","),
    controle:      "C,CT,DT,CT,N,N,C,C,DT,CT,D,CT,DT,CT,N,CT,DT,DT,N,CT".split(","),
    comercio:      "C,D,C,N,C,D,C,D,C,N,N,N,CT,D,CT,N,CT,N,C,D".split(","),
    religiao:      "D,C,N,N,D,CT,D,DT,N,CT,D,C,D,C,D,C,D,N,C,CT".split(","),
    moral:         "C,N,N,C,D,N,C,C,N,N,N,N,D,C,N,N,D,D,N,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,D,C,N,CT,D,C,D,CT,D,C,D,CT,DT".split(","),
  },

  // Mexico: federal on paper, historically centralizing in practice (SEP national curriculum,
  // 2019 National Guard security federalization) -> moderate federal. Genuine multiparty democracy
  // since 2000, but 2024 judicial-election reform and press-freedom risk are a real recent stress
  // -> moderately democratic (below Brazil/Chile). Severe cartel violence drives a militarized
  // security response even though SCJN decriminalized personal marijuana use and abolished the
  // death penalty -> leans security. 1992 constitutional "nacion pluricultural" recognition of a
  // huge indigenous population (68 languages) vs. real enforcement of its own southern border under
  // US pressure -> leans multicultural but genuinely tempered. Estrada Doctrine (literally named
  // for a Mexican foreign minister) is the textbook non-intervention principle -> very strongly
  // non-interventionist; correspondingly low defense spending and Tlatelolco-treaty origin ->
  // strongly pacifist. State-owned Pemex/CFE and AMLO-era re-nationalization sentiment -> leans
  // public, tempered by deep USMCA private-sector integration. Banxico is constitutionally
  // independent and well-respected -> pulls against a pure planning reading. Deep USMCA/maquiladora
  // trade integration makes Mexico genuinely one of the more globalist economies in the region.
  // Uniquely fierce post-Revolution anticlerical secular-state tradition coexists with ~78% Catholic
  // identification -> genuinely mixed, more formally secular than Brazil. Major 2022 SCJN gay-
  // marriage and 2023 abortion-decriminalization rulings -> moderately progressive, tempered by
  // strong regional Catholic conservatism outside CDMX.
  mexico: {
    estrutura:     "C,C,C,C,C,D,C,C,D,D,C,D,C,D,D,C,C,CT,C,D".split(","),
    representacao: "CT,N,C,C,C,N,CT,D,C,D,C,D,D,D,CT,DT,D,N,C,D".split(","),
    poder:         "C,C,C,C,C,N,C,C,D,C,C,C,C,C,D,C,C,N,C,C".split(","),
    imigracao:     "N,C,D,C,N,C,D,C,D,CT,N,N,D,CT,N,C,DT,D,N,N".split(","),
    diplomacia:    "D,CT,DT,CT,D,CT,DT,CT,N,CT,N,CT,N,C,N,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,D,C,CT,D,CT,C,C,D,CT,DT,C,D,CT,N,C,D".split(","),
    economia:      "N,N,CT,D,N,DT,C,N,C,DT,C,C,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,D,D,C,D,C,D,C,C,C,D,D,D,C,DT,C,DT,C,D".split(","),
    comercio:      "N,C,N,CT,D,C,N,C,N,C,N,CT,N,CT,N,CT,N,CT,N,CT".split(","),
    religiao:      "C,C,C,C,C,CT,C,DT,N,CT,D,C,C,CT,C,C,D,DT,C,CT".split(","),
    moral:         "C,C,C,C,C,C,C,D,C,D,N,N,C,C,N,N,D,D,C,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,N,C,N,N,N,N".split(","),
  },

  // Chile: uniquely UNITARY in Latin America (no federated states; regional governors only elected
  // since 2021) -> strongly unitario. Stable consolidated post-1990 democracy, though the 2019
  // estallido social and two failed (2022/2023) constitutional rewrites are real recent stress ->
  // still strongly democratic overall. Carabineros human-rights criticism post-2019 vs. genuine
  // rule-of-law tradition and decriminalized personal marijuana -> moderate security lean. Real,
  // documented recent restrictionist backlash (2021 Iquique anti-migrant unrest, tightened 2021
  // immigration law) after a fast Venezuelan/Haitian influx -> leans assimilationist, a real
  // contrast with Brazil. Professional, depoliticized post-Pinochet military and Tlatelolco
  // signatory -> pacifist-leaning. The "Chicago Boys" model (privatized AFP pensions, ISAPRE
  // private healthcare) makes Chile the region's most private/free-market economy, though the 2019
  // revolt was explicitly against this model's inequality and Banxico-equivalent independence is
  // constitutionally sacred -> strongly private and strongly free-market, with real recent
  // contestation. Extensive FTA network (US, EU, China, CPTPP) makes Chile the most globalist trade
  // economy of the five. Major real secularization (Catholic identification fell from ~70%+ to
  // under half amid Church abuse scandals) -> leans irreligioso. 2022 gay marriage and 2017 partial
  // abortion decriminalization vs. strong conservative Catholic/evangelical political current
  // (Kast's runoff strength) -> genuinely contested moral. Strong mining/astronomy tech sector
  // tempered by a powerful environmental movement (Patagonia, anti-mining protests) -> near-center
  // tecnologia, notably less extreme than the placeholder.
  chile: {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,N,CT,D,C,DT,C,D,CT,D,C".split(","),
    representacao: "CT,D,CT,C,CT,D,CT,D,C,DT,C,D,D,D,CT,DT,D,C,CT,DT".split(","),
    poder:         "C,C,C,C,C,N,C,D,C,C,C,C,C,C,D,C,C,N,D,C".split(","),
    imigracao:     "C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,D,D,C,D".split(","),
    diplomacia:    "D,CT,D,CT,D,CT,DT,CT,N,CT,N,CT,C,C,N,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,D,C,C,D,CT,C,C,D,CT,DT,C,D,CT,N,C,D".split(","),
    economia:      "N,CT,D,CT,D,CT,N,CT,D,CT,D,CT,D,C,D,CT,D,CT,C,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "C,D,C,D,C,D,C,DT,C,D,C,D,C,D,C,D,C,D,C,D".split(","),
    moral:         "C,N,C,N,N,N,C,N,N,N,C,N,C,C,N,N,C,D,C,N".split(","),
    tecnologia:    "C,D,C,N,C,D,C,D,N,C,C,D,C,N,N,N,N,N,N,N".split(","),
  },

  // Bolivia: 2009 "Estado Plurinacional" constitution explicitly enshrines departmental/indigenous
  // autonomias, plus a real historical autonomista movement in Santa Cruz -> leans federal, tempered
  // by real MAS-era executive centralization. Contested/fragile democracy (2019 Evo Morales crisis
  // and resignation, Anez interim controversy, ongoing Evo-vs-Arce MAS fracture) -> moderately
  // democratic, the weakest institutionally of the five. Coca-leaf traditional use is
  // constitutionally protected (Evo's original cocalero-union political base) even as commercial
  // cocaine production is illegal -> genuinely mixed poder, more permissive on traditional-use
  // questions than the other four. The strongest formal plurinational framework of the five (36
  // officially recognized indigenous nations/languages) -> most strongly multicultural-leaning.
  // Landlocked since the 1879 War of the Pacific, pursues its core maritime-access grievance against
  // Chile via ICJ arbitration rather than force -> pacifist-leaning despite real territorial tension.
  // 2006 hydrocarbons nationalization plus constitutional "Vivir Bien" anti-neoliberal framework ->
  // the most public/planning/protectionist economy of the five. 2009 constitution explicitly
  // declared the state secular (ending the Catholic Church's prior official status) while
  // constitutionally protecting indigenous Pachamama spirituality as distinct from confessional
  // religion -> leans irreligioso in the formal-state sense. Gay marriage not legalized (civil
  // unions only, 2023) and abortion very restrictive -> leans traditionalist. The world-first "Ley
  // de Derechos de la Madre Tierra" (2010, legal personhood for Mother Earth) sits in real tension
  // with an active state lithium-industrialization push (YLB) -> leans toward Biologia, more so than
  // the placeholder.
  bolivia: {
    estrutura:     "C,D,C,D,C,D,C,N,D,D,CT,D,C,D,C,N,CT,D,C,D".split(","),
    representacao: "C,C,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,C,N,C,C,D,C,C,C,C,N,C,D,C,N,N,D,C".split(","),
    imigracao:     "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,DT,C,DT,C".split(","),
    diplomacia:    "D,CT,D,CT,D,CT,DT,CT,N,CT,N,CT,N,C,N,CT,DT,D,D,CT".split(","),
    intervencao:   "CT,D,C,C,D,C,CT,D,CT,C,C,D,CT,DT,C,D,CT,N,C,D".split(","),
    economia:      "C,D,CT,DT,C,DT,CT,D,CT,DT,C,D,C,D,C,D,CT,D,C,D".split(","),
    controle:      "CT,D,C,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,DT,C,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "C,C,C,D,C,C,C,DT,N,C,D,D,C,N,C,N,D,D,C,C".split(","),
    moral:         "D,C,D,C,C,C,D,C,D,C,D,C,D,C,D,D,D,C,D,C".split(","),
    tecnologia:    "N,C,D,C,D,C,D,C,D,D,D,C,D,C,D,C,D,C,D,C".split(","),
  },
};
