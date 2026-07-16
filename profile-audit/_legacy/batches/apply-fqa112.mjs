import { execFileSync } from "node:child_process";

const ids = [
  "aleksandr-dugin",
  "trotsky",
  "gregor-strasser",
  "sorel",
  "arne-naess",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
