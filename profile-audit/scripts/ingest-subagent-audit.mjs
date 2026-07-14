// Ingests a subagent's isolated-audit output (written by the prompt from
// gen-subagent-audit-prompt.mjs) and records all 12 axes through the standard
// record-full-axis-answers.mjs pipeline. Validates strictly before recording anything:
// all 12 axes present, exactly 20 valid answer codes per axis, one per question id.
//
// Usage:
//   node profile-audit/scripts/ingest-subagent-audit.mjs <catalog> <profileId>
// Reads:  profile-audit/.subagent-out/<catalog>__<profileId>.json  (override dir with AUDIT_OUT_DIR)

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { AXES, ROOT, loadQuestions } from "./full-audit-lib.mjs";

const OUT_DIR = process.env.AUDIT_OUT_DIR ?? path.join(ROOT, "profile-audit", ".subagent-out");
const ANSWER_CODES = ["DT", "D", "N", "C", "CT"];

const [catalog, profileId] = process.argv.slice(2);
if (!catalog || !profileId) {
  console.error("Usage: node profile-audit/scripts/ingest-subagent-audit.mjs <catalog> <profileId>");
  process.exit(1);
}

const outFile = path.join(OUT_DIR, `${catalog}__${profileId}.json`);
if (!fs.existsSync(outFile)) {
  console.error(`MISSING output file: ${outFile}`);
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(fs.readFileSync(outFile, "utf8"));
} catch (err) {
  console.error(`INVALID JSON in ${outFile}: ${err.message}`);
  process.exit(2);
}

const { byAxis } = loadQuestions();

// Validate everything before recording anything.
const csvByAxis = {};
const errors = [];
for (const axisId of AXES) {
  const block = parsed[axisId];
  if (!block || typeof block !== "object") {
    errors.push(`axis ${axisId}: missing`);
    continue;
  }
  const answers = block.answers;
  if (!answers || typeof answers !== "object") {
    errors.push(`axis ${axisId}: missing answers object`);
    continue;
  }
  const questions = byAxis.get(axisId);
  const csv = [];
  for (const q of questions) {
    const code = answers[q.id];
    if (!ANSWER_CODES.includes(code)) {
      errors.push(`axis ${axisId}: invalid/missing answer for ${q.id}: ${JSON.stringify(code)}`);
    } else {
      csv.push(code);
    }
  }
  if (csv.length === 20) csvByAxis[axisId] = csv.join(",");
}

if (errors.length) {
  console.error(`VALIDATION FAILED for ${catalog}:${profileId}:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(3);
}

// Record all 12 axes.
for (const axisId of AXES) {
  const brief = String(parsed[axisId].personaBrief ?? "").slice(0, 200);
  execFileSync(
    "node",
    [
      "profile-audit/scripts/record-full-axis-answers.mjs",
      catalog,
      profileId,
      axisId,
      csvByAxis[axisId],
      `Subagent isolated audit. Persona brief: ${brief}`,
    ],
    { encoding: "utf8", cwd: ROOT, stdio: "pipe" }
  );
}

console.log(`RECORDED ${catalog}:${profileId} (12 axes)`);
