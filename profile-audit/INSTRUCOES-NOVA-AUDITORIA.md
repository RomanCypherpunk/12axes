# Instruções — nova metodologia de auditoria (pós-revisão)

Este arquivo existe para você continuar este trabalho em outra máquina/sessão. Leia inteiro antes
de rodar qualquer coisa — especialmente a seção "Script perigoso" abaixo.

## 1. O que aconteceu (resumo)

Uma sessão anterior (via chat, sem API) fez uma auditoria pergunta-a-pergunta de ~416 perfis nos
catálogos de ideologia, país e personalidade, respondendo manualmente cada uma das 20 perguntas de
cada um dos 12 eixos. Você pediu uma segunda revisão independente (`AUDITORIA-12AXES-ACHADOS-E-NOVA-METODOLOGIA.md`,
que você colou no chat) e ela encontrou um problema estrutural real: o processo estava reaproveitando
sequências inteiras de 20 respostas entre perfis parecidos, em vez de avaliar cada perfil de forma
genuinamente independente.

**Eu conferi essa revisão rodando o detector de duplicatas do próprio projeto agora e confirmei o
achado**: neste momento existem **665 clusters de resposta idêntica** (20/20 respostas byte-a-byte
iguais entre dois ou mais perfis, no mesmo eixo) espalhados pelos três catálogos:

| Catálogo | Total de perfis | Nunca auditados (0/12 eixos) | Já auditados | ...dos quais duplicados |
|---|---|---|---|---|
| Personalidade | 228 | **112** | 116 | **116 (100%)** |
| País | 130 | 0 | 130 | 130 (100%) |
| Ideologia | 171 | 1 | 170 | 146 (86%) |

Ou seja: em personalidade, **todo perfil que já foi auditado está duplicado com outro** (116 de
116) — e ainda faltam 112 perfis que nunca foram tocados. São dois problemas diferentes que pedem
tratamento diferente (seção 3.2 explica os dois).

A causa raiz, como o revisor diagnosticou: numa sessão de chat contínua, ao processar um perfil
parecido com outro já respondido no mesmo eixo, o modelo reconhece a semelhança de alto nível
("isso aqui também é autocrático") e reaproveita o conjunto de respostas anterior inteiro, em vez de
reavaliar as 20 perguntas especificamente para aquele perfil. Isso é um atalho estrutural, não um
lapso pontual — eu mesmo caí nele repetidamente ao longo da sessão (e corrigi manualmente vários
casos quando percebia, mas só verificava duplicatas *dentro* de cada lote de 5 perfis, nunca contra
o corpus inteiro já auditado — por isso o problema persistiu em escala mesmo com correções pontuais).

**Minha avaliação da revisão: o diagnóstico e a proposta de metodologia fazem sentido e eu os
implementei.** A proposta central (isolar cada chamada de perfil×eixo sem histórico de outros
perfis, exigir um "persona brief" ancorado na `description` já curada do catálogo, embaralhar a
ordem das perguntas por perfil, e rodar um gate automático de duplicidade depois de cada lote) ataca
a causa raiz em vez de pedir "mais cuidado" — que eu já mostrei nesta sessão que não é suficiente
sozinho.

## 2. Script perigoso — NÃO USE

Encontrei `profile-audit/scripts/dedupe-target-answer-sequences.mjs`, que já existia no projeto.
Ele **não faz reavaliação genuína**: para um perfil duplicado, ele troca/perturba letras de resposta
individuais (trocar duas posições, ou +1/-1 em um par) até a sequência de 20 respostas parar de bater
com a de outro perfil — mas restringe cada candidato a preservar **exatamente o mesmo valor de eixo
calculado** de antes. Ou seja: ele consegue fazer o detector de duplicidade "calar a boca" sem que
nenhum julgamento independente real tenha acontecido — as letras novas são essencialmente ruído
mecânico, não uma opinião reconsiderada.

Já marquei o arquivo com um aviso grande no topo. **Não rode esse script contra os clusters listados
abaixo** — ele mascararia o problema em vez de corrigi-lo. Se quiser, pode deletá-lo depois de
revisar; eu não apaguei porque isso é uma decisão sua.

## 3. Duas formas de rodar a nova metodologia

O que importa de verdade é **isolamento de contexto real** (cada perfil avaliado sem ver as
respostas dadas a outros perfis). Existem duas formas de conseguir isso:

- **Opção A — script + API da Anthropic.** Já está pronta e testada (seção 3.1 abaixo). Roda sozinha,
  em lote, sem supervisão — dá pra deixar rodando. Precisa de `ANTHROPIC_API_KEY` e tem custo de API
  por token.
- **Opção B — subagentes do Claude Code (sem API key).** Não precisa de chave nem de custo de API
  separado — usa o seu plano normal do Claude Code. Mas exige uma sessão do Claude Code ativa
  disparando os subagentes (não roda sozinho de madrugada como a Opção A). Ver seção 3.2.

Escolha uma das duas (ou comece pela B se não quiser lidar com chave de API agora).

### 3.1 Opção A — script + API (`audit-isolated-api.mjs` / `run-batch-isolated.mjs`)

Três scripts novos em `profile-audit/scripts/`, todos testados (`node --check` passou e o wiring foi
testado ponta a ponta até a chamada de API):

### `audit-isolated-api.mjs`
Núcleo da nova metodologia. Para um único `(catalog, profileId, axisId)`:
- Carrega a `description` (e `category`/`role`/`lifespan`/`period` quando existir) já curada do
  catálogo (`ideologies.json` / `countries.json` / `personalities.json`) — não inventa contexto novo.
- Embaralha as 20 perguntas do eixo com uma seed determinística por `profileId:axisId` (mesma ordem
  se você rodar de novo o mesmo perfil, ordem diferente entre perfis).
- Faz **uma chamada de API isolada** (`fetch` nativo, sem SDK) exigindo primeiro um persona-brief de
  1-2 frases conectando a `description` ao tema específico daquele eixo, depois as 20 respostas em
  JSON estrito.
- Grava via o mesmo `record-full-axis-answers.mjs` que a sessão anterior já usava — formato do
  `PROFILE_FULL_AUDIT_ANSWERS.jsonl` não muda, então todo o resto do pipeline (`calculate-full-profile-audit.mjs`,
  `sync-full-audit-current-values.mjs`, os `apply-*.mjs`) continua funcionando sem alteração.

Uso isolado (um único perfil/eixo, útil para testar):
```
node profile-audit/scripts/audit-isolated-api.mjs personality lenin estrutura
```

### `run-batch-isolated.mjs`
Orquestrador. Processa uma lista de unidades em lotes (padrão 20, configurável via
`AUDIT_BATCH_SIZE`), e **depois de cada lote roda o gate de duplicidade automaticamente** — se algum
par de perfis processados *neste lote* colidiu, reprocessa automaticamente (até 2 rodadas) passando
um prompt específico: "sua resposta bateu exatamente com a de [perfil X], reconsidere o que diverge".

Dois modos de uso:
```
# Processar tudo que ainda não tem nenhuma resposta gravada, para um catálogo:
node profile-audit/scripts/run-batch-isolated.mjs --pending personality

# Processar uma lista específica de unidades (ex.: as duplicadas, ver seção 4):
node profile-audit/scripts/run-batch-isolated.mjs personality-rework.json
```

### `export-duplicate-units.mjs`
Exporta as unidades que estão em cluster duplicado agora, para você alimentar no
`run-batch-isolated.mjs`. Ordena do maior cluster para o menor (prioriza os templates mais
reaproveitados primeiro, como a revisão recomendou). Aceita `--profiles` (ver 3.2) para colapsar em
perfis únicos em vez de unidades eixo×perfil.

### 3.2 Opção B — subagentes do Claude Code (sem API key)

Não é um script — é um fluxo de trabalho que você pede para uma sessão do Claude Code (esta ou a da
outra máquina) executar, usando a ferramenta de subagentes (Agent/Task) que já existe no Claude Code.
Cada subagente nasce sem ver a conversa principal nem outros subagentes já rodados — isolamento real,
igual à Opção A, só que sem chave de API separada.

**Diferença importante:** aqui o retrabalho é **por perfil inteiro** (os 12 eixos de uma vez), não
eixo por eixo — porque cópia entre eixos do mesmo perfil nunca foi o problema, só cópia entre
perfis diferentes. Isso já reduz bastante o volume. Mas existem **dois grupos distintos de
perfis**, e é fácil misturar os dois por engano:

1. **Já auditados, mas duplicados** (`export-duplicate-units.mjs --profiles`) — têm resposta gravada,
   mas ela colidiu com outra. Precisam ser *reavaliados* (a gravação nova substitui a antiga).
2. **Nunca auditados** (`export-pending-profiles.mjs`) — não têm nenhuma resposta gravada ainda.
   Precisam de auditoria *pela primeira vez*, não de retrabalho.

O fluxo de subagente é idêntico para os dois grupos (mesmo prompt, mesma gravação via
`record-full-axis-answers.mjs`) — a única diferença é se você está sobrescrevendo algo que já
existia ou escrevendo pela primeira vez. Pode processar os dois grupos juntos.

| Catálogo | Grupo 1: já auditado + duplicado | Grupo 2: nunca auditado | Total a processar |
|---|---|---|---|
| Personalidade | 116 (100% dos já auditados) | **112** | **228** |
| País | 130 (100% dos já auditados) | 0 | 130 |
| Ideologia | 146 (86% dos já auditados) | 1 | 147 |

Para gerar as listas:
```bash
# Grupo 1 — já auditados mas duplicados
node profile-audit/scripts/export-duplicate-units.mjs personality --profiles > personality-rework.json
node profile-audit/scripts/export-duplicate-units.mjs country --profiles > country-rework.json
node profile-audit/scripts/export-duplicate-units.mjs ideology --profiles > ideology-rework.json

# Grupo 2 — nunca auditados
node profile-audit/scripts/export-pending-profiles.mjs personality > personality-pending.json
node profile-audit/scripts/export-pending-profiles.mjs country > country-pending.json
node profile-audit/scripts/export-pending-profiles.mjs ideology > ideology-pending.json
```

Em personalidade especificamente, isso significa **os dois arquivos juntos cobrem o catálogo
inteiro** (116 + 112 = 228) — não sobra nenhum perfil "só confirmando que já está bom", porque
literalmente nenhum perfil de personalidade escapou da duplicação ou da ausência total.

**O que pedir para o Claude Code fazer** (cole isto, ou algo parecido, numa sessão nova — ela não
precisa ter acompanhado nada do histórico anterior, só precisa deste arquivo):

> Leia `profile-audit/INSTRUCOES-NOVA-AUDITORIA.md` inteiro. Depois, para cada perfil listado em
> `personality-rework.json` e `personality-pending.json` (comece por este catálogo — junte os dois
> arquivos, a ordem não importa), dispare um subagente (Agent tool, `subagent_type: general-purpose`,
> sem acesso à sua própria conversa) com um prompt autocontido
> contendo: (1) a `description`/`category`/`role`/`lifespan` desse perfil, lidos direto de
> `backend/src/main/resources/data/personalities.json` (ou `countries.json`/`ideologies.json`
> conforme o catálogo); (2) as 20 perguntas de cada um dos 12 eixos (`backend/src/main/resources/data/questions-pool.json`),
> em ordem embaralhada por eixo; (3) a instrução de escrever primeiro um persona-brief de 1-2 frases
> por eixo conectando a description ao tema específico daquele eixo, e só depois responder
> DT/D/N/C/CT para cada pergunta, avaliando pergunta a pergunta sem partir de um valor-alvo. Quando o
> subagente devolver as respostas, grave-as você mesmo via
> `node profile-audit/scripts/record-full-axis-answers.mjs <catalog> <profileId> <axisId> <CSV de 20 respostas> "Subagent isolated audit"`
> para cada um dos 12 eixos. Pode despachar vários subagentes em paralelo (numa única mensagem, várias
> chamadas de Agent tool) para ir mais rápido. Depois de cada leva de ~10-15 perfis, rode
> `node profile-audit/scripts/find-duplicate-answer-sequences.mjs 2` para conferir se o número de
> clusters está caindo; se algum perfil novo colidir com outro, dispare um novo subagente só para ele
> avisando explicitamente com qual perfil colidiu e pedindo para reconsiderar as divergências.

Isso é literalmente a mesma lógica do `buildPrompt()` dentro de `audit-isolated-api.mjs` — se quiser,
abra esse arquivo e use o texto de lá como referência mais precisa do prompt.

## 4. Pré-requisitos para rodar na outra máquina

**Se for usar a Opção A (script + API):**
1. **Node.js 18+** (o projeto já roda em Node 22, `fetch` nativo é usado, sem dependências novas —
   não precisa `npm install` nada para os scripts novos).
2. **`ANTHROPIC_API_KEY`** no ambiente. Isso **custa dinheiro de API** — eu não tenho essa chave
   configurada neste ambiente e por isso não pude rodar o pipeline eu mesmo; só testei o wiring até o
   ponto da chamada de API (erro esperado "ANTHROPIC_API_KEY não está definida").
   ```
   # PowerShell
   $env:ANTHROPIC_API_KEY = "sk-ant-..."
   # bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   ```
3. Opcional: `AUDIT_MODEL` (padrão `claude-sonnet-5`) e `AUDIT_BATCH_SIZE` (padrão 20).

**Se for usar a Opção B (subagentes):** só precisa de uma sessão do Claude Code aberta na pasta do
projeto e do prompt da seção 3.2. Nenhuma configuração extra.

## 5. Escala esperada

Contando os dois grupos da seção 3.2 (duplicados + nunca auditados):

- **Opção A**: no modo por unidade eixo×perfil, o retrabalho dos duplicados é 1211 (personalidade) +
  1000 (país) + 1080 (ideologia) = 3291 unidades; os nunca-auditados somam mais 112×12 (personalidade)
  + 0 (país) + 1×12 (ideologia) = 1356 unidades. Total **≈4647 chamadas de API** (mais eventuais
  reprocessamentos do gate). Tem custo real de API por token.
- **Opção B (por perfil inteiro)**: 228 (personalidade: 116 duplicados + 112 nunca auditados) + 130
  (país) + 147 (ideologia: 146 duplicados + 1 nunca auditado) = **505 perfis**, cada um = 1 subagente
  cobrindo os 12 eixos de uma vez. Sem custo de API separado, mas consome uso normal do Claude Code e
  precisa de alguém disparando os subagentes.
- **Personalidade tem prioridade** (seção 6.7 da revisão): é o catálogo mais comprometido — 100% dos
  perfis já auditados estão duplicados, e quase metade do catálogo (112/228) nunca foi tocado.
- Em qualquer uma das opções: rode um lote pequeno de teste primeiro (5-15 perfis) e confira a
  qualidade das respostas antes de soltar o resto.

## 6. Passo a passo recomendado (Opção A — script + API)

Se for usar a Opção B, o passo a passo é o prompt da seção 3.2 — não precisa dos comandos abaixo,
exceto o `find-duplicate-answer-sequences.mjs` do passo 1 e 10 para conferir o progresso.

```bash
# 1. Confirmar estado atual de duplicatas (gera profile-audit/PROFILE_FULL_AUDIT_DUPLICATE_SEQUENCES.md)
node profile-audit/scripts/find-duplicate-answer-sequences.mjs 2

# 2. Exportar as unidades duplicadas de personalidade (maior prioridade) para reprocessar
node profile-audit/scripts/export-duplicate-units.mjs personality > personality-rework.json

# 3. Configurar a chave de API (ver seção 4)

# 4. Rodar um lote pequeno de teste primeiro
$env:AUDIT_BATCH_SIZE = "5"
node profile-audit/scripts/run-batch-isolated.mjs personality-rework.json

# 5. Conferir manualmente 2-3 personas-brief e respostas gravadas no
#    PROFILE_FULL_AUDIT_ANSWERS.jsonl (procure pela nota "Isolated API audit")

# 6. Se a qualidade estiver boa, seguir com o resto (pode soltar AUDIT_BATCH_SIZE maior)
node profile-audit/scripts/run-batch-isolated.mjs personality-rework.json

# 7. Repetir para country e ideology
node profile-audit/scripts/export-duplicate-units.mjs country > country-rework.json
node profile-audit/scripts/run-batch-isolated.mjs country-rework.json

node profile-audit/scripts/export-duplicate-units.mjs ideology > ideology-rework.json
node profile-audit/scripts/run-batch-isolated.mjs ideology-rework.json

# 8. Perfis de personalidade ainda nunca auditados (a auditoria original nunca chegou neles)
node profile-audit/scripts/run-batch-isolated.mjs --pending personality

# 9. Depois de cada rodada grande: recalcular tudo, aplicar nos catálogos vivos, sincronizar fila
node profile-audit/scripts/calculate-full-profile-audit.mjs
node profile-audit/batches/apply-personality-batch.mjs <ids...>   # ou o equivalente de country/ideology
node profile-audit/scripts/sync-full-audit-current-values.mjs

# 10. Conferir que o problema realmente diminuiu
node profile-audit/scripts/find-duplicate-answer-sequences.mjs 2
```

## 7. O que NÃO mudou

- O formato de `PROFILE_FULL_AUDIT_ANSWERS.jsonl`, `PROFILE_FULL_AUDIT_QUEUE.json` e
  `PROFILE_FULL_AUDIT_RESULTS.json` é o mesmo. Todos os scripts antigos (`calculate-full-profile-audit.mjs`,
  `sync-full-audit-current-values.mjs`, `record-full-axis-answers.mjs`, os `apply-*.mjs`) continuam
  funcionando exatamente como antes.
- Os catálogos vivos (`ideology-profiles.json`, `countries-profiles.json`, `personality-profiles.json`)
  só são atualizados quando você roda um `apply-*.mjs` explicitamente — nada nos scripts novos
  escreve neles diretamente.
- Nenhum commit foi feito. Como sempre neste projeto, você revisa e faz commit/push quando quiser.

## 8. Estado no momento em que esta sessão terminou

- 416/416 perfis com pelo menos alguma auditoria têm os 12 eixos completos, 0 erros de cálculo,
  0 patchCandidates pendentes de aplicação — mas isso mede *completude*, não *qualidade/independência*
  das respostas, que é exatamente o que os 665 clusters acima mostram estar comprometido em partes
  grandes do corpus.
- Fila de lotes (formato antigo, batch de 5 perfis): 84 lotes concluídos / 23 pendentes de 107 —
  esses 23 pendentes são perfis de personalidade que nunca foram tocados (cobertos pelo `--pending
  personality` do passo 8 acima).
