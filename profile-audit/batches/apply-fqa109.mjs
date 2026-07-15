import { execFileSync } from "node:child_process";

const ids = [
  "mao-zedong",
  "kim-il-sung",
  "pol-pot",
  "ernst-niekisch",
  "plinio-salgado",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
