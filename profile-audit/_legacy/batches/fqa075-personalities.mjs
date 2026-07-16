// FQA075 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// bismarck: unified Germany through three deliberate wars ("blood and iron": Denmark 1864, Austria
//   1866, France 1870-71), created the first modern welfare state (health/accident/old-age insurance,
//   1883-89) explicitly as a conservative strategy to undercut socialism, while simultaneously banning
//   the SPD under the Anti-Socialist Laws (1878-90) and waging the Kulturkampf against the Catholic
//   Church — a master of realpolitik who kept European peace after unification through a complex
//   alliance system.
// bakunin: Russian collectivist-anarchist — opposed private ownership of the means of production but
//   allowed personal possession, with output distributed by labor contribution (distinct from
//   Kropotkin's later need-based communism); the fiercest opponent of Marx within the First
//   International, prophetically warning the Marxist "dictatorship of the proletariat" would become a
//   new tyranny; believed in spontaneous revolutionary uprising, not vanguard-party organizing.
// kropotkin: Russian prince turned anarcho-communist — "Mutual Aid" (1902) scientifically argued
//   cooperation, not only competition, drives evolutionary success; "The Conquest of Bread" detailed a
//   practical need-based post-revolutionary economy; controversially broke with anarchist anti-
//   militarist orthodoxy by supporting the Allied cause in WWI.
// durruti: Spanish anarcho-syndicalist militia commander (CNT-FAI) — a practical militant organizer,
//   not primarily a theorist, who directly led the wartime collectivization of factories and land in
//   Aragon/Catalonia during the Spanish Civil War before being killed defending Madrid in 1936.
// sorel: French syndicalist theorist — "Reflections on Violence" (1908) championed the mobilizing "myth
//   of the general strike" and proletarian violence as morally regenerative, influencing both
//   revolutionary syndicalism and fascism (Mussolini cited him directly); anti-parliamentary and
//   increasingly ideologically unclassifiable late in life.

const BISMARCK = {
  // Unified Germany under Prussian hegemony into a federation that nonetheless preserved constituent
  // kingdoms' formal existence — centralizing in practice while retaining federal forms for political
  // convenience.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","C","D"],
  // Manipulated the constitutional structure to keep the Reichstag electorally legitimate but
  // structurally powerless relative to the Kaiser/Chancellor — real elections with hollow ultimate
  // authority, a defining Bismarckian design choice.
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // The Anti-Socialist Laws (1878-90) banned SPD organizational activity and publications for over a
  // decade — severe, deliberate political coercion targeting a specific rival movement.
  poder: ["C","D","C","D","C","C","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Fought three deliberate, calculated wars (Denmark, Austria, France) to engineer unification under
  // Prussian leadership — explicit "blood and iron" militarism as unification method.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // After 1871, deliberately pursued a complex, defensive alliance system (Dreikaiserbund, later
  // Triple Alliance) explicitly to isolate France and preserve peace rather than pursue further
  // conquest — genuinely restrained territorial ambition once unification was achieved.
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // Pioneered compulsory state social insurance (health, accident, old-age) explicitly as a
  // conservative strategy to buy working-class loyalty away from socialism — real, deliberate,
  // extensive state economic intervention in service of political stability.
  economia: ["C","D","C","D","D","D","C","C","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Championed protective tariffs (the 1879 "iron and rye" coalition) shielding German industry and
  // agriculture from foreign competition as a deliberate economic-nationalist policy.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // The Kulturkampf (1871-78) actively suppressed Catholic Church institutional power (expelling
  // Jesuits, state control of clerical education) before Bismarck reversed course for political
  // convenience — real, if inconsistent, state-religion conflict.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const BAKUNIN = {
  // Collectivist anarchism's defining organizational principle: a free federation of self-governing
  // communes and worker associations with no central state authority whatsoever — among the most
  // maximally decentralized structural visions of any figure audited.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Believed in direct, continuously revocable self-governance by federated communes and worker
  // councils, explicitly rejecting both parliamentary representative government and Marxist vanguard-
  // party "dictatorship of the proletariat" as equally illegitimate forms of rule from above.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // "God and the State" argued religious and political authority were linked forms of domination to be
  // abolished together — rejected all coercive hierarchy, state and church alike, as illegitimate.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // A committed revolutionary internationalist who believed spontaneous uprising should spread across
  // borders to topple all states simultaneously — genuinely maximal, deliberately interventionist
  // revolutionary internationalism.
  intervencao: ["DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","D","CT","DT","CT"],
  // Collectivist anarchism: abolished private ownership of the means of production, with goods
  // distributed according to labor contribution through federated worker collectives — a genuinely
  // collectivized, though non-state, economic model per the established anarchist-economics exception.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  // Per the established anarchist controle-axis exception: score by the spirit of federated collective
  // economic coordination (still high controle in the "planned, not market-driven" sense) even though
  // Bakunin rejected any centralized state planning apparatus specifically.
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  // "God and the State" is an explicit, sweeping atheist rejection of religious authority as a form of
  // domination inseparable from political tyranny — among the most emphatically anti-religious figures audited.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // "The passion for destruction is a creative passion" — believed total revolutionary rupture with
  // existing moral/social order was necessary and liberating, a maximally radical rejection of
  // traditional social hierarchy and constraint.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","D","N","D","N","N","C","N","D"],
};

const KROPOTKIN = {
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // "Mutual Aid" argued cooperative, non-coercive social organization was both evolutionarily natural
  // and morally preferable to imposed hierarchical control — a gentler, more scientifically-grounded
  // anti-authoritarianism than Bakunin's more destructive revolutionary rhetoric, though sharing the
  // same rejection of state coercive apparatus.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","DT","CT"],
  // Controversially broke with anarchist anti-militarist orthodoxy in 1914 by supporting the Allied
  // cause against German militarism as the lesser evil — a real, documented departure from the more
  // consistent internationalist non-interventionism of fellow anarchists like Bakunin, distinguishing
  // his record specifically.
  intervencao: ["C","D","C","D","C","D","N","C","D","C","C","C","C","D","C","D","N","C","D","C"],
  // "The Conquest of Bread" detailed anarcho-communism specifically: distribution according to need
  // (not labor contribution as in Bakunin's collectivism), organized through federated free
  // associations — the "to each according to need" variant of anarchist collective economics.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  // Believed federated communes would naturally trade/exchange abundance produced through cooperative
  // labor, without either state-imposed tariffs or capitalist market compulsion.
  comercio: ["N","D","N","D","C","D","N","N","C","D","CT","DT","N","D","N","D","N","DT","N","D"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // As a trained geographer/naturalist, believed science and rational cooperative planning (not
  // rejection of technology) could support decentralized material abundance for all — a genuinely
  // pro-science, pro-technology anarchism distinct from more agrarian-primitivist strands.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const DURRUTI = {
  // A militia commander and organizer, not a systematic theorist — his contribution was the direct,
  // practical implementation of federated worker-council self-governance across Aragon/Catalonia
  // during the Spanish Civil War rather than abstract structural theorizing.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Led armed worker militias (not a professional standing army) that fought both Franco's forces and
  // exercised real coercive authority within collectivized zones (including against perceived
  // counter-revolutionary elements) — practical revolutionary force wielded directly in wartime
  // conditions, distinct from Bakunin/Kropotkin's more purely theoretical anti-statism.
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["D","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT","C"],
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Personally led militia columns into direct armed combat against Franco's forces and defended
  // Madrid at the cost of his own life — maximally engaged in active revolutionary armed intervention,
  // the most militarily active figure in this batch.
  intervencao: ["DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT","D","CT","D","CT","DT","CT"],
  // Directly organized the real, practical collectivization of factories and agricultural land across
  // Aragon and Catalonia during the war — anarchist economics implemented in actual wartime practice,
  // not merely theorized.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","N","N","N","N","D","N","N","N","N","N","D","N","D","N","N","C","N","D"],
};

const SOREL = {
  estrutura: ["N","C","N","C","D","C","N","C","D","C","N","C","D","C","N","C","N","D","N","D"],
  // Deeply anti-parliamentary, viewing bourgeois representative democracy as decadent and corrupting —
  // favored direct proletarian action and the mobilizing "general strike myth" over electoral
  // participation as the authentic vehicle of working-class will.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // "Reflections on Violence" explicitly championed proletarian violence and direct action as morally
  // regenerative and historically necessary — a genuinely pro-coercion-for-revolutionary-ends position,
  // later influential on fascist as well as syndicalist violence.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Championed revolutionary syndicalism's vision of worker-controlled production seized through direct
  // action (the general strike) rather than gradual parliamentary reform — a genuinely maximalist,
  // council/union-controlled economic vision.
  economia: ["CT","DT","CT","DT","CT","D","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  // Increasingly heterodox and unclassifiable late in life (flirted with both revolutionary syndicalism
  // and proto-fascist nationalism, briefly expressed Bolshevik sympathy too) — his moral philosophy
  // centered on the redemptive, regenerative power of heroic violent struggle against bourgeois
  // decadence rather than either conventional liberal or traditionalist social values.
  moral: ["D","N","D","N","D","D","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

export const PROFILES = {
  "bismarck": BISMARCK,
  "bakunin": BAKUNIN,
  "kropotkin": KROPOTKIN,
  "durruti": DURRUTI,
  "sorel": SOREL,
};
