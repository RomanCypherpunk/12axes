import fs from "node:fs";
import path from "node:path";
import {
  ANSWER_SCORES,
  AXES,
  FILES,
  ROOT,
  answerToLeftScore,
  calculateAxisValue,
  groupBy,
  loadProfiles,
  loadQuestions,
  parseAnswerLines,
  profileQueueId,
  writeJson,
} from "./full-audit-lib.mjs";

const queue = JSON.parse(fs.readFileSync(path.join(ROOT, FILES.queueJson), "utf8"));
const { questions } = loadQuestions();
const questionById = new Map(questions.map((question) => [question.id, question]));
const profiles = loadProfiles();
const profileByKey = new Map(profiles.map((profile) => [profileQueueId(profile), profile]));
const rows = parseAnswerLines();

const errors = [];
for (const axisId of AXES) {
  const axisQuestions = questions.filter((question) => question.axisId === axisId);
  const leftCount = axisQuestions.filter((question) => question.agreePole === "LEFT").length;
  const rightCount = axisQuestions.filter((question) => question.agreePole === "RIGHT").length;
  if (axisQuestions.length !== 20 || leftCount !== 10 || rightCount !== 10) {
    errors.push(`Question distribution mismatch for ${axisId}: total=${axisQuestions.length}, LEFT=${leftCount}, RIGHT=${rightCount}`);
  }
}
for (const row of rows) {
  const question = questionById.get(row.questionId);
  if (!question) {
    errors.push(`Unknown questionId: ${row.questionId}`);
    continue;
  }
  if (question.axisId !== row.axisId) {
    errors.push(`Axis mismatch for ${row.catalog}:${row.profileId}:${row.questionId}`);
  }
  const expectedAgreementScore = ANSWER_SCORES[row.answer];
  const expectedLeftScore = answerToLeftScore(question, row.answer);
  if (row.agreementScore !== expectedAgreementScore) {
    errors.push(`Agreement score mismatch for ${row.catalog}:${row.profileId}:${row.questionId}: ${row.agreementScore} != ${expectedAgreementScore}`);
  }
  if (Math.abs(row.leftScore - expectedLeftScore) > 1e-9) {
    errors.push(`Left score mismatch for ${row.catalog}:${row.profileId}:${row.questionId}: ${row.leftScore} != ${expectedLeftScore}`);
  }
}

const grouped = groupBy(rows, (row) => `${row.catalog}:${row.profileId}:${row.axisId}`);
const completedAxisResults = [];
const incompleteAxisResults = [];

for (const batch of queue.batches) {
  for (const unit of batch.units) {
    const key = `${unit.catalog}:${unit.profileId}:${unit.axisId}`;
    const unitRows = grouped.get(key) ?? [];
    const uniqueQuestions = new Set(unitRows.map((row) => row.questionId));
    if (unitRows.length === 20 && uniqueQuestions.size === 20) {
      const calculatedValue = calculateAxisValue(unitRows);
      completedAxisResults.push({
        ...unit,
        calculatedValue,
        delta: Math.round((calculatedValue - unit.currentValue) * 10) / 10,
        answers: unitRows
          .sort((a, b) => a.questionId.localeCompare(b.questionId))
          .map((row) => row.answer),
      });
    } else {
      incompleteAxisResults.push({
        ...unit,
        answeredQuestions: uniqueQuestions.size,
      });
    }
  }
}

const byProfile = groupBy(completedAxisResults, (unit) => `${unit.catalog}:${unit.profileId}`);
const profileResults = [];
for (const [key, axisResults] of byProfile) {
  const profile = profileByKey.get(key);
  const vector = {};
  const deltas = {};
  for (const axisId of AXES) {
    const result = axisResults.find((item) => item.axisId === axisId);
    if (result) {
      vector[axisId] = result.calculatedValue;
      deltas[axisId] = result.delta;
    }
  }
  profileResults.push({
    catalog: profile?.catalog,
    profileId: profile?.profileId,
    name: profile?.name,
    completedAxes: Object.keys(vector).length,
    vector,
    deltas,
  });
}

const patchCandidates = completedAxisResults
  .filter((unit) => Math.abs(unit.delta) >= 7.5)
  .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

const result = {
  generatedAt: new Date().toISOString(),
  totals: {
    queueBatches: queue.batches.length,
    queueUnits: queue.totals.axisUnits,
    answerRows: rows.length,
    completedAxisUnits: completedAxisResults.length,
    incompleteAxisUnits: incompleteAxisResults.length,
    completedProfiles: profileResults.filter((profile) => profile.completedAxes === AXES.length).length,
    totalProfiles: queue.totals.profiles,
    errors: errors.length,
    patchCandidates: patchCandidates.length,
  },
  errors,
  patchCandidates,
  profiles: profileResults,
  incompleteAxisResults,
};

writeJson(FILES.resultsJson, result);

const md = [];
md.push("# Full Profile Audit Report");
md.push("");
md.push("Relatorio gerado a partir de `PROFILE_FULL_AUDIT_ANSWERS.jsonl`.");
md.push("");
md.push("```text");
md.push(`answerRows: ${result.totals.answerRows}`);
md.push(`completedAxisUnits: ${result.totals.completedAxisUnits}/${result.totals.queueUnits}`);
md.push(`completedProfiles: ${result.totals.completedProfiles}/${result.totals.totalProfiles}`);
md.push(`patchCandidates(abs(delta) >= 7.5): ${result.totals.patchCandidates}`);
md.push(`errors: ${result.totals.errors}`);
md.push("```");
md.push("");
if (errors.length) {
  md.push("## Errors");
  md.push("");
  for (const error of errors.slice(0, 100)) md.push(`- ${error}`);
  md.push("");
}
md.push("## Patch Candidates");
md.push("");
if (!patchCandidates.length) {
  md.push("Nenhum candidato enquanto nao houver respostas completas ou deltas relevantes.");
} else {
  for (const unit of patchCandidates.slice(0, 200)) {
    md.push(`- ${unit.catalog}:${unit.profileId}.${unit.axisId}: ${unit.currentValue} -> ${unit.calculatedValue} (delta ${unit.delta})`);
  }
}
md.push("");
md.push("## Incomplete");
md.push("");
md.push(`${incompleteAxisResults.length} unidades de eixo ainda incompletas.`);
md.push("");

fs.writeFileSync(path.join(ROOT, FILES.reportMd), `${md.join("\n")}\n`);
console.log(`Wrote ${FILES.resultsJson} and ${FILES.reportMd}.`);
console.log(`Completed axis units: ${result.totals.completedAxisUnits}/${result.totals.queueUnits}`);
