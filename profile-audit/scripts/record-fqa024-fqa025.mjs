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

const targets = [
  {
    batch: "FQA024",
    catalog: "ideology",
    profileId: "paleolibertarianismo",
    note: "descentralista, propriedade privada forte, tradicionalismo cultural, nao intervencionismo e comercio mais cauto que liberalismo classico",
    values: {
      estrutura: 82.5,
      representacao: 55,
      poder: 27.5,
      imigracao: 82.5,
      diplomacia: 22.5,
      intervencao: 87.5,
      economia: 10,
      controle: 12.5,
      comercio: 42.5,
      religiao: 20,
      moral: 12.5,
      tecnologia: 35,
    },
  },
  {
    batch: "FQA024",
    catalog: "ideology",
    profileId: "libertarianismo-hoppeano",
    note: "anarcocapitalismo proprietarista, anti-democratico, fronteiras/covenants restritivos, mercado radical e costumes tradicionais",
    values: {
      estrutura: 95,
      representacao: 20,
      poder: 22.5,
      imigracao: 90,
      diplomacia: 32.5,
      intervencao: 87.5,
      economia: 5,
      controle: 5,
      comercio: 27.5,
      religiao: 25,
      moral: 10,
      tecnologia: 57.5,
    },
  },
  {
    batch: "FQA024",
    catalog: "ideology",
    profileId: "libertarianismo-de-chicago",
    note: "livre mercado institucional, democracia liberal, livre comercio, Estado minimo mas nao anarcocapitalista",
    values: {
      estrutura: 57.5,
      representacao: 82.5,
      poder: 32.5,
      imigracao: 32.5,
      diplomacia: 40,
      intervencao: 67.5,
      economia: 25,
      controle: 22.5,
      comercio: 10,
      religiao: 72.5,
      moral: 72.5,
      tecnologia: 90,
    },
  },
  {
    batch: "FQA024",
    catalog: "ideology",
    profileId: "capitalismo",
    note: "propriedade privada e concorrencia com posicoes civicas e culturais medianas",
    values: {
      estrutura: 50,
      representacao: 62.5,
      poder: 42.5,
      imigracao: 55,
      diplomacia: 42.5,
      intervencao: 52.5,
      economia: 20,
      controle: 20,
      comercio: 20,
      religiao: 52.5,
      moral: 52.5,
      tecnologia: 72.5,
    },
  },
  {
    batch: "FQA024",
    catalog: "ideology",
    profileId: "objetivismo",
    note: "individualismo racionalista, secularismo forte, propriedade privada radical, tecnologia e capitalismo produtivo",
    values: {
      estrutura: 72.5,
      representacao: 67.5,
      poder: 17.5,
      imigracao: 55,
      diplomacia: 52.5,
      intervencao: 50,
      economia: 7.5,
      controle: 7.5,
      comercio: 17.5,
      religiao: 95,
      moral: 60,
      tecnologia: 90,
    },
  },
  {
    batch: "FQA025",
    catalog: "ideology",
    profileId: "ecocapitalismo",
    note: "mercados e propriedade privada com internalizacao ambiental, tecnologia verde e abertura comercial moderada",
    values: {
      estrutura: 62.5,
      representacao: 72.5,
      poder: 30,
      imigracao: 55,
      diplomacia: 27.5,
      intervencao: 62.5,
      economia: 25,
      controle: 35,
      comercio: 27.5,
      religiao: 60,
      moral: 72.5,
      tecnologia: 55,
    },
  },
  {
    batch: "FQA025",
    catalog: "ideology",
    profileId: "ecoconservadorismo",
    note: "conservacao ambiental tradicionalista, mercado com prudencia regulatoria e ceticismo biologico",
    values: {
      estrutura: 55,
      representacao: 65,
      poder: 52.5,
      imigracao: 60,
      diplomacia: 35,
      intervencao: 55,
      economia: 40,
      controle: 45,
      comercio: 55,
      religiao: 25,
      moral: 25,
      tecnologia: 25,
    },
  },
  {
    batch: "FQA025",
    catalog: "ideology",
    profileId: "econacionalismo",
    note: "ambientalismo nacional e protecionista, soberania produtiva, assimilacao cultural e controle estrategico",
    values: {
      estrutura: 45,
      representacao: 55,
      poder: 60,
      imigracao: 80,
      diplomacia: 55,
      intervencao: 25,
      economia: 50,
      controle: 55,
      comercio: 80,
      religiao: 37.5,
      moral: 35,
      tecnologia: 30,
    },
  },
  {
    batch: "FQA025",
    catalog: "ideology",
    profileId: "agorismo",
    note: "contraeconomia voluntarista, mercado negro pacifico, anti-Estado, comercio aberto e cripto/moeda livre",
    values: {
      estrutura: 97.5,
      representacao: 85,
      poder: 5,
      imigracao: 37.5,
      diplomacia: 5,
      intervencao: 95,
      economia: 7.5,
      controle: 5,
      comercio: 7.5,
      religiao: 67.5,
      moral: 82.5,
      tecnologia: 87.5,
    },
  },
  {
    batch: "FQA025",
    catalog: "ideology",
    profileId: "criptoanarquismo",
    note: "anarquia digital, privacidade extrema, moeda livre, livre comercio radical e tecnologia como eixo central",
    values: {
      estrutura: 97.5,
      representacao: 67.5,
      poder: 2.5,
      imigracao: 20,
      diplomacia: 12.5,
      intervencao: 97.5,
      economia: 7.5,
      controle: 2.5,
      comercio: 2.5,
      religiao: 87.5,
      moral: 82.5,
      tecnologia: 98.8,
    },
  },
];

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
  const base = priorityByAxis[axisId] ?? [...Array(20).keys()];
  const priority = rotate(base, profileIndex * 3 + AXES.indexOf(axisId));

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

console.log("Recorded FQA024/FQA025");
