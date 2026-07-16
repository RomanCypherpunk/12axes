// FQA064 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// mussolini: coined "totalitarian state," built Italian corporatism (fusing state/business/labor into
//   corporate bodies), invaded Ethiopia (1935-36), the 1929 Lateran Treaty reconciled fascism with the
//   Catholic Church (creating Vatican City, making Catholicism Italy's state religion) — a genuine,
//   significant religious accommodation distinct from Nazi ambivalence toward Christianity.
// hitler: explicit biological racism/antisemitism as the doctrinal core (not merely state-nationalist
//   like early Italian fascism), the Holocaust, Lebensraum expansionist doctrine, launched WWII;
//   subordinated Christianity instrumentally to race/state ideology, waged a "degenerate art" campaign
//   against cultural modernism while pursuing advanced military technology (V-2 rockets, jet aircraft).
// engelbert-dollfuss: Austrofascism's distinctively Catholic-clerical corporate state (Christian
//   Social movement roots) — suppressed BOTH the Social Democrats (crushing them in the 1934 civil war)
//   AND the Nazis (banned the Austrian Nazi party, resisted Anschluss, sought Mussolini's protection
//   against Germany), assassinated by Austrian Nazis in a 1934 coup attempt.
// jose-antonio-primo-de-rivera: founded the Spanish Falange's "national-syndicalism," executed by
//   Republicans early in the Civil War (Nov 1936) before ever holding real governing power — his
//   ideology remained more purely theoretical/movement-based than the other four figures who actually
//   ran states, becoming a martyr symbol for Francoist Spain.
// plinio-salgado: founded Brazilian Integralism (AIB) under "Deus, Pátria e Família," modeled
//   aesthetically on European fascism but suppressed by Vargas's own authoritarian Estado Novo in
//   1937 (a rival-movement crackdown, not a democratic one) — uniquely among this batch, survived into
//   the post-1945 democratic era and ran for president under normal electoral rules.

const MUSSOLINI = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Built the OVRA secret police and a genuinely totalitarian coercive state apparatus (a term he
  // himself coined), but relied more on exile/imprisonment (confino) of dissidents than mass execution
  // — Italian fascism's internal political death toll was in the hundreds, not the millions of Hitler's
  // or Stalin's regimes, a real, documented severity gap this axis should reflect.
  poder: ["CT","D","CT","DT","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","DT"],
  // Explicit Italian ethnic-nationalist assimilationism (suppressed German, Slovene, and Croat
  // minority languages in annexed border regions) fused with colonial racial hierarchy in Ethiopia,
  // though initially without Hitler's biological-racial antisemitism (adopted anti-Jewish racial laws
  // only in 1938, under German pressure, later in his rule).
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Invaded Ethiopia (1935-36, using chemical weapons against a poorly armed opponent), intervened in
  // the Spanish Civil War on Franco's side, and allied with Hitler in the Axis — genuinely militarist
  // colonial-expansionist doctrine, "Duce" cult glorifying martial strength explicitly.
  diplomacia: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // The corporatist economic model organized industry, labor, and the state into 22 official sectoral
  // "corporations" that set wages/prices/production by negotiation among state-recognized employer and
  // (state-controlled) worker representatives — private ownership was formally retained throughout,
  // distinct from Hitler's more purely war-mobilization-driven command over production.
  economia: ["C","D","C","D","D","D","C","D","C","D","N","C","C","D","N","D","C","D","N","C"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  // Pursued "autarchia" (national self-sufficiency) especially after League of Nations sanctions
  // following the Ethiopia invasion — a deliberate, sanctions-driven turn toward economic isolationism.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // The 1929 Lateran Treaty formally reconciled the Italian state with the Catholic Church (creating
  // Vatican City as a sovereign enclave and making Catholicism the state religion in exchange for
  // Church support) — a genuine, significant religious-political accommodation, not mere tolerance or
  // suppression.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  // Pronatalist "Battle for Births" policy and rigidly traditionalist gender roles (women confined to
  // domestic/maternal roles by explicit state propaganda) alongside youth-mobilization organizations
  // promoting martial masculine virtue.
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Associated with Italian Futurism's cult of speed/machinery/modernity, pursued infrastructure and
  // industrial modernization (the "made the trains run on time" propaganda myth) as regime prestige projects.
  tecnologia: ["C","D","C","D","C","C","N","C","N","D","C","D","C","D","C","D","N","D","C","D"],
};

const HITLER = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Gestapo, the SS, and ultimately the machinery of the Holocaust represent among the most
  // extreme, systematically genocidal state-coercion apparatuses in human history.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Explicit biological racism was the doctrinal core, not an instrumental add-on — the Holocaust,
  // forced sterilization, and Lebensraum ethnic-cleansing colonization plans for Eastern Europe were
  // central, not peripheral, to the ideology itself — the most extreme documented position on this axis.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  diplomacia: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Lebensraum doctrine explicitly demanded territorial conquest of Eastern Europe for German
  // settlement, launching WWII — maximal, ideologically foundational expansionism.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // A war-mobilized economy directed by Four-Year-Plan targets toward rearmament and, from 1939-45,
  // systematic plunder of occupied territories and forced/slave labor (concentration-camp and deported-
  // worker labor directly integrated into war production) — private industry retained but subordinated
  // far more coercively than Mussolini's negotiated corporatist arbitration model.
  economia: ["C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","CT","DT","C","D"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  // Autarky and territorial resource conquest (explicitly to secure oil/grain/raw materials via
  // Lebensraum) rather than voluntary trade — an even more coercively self-sufficiency-driven, war-
  // economy trade doctrine than Mussolini's sanctions-driven autarchia.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Nazi ideology ultimately subordinated Christianity to race and state (some leading Nazis pushed
  // neo-pagan Germanic mysticism), used Christian rhetoric opportunistically but persecuted dissenting
  // clergy and planned to eventually eliminate institutional Christianity's independent authority.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  // Explicitly genocidal, eugenicist social doctrine (T4 euthanasia program, forced sterilization of
  // the disabled) fused with rigidly traditionalist "Kinder, Küche, Kirche" gender roles — the most
  // extreme traditionalist-coercive moral position audited in this entire project.
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Pursued advanced military technology aggressively (V-2 rockets, early jet aircraft, nuclear
  // research) while simultaneously waging the "degenerate art" campaign against modernist culture —
  // technology instrumentalized for war, cultural modernism suppressed.
  tecnologia: ["C","D","N","D","N","D","N","D","C","D","N","D","C","D","N","D","N","D","C","D"],
};

const ENGELBERT_DOLLFUSS = {
  // Dismantled a genuinely federal pre-existing Austrian constitutional tradition (the Bundesländer had
  // real pre-1933 autonomy) in favor of centralized rule by decree — a more consequential, documented
  // real-world act of federal dismantlement than the largely theoretical unitary preferences of
  // Primo de Rivera or Salgado, who never held a federal system to dismantle in the first place.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT"],
  // Dissolved the Austrian Parliament in 1933 using a procedural loophole and ruled by emergency
  // decree, then crushed the Social Democrats in the brief February 1934 civil war — but, distinctly
  // among this batch, also banned the Nazi party rather than allying with it, and the 1934 "May
  // Constitution" retained at least a nominal corporate-estates advisory chamber unlike Hitler's total
  // elimination of any parliamentary form.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C"],
  poder: ["CT","DT","CT","DT","CT","DT","CT","D","DT","CT","CT","DT","C","D","CT","DT","CT","DT","CT","DT"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Distinctly among this batch: actively resisted German annexation (Anschluss) and sought Mussolini's
  // protection against Hitler specifically — an anti-Nazi authoritarian rather than a Hitler ally,
  // assassinated by Austrian Nazis in a July 1934 coup attempt precisely because of this opposition.
  diplomacia: ["C","C","D","C","C","D","C","D","D","D","C","N","C","N","D","D","C","D","C","N"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // The Ständestaat organized the economy into Catholic-social-doctrine "estates" (Berufsstände)
  // grounded explicitly in the papal encyclical Quadragesimo Anno — a smaller, more paternalistic,
  // guild-like model for a small Alpine economy, distinct from Mussolini's larger industrial-corporate
  // apparatus or Hitler's war-production command economy.
  economia: ["C","D","C","D","D","D","C","C","C","D","N","C","C","D","N","D","C","D","N","N"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // The most explicitly, deliberately Catholic-clerical of all the fascist-adjacent states in this
  // batch — the Ständestaat's constitution invoked God directly and was built on Catholic Social
  // Teaching (Quadragesimo Anno) as its explicit ideological foundation, distinct from Mussolini's more
  // transactional Lateran-Treaty accommodation.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","D","N","N","N","D","N","N","D"],
};

const JOSE_ANTONIO_PRIMO_DE_RIVERA = {
  // As a movement founder who never governed (executed Nov 1936, months into the Civil War), his
  // "national-syndicalism" was a doctrinal program rather than a tested administrative structure —
  // theorized a unitary, anti-regionalist Spanish state explicitly against Catalan/Basque autonomism.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Founded the Falange explicitly as a paramilitary mass movement engaging in street violence against
  // Republican and leftist opponents — real, if pre-governmental, organized political violence.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Framed the Falange's mission explicitly in terms of restoring Spanish imperial greatness and unity
  // against "anti-Spain" (liberalism, Marxism, regional separatism) — martial nationalist rhetoric,
  // though he died before any war of conquest could be waged under his own leadership.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Explicitly nationalist-assertive rhetoric (restoring Spanish "imperial" greatness, national
  // interest above international bodies/treaties) — the doctrinal opposite of non-interventionism,
  // even though never tested by actual governance.
  intervencao: ["D","CT","D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // "National-syndicalism" proposed vertical trade unions fusing labor and capital, explicitly framed
  // as revolutionary syndicalist expropriation-adjacent rhetoric (attacking both "plutocracy" and
  // Marxism) rather than Dollfuss's more paternalistic Catholic-estates gradualism — the most radical,
  // Marx-adjacent economic language of any figure in this batch, even though never implemented in power.
  economia: ["CT","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","CT","D","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Fused traditional Spanish Catholicism with fascist-style mass mobilization — religion was a core,
  // explicit pillar of Falangist identity against both liberal secularism and Marxist atheism.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","C","N","N","N","D","N","N","D"],
};

const PLINIO_SALGADO = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Built the AIB into Brazil's largest mass political movement of the 1930s (green-shirted militants,
  // the "Anauê" salute) — a genuine mass-mobilization paramilitary movement, though ultimately
  // suppressed by Vargas's rival authoritarianism (the 1937 Estado Novo) rather than achieving state
  // power itself; attempted a failed coup against Vargas in 1938.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Integralism's "Sigma" doctrine explicitly asserted Brazilian national greatness and territorial/
  // cultural integrity against both foreign (especially Anglo-American liberal) influence and internal
  // "anti-Brazil" communist subversion — assertive nationalist rhetoric, not non-interventionism.
  intervencao: ["D","CT","D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT"],
  // Integralism's program was far less economically developed than the European fascisms it imitated
  // aesthetically — its "Sigma" (integration) rhetoric was heavier on spiritual/cultural nationalism
  // than concrete economic restructuring, leaning toward vague corporatist sympathy without a fully
  // worked-out doctrine like Mussolini's corporations or Primo de Rivera's national-syndicalism.
  economia: ["C","D","C","N","C","D","C","D","C","D","N","N","C","D","N","D","C","D","N","N"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","D","D","CT","D","CT","DT","C","D"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // "Deus, Pátria e Família" made explicit Christian identity the movement's central organizing motto
  // — even more overtly religion-fused-with-nationalism in its own self-presentation than Mussolini's
  // transactional Lateran-Treaty relationship with the Church.
  religiao: ["DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Unlike Mussolini, Hitler, Dollfuss, or Primo de Rivera (all dead by 1945/1936), Salgado survived
  // into Brazil's post-1945 democratic era and ran for president under ordinary electoral rules in
  // 1955 — a real, distinctive later accommodation with democratic competition, even as his core
  // ideology remained authoritarian-nationalist.
  tecnologia: ["N","C","N","N","N","N","D","N","N","N","N","N","D","N","N","N","D","N","N","D"],
};

export const PROFILES = {
  "mussolini": MUSSOLINI,
  "hitler": HITLER,
  "engelbert-dollfuss": ENGELBERT_DOLLFUSS,
  "jose-antonio-primo-de-rivera": JOSE_ANTONIO_PRIMO_DE_RIVERA,
  "plinio-salgado": PLINIO_SALGADO,
};
