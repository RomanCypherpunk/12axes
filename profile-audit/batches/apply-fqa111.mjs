import { execFileSync } from "node:child_process";

const ids = [
  "louis-xiv",
  "salazar",
  "khomeini",
  "frederico-ii-da-prussia",
  "joseph-de-maistre",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
