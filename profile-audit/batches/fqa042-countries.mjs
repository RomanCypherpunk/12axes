// FQA042: republica-de-veneza, imperio-otomano, reino-unido-vitoriano-imperio-britanico,
// imperio-do-brasil, alemanha-nazista-terceiro-reich -- historical entities, same interpretive
// method as FQA041 (spirit-of-the-question over literal anachronism, grounded in documented facts).

export const PROFILES = {
  // Republica de Veneza: a single city-state republic (like Athens/Sparta) governing an extensive
  // maritime/mainland empire (Stato da Mar, Terraferma) with real varying local autonomy for subject
  // territories -> leans unitario for the core republic, moderated by real imperial administrative
  // variation. Famous OLIGARCHIC republic: the Doge was elected via a deliberately convoluted
  // process to prevent faction dominance, and the Great Council was hereditarily closed to fixed
  // patrician families after the 1297 "Serrata" -> real elective/republican institutions but
  // genuinely closed to a hereditary aristocracy -> leans autocratic, moderately. The Council of Ten
  // ran an extensive internal-surveillance apparatus (including anonymous denunciation boxes, the
  // "bocca di leone") specifically to protect the oligarchic order from subversion -> leans
  // seguranca. A major cosmopolitan Mediterranean trade hub (merchants from across the Levant, a
  // historically significant if segregated Jewish ghetto) even though political participation stayed
  // closed to the patrician class -> leans multicultura commercially despite closed citizenship.
  // Maintained a real powerful navy contesting Ottoman/other powers for maritime dominance while also
  // running sophisticated diplomatic/intelligence networks -> leans militarist, moderately. Pursued
  // extensive maritime-colonial expansion (Stato da Mar) -> leans nationalist-assertive. THE
  // preeminent European mercantile-capitalist power of its era -- private commercial enterprise was
  // the core of its economy -> strongly privado, tempered by real significant state direction of
  // strategic trade (the state-owned Arsenal shipyard, state-organized trade convoys) -> leans
  // planejamento moderately despite the market character. Definitionally a trade empire (dominated
  // Mediterranean commerce for centuries) -> extremely globalista. A Catholic state with a famously
  // pragmatic/often-adversarial relationship with the Papacy, and real (if segregated) tolerance of
  // its Jewish community for economic reasons -> leans irreligioso relative to more theocratic
  // contemporaries. A hierarchical aristocracy with a genuinely vibrant, relatively tolerant cultural
  // life for its era (Carnival culture) -> near-center moral rather than extremely traditionalist.
  // The Arsenal was a genuine marvel of proto-industrial mass-production shipbuilding, alongside real
  // significant navigational/cartographic innovation -> leans pro-Tecnologia.
  "republica-de-veneza": {
    estrutura:     "D,C,D,C,D,C,D,C,DT,C,N,C,D,C,DT,C,D,C,D,C".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "CT,D,CT,C,C,N,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,N".split(","),
    diplomacia:    "N,C,D,C,N,C,D,C,N,C,C,D,C,C,N,C,D,D,N,C".split(","),
    intervencao:   "D,C,D,C,D,C,C,C,D,C,D,C,C,D,D,C,D,N,D,C".split(","),
    economia:      "D,CT,D,CT,D,CT,N,CT,D,CT,D,CT,D,C,D,CT,D,CT,C,CT".split(","),
    controle:      "C,C,D,C,N,N,C,C,D,CT,D,C,DT,C,N,CT,D,DT,N,C".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "C,D,C,D,C,D,N,D,C,D,C,D,C,D,C,D,C,D,C,N".split(","),
    moral:         "C,N,C,N,C,D,C,D,C,D,C,N,D,C,N,N,C,D,C,C".split(","),
    tecnologia:    "CT,DT,C,DT,C,D,N,N,C,N,C,DT,C,D,C,D,N,N,C,DT".split(","),
  },

  // Imperio Otomano: centralized absolutist empire under the Sultan, though the "millet system"
  // gave real communal self-governance to religious minorities over their own internal affairs ->
  // leans unitario with real administrative pluralism. Absolute monarchy (the Sultan combined
  // political and religious/Caliphal authority), no elected institutions -> extremely autocratic.
  // Extensive control apparatus (Janissary corps, harsh suppression of revolts) tempered by real
  // millet-system communal autonomy -> leans seguranca. The millet system is a genuinely significant
  // historical example of institutionalized multi-religious coexistence (famously welcomed Jews
  // expelled from Spain in 1492), even though non-Muslims paid the jizya tax and held lesser legal
  // status -> leans multicultura relative to more homogeneous/assimilationist entities. A major
  // military power for centuries (conquered Constantinople 1453, extensive conquests across three
  // continents) -> strongly militarist and strongly nationalist-assertive/expansionist. Real
  // significant state control of strategic sectors (the timar land-tenure system tied military
  // service to state land grants, state monopolies on certain goods) -> leans publico/planejamento.
  // Controlled crucial East-West trade routes for centuries (a major reason European powers sought
  // alternate sea routes, spurring the Age of Exploration) -> leans protecionista given this
  // strategic trade-chokepoint-control character. The Sultan was also Caliph (supreme Sunni Islamic
  // authority), sharia law was foundational for the Muslim population -> among the most religioso
  // profiles despite the millet system's pluralistic accommodation of other faiths. Hierarchical,
  // patriarchal, a traditional sharia-based legal framework -> strongly tradicionalista. Real
  // significant scientific/technical achievement in earlier centuries (astronomy, medicine,
  // architecture), but a real, well-documented relative technological stagnation in its later
  // centuries as industrializing Europe pulled ahead (the "Sick Man of Europe" framing) -> leans
  // toward the traditional/Biologia pole overall, reflecting its later, defining trajectory.
  "imperio-otomano": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,C,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "D,CT,D,C,D,CT,D,CT,D,CT,D,CT,DT,C,DT,CT,DT,CT,D,CT".split(","),
    poder:         "CT,D,CT,C,C,N,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,C,D,N".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "C,D,CT,D,C,DT,CT,N,CT,DT,C,D,C,D,C,D,CT,N,C,D".split(","),
    controle:      "C,D,C,C,C,D,C,D,C,C,C,D,N,D,C,C,C,DT,N,D".split(","),
    comercio:      "CT,DT,C,D,C,D,CT,DT,C,D,CT,D,CT,D,C,D,CT,D,C,DT".split(","),
    religiao:      "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "D,CT,D,C,D,C,D,C,N,D,D,C,D,C,D,C,C,C,D,C".split(","),
  },

  // Reino Unido Vitoriano / Imperio Britanico: a unitary parliamentary monarchy at its core
  // (England/Scotland/Wales/Ireland under Westminster), though the empire's crown colonies vs.
  // increasingly self-governing dominions (Canada, Australia) show real administrative diversity ->
  // leans unitario for the core state. Real parliamentary democracy domestically (though suffrage
  // was still property/gender-limited through most of the era, only gradually expanding), while the
  // vast colonial population had NO representation at all -- a defining metropole/colony gap ->
  // moderate representacao, reflecting the genuine domestic parliamentary tradition. Vigorous
  // domestic civil-liberties tradition (habeas corpus, free press, common law) for British subjects
  // specifically, set against real often-brutal colonial control (the suppression of the 1857 Indian
  // Rebellion, numerous punitive colonial expeditions) -> leans seguranca overall given the empire's
  // fundamentally coercive colonial character. Ruled immense ethnic/religious colonial diversity in
  // scope, but through an explicit ideology of racial hierarchy and British-cultural superiority (the
  // "civilizing mission") -- NOT multiculturalism in the modern egalitarian-pluralist sense -> leans
  // assimilacao. The world's preeminent naval/military power at its Victorian peak ("Rule
  // Britannia") -> extremely militarist. The most extensive colonial empire in history at its peak
  // ("the empire on which the sun never sets") -> extremely nationalist-assertive/expansionist. The
  // birthplace of industrial capitalism, the paradigmatic private-enterprise economy of its era
  // (though the East India Company was a real quasi-state chartered commercial-imperial hybrid) ->
  // strongly privado. Famously the home of laissez-faire doctrine (the 1846 Corn Laws repeal,
  // dominant free-trade ideology) -> strongly livre mercado. Pioneered and championed global free
  // trade as explicit state policy ("Pax Britannica" free-trade imperialism) -> extremely globalista.
  // The Church of England was the established church and real strong social-religious conformity was
  // expected ("Victorian values"), even as Enlightenment-legacy scientific/secular currents grew
  // within elite intellectual life (Darwin published in this era) -> leans religioso. THE origin of
  // "Victorian morality" -- extremely conservative sexual/gender norms, rigid class hierarchy,
  // patriarchal family structure -> extremely tradicionalista. The leading power of the Industrial
  // Revolution (steam engines, railways, telegraph) -> extremely pro-Tecnologia.
  "reino-unido-vitoriano-imperio-britanico": {
    estrutura:     "D,C,D,C,D,C,D,CT,DT,C,C,CT,D,C,DT,C,D,CT,D,C".split(","),
    representacao: "C,N,C,C,C,N,C,D,C,D,C,D,N,D,C,D,C,C,C,D".split(","),
    poder:         "CT,D,CT,C,C,D,CT,D,C,D,CT,D,C,D,C,D,CT,N,CT,D".split(","),
    imigracao:     "D,C,D,C,D,C,D,C,D,N,D,C,D,C,D,C,DT,D,D,N".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "DT,CT,D,CT,DT,CT,DT,CT,D,CT,D,CT,C,D,CT,DT,D,CT,D,CT".split(","),
    economia:      "D,CT,D,CT,D,CT,N,CT,D,CT,D,C,N,C,D,CT,D,CT,C,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
    religiao:      "D,C,D,C,C,CT,D,C,N,CT,D,C,D,CT,D,C,D,N,C,C".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "CT,DT,C,DT,CT,D,C,DT,C,N,CT,D,C,D,CT,D,C,C,CT,DT".split(","),
  },

  // Imperio do Brasil: a constitutional monarchy but genuinely quite centralized by deliberate
  // design -- unlike the later Republic's federalism, the Emperor held the unique "Poder Moderador"
  // (Moderating Power) and provincial presidents were APPOINTED centrally, not elected, precisely to
  // avoid the fragmentation other newly-independent Latin American states suffered -> strongly
  // unitario. Had a real elected Chamber of Deputies (though with a highly restricted income/literacy
  // "voto censitario"), but the Poder Moderador let the Emperor dissolve parliament/dismiss ministers
  // essentially at will -- real elected trappings under real monarchical supremacy -> leans
  // autocratic, though less extremely than an absolute monarchy given the genuine elected chamber.
  // Relatively orderly/stable by regional standards ("island of monarchical stability" amid Latin
  // American republican coups), but built on chattel slavery -- Brazil was the LAST country in the
  // Americas to abolish it, in 1888 -- a severe, defining "control over persons" fact -> strongly
  // seguranca. Pursued explicit state-sponsored European-immigration schemes motivated substantially
  // by "whitening" (branqueamento) ideology -> strongly assimilacao, an explicit ethnic-hierarchical
  // policy, not pluralist multiculturalism. Fought the Paraguayan War (1864-1870), the bloodiest
  // interstate war in South American history, with Brazil's military dominant in the conflict ->
  // leans militarist. That war's origins involved real direct Brazilian intervention in Uruguayan
  // internal politics -> leans nationalist-assertive. An agrarian-export slave economy (coffee,
  // sugar) built on private plantation ownership (if of both land and enslaved people) rather than
  // state ownership of production -> leans privado. Minimal 19th-century state regulatory/planning
  // capacity, essentially a market-based (if slavery-based) agricultural economy -> leans livre
  // mercado. A real significant export-dependent economy integrated into the British-dominated
  // global trading system (Britain pressured Brazil diplomatically/navally to end the slave trade
  // specifically) -> leans globalista. Catholicism was the constitutionally OFFICIAL state religion
  // (the Padroado system gave the Emperor real authority over Church appointments) -> strongly
  // religioso. A deeply hierarchical, patriarchal, slave-holding society -> strongly tradicionalista.
  // Limited industrial development for most of the era (a fundamentally agrarian empire), though
  // Pedro II personally had genuine, well-documented scientific/technological enthusiasms (patronized
  // science, brought the telegraph and early railways to Brazil) -> near-center tecnologia,
  // reflecting this real tension between elite modernizing enthusiasm and agrarian-slave reality.
  "imperio-do-brasil": {
    estrutura:     "D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT".split(","),
    representacao: "C,D,C,C,C,D,C,D,C,D,C,D,D,C,C,D,D,C,C,D".split(","),
    poder:         "CT,D,CT,D,CT,D,CT,D,C,D,CT,D,C,D,C,D,CT,D,CT,D".split(","),
    imigracao:     "CT,DT,CT,DT,C,DT,CT,DT,C,D,CT,DT,C,DT,C,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,D,CT,DT,CT,D,C,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D".split(","),
    intervencao:   "D,C,D,C,D,C,D,CT,D,C,D,CT,D,CT,D,C,D,C,D,CT".split(","),
    economia:      "D,CT,D,CT,D,CT,N,CT,D,CT,D,C,C,C,D,CT,D,CT,C,CT".split(","),
    controle:      "D,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,D,CT".split(","),
    comercio:      "D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,CT,D,C".split(","),
    religiao:      "D,C,D,C,D,CT,D,C,N,CT,D,C,D,CT,D,C,D,D,C,CT".split(","),
    moral:         "D,C,DT,CT,DT,C,D,CT,D,C,D,C,D,CT,D,D,D,C,D,C".split(","),
    tecnologia:    "C,D,C,N,C,D,N,N,D,N,C,D,C,N,C,N,D,N,C,N".split(","),
  },

  // Alemanha Nazista (Terceiro Reich): the deliberate Gleichschaltung policy eliminated the Lander's
  // real Weimar-era autonomy, coordinating all regional/civil-society structures into total Nazi
  // Party control -> extreme unitario. Total one-party dictatorship after the Reichstag Fire
  // Decree/Enabling Act (1933), all opposition banned, no free elections thereafter -> extreme
  // autocratic, at or near the dataset's floor. The definitional totalitarian security state
  // (Gestapo, concentration camps from 1933, extermination camps for the Holocaust, total
  // suppression of dissent) -> extreme seguranca, at or near the dataset's ceiling. The definitional
  // case of extreme racial-exclusionary/genocidal ideology (the Nuremberg Laws, the Holocaust,
  // explicit "Lebensraum" ethnic-cleansing expansionism) -> extreme assimilacao, at or near the
  // dataset's ceiling. The most militarist regime in modern history (total-war rearmament violating
  // Versailles, WWII) -> extreme militarist. The most extreme expansionist-interventionist regime in
  // this dataset (invaded most of Europe under an explicit Lebensraum conquest doctrine) -> extreme
  // nationalist-assertive. A real complex case economically: officially anti-Marxist rhetoric while
  // preserving private industrial ownership (Krupp, IG Farben remained private) under total state
  // war-mobilization direction -- a corporatist hybrid -> near-center economia but extreme
  // planejamento (the Four-Year Plan, total war-economy mobilization, forced labor allocation).
  // Pursued explicit autarky as ideology (Lebensraum was partly about self-sufficiency to avoid a
  // WWI-style blockade) -> extreme protecionista. A genuinely complex religious case: a 1933
  // Concordat with the Vatican alongside real persecution of resistant church leaders, and an
  // explicit pseudo-pagan racial-mysticism strand promoted among the SS specifically ("Positive
  // Christianity" was itself an ideologically distorted, state-subordinated version) -- religion was
  // subordinated to racial-state ideology rather than either secular or conventionally religious ->
  // leans religioso moderately, reflecting the real institutional Christian entanglement and
  // racial-mystical elements, while flagging this as a genuinely complex case. Extreme reactionary
  // gender ideology ("Kinder, Kuche, Kirche"), pronatalist policy, and the persecution of
  // homosexuals (the pink-triangle camp victims) -> extreme tradicionalista, at or near the dataset's
  // floor. Real significant military-industrial technological investment (V-2 rockets, jet aircraft)
  // pursued aggressively alongside a simultaneous romanticized agrarian-racial-purity "Blut und
  // Boden" (blood and soil) countercurrent -> near-center tecnologia, reflecting this real internal
  // tension.
  "alemanha-nazista-terceiro-reich": {
    estrutura:     "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    representacao: "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT".split(","),
    poder:         "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT".split(","),
    diplomacia:    "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    intervencao:   "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,C,DT,CT,DT,D,CT,D,CT".split(","),
    economia:      "N,D,C,D,N,C,N,C,C,D,N,C,C,D,N,N,C,C,N,D".split(","),
    controle:      "CT,DT,C,C,C,DT,CT,DT,CT,DT,CT,DT,C,DT,CT,DT,CT,DT,CT,DT".split(","),
    comercio:      "CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
    religiao:      "D,C,D,C,D,C,D,C,N,C,D,C,D,C,D,C,D,C,D,C".split(","),
    moral:         "DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT,DT,DT,CT,DT,CT".split(","),
    tecnologia:    "C,D,C,D,C,D,C,D,N,C,C,D,C,N,C,N,D,N,C,D".split(","),
  },
};
