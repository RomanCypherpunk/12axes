import { FILES, groupBy, loadQuestions, parseAnswerLines, writeLines } from "./full-audit-lib.mjs";

const minCount = Number(process.argv[2] ?? 2);
const { byAxis } = loadQuestions();
const rows = parseAnswerLines();
const grouped = groupBy(rows, (row) => `${row.catalog}:${row.profileId}:${row.axisId}`);
const sequenceGroups = new Map();

for (const [key, unitRows] of grouped) {
  const [, , axisId] = key.split(":");
  const axisQuestions = byAxis.get(axisId);
  if (!axisQuestions) continue;
  const order = new Map(axisQuestions.map((question, index) => [question.id, index]));
  const sorted = [...unitRows].sort((a, b) => order.get(a.questionId) - order.get(b.questionId));
  if (sorted.length !== axisQuestions.length) continue;
  const sequence = sorted.map((row) => row.answer).join(",");
  const sequenceKey = `${axisId}|${sequence}`;
  if (!sequenceGroups.has(sequenceKey)) sequenceGroups.set(sequenceKey, []);
  sequenceGroups.get(sequenceKey).push(key);
}

const duplicates = [...sequenceGroups]
  .map(([key, units]) => {
    const [axisId, sequence] = key.split("|");
    return { axisId, sequence, units };
  })
  .filter((item) => item.units.length >= minCount)
  .sort((a, b) => b.units.length - a.units.length || a.axisId.localeCompare(b.axisId));

const lines = [];
lines.push("# Duplicate Full-Axis Answer Sequences");
lines.push("");
lines.push("Sequencias completas de 20 respostas repetidas entre perfis auditados.");
lines.push("");
lines.push(`Minimo: ${minCount} perfis.`);
lines.push("");

for (const item of duplicates) {
  lines.push(`## ${item.axisId} - ${item.units.length} perfis`);
  lines.push("");
  lines.push(`Sequencia: \`${item.sequence}\``);
  lines.push("");
  for (const unit of item.units) lines.push(`- ${unit}`);
  lines.push("");
}

writeLines(FILES.duplicateSequencesMd, lines);
console.log(`Wrote ${FILES.duplicateSequencesMd} (${duplicates.length} groups)`);
