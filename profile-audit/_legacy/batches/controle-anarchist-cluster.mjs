import { loadQuestions, answerToLeftScore, calculateAxisValue } from "../scripts/full-audit-lib.mjs";

const { byAxis } = loadQuestions();
const controleQuestions = byAxis.get("controle");

// Three reasoned archetypes for the anti-capitalist / anti-statist economic-left
// cluster, derived question-by-question from controle_01..20 (see chat rationale).
// Principle: questions that name "o governo"/"o Estado"/"Banco Central" as the
// agent doing economic COORDINATION (planning, subsidies, price control, minimum
// wage, counter-cyclical spending) are read for their ECONOMIC-COORDINATION stance
// (collective/planned vs market), per this project's documented convention for the
// controle axis (see CLAUDE.md: anti-capitalists must not be scored as free-marketers
// just because they also reject the state). Questions that are inherently about WHICH
// state monetary institution controls money (Banco Central obedience/independence,
// abolishing it) get "N" for the two archetypes that reject central banking on
// principle regardless of who nominally controls it.

const ARCHETYPES = {
  collectivist: [
    "C", "D", "N", "DT", "CT", "DT", "N", "DT", "C", "D",
    "D", "N", "C", "DT", "C", "N", "D", "N", "CT", "DT",
  ],
  syndicalist: [
    "C", "D", "N", "DT", "CT", "DT", "C", "DT", "C", "D",
    "N", "N", "C", "DT", "C", "N", "N", "N", "CT", "DT",
  ],
  marketMutualist: [
    "D", "C", "D", "C", "N", "N", "DT", "N", "D", "C",
    "DT", "CT", "DT", "N", "D", "C", "DT", "CT", "N", "C",
  ],
};

const ASSIGNMENTS = {
  collectivist: [
    "anarcocomunismo", "anarcocoletivismo", "comunalismo", "anarquismo",
    "anarcofeminismo", "anarquismo-queer", "anarcopacifismo", "anarquismo-cristao",
    "anarco-naturalismo", "anarcoprimitivismo", "anarquismo-agrario", "anarquismo-verde",
    "ecofeminismo", "ecossocialismo", "libertarianismo-social", "socialismo-libertario",
  ],
  syndicalist: ["anarcossindicalismo", "sindicalismo", "marxismo-libertario"],
  marketMutualist: [
    "mutualismo", "minarco-mutualismo", "minarco-socialismo", "socialismo-de-mercado",
    "socialismo-de-mercado-libertario", "socialismo-individualista", "geoanarquismo",
    "geolibertarianismo", "anarquismo-egoista",
  ],
};

function rowsFor(profileId, answers) {
  return controleQuestions.map((question, index) => {
    const answer = answers[index];
    return {
      catalog: "ideology",
      profileId,
      axisId: "controle",
      questionId: question.id,
      answer,
      agreePole: question.agreePole,
      leftScore: answerToLeftScore(question, answer),
      weight: question.weight ?? 1,
    };
  });
}

const output = [];
for (const [archetype, answers] of Object.entries(ARCHETYPES)) {
  const value = calculateAxisValue(rowsFor("preview", answers));
  console.log(`${archetype}: computed controle = ${value}`);
}
console.log("");

for (const [archetype, profiles] of Object.entries(ASSIGNMENTS)) {
  const answers = ARCHETYPES[archetype];
  for (const profileId of profiles) {
    const value = calculateAxisValue(rowsFor(profileId, answers));
    output.push({ profileId, archetype, answers: answers.join(","), value });
  }
}

for (const row of output) {
  console.log(`${row.profileId.padEnd(35)} ${row.archetype.padEnd(14)} controle=${row.value}  ${row.answers}`);
}

import { writeFileSync } from "node:fs";
writeFileSync(
  new URL("./controle-anarchist-cluster-output.json", import.meta.url),
  JSON.stringify(output, null, 2)
);
