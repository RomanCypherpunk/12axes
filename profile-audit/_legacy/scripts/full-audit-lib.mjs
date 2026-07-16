import fs from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();
export const AUDIT_DIR = "profile-audit";

export const AXES = [
  "estrutura",
  "representacao",
  "poder",
  "imigracao",
  "diplomacia",
  "intervencao",
  "economia",
  "controle",
  "comercio",
  "religiao",
  "moral",
  "tecnologia",
];

export const ANSWER_SCORES = {
  CT: 1.0,
  C: 0.75,
  N: 0.5,
  D: 0.25,
  DT: 0.0,
};

export const ANSWER_LABELS = {
  CT: "Concordo totalmente",
  C: "Concordo",
  N: "Neutro",
  D: "Discordo",
  DT: "Discordo totalmente",
};

export const FILES = {
  queueJson: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_QUEUE.json`,
  queueMd: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_QUEUE.md`,
  answersJsonl: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_ANSWERS.jsonl`,
  resultsJson: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_RESULTS.json`,
  reportMd: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_REPORT.md`,
  guideMd: `${AUDIT_DIR}/FULL_PROFILE_AUDIT.md`,
  responseTablesMd: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_RESPONSE_TABLES.md`,
  duplicateSequencesMd: `${AUDIT_DIR}/PROFILE_FULL_AUDIT_DUPLICATE_SEQUENCES.md`,
};

export const PROFILE_SOURCES = [
  {
    catalog: "ideology",
    profileFile: "backend/src/main/resources/data/ideology-profiles.json",
    metaFile: "backend/src/main/resources/data/ideologies.json",
    idKey: "ideologyId",
  },
  {
    catalog: "country",
    profileFile: "backend/src/main/resources/data/countries-profiles.json",
    metaFile: "backend/src/main/resources/data/countries.json",
    idKey: "countryId",
  },
  {
    catalog: "personality",
    profileFile: "backend/src/main/resources/data/personality-profiles.json",
    metaFile: "backend/src/main/resources/data/personalities.json",
    idKey: "personalityId",
  },
];

export function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

export function writeJson(file, data) {
  fs.writeFileSync(path.join(ROOT, file), `${JSON.stringify(data, null, 2)}\n`);
}

export function readLines(file) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) return [];
  const raw = fs.readFileSync(fullPath, "utf8").trim();
  if (!raw) return [];
  return raw.split(/\r?\n/);
}

export function writeLines(file, lines) {
  fs.writeFileSync(path.join(ROOT, file), lines.length ? `${lines.join("\n")}\n` : "");
}

export function loadQuestions() {
  const questions = readJson("backend/src/main/resources/data/questions-pool.json");
  const byAxis = new Map();
  for (const axisId of AXES) {
    byAxis.set(
      axisId,
      questions.filter((question) => question.axisId === axisId)
    );
  }
  return { questions, byAxis };
}

export function loadProfiles() {
  const all = [];
  for (const source of PROFILE_SOURCES) {
    const profiles = readJson(source.profileFile);
    const meta = readJson(source.metaFile);
    const metaById = new Map(meta.map((item) => [item.id, item]));
    for (const profile of profiles) {
      const profileId = profile[source.idKey];
      const metaItem = metaById.get(profileId) ?? {};
      all.push({
        catalog: source.catalog,
        profileId,
        name: metaItem.name ?? profileId,
        category: metaItem.category ?? "",
        description: metaItem.description ?? "",
        sourceProfileFile: source.profileFile,
        sourceMetaFile: source.metaFile,
        vector: profile.vector,
      });
    }
  }
  return all;
}

export function profileQueueId(profile) {
  return `${profile.catalog}:${profile.profileId}`;
}

export function unitId(profile, axisId) {
  return `${profile.catalog}:${profile.profileId}:${axisId}`;
}

export function answerToLeftScore(question, answer) {
  if (!(answer in ANSWER_SCORES)) {
    throw new Error(`Invalid answer code "${answer}". Use CT, C, N, D, DT.`);
  }
  const agreementScore = ANSWER_SCORES[answer];
  return question.agreePole === "LEFT" ? agreementScore : 1 - agreementScore;
}

export function round1(value) {
  return Math.round(value * 10) / 10;
}

export function roundProfileValue(value) {
  return Number.isInteger(value) ? value : round1(value);
}

export function calculateAxisValue(questionRows) {
  let totalWeight = 0;
  let weighted = 0;
  for (const row of questionRows) {
    weighted += row.leftScore * row.weight;
    totalWeight += row.weight;
  }
  return roundProfileValue((weighted / totalWeight) * 100);
}

export function parseAnswerLines() {
  return readLines(FILES.answersJsonl).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSONL at ${FILES.answersJsonl}:${index + 1}: ${error.message}`);
    }
  });
}

export function groupBy(items, keyFn) {
  const grouped = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  return grouped;
}

export function renderQueueMarkdown(queue) {
  const lines = [];
  lines.push("# Profile Full Audit Queue");
  lines.push("");
  lines.push("Fila para auditoria 100% pergunta a pergunta.");
  lines.push("");
  lines.push("```text");
  lines.push(`profiles: ${queue.totals.profiles}`);
  lines.push(`axisUnits: ${queue.totals.axisUnits}`);
  lines.push(`questionsPerAxis: ${queue.totals.questionsPerAxis}`);
  lines.push(`questionDecisions: ${queue.totals.questionDecisions}`);
  lines.push(`batches: ${queue.batches.length}`);
  lines.push("```");
  lines.push("");
  for (const batch of queue.batches) {
    const doneUnits = batch.units.filter((unit) => unit.status === "done" || unit.status === "skipped").length;
    lines.push(`## ${batch.batchId} - ${batch.status} (${doneUnits}/${batch.units.length})`);
    lines.push("");
    const profiles = groupBy(batch.units, (unit) => `${unit.catalog}:${unit.profileId}`);
    for (const [profileKey, units] of profiles) {
      const first = units[0];
      const done = units.filter((unit) => unit.status === "done" || unit.status === "skipped").length;
      lines.push(`- [${done === units.length ? "x" : " "}] ${profileKey} - ${first.name} (${done}/12)`);
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
