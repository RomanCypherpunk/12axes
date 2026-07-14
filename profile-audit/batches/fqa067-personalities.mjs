// FQA067 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// benjamin-disraeli: British PM, formulated "One Nation" paternalist conservatism — his own
//   government passed the 1867 Reform Act ("a leap in the dark") extending suffrage to urban working-
//   class men, alongside public-health and factory-reform legislation, while championing imperial
//   expansion (buying Suez Canal shares, making Victoria "Empress of India" 1876).
// khomeini: led the 1979 Iranian Revolution, created the Islamic Republic on "velayat-e faqih"
//   (guardianship of the jurist) — clerics directly govern as supreme legal/political authority,
//   mandated hijab and gender segregation, ordered the 1988 mass executions of political prisoners,
//   issued an extraterritorial fatwa against Salman Rushdie.
// jabotinsky: founded Revisionist Zionism — the "Iron Wall" doctrine argued Arab acceptance of a
//   Jewish state would only come after military deterrence made resistance futile, founded the WWI
//   Jewish Legion and the Betar youth movement, but genuinely envisioned the future Jewish state as a
//   liberal parliamentary democracy, not an authoritarian one.
// ahad-haam: founded Cultural Zionism — argued national political sovereignty should follow, not
//   precede, a Hebrew-language cultural/ethical revival, envisioned Palestine as a "spiritual center"
//   for world Jewry rather than a single mandatory homeland, explicitly critical of premature mass
//   political-territorial Zionism.
// curtis-yarvin: as "Mencius Moldbug," founded neoreaction's "neocameralism" — proposes replacing
//   democracy with a state run like a corporation under a single sovereign CEO-monarch accountable to
//   shareholders rather than citizens, explicitly anti-democratic ("the Cathedral" critique), Silicon-
//   Valley-adjacent and influential on parts of the tech-right (Thiel, Vance).

const BENJAMIN_DISRAELI = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A genuine parliamentary reformer within the constitutional-monarchy system — his own government
  // passed the 1867 Reform Act extending the franchise to urban working-class men, a real, deliberate
  // expansion of political participation from a Conservative government.
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  // "One Nation" conservatism sought to integrate the working classes into the national community
  // rather than either excluding or radically transforming them — reformist inclusion within existing
  // British national identity.
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Championed British imperial expansion (purchasing Suez Canal shares 1875, the Royal Titles Act
  // making Victoria Empress of India 1876) — genuine imperial assertiveness, though tempered by his
  // "peace with honour" diplomacy at the 1878 Congress of Berlin.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "One Nation" paternalism explicitly favored using state authority to improve working-class
  // conditions (Public Health Act, factory reforms) while remaining committed to private property and
  // established economic hierarchy — a genuinely moderate, reform-minded conservative economics.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Converted from Judaism to Anglicanism as a child (a legal necessity for a British political career
  // at the time) yet remained proud of and vocal about his Jewish heritage throughout his career — a
  // genuinely complex, moderate religious identity rather than either devout orthodoxy or secularism.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // A committed monarchist and social traditionalist, though his paternalist reforms reflect a
  // pragmatic, not rigidly reactionary, conservatism.
  moral: ["D","C","D","C","D","C","D","N","D","C","D","C","D","N","N","C","N","C","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const KHOMEINI = {
  // "Velayat-e faqih" (guardianship of the jurist) explicitly concentrates supreme religious-legal
  // authority in a single Supreme Leader overseeing the entire state — a maximally centralized
  // theocratic structure with no genuine regional autonomy.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Elections exist for the presidency and parliament, but the unelected Guardian Council vets all
  // candidates for ideological conformity and the Supreme Leader holds final authority over all state
  // decisions — a tightly bounded, clerically-controlled electoral facade.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Ordered the 1988 mass executions of thousands of political prisoners, suppressed secular and
  // leftist opposition after the revolution, mandated hijab and enforced strict "morality police"
  // surveillance of daily conduct — extensive, systematic religious-coercive state violence.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Explicitly sought to export the Islamic Revolution to other Shia populations across the region
  // (supporting proxy movements) while fighting the defensive Iran-Iraq War — real, if indirect,
  // interventionist ideological ambition beyond Iran's own borders.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  economia: ["C","D","C","D","C","D","C","C","C","D","N","C","C","D","N","D","C","D","N","C"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // The literal foundation of the state — Islamic religious law (Sharia) as supreme, with the Supreme
  // Leader as its ultimate clerical-political interpreter; church and state were not merely fused but
  // identical.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Mandated hijab, gender segregation in public life, and issued the 1989 fatwa condemning Salman
  // Rushdie to death for blasphemy — among the most extreme, explicitly religiously-coercive social
  // orders audited in this project.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Broadly wary of Western cultural/technological influence as corrupting, though the Islamic
  // Republic did pursue some strategic technology development (the nuclear program's early roots) as a
  // matter of state self-sufficiency rather than cultural embrace of modernity per se.
  tecnologia: ["D","C","D","C","D","C","N","C","DT","C","D","C","D","C","D","D","D","C","N","D"],
};

const JABOTINSKY = {
  // Envisioned a unitary Jewish nation-state built around a strong central government capable of
  // rapid institution-building and defense — less concerned with devolved local government than with
  // establishing sovereign state capacity from scratch.
  estrutura: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","D","N","C","D","D"],
  // Genuinely envisioned the future Jewish state as a liberal parliamentary democracy with full civil
  // rights (including for its Arab minority, at least in his formal theoretical writings) — a real,
  // documented democratic commitment distinct from many contemporary ethnonationalist movements.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  // Founded the Jewish Legion (British Army units) and the Betar paramilitary youth movement — real,
  // organized military mobilization, though channeled through recognized state military structures
  // rather than independent terrorism.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  // Advocated mass Jewish immigration to Palestine explicitly to achieve a Jewish demographic majority
  // as the precondition for a Jewish state — a defining, explicit demographic-nationalist project.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // The "Iron Wall" doctrine explicitly argued that only overwhelming, visible Jewish military strength
  // would eventually force Arab acceptance of a Jewish state — deterrence-through-strength as
  // foundational strategic doctrine.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Focused his movement's ambition specifically on securing Jewish sovereignty within Mandate
  // Palestine rather than broader regional power projection — assertive but geographically bounded
  // nationalism.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Emphasized rapid, state-led development of infrastructure/industry/military capacity in the new
  // Jewish homeland as a matter of security necessity — a more urgently statist economic vision than
  // Ahad Ha'am's cultural gradualism or Disraeli's incremental parliamentary reformism.
  economia: ["C","D","C","D","D","D","C","C","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Favored building strong national economic/military institutions quickly rather than either
  // Disraeli's incremental Victorian state regulation or Ahad Ha'am's minimal-institution cultural focus.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","N","C"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A largely secular Jewish nationalist who respected religious tradition as part of national
  // identity without personally being religiously observant — moderate, culturally-inflected rather
  // than theocratic.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","N","N","C","N","C","C","D","C","D","C","D","N","D","C","N"],
};

const AHAD_HAAM = {
  // Favored organic, decentralized community/cultural institution-building (local Hebrew schools,
  // presses, ethical societies) over Jabotinsky's centralized state-building project — his gradualist
  // method itself implies a more bottom-up, pluralistic institutional vision.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","C","C"],
  // Advocated a gradual, culturally-grounded process of national renewal built from the bottom up
  // (Hebrew press, schools, ethical societies) rather than top-down political sovereignty imposed
  // before the nation was culturally ready — genuinely more consultative/organic in method than
  // Jabotinsky's assertive state-building nationalism.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  // Explicitly rejected Jabotinsky's militarized nationalism as premature and dangerous — favored
  // ethical/cultural persuasion over military mobilization at this stage of the national project.
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // Believed mass, unprepared Jewish immigration to Palestine risked provoking Arab resistance and
  // diluting the cultural/ethical quality of the national project — a genuinely more cautious,
  // gradualist immigration stance than Jabotinsky's demographic-majority-first doctrine.
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Envisioned Palestine as a "spiritual center" for a globally-dispersed Jewish people rather than a
  // sole political homeland requiring assertive territorial consolidation — explicitly non-
  // interventionist relative to Jabotinsky's Iron Wall strategy.
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Believed premature large-scale economic/industrial institution-building risked distorting the
  // cultural project he prioritized — favored small-scale, organically-grown communal economic
  // institutions (cooperative settlements) over Jabotinsky's urgent state-capacity-building or
  // Disraeli's Victorian industrial-regulation reformism.
  economia: ["C","D","C","N","D","D","C","D","C","D","N","D","C","D","N","D","N","D","N","N"],
  controle: ["N","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D","N","D","N","N"],
  // Prioritized cultural/ethical development over the economic-institutional infrastructure-building
  // Jabotinsky's political Zionism emphasized — economics was secondary to his cultural project.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A secular thinker deeply steeped in and respectful of Jewish ethical/cultural tradition (not
  // Orthodox religious observance) — reframed Jewish identity around ethics and culture rather than
  // either religious law or political sovereignty.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","N","C","N","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  // Believed a genuine Hebrew cultural/literary/educational renaissance was the true measure of
  // national progress, more than industrial or military modernization.
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const CURTIS_YARVIN = {
  // "Neocameralism" envisions the state restructured as a corporation with a single sovereign CEO —
  // internally unified and centralized, though the broader vision permits many such
  // independently-sovereign "startup states" competing globally, echoing (but organizationally
  // tighter than) Land's more radically fragmented "patchwork."
  estrutura: ["C","D","C","D","N","C","D","D","D","C","C","D","D","D","C","D","N","D","D","D"],
  // Explicitly, programmatically anti-democratic — "the Cathedral" critique frames democratic/academic/
  // media institutions as a captured, illegitimate ideological monopoly to be replaced by a single
  // accountable sovereign executive, not elected representation.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Neocameralism theorizes a strong, unaccountable-to-voters executive sovereign, though Yarvin's
  // writing emphasizes governance efficiency and "exit" rights over building an extensive domestic
  // security/surveillance apparatus per se — authoritarian in structure, less focused on coercive
  // security-state machinery specifically than on unchecked executive authority.
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C","N","C"],
  // Envisions the state run like a for-profit corporation optimizing "shareholder value" (national
  // prosperity as measured by real-estate/asset value) rather than either state planning or
  // conventional market libertarianism — governance-as-business, a distinctive market-adjacent model.
  economia: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  // Explicitly favors minimal regulatory friction in favor of efficient, corporate-style top-down
  // executive management — low bureaucratic/regulatory controle despite favoring a strong sovereign.
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Personally engages seriously with Christian/traditionalist religious themes in his later writing
  // (distinct from Land's atheist-materialist accelerationism), viewing religious tradition as a
  // potentially useful source of social cohesion within his broader neoreactionary framework.
  religiao: ["C","C","C","C","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","N","N","N","N","C","N","C","D","N"],
  // Deeply embedded in and influential upon Silicon Valley tech circles (Thiel, and later
  // Vance-adjacent tech-right networks), explicitly favorable toward technological acceleration as
  // part of his broader governance-innovation project, though less totalizingly tech-messianic than
  // Land's accelerationism.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "benjamin-disraeli": BENJAMIN_DISRAELI,
  "khomeini": KHOMEINI,
  "jabotinsky": JABOTINSKY,
  "ahad-haam": AHAD_HAAM,
  "curtis-yarvin": CURTIS_YARVIN,
};
