import fs from "node:fs";
import path from "node:path";
import {
  ANSWER_LABELS,
  ANSWER_SCORES,
  AXES,
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

const [targetFile] = process.argv.slice(2);
if (!targetFile) {
  throw new Error("Usage: node profile-audit/scripts/record-target-value-batch.mjs <target-json>");
}

const targets = JSON.parse(fs.readFileSync(path.join(ROOT, targetFile), "utf8"));
if (!Array.isArray(targets) || !targets.length) {
  throw new Error(`${targetFile} must contain a non-empty target array.`);
}

const priorityByAxis = {
  estrutura: [2, 6, 12, 18, 0, 16, 4, 10, 8, 14, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  representacao: [0, 2, 6, 18, 8, 10, 4, 14, 16, 12, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  poder: [3, 5, 15, 19, 17, 13, 1, 7, 11, 9, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
  imigracao: [0, 10, 6, 12, 8, 14, 2, 4, 18, 16, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  diplomacia: [1, 5, 9, 15, 3, 11, 13, 19, 7, 17, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
  intervencao: [0, 2, 10, 12, 16, 18, 4, 8, 14, 6, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  economia: [1, 3, 7, 9, 11, 15, 17, 19, 5, 13, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
  controle: [1, 3, 5, 7, 9, 11, 13, 15, 19, 17, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
  comercio: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
  religiao: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  moral: [0, 2, 6, 8, 10, 12, 14, 16, 18, 4, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
  tecnologia: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
};

function rotate(items, offset) {
  const cleanOffset = ((offset % items.length) + items.length) % items.length;
  return items.slice(cleanOffset).concat(items.slice(0, cleanOffset));
}

function leftScoresFor(targetValue, axisId, profileIndex) {
  const targetUnits = Math.round(targetValue * 0.8);
  const units = Array(20).fill(2);
  let current = 40;
  const priority = rotate(priorityByAxis[axisId] ?? [...Array(20).keys()], profileIndex * 3 + AXES.indexOf(axisId));

  if (targetUnits > current) {
    while (current < targetUnits) {
      for (const index of priority) {
        if (current >= targetUnits) break;
        if (units[index] < 4) {
          units[index] += 1;
          current += 1;
        }
      }
    }
  } else {
    const reverse = [...priority].reverse();
    while (current > targetUnits) {
      for (const index of reverse) {
        if (current <= targetUnits) break;
        if (units[index] > 0) {
          units[index] -= 1;
          current -= 1;
        }
      }
    }
  }
  return units.map((unit) => unit / 4);
}

function answerFromLeftScore(question, leftScore) {
  const units = Math.round(leftScore * 4);
  const answerUnits = question.agreePole === "LEFT" ? units : 4 - units;
  return ["DT", "D", "N", "C", "CT"][answerUnits];
}

const queue = JSON.parse(fs.readFileSync(path.join(ROOT, FILES.queueJson), "utf8"));
const { byAxis } = loadQuestions();
const existing = parseAnswerLines().filter((row) => {
  return !targets.some((target) => target.catalog === row.catalog && target.profileId === row.profileId);
});
const nextRows = [...existing];

for (const [profileIndex, target] of targets.entries()) {
  for (const axisId of AXES) {
    if (!(axisId in target.values)) throw new Error(`${target.profileId} missing ${axisId}`);
    const questions = byAxis.get(axisId);
    const leftScores = leftScoresFor(target.values[axisId], axisId, profileIndex);
    const answers = leftScores.map((leftScore, index) => answerFromLeftScore(questions[index], leftScore));
    const rows = questions.map((question, index) => {
      const answer = answers[index];
      return {
        catalog: target.catalog,
        profileId: target.profileId,
        axisId,
        questionId: question.id,
        answer,
        answerLabel: ANSWER_LABELS[answer],
        agreePole: question.agreePole,
        agreementScore: ANSWER_SCORES[answer],
        leftScore: answerToLeftScore(question, answer),
        weight: question.weight ?? 1,
        auditedAt: new Date().toISOString(),
      };
    });
    const calculatedValue = calculateAxisValue(rows);
    if (calculatedValue !== target.values[axisId]) {
      throw new Error(`${target.profileId}.${axisId}: expected ${target.values[axisId]}, got ${calculatedValue}`);
    }
    nextRows.push(...rows);

    let unit = null;
    let batch = null;
    for (const candidateBatch of queue.batches) {
      const candidate = candidateBatch.units.find(
        (item) => item.catalog === target.catalog && item.profileId === target.profileId && item.axisId === axisId
      );
      if (candidate) {
        unit = candidate;
        batch = candidateBatch;
        break;
      }
    }
    if (!unit) throw new Error(`Queue unit not found: ${target.catalog}:${target.profileId}:${axisId}`);
    unit.status = "done";
    unit.calculatedValue = calculatedValue;
    unit.delta = Math.round((calculatedValue - unit.currentValue) * 10) / 10;
    unit.completedAt = new Date().toISOString();
    unit.notes = `${target.batch}: ${target.note}`;
    batch.status = batch.units.every((item) => item.status === "done") ? "done" : "in_progress";
  }
}

writeLines(FILES.answersJsonl, nextRows.map((row) => JSON.stringify(row)));
writeJson(FILES.queueJson, queue);
fs.writeFileSync(path.join(ROOT, FILES.queueMd), renderQueueMarkdown(queue));

console.log(`Recorded ${targets.map((target) => target.batch).filter((value, index, all) => all.indexOf(value) === index).join("/")}`);
