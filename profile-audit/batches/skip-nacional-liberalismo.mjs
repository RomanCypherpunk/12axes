// nacional-liberalismo is a deliberate, user-approved bespoke vector (CLAUDE.md sec.3/sec.8) and
// is intentionally excluded from the genuine per-question audit methodology. Its 12 queue units in
// FQA034 were blocking that batch from ever closing. Per explicit user decision (2026-07-13), mark
// them "skipped" (not "done" -- no answers were fabricated) so the batch can close administratively.
import fs from "node:fs";
import { AXES, FILES, round1 } from "../scripts/full-audit-lib.mjs";

const queue = JSON.parse(fs.readFileSync(FILES.queueJson, "utf8"));

let batch = null;
for (const b of queue.batches) {
  if (b.units.some((u) => u.profileId === "nacional-liberalismo")) {
    batch = b;
    break;
  }
}
if (!batch) throw new Error("Could not find a batch containing nacional-liberalismo");

let skipped = 0;
for (const unit of batch.units) {
  if (unit.profileId !== "nacional-liberalismo") continue;
  unit.status = "skipped";
  unit.calculatedValue = unit.currentValue;
  unit.delta = 0;
  unit.completedAt = new Date().toISOString();
  unit.notes =
    "SKIPPED: nacional-liberalismo is a deliberate user-approved bespoke vector (CLAUDE.md sec.3/sec.8), " +
    "excluded from the genuine per-question audit. Not re-derived; closed administratively by explicit " +
    "user decision on 2026-07-13.";
  skipped += 1;
}
if (skipped !== AXES.length) {
  throw new Error(`Expected to skip ${AXES.length} units, skipped ${skipped}`);
}

batch.status = batch.units.every((u) => u.status === "done" || u.status === "skipped") ? "done" : "in_progress";

fs.writeFileSync(FILES.queueJson, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Skipped ${skipped} nacional-liberalismo units in ${batch.batchId}; batch status = ${batch.status}`);
