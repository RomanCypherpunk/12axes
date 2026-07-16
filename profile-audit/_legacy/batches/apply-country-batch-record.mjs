// Generic recorder for country-catalog batch modules shaped {profileId: {axisId: [20 answers]}}.
// Usage: node apply-country-batch-record.mjs ./fqa0XX-countries.mjs
import { execFileSync } from "node:child_process";
import { AXES } from "../scripts/full-audit-lib.mjs";

const [batchModule] = process.argv.slice(2);
if (!batchModule) throw new Error("Usage: node apply-country-batch-record.mjs <./fqa0XX-countries.mjs>");

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
        "country",
        profileId,
        axisId,
        csv,
        "Batch audit (genuine per-question simulation grounded in real institutional facts)",
      ],
      { encoding: "utf8" }
    );
    console.log(out.trim());
  }
}
