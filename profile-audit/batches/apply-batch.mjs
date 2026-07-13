import { execFileSync } from "node:child_process";
import { AXES } from "../scripts/full-audit-lib.mjs";

const [batchModule] = process.argv.slice(2);
if (!batchModule) throw new Error("Usage: node apply-batch.mjs <./fqa0XX.mjs>");

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
      ["profile-audit/scripts/record-full-axis-answers.mjs", "ideology", profileId, axisId, csv,
       "Batch audit (genuine per-question simulation, continuing FQA sequence)"],
      { encoding: "utf8" }
    );
    console.log(out.trim());
  }
}
