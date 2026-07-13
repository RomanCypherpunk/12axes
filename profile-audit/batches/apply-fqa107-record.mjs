// Records FQA107 answers (arqueofuturismo + guillaume-faye) across both catalogs. Unlike
// apply-batch.mjs (which is hardcoded to catalog "ideology"), this walks the {catalog: {profileId:
// {axisId: answers}}} shape produced by fqa107-arqueofuturismo-faye.mjs.
import { execFileSync } from "node:child_process";
import { AXES } from "../scripts/full-audit-lib.mjs";

const { PROFILES } = await import("./fqa107-arqueofuturismo-faye.mjs");

for (const [catalog, profiles] of Object.entries(PROFILES)) {
  for (const [profileId, axes] of Object.entries(profiles)) {
    for (const axisId of AXES) {
      const answers = axes[axisId];
      if (!answers || answers.length !== 20) {
        throw new Error(`${catalog}:${profileId}.${axisId}: expected 20 answers, got ${answers?.length}`);
      }
      const csv = answers.join(",");
      const out = execFileSync(
        "node",
        [
          "profile-audit/scripts/record-full-axis-answers.mjs",
          catalog,
          profileId,
          axisId,
          csv,
          "FQA107: genuine per-question audit for a catalog entry added after the audit began",
        ],
        { encoding: "utf8" }
      );
      console.log(out.trim());
    }
  }
}
