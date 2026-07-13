import fs from "node:fs";

const IDS = new Set([
  "argentina", "liechtenstein", "rojava", "iugoslavia-socialista", "espanha-franquista",
  "islandia-medieval", "emirados-arabes-unidos", "portugal-estado-novo", "prussia", "polonia",
]);

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));
const vectorById = new Map();
for (const p of results.profiles) {
  if (p.catalog === "country" && IDS.has(p.profileId) && p.completedAxes === 12) {
    vectorById.set(p.profileId, p.vector);
  }
}
if (vectorById.size !== IDS.size) {
  const missing = [...IDS].filter((id) => !vectorById.has(id));
  throw new Error(`Missing completed vectors for: ${missing.join(", ")}`);
}

const file = "backend/src/main/resources/data/countries-profiles.json";
const profiles = JSON.parse(fs.readFileSync(file, "utf8"));
let applied = 0;
for (const profile of profiles) {
  if (vectorById.has(profile.countryId)) {
    profile.vector = vectorById.get(profile.countryId);
    applied += 1;
  }
}
if (applied !== IDS.size) {
  throw new Error(`Expected to patch ${IDS.size} countries, applied ${applied}`);
}

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched ${applied} entities (FQA045-046) in ${file}`);
