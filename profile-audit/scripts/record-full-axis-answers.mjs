import fs from "node:fs";
import path from "node:path";
import {
  ANSWER_LABELS,
  ANSWER_SCORES,
  FILES,
  ROOT,
  answerToLeftScore,
  calculateAxisValue,
  loadQuestions,
  parseAnswerLines,
  renderQueueMarkdown,
  writeJson,
  writeLines,
} from "./full-audit-lib.mjs";

const [catalog, profileId, axisId, answersArg, ...noteParts] = process.argv.slice(2);
if (!catalog || !profileId || !axisId || !answersArg) {
  throw new Error(
    "Usage: node profile-audit/scripts/record-full-axis-answers.mjs <catalog> <profileId> <axisId> <CT,C,N,D,DT...20> [note]"
  );
}

const answers = answersArg.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean);
if (answers.length !== 20) {
  throw new Error(`Expected 20 answers for ${axisId}, got ${answers.length}.`);
}
for (const answer of answers) {
  if (!(answer in ANSWER_SCORES)) {
    throw new Error(`Invalid answer "${answer}". Use: ${Object.keys(ANSWER_SCORES).join(", ")}`);
  }
}

const queue = JSON.parse(fs.readFileSync(path.join(ROOT, FILES.queueJson), "utf8"));
const { byAxis } = loadQuestions();
const questions = byAxis.get(axisId);
if (!questions || questions.length !== 20) {
  throw new Error(`Axis ${axisId} does not have exactly 20 questions.`);
}

let targetUnit = null;
let targetBatch = null;
for (const batch of queue.batches) {
  const found = batch.units.find(
    (unit) => unit.catalog === catalog && unit.profileId === profileId && unit.axisId === axisId
  );
  if (found) {
    targetUnit = found;
    targetBatch = batch;
    break;
  }
}
if (!targetUnit) {
  throw new Error(`Queue unit not found: ${catalog}:${profileId}:${axisId}`);
}

const rows = questions.map((question, index) => {
  const answer = answers[index];
  const agreementScore = ANSWER_SCORES[answer];
  const leftScore = answerToLeftScore(question, answer);
  return {
    catalog,
    profileId,
    axisId,
    questionId: question.id,
    answer,
    answerLabel: ANSWER_LABELS[answer],
    agreePole: question.agreePole,
    agreementScore,
    leftScore,
    weight: question.weight ?? 1,
    auditedAt: new Date().toISOString(),
  };
});

const calculatedValue = calculateAxisValue(rows);
const delta = Math.round((calculatedValue - targetUnit.currentValue) * 10) / 10;
const note = noteParts.join(" ");

const existing = parseAnswerLines().filter(
  (row) => !(row.catalog === catalog && row.profileId === profileId && row.axisId === axisId)
);
const nextLines = existing.concat(rows).map((row) => JSON.stringify(row));
writeLines(FILES.answersJsonl, nextLines);

targetUnit.status = "done";
targetUnit.calculatedValue = calculatedValue;
targetUnit.delta = delta;
targetUnit.completedAt = new Date().toISOString();
targetUnit.notes = note;
targetBatch.status = targetBatch.units.every((unit) => unit.status === "done") ? "done" : "in_progress";

writeJson(FILES.queueJson, queue);
fs.writeFileSync(path.join(ROOT, FILES.queueMd), renderQueueMarkdown(queue));

console.log(`${catalog}:${profileId}:${axisId}`);
console.log(`current=${targetUnit.currentValue} calculated=${calculatedValue} delta=${delta}`);
