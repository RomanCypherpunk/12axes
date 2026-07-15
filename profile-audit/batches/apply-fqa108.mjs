import { execFileSync } from "node:child_process";

const ids = [
  "henri-de-saint-simon",
  "gramsci",
  "oskar-lange",
  "olof-palme",
  "ezra-heywood",
];

const out = execFileSync(
  "node",
  ["profile-audit/batches/apply-personality-batch.mjs", ...ids],
  { encoding: "utf8" }
);

console.log(out.trim());
