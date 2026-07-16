// FQA083 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// phil-zimmermann: created PGP (1991), making strong encryption publicly accessible against US export
//   restrictions (investigated for "munitions export" when encryption was classified as weapons-grade)
//   — a cypherpunk-adjacent digital-privacy-rights technologist, not a geopolitical actor.
// max-more: co-founded extropianism/modern transhumanism — advocated technology to overcome biological
//   limits (life extension, cryonics — he later led Alcor Life Extension Foundation, cognitive
//   enhancement), formulated the "proactionary principle" explicitly opposing precautionary defaults in
//   favor of embracing technological risk/experimentation.
// javier-milei: Argentine economist and president (2023-) — a self-described anarcho-capitalist who
//   proposed dollarizing the economy and slashed government ministries/spending ("la casta"
//   anti-establishment rhetoric), though governing as an actual head of state creates real practical
//   tension with pure anarcho-capitalist theory unlike purely theoretical figures like Rothbard/Konkin.
// otto-von-habsburg: heir to the dissolved Austro-Hungarian throne (never reigned) who became a
//   lifelong European-federalist Member of European Parliament for decades, a constitutional (not
//   absolute) monarchist, fiercely anti-Nazi (on the Gestapo's most-wanted list, fled Austria), and a
//   devout Catholic who saw pan-European unity as a bulwark against destructive nationalism.
// goldwater: 1964 Republican presidential nominee whose "The Conscience of a Conservative" (1960)
//   founded modern American conservatism — fierce anti-communist, limited-government free-marketer,
//   states'-rights advocate (his Civil Rights Act opposition remains debated as constitutional
//   principle vs. political calculation), who later in life grew more libertarian/socially moderate
//   (supported gay rights, criticized the religious right's growing GOP influence).

const PHIL_ZIMMERMANN = {
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["CT","D","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","D","CT","C"],
  // PGP was created explicitly to guarantee individuals strong cryptographic privacy against state
  // surveillance capacity — the defining act of his life's work was building a technical tool putting
  // privacy beyond any government's reach, the most maximally liberty-protective "poder" position
  // grounded in concrete technical action rather than mere theory.
  poder: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","N","C","DT","CT","DT","CT","DT","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  // A technologist, not a geopolitical or diplomatic actor — his entire public engagement centers on
  // cryptography and civil liberties rather than international relations or statecraft of any kind.
  diplomacia: ["DT","D","DT","D","DT","D","DT","D","DT","D","DT","D","DT","D","DT","D","DT","D","DT","D"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","CT","D","C","D","CT","D","C","D","D","DT","C","D","N","N","C","DT"],
  comercio: ["C","D","C","D","C","D","C","N","C","D","CT","DT","C","D","C","D","C","DT","C","D"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","N","C","D","D","D","C","D","D","C","D"],
  // Digital-privacy-rights advocacy is fundamentally a civil-liberties project — championed the right
  // to encrypt private communications against any external intrusion, state or corporate.
  moral: ["CT","D","C","D","C","DT","CT","D","C","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  // Created one of the most consequential privacy technologies in history and remains a leading
  // cypherpunk-movement technologist — a defining, maximal pro-technology figure by profession and conviction.
  tecnologia: ["CT","DT","CT","D","C","N","N","D","CT","N","CT","D","C","D","CT","D","C","D","CT","N"],
};

const MAX_MORE = {
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  representacao: ["C","D","C","C","C","D","C","C","D","D","C","D","D","C","C","D","D","D","C","D"],
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Favors market-driven, individually-directed technological self-enhancement rather than any
  // collectivized or state-directed program — a genuinely pro-market, individualist transhumanism.
  economia: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","DT","CT","D","CT","D","CT"],
  controle: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","N","CT","D","CT"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Championed radical individual self-determination over one's own body and biological limits (life
  // extension, cognitive enhancement, cryonics) as the ultimate expression of personal liberty — among
  // the most maximally liberty-expansive moral philosophies focused specifically on bodily autonomy.
  moral: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","C","DT","C","DT","C","DT","CT","DT"],
  // The "proactionary principle" explicitly rejects precautionary defaults in favor of embracing
  // technological risk and experimentation — formulated modern transhumanism's foundational
  // pro-technology, pro-enhancement doctrine, among the most maximal tech-optimist positions possible.
  tecnologia: ["CT","DT","CT","DT","CT","DT","N","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
};

const JAVIER_MILEI = {
  // Governs as an actual head of state within Argentina's existing federal constitutional structure
  // (unlike purely theoretical anarcho-capitalists), creating real, practical tension between his
  // stated ideology and the office he actually holds — a genuinely more moderate real-world estrutura
  // reading than pure theorists like Rothbard.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","D","D"],
  // Won a competitive democratic election and governs through Argentina's constitutional institutions,
  // though his anti-establishment "la casta" rhetoric explicitly delegitimizes much of the existing
  // political class — a genuinely populist, institution-distrustful (though not anti-electoral)
  // representative stance.
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","C","C","D"],
  // His security minister has pursued tough-on-crime policies in real tension with pure minimal-state
  // libertarian ideals — governing practically has meant retaining, not abolishing, domestic security
  // apparatus, distinguishing him from Rothbard's or Konkin's purely theoretical anti-state positions.
  poder: ["C","C","C","C","C","C","C","D","C","D","C","C","N","C","D","D","C","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","N","D","D","D","C","D"],
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","D","D","C","D","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // Proposed full dollarization (abolishing the Argentine peso and central bank entirely), drastic
  // government-spending cuts eliminating multiple ministries, and radical deregulation to fight
  // hyperinflation — among the most aggressively implemented free-market economic programs by any
  // sitting head of state.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  comercio: ["DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","D","CT","DT","CT","DT","CT","DT","CT"],
  religiao: ["C","C","C","D","C","C","C","D","C","D","N","C","D","C","D","D","D","D","C","D"],
  moral: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","N","CT","N","CT","D","C"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

const OTTO_VON_HABSBURG = {
  // Devoted his political career to European federalism (decades as a Member of European Parliament)
  // — favored a genuinely supranational, federated European structure over pure nation-state
  // sovereignty, while personally embodying a dissolved multi-ethnic Habsburg imperial legacy.
  estrutura: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","DT"],
  // A constitutional (not absolute) monarchist who, despite his own dynastic claim, worked within and
  // championed democratic European parliamentary institutions for decades — real accommodation between
  // monarchist sympathy and genuine democratic participation.
  representacao: ["C","C","C","C","D","C","C","C","D","C","C","C","D","C","C","D","D","D","C","D"],
  // Was fiercely, personally anti-Nazi (placed on the Gestapo's most-wanted list, fled Austria to
  // escape arrest) — a direct, documented opponent of totalitarian coercive power from firsthand
  // experience, not merely abstract theorizing.
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","D","D","D","C","D","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // A lifelong advocate of pan-European unity as a deliberate bulwark against the destructive
  // nationalism that had twice plunged Europe into world war — genuinely committed European
  // integrationist diplomacy.
  diplomacia: ["D","CT","D","CT","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  // Championed European economic integration and the eventual single market as a practical instrument
  // of the broader federalist project he devoted his career to.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // A devout, practicing Catholic for whom faith and traditional dynastic/religious continuity were
  // central to his identity and political vision of a Christian European civilization.
  religiao: ["D","CT","D","C","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C","D","C"],
  moral: ["D","C","D","C","N","D","D","N","D","D","D","N","N","N","N","D","N","D","D","N"],
  tecnologia: ["N","C","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const GOLDWATER = {
  // "The Conscience of a Conservative" championed states' rights and constitutionally limited federal
  // power as foundational conservative principles — genuinely favored decentralization of authority
  // back toward states.
  estrutura: ["CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","DT","C","D","C","DT","CT","DT"],
  representacao: ["C","D","C","C","D","D","C","D","C","D","C","D","D","N","C","D","D","D","C","D"],
  poder: ["C","CT","C","C","C","CT","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["C","D","C","D","C","D","C","N","C","D","C","D","N","D","N","D","D","D","C","D"],
  // A fierce Cold War anti-communist hawk who favored a robust, assertive military posture against
  // Soviet expansion — one of the more militarily assertive figures of the mid-century American right.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Consistent anti-communist interventionism (supported an assertive US posture in the Cold War,
  // including controversial rhetoric about confronting the USSR directly) — genuinely more
  // internationally assertive than the isolationist wing of American conservatism.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // "The Conscience of a Conservative" is a foundational text of American limited-government free-
  // market conservatism, opposing New Deal-style state economic intervention — a defining
  // free-market economic program that reshaped the Republican Party.
  economia: ["DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","DT","CT"],
  controle: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Mid-century "Goldwater conservatism" was genuinely free-trade-oriented as part of its broader
  // limited-government economics, opposing tariffs and trade barriers as another form of government
  // market interference.
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Later in life grew notably more libertarian/socially moderate — supported gay rights and criticized
  // the religious right's growing influence over the Republican Party, a real, documented evolution
  // from his earlier positions rather than static lifelong conservatism.
  moral: ["C","N","C","N","C","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","N","D","C","N"],
};

export const PROFILES = {
  "phil-zimmermann": PHIL_ZIMMERMANN,
  "max-more": MAX_MORE,
  "javier-milei": JAVIER_MILEI,
  "otto-von-habsburg": OTTO_VON_HABSBURG,
  "goldwater": GOLDWATER,
};
