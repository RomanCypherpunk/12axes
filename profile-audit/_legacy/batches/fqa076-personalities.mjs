// FQA076 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// chomsky: libertarian socialist/anarcho-syndicalist (admires the Spanish anarchist collectives),
//   revolutionized linguistics (generative grammar), "Manufacturing Consent" developed the propaganda
//   model of corporate media, a fierce critic of US foreign-policy interventionism, and a free-speech
//   absolutist (controversially defended even Holocaust-denier Faurisson's right to speak while
//   explicitly rejecting the content of his views).
// gramsci: Italian Communist Party founder, imprisoned by Mussolini's fascist regime (1926-37, died
//   shortly after release) — the "Prison Notebooks" developed "cultural hegemony" (ruling classes govern
//   through cultural/ideological consent via civil-society institutions, not just coercion) and argued
//   socialist change requires a long cultural "war of position," not merely seizing state power.
// tito: led the Yugoslav Partisan resistance, founded socialist Yugoslavia unifying diverse Balkan
//   peoples under one-party rule but with a distinctive worker-self-management economic model (unlike
//   Soviet central planning), broke dramatically with Stalin in 1948 (Tito-Stalin split), co-founded the
//   Non-Aligned Movement, while still repressing political dissent (the Goli Otok prison camp for
//   Cominform sympathizers).
// oskar-lange: Polish economist — the Lange-Lerner "market socialism" model proposed a Central Planning
//   Board could set prices via trial-and-error to allocate resources efficiently under public ownership,
//   directly answering the Hayek/Mises socialist-calculation critique; served as a diplomat/economic
//   advisor under Communist Poland.
// proudhon: the first person to call himself "anarchist" ("What Is Property?" 1840 — "property is
//   theft"), founded mutualism (free mutual-credit banking, property justified by use/occupation rather
//   than absentee ownership), favored federated small property-holding producers over both centralized
//   states and full collectivization, pursued gradualist institution-building over Bakunin-style
//   insurrection, and held documented antisemitic and sexist views.

const CHOMSKY = {
  // Explicitly identifies with anarcho-syndicalism/libertarian socialism — admires the Spanish
  // anarchist collectives' federated worker-council structure as a genuine historical model.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // A free-speech absolutist even for views he finds abhorrent (the Faurisson affair — defended the
  // Holocaust denier's right to speak while explicitly rejecting his claims) — genuinely maximal civil-
  // liberties commitment distinguishing him from more security-conscious figures on this axis.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  // "Manufacturing Consent" argued corporate/state power shapes media narratives to manufacture public
  // consent for US foreign-policy actions he views as imperialist — deeply skeptical of US military
  // power projection specifically.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // A leading, sustained critic of US interventions (Vietnam, Central America, Iraq) as imperialist
  // aggression — among the most consistently, vocally anti-interventionist public intellectuals of the
  // last half-century.
  intervencao: ["CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // A scientist by training (linguistics) generally favorable to scientific inquiry, though critical of
  // corporate-controlled technology deployment and its concentration of power.
  tecnologia: ["C","D","C","N","C","N","N","C","C","N","C","D","C","D","C","D","N","D","C","N"],
};

const GRAMSCI = {
  // Argued civil-society institutions (education, media, church, culture) — not merely the coercive
  // state apparatus — are where hegemonic power is actually exercised and must be contested, a subtler
  // structural theory than a simple state-centralization reading.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  // Was himself imprisoned by Mussolini's fascist regime for over a decade (1926-37) for his political
  // organizing — a direct victim of extreme state coercion, shaping his firsthand critique of
  // authoritarian power.
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","D","D","C","D","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Argued for a long cultural "war of position" (building counter-hegemonic consciousness through
  // civil society) rather than a swift "war of maneuver" (direct seizure of state economic levers) —
  // still fundamentally committed to collectivized post-capitalist economic transformation, just via a
  // different strategic route than Bolshevik seizure.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  // Grew up within deeply Catholic Sardinian/Italian culture and analyzed the Church explicitly as a
  // hegemonic civil-society institution shaping popular consciousness — engaged with religion
  // analytically as a power structure rather than simply rejecting or embracing it personally.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Wrote extensively on the "organic intellectual" and cultural/educational transformation as
  // essential to social change, engaging seriously with Fordist industrial production methods
  // (his essay "Americanism and Fordism" analyzed mass industrial technology's social implications).
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const TITO = {
  // Federated Yugoslavia explicitly as a union of six constituent socialist republics with real,
  // codified autonomy (each with its own government, language rights, and constitution) — a genuinely
  // federal structure distinct from Soviet-style unitary centralization, though held together
  // ultimately by Tito's personal authority and the League of Communists.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","C","D"],
  // A one-party state (League of Communists) with no genuine multi-party competition, though workers'
  // self-management councils gave real, if bounded, participatory input into enterprise decisions —
  // more participatory than Soviet-style top-down planning even without political pluralism.
  representacao: ["D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","D","CT"],
  // Ran a one-party security state (UDBA secret police, the Goli Otok prison camp specifically for
  // Cominform/Stalinist sympathizers after the 1948 split) — real, sustained political repression
  // despite the more liberal economic model.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Built a genuinely independent, powerful military and led the Non-Aligned Movement as a real
  // geopolitical actor balancing between both Cold War blocs rather than deferring to either.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // The dramatic 1948 Tito-Stalin split explicitly rejected Soviet dominance/interference, and Tito
  // co-founded the Non-Aligned Movement (with Nehru, Nasser) as a deliberate, active alternative bloc
  // to both American and Soviet spheres — genuinely assertive, sovereignty-first international leadership.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // Pioneered "self-management socialism" (samoupravljanje) — workers directly elected councils
  // managing their own enterprises with real market-price signals — a genuinely distinct, more
  // market-oriented socialist model than Soviet central planning.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  // Yugoslavia's more open, market-influenced socialism permitted relatively freer trade and much
  // freer emigration/travel (Yugoslav "guest workers" in Western Europe) than any Warsaw Pact state.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Officially secular/state-atheist in doctrine but Yugoslavia's multi-confessional reality (Catholic
  // Croats/Slovenes, Orthodox Serbs, Muslim Bosniaks) forced a genuinely pragmatic tolerance of
  // religious diversity to hold the federation together, distinct from harder Soviet-style suppression.
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const OSKAR_LANGE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // A technocratic economist-diplomat operating within Communist Poland's Soviet-aligned foreign policy
  // framework, though his own intellectual project was about economic mechanism design, not military
  // or diplomatic assertiveness.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // The Lange-Lerner model directly answered Hayek/Mises's socialist-calculation critique: a Central
  // Planning Board could iteratively adjust prices via trial-and-error to simulate market-clearing
  // efficiency under public ownership — publicly-owned production explicitly combined with genuine
  // price-mechanism logic, a technically distinctive "market socialism" position.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Believed a Central Planning Board setting/adjusting prices was a real, necessary, and technically
  // sophisticated form of economic direction — genuinely dirigiste in mechanism even while using
  // price signals rather than direct physical quotas.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // A rigorously technical economist whose entire intellectual project was about whether mathematical/
  // computational price-simulation could match market efficiency — a fundamentally
  // technical-optimist confidence in economic science and calculation.
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const PROUDHON = {
  // Mutualism favored a federation of small, autonomous property-holding communes and worker
  // associations — genuinely decentralized, though built around individual/cooperative property rather
  // than either full state centralization or Bakunin/Kropotkin's collectivized common ownership.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Mutualism: proposed free mutual-credit "people's banks" issuing interest-free credit to worker-
  // producers, and property justified by personal use/occupation rather than absentee ownership ("La
  // propriété, c'est le vol!") — a genuinely distinct small-holder cooperative-market vision, less
  // fully collectivized than Bakunin's or Kropotkin's anarchism.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Rejected both centralized state planning AND full common collectivization in favor of a mutual-
  // credit-federated market of small independent producers — genuinely more market-oriented than
  // Bakunin/Kropotkin's collectivist/communist anarchism, though still opposed to concentrated
  // capitalist ownership.
  controle: ["D","C","D","C","C","D","D","C","C","D","D","C","D","D","D","C","N","C","D","C"],
  comercio: ["N","C","N","C","D","C","N","C","N","C","D","C","N","C","N","D","N","C","N","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Favored gradualist institution-building (mutual-credit banks, cooperative federations) over
  // Bakunin-style insurrectionary violence — a real, documented tactical/temperamental difference from
  // more revolutionary anarchist contemporaries, though held documented antisemitic and sexist views
  // (his private notebooks contain explicit antisemitic remarks, and he opposed women's full civic
  // equality) that sit uneasily alongside his egalitarian economic vision.
  moral: ["D","C","D","N","D","C","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "chomsky": CHOMSKY,
  "gramsci": GRAMSCI,
  "tito": TITO,
  "oskar-lange": OSKAR_LANGE,
  "proudhon": PROUDHON,
};
