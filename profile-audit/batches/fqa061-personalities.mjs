// FQA061 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// lenin: vanguard-party theorist (What Is to Be Done?), dissolved the elected Constituent Assembly by
//   force (1918) despite it having a non-Bolshevik majority, built the Cheka/Red Terror, imposed War
//   Communism during the Civil War, but pragmatically retreated to the market-tolerant New Economic
//   Policy in 1921 — a real tactical nuance distinguishing him from Stalin's later total collectivization.
// stalin: even more centralized/personalist than Lenin — forced collectivization (Holodomor), the
//   Great Purge/Terror and the gulag system, "socialism in one country" (less internationalist than
//   Trotsky), and a genuinely more socially conservative turn (re-criminalized homosexuality 1933,
//   restricted the divorce/abortion access Lenin's USSR had liberalized, promoted pronatalist "family
//   values" propaganda).
// mao-zedong: adapted Marxism to the peasantry (not orthodox urban-proletariat theory), the Great Leap
//   Forward's catastrophic forced collectivization/famine, the Cultural Revolution's mass mobilization
//   against "the Four Olds" and purges of party rivals, continuous/permanent revolution against
//   bureaucratization via mass mobilization rather than Trotsky's internal-party-democracy solution.
// trotsky: theorized permanent/international revolution against Stalin's "socialism in one country",
//   organized the Red Army as Commissar of War, led the Left Opposition critiquing Stalinist
//   bureaucratic degeneration ("The Revolution Betrayed") while still committed to vanguard-party rule
//   and full state economic planning — critiquing Stalin's methods, not the fundamental command-economy
//   project.
// anton-pannekoek: Dutch astronomer and council communist — sharply critiqued BOTH parliamentary
//   reformism AND Leninist vanguard-party centralism as equally elitist/bureaucratic, championed workers'
//   councils (räte in the original self-organizing democratic sense) as socialism built from below
//   through mass self-education rather than imposed by any party elite.

const LENIN = {
  // Advocated a highly centralized, disciplined vanguard party ("democratic centralism") explicitly
  // over federated or locally autonomous organizational structures — party discipline from the center
  // was the core organizational principle.
  estrutura: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Forcibly dissolved the democratically elected Constituent Assembly in January 1918 after Bolsheviks
  // won only a minority of seats — a direct, documented rejection of electoral outcomes he did not control.
  representacao: ["D","CT","D","C","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","C","D","CT"],
  // Founded the Cheka secret police and explicitly theorized/implemented the "Red Terror" (1918) as a
  // deliberate policy of mass executions against "class enemies" — an explicit doctrinal justification
  // for maximal state coercion, though confined mainly to the Civil War period rather than sustained
  // peacetime terror on the scale of Stalin's Great Purge or Mao's Cultural Revolution.
  poder: ["CT","DT","CT","DT","CT","DT","CT","D","DT","CT","CT","DT","C","D","CT","DT","CT","DT","CT","DT"],
  // Theorized proletarian internationalism as transcending national identity, while in practice
  // Bolshevik nationalities policy (the 1922 Union Treaty) offered nominal ethnic self-determination
  // within a tightly centralized Soviet framework — internationalist rhetoric, real central control.
  imigracao: ["D","CT","D","C","D","C","D","C","D","CT","D","C","D","C","D","D","DT","C","D","C"],
  // Believed revolution required active military defense and international proletarian solidarity by
  // force where necessary, organized the Red Army for the Civil War, but did not seek Tsarist-style
  // territorial conquest for its own sake.
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // "Imperialism, the Highest Stage of Capitalism" explicitly framed anti-imperialism and support for
  // colonized peoples' liberation as central to Bolshevik doctrine — genuinely anti-interventionist in
  // theory regarding capitalist imperial conquest, though supportive of exporting revolution.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // War Communism (1918-21) imposed total state control and forced grain requisition, but Lenin then
  // pragmatically reversed course with the 1921 New Economic Policy, explicitly reintroducing limited
  // private trade and market mechanisms as a tactical retreat — a genuinely more flexible economic
  // record than Stalin's later total collectivization.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  // War Communism nationalized virtually all trade and requisitioned grain by force; the NEP (1921)
  // reopened limited internal/external trade — Lenin's record on this axis is genuinely bimodal across
  // his tenure, landing moderate-high on protectionist state control overall.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  // Militant state atheism was official Bolshevik doctrine — the Orthodox Church was actively
  // persecuted, clergy executed, church property confiscated as a deliberate policy.
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  // Lenin's early Soviet government legalized divorce and abortion and formally emancipated women in
  // law (a genuinely progressive rupture from Tsarist/Orthodox tradition), though this was later
  // reversed under Stalin — during his own tenure, a real, documented social liberalization.
  moral: ["C","D","C","N","C","D","C","N","CT","DT","C","D","N","N","N","D","N","D","C","D"],
  // "Communism is Soviet power plus the electrification of the whole country" — the GOELRO national
  // electrification plan reflected genuine, enthusiastic technological-modernization doctrine as
  // central to the revolutionary project itself.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","D"],
};

const STALIN = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Show-trial elections with single-candidate ballots, the 1936 "Stalin Constitution" was a purely
  // decorative document while the Great Purge (1936-38) executed or imprisoned even loyal party
  // cadres — the near-total elimination of any check on personal power.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Great Terror, the Gulag forced-labor camp system, and the NKVD's mass execution quotas (an
  // estimated 700,000+ executed in 1937-38 alone) represent among the most extreme, systematically
  // documented state-coercion campaigns in modern history.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // "Socialism in one country" fused with deliberate Russification/deportation policies against
  // non-Russian minorities (the Chechen, Tatar, and other mass deportations of the 1940s) — an
  // explicitly nationalist-assimilationist turn away from Lenin's internationalist rhetoric.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Built the Red Army into a superpower military, annexed the Baltic states and eastern Poland (1939-40
  // Molotov-Ribbentrop pact), and imposed satellite regimes across Eastern Europe after WWII — genuinely
  // expansionist and militarily assertive.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // The first Five-Year Plans (from 1928) imposed forced-pace industrialization and total agricultural
  // collectivization (triggering the Holodomor famine in Ukraine, millions dead) — a maximal, coercively
  // enforced command economy.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  // Explicitly reversed Lenin-era social liberalization: re-criminalized homosexuality (1933),
  // restricted the divorce/abortion access legalized under Lenin, and promoted state pronatalist
  // "family values" propaganda (the 1944 Family Law) — a genuinely more socially conservative record
  // than Lenin's, despite both being committed Marxist-Leninists.
  moral: ["D","CT","D","C","D","CT","D","N","D","CT","D","CT","D","N","N","CT","N","CT","D","C"],
  // Launched the Soviet nuclear-weapons program (first test 1949) and heavy-industrial/military
  // technology development as a central state priority, subordinated to security/military ends.
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

const MAO_ZEDONG = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Cultural Revolution (1966-76) mobilized Red Guards to violently purge perceived class enemies
  // and party rivals, closed schools, and produced widespread persecution/death — alongside the earlier
  // Great Leap Forward's catastrophic famine (an estimated 15-45 million deaths) from forced
  // collectivization — among the most extreme documented human costs of any state-coercion campaign audited.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Explicit campaign to "Destroy the Four Olds" (old customs, culture, habits, ideas) targeted
  // traditional/minority cultural practices for elimination in favor of a unified revolutionary
  // Chinese-Communist identity — deliberate cultural homogenization by state mobilization.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Pursued the Sino-Soviet split to assert independent Chinese Communist leadership, built a nuclear
  // deterrent, and adopted confrontational rhetoric ("imperialism is a paper tiger") — a genuinely
  // assertive, militarized posture even while avoiding direct great-power war after the Korean War.
  diplomacia: ["C","C","C","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Supported revolutionary movements abroad (aid to Vietnam, various Third World insurgencies) as part
  // of exporting the "people's war" model, while prioritizing internal mobilization campaigns over
  // large-scale direct territorial conquest.
  intervencao: ["C","D","C","D","C","D","N","C","D","D","C","D","C","D","C","D","D","C","D","D"],
  // Total collectivization (People's Communes) and the Great Leap Forward's "backyard furnace" forced
  // industrial mobilization represent a maximal, coercively enforced command-economy experiment.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT"],
  // The Great Leap Forward explicitly sought national self-sufficiency and rejected reliance on Soviet
  // aid/trade after the Sino-Soviet split — a deliberately autarkic, self-reliance-doctrine economy.
  comercio: ["CT","DT","CT","DT","C","D","CT","DT","C","D","CT","D","C","D","N","D","CT","DT","CT","N"],
  // Explicitly hostile to traditional religion and Confucian culture as instruments of "feudal"
  // oppression — temples destroyed, religious practice suppressed as part of the broader "Four Olds" campaign.
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  // "Women hold up half the sky" rhetoric mobilized women into the workforce and campaigned against
  // foot-binding/arranged marriage as "feudal" practices — genuinely disruptive of traditional gender
  // norms in official doctrine, even as patriarchal practice persisted at the grassroots.
  moral: ["C","D","C","D","C","D","C","N","CT","DT","C","D","N","N","N","D","N","D","C","D"],
  // Pursued the nuclear-weapons program (first test 1964) and championed backyard-furnace industrial
  // mobilization during the Great Leap Forward — technology in service of ideological mass mobilization
  // more than systematic scientific development (the Cultural Revolution also badly damaged China's
  // universities/scientific establishment).
  tecnologia: ["C","D","N","D","N","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

const TROTSKY = {
  // As Commissar of War, built the Red Army into a centralized, disciplined force (including
  // controversially recruiting former Tsarist officers under strict political-commissar oversight) —
  // organizational centralism was as core to Trotsky's practice as to Lenin's or Stalin's.
  estrutura: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Left Opposition's central critique of Stalin was the suppression of *inner-party* democracy
  // and the bureaucratic degeneration of the soviets ("The Revolution Betrayed") — Trotsky wanted more
  // genuine debate and accountability within the revolutionary vanguard-party system, though never
  // embraced liberal multi-party electoral democracy as such.
  representacao: ["D","CT","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","D","C"],
  // Directly organized and commanded the Red Army's often-brutal suppression of Civil War opposition
  // (including the 1921 Kronstadt rebellion crushing, which he personally ordered) — a real, documented
  // record of severe coercive violence, though somewhat less totalizing than Stalin's later peacetime terror.
  poder: ["CT","D","CT","D","CT","D","CT","D","D","CT","CT","D","C","D","CT","D","CT","D","CT","D"],
  imigracao: ["D","CT","D","C","D","C","D","C","D","CT","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // "Permanent revolution" explicitly rejected Stalin's "socialism in one country" as a betrayal —
  // Trotsky insisted revolution must be actively exported and supported internationally, founding the
  // Fourth International explicitly to organize world revolution — maximally internationalist-
  // interventionist in doctrine.
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Committed to full state economic planning as fundamental doctrine (his critique of Stalin was about
  // bureaucratic mismanagement of planning, not the principle of central planning itself) — economically
  // indistinguishable in kind from Lenin/Stalin's command-economy commitment.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","N"],
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  // Shared the Bolshevik commitment to women's legal emancipation and secular family law reform, and
  // remained personally more consistent on internal-party free debate (extending somewhat to a broader
  // cultural-liberalization instinct) than Stalin's later reversals.
  moral: ["C","D","C","N","C","D","C","N","CT","DT","C","D","N","N","N","D","N","D","C","D"],
  tecnologia: ["C","D","C","D","C","D","N","D","C","D","C","D","C","D","C","D","N","D","C","D"],
};

const ANTON_PANNEKOEK = {
  // Council communism's defining principle: genuine decentralized self-organization of workers into
  // councils (räte/soviets in their original democratic sense) rather than either parliamentary
  // centralism or vanguard-party central command — the most decentralization-favoring figure in this batch.
  estrutura: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Sharply critiqued Bolshevik "party dictatorship" as a betrayal of genuine soviet democracy —
  // insisted workers' councils, not any vanguard party (however revolutionary its self-image), must
  // hold real, continuously accountable decision-making power — a distinctly more democratic Marxist
  // current than Lenin/Stalin/Mao/Trotsky's vanguardism.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","CT","DT","CT","DT","D","D","CT","DT","C","DT","CT","C"],
  // Explicitly rejected the Bolshevik Red Terror/Cheka apparatus as "state capitalism" dressed in
  // revolutionary language — advocated worker self-defense through councils rather than a centralized
  // secret-police coercive machine.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","D","DT","C","D","C"],
  diplomacia: ["D","C","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  // As an internationalist council communist, opposed nationalist "socialism in one country" framing,
  // but also rejected top-down party-directed export-of-revolution in favor of genuine cross-border
  // solidarity between self-organized worker councils.
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Advocated worker self-management of production directly through councils, explicitly naming the
  // Bolshevik/Stalinist state-command model "state capitalism" — a new ruling bureaucracy replacing
  // capitalists, not genuine socialism — a real, documented doctrinal rupture from Lenin/Trotsky's
  // party-directed planning that should read as a distinctly worker-collective (not party-state) model.
  economia: ["CT","DT","C","DT","CT","D","C","DT","CT","D","C","N","CT","D","C","D","D","DT","N","D"],
  // Per the established methodology for council-communist/anarchist-adjacent economics: score by the
  // spirit of collectivized worker self-coordination (still high controle in the "planned, not
  // market-driven" sense) even though Pannekoek explicitly rejected top-down bureaucratic state planning.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","N","C","N"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","N"],
  // As a professional astronomer and committed Marxist, held a strongly materialist/scientific
  // worldview explicitly opposed to religious mysticism, viewing religion as an instrument of
  // bourgeois/clerical social control.
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Council communism's emphasis on mass self-education and self-emancipation extended naturally to a
  // broadly progressive, anti-authoritarian social outlook, distinct from the Bolsheviks' more
  // instrumentalized, state-directed approach to social liberalization.
  moral: ["C","D","C","D","C","DT","C","N","C","DT","C","D","C","N","N","D","N","DT","C","D"],
  // A working astronomer who made genuine scientific contributions (Pannekoek craters on the Moon and
  // Mars are named after him) — a real, personal commitment to empirical science, distinct from the
  // other four figures' primarily political/ideological engagement with technology.
  tecnologia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
};

export const PROFILES = {
  "lenin": LENIN,
  "stalin": STALIN,
  "mao-zedong": MAO_ZEDONG,
  "trotsky": TROTSKY,
  "anton-pannekoek": ANTON_PANNEKOEK,
};
