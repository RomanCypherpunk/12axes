// Isolated per-profile-axis auditor — implements sections 6.1-6.3 of
// AUDITORIA-12AXES-ACHADOS-E-NOVA-METODOLOGIA.md.
//
// Each (catalog, profileId, axisId) unit is answered in its own, completely fresh API call:
// no conversation history from other profiles is ever included in the prompt. This makes the
// "I already answered something like this" copy-paste shortcut structurally impossible instead
// of merely instructed against.
//
// Requires ANTHROPIC_API_KEY in the environment. No SDK dependency — uses native fetch (Node >= 18).
//
// Usage:
//   node profile-audit/scripts/audit-isolated-api.mjs <catalog> <profileId> <axisId>
//   node profile-audit/scripts/audit-isolated-api.mjs ideology socialismo-stalinista estrutura
//
// Called by run-batch-isolated.mjs for bulk processing; can also be run standalone for one unit
// (e.g. to reprocess a single flagged duplicate).

import { execFileSync } from "node:child_process";
import {
  ROOT,
  loadQuestions,
  readJson,
  PROFILE_SOURCES,
} from "./full-audit-lib.mjs";

const MODEL = process.env.AUDIT_MODEL ?? "claude-sonnet-5";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = "https://api.anthropic.com/v1/messages";

const ANSWER_CODES = ["DT", "D", "N", "C", "CT"];

// Deterministic but distinct shuffle per (profileId, axisId) — section 6.3. Same profile always
// gets the same order across re-runs (reproducible), but different profiles get different orders,
// so mechanical copy-paste of a prior answer sequence no longer even lines up question-for-question.
function seededShuffle(array, seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) >>> 0;
    return seed / 0xffffffff;
  };
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function loadCatalogEntry(catalog, profileId) {
  const source = PROFILE_SOURCES.find((s) => s.catalog === catalog);
  if (!source) throw new Error(`Unknown catalog: ${catalog}`);
  const meta = readJson(source.metaFile);
  const entry = meta.find((m) => m.id === profileId);
  if (!entry) throw new Error(`Profile not found in ${source.metaFile}: ${profileId}`);
  return entry;
}

// The "spirit of the axis" one-liners used to focus the persona brief (section 6.2) — these mirror
// the axis-polarity table from the project's own methodology notes, not something the model has to
// infer freshly each call.
const AXIS_FOCUS = {
  estrutura: "grau de centralização vs. fragmentação/federalismo do poder político",
  representacao: "grau de democracia/prestação de contas vs. autocracia/poder não eleito",
  poder: "segurança/vigilância/coerção estatal vs. liberdade individual e civil",
  imigracao: "assimilação cultural exigida vs. multiculturalismo celebrado",
  diplomacia: "militarismo/força armada vs. pacifismo/diplomacia",
  intervencao: "não-intervencionismo vs. nacionalismo assertivo em política externa",
  economia: "propriedade/produção pública-coletiva vs. privada-individual",
  controle: "planejamento e direção estatal da economia vs. livre-mercado",
  comercio: "protecionismo vs. globalismo comercial",
  religiao: "irreligiosidade/secularismo vs. religiosidade",
  moral: "progressismo social vs. tradicionalismo",
  tecnologia: "abraçar tecnologia/biotecnologia vs. priorizar natureza/limites biológicos",
};

function buildPrompt({ catalog, profileId, entry, axisId, questions }) {
  const catalogLabel = { ideology: "ideologia política", country: "país/entidade histórica", personality: "figura histórica/pública" }[catalog];
  const descriptionFields = [
    `id: ${entry.id}`,
    `name: ${entry.name}`,
    entry.category ? `category: ${entry.category}` : null,
    entry.role ? `role: ${entry.role}` : null,
    entry.lifespan ? `lifespan: ${entry.lifespan}` : null,
    entry.period ? `period: ${entry.period}` : null,
    `description: ${entry.description}`,
  ].filter(Boolean).join("\n");

  const questionLines = questions.map((q, i) => `${i + 1}. [id=${q.id}] [polo=${q.agreePole}] ${q.text}`).join("\n");

  return `Você está auditando, pergunta a pergunta e de forma totalmente independente, o eixo "${axisId}" \
(${AXIS_FOCUS[axisId]}) do perfil "${entry.name}" (catálogo: ${catalogLabel}).

Dados curados deste perfil (não invente informação além disto; se precisar de contexto histórico \
adicional, baseie-se apenas em fatos amplamente documentados e verificáveis sobre esta entidade específica):
${descriptionFields}

PASSO 1 — Persona brief (obrigatório, 1-2 frases): antes de responder, escreva 1-2 frases conectando \
especificamente a description acima ao tema deste eixo (${AXIS_FOCUS[axisId]}). Não repita a description \
inteira — extraia e aplique apenas a parte relevante a ESTE eixo especificamente.

PASSO 2 — Responda as 20 perguntas abaixo (ordem embaralhada, cada pergunta é independente das outras) \
com um dos códigos: DT (discordo totalmente), D (discordo), N (neutro/indiferente), C (concordo), \
CT (concordo totalmente). Simule genuinamente como aderentes/porta-vozes reais deste perfil responderiam \
CADA pergunta individualmente — não escolha um valor-alvo para o eixo e trabalhe de trás para frente. \
Aceite o que resultar, mesmo que surpreendente.

Perguntas:
${questionLines}

Responda em JSON estrito, sem markdown, neste formato exato:
{"personaBrief": "...", "answers": {"${questions[0].id}": "CT", "${questions[1].id}": "D", ...}}

O objeto "answers" deve ter exatamente ${questions.length} chaves, uma para cada question id listado acima.`;
}

async function callApi(prompt, { avoidSequence } = {}) {
  if (!API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY não está definida no ambiente. Configure-a antes de rodar este script (veja profile-audit/INSTRUCOES-NOVA-AUDITORIA.md)."
    );
  }
  const fullPrompt = avoidSequence
    ? `${prompt}\n\nATENÇÃO: sua resposta anterior para este mesmo perfil/eixo coincidiu exatamente, pergunta a \
pergunta, com a de outro perfil (sequência: ${avoidSequence}). Isso quase certamente significa que você \
reaproveitou um padrão em vez de avaliar este perfil especificamente. Refaça considerando o que torna ESTE \
perfil genuinamente diferente do outro em pelo menos algumas destas 20 perguntas — mesmo que o eixo final \
fique parecido, as respostas individuais devem refletir raciocínio próprio.`
    : prompt;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: fullPrompt }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data.content?.map((block) => block.text ?? "").join("") ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Resposta não contém JSON: ${text.slice(0, 300)}`);
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.answers || !parsed.personaBrief) {
    throw new Error(`JSON incompleto (faltando personaBrief ou answers): ${text.slice(0, 300)}`);
  }
  return parsed;
}

export async function auditUnitIsolated(catalog, profileId, axisId, { avoidSequence } = {}) {
  const { byAxis } = loadQuestions();
  const axisQuestions = byAxis.get(axisId);
  if (!axisQuestions) throw new Error(`Unknown axis: ${axisId}`);
  const entry = loadCatalogEntry(catalog, profileId);
  const shuffled = seededShuffle(axisQuestions, `${profileId}:${axisId}`);

  const prompt = buildPrompt({ catalog, profileId, entry, axisId, questions: shuffled });
  const { personaBrief, answers } = await callApi(prompt, { avoidSequence });

  // Validate: every question must have a valid answer code.
  for (const q of axisQuestions) {
    const code = answers[q.id];
    if (!ANSWER_CODES.includes(code)) {
      throw new Error(`Resposta inválida ou ausente para ${q.id}: ${JSON.stringify(code)}`);
    }
  }

  const csv = axisQuestions.map((q) => answers[q.id]).join(",");
  const out = execFileSync(
    "node",
    [
      "profile-audit/scripts/record-full-axis-answers.mjs",
      catalog,
      profileId,
      axisId,
      csv,
      `Isolated API audit (model=${MODEL}). Persona brief: ${personaBrief.slice(0, 200)}`,
    ],
    { encoding: "utf8", cwd: ROOT }
  );
  return { personaBrief, csv, recordOutput: out.trim() };
}

// Standalone CLI usage.
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1]?.endsWith("audit-isolated-api.mjs")) {
  const [catalog, profileId, axisId] = process.argv.slice(2);
  if (!catalog || !profileId || !axisId) {
    console.error("Usage: node profile-audit/scripts/audit-isolated-api.mjs <catalog> <profileId> <axisId>");
    process.exit(1);
  }
  auditUnitIsolated(catalog, profileId, axisId)
    .then((result) => {
      console.log(`${catalog}:${profileId}:${axisId} -> ${result.csv}`);
      console.log(`Persona brief: ${result.personaBrief}`);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
