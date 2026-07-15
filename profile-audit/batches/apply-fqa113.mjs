import { execFileSync } from "node:child_process";

const ids = [
  "adam-smith",
  "jabotinsky",
  "theodore-roosevelt",
  "bismarck",
  "scruton",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
