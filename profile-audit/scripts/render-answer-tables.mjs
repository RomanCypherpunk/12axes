import {
  FILES,
  answerToLeftScore,
  calculateAxisValue,
  loadQuestions,
  parseAnswerLines,
  writeLines,
} from "./full-audit-lib.mjs";

const selectors = process.argv.slice(2);
if (!selectors.length) {
  throw new Error(
    "Usage: node profile-audit/scripts/render-answer-tables.mjs <catalog:profileId.axisId> ..."
  );
}

const { questions, byAxis } = loadQuestions();
const questionById = new Map(questions.map((question) => [question.id, question]));
const rows = parseAnswerLines();
const output = [];

output.push("# Profile Full Audit Answer Tables");
output.push("");
output.push("Tabelas geradas a partir de `PROFILE_FULL_AUDIT_ANSWERS.jsonl`.");
output.push("");

for (const selector of selectors) {
  const match = selector.match(/^([^:]+):([^.\s]+)\.([^.\s]+)$/);
  if (!match) {
    throw new Error(`Invalid selector: ${selector}. Expected catalog:profileId.axisId`);
  }
  const [, catalog, profileId, axisId] = match;
  const axisQuestions = byAxis.get(axisId);
  if (!axisQuestions) throw new Error(`Unknown axis: ${axisId}`);
  const orderByQuestionId = new Map(axisQuestions.map((question, index) => [question.id, index]));
  const axisRows = rows
    .filter((row) => row.catalog === catalog && row.profileId === profileId && row.axisId === axisId)
    .sort((a, b) => orderByQuestionId.get(a.questionId) - orderByQuestionId.get(b.questionId));

  output.push(`## ${catalog}:${profileId}.${axisId}`);
  output.push("");
  if (axisRows.length !== axisQuestions.length) {
    output.push(`Incompleto: ${axisRows.length}/${axisQuestions.length} respostas.`);
    output.push("");
    continue;
  }

  const calculated = calculateAxisValue(axisRows);
  output.push(`Sequencia: \`${axisRows.map((row) => row.answer).join(",")}\``);
  output.push(`Media calculada: \`${calculated}\``);
  output.push("");
  output.push("| # | Pergunta | agreePole | Resposta | leftScore |");
  output.push("|---:|---|---|---|---:|");
  for (const row of axisRows) {
    const question = questionById.get(row.questionId);
    const index = orderByQuestionId.get(row.questionId) + 1;
    const leftScore = answerToLeftScore(question, row.answer);
    output.push(
      `| ${index} | ${question.text.replaceAll("|", "\\|")} | ${question.agreePole} | ${row.answer} | ${leftScore} |`
    );
  }
  output.push("");
}

writeLines(FILES.responseTablesMd, output);
console.log(`Wrote ${FILES.responseTablesMd}`);
