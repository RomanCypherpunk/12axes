import fs from "node:fs";

const NEW_IDEOLOGY_IDS = new Set([
  "anarcoindividualismo", "centrismo", "trabalhismo", "positivismo", "conservadorismo-secular",
  "progressismo-cristao", "autoritarismo-modernizador", "desenvolvimentismo-de-estado", "atlantismo",
  "federalismo-privado", "tecno-monarquismo", "progressismo-de-direita", "tecno-socialismo",
  "tecno-fascismo", "liberalismo-autoritario", "nacionalismo-progressista", "ecofascismo",
  "comunismo-agrario", "socialismo-bolivariano", "nacional-desenvolvimentismo", "populismo-libertario",
  "teocratismo-cristao", "socialismo-titoista", "socialismo-anticolonial", "socialismo-juche",
  "tecno-comunismo", "tecno-anarquismo", "tecno-cristianismo", "populismo-de-direita",
  "populismo-de-esquerda", "centrismo-social", "centrismo-liberal", "centrismo-ambientalista",
  "centrismo-conservador",
]);
// nacional-liberalismo deliberately excluded (bespoke user-approved vector, CLAUDE.md sec.8)

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));
const vectorById = new Map();
for (const p of results.profiles) {
  if (p.catalog === "ideology" && NEW_IDEOLOGY_IDS.has(p.profileId) && p.completedAxes === 12) {
    vectorById.set(p.profileId, p.vector);
  }
}

if (vectorById.size !== NEW_IDEOLOGY_IDS.size) {
  const missing = [...NEW_IDEOLOGY_IDS].filter((id) => !vectorById.has(id));
  throw new Error(`Missing completed vectors for: ${missing.join(", ")}`);
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

if (applied !== NEW_IDEOLOGY_IDS.size) {
  throw new Error(`Expected to patch ${NEW_IDEOLOGY_IDS.size} ideologies, applied ${applied}`);
}

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched ${applied} ideologies (FQA028-034) in ${file}`);
