import fs from "node:fs";

const file = "backend/src/main/resources/data/ideology-profiles.json";
const profiles = JSON.parse(fs.readFileSync(file, "utf8"));
const patch = JSON.parse(
  fs.readFileSync(new URL("./controle-anarchist-cluster-output.json", import.meta.url), "utf8")
);

const patchById = new Map(patch.map((row) => [row.profileId, row.value]));
let applied = 0;
for (const profile of profiles) {
  if (patchById.has(profile.ideologyId)) {
    profile.vector.controle = patchById.get(profile.ideologyId);
    applied += 1;
  }
}

if (applied !== patch.length) {
  throw new Error(`Expected to patch ${patch.length}, applied ${applied}`);
}

fs.writeFileSync(file, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Patched controle for ${applied} ideologies in ${file}`);
