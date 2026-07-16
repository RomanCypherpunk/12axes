// FQA046: islandia-medieval, emirados-arabes-unidos, portugal-estado-novo, prussia, polonia.

export const PROFILES = {
  // Islandia Medieval: THE textbook stateless society -- no central executive at all, organized via
  // local chieftains (godar) and the Althing assembly resolving disputes through law -> among the
  // most extreme federal/decentralized profiles in the dataset. Real assembly-based lawmaking, though
  // full participation was tied to being a free landowning man (thralls/slaves and women had limited
  // roles) -> leans democratic, moderately, given this genuine but bounded assembly tradition. NO
  // standing police or executive enforcement -- law was enforced through private/family feuds and
  // honor-based justice, definitionally minimal STATE coercive capacity -> extremely liberdade.
  // Settled by a relatively homogeneous Norse (and some Celtic) population, though there was no
  // central authority to enforce any unified cultural policy either way -> near-center imigracao. No
  // standing military/state army at all, even though private feuding violence was endemic -> leans
  // pacifista in the state-militarism sense. Essentially no capacity or interest in external
  // intervention, an extremely isolated small-island society focused entirely inward -> extremely
  // nao-intervencionista. Real private property in land held by chieftains and free farmers -> leans
  // privado. Genuinely minimal economic regulation given the total absence of centralized state
  // capacity -> extremely livre mercado. Real trade with Norway and other Norse settlements existed,
  // but the society was largely self-sufficient given its remote geography -> near-center comercio.
  // A genuinely unusual case: Iceland converted to Christianity via a real ALTHING VOTE in 999/1000
  // AD -- a famous instance of a whole society legally adopting a religion by assembly consensus
  // rather than conquest -- from an initial Norse-pagan baseline, with real transitional tolerance of
  // private pagan practice -> leans religioso, moderately, reflecting the eventual Christian
  // establishment. The sagas depict real (for the era) notable legal protections for women's
  // property/divorce rights, though the society remained fundamentally hierarchical and practiced
  // thralldom -> leans tradicionalista overall. A subsistence agrarian/fishing pre-industrial society
  // with no significant technological distinctiveness -> leans strongly toward the Biologia pole.
  "islandia-medieval": {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,C,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,N,D,C,D,C,C,C,D".split(","),
    poder:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    imigracao:     "N,C,N,N,N,N,C,N,N,C,N,N,N,N,N,C,D,D,N,N".split(","),
    diplomacia:    "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,C,D,CT,DT,CT,DT,CT".split(","),
    intervencao:   "CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,D,CT,DT,CT,DT,CT,D,CT,DT".split(","),
    economia:      "DT,CT,DT,CT,DT,CT,N,CT,DT,CT,DT,C,N,C,DT,N,DT,CT,N,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "C,D,C,N,C,C,C,D,C,C,C,N,N,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,C,D,C,D,N,C,C".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,D,D,C".split(","),
    tecnologia:    "D,CT,D,C,D,C,D,C,N,D,D,C,D,C,D,C,C,C,D,C".split(","),
  },

  // Emirados Arabes Unidos: a real federation of 7 emirates, each with its own ruler and genuinely
  // distinct economic policies (Dubai vs. Abu Dhabi have real different economic models) -> strongly
  // federal. Absolute monarchies at the emirate level; the Federal National Council has only limited
  // advisory power (partly appointed, partly elected via a very restricted electorate) -> extremely
  // autocratic. Real extensive digital surveillance and restrictions on political speech/organizing
  // -> strongly seguranca. Over 80% of the population is foreign expatriate labor under a kafala-
  // style sponsorship system with NO path to citizenship -- like Saudi Arabia, a genuinely
  // exclusionary closed-citizenship model despite the massive day-to-day multicultural population ->
  // leans assimilacao, a correction from the placeholder's near-center/multicultura-leaning reading.
  // Real significant defense spending and active participation in the Saudi-led Yemen war coalition
  // -> leans militarist. Assertive regional posture in Yemen tempered by real pragmatic normalization
  // diplomacy (the 2020 Abraham Accords) -> near-center intervencao. Explicit strategic
  // diversification away from oil (Dubai's huge private real-estate/finance/tourism economy) even as
  // Abu Dhabi's ADNOC remains a massive state oil company and sovereign wealth funds (ADIA, Mubadala)
  // are hugely state-directed -> near-center economia/controle, genuinely mixed. Dubai is a massive
  // global trade/logistics/re-export hub with free zones explicitly designed for frictionless global
  // trade -> extremely globalista. Islam is the official state religion, though notably more
  // religiously liberal in practice than Saudi Arabia (licensed alcohol, real tolerance of other
  // faiths' private worship, permitted church/temple construction) -> leans religioso but less
  // extreme than the placeholder. Real significant recent legal liberalization (decriminalized
  // unmarried cohabitation in 2020, alcohol-law reform, tourism-driven social opening), though still
  // criminalizes homosexuality -> leans tradicionalista but less extreme than the placeholder, given
  // this real recent trajectory. Explicit hyper-modern tech branding (the 2021 Mars orbiter mission,
  // the world's first dedicated AI ministry, Masdar City) -> among the most extreme pro-Tecnologia
  // profiles in the dataset.
  "emirados-arabes-unidos": {
    estrutura:     "CT,DT,CT,DT,CT,DT,CT,DT,C,DT,C,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "N,C,N,N,C,D,C,D,C,D,N,D,C,D,N,D,DT,D,N,D".split(","),
    diplomacia:    "C,D,C,D,CT,D,C,D,C,D,C,C,CT,C,C,D,C,DT,C,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,C,D,C,D,C,C,D,D,C,D,C,D,C".split(","),
    economia:      "N,C,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "C,C,D,C,N,N,C,C,D,CT,D,CT,DT,CT,N,CT,D,DT,N,C".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "D,C,D,C,C,C,D,C,N,C,D,C,D,C,D,C,D,N,C,C".split(","),
    moral:         "D,C,D,C,D,C,D,N,D,C,D,C,D,C,D,N,D,D,D,C".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,CT,CT,D,CT,DT,C,DT,CT,D,C,C,CT,DT".split(","),
  },

  // Portugal Estado Novo: highly centralized authoritarian corporatist state, suppressed local
  // autonomy -> strongly unitario. The Uniao Nacional was the only legal political organization for
  // most of the period, heavily restricted/controlled elections -> extremely autocratic. PIDE secret
  // police, real severe repression -- notably without the mass-mobilization/mass-rally character of
  // German/Italian fascism, a more "quiet," bureaucratic-authoritarian regime -> strongly seguranca.
  // Maintained a vast colonial empire (Angola, Mozambique, etc.) under an explicit "pluricontinental"
  // Lusotropicalismo ideology claiming one unified multi-racial nation across continents, which in
  // practice required a real colonial "assimilados" policy (Africans had to adopt Portuguese
  // language/culture/religion to gain limited legal rights) -> strongly assimilacao. Fought real,
  // prolonged, costly Colonial Wars (1961-1974) in Angola, Mozambique, and Guinea-Bissau against
  // independence movements -> leans militarist, more than the placeholder given this real sustained
  // conflict. A defensive-imperial posture fighting to RETAIN existing colonies rather than expand
  // into new ones -> leans nacionalista, moderately. Real significant corporatist state economic
  // organization (guilds/syndicates) alongside real private colonial-extraction capitalism ->
  // near-center economia. Real significant state economic direction (corporatist planning, early
  // autarkic tendencies) -> leans planejamento. A real colonial-trade-protectionist system (empire
  // trade preferences), relatively isolated from European integration until late in the regime ->
  // leans protecionista. "Deus, Patria e Familia" (God, Fatherland, Family) was literally the
  // regime's motto; a Concordat with the Vatican gave the Church real institutional privilege ->
  // among the most extreme religioso profiles. Extremely traditionalist Catholic social doctrine,
  // severe restrictions on women's rights, censorship of "immoral" content -> among the most extreme
  // tradicionalista profiles. Real limited technological modernization for most of the period --
  // the regime deliberately kept Portugal a "proudly poor" (orgulhosamente sos) rural, agrarian
  // society as a matter of conservative ideology, wary of "corrupting" modernization -> leans toward
  // the Biologia pole.
  "portugal-estado-novo": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "C,D,C,D,CT,D,C,D,C,D,CT,C,CT,C,C,D,C,DT,C,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "N,D,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,C,N,D".split(","),
    controle:      "C,D,C,C,C,D,CT,D,C,D,CT,D,DT,D,C,C,C,DT,C,D".split(","),
    comercio:      "C,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "D,C,D,C,D,C,D,C,N,D,D,C,D,C,D,C,C,C,D,C".split(","),
  },

  // Prussia: highly centralized monarchical-bureaucratic cameralist state, though real Junker
  // aristocratic power persisted at the local level -> leans unitario. An absolute/constitutional
  // monarchy with a real Landtag after 1848, heavily weighted toward wealthy/aristocratic interests
  // via the deliberately anti-egalitarian three-class franchise system -> extremely autocratic. A
  // famously disciplined bureaucratic-military state with mandatory conscription, though real
  // developed legal-administrative traditions existed too -> strongly seguranca. Explicit
  // "Germanization" policies especially targeting Polish populations in the eastern territories
  // (suppressed Polish language/culture, forced-settlement policy) -> strongly assimilacao. THE
  // defining trait: the "army with a state" reputation (Frederick the Great's military build-up, the
  // disciplined tradition that later drove German unification through Bismarck's wars) -> among the
  // most extreme militarist profiles. Real significant territorial expansion through war (the
  // Silesian Wars, the Wars of German Unification against Denmark, Austria, and France) -> strongly
  // nationalist-assertive. Real significant state economic role via cameralist doctrine (explicitly
  // organizing the state around maximizing revenue through active management) alongside real private
  // Junker landed estates -> near-center economia. Cameralism IS, literally, a doctrine of active
  // state economic direction -- an unusually apt fit -> strongly planejamento. Real significant
  // mercantilist trade policy (the Zollverein customs union it later organized was about managed
  // regional trade integration, not free-market globalism) -> leans protecionista. A real established
  // Evangelical (Lutheran) state church (Prussian kings were its head), tempered by real notable
  // Enlightenment-era religious tolerance under Frederick the Great (welcomed Huguenot refugees, real
  // legal protections for Jewish and Catholic subjects) -> leans religioso, moderately. A
  // hierarchical, patriarchal, militaristic-disciplinarian social order ("Kadavergehorsam" -- corpse-
  // like obedience), tempered by real Enlightenment-influenced legal reforms under Frederick the
  // Great -> leans tradicionalista overall, given the militarist-hierarchical character dominates.
  // Real significant administrative/military-organizational innovation (one of the first states with
  // mandatory universal education, explicitly to serve state/military efficiency) within a
  // fundamentally agrarian Junker-estate economy -> near-center tecnologia, leaning toward the
  // administrative-modernization side.
  prussia: {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,N,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,D,CT,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "N,C,C,D,N,C,N,C,C,D,C,C,C,D,N,N,C,N,N,D".split(","),
    controle:      "CT,D,C,C,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "C,D,C,D,C,D,C,D,C,N,C,C,C,N,C,N,C,N,C,D".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "D,C,DT,CT,D,C,D,C,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,C,N,N,N,C,N".split(","),
  },

  // Polonia: unitary state (16 voivodeships with real but limited autonomy), historically centralized
  // administrative tradition -> near-center estrutura. Competitive democracy since 1989 (the
  // Solidarity legacy), stressed by real 2015-2023 PiS-era judicial-independence and media-capture
  // concerns, followed by a real democratic-recovery under the 2023 Tusk government -> leans
  // democratic, reflecting this genuine institutional resilience. A broadly EU-standard civil-
  // liberties framework, though the PiS era saw real controversial restrictions (the 2020 near-total
  // abortion ban sparking the country's largest protests since communism, "LGBT-ideology-free zones"
  // declared by some municipalities) -> near-center poder. A strong Catholic-nationalist identity,
  // notably restrictive toward non-European migrants during the 2015 EU crisis (PiS refused EU
  // relocation quotas), while genuinely welcoming millions of Ukrainian refugees post-2022 -- a real
  // pattern of ethnic-cultural-proximity-based selective openness -> strongly assimilacao. Real
  // substantial recent military buildup, becoming one of NATO's most militarized members per capita
  // especially post-2022, driven by historical trauma of Russian/Soviet domination and proximity to
  // the war in Ukraine -> leans militarist, more than the placeholder. A deeply NATO-alliance-bound
  // posture rather than independently interventionist, though real historical anti-Russian
  // sovereigntist assertiveness -> near-center intervencao. Real significant 1990s post-Communist
  // "shock therapy" privatization tempered by real substantial EU-integration social-market elements
  // -> leans privado, moderately. An independent central bank (NBP) and broadly market-oriented
  // post-Communist transition, though the PiS era saw real state re-nationalization tendencies in
  // energy -> near-center controle. Deeply EU-Single-Market-integrated -> leans globalista, more than
  // the placeholder given this structural EU integration. One of Europe's most Catholic-identified
  // societies historically, with real recent rapid secularization especially among youth (notably
  // accelerated by the 2020 abortion-ban protests, which had a real explicit anticlerical dimension)
  // -> strongly religioso, reflecting the historical Catholic-national-identity fusion despite the
  // real recent trend. The PiS era's explicit anti-LGBT rhetoric and the 2020 near-total abortion ban
  // make Poland one of the more socially conservative EU states politically, even amid real growing
  // social contestation (reflected in the 2023 election) -> strongly tradicionalista. Real
  // significant recent tech/IT-services growth, tempered by real Catholic-conservative bioethics
  // caution on some issues -> moderate tecnologia.
  polonia: {
    estrutura:     "C,C,C,C,C,D,C,N,D,C,C,C,C,D,D,C,C,C,C,D".split(","),
    representacao: "C,N,C,C,C,N,C,C,C,D,C,C,N,D,C,D,C,C,C,D".split(","),
    poder:         "C,C,C,CT,N,C,C,D,C,C,N,C,C,CT,D,C,N,N,D,C".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,CT,D,CT,DT,C,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,C,D,CT,D,C,D,C,D,CT,C,CT,C,C,D,C,DT,CT,D".split(","),
    intervencao:   "C,C,C,C,C,C,C,C,C,N,C,D,CT,D,C,C,C,N,C,D".split(","),
    economia:      "D,CT,D,CT,D,C,N,CT,D,C,D,C,N,C,D,CT,D,CT,C,CT".split(","),
    controle:      "C,C,D,C,N,N,C,C,D,CT,D,CT,DT,CT,N,CT,D,DT,N,C".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "D,C,DT,CT,DT,C,D,CT,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,N,N,C,N,C,N,D,N,C,N".split(","),
  },
};
