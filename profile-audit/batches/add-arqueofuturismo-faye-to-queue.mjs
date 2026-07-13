// arqueofuturismo (ideology) and guillaume-faye (personality) were added to the catalogs after
// generate-full-profile-audit.mjs first ran (commit f86e73f), so they were never enqueued. This
// appends one new batch (FQA107) covering both, following the exact same unit shape the generator
// uses, then bumps queue totals accordingly.
import fs from "node:fs";
import {
  AXES,
  FILES,
  loadProfiles,
  loadQuestions,
  profileQueueId,
  renderQueueMarkdown,
  unitId,
} from "../scripts/full-audit-lib.mjs";

const NEW_PROFILE_IDS = new Set(["ideology:arqueofuturismo", "personality:guillaume-faye"]);

const queue = JSON.parse(fs.readFileSync(FILES.queueJson, "utf8"));
const existingIds = new Set();
for (const batch of queue.batches) {
  for (const unit of batch.units) existingIds.add(unit.profileQueueId);
}

const { byAxis } = loadQuestions();
const profiles = loadProfiles().filter((p) => NEW_PROFILE_IDS.has(profileQueueId(p)));
if (profiles.length !== NEW_PROFILE_IDS.size) {
  throw new Error(`Expected ${NEW_PROFILE_IDS.size} new profiles, found ${profiles.length}`);
}
for (const p of profiles) {
  if (existingIds.has(profileQueueId(p))) {
    throw new Error(`${profileQueueId(p)} is already in the queue`);
  }
}

const batchNumber = queue.batches.length + 1;
const units = [];
for (const profile of profiles) {
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

const newBatch = {
  batchId: `FQA${String(batchNumber).padStart(3, "0")}`,
  status: "pending",
  profileCount: profiles.length,
  units,
};
queue.batches.push(newBatch);

queue.totals.profiles += profiles.length;
queue.totals.axisUnits += profiles.length * AXES.length;
queue.totals.questionDecisions += profiles.length * 20 * AXES.length;

fs.writeFileSync(FILES.queueJson, `${JSON.stringify(queue, null, 2)}\n`);
fs.writeFileSync(FILES.queueMd, renderQueueMarkdown(queue));

console.log(`Added ${newBatch.batchId} with ${units.length} units for: ${profiles.map((p) => profileQueueId(p)).join(", ")}`);
console.log(`New totals: profiles=${queue.totals.profiles}, axisUnits=${queue.totals.axisUnits}, batches=${queue.batches.length}`);
