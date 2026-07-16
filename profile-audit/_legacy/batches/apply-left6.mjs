import fs from "node:fs";

const IDS = new Set([
  "socialismo-cristao", "trabalhismo-cristao", "socialismo-religioso",
  "social-democracia", "socialismo", "socialismo-liberal",
]);

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));
const vectorById = new Map();
for (const p of results.profiles) {
  if (p.catalog === "ideology" && IDS.has(p.profileId) && p.completedAxes === 12) {
    vectorById.set(p.profileId, p.vector);
  }
}
if (vectorById.size !== IDS.size) {
  throw new Error(`Missing: ${[...IDS].filter((id) => !vectorById.has(id)).join(", ")}`);
}

const file = "backend/src/main/resources/data/ideology-profiles.json";
const profiles = JSON.parse(fs.readFileSync(file, "utf8"));
let applied = 0;
for (const profile of profiles) {
  if (vectorById.has(profile.ideologyId)) {
    profile.vector = vectorById.get(profile.ideologyId);
    applied += 1;
  }
}
if (applied !== IDS.size) throw new Error(`Expected ${IDS.size}, applied ${applied}`);

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched ${applied} ideologies in ${file}`);
