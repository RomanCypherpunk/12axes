# 12 Axes — Quiz Político de 12 Eixos Ideológicos

> Aplicação full stack que mapeia a posição política do usuário em **12 eixos independentes** e retorna as **4 ideologias mais compatíveis** com o seu perfil.

**Demo:** [12axes.vercel.app](https://12axes.vercel.app) · **API:** [one2axes-backend.onrender.com/api/health](https://one2axes-backend.onrender.com/api/health)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 · Spring Boot 3.3.5 · Maven |
| Frontend | React 18 · TypeScript · Vite 5 |
| Dados | JSON estático versionado no repositório |
| Testes | JUnit 5 · MockMvc (backend) · Vitest (frontend) |
| Deploy | Backend → Render (Docker) · Frontend → Vercel |

Sem banco de dados. Os dados estruturais são arquivos JSON carregados na inicialização. Todo o processamento ocorre em memória durante a requisição.

---

## O que o projeto faz

1. Exibe os 12 eixos ideológicos na tela inicial para o usuário entender o escopo do quiz.
2. Seleciona perguntas de forma balanceada: **`short`** (36 perguntas, 3/eixo) ou **`extended`** (60 perguntas, 5/eixo).
3. Apresenta cada pergunta com avanço automático em escala de 5 pontos; permite voltar.
4. Envia as respostas ao backend, que calcula os percentuais de cada polo por eixo.
5. Retorna o resultado com barras de eixo, polo dominante, intensidade e top 4 ideologias por compatibilidade.
6. Exporta o resultado como imagem PNG pelo botão **Compartilhar**.

---

## Os 12 Eixos

| Eixo | Polo Esquerdo | Polo Direito |
|------|--------------|-------------|
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

---

## Arquitetura

```
React/Vite ──→  selectAndBalanceQuestions()  ──→  POST /api/results
                       (frontend)                        │
                                             ScoringService (backend)
                                                          │
                                           IdeologyMatcherService
                                                          │
                                                   JSON response
```

**Ponto-chave:** `GET /api/quiz` retorna o pool completo de 240 perguntas. A seleção e o balanceamento de 36 ou 60 questões ocorrem **no frontend** (`quizSelection.ts`). O backend recebe somente as respostas selecionadas, calcula os percentuais e devolve os matches.

### Base de dados

| Arquivo | Conteúdo |
|---------|---------|
| `axes.json` | 12 eixos com polos, labels e cores |
| `questions-pool.json` | 240 perguntas — 12 eixos × 20, sendo 10 `LEFT` e 10 `RIGHT` por eixo |
| `ideologies.json` | 139 ideologias com nome, categoria, descrição curta e longa |
| `ideology-profiles.json` | 139 vetores de perfil — percentual esperado do polo esquerdo em cada eixo |

### Algoritmo de matching

Cada resposta gera um vetor de 12 valores (percentual do polo esquerdo por eixo). Esse vetor é comparado com os 139 perfis usando:

- Similaridade ponderada eixo a eixo com decaimento gaussiano (`spread = 50`).
- Penalidade quando usuário e ideologia ficam em lados opostos relevantes (`factor = 0.55`).
- RMSE ponderado com decaimento exponencial (`spread = 35`).
- Score final: `0.65 × weightedAxisSimilarity + 0.35 × distanceSimilarity`.
- Eixo *Tecnologia* tem peso `0.75`; todos os demais, `1.0`.

### Pontuação

| Resposta | Valor |
|----------|------:|
| Concordo totalmente | 1.00 |
| Concordo | 0.75 |
| Neutro / Inseguro | 0.50 |
| Discordo | 0.25 |
| Discordo totalmente | 0.00 |

Intensidade pelo desvio do centro: `< 7.5 %` → Equilibrado · `< 22.5 %` → Inclinado · `< 37.5 %` → Forte · `≥ 37.5 %` → Muito forte.

---

## Estrutura do Repositório

```
12Axes/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/twelveaxes/
│       │   ├── config/        # CorsConfig
│       │   ├── controller/    # QuizController, HealthController
│       │   ├── model/         # DTOs e tipos de domínio
│       │   └── service/       # QuizDataService, ScoringService, IdeologyMatcherService
│       ├── main/resources/
│       │   ├── application.properties
│       │   └── data/          # axes.json, questions-pool.json, ideologies.json, ideology-profiles.json
│       └── test/              # JUnit, MockMvc, RandomQuizSimulationTest
├── frontend/
│   └── src/
│       ├── components/        # QuestionCard, ProgressHeader, AxisResultBar, IdeologyMatchCard, AxisIcon
│       ├── services/          # quizApi.ts — cliente HTTP
│       ├── utils/             # quizSelection.ts — seleção e balanceamento
│       ├── types/
│       └── App.tsx            # Máquina de estados da tela
├── data/                      # Arquivos auxiliares (imagens, ideologias extra)
├── docs/
├── render.yaml
└── README.md
```

---

## Como Executar Localmente

**Pré-requisitos:** Java 21+, Maven 3.9+, Node.js 20+, npm.

### Backend

```bash
cd backend
mvn spring-boot:run
```

```bash
# Verificar
curl http://localhost:8080/api/health
# {"status":"ok"}
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Em modo de desenvolvimento, o Vite proxia `/api` automaticamente para `http://localhost:8080` — sem configuração extra.

### Variáveis de Ambiente

| Variável | Lado | Padrão | Descrição |
|----------|------|--------|-----------|
| `PORT` | Backend | `8080` | Porta do servidor |
| `FRONTEND_ORIGINS` | Backend | `http://localhost:5173,...` | Origens CORS permitidas |
| `VITE_API_PROXY_TARGET` | Frontend dev | `http://localhost:8080` | Alvo do proxy Vite |
| `VITE_API_URL` | Frontend prod | — | URL base da API em produção |

Para apontar o frontend local para a API de produção, crie `frontend/.env.local`:

```env
VITE_API_URL=https://one2axes-backend.onrender.com
```

---

## API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check — `{"status":"ok"}` |
| `GET` | `/api/quiz?variant=short` | Pool de 240 perguntas + metadados da variante curta |
| `GET` | `/api/quiz?variant=extended` | Pool de 240 perguntas + metadados da variante completa |
| `POST` | `/api/results` | Recebe respostas, retorna eixos calculados + top 4 matches |
| `GET` | `/api/ideologies` | Lista as 139 ideologias |
| `GET` | `/api/ideologies/{id}` | Detalhe de uma ideologia |

Variantes aceitas: `short`, `curta`, `extended`, `extensa`.

### Payload — `POST /api/results`

```json
{
  "variant": "short",
  "answers": [
    { "questionId": "estrutura_01", "answer": "STRONGLY_AGREE" },
    { "questionId": "poder_03",     "answer": "DISAGREE" }
  ]
}
```

Valores de `answer`: `STRONGLY_AGREE` · `AGREE` · `NEUTRAL` · `DISAGREE` · `STRONGLY_DISAGREE`.

### Resposta (resumida)

```json
{
  "axes": [
    {
      "axisId": "estrutura",
      "label": "Estrutura",
      "leftPole": "Federal",
      "rightPole": "Unitário",
      "leftPercent": 75.0,
      "rightPercent": 25.0,
      "dominantPole": "Federal",
      "intensity": "Forte"
    }
  ],
  "topMatch": {
    "ideologyId": "federalismo",
    "name": "Federalismo",
    "compatibility": 91.4
  },
  "matches": [ ... ]
}
```

---

## Testes

```bash
# Backend (JUnit + MockMvc)
cd backend && mvn test

# Frontend (Vitest)
cd frontend && npm test

# Build completo sem testes
cd backend && mvn package -DskipTests
cd frontend && npm run build
```

**Cobertura principal:**

- **Pool:** 240 perguntas, 12 eixos, 20/eixo, equilíbrio LEFT/RIGHT.
- **Seleção:** totais corretos por variante, balanceamento global, ausência de polos iguais consecutivos.
- **Scoring:** respostas neutras → 50 %/50 %; centrismo com respostas equilibradas → match ≈ 100 %.
- **Perfis:** os 139 têm vetor explícito em `ideology-profiles.json`; testes de regressão de matching.
- **Endpoints:** status HTTP, estrutura de payload, validação de `questionId` desconhecido.

### Simulação de perfis no terminal

```bash
cd backend

# Perfil aleatório, variante curta
mvn -Dtest=RandomQuizSimulationTest test

# Perfil de esquerda, variante completa
mvn -Dtest=RandomQuizSimulationTest '-Dquiz.variant=extended' '-Dquiz.mode=left' test

# Perfil tradicional com seed fixo (resultado reprodutível)
mvn -Dtest=RandomQuizSimulationTest '-Dquiz.variant=extended' '-Dquiz.mode=traditional' '-Dquiz.seed=42' test
```

Modos: `random` · `left` · `right` · `authoritarian` · `libertarian` · `progressive` · `traditional`.

---

## Deploy

| Serviço | Plataforma | Arquivo de configuração |
|---------|-----------|------------------------|
| Backend | Render — Docker, free tier | `render.yaml` + `backend/Dockerfile` |
| Frontend | Vercel — Vite, output `dist` | `frontend/vercel.json` |

**Variáveis de produção:**

```
# Render
FRONTEND_ORIGINS=https://12axes.vercel.app

# Vercel
VITE_API_URL=https://one2axes-backend.onrender.com
```

Health check configurado em `/api/health`. Mais detalhes em `docs/deployment.md`.

---

## Autor

**Enzo Xavier Santos** — projeto desenvolvido para portfólio e estudo de arquitetura full stack com Java, React e deploy em cloud.
