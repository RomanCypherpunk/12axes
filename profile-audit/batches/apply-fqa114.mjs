import { execFileSync } from "node:child_process";

const ids = [
  "garrett-hardin",
  "ernest-renan",
  "beveridge",
  "javier-milei",
  "friedrich-list",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
