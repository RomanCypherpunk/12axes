import fs from "node:fs";

const results = JSON.parse(fs.readFileSync("profile-audit/PROFILE_FULL_AUDIT_RESULTS.json", "utf8"));

const ideology = results.profiles.find((p) => p.catalog === "ideology" && p.profileId === "arqueofuturismo");
const personality = results.profiles.find((p) => p.catalog === "personality" && p.profileId === "guillaume-faye");
if (!ideology || ideology.completedAxes !== 12) throw new Error("arqueofuturismo not fully audited");
if (!personality || personality.completedAxes !== 12) throw new Error("guillaume-faye not fully audited");

const ideologyFile = "backend/src/main/resources/data/ideology-profiles.json";
const ideologyProfiles = JSON.parse(fs.readFileSync(ideologyFile, "utf8"));
const ideologyEntry = ideologyProfiles.find((p) => p.ideologyId === "arqueofuturismo");
if (!ideologyEntry) throw new Error("arqueofuturismo missing from ideology-profiles.json");
ideologyEntry.vector = ideology.vector;
fs.writeFileSync(ideologyFile, `${JSON.stringify(ideologyProfiles, null, 2)}\n`);

const personalityFile = "backend/src/main/resources/data/personality-profiles.json";
const personalityProfiles = JSON.parse(fs.readFileSync(personalityFile, "utf8"));
const personalityEntry = personalityProfiles.find((p) => p.personalityId === "guillaume-faye");
if (!personalityEntry) throw new Error("guillaume-faye missing from personality-profiles.json");
personalityEntry.vector = personality.vector;
fs.writeFileSync(personalityFile, `${JSON.stringify(personalityProfiles, null, 2)}\n`);

console.log("Patched arqueofuturismo:", ideology.vector);
console.log("Patched guillaume-faye:", personality.vector);
