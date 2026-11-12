# FullValues: motor + primeira leva (Política) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar o motor de valores declarados do quiz de 240 perguntas (árvore, pontuação com peso 2, chave `f=` no link, seção de resultado) funcionando com a categoria **Política** completa, atrás de uma flag, para o Enzo testar localmente.

**Architecture:** O backend é dono do catálogo (`full-values.json`), da validação, da chave e da pontuação; o frontend só percorre a árvore, envia `values` (categoria → valor) e carrega a chave `f` devolvida pelo backend. O vetor de 12 eixos continua sendo a fonte de verdade; os valores só entram nele com peso 2 e depois só aparecem na página. Categorias sem conteúdo (as outras 7) existem no catálogo vazias e são ignoradas.

**Tech Stack:** Java 21 / Spring Boot 3.3 / JUnit 5 / MockMvc (backend); React 18 / TypeScript / Vitest (frontend).

**Spec:** `docs/superpowers/specs/2026-11-11-full-values-design.md`

**Este é o plano 1.** Ficam para planos seguintes: as outras 7 categorias (uma leva cada), cartões de compartilhamento e QR (`/r?…&f=`), telas de comparação, página de créditos dos ícones, traduções es/de e a remoção da flag.

## Global Constraints

- Não commitar nem dar push: o Enzo commita. Cada tarefa termina em verificação, não em commit. Trabalho na branch `feat/full-values`.
- Respostas e textos de interface para o usuário em português do Brasil; comentários de código em português, como no resto do repositório.
- Oito categorias, nesta ordem fixa: `politica`, `tecnologia`, `economia`, `cultura`, `controle_social`, `politica_externa`, `nacao`, `organizacao_territorial`.
- Um valor por categoria, sem intensidade, sem repetir a árvore.
- O efeito de cada valor em cada eixo entra com **peso 2** (`WeightedScore.add(leftPercent / 100.0, 2.0)`); as respostas das 240 perguntas ficam com peso 1; o arquétipo simples continua com peso 1 e nenhum resultado dos quizzes de 36 e 60 pode mudar.
- Cada valor toca de 1 a 3 eixos; efeito na escala 0–100 do polo esquerdo (a de `archetype-questions.json`). O valor neutro ("equilibrado") **não tem efeito** e a validação o dispensa disso.
- Em simulação, as escolhas de valores não deslocam nenhum eixo mais de ~10 pontos do vetor só com as respostas.
- Chave `f`: `"1"` + base64url sem padding de 6 bytes (8 slots × 6 bits, na ordem das categorias; 0 = sem valor; índice = posição 1-based do valor em `values` da categoria, no máximo 63) + 1 caractere de verificação = 10 caracteres. Índices são estáveis e só crescem; nunca reordenar `values`.
- Conteúdo original: perguntas, descrições e árvore escritas do zero; nada copiado do HyperValues (CC BY-NC-SA). Nomes de valores podem ser termos políticos genéricos.
- Ícones: só licença verificável (domínio público, CC0, CC BY, CC BY-SA), de preferência Wikimedia Commons; sem Reddit nem arte sem licença. Cada ícone grava URL, autor, licença e se foi modificado. Imagens raster passam por `npm run optimize:images`.
- Flag no frontend: `VITE_FULL_VALUES_ENABLED=true` (só em `frontend/.env.local` por enquanto). Sem a flag, o quiz de 240 fica exatamente como hoje.
- Resultados sem `f` (antigos, 36 e 60) mostram os valores derivados dos eixos, como hoje.

## Review Focus

1. Chave `f` malformada, adulterada ou com índice fora do catálogo: cai nos valores derivados, nunca 500 (Task 2 e 4).
2. `values` na requisição com categoria ou valor desconhecido, ou valor de outra categoria: 400 claro (Task 3).
3. O mesmo vetor com `f` diferente devolve valores diferentes: o cache de resultados é por vetor e não pode vazar valores de outro usuário (Task 4).
4. Valor neutro não muda o vetor em relação a não escolher nada (Task 3).
5. Recarregar no meio da árvore, voltar e mudar uma resposta antiga: o caminho antigo é descartado e não deixa valor órfão (Task 6).

## File Structure

Backend (`backend/src/main/java/com/twelveaxes/`):
- `model/ValueTree.java` (novo): árvore de uma categoria e sua visão para o frontend.
- `model/FullValue.java` (novo): valor declarado já resolvido e traduzido, com ícone e fonte.
- `service/FullValuesKey.java` (novo): codec puro da chave, sem conhecer o catálogo.
- `service/FullValuesService.java` (novo): carga, validação, consulta, resolução e (de)codificação com o catálogo.
- Modificados: `model/ResultRequest.java`, `model/PremiumRequest.java`, `model/QuizPayload.java`, `model/QuizResult.java`, `service/ScoringService.java`, `service/QuizDataService.java` (monta `QuizPayload`), `controller/QuizController.java`, `controller/PremiumController.java`.
- Dados (`backend/src/main/resources/data/`): `full-values.json` (pt, fonte) e `i18n/en/full-values.json`.

Frontend (`frontend/src/`): `types/quiz.ts`, `utils/valueTrees.ts` (novo), `services/quizApi.ts`, `services/premiumApi.ts`, `App.tsx`, `components/results/FullValuesSection.tsx` (novo), `components/editorial/ResultsScreen.tsx`, `components/results/EditAnswersSheet.tsx`, `public/values/politica/` (ícones).

---

### Task 1: Catálogo FullValues (modelo, carga, validação)

**Files:**
- Create: `backend/src/main/java/com/twelveaxes/model/ValueTree.java`, `FullValue.java`, `service/FullValuesService.java`
- Create: `backend/src/main/resources/data/full-values.json` (as 8 categorias, só Política com conteúdo mínimo de semente; o conteúdo real é a Task 9), `data/i18n/en/full-values.json`
- Test: `backend/src/test/java/com/twelveaxes/FullValuesServiceTest.java`

**Interfaces:**
- Produces:
  - `record ValueTree.Option(String text, String next, String value)` (exatamente um de `next` e `value` não nulo), `record ValueTree.Node(String id, String text, List<Option> options)`, `record ValueTree(String categoryId, String label, String root, List<Node> nodes)` e `ValueTree.View`/`NodeView` com os textos já no idioma pedido (ids de opção = índice da opção no nó, em texto).
  - `record FullValue(String categoryId, String categoryLabel, String valueId, String name, String description, boolean neutral, Icon icon)` e `record FullValue.Icon(String file, String sourceUrl, String author, String license, boolean modified)` (ícone nulo quando não há).
  - `FullValuesService`: `static FullValuesService fromJson(ObjectMapper, String ptJson, String enJson)`; `List<String> categoryIds()` (as 8, em ordem); `List<ValueTree.View> trees(String lang)` (só categorias com conteúdo); `FullValuesService.Value value(String categoryId, String valueId)` que lança `ResponseStatusException(400)` se desconhecido, com `Value` expondo `effects(): Map<String, Double>` e `neutral()`; `List<FullValue> resolve(Map<String, String> chosen, String lang)` na ordem das categorias.
- Formato do JSON pt: `{"categories":[{"id","label","axes":[...],"root","nodes":[{"id","text","options":[{"text","next"|"value"}]}],"values":[{"id","name","description","neutral","effects":{eixo:0-100},"icon":{file,sourceUrl,author,license,modified}|null}]}]}`. Overlay `en`: `{id: {"label"|"name"|"description"|"text": "..."}}` com opções por `"<nodeId>.<índice>"`; campo sem tradução usa o português (mesmo padrão de `PoliticalValuesService`, que é o modelo a seguir; o es/de cai no inglês depois).

- [ ] **Step 1: Escrever os testes de validação em `FullValuesServiceTest`** (usando `fromJson` com JSON mínimo): carrega semente válida; `categoryIds()` devolve as 8 na ordem fixa; categoria sem `values` é aceita e fica fora de `trees("pt")`; recusa com `IllegalStateException`: eixo desconhecido em `effects`, efeito fora de 0–100, valor não neutro sem efeitos ou com mais de 3 eixos, valor neutro com efeitos, opção com `next` e `value` juntos ou nenhum, `next`/`value` que não existem, nó inalcançável a partir de `root`, ciclo, id de valor duplicado na categoria, mais de 63 valores numa categoria.
- [ ] **Step 2: Rodar e ver falhar** — `cd backend; .\mvnw.cmd test -Dtest=FullValuesServiceTest` — esperado: falha de compilação (classes não existem).
- [ ] **Step 3: Implementar** os records e `FullValuesService` (`@Service`, carrega `data/full-values.json` e o overlay en no construtor como `PoliticalValuesService`). `value()` e `resolve()` usam o valor neutro sem efeito normalmente.
- [ ] **Step 4: Rodar e ver passar** — mesmo comando, esperado: todos os testes da classe passam; depois `.\mvnw.cmd test` completo para garantir que a subida do contexto com o `full-values.json` de semente funciona.

### Task 2: Codec da chave `f`

**Files:**
- Create: `backend/src/main/java/com/twelveaxes/service/FullValuesKey.java`
- Modify: `service/FullValuesService.java` (acrescenta os dois métodos abaixo)
- Test: `backend/src/test/java/com/twelveaxes/FullValuesKeyTest.java`

**Interfaces:**
- Produces: `FullValuesKey.encode(int[] slots): String` (8 posições, cada uma 0–63); `FullValuesKey.decode(String key): Optional<int[]>` (vazio se versão ≠ `"1"`, tamanho ≠ 10, caractere fora do alfabeto base64url ou verificação errada; a verificação é a soma dos 6 bytes módulo 64 como caractere do alfabeto). `FullValuesService.encodeKey(Map<String,String> chosen): Optional<String>` (vazio se nada escolhido) e `Optional<Map<String,String>> decodeKey(String key)` (vazio se o codec falha ou algum índice não existe no catálogo; índice 0 = categoria ausente do mapa).

- [ ] **Step 1: Testes** — ida e volta com `{0,0,0,0,0,0,0,0}`, `{1,63,0,5,0,0,0,2}`; chave com um caractere trocado → vazio; versão `"2…"` → vazio; tamanho 9 e 11 → vazio; índice 63 numa categoria que só tem 5 valores → `decodeKey` vazio; chave com `=` ou espaço → vazio. Em `FullValuesServiceTest`/`FullValuesKeyTest`: `encodeKey` seguido de `decodeKey` devolve o mesmo mapa.
- [ ] **Step 2: Rodar e ver falhar** — `.\mvnw.cmd test -Dtest=FullValuesKeyTest`.
- [ ] **Step 3: Implementar** o codec com `java.util.Base64.getUrlEncoder().withoutPadding()`; os 48 bits empacotados em 6 bytes, slot 0 nos bits mais altos.
- [ ] **Step 4: Rodar e ver passar** — mesmo comando.

### Task 3: Pontuação com peso 2

**Files:**
- Modify: `model/ResultRequest.java`, `service/ScoringService.java`
- Test: `backend/src/test/java/com/twelveaxes/FullValuesScoringTest.java` (no estilo de `ArchetypeScoringTest`)

**Interfaces:**
- Consumes: `FullValuesService.value(categoryId, valueId)` (Task 1).
- Produces: `ResultRequest(List<SubmittedAnswer> answers, String variant, Map<String,String> archetype, Map<String,String> values)` (o canônico ganha `values`; os construtores existentes de 1, 2 e 3 argumentos continuam e passam `null`). `ScoringService` recebe `FullValuesService` no construtor.

- [ ] **Step 1: Testes** — (a) um valor com efeito `{poder: 90}` desloca `poder` para cima em relação ao mesmo pedido sem `values`, e o deslocamento com peso 2 é o dobro do que o mesmo efeito teria como arquétipo de peso 1 (valores de fixture controlados via `FullValuesService.fromJson` injetado); (b) `values` nulo, vazio e ausente dão exatamente o mesmo vetor de hoje; (c) valor neutro: vetor idêntico a não enviar; (d) categoria desconhecida e valor de outra categoria → `ResponseStatusException` 400; (e) valor de categoria sem conteúdo (ex.: `tecnologia` enquanto vazia) → 400.
- [ ] **Step 2: Rodar e ver falhar** — `.\mvnw.cmd test -Dtest=FullValuesScoringTest`.
- [ ] **Step 3: Implementar** `addFullValues(Map<String,String>, Map<String,WeightedScore>)` em `ScoringService.accumulate`, depois de `addArchetypeAnswers`, com `add(left / 100.0, 2.0)` por eixo do efeito. Atualizar os pontos que constroem `ScoringService` em testes, se houver.
- [ ] **Step 4: Rodar tudo do escopo** — `.\mvnw.cmd test -Dtest="FullValuesScoringTest,ArchetypeScoringTest,ScoringServiceTest,ScorerBenchmarkTest"` — esperado: tudo passa, sem alterar resultado dos testes antigos.

### Task 4: API (payload, resultado, `f` em by-axes)

**Files:**
- Modify: `model/QuizPayload.java`, `model/QuizResult.java`, `service/QuizDataService.java:459`, `controller/QuizController.java`
- Test: `backend/src/test/java/com/twelveaxes/FullValuesApiTest.java` (MockMvc, no estilo de `SharedResultsTest`)

**Interfaces:**
- Consumes: `FullValuesService.trees`, `resolve`, `encodeKey`, `decodeKey` (Tasks 1–2).
- Produces: `QuizPayload` ganha `List<ValueTree.View> valueTrees` (lista vazia nas variantes que não são `extreme`); `QuizResult` ganha `List<FullValue> fullValues` e `String fullValuesKey` (nulos quando não há) e o método `QuizResult withFullValues(List<FullValue>, String key)` que devolve cópia; `GET /api/results/by-axes?v=…&f=<chave>`; `POST /api/results` aceita `values` e devolve `fullValues` e `fullValuesKey`.

- [ ] **Step 1: Testes** — `GET /api/quiz?variant=extreme` traz `valueTrees` com Política e sem as outras sete; `variant=short` traz lista vazia; `POST /api/results` com `values` válidos devolve `fullValues` na ordem das categorias e uma `fullValuesKey` de 10 caracteres que, passada em `by-axes?f=`, devolve os mesmos valores; **mesmo `v` com duas chaves diferentes devolve valores diferentes e a segunda chamada não herda os da primeira (cache)**; `f` adulterada, de tamanho errado ou com índice inexistente → 200 com `fullValues` nulo (valores derivados em `politicalValues`); sem `f` → como hoje.
- [ ] **Step 2: Rodar e ver falhar** — `.\mvnw.cmd test -Dtest=FullValuesApiTest`.
- [ ] **Step 3: Implementar.** Em `QuizController`, o resultado em cache continua só por vetor/idioma/religião; depois de `buildResult` chama-se `withFullValues` (cópia), nunca se escreve no cache. `by-axes` ganha `@RequestParam(name = "f", required = false)`.
- [ ] **Step 4: Rodar** — `.\mvnw.cmd test -Dtest="FullValuesApiTest,QuizResultPayloadTest,SharedResultsTest,PoliticalValuesPayloadTest,QuizFlowAutomationTest"` — esperado: passam.

### Task 5: Relatório pago recebe os valores

**Files:**
- Modify: `model/PremiumRequest.java`, `controller/PremiumController.java:105`
- Test: acrescentar caso em `backend/src/test/java/com/twelveaxes/PremiumControllerTest.java`

**Interfaces:**
- Produces: `PremiumRequest(String v, List<SubmittedAnswer> answers, Map<String,String> archetype, Map<String,String> values)`; o controller monta `new ResultRequest(answers, "short", archetype, values)`.

- [ ] **Step 1: Teste** — pedido premium com `answers` e `values` produz `answerImpacts` cuja soma por eixo continua igual à distância do eixo ao centro do vetor `v` calculado com os mesmos valores (o peso 2 está no denominador). Sem `values`, igual a hoje.
- [ ] **Step 2: Rodar e ver falhar**, **Step 3: implementar**, **Step 4: rodar** — `.\mvnw.cmd test -Dtest="PremiumControllerTest,PremiumReportServiceTest"`.

### Task 6: Árvore no frontend (lógica pura e passos do quiz)

**Files:**
- Create: `frontend/src/utils/valueTrees.ts`, `frontend/src/utils/valueTrees.test.ts`
- Modify: `frontend/src/types/quiz.ts` (tipos `ValueTree`, `ValueTreeNode`, `FullValue`; `QuizPayload.valueTrees?`; `QuizResult.fullValues?`, `fullValuesKey?`), `frontend/src/services/premiumApi.ts` (`archetypeOnly` descarta ids com prefixo `fv:`; o pedido premium envia `values`)

**Interfaces:**
- Produces (em `valueTrees.ts`): `FV_STEP_PREFIX = 'fv:'`; `fullValuesSteps(trees: ValueTree[], choices: Record<string,string>): ArchetypeQuestion[]` (para cada árvore, na ordem do array, os nós já respondidos ao longo do caminho e o primeiro não respondido; ids `fv:<nodeId>`, `label` = rótulo da categoria, ids de opção = os do payload); `chooseValueNode(trees, choices, stepId, optionId): Record<string,string>` (grava a escolha e **descarta as escolhas de nós que deixaram de estar no caminho**); `valuesFromChoices(trees, choices): Record<string,string>` (categoria → valor, só de árvores que chegaram a uma folha); `valueChoiceFlagEnabled(): boolean` lê `import.meta.env.VITE_FULL_VALUES_ENABLED === 'true'`.

- [ ] **Step 1: Testes em `valueTrees.test.ts`** com uma árvore de 2 níveis: passos iniciais = só o nó raiz; responder avança ao filho; chegar à folha não gera passo novo e `valuesFromChoices` devolve o valor; **mudar a resposta da raiz depois de ter respondido o filho remove a escolha do filho antigo** (e `valuesFromChoices` volta a vazio); árvore incompleta não produz valor; duas árvores em sequência; escolhas de ids desconhecidos são ignoradas.
- [ ] **Step 2: Rodar e ver falhar** — `cd frontend; npx vitest run src/utils/valueTrees.test.ts`.
- [ ] **Step 3: Implementar** as funções e os tipos; em `premiumApi.ts` o filtro e o novo campo.
- [ ] **Step 4: Rodar** — `npx vitest run src/utils/valueTrees.test.ts src/services/premiumApi.test.ts` — esperado: passam.

### Task 7: Fluxo do quiz, link e envio

**Files:**
- Modify: `frontend/src/App.tsx` (`buildArchetypeSteps` ~179, `chooseArchetype` ~649, `submitQuiz`, `sharedResultUrl` ~116, `parseSharedResultUrl` ~85), `frontend/src/services/quizApi.ts` (`submitResults`, `fetchSharedResult`, `SHARED_RESULT_VERSION` de 3 para 4), `frontend/src/components/results/EditAnswersSheet.tsx`

**Interfaces:**
- Consumes: `fullValuesSteps`, `chooseValueNode`, `valuesFromChoices`, `valueChoiceFlagEnabled` (Task 6); `QuizResult.fullValuesKey` (Task 4).
- Produces: `submitResults(variant, answers, archetype, religion, values: Record<string,string> = {})` e `fetchSharedResult(leftPercents, religion, fullKey: string | null = null)` (acrescenta `&f=` quando há chave).

- [ ] **Step 1: Testes** — extrair para `frontend/src/utils/sharedResultUrl.ts` (+ teste Vitest) a leitura da chave `f` e a montagem do link para poder testar sem React: `/results?...&f=<chave>` é montado só quando `fullValuesKey` existe; sem ela o link é idêntico ao de hoje; leitura de `f` em `/results` devolve a string ou `null`. Esse teste falha antes da extração.
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/utils/sharedResultUrl.test.ts`.
- [ ] **Step 3: Implementar.** Com flag ligada, variante `extreme` e `quiz.valueTrees` não vazio, `buildArchetypeSteps` troca as 5 perguntas simples pelos passos da árvore, mantendo religião e denominação depois; `chooseArchetype` usa `chooseValueNode` para ids `fv:`; o fim do fluxo é recalculado a cada escolha (a lista de passos cresce com a árvore, como já acontece com a denominação). O envio manda `valuesFromChoices(...)` e `archetypeOnly(...)`. `EditAnswersSheet` mostra os mesmos passos na edição e salva pelo mesmo caminho. Voltar e pular seguem como estão (pular um nó remove a escolha dele e as dos filhos).
- [ ] **Step 4: Rodar** — `npx vitest run` (suíte inteira do frontend) e `npm run build` (tipos + build + páginas estáticas), esperado: tudo verde.

### Task 8: Seção de valores completos na página de resultado

**Files:**
- Create: `frontend/src/components/results/FullValuesSection.tsx`, `FullValuesSection.test.tsx`
- Modify: `frontend/src/components/editorial/ResultsScreen.tsx` (~359, escolhe a seção)

**Interfaces:**
- Consumes: `QuizResult.fullValues`, `FullValue` (Task 6).
- Produces: `FullValuesSection({ values: FullValue[], category: string, title?: string, id?: string, footer?: ReactNode })`.

- [ ] **Step 1: Teste** — com `fullValues` renderiza uma linha por valor com nome e rótulo da categoria; abrir a ficha mostra a descrição e, quando há `icon`, um botão "Fonte original" com autor, licença e link para `sourceUrl` (`rel="noopener noreferrer"`, `target="_blank"`); sem `icon`, mostra o círculo de reserva (inicial do valor, cor da categoria) e nenhum botão de fonte; valor neutro mostra a etiqueta de neutro. No `ResultsScreen`: com `fullValues` não vazio usa a nova seção, senão a `PoliticalValuesSection` atual (teste leve por renderização).
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/components/results/FullValuesSection.test.tsx`.
- [ ] **Step 3: Implementar** reaproveitando `DimRow`, `InfoSheet` e `catStyle` como `PoliticalValuesSection`; ícone em `<img>` dentro do círculo (`/values/<categoria>/<arquivo>`), sem recolorir. Textos novos em `i18n` (pt/en/es/de, a etiqueta "Fonte original" e "Autor"/"Licença") seguindo `scripts/check-i18n`.
- [ ] **Step 4: Rodar** — `npx vitest run` e `npm run build`; depois, na raiz, o check de i18n do repositório (`scripts/`), esperado: verde.

### Task 9: Conteúdo da leva Política

**Files:**
- Modify: `backend/src/main/resources/data/full-values.json`, `data/i18n/en/full-values.json`
- Create: `frontend/public/values/politica/*` (ícones)
- Test: o `FullValuesServiceTest` já valida o arquivo real (acrescentar um teste que carrega o `full-values.json` de produção e exige Política com 10–16 valores, árvore de profundidade ≤ 3, 2–4 opções por nó, exatamente 1 valor neutro e eixos só entre `estrutura`, `representacao`, `poder`, `economia`, `moral`).

- [ ] **Step 1: Rascunhar com o Enzo em mente** a lista de valores de Política (quem governa): ids estáveis em português sem acento (`tecnocracia`, …), nome, descrição de 1–2 frases sem juízo de valor, efeitos de 1–3 eixos coerentes com os perfis de `political-values.json` (`politicos`), mais o neutro. Cobrir autoridade pessoal, de especialistas, de herança, de eleição, de conselhos, de mercado/propriedade e ausência de governo, para que tecnocracia, meritocracia, neocameralismo e monarquia se distingam. Não copiar a lista nem a ordem do HyperValues.
- [ ] **Step 2: Escrever a árvore** (2–3 níveis, 2–4 opções, perguntas e alternativas originais) de modo que todo valor seja alcançável por um caminho distinto.
- [ ] **Step 3: Ícones.** Para cada valor, procurar no Wikimedia Commons um arquivo com licença permitida, ler a página do arquivo para autor e licença (um subagente `web-fetch` pode ler a página) e gravar os quatro campos de fonte e `modified`; baixar para `frontend/public/values/politica/<valueId>.<ext>`, `npm run optimize:images` nos rasters. Valor sem ícone livre: `icon: null`. Listar no resumo o que ficou sem ícone e por quê.
- [ ] **Step 4: Texto em inglês** em `i18n/en/full-values.json` para categoria, nós, opções e valores.
- [ ] **Step 5: Rodar** — `.\mvnw.cmd test` completo; esperado: verde, incluindo o teste do arquivo real e `ScorerBenchmarkTest`.
- [ ] **Step 6: Teste de deslocamento** em `FullValuesScoringTest`: com o catálogo real, para cada valor de Política e um conjunto de vetores base (centro, extremos), o efeito do valor desloca cada eixo no máximo ~10 pontos de um vetor de 20 respostas por eixo; ajustar efeitos que estourem.

### Task 10: Rodar local para o Enzo testar

- [ ] **Step 1:** criar/atualizar `frontend/.env.local` com `VITE_FULL_VALUES_ENABLED=true` (mantendo `VITE_API_PROXY_TARGET`).
- [ ] **Step 2:** subir o backend por `cd backend; .\mvnw.cmd -q package -DskipTests` e `java -jar target\<jar>` (não usar `spring-boot:run`: o acento no caminho quebra) e o frontend por `cd frontend; npm run dev`, ambos em segundo plano.
- [ ] **Step 3: Verificar de ponta a ponta no navegador:** `/240questions` → responder → árvore de Política aparece depois das 240 perguntas → resultado mostra "Valores" com o valor escolhido e o botão "Fonte original" → a URL tem `&f=<10 caracteres>` → recarregar a URL mantém o valor → apagar o `f` mostra os valores derivados → quizzes de 36 e 60 sem mudança. Reportar o que foi visto e o que não deu para ver, e o endereço para o Enzo.
