// Generic vector patcher for ANY catalog (personality/country/ideology).
// Mirrors apply-personality-batch.mjs but resolves the target profile file and id key from
// PROFILE_SOURCES, so it works for countries-profiles.json and ideology-profiles.json too.
//
// Usage: node profile-audit/batches/apply-catalog-batch.mjs <catalog> id1 id2 id3 ...
//   e.g. node profile-audit/batches/apply-catalog-batch.mjs country brazil japan
//        node profile-audit/batches/apply-catalog-batch.mjs ideology anarcho-capitalism
import fs from "node:fs";
import { PROFILE_SOURCES } from "../scripts/full-audit-lib.mjs";

const [catalog, ...idArgs] = process.argv.slice(2);
if (!catalog || idArgs.length === 0) {
  throw new Error("Usage: node apply-catalog-batch.mjs <catalog> id1 id2 ...");
}

const source = PROFILE_SOURCES.find((s) => s.catalog === catalog);
if (!source) throw new Error(`Unknown catalog: ${catalog}. Use one of: ${PROFILE_SOURCES.map((s) => s.catalog).join(", ")}`);

const IDS = new Set(idArgs);

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));
const vectorById = new Map();
for (const p of results.profiles) {
  if (p.catalog === catalog && IDS.has(p.profileId) && p.completedAxes === 12) {
    vectorById.set(p.profileId, p.vector);
  }
}
if (vectorById.size !== IDS.size) {
  const missing = [...IDS].filter((id) => !vectorById.has(id));
  throw new Error(`Missing completed (12-axis) vectors for: ${missing.join(", ")}`);
}

const file = source.profileFile;
const profiles = JSON.parse(fs.readFileSync(file, "utf8"));
let applied = 0;
for (const profile of profiles) {
  const id = profile[source.idKey];
  if (vectorById.has(id)) {
    profile.vector = vectorById.get(id);
    applied += 1;
  }
}
if (applied !== IDS.size) {
  throw new Error(`Expected to patch ${IDS.size} entities, applied ${applied}`);
}

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched ${applied} ${catalog} profiles in ${file}:`, [...IDS].join(", "));
