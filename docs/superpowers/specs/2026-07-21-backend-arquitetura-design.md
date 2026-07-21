# Refatoração de arquitetura do backend Java — design

Data: 2026-07-21
Autor: Claude (assistido), revisado por Enzo Xavier

## Contexto

O backend (`backend/src/main/java/com/twelveaxes`) é um serviço Spring Boot 3.3.5 / Java 21
sem persistência: carrega catálogos JSON em memória no boot e responde a um quiz político,
calculando eixos e comparando com ideologias/países/personalidades. O projeto é usado como
case de portfólio (ver `README.md`) e está em produção (Render + Vercel), consumido por um
frontend React/TypeScript que depende do contrato JSON atual das respostas.

Uma auditoria arquitetural prévia identificou:

- `QuizDataService` (431 linhas) acumula 4 responsabilidades: carga de JSON, construção do
  bundle de tradução EN, validação de integridade referencial entre catálogos, e fachada de
  acesso a dados.
- `IdeologyMatcherService` mistura ranking/matching com parsing de texto de descrição
  (~90 das 203 linhas são `shortDescription`/`longDescription`/`splitDescription`/
  `cleanDescription`/`abbreviate`).
- `IdeologyMatcherService`, `CountryMatcherService` e `PersonalityMatcherService` duplicam o
  mesmo padrão candidate → percentil → sort → map.
- Não há `@ControllerAdvice`/`@ExceptionHandler` global; o tratamento de erro depende de cada
  service lançar `ResponseStatusException` manualmente, sem corpo de erro padronizado.
- O `README.md` descreve um algoritmo MMR (`lambda = 0.70`) para diversificar os 4 matches de
  ideologia, mas o código implementado hoje é top-4 estrito por score bruto — a documentação
  não reflete o comportamento real.

## Decisão do usuário sobre a divergência MMR

Corrigir o `README.md` para descrever o comportamento real (top-4 por score bruto), em vez de
implementar MMR. Não introduzir um algoritmo novo sem necessidade funcional.

## Restrição de contrato

**Nenhuma mudança no contrato JSON público.** Os DTOs em `model/` (records) e os endpoints em
`QuizController`/`HealthController` mantêm assinatura e formato de resposta idênticos. O
frontend em produção não precisa de nenhuma alteração. Isso é um requisito duro, não uma
preferência.

## Escopo

Refatoração interna de arquitetura no backend, mais um exception handler global. Fora de
escopo: mudanças no frontend, na camada de dados (JSON), em observabilidade/Actuator, ou nova
lógica de negócio (MMR, novos endpoints, etc.).

## Arquitetura alvo

### Pacote `service.catalog` (novo)

Substitui a responsabilidade única hoje concentrada em `QuizDataService`:

- **`QuizCatalogRepository`** — carrega os JSONs (`@PostConstruct`), monta e expõe os
  `LocaleBundle` (PT/EN) e os mapas de perfis (ideologia/país/personalidade). Responsabilidade
  única: I/O de dados estáticos e acesso em memória. Não valida integridade nem traduz.
- **`EnglishBundleTranslator`** — extrai a lógica hoje em `buildEnglishBundle` e `readOverlay`
  (linhas 109–197 do `QuizDataService` atual). Recebe o bundle PT e os overlays
  `data/i18n/en/*.json`, devolve o bundle EN. Item sem tradução cai no texto PT (comportamento
  preservado).
- **`CatalogIntegrityValidator`** — as 4 validações hoje em `@PostConstruct`
  (`validateCountryProfiles`, `validateIdeologyProfiles`, `validateIdeologyPersonalityLinks`,
  `validatePersonalityProfiles`). Roda no boot; lança `IllegalStateException` nas mesmas
  condições de hoje (comportamento preservado — é uma falha de configuração de dados, não uma
  falha de runtime tratável).
- **`QuizDataService`** — passa a ser uma fachada fina que injeta os três componentes acima e
  mantém **exatamente os mesmos métodos públicos** já usados por `ScoringService`,
  `QuizController` e os matchers (`getQuiz`, `getAxes`, `getIdeologies`, `getCountryById`,
  `getIdeologyProfiles`, etc.), incluindo as constantes `SHORT_VARIANT`, `LANG_PT`, etc. e o
  método estático `normalizeLang`. Nenhum chamador fora deste pacote muda.

### Pacote `service.matching` (novo)

- **`ProfileMatchScorer`** — movido sem alteração de lógica (já está bem isolado: puro, sem
  I/O, com testes de regressão próprios).
- **`Ranker<T>`** — novo componente genérico. Recebe: lista de itens, função `T -> Map<String,
  Double>` (vetor-alvo), função `T -> String` (nome, para desempate), e o `ProfileMatchScorer`.
  Devolve uma lista ordenada de `RankedCandidate<T>` (item, compatibilidade, percentil),
  já ordenada por compatibilidade desc / nome asc. Encapsula o padrão hoje duplicado em
  `toCandidate` + `withPercentile` + `sorted(...)` nas três matcher services.
- **`IdeologyMatcherService`**, **`CountryMatcherService`**, **`PersonalityMatcherService`** —
  passam a usar `Ranker<T>` internamente. Mantêm as mesmas assinaturas públicas
  (`findMatches`, `findTopMatch`, `findRankedMatches`) usadas por `QuizController` e pelos
  testes existentes.
- **`IdeologyDescriptionFormatter`** — novo componente para `shortDescription`,
  `longDescription`, `splitDescription`, `cleanDescription`, `abbreviate` e o record
  `DescriptionParts` — hoje dentro de `IdeologyMatcherService`. `IdeologyMatcherService` passa
  a chamar esse formatter em vez de conter a lógica de parsing de texto.

### Pacote `web` (novo)

- **`GlobalExceptionHandler`** (`@RestControllerAdvice`) — dois handlers:
  - `ResponseStatusException` → `ProblemDetail` com o `status`/`reason` já usados hoje pelos
    services (mesmo texto de mensagem, só padronizando o envelope de resposta).
  - `Exception` (fallback) → `ProblemDetail` 500 genérico, sem vazar stacktrace/mensagem
    interna.
  - Os services continuam lançando `ResponseStatusException` exatamente como hoje; o handler
    só centraliza a tradução para corpo HTTP. Isso é uma mudança **aditiva** no corpo de erro
    (hoje o corpo de erro default do Spring Boot já é um JSON com `status`/`error`/`message` —
    trocar para `ProblemDetail` é uma padronização RFC 7807, não uma mudança de contrato de
    sucesso).

### O que não muda

- Nenhum record em `model/` é alterado.
- Nenhuma assinatura pública chamada por `QuizController` muda.
- Nenhum campo do JSON de resposta de sucesso muda.
- `ScoringService` permanece como está (já é uma classe coesa e testada).

## Testes

Novos testes unitários, seguindo o padrão JUnit 5 + AssertJ já usado no projeto:

- `CatalogIntegrityValidatorTest` — casos de perfil faltando e link ideologia→personalidade
  quebrado (hoje só coberto indiretamente pelo boot da aplicação).
- `RankerTest` — ordenação por compatibilidade, desempate por nome, cálculo de percentil.
- `IdeologyDescriptionFormatterTest` — descrição com e sem seção "Politicamente: | Economicamente: | Socialmente:", truncamento em `abbreviate`, remoção de "NOTA METODOLÓGICA".
- `GlobalExceptionHandlerTest` — via `MockMvc` ou `WebMvcTest`, verificando o corpo
  `ProblemDetail` em cenários 400 (payload inválido) e 404 (id inexistente).

Testes existentes (`ScoringServiceTest`, `ProfileMatchScorerTest`, `IdeologyMatcherServiceTest`,
`QuizFlowAutomationTest`, `RandomQuizSimulationTest`, `SharedResultsTest`,
`IdeologyCountryMappingTest`, `IdeologyPersonalityMappingTest`, `QuizLocalizationTest`,
`ScorerBenchmarkTest`) devem continuar passando sem modificação — são a rede de segurança que
comprova que o comportamento observável não mudou.

## Documentação

- Atualizar `README.md`, seção "Matching": remover a afirmação de que os 4 matches de
  ideologia usam MMR (`lambda = 0.70`); descrever o comportamento real (top-4 por score bruto
  desc, desempate por nome).
- Atualizar a árvore de `Estrutura do Repositório` no README para refletir os novos pacotes
  (`service/catalog`, `service/matching`, `web`).

## Critério de conclusão

- `mvn test` verde, incluindo os testes novos.
- `mvn package` gera o jar sem erros.
- Nenhuma mudança de payload observável via smoke test manual dos endpoints principais
  (`/api/quiz`, `/api/results`, `/api/ideologies`, `/api/countries`).
- README consistente com o comportamento real do código.
