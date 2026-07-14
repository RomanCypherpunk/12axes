// FQA062 — genuine per-question audit (5 personalities x 12 axes x 20 questions).
// kim-il-sung: founded North Korea on the Juche self-reliance doctrine, established the world's only
//   hereditary communist dynasty, launched the 1950 invasion of South Korea, built the songbun
//   hereditary loyalty-caste system and the kwanliso political-prison-camp network, suppressed
//   religion entirely in favor of a state cult of personality.
// pol-pot: Khmer Rouge "Year Zero" — forcibly evacuated every city within days, abolished money/
//   markets/private property/religion outright, executed the educated/professional classes and
//   religious minorities, killed an estimated quarter of Cambodia's population, rejected virtually all
//   modern technology as part of an anti-urban agrarian-primitivist ideology.
// deng-xiaoping: "socialism with Chinese characteristics" — market reforms and Special Economic Zones
//   (Shenzhen) opened China to global trade while the Communist Party retained total political
//   monopoly, ordered the violent 1989 Tiananmen Square crackdown, enforced the one-child population-
//   control policy.
// ferdinand-lassalle: founded the ADAV (the first major German workers' party, precursor to the SPD),
//   believed universal suffrage and state-financed producer cooperatives — not violent revolution —
//   were the path to socialism, a genuinely more reformist/parliamentary figure than Marx (who
//   criticized Lassallean influence on the SPD's Gotha Programme), pursued a controversial tactical
//   dialogue with Bismarck.
// ataturk: founded the Turkish Republic from Ottoman collapse — abolished the Caliphate (1924) and
//   Sharia courts, replaced the Arabic script with the Latin alphabet (1928), extended full women's
//   suffrage (1934, ahead of many European states), pursued state-led "etatist" industrial
//   development, adopted a deliberately non-expansionist "Peace at Home, Peace in the World" foreign policy.

const KIM_IL_SUNG = {
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Established the only hereditary dynastic succession in the communist world (his son and grandson
  // both inherited supreme leadership) — a purely hereditary, zero-electoral-accountability system
  // even by the standards of one-party states.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The songbun hereditary loyalty-classification system and the kwanliso political-prison-camp
  // network (still operating today) represent one of history's most totalizing, multi-generational
  // systems of state coercive control over the population.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The Juche doctrine of national self-reliance fused Marxism with an extreme, exclusionary Korean
  // ethnic-nationalist ideology — foreigners and even ethnically-Korean returnees from abroad were
  // treated with deep suspicion within the songbun hierarchy.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Personally launched the June 1950 invasion of South Korea, built one of the world's largest
  // standing militaries relative to population, and pursued a nuclear-weapons program as the
  // regime's ultimate survival guarantee.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  intervencao: ["D","CT","D","CT","D","C","N","CT","D","CT","D","C","D","CT","D","CT","D","CT","D","CT"],
  // Total command economy: collectivized agriculture and industry entirely under state ownership,
  // with the Juche doctrine explicitly prioritizing self-sufficient state production over trade or
  // market mechanisms of any kind.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","DT","CT","DT","CT","D","CT","DT","CT","D","CT","D","CT","D","CT","D","CT","DT","C","DT"],
  // Juche self-sufficiency was explicitly conceived as autarkic — minimizing dependence on foreign
  // trade to the point of near-total isolation, among the most closed trade postures in modern history.
  comercio: ["CT","DT","CT","DT","C","D","CT","DT","C","D","CT","D","C","D","N","D","CT","DT","CT","N"],
  // Suppressed all organized religion entirely, replacing it with a state cult of personality around
  // the Kim family (Kimilsungism) that itself took on explicitly religious-style veneration
  // (mandatory portrait display, quasi-messianic birth mythology) — religion eliminated and replaced,
  // not merely subordinated.
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  moral: ["D","C","D","N","D","C","D","N","D","CT","D","C","N","N","N","C","N","C","D","C"],
  tecnologia: ["C","D","N","D","N","D","N","D","C","D","N","D","C","D","C","D","N","D","C","D"],
};

const POL_POT = {
  // Abolished all existing administrative structures, cities, currency, and private property in the
  // "Year Zero" reset, replacing them with a network of rural collective work camps under direct,
  // absolute central Party (Angkar) command — the most extreme, deliberately total centralization
  // audited in this project.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Executed or worked/starved to death an estimated quarter of Cambodia's population (1.5-2 million
  // people), including systematic targeting of the educated (people wearing glasses were killed as
  // suspected intellectuals) — among the most extreme documented state-violence campaigns in modern history.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Explicitly genocidal ethnic-cleansing policy against Vietnamese, Chinese, and Cham Muslim
  // minorities within Cambodia, alongside xenophobic total isolation from the outside world — among
  // the most extreme forced-homogenization projects in this entire project.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Provoked border war with Vietnam (which eventually invaded and overthrew the regime in 1979) while
  // maintaining an otherwise almost totally closed, isolated military posture with minimal outward
  // power projection capacity of its own.
  diplomacia: ["C","D","C","D","C","D","C","D","C","D","C","N","C","N","D","D","C","D","C","N"],
  intervencao: ["D","C","D","C","D","C","N","C","D","C","D","C","D","C","D","C","D","D","D","C"],
  // Abolished money and markets entirely, forced the entire population into collectivized agricultural
  // labor with production quotas set centrally by Angkar — the most extreme command-economy
  // experiment audited, eclipsing even Stalin's or Mao's collectivization in totality.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","DT","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","C","DT"],
  // Deliberately severed almost all foreign trade and international contact — an explicitly
  // isolationist, self-sufficiency-through-agrarian-primitivism doctrine even more extreme than Juche.
  comercio: ["CT","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","C","DT","N","DT","CT","DT","CT","N"],
  // Destroyed Buddhist temples, forcibly defrocked or executed monks, and banned religious practice
  // outright as part of the total societal reset — Buddhism, the near-universal Cambodian faith, was
  // targeted for elimination specifically.
  religiao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","D","CT","D","DT","CT","DT","CT","DT","CT","DT"],
  moral: ["D","C","D","N","D","C","D","N","D","CT","D","N","N","N","N","C","N","C","D","C"],
  // Explicitly anti-industrial, anti-urban, anti-technological ideology — evacuated all cities,
  // destroyed schools and hospitals' modern equipment, forced the population into pre-industrial
  // agrarian labor as a matter of core doctrine, not mere economic circumstance.
  tecnologia: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","DT","CT","DT","CT","DT","CT"],
};

const DENG_XIAOPING = {
  // Special Economic Zones (Shenzhen, Shantou) were deliberately granted real autonomous policy
  // latitude to experiment with market mechanisms years before the rest of the country — a genuine,
  // asymmetric regional-experimentation federalism-of-sorts distinct from Atatürk's uniform
  // top-down nation-building.
  estrutura: ["C","D","C","D","N","C","D","D","D","C","C","D","D","D","C","D","N","D","D","D"],
  // Retained absolute one-party political monopoly throughout economic liberalization — famously
  // ordered the People's Liberation Army to violently clear Tiananmen Square in June 1989 against
  // pro-democracy protesters — but did introduce term limits and collective-leadership norms within
  // the Party itself (partly reversing Mao-style personalist rule), a real if narrow institutional
  // difference from Kim's purely hereditary system or Pol Pot's faceless Angkar collective.
  representacao: ["D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","CT","D","C","D","CT"],
  // Directly ordered the deadly Tiananmen Square crackdown (1989) and enforced the coercive one-child
  // population-control policy (forced sterilizations/abortions documented) — real, severe state
  // coercion alongside the economic opening, though notably less totalizing than Mao's mass campaigns.
  poder: ["C","D","CT","D","C","D","C","D","D","CT","C","D","C","D","CT","D","C","D","CT","D"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Pursued a deliberately low-profile, non-confrontational foreign policy ("hide your strength, bide
  // your time") to focus resources on domestic economic development, while still authorizing a brief
  // punitive border war against Vietnam (1979) — more actively calculating than Atatürk's settled,
  // post-independence-war peace doctrine.
  diplomacia: ["D","C","D","C","C","C","D","C","D","D","D","C","D","C","D","C","D","C","D","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // "Socialism with Chinese characteristics" reintroduced private enterprise, foreign investment, and
  // market pricing for large sectors of the economy ("black cat, white cat" pragmatism) — a decisive,
  // deliberate retreat from Maoist total collectivization toward market mechanisms, though under
  // continued Party strategic direction.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","N","C"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  // Created Special Economic Zones (Shenzhen, Shantou) explicitly to attract foreign investment and
  // export manufacturing — a deliberate, historic opening to global trade after decades of Maoist
  // autarky, laying the groundwork for eventual WTO accession.
  comercio: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // Allowed a genuine, if tightly state-monitored, revival of religious practice after Mao's total
  // suppression (reopened some temples/churches under state-approved religious associations) — real
  // relative liberalization even while religion remained politically controlled.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","D","D","D","C","C"],
  moral: ["D","C","D","C","D","C","D","N","D","C","D","N","N","N","N","C","N","C","D","N"],
  // Championed the "Four Modernizations" (agriculture, industry, defense, science/technology),
  // explicitly rehabilitating scientists and universities purged during Mao's anti-expertise Cultural
  // Revolution — technology framed as urgent national catch-up after a lost generation, distinct from
  // Atatürk's literacy/alphabet-reform-centered modernization drive.
  tecnologia: ["C","D","C","D","C","C","N","C","C","D","C","D","C","D","C","D","N","D","C","D"],
};

const FERDINAND_LASSALLE = {
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  // Believed universal suffrage was the working class's decisive path to political power and thence
  // socialism — a genuinely more parliamentary/electoral strategy than Marx's revolutionary vanguardism,
  // founding the ADAV explicitly to campaign for the ballot as the workers' primary weapon.
  representacao: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","D","D","CT","D","D","D","C","D"],
  poder: ["N","C","N","C","N","C","N","D","N","C","N","C","N","C","D","C","N","C","D","C"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Less internationalist than Marx — focused his organizing explicitly on German national workers'
  // interests, and controversially engaged Bismarck in tactical dialogue (seeking anti-liberal-
  // bourgeois common cause), a genuinely more nationally-bounded strategic posture than Marx/Engels'
  // internationalism.
  diplomacia: ["N","C","D","C","N","C","D","C","N","C","N","N","N","C","D","C","D","D","N","N"],
  intervencao: ["C","D","C","D","C","D","N","C","C","D","C","D","C","D","C","D","D","C","D","D"],
  // Advocated state-financed producer cooperatives (using state credit to help workers establish
  // self-managed enterprises) as the concrete mechanism for transforming capitalism — a genuinely
  // state-socialist, gradualist economic program, distinct from Marx's revolutionary expropriation model.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","D","C","DT","C","DT"],
  // The "Iron Law of Wages" critique of capitalism and his advocacy for extensive state economic
  // intervention (state-funded cooperatives specifically) reflect a genuinely dirigiste, state-
  // socialist economic doctrine.
  controle: ["CT","D","C","D","CT","D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","N"],
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","N","N","N","N","N","N","N","N","N","N","C","N","N","N","N","N","N","N"],
};

const ATATURK = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  // Ruled through his own single party (CHP) for most of his tenure with limited genuine electoral
  // competition, though he did introduce some parliamentary institutions and briefly experimented with
  // a loyal opposition party — real, if narrow and controlled, institutional pluralism.
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // Crushed Kurdish revolts (Sheikh Said 1925, Dersim 1937-38) with severe military force and
  // maintained tight one-party political control, alongside genuinely radical, rapid top-down social
  // transformation enforced by state authority (banning the fez, mandating Western dress).
  poder: ["CT","D","C","D","CT","D","C","D","D","CT","CT","D","N","D","CT","D","CT","D","CT","D"],
  // Explicit, deliberate Turkish nation-building through forced cultural homogenization — the 1928
  // alphabet reform, suppression of Kurdish language/identity, and "Citizen, speak Turkish!" campaigns
  // all pursued assimilation into a unified secular Turkish identity as core state doctrine.
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Fought the Turkish War of Independence to secure the republic's borders, then deliberately adopted
  // "Peace at Home, Peace in the World" — a genuinely non-expansionist foreign-policy doctrine after
  // consolidating the state, in explicit contrast to the late Ottoman/WWI-era entanglements.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // Pursued "etatism" (devletçilik) — significant state-owned industrial enterprises (Sümerbank state
  // factories) alongside private enterprise — a deliberate mixed-economy development strategy for a
  // late-industrializing state.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // Abolished the Caliphate (1924) and Sharia courts, adopted the Swiss civil code, and enforced strict
  // laïcité removing Islam as the state religion (1928 constitutional amendment) — one of the most
  // decisive, deliberate state-secularization projects of the 20th century.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Extended full women's suffrage in 1934 (ahead of France, for instance), banned polygamy, and
  // replaced religious family law with a secular civil code — a genuinely radical, state-enforced
  // social-liberalization program by the standards of its time and region.
  moral: ["C","D","C","D","C","DT","C","N","C","DT","C","D","N","N","N","D","N","DT","C","D"],
  // The 1928 Latin-alphabet literacy campaign and Western-style education reform were centerpiece
  // achievements — a deliberate, state-driven modernization project explicitly modeled on Western
  // scientific/technical development.
  tecnologia: ["C","D","C","N","C","C","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

export const PROFILES = {
  "kim-il-sung": KIM_IL_SUNG,
  "pol-pot": POL_POT,
  "deng-xiaoping": DENG_XIAOPING,
  "ferdinand-lassalle": FERDINAND_LASSALLE,
  "ataturk": ATATURK,
};
