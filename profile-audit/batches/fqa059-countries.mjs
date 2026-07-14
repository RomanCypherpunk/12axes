// FQA059 — genuine per-question audit (5 profiles x 12 axes x 20 questions).
// imperio-portugues: 1415-1822 peak — the first global colonial empire (starting at Ceuta, 1415),
//   crown-controlled Catholic missionary "padroado" patronage, a maritime trade thalassocracy (Estado
//   da Índia spice monopoly), central to the Atlantic slave trade, the Inquisition operated against
//   "New Christian" conversos in Portugal and its colonies.
// austria: contemporary federal parliamentary republic — constitutionally permanent neutrality (the
//   1955 State Treaty, not a NATO member), a robust "social market economy" welfare state, deep EU
//   integration, real federalism among 9 Bundesländer.
// imperio-alemao: 1871-1918 — Prussian-dominated federation where constituent kingdoms (Bavaria,
//   Saxony, Württemberg) retained real but subordinate autonomy, Reichstag universal male suffrage
//   coexisted with concentrated Kaiser/Chancellor executive power, Bismarck pioneered the world's first
//   modern social-insurance welfare state even while banning the Social Democratic party, aggressive
//   naval buildup and colonial ambitions contributed directly to the outbreak of WWI.
// portugal: contemporary semi-presidential republic — stable democracy since the peaceful 1974
//   Carnation Revolution ended the Estado Novo dictatorship, pioneered drug decriminalization (2001, a
//   globally influential model) and legalized same-sex marriage (2010), EU member with a tourism-driven
//   post-2011-bailout economy.
// alemanha-oriental: 1949-90 GDR — single-party SED rule, the Stasi secret police ran one of history's
//   most pervasive surveillance/informant networks, the Berlin Wall (1961-89) physically blocked
//   emigration, a fully centrally planned command economy, official state secularism, very high female
//   workforce participation backed by universal state childcare.

const IMPERIO_PORTUGUES = {
  // An absolute monarchy governing a globally dispersed empire (Brazil, Angola, Mozambique, Goa,
  // Macau) required real day-to-day administrative delegation to colonial viceroys/governors, even as
  // ultimate sovereignty remained centralized in Lisbon.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Portuguese Inquisition (established 1536) targeted "New Christian" converso descendants of
  // Jews and Muslims for generations, alongside a slave-trade economy sustained by extensive coercive
  // violence across the Atlantic world.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // The "padroado" system explicitly fused Catholic missionary conversion with colonial administration
  // — deliberate religious/cultural assimilation of colonized peoples (forced baptism campaigns in Goa,
  // Portuguese-language/Catholic identity imposed as markers of "civilized" status) was official policy.
  imigracao: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  // Built and defended a global maritime trade-and-fortress network (Goa, Malacca, Hormuz, Elmina)
  // through sustained naval power projection — a genuinely militarized thalassocracy.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Central to the Atlantic slave trade and repeatedly fought to expand and defend its colonial
  // possessions across four continents over three centuries — maximally expansionist/interventionist.
  intervencao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // A crown-monopolized spice-and-slave trade economy (the Estado da Índia's pepper monopoly, the
  // Casa da Índia regulating all colonial commerce) — deliberate royal economic control rather than
  // private market development.
  economia: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","D","D","C","D","CT","D","C","D"],
  // The Casa da Índia in Lisbon held an explicit royal monopoly over the entire spice trade route —
  // among history's most tightly state-controlled trade systems.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // Catholic missionary conversion was not incidental but a central, explicit justification and
  // instrument of empire — church and crown authority were deeply, deliberately fused.
  religiao: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","D","CT","D","CT","DT","CT","D","CT","DT","CT"],
  moral: ["DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","N","CT","D","CT","DT","CT"],
  // Pioneered genuinely advanced maritime technology for its era (the caravel, astronomical
  // navigation techniques, the Portuguese school of cartography) — real, applied nautical-engineering
  // innovation in service of trade and conquest.
  tecnologia: ["C","D","N","N","N","N","D","N","DT","N","C","N","D","DT","C","N","D","N","N","D"],
};

const AUSTRIA = {
  // A genuine federation of 9 Bundesländer with their own governments and constitutions, though
  // Vienna/the federal government retains more centralized authority than in Germany's stronger
  // federalism.
  estrutura: ["C","D","C","D","C","D","C","D","D","D","C","D","C","D","C","D","C","D","C","D"],
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  poder: ["D","C","D","C","D","C","D","C","D","D","N","C","D","C","DT","C","D","C","D","C"],
  // The far-right FPÖ has repeatedly polled strongly on anti-immigration platforms (entering
  // government coalitions multiple times since 2000), reflecting genuine, mainstream-normalized
  // assimilationist political sentiment rather than a fringe position.
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // Constitutionally, permanently neutral since the 1955 State Treaty (a condition of Soviet troop
  // withdrawal) — not a NATO member, deliberately abstains from collective-defense military alliances.
  diplomacia: ["D","CT","D","CT","D","CT","DT","CT","D","CT","D","C","D","C","D","CT","D","D","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // A "social market economy" combining a robust welfare state (strong unemployment/health/pension
  // benefits, and until the 1990s privatization wave a genuinely large nationalized-industry sector —
  // OMV, VOEST, the Verstaatlichte Industrie) with private enterprise — historically more state-owned-
  // industry-heavy than Portugal's smaller public sector, though both remain mixed economies.
  economia: ["C","D","C","D","D","D","C","C","C","D","C","D","C","D","N","D","C","D","N","C"],
  // Historically strong "social partnership" (Sozialpartnerschaft) corporatist wage-bargaining between
  // unions/employers/state — a distinctively coordinated-market model, differing from Portugal's more
  // conventional post-bailout EU-standard regulatory regime.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","C","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  moral: ["C","N","C","N","N","D","C","N","C","D","C","D","N","N","N","D","N","D","C","N"],
  tecnologia: ["C","D","C","N","C","N","N","C","N","C","C","D","C","D","C","D","N","D","C","N"],
};

const IMPERIO_ALEMAO = {
  // Prussia dominated the federation (its king was automatically Kaiser), but Bavaria, Saxony, and
  // Württemberg retained real constitutional prerogatives (their own armies under nominal unified
  // command, separate postal/railway administrations in some cases) — a genuine, if Prussian-skewed,
  // federal structure.
  estrutura: ["C","D","C","D","C","D","C","D","D","C","C","D","C","D","C","D","C","D","C","D"],
  // Universal male suffrage elected the Reichstag, but it could not appoint or dismiss the Chancellor
  // (who answered only to the Kaiser) — a real, competitive electorate with structurally hollow ultimate
  // power, a distinctive "form without substance" representation model.
  representacao: ["C","CT","C","C","D","CT","C","C","D","CT","C","CT","D","C","C","CT","D","C","D","CT"],
  // The 1878 Anti-Socialist Laws banned the SPD's organizational activity for over a decade even as
  // Bismarck simultaneously built the era's most advanced social-insurance welfare system — a genuinely
  // split coercion-plus-cooptation strategy toward the labor movement specifically.
  poder: ["C","D","C","D","C","C","C","D","C","D","C","C","N","D","D","D","C","C","D","D"],
  imigracao: ["CT","D","C","D","C","D","CT","D","C","D","CT","D","C","D","C","D","C","D","C","DT"],
  // Built the High Seas Fleet explicitly to rival Britain's Royal Navy (the Tirpitz naval race) and
  // maintained a massive conscript standing army — deliberate, escalatory militarism that directly
  // fed the pre-WWI arms-race dynamic.
  diplomacia: ["CT","D","C","D","CT","D","C","D","CT","D","C","D","C","N","C","D","CT","DT","CT","D"],
  // Pursued late-colonial "Weltpolitik" expansion (German East/Southwest Africa, Pacific colonies) and
  // an entangling alliance system (with Austria-Hungary) that directly precipitated WWI — assertively
  // expansionist rather than restrained.
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // Rapid, largely privately-capitalized industrialization (Krupp, Thyssen, the great chemical/
  // electrical firms) alongside Bismarck's pioneering *compulsory* health/accident/old-age insurance
  // system (1883-89, funded by mandatory employer/worker contributions) — the first modern welfare
  // state, layered atop an otherwise dynamically private-capitalist industrial economy.
  economia: ["D","C","D","C","D","D","C","C","D","D","N","C","D","D","N","D","D","C","C","C"],
  // Cartels (Kartelle) were legally favored and economically dominant (steel, coal, chemicals), and the
  // state ran the railways as a Prussian state monopoly — real, if industry-specific rather than
  // economy-wide, direction distinct from Austria's corporatist wage-bargaining model.
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","N","D"],
  // Rapidly rising industrial-export power (steel, chemicals, electrical goods) competing aggressively
  // in global markets while also erecting real protective tariffs (the 1879 "iron and rye" tariff
  // coalition) to shield domestic agriculture and heavy industry.
  comercio: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  // The Kulturkampf (1871-78) actively suppressed Catholic Church institutional influence (expelling
  // Jesuits, state control of clergy education) before Bismarck reversed course and reconciled with the
  // Church for political reasons — real, if inconsistent, state-religion conflict.
  religiao: ["C","C","C","C","C","C","C","D","C","C","N","C","D","C","D","C","D","D","C","C"],
  moral: ["D","CT","D","CT","D","CT","D","C","D","CT","D","CT","D","C","N","CT","D","CT","D","CT"],
  // World-leading chemical (BASF, dye synthesis) and electrical (Siemens) industries, alongside a
  // rigorous technical-university system underpinning the era's most advanced industrial R&D base.
  tecnologia: ["C","D","C","D","C","D","N","D","N","D","N","D","C","D","N","D","N","D","C","D"],
};

const PORTUGAL = {
  estrutura: ["D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C","N","C","D","C"],
  // A stable, consolidated democracy since the peaceful 1974 Carnation Revolution ended over four
  // decades of Estado Novo authoritarian rule — strong constitutional courts, free press, and regular
  // competitive elections with no serious backsliding since.
  representacao: ["CT","DT","CT","D","C","DT","CT","D","C","DT","C","DT","D","D","CT","DT","D","DT","CT","DT"],
  // Pioneered drug decriminalization in 2001 (possession treated as a health issue, not a crime) — a
  // globally influential harm-reduction model — alongside comparatively moderate ordinary policing.
  poder: ["D","CT","D","CT","D","CT","D","C","DT","CT","D","CT","N","C","DT","CT","D","C","D","CT"],
  imigracao: ["C","D","C","N","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  // NATO founding member (1949) but with a historically low-profile, modest defense posture and no
  // significant power-projection ambition.
  diplomacia: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C"],
  intervencao: ["CT","DT","C","D","CT","D","C","D","CT","DT","C","D","CT","DT","C","D","C","D","CT","DT"],
  // A tourism-and-services-driven economy that underwent painful austerity after the 2011 EU/IMF
  // bailout, followed by a market-oriented recovery, alongside a still-meaningful (if reduced from its
  // post-1974 peak) public welfare-state and nationalized-utility legacy.
  economia: ["C","D","C","D","D","D","C","D","C","D","C","D","C","D","N","D","C","D","C","D"],
  controle: ["C","D","C","D","C","D","C","D","C","D","C","D","D","D","C","D","N","D","C","D"],
  comercio: ["D","C","D","C","D","C","D","C","D","C","D","C","D","C","N","C","D","C","D","C"],
  // Once one of Europe's most devoutly Catholic societies, now genuinely secularizing (legalized
  // same-sex marriage in 2010, abortion via 2007 referendum) while retaining significant cultural
  // Catholic identity, especially outside Lisbon/Porto.
  religiao: ["C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D","C","D"],
  // Legalized same-sex marriage (2010, without adoption initially, later expanded) and drug
  // decriminalization (2001) place Portugal among Europe's more progressive states on personal-liberty
  // social policy despite its traditionally Catholic heritage.
  moral: ["CT","D","CT","D","C","DT","CT","D","CT","DT","C","DT","C","D","C","D","C","DT","CT","D"],
  tecnologia: ["C","D","C","N","C","N","N","C","C","C","C","D","C","D","C","D","C","D","C","N"],
};

const ALEMANHA_ORIENTAL = {
  // A tightly centralized unitary socialist state — the historic Länder were abolished in 1952 and
  // replaced with 14 centrally administered Bezirke (districts) with no independent authority.
  estrutura: ["DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT"],
  // Single-party SED rule with sham "bloc party" elections offering no real choice, no independent
  // press, no competitive politics of any kind — among the least representative states in this project.
  representacao: ["D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT","D","CT"],
  // The Stasi ran one of history's most pervasive surveillance states (an estimated 1 in 60 citizens
  // was an informant at points), the Berlin Wall (1961-89) used lethal force ("Todesstreifen" death
  // strip) to prevent emigration — maximal, systematic domestic coercion.
  poder: ["CT","DT","CT","DT","CT","DT","CT","DT","DT","CT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT"],
  imigracao: ["C","D","C","D","C","D","C","D","C","D","C","D","N","D","C","D","D","D","C","D"],
  diplomacia: ["C","C","D","C","C","D","C","D","C","D","C","N","C","N","C","D","C","DT","C","N"],
  // Fully integrated into the Warsaw Pact military structure under Soviet command, with no independent
  // foreign-policy latitude of consequence.
  intervencao: ["D","CT","D","CT","D","C","N","C","D","CT","D","C","D","C","D","CT","D","CT","D","CT"],
  // A fully centrally planned command economy (Five-Year Plans, state ownership of essentially all
  // industry and agriculture via LPGs) — one of the most thoroughgoing planned economies in the Eastern
  // Bloc, alongside chronic consumer-goods shortages relative to the West.
  economia: ["CT","DT","CT","DT","CT","DT","C","DT","CT","D","C","N","CT","DT","CT","DT","C","DT","C","DT"],
  controle: ["CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","CT","DT","C","DT","CT","DT","CT","DT","CT","DT"],
  // Trade overwhelmingly directed toward COMECON/Soviet-bloc partners under centrally negotiated
  // bilateral agreements rather than global markets — a closed, bloc-protected trading system.
  comercio: ["CT","D","CT","D","C","D","CT","D","C","D","CT","D","C","D","N","D","CT","D","CT","D"],
  // Official Marxist-Leninist state atheism actively discouraged religious practice (though it never
  // achieved full suppression — Lutheran churches remained present and later became crucial organizing
  // spaces for the 1989 protest movement) — among the most secularizing state projects audited.
  religiao: ["CT","DT","CT","DT","C","DT","CT","DT","CT","DT","C","DT","C","DT","CT","DT","C","DT","CT","DT"],
  // Very high female labor-force participation backed by universal state-provided childcare and
  // liberal abortion access (legalized 1972, more liberal than West Germany at the time) — genuinely
  // progressive on gender-economic-participation grounds, though within a rigidly conformist,
  // one-party-controlled overall social order.
  moral: ["C","N","C","D","C","D","C","N","CT","DT","C","D","N","N","N","D","N","D","CT","D"],
  // Despite Western sanctions/embargoes, the GDR built a comparatively advanced (for the Eastern Bloc)
  // industrial and microelectronics base (Carl Zeiss Jena, Robotron computers), the Eastern Bloc's most
  // technologically developed economy after the USSR itself.
  tecnologia: ["C","D","C","D","C","D","N","D","N","D","N","D","C","D","N","D","N","D","C","D"],
};

export const PROFILES = {
  "imperio-portugues": IMPERIO_PORTUGUES,
  "austria": AUSTRIA,
  "imperio-alemao": IMPERIO_ALEMAO,
  "portugal": PORTUGAL,
  "alemanha-oriental": ALEMANHA_ORIENTAL,
};
