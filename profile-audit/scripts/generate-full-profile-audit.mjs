import fs from "node:fs";
import path from "node:path";
import {
  AXES,
  FILES,
  ROOT,
  loadProfiles,
  loadQuestions,
  profileQueueId,
  renderQueueMarkdown,
  unitId,
  writeJson,
} from "./full-audit-lib.mjs";

const profilesPerBatch = Number.parseInt(process.argv[2] ?? "5", 10);
if (!Number.isInteger(profilesPerBatch) || profilesPerBatch <= 0) {
  throw new Error("Usage: node profile-audit/scripts/generate-full-profile-audit.mjs [profilesPerBatch]");
}

const { questions, byAxis } = loadQuestions();
for (const axisId of AXES) {
  const axisQuestions = byAxis.get(axisId) ?? [];
  if (axisQuestions.length !== 20) {
    throw new Error(`Axis ${axisId} has ${axisQuestions.length} questions, expected 20.`);
  }
}

const profiles = loadProfiles();
const batches = [];
for (let profileIndex = 0; profileIndex < profiles.length; profileIndex += profilesPerBatch) {
  const batchProfiles = profiles.slice(profileIndex, profileIndex + profilesPerBatch);
  const batchNumber = batches.length + 1;
  const units = [];
  for (const profile of batchProfiles) {
    for (const axisId of AXES) {
      units.push({
        unitId: unitId(profile, axisId),
        profileQueueId: profileQueueId(profile),
        catalog: profile.catalog,
        profileId: profile.profileId,
        name: profile.name,
        category: profile.category,
        axisId,
        status: "pending",
        currentValue: profile.vector[axisId],
        calculatedValue: null,
        delta: null,
        sourceProfileFile: profile.sourceProfileFile,
        sourceMetaFile: profile.sourceMetaFile,
        questionIds: byAxis.get(axisId).map((question) => question.id),
        notes: "",
      });
    }
  }
  batches.push({
    batchId: `FQA${String(batchNumber).padStart(3, "0")}`,
    status: "pending",
    profileCount: batchProfiles.length,
    units,
  });
}

const queue = {
  version: 1,
  generatedAt: new Date().toISOString(),
  method: "Full question-by-question profile audit. One queue unit equals one profile axis, i.e. 20 question answers.",
  files: FILES,
  totals: {
    profiles: profiles.length,
    axes: AXES.length,
    axisUnits: profiles.length * AXES.length,
    questions: questions.length,
    questionsPerAxis: 20,
    questionDecisions: profiles.length * questions.length,
    profilesPerBatch,
  },
  answerCodes: {
    CT: 1,
    C: 0.75,
    N: 0.5,
    D: 0.25,
    DT: 0,
  },
  batches,
};

writeJson(FILES.queueJson, queue);
fs.writeFileSync(path.join(ROOT, FILES.queueMd), renderQueueMarkdown(queue));
if (!fs.existsSync(path.join(ROOT, FILES.answersJsonl))) {
  fs.writeFileSync(path.join(ROOT, FILES.answersJsonl), "");
}

console.log(`Generated ${queue.totals.profiles} profiles in ${queue.batches.length} batches.`);
console.log(`${queue.totals.axisUnits} axis units, ${queue.totals.questionDecisions} question decisions.`);
