// Exports every profile in a catalog that has ZERO recorded axes so far — distinct from
// export-duplicate-units.mjs, which only looks at profiles that already have *some* recorded
// answers (and flags them if those answers collide with another profile's). A never-touched
// profile has nothing to collide with yet; it simply needs a first-time audit.
//
// Usage:
//   node profile-audit/scripts/export-pending-profiles.mjs personality > personality-pending.json
//   node profile-audit/scripts/export-pending-profiles.mjs country
//   node profile-audit/scripts/export-pending-profiles.mjs ideology

import { loadProfiles, loadQuestions, parseAnswerLines } from "./full-audit-lib.mjs";

const [catalogFilter] = process.argv.slice(2);
if (!catalogFilter) {
  console.error("Usage: node profile-audit/scripts/export-pending-profiles.mjs <ideology|country|personality>");
  process.exit(1);
}

const profiles = loadProfiles().filter((p) => p.catalog === catalogFilter);
const { byAxis } = loadQuestions();
const axes = [...byAxis.keys()];
const rows = parseAnswerLines();
const doneUnits = new Set(rows.map((r) => `${r.catalog}:${r.profileId}:${r.axisId}`));

const neverTouched = [];
const partial = [];
for (const p of profiles) {
  const doneCount = axes.filter((ax) => doneUnits.has(`${p.catalog}:${p.profileId}:${ax}`)).length;
  if (doneCount === 0) neverTouched.push({ catalog: p.catalog, profileId: p.profileId });
  else if (doneCount < axes.length) partial.push({ catalog: p.catalog, profileId: p.profileId, doneCount });
}

console.error(
  `${catalogFilter}: ${profiles.length} total, ${neverTouched.length} never touched, ${partial.length} partial (should normally be 0 — the batch workflow always does all 12 axes at once; if this is nonzero, those profiles need a mixed pass).`
);
if (partial.length) {
  console.error(`Partial profiles (review manually): ${partial.map((p) => `${p.profileId}(${p.doneCount}/12)`).join(", ")}`);
}
console.log(JSON.stringify(neverTouched, null, 2));
