// FQA107: arqueofuturismo (ideology) + guillaume-faye (personality).
//
// Both profiles were added to the catalogs after the audit began (commit f86e73f) and had
// hand-picked placeholder vectors that were never run through the genuine per-question pipeline.
// This batch derives them for real, from Guillaume Faye's actual doctrine: "Archeofuturism"
// (1998), "Convergence of Catastrophes" (2004), "The Colonisation of Europe" (2000), "Sex and
// Deviance" (2011), "Why We Fight" (2001).
//
// Doctrine summary used throughout:
// - Ethnopluralist, fiercely anti-immigration/anti-multicultural, explicitly anti-Islam
//   ("colonization" thesis) -> extreme assimilationist on imigracao.
// - Authoritarian/anti-egalitarian, admires archaic hierarchy and decisive leadership, contemptuous
//   of mass liberal democracy -> extreme autocracy on representacao.
//  -Warrior-ethos militarism, pro-armament, deterrence, pan-European strategic autonomy
//   ("Eurosiberia") -> extreme militarism on diplomacia, extreme nationalist-assertive on
//   intervencao, security-hawk on poder.
// - Anti-globalist, autarkic, strategic-industrial economics (rejects both liberal capitalism and
//   Marxist collectivism) -> protectionist on comercio, planning-leaning on controle, genuinely
//   near-center/mixed on economia (not a doctrinaire economic thinker).
// - Anti-Christian ("Semitic," egalitarian religion he blames for eroding European vitality) but
//   pro-pagan/mythic spirituality tied to ethnic identity, anti-Islam -> genuinely mixed/contested
//   on religiao, not a simple pole pick.
// - Culturally reactionary on family/gender/race (anti-gender-theory, anti-cotas, natalist
//   anti-abortion), BUT "Sex and Deviance" explicitly defends pagan sexual permissiveness
//   (poliamor, nudity, sex work) against Christian sexual repression -> moderately-strong (not
//   maximally extreme) traditionalist on moral, reflecting this real, documented tension.
// - tecnologia: leftPole "Tecnologia" (pro-tech, high score) vs rightPole "Biologia" (nature/
//   caution, low score). Archeofuturism's defining pillar is the *fusion* of archaic values with
//   unapologetic hyper-technology (nuclear power, space colonization, genetic engineering/eugenics,
//   transhumanism), explicitly rejecting primitivist nostalgia as much as liberal progressivism ->
//   strongly pro-Tecnologia. The placeholder (93) already had the right direction; the genuine
//   per-question audit lands a bit lower (~85), pulled down by the real tension between the
//   "archaic" half's rootedness/land themes and a couple of specifically bio-adjacent questions
//   (lab-grown meat replacing hunting culture, urban vs. rural life) that don't resolve cleanly to
//   either pole.
//
// guillaume-faye (the personality) mirrors the doctrine almost exactly since he is its author, with
// three deliberate personal-biography deltas: poder.Q4 (he was personally prosecuted in France for
// "incitement to racial hatred" over his own writing, so free-expression protection for
// offensive/extremist ideas is personally salient, not just doctrinal -> CT instead of C),
// diplomacia.Q7 (he explicitly championed European strategic nuclear autonomy in "Why We Fight" ->
// CT instead of C), and imigracao.Q10 (his own rhetoric on this point is blunter than the generic
// doctrine label -> DT instead of D).

const ARCHEOFUTURISM_ANSWERS = {
  estrutura:     "C,D,C,D,C,D,C,N,D,D,C,D,C,D,C,N,C,D,C,D".split(","),
  representacao: "DT,CT,D,CT,D,CT,DT,CT,D,CT,D,CT,DT,C,DT,CT,DT,C,D,CT".split(","),
  poder:         "CT,D,CT,C,C,N,CT,D,D,CT,CT,C,C,D,CT,D,D,C,CT,D".split(","),
  imigracao:     "CT,DT,CT,DT,CT,DT,CT,DT,CT,D,CT,DT,CT,DT,CT,DT,CT,DT,CT,DT".split(","),
  diplomacia:    "CT,D,CT,DT,CT,D,C,DT,CT,DT,CT,D,CT,D,CT,D,CT,DT,CT,DT".split(","),
  intervencao:   "DT,CT,D,CT,D,C,DT,CT,DT,C,D,CT,D,CT,D,CT,D,CT,D,CT".split(","),
  economia:      "N,N,C,D,N,DT,N,C,C,DT,D,N,C,C,D,N,C,C,N,D".split(","),
  controle:      "CT,D,C,N,N,D,CT,N,C,D,CT,D,D,D,N,D,C,DT,N,D".split(","),
  comercio:      "CT,DT,CT,D,C,DT,CT,DT,CT,DT,CT,D,CT,D,CT,D,CT,D,CT,DT".split(","),
  religiao:      "D,C,D,D,N,C,D,D,C,C,D,D,D,N,D,N,D,D,C,C".split(","),
  moral:         "DT,C,DT,CT,DT,C,D,CT,D,C,D,C,C,CT,D,D,C,C,C,C".split(","),
  tecnologia:    "CT,DT,C,DT,C,D,C,DT,CT,D,CT,DT,N,DT,CT,D,N,N,CT,DT".split(","),
};

const GUILLAUME_FAYE_ANSWERS = {
  ...ARCHEOFUTURISM_ANSWERS,
  poder: ARCHEOFUTURISM_ANSWERS.poder.map((v, i) => (i === 3 ? "CT" : v)), // Q4: free expression, personal
  diplomacia: ARCHEOFUTURISM_ANSWERS.diplomacia.map((v, i) => (i === 6 ? "CT" : v)), // Q7: nuclear autonomy
  imigracao: ARCHEOFUTURISM_ANSWERS.imigracao.map((v, i) => (i === 9 ? "DT" : v)), // Q10: blunter personal rhetoric
};

export const PROFILES = {
  ideology: {
    arqueofuturismo: ARCHEOFUTURISM_ANSWERS,
  },
  personality: {
    "guillaume-faye": GUILLAUME_FAYE_ANSWERS,
  },
};
