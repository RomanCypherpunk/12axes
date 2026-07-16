// Generic patcher for personality batches.
// Usage: node apply-personality-batch.mjs id1 id2 id3 id4 id5
import fs from "node:fs";

const IDS = new Set(process.argv.slice(2));
if (IDS.size === 0) throw new Error("Usage: node apply-personality-batch.mjs id1 id2 ...");

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));
const vectorById = new Map();
for (const p of results.profiles) {
  if (p.catalog === "personality" && IDS.has(p.profileId) && p.completedAxes === 12) {
    vectorById.set(p.profileId, p.vector);
  }
}
if (vectorById.size !== IDS.size) {
  const missing = [...IDS].filter((id) => !vectorById.has(id));
  throw new Error(`Missing completed vectors for: ${missing.join(", ")}`);
}

const file = "backend/src/main/resources/data/personality-profiles.json";
const profiles = JSON.parse(fs.readFileSync(file, "utf8"));
let applied = 0;
for (const profile of profiles) {
  if (vectorById.has(profile.personalityId)) {
    profile.vector = vectorById.get(profile.personalityId);
    applied += 1;
  }
}
if (applied !== IDS.size) {
  throw new Error(`Expected to patch ${IDS.size} entities, applied ${applied}`);
}

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched ${applied} personalities in ${file}:`, [...IDS].join(", "));
