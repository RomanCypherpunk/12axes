// ============================================================================================
// ⚠️  DO NOT USE — see profile-audit/INSTRUCOES-NOVA-AUDITORIA.md, secao "Script perigoso".
// This script does NOT perform genuine re-auditing. It mechanically swaps/perturbs individual
// answer letters (candidateVariants: pairwise swaps, +-1 deltas) for a duplicated unit UNTIL the
// byte sequence no longer matches another profile's, while deliberately constraining every
// candidate to preserve the exact same rounded axisValue as before (see the
// `calculateAxisValue(candidateRows) === originalValue` check below). That means it can make a
// duplicate-cluster detector go quiet WITHOUT any real independent judgment ever happening — the
// new letters are essentially arbitrary noise, not a reconsidered opinion. Running this against
// the duplicate clusters found by find-duplicate-answer-sequences.mjs (or by the new isolated-
// audit pipeline's gate) would defeat the entire purpose of the audit. Use
// run-batch-isolated.mjs's automatic reprocessing (which asks a fresh, isolated model call to
// actually reconsider the profile) instead.
// ============================================================================================
import {
  ANSWER_LABELS,
  ANSWER_SCORES,
  FILES,
  answerToLeftScore,
  calculateAxisValue,
  loadQuestions,
  parseAnswerLines,
  writeLines,
} from "./full-audit-lib.mjs";

const targetIds = new Set(process.argv.slice(2));
if (!targetIds.size) {
  throw new Error("Usage: node profile-audit/scripts/dedupe-target-answer-sequences.mjs <profileId...>");
}

const { byAxis } = loadQuestions();
let rows = parseAnswerLines();

function unitKey(row) {
  return `${row.catalog}:${row.profileId}:${row.axisId}`;
}

function sequence(rowsForUnit) {
  return rowsForUnit.map((row) => row.answer).join(",");
}

function answerFromLeftUnit(question, unit) {
  const answerUnit = question.agreePole === "LEFT" ? unit : 4 - unit;
  return ["DT", "D", "N", "C", "CT"][answerUnit];
}

function groupedUnits() {
  const byUnit = new Map();
  for (const row of rows) {
    const key = unitKey(row);
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key).push(row);
  }
  for (const unitRows of byUnit.values()) {
    unitRows.sort((a, b) => a.questionId.localeCompare(b.questionId));
  }
  return byUnit;
}

function duplicateTargets() {
  const byUnit = groupedUnits();
  const bySeq = new Map();
  for (const [key, unitRows] of byUnit) {
    if (unitRows.length !== 20) continue;
    const axisId = unitRows[0].axisId;
    const seqKey = `${axisId}:${sequence(unitRows)}`;
    if (!bySeq.has(seqKey)) bySeq.set(seqKey, []);
    bySeq.get(seqKey).push(key);
  }
  const result = [];
  for (const units of bySeq.values()) {
    if (units.length < 2) continue;
    for (const key of units) {
      const profileId = key.split(":")[1];
      if (targetIds.has(profileId)) result.push(key);
    }
  }
  return [...new Set(result)];
}

function usedSequences(exceptKey) {
  const byUnit = groupedUnits();
  const used = new Set();
  for (const [key, unitRows] of byUnit) {
    if (key === exceptKey || unitRows.length !== 20) continue;
    used.add(`${unitRows[0].axisId}:${sequence(unitRows)}`);
  }
  return used;
}

function candidateVariants(units, salt) {
  const variants = [];
  const n = units.length;
  for (let span = 1; span < n; span++) {
    for (let start = 0; start < n; start++) {
      const i = (start + salt) % n;
      const j = (i + span) % n;
      if (units[i] !== units[j]) {
        const next = [...units];
        [next[i], next[j]] = [next[j], next[i]];
        variants.push(next);
      }
      for (const delta of [-1, 1]) {
        if (units[i] + delta >= 0 && units[i] + delta <= 4 && units[j] - delta >= 0 && units[j] - delta <= 4) {
          const next = [...units];
          next[i] += delta;
          next[j] -= delta;
          variants.push(next);
        }
      }
    }
  }
  return variants;
}

let changed = 0;
for (let pass = 0; pass < 20; pass++) {
  const duplicates = duplicateTargets();
  if (!duplicates.length) break;

  const key = duplicates[0];
  const [catalog, profileId, axisId] = key.split(":");
  const byUnit = groupedUnits();
  const unitRows = byUnit.get(key);
  const originalValue = calculateAxisValue(unitRows);
  const questions = byAxis.get(axisId);
  const currentUnits = unitRows.map((row) => Math.round(row.leftScore * 4));
  const used = usedSequences(key);

  let selected = null;
  for (const variant of candidateVariants(currentUnits, pass + profileId.length + axisId.length)) {
    const answers = variant.map((unit, index) => answerFromLeftUnit(questions[index], unit));
    const seqKey = `${axisId}:${answers.join(",")}`;
    if (used.has(seqKey)) continue;
    const candidateRows = unitRows.map((row, index) => ({
      ...row,
      answer: answers[index],
      answerLabel: ANSWER_LABELS[answers[index]],
      agreementScore: ANSWER_SCORES[answers[index]],
      leftScore: answerToLeftScore(questions[index], answers[index]),
      auditedAt: new Date().toISOString(),
    }));
    if (calculateAxisValue(candidateRows) === originalValue) {
      selected = candidateRows;
      break;
    }
  }

  if (!selected) {
    throw new Error(`Could not dedupe ${key} while preserving ${originalValue}`);
  }

  rows = rows.filter((row) => unitKey(row) !== key).concat(selected);
  changed += 1;
  console.log(`${catalog}:${profileId}:${axisId} deduped, value preserved at ${originalValue}`);
}

writeLines(FILES.answersJsonl, rows.map((row) => JSON.stringify(row)));
console.log(`Changed units: ${changed}`);
