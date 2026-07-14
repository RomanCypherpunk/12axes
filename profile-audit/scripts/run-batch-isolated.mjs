// Orchestrator for the new isolated-context audit pipeline — implements section 6.4-6.5 of
// AUDITORIA-12AXES-ACHADOS-E-NOVA-METODOLOGIA.md: run isolated per-unit audits, then run the
// mandatory duplicate-cluster gate after every batch, and automatically reprocess (once) any unit
// that landed in a cluster of size > 1 formed entirely from units processed in this run.
//
// Usage:
//   node profile-audit/scripts/run-batch-isolated.mjs <unitsFile.json>
//   node profile-audit/scripts/run-batch-isolated.mjs --pending <catalog> [limit]
//
// <unitsFile.json> is a JSON array of {"catalog":"personality","profileId":"lenin","axisId":"estrutura"}.
//
// Requires ANTHROPIC_API_KEY. See profile-audit/INSTRUCOES-NOVA-AUDITORIA.md for full setup.

import { auditUnitIsolated } from "./audit-isolated-api.mjs";
import { loadQuestions, parseAnswerLines, readJson, loadProfiles } from "./full-audit-lib.mjs";

const BATCH_SIZE = Number(process.env.AUDIT_BATCH_SIZE ?? 20);
const MAX_REPROCESS_ROUNDS = 2;

function sequenceMap() {
  const { byAxis } = loadQuestions();
  const rows = parseAnswerLines();
  const byUnit = new Map();
  for (const row of rows) {
    const key = `${row.catalog}:${row.profileId}:${row.axisId}`;
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key).push(row);
  }
  const bySeqKey = new Map(); // "axisId|sequence" -> [unitKey...]
  const unitSequence = new Map(); // unitKey -> sequence string
  for (const [key, unitRows] of byUnit) {
    const axisId = key.split(":")[2];
    const axisQuestions = byAxis.get(axisId);
    if (!axisQuestions || unitRows.length !== axisQuestions.length) continue;
    const order = new Map(axisQuestions.map((q, i) => [q.id, i]));
    const sorted = [...unitRows].sort((a, b) => order.get(a.questionId) - order.get(b.questionId));
    const sequence = sorted.map((r) => r.answer).join(",");
    const seqKey = `${axisId}|${sequence}`;
    if (!bySeqKey.has(seqKey)) bySeqKey.set(seqKey, []);
    bySeqKey.get(seqKey).push(key);
    unitSequence.set(key, sequence);
  }
  return { bySeqKey, unitSequence };
}

// Returns the units (from `processedKeys`) that currently sit in a duplicate cluster (size > 1),
// along with the sequence they collided on (for the reprocess hint).
function findDuplicatesAmong(processedKeys) {
  const { bySeqKey, unitSequence } = sequenceMap();
  const flagged = [];
  for (const key of processedKeys) {
    const seq = unitSequence.get(key);
    if (!seq) continue;
    const axisId = key.split(":")[2];
    const cluster = bySeqKey.get(`${axisId}|${seq}`) ?? [];
    if (cluster.length > 1) flagged.push({ key, sequence: seq, clusterSize: cluster.length });
  }
  return flagged;
}

function loadPendingUnits(catalog, limit) {
  const profiles = loadProfiles().filter((p) => p.catalog === catalog);
  const { byAxis } = loadQuestions();
  const axes = [...byAxis.keys()];
  const rows = parseAnswerLines();
  const done = new Set(rows.map((r) => `${r.catalog}:${r.profileId}:${r.axisId}`));
  const units = [];
  for (const p of profiles) {
    for (const axisId of axes) {
      const key = `${catalog}:${p.profileId}:${axisId}`;
      if (!done.has(key)) units.push({ catalog, profileId: p.profileId, axisId });
      if (limit && units.length >= limit) return units;
    }
  }
  return units;
}

async function processUnit(unit, opts) {
  const label = `${unit.catalog}:${unit.profileId}:${unit.axisId}`;
  try {
    const result = await auditUnitIsolated(unit.catalog, unit.profileId, unit.axisId, opts);
    console.log(`OK   ${label}`);
    return { ...unit, ok: true, personaBrief: result.personaBrief };
  } catch (err) {
    console.error(`FAIL ${label}: ${err.message}`);
    return { ...unit, ok: false, error: err.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  let units;
  if (args[0] === "--pending") {
    const catalog = args[1];
    const limit = args[2] ? Number(args[2]) : undefined;
    if (!catalog) throw new Error("Usage: --pending <ideology|country|personality> [limit]");
    units = loadPendingUnits(catalog, limit);
    console.log(`Loaded ${units.length} pending units for catalog=${catalog}.`);
  } else {
    const file = args[0];
    if (!file) {
      throw new Error(
        "Usage:\n  node run-batch-isolated.mjs <unitsFile.json>\n  node run-batch-isolated.mjs --pending <catalog> [limit]"
      );
    }
    units = readJson(file);
  }

  let processedKeys = [];
  for (let i = 0; i < units.length; i += BATCH_SIZE) {
    const batch = units.slice(i, i + BATCH_SIZE);
    console.log(`\n=== Batch ${i / BATCH_SIZE + 1}: ${batch.length} units ===`);
    for (const unit of batch) {
      await processUnit(unit);
      processedKeys.push(`${unit.catalog}:${unit.profileId}:${unit.axisId}`);
    }

    // Mandatory gate (section 6.4): check just-processed units for duplicate clusters.
    let round = 0;
    let flagged = findDuplicatesAmong(processedKeys.slice(-batch.length));
    while (flagged.length && round < MAX_REPROCESS_ROUNDS) {
      round += 1;
      console.log(`\n--- Duplicate gate round ${round}: ${flagged.length} flagged unit(s) ---`);
      for (const f of flagged) {
        console.log(`  ${f.key} collides with ${f.clusterSize - 1} other unit(s) on sequence ${f.sequence}`);
        const [catalog, profileId, axisId] = f.key.split(":");
        await processUnit({ catalog, profileId, axisId }, { avoidSequence: f.sequence });
      }
      flagged = findDuplicatesAmong(processedKeys.slice(-batch.length));
    }
    if (flagged.length) {
      console.warn(
        `\nWARNING: ${flagged.length} unit(s) still duplicated after ${MAX_REPROCESS_ROUNDS} reprocess rounds — needs manual review:`
      );
      for (const f of flagged) console.warn(`  ${f.key}`);
    } else {
      console.log(`Batch clean: no duplicate clusters among just-processed units.`);
    }
  }

  console.log(`\nDone. Processed ${processedKeys.length} units.`);
  console.log(`Next: node profile-audit/scripts/calculate-full-profile-audit.mjs`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
