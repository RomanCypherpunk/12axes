import { execFileSync } from "node:child_process";

const ids = [
  "mussolini",
  "hitler",
  "jose-antonio-primo-de-rivera",
  "putin",
  "hendrik-verwoerd",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
