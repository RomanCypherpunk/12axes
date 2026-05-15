# 12 Axes

Aplicação full stack para um quiz político de 12 eixos ideológicos. O usuário escolhe entre quiz curto (`36` perguntas) e completo (`60` perguntas), responde em escala de 5 opções, recebe percentuais por eixo e vê a ideologia aproximada com maior compatibilidade.

O projeto usa backend Java/Spring Boot, frontend React/Vite, dados versionados em JSON e não depende de banco de dados.

---

## Resumo Técnico

| Área | Estado atual |
|---|---|
| Backend | Java 21, Spring Boot 3.3.5, Maven, API REST |
| Frontend | React 18, TypeScript, Vite 5, npm |
| Dados | `backend/src/main/resources/data/` |
| Perguntas | `240` no pool: 12 eixos, 20 por eixo, 10 `LEFT` e 10 `RIGHT` |
| Variantes | `short`: 36 perguntas, 3 por eixo; `extended`: 60 perguntas, 5 por eixo |
| Ideologias | 139 entradas em `ideologies.json` e 139 perfis em `ideology-profiles.json` |
| Testes | JUnit/Spring Boot/MockMvc no backend; Vitest no frontend |
| Deploy | Backend Render + Docker; frontend Vercel |

Funcionalidades principais: tela inicial com eixos, escolha de variante, seleção balanceada de perguntas, avanço automático, navegação para voltar, cálculo percentual dos 12 eixos, top match ideológico, outras 3 correspondências, descrições curta/detalhada e exportação PNG pelo botão `Compartilhar`.

---

## Eixos

| Eixo | Polo esquerdo | Polo direito |
|---|---|---|
| Estrutura | Federal | Unitário |
| Representação | Democracia | Autocracia |
| Poder | Segurança | Liberdade |
| Imigração | Assimilação | Multicultura |
| Diplomacia | Militarista | Pacifista |
| Intervenção | Não intervencionista | Nacionalista |
| Economia | Público | Privado |
| Controle | Planejamento | Livre mercado |
| Comércio | Protecionismo | Globalismo |
| Religião | Irreligioso | Religioso |
| Moral | Progressista | Tradicionalista |
| Tecnologia | Tecnologia | Biologia |

Fonte: `backend/src/main/resources/data/axes.json`.

---

## Arquitetura e Estrutura

Fluxo real: `React/Vite -> selectAndBalanceQuestions -> /api/results -> ScoringService -> IdeologyMatcherService -> resultado`.

Ponto importante: `/api/quiz` retorna o pool completo de 240 perguntas. A seleção de 36 ou 60 perguntas acontece no frontend em `frontend/src/utils/quizSelection.ts`.

```txt
12Axes/
|-- backend/
|   |-- Dockerfile
|   |-- pom.xml
|   `-- src/
|       |-- main/java/com/twelveaxes/{config,controller,model,service}/
|       |-- main/resources/application.properties
|       |-- main/resources/data/{axes.json,questions-pool.json,ideologies.json,ideology-profiles.json}
|       `-- test/java/com/twelveaxes/
|-- frontend/
|   |-- package.json
|   |-- vite.config.ts
|   |-- vercel.json
|   `-- src/{components,services,styles,types,utils}/
|-- data/{ideologias,img}/
|-- docs/
|-- render.yaml
`-- README.md
```

| Backend | Papel |
|---|---|
| `QuizController` | `/api/quiz`, `/api/results`, `/api/ideologies`, `/api/ideologies/{id}` |
| `HealthController` | `/api/health` |
| `CorsConfig` | CORS para `/api/**`, via `FRONTEND_ORIGINS` |
| `QuizDataService` | Carrega JSONs de eixos, perguntas, ideologias e perfis |
| `ScoringService` | Calcula percentuais, polo dominante e intensidade |
| `IdeologyMatcherService` | Calcula compatibilidade e retorna 4 matches |

| Frontend | Papel |
|---|---|
| `src/App.tsx` | Fluxo de telas, respostas, envio e resultado |
| `src/services/quizApi.ts` | Cliente HTTP da API |
| `src/utils/quizSelection.ts` | Seleção/balanceamento de perguntas |
| `src/components/QuestionCard.tsx` | Pergunta e respostas |
| `src/components/ProgressHeader.tsx` | Progresso |
| `src/components/AxisResultBar.tsx` | Barras dos eixos |
| `src/components/IdeologyMatchCard.tsx` | Cards de ideologia |
| `src/components/AxisIcon.tsx` | Ícones dos eixos |

---

## Dados, Seleção e Pontuação

Arquivos de dados:

| Arquivo | Conteúdo |
|---|---|
| `axes.json` | 12 eixos, polos e cores |
| `questions-pool.json` | 240 perguntas com `id`, `axisId`, `text`, `agreePole`, `weight` |
| `ideologies.json` | 139 ideologias com `id`, `name`, `category`, `description` |
| `ideology-profiles.json` | 139 vetores ideológicos; cada valor é o percentual esperado do polo esquerdo |

Seleção no frontend:

- `short`: seleciona 3 perguntas por eixo, total 36.
- `extended`: seleciona 5 perguntas por eixo, total 60.
- O algoritmo agrupa por eixo, separa `LEFT`/`RIGHT`, sorteia a quantidade necessária por polo, balanceia o total global e embaralha tentando evitar polos iguais consecutivos.
- Os testes Vitest conferem total por variante, quantidade por eixo, equilíbrio global e ausência de dois polos iguais consecutivos.

Escala de resposta:

| Resposta | Valor de concordância |
|---|---:|
| Concordo totalmente | 1.00 |
| Concordo | 0.75 |
| Neutro / Inseguro | 0.50 |
| Discordo | 0.25 |
| Discordo totalmente | 0.00 |

Se `agreePole=LEFT`, concordar aumenta `leftPercent`. Se `agreePole=RIGHT`, concordar aumenta `rightPercent` e reduz `leftPercent`. O backend retorna `leftPercent`, `rightPercent`, `dominantPole` e `intensity`.

Intensidade por distância do centro: `< 7.5` = `Equilibrado`; `< 22.5` = `Inclinado`; `< 37.5` = `Forte`; `>= 37.5` = `Muito forte`.

---

## Matching Ideológico

O usuário gera um vetor com 12 valores, sempre usando o percentual do polo esquerdo de cada eixo. O matcher compara esse vetor com `ideology-profiles.json`.

Modelo atual:

- Similaridade ponderada eixo a eixo.
- Penalidade quando usuário e ideologia ficam em lados opostos relevantes do eixo.
- RMSE ponderado com decaimento exponencial.
- `TOP_MATCHES = 4`.
- Todos os eixos pesam `1.0`, exceto `tecnologia`, com peso `0.75`.

Parâmetros:

```txt
AXIS_SIMILARITY_SPREAD = 50.0
DISTANCE_DECAY_SPREAD = 35.0
OPPOSITE_SIDE_FACTOR = 0.55
compatibility = 0.65 * weightedAxisSimilarity + 0.35 * distanceSimilarity
distanceSimilarity = 100 * exp(-pow(weightedRmse / 35.0, 1.8))
```

Se faltar perfil explícito, o código ainda tem fallback para vetor neutro, mas os testes garantem que as 139 ideologias atuais têm perfil.

---

## API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Retorna `{"status":"ok"}` |
| `GET` | `/api/quiz?variant=short` | Metadados do quiz curto + pool completo |
| `GET` | `/api/quiz?variant=extended` | Metadados do quiz completo + pool completo |
| `POST` | `/api/results` | Recebe respostas e retorna eixos + matches |
| `GET` | `/api/ideologies` | Lista ideologias |
| `GET` | `/api/ideologies/{id}` | Busca ideologia por ID |

Variantes aceitas: `short`, `curta`, `extended`, `extensa`.

`GET /api/quiz` retorna:

| Variante | `questionCount` | `questionsPerAxis` | `questions.length` |
|---|---:|---:|---:|
| `short` | 36 | 3 | 240 |
| `extended` | 60 | 5 | 240 |

Payload de resultado:

```json
{
  "variant": "short",
  "answers": [
    { "questionId": "estrutura_01", "answer": "AGREE" },
    { "questionId": "estrutura_02", "answer": "NEUTRAL" }
  ]
}
```

Resposta resumida:

```json
{
  "axes": [
    {
      "axisId": "estrutura",
      "label": "Estrutura",
      "leftPole": "Federal",
      "rightPole": "Unitário",
      "leftPercent": 62.5,
      "rightPercent": 37.5,
      "dominantPole": "Federal",
      "intensity": "Inclinado"
    }
  ],
  "topMatch": {
    "ideologyId": "centrismo",
    "name": "Centrismo",
    "category": "Centro",
    "description": "...",
    "longDescription": "...",
    "compatibility": 100.0
  },
  "matches": [
    {
      "ideologyId": "centrismo",
      "name": "Centrismo",
      "category": "Centro",
      "description": "...",
      "longDescription": "...",
      "compatibility": 100.0
    }
  ]
}
```

O backend valida se os `questionId` existem. A responsabilidade de enviar 36 ou 60 respostas completas é do frontend.

---

## Configuração e Execução Local

`backend/src/main/resources/application.properties`:

```properties
spring.application.name=12axes-backend
server.port=${PORT:8080}
app.frontend-origins=${FRONTEND_ORIGINS:http://localhost:5173,http://127.0.0.1:5173,https://12axes.vercel.app}
```

Pré-requisitos: Java 21+, Maven 3.9+, Node.js 20+ e npm.

Backend:

```bash
cd backend
mvn spring-boot:run
curl http://localhost:8080/api/health
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locais:

```txt
API:  http://localhost:8080
Site: http://localhost:5173
```

Em dev, `vite.config.ts` proxia `/api` para `http://localhost:8080`. Para mudar o alvo, crie `frontend/.env.local`:

```env
VITE_API_PROXY_TARGET=http://localhost:8080
```

Para build/deploy estático chamando API remota:

```env
VITE_API_URL=https://one2axes-backend.onrender.com
```

---

## Testes, Build e Simulações

| Objetivo | Comando |
|---|---|
| Testes backend | `cd backend && mvn test` |
| Build backend | `cd backend && mvn package -DskipTests` |
| Testes frontend | `cd frontend && npm test` |
| Build frontend | `cd frontend && npm run build` |

Saídas de build:

```txt
backend/target/backend-0.1.0.jar
frontend/dist/
```

Cobertura principal dos testes: integridade do pool, distribuição por eixo/polo, payloads `short`/`extended`, respostas neutras em 50%/50%, centrismo neutro, perfis canônicos, regressões de matching, endpoints via MockMvc e seleção balanceada no frontend.

Simulação no terminal com `RandomQuizSimulationTest`:

```bash
cd backend
mvn -Dtest=RandomQuizSimulationTest test
mvn -Dtest=RandomQuizSimulationTest '-Dquiz.variant=extended' test
mvn -Dtest=RandomQuizSimulationTest '-Dquiz.variant=extended' '-Dquiz.mode=traditional' test
mvn -Dtest=RandomQuizSimulationTest '-Dquiz.variant=extended' '-Dquiz.mode=left' '-Dquiz.seed=12345' test
```

Modos: `random`, `left`, `right`, `authoritarian`, `libertarian`, `progressive`, `traditional`.

Nos modos de perfil, quando a pergunta favorece o polo do perfil, a simulação sorteia entre `Neutro`, `Concordo` e `Concordo totalmente`; quando favorece o polo contrário, sorteia entre `Neutro`, `Discordo` e `Discordo totalmente`.

---

## Deploy

Backend Render:

| Campo | Valor |
|---|---|
| Arquivos | `render.yaml`, `backend/Dockerfile` |
| Serviço | `12axes-backend` |
| Runtime | Docker |
| Root directory | `backend` |
| Plano | Free |
| Health check | `/api/health` |
| Env | `FRONTEND_ORIGINS=http://localhost:5173,https://12axes.vercel.app` |
| URL documentada | `https://one2axes-backend.onrender.com` |

Frontend Vercel:

| Campo | Valor |
|---|---|
| Arquivo | `frontend/vercel.json` |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Env | `VITE_API_URL=https://one2axes-backend.onrender.com` |
| URL documentada | `https://12axes.vercel.app` |

Mais detalhes: `docs/deployment.md`.

---

## Uso Manual

1. Suba backend e frontend.
2. Acesse `http://localhost:5173`.
3. Clique em `Começar Quiz`.
4. Escolha `Curta` ou `Completo`.
5. Responda as perguntas.
6. Confira ideologia, compatibilidade e eixos.
7. Use `Compartilhar` para baixar o PNG.
8. Refaça o quiz com outra variante ou perfil de respostas.

---

## Autor

**Enzo Xavier Santos**

Projeto desenvolvido para portfólio e estudo de arquitetura full stack com Java, React e deploy em cloud.
