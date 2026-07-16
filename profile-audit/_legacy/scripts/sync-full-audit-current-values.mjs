import fs from "node:fs";
import {
  FILES,
  loadProfiles,
  profileQueueId,
  round1,
  renderQueueMarkdown,
} from "./full-audit-lib.mjs";

const profiles = new Map(loadProfiles().map((profile) => [profileQueueId(profile), profile]));
const queue = JSON.parse(fs.readFileSync(FILES.queueJson, "utf8"));

let updated = 0;
for (const batch of queue.batches) {
  for (const unit of batch.units) {
    const profile = profiles.get(unit.profileQueueId);
    if (!profile) continue;
    const nextValue = profile.vector[unit.axisId];
    if (unit.currentValue !== nextValue) {
      unit.currentValue = nextValue;
      updated += 1;
    }
    if (typeof unit.calculatedValue === "number") {
      unit.delta = round1(unit.calculatedValue - unit.currentValue);
    }
  }
}

fs.writeFileSync(FILES.queueJson, `${JSON.stringify(queue, null, 2)}\n`);
fs.writeFileSync(FILES.queueMd, renderQueueMarkdown(queue));

console.log(`Synced ${updated} queue current values.`);
