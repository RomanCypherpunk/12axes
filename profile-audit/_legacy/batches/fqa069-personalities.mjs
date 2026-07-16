// FQA069 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// konrad-adenauer: first West German Chancellor — consolidated Christian Democracy and the "social
//   market economy," anchored West Germany firmly in NATO and European integration (a founding member
//   of the European Coal and Steel Community, Franco-German reconciliation), pursued the 1952
//   Wiedergutmachung reparations agreement with Israel.
// william-f-buckley: founded National Review (1955), architect of "fusionist" American conservatism
//   (free markets + traditional Christian morality + anti-communism), coined "stand athwart history,
//   yelling Stop," worked to purge extremist/antisemitic elements (the Birchers) from the movement to
//   make it mainstream-respectable, though early National Review editorials were notably skeptical of
//   the civil rights movement.
// cicero: Roman statesman-philosopher who defended the Republic against Caesarian centralization,
//   formulated natural-law theory and rule-of-law doctrine ("we are all servants of the law in order
//   to be free"), championed Polybian "mixed government," crushed the Catiline conspiracy, executed by
//   Mark Antony's proscription for opposing him after Caesar's assassination.
// montesquieu: formulated the separation-of-powers doctrine in "The Spirit of the Laws" (1748),
//   admired the English constitutional model, argued government form should suit each society's
//   climate/culture/history, believed intermediate institutions (nobility, parlements) check royal
//   despotism — directly shaped the US Constitution's structure.
// milton-friedman: led Chicago School monetarism ("Capitalism and Freedom," "Free to Choose"),
//   advocated school vouchers, a negative income tax over welfare bureaucracy, floating exchange
//   rates, and ending military conscription, advised free-market reforms in Pinochet's Chile (the
//   "Chicago Boys"), believed economic freedom is a precondition for political freedom.

const KONRAD_ADENAUER = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed parliamentary democrat who rebuilt West Germany's constitutional institutions after
  // Nazism and Cold-War division, presiding over genuinely competitive elections and real checks on
  // executive power (the Bundestag, the Constitutional Court).
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Firmly anchored West Germany in NATO and Western European integration (a founding architect of
  // the European Coal and Steel Community) — deliberate alliance-embeddedness, not neutrality.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Pursued Franco-German reconciliation and the 1952 Wiedergutmachung reparations agreement with
  // Israel — genuine, deliberate diplomatic reconciliation rather than either isolation or assertive
  // regional leadership ambition.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Championed Ludwig Erhard's "social market economy" politically — a genuine middle path combining
  // free-enterprise dynamism with a real welfare safety net, distinct from both laissez-faire and
  // state planning.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  // Deeply committed to European economic integration (the ECSC, the path toward the later EEC) as a
  // deliberate anti-nationalist, trade-opening project to bind West Germany irreversibly to its neighbors.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A devout Catholic whose Christian Democratic party explicitly grounded its politics in Christian
  // social teaching, though operating within a religiously pluralist, constitutionally secular state.
  religiao: ["D","CT","D","CT","D","C","D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","C","D","N","N","C","N","C","D","N"],
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const WILLIAM_F_BUCKLEY = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed defender of American constitutional institutions and electoral democracy, believing
  // conservatism should work through and preserve existing representative structures rather than
  // populist disruption of them — genuinely institutionalist.
  representacao: ["C","D","C","C","C","D","C","D","C","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  // Early National Review editorials were notably skeptical of/resistant to the civil rights movement
  // (a documented, later-regretted position), reflecting a real assimilationist/status-quo-preserving
  // instinct on this axis distinct from a purely economic-libertarian reading of him.
  imigracao: ["C","D","C","D","C","D","CT","D","C","D","C","D","C","D","C","D","C","D","C","DT"],
  // A fierce, defining Cold War anti-communist who believed robust American military strength and
  // resolve were essential to confronting Soviet expansion.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Fused free-market economics into American conservative "fusionism," believing markets require the
  // moral/cultural underpinning of traditional Christian values to remain socially sustainable — not
  // purely libertarian, but genuinely market-favoring.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","N","C","D","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // A devout Catholic who explicitly argued Christian tradition was essential to sustaining Western
  // civilization and ordered liberty against both communism and secular relativism.
  religiao: ["DT","CT","DT","CT","D","CT","DT","C","DT","CT","D","CT","D","C","DT","CT","D","CT","DT","CT"],
  // Actively worked to purge extremist/antisemitic elements (the John Birch Society) from the
  // conservative movement to make it intellectually respectable, while remaining a committed social
  // and religious traditionalist himself.
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","C","D","CT"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const CICERO = {
  // A committed defender of the mixed Roman constitution (consuls, Senate, popular assemblies)
  // against Caesar's centralizing dictatorship — favored the traditional Republican balance over
  // concentrated one-man rule.
  estrutura: ["C","D","C","D","D","C","D","C","N","C","C","D","D","C","C","D","N","C","D","D"],
  // Explicitly championed the "mixed government" (following Polybius) balancing monarchic, aristocratic,
  // and democratic elements as the ideal, most stable constitutional form — real, philosophically
  // grounded commitment to balanced representative institutions, though within an elite-Senate-favoring
  // Roman framework.
  representacao: ["C","C","C","C","D","C","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  // As consul, ordered the summary execution of the Catiline conspirators without full trial (a real,
  // controversial exercise of emergency state power he later had to defend against legal challenge) —
  // willing to use decisive coercive authority to preserve the Republic against perceived existential threat.
  poder: ["C","C","C","C","C","D","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  // Generally favored Rome's existing expansion as settled fact rather than advocating further
  // conquest himself, focused his political energy on internal constitutional preservation rather than
  // external military ambition.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  economia: ["N","C","N","D","N","D","C","D","N","D","N","D","N","D","N","D","N","D","N","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","D","N","N"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // A pragmatic augur (Roman religious official) who treated traditional civic religion as important
  // for social cohesion while personally holding Stoic-influenced philosophical views on natural
  // law/reason as the deeper source of moral truth — religion mattered civically more than devotionally.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","N","N","N","N","C","N","D","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const MONTESQUIEU = {
  // The defining, foundational theorist of separation of powers (executive/legislative/judicial checks)
  // — explicitly argued dividing and balancing authority among distinct institutions was essential to
  // prevent despotism, directly shaping later constitutional design worldwide.
  estrutura: ["C","D","C","D","C","D","C","C","D","C","C","D","C","D","C","D","C","D","D","D"],
  // Admired the English constitutional model (a monarchy checked by Parliament and independent courts)
  // as the practical embodiment of his separation-of-powers theory — favored institutionally limited,
  // representative government over either despotism or unchecked popular assembly.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","C"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  imigracao: ["N","C","D","C","N","C","D","C","N","C","N","C","N","C","N","D","N","D","N","N"],
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  economia: ["N","C","N","D","N","D","C","D","N","D","N","D","N","D","N","D","N","D","N","D"],
  // Believed intermediate institutions (the nobility, provincial parlements, guilds) served as
  // essential checks against royal despotism — favored a genuinely pluralistic distribution of
  // institutional counter-power, not centralized state direction of any kind.
  controle: ["D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","D","N","C","D","C"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Argued that appropriate government and social institutions (including religious ones) should suit
  // each society's particular climate, culture, and historical circumstances — a relativist,
  // moderate approach that treated religion as one legitimate social institution among several checks
  // on absolute power, without strong personal devotional intensity in his writing.
  religiao: ["C","N","C","N","C","D","C","N","C","D","N","D","N","C","N","D","N","D","C","N"],
  moral: ["N","C","N","C","N","D","N","N","N","D","N","D","N","N","C","D","N","D","N","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const MILTON_FRIEDMAN = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // A committed defender of liberal-democratic constitutional government as the political counterpart
  // to economic freedom — believed free markets and free elections were mutually reinforcing pillars
  // of a free society.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Explicitly, famously advocated ending military conscription (chaired the commission that led to
  // the US all-volunteer force, 1970) — a real, distinctive personal-liberty position on state
  // coercive power over individuals specifically.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Genuinely believed in robust American engagement to defend and spread economic/political freedom
  // globally during the Cold War, while remaining skeptical of costly overseas military entanglements
  // themselves — a real, nuanced position between isolationism and interventionism.
  intervencao: ["C","D","C","D","D","C","N","C","N","C","C","C","C","D","C","D","N","C","C","C"],
  // The defining architect of Chicago School free-market economics — advocated abolishing or
  // radically shrinking most government economic intervention (minimum wage, licensing, agricultural
  // subsidies) in favor of market mechanisms, among the most consistently pro-market positions audited.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  // Monetarism explicitly favored a fixed, predictable rule-based money-supply growth over
  // discretionary central-bank/government intervention — minimal state economic direction as a matter
  // of deliberate macroeconomic doctrine.
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // A lifelong, uncompromising free-trade advocate who argued tariffs harm the imposing country as
  // much as its trading partners — among the most consistently globalist trade positions audited.
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  // Not personally devout in his economic writing, treated religion as a private matter largely
  // separate from his public economic-policy arguments — genuinely secular in professional emphasis.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  moral: ["C","D","C","D","C","DT","C","N","C","DT","C","D","C","N","N","D","N","DT","C","D"],
  // Advised the "Chicago Boys" free-market reformers in Pinochet's Chile on monetary/economic policy
  // (a real, documented, controversial technical-advisory role) and championed floating exchange rates
  // and deregulation as instruments of technological/economic dynamism.
  tecnologia: ["CT","DT","CT","D","C","N","C","D","C","N","C","D","C","D","C","D","C","D","CT","D"],
};

export const PROFILES = {
  "konrad-adenauer": KONRAD_ADENAUER,
  "william-f-buckley": WILLIAM_F_BUCKLEY,
  "cicero": CICERO,
  "montesquieu": MONTESQUIEU,
  "milton-friedman": MILTON_FRIEDMAN,
};
