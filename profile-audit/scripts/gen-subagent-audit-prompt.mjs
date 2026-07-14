// Generates a self-contained subagent prompt for the "Opção B" isolated audit
// (INSTRUCOES-NOVA-AUDITORIA.md §3.2): one whole profile (all 12 axes) per subagent, with no
// access to any other profile's answers. Mirrors buildPrompt()/seededShuffle()/AXIS_FOCUS from
// audit-isolated-api.mjs exactly, but batches the 12 axes into a single prompt and asks the
// subagent to WRITE its answers as strict JSON to a file (so the orchestrator can ingest them
// deterministically instead of parsing prose).
//
// Usage:
//   node profile-audit/scripts/gen-subagent-audit-prompt.mjs <catalog> <profileId>
// Prints the prompt to stdout. The output-file path it instructs the subagent to write is:
//   profile-audit/.subagent-out/<catalog>__<profileId>.json   (override dir with AUDIT_OUT_DIR)

import path from "node:path";
import { AXES, ROOT, loadQuestions, readJson, PROFILE_SOURCES } from "./full-audit-lib.mjs";

const OUT_DIR = process.env.AUDIT_OUT_DIR ?? path.join(ROOT, "profile-audit", ".subagent-out");

// Same one-liners as audit-isolated-api.mjs (spirit of each axis, from the project methodology).
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

// Deterministic per-(profileId, axisId) shuffle — identical to audit-isolated-api.mjs.
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

const [catalog, profileId] = process.argv.slice(2);
if (!catalog || !profileId) {
  console.error("Usage: node profile-audit/scripts/gen-subagent-audit-prompt.mjs <catalog> <profileId>");
  process.exit(1);
}

const entry = loadCatalogEntry(catalog, profileId);
const { byAxis } = loadQuestions();
const catalogLabel = {
  ideology: "ideologia política",
  country: "país/entidade histórica",
  personality: "figura histórica/pública",
}[catalog];

const descriptionFields = [
  `id: ${entry.id}`,
  `name: ${entry.name}`,
  entry.category ? `category: ${entry.category}` : null,
  entry.role ? `role: ${entry.role}` : null,
  entry.lifespan ? `lifespan: ${entry.lifespan}` : null,
  entry.period ? `period: ${entry.period}` : null,
  `description: ${entry.description}`,
].filter(Boolean).join("\n");

const outFile = path.join(OUT_DIR, `${catalog}__${profileId}.json`);

const axisBlocks = AXES.map((axisId) => {
  const shuffled = seededShuffle(byAxis.get(axisId), `${profileId}:${axisId}`);
  const questionLines = shuffled
    .map((q, i) => `${i + 1}. [id=${q.id}] ${q.text}`)
    .join("\n");
  return `### Eixo "${axisId}" — ${AXIS_FOCUS[axisId]}
Persona brief (1-2 frases) conectando a description acima a ESTE eixo especificamente, depois responda as 20 perguntas.
${questionLines}`;
}).join("\n\n");

const prompt = `Você está auditando, pergunta a pergunta e de forma totalmente independente, o perfil "${entry.name}" (catálogo: ${catalogLabel}) nos 12 eixos políticos do projeto 12axes. Avalie ESTE perfil sozinho — você não tem (e não deve imaginar) as respostas dadas a nenhum outro perfil.

Dados curados deste perfil (não invente informação além disto; se precisar de contexto histórico adicional, baseie-se apenas em fatos amplamente documentados e verificáveis sobre esta entidade específica):
${descriptionFields}

METODOLOGIA (obrigatória):
- Para CADA um dos 12 eixos: primeiro escreva um persona brief de 1-2 frases conectando especificamente a description acima ao tema daquele eixo (não repita a description inteira — extraia só a parte relevante àquele eixo).
- Depois responda as 20 perguntas do eixo, uma a uma, com um destes códigos: DT (discordo totalmente), D (discordo), N (neutro/indiferente), C (concordo), CT (concordo totalmente).
- Simule genuinamente como o próprio perfil / seus porta-vozes reais responderiam CADA pergunta individualmente. NÃO escolha um valor-alvo para o eixo e trabalhe de trás para frente. Aceite o que resultar, mesmo que surpreendente.
- Cada pergunta é independente. As perguntas já vêm em ordem embaralhada. Responda pelo id da pergunta.
- Nuance importante do eixo "controle": as perguntas citam "o governo/Estado/Banco Central" como agente econômico. Se este perfil for anti-estatista mas quiser coordenação econômica coletiva/planejada (ex.: anarquistas, comunistas libertários), julgue pelo ESPÍRITO de coordenação coletiva vs. mercado, não pela agência estatal literal. Já no eixo "representacao", a ausência de Estado formal (anarquia) conta do lado democrático/anti-autocrático, não autocrático.

SAÍDA (obrigatória): use a ferramenta Write para gravar UM arquivo JSON estrito (sem markdown, sem comentários) exatamente neste caminho:
${outFile}

Formato exato do JSON (as chaves de "answers" devem ser os ids das perguntas; cada eixo com exatamente 20 respostas; todos os 12 eixos presentes):
{
  "estrutura": { "personaBrief": "...", "answers": { "estrutura_01": "C", "estrutura_07": "DT", ... } },
  "representacao": { "personaBrief": "...", "answers": { ... } },
  ... (todos os 12 eixos: ${AXES.join(", ")})
}

Depois de gravar o arquivo, responda apenas com "OK ${catalog}:${profileId}" e um resumo de 1 linha. Não cole o JSON inteiro na resposta.

=== PERGUNTAS POR EIXO ===

${axisBlocks}`;

process.stdout.write(prompt);
