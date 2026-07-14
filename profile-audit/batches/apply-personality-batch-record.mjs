// Generic recorder for personality batches.
// Usage: node apply-personality-batch-record.mjs ./fqaXXX-personalities.mjs
import { execFileSync } from "node:child_process";
import { AXES } from "../scripts/full-audit-lib.mjs";

const [batchModule] = process.argv.slice(2);
const { PROFILES } = await import(batchModule);

for (const [profileId, axes] of Object.entries(PROFILES)) {
  for (const axisId of AXES) {
    const answers = axes[axisId];
    if (!answers || answers.length !== 20) {
      throw new Error(`${profileId}.${axisId}: expected 20 answers, got ${answers?.length}`);
    }
    const csv = answers.join(",");
    const out = execFileSync(
      "node",
      [
        "profile-audit/scripts/record-full-axis-answers.mjs",
        "personality",
        profileId,
        axisId,
        csv,
        "Batch audit (genuine per-question simulation grounded in documented views/actions)",
      ],
      { encoding: "utf8" }
    );
    console.log(out.trim());
  }
}
