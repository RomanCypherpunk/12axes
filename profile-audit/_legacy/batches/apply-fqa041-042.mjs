import fs from "node:fs";

const IDS = new Set([
  "atenas-democratica", "esparta", "imperio-macedonico", "imperio-romano", "sacro-imperio-romano-germanico",
  "republica-de-veneza", "imperio-otomano", "reino-unido-vitoriano-imperio-britanico", "imperio-do-brasil", "alemanha-nazista-terceiro-reich",
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
console.log(`Patched ${applied} historical entities (FQA041-042) in ${file}`);
