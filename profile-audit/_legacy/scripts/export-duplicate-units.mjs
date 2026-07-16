// Exports every (catalog, profileId, axisId) unit currently sitting in a duplicate answer-sequence
// cluster (size >= 2) as a JSON array ready to feed into run-batch-isolated.mjs. Implements the
// rework-prioritization idea from section 6.7 of AUDITORIA-12AXES-ACHADOS-E-NOVA-METODOLOGIA.md.
//
// Usage:
//   node profile-audit/scripts/export-duplicate-units.mjs personality > personality-rework.json
//   node profile-audit/scripts/export-duplicate-units.mjs            > all-rework.json
//   node profile-audit/scripts/export-duplicate-units.mjs country 50 > country-rework-top50.json
//
// Add --profiles to collapse the output to unique {catalog, profileId} pairs instead of
// per-axis units — use this for the subagent-based rework method (INSTRUCOES-NOVA-AUDITORIA.md,
// "Opção B"), which redoes a whole profile's 12 axes in one isolated call rather than one axis at
// a time (axis-to-axis copying within the same profile was never the problem — only the
// between-profiles copying was — so collapsing to profile level cuts the rework count substantially):
//   node profile-audit/scripts/export-duplicate-units.mjs personality --profiles > personality-profiles-rework.json
//
// Units/profiles are sorted by (largest) cluster size first, matching the review's recommendation
// to prioritize the most-templated groups.

import { loadQuestions, parseAnswerLines } from "./full-audit-lib.mjs";

const rawArgs = process.argv.slice(2);
const profilesOnly = rawArgs.includes("--profiles");
const positional = rawArgs.filter((a) => a !== "--profiles");
const [catalogFilter, limitArg] = positional;
const limit = limitArg ? Number(limitArg) : undefined;

const { byAxis } = loadQuestions();
const rows = parseAnswerLines();
const byUnit = new Map();
for (const row of rows) {
  if (catalogFilter && row.catalog !== catalogFilter) continue;
  const key = `${row.catalog}:${row.profileId}:${row.axisId}`;
  if (!byUnit.has(key)) byUnit.set(key, []);
  byUnit.get(key).push(row);
}

const bySeqKey = new Map();
for (const [key, unitRows] of byUnit) {
  const axisId = key.split(":")[2];
  const axisQuestions = byAxis.get(axisId);
  if (!axisQuestions || unitRows.length !== axisQuestions.length) continue;
  const order = new Map(axisQuestions.map((q, i) => [q.id, i]));
  const sorted = [...unitRows].sort((a, b) => order.get(a.questionId) - order.get(b.questionId));
  const sequence = sorted.map((r) => r.answer).join(",");
  const seqKey = `${axisId}|${sequence}`;
  if (!bySeqKey.has(seqKey)) bySeqKey.set(seqKey, []);
  bySeqKey.get(seqKey).push(key);
}

const clusters = [...bySeqKey.values()].filter((c) => c.length > 1).sort((a, b) => b.length - a.length);

const units = [];
const seen = new Set();
for (const cluster of clusters) {
  for (const key of cluster) {
    if (seen.has(key)) continue;
    seen.add(key);
    const [catalog, profileId, axisId] = key.split(":");
    units.push({ catalog, profileId, axisId, _clusterSize: cluster.length });
  }
}

let output = units;
if (profilesOnly) {
  // Collapse to unique {catalog, profileId}, keeping the first (largest-cluster) sighting order.
  const seenProfiles = new Set();
  const profileList = [];
  for (const u of units) {
    const key = `${u.catalog}:${u.profileId}`;
    if (seenProfiles.has(key)) continue;
    seenProfiles.add(key);
    profileList.push({ catalog: u.catalog, profileId: u.profileId });
  }
  output = profileList;
}
if (limit) output = output.slice(0, limit);

console.error(
  `${clusters.length} clusters, ${units.length} unique units${
    profilesOnly ? `, ${output.length} unique profiles` : ""
  } flagged${catalogFilter ? ` (catalog=${catalogFilter})` : ""}.${limit ? ` Emitting top ${output.length}.` : ""}`
);
console.log(JSON.stringify(profilesOnly ? output : output.map(({ _clusterSize, ...u }) => u), null, 2));
