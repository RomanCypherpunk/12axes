import { execFileSync } from "node:child_process";
import { AXES } from "../scripts/full-audit-lib.mjs";

const { PROFILES } = await import("./fqa035-countries.mjs");

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
        "FQA035: genuine per-question audit grounded in real constitutional/institutional facts",
      ],
      { encoding: "utf8" }
    );
    console.log(out.trim());
  }
}
