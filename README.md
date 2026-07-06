# 12 Axes - Quiz Político de 12 Eixos

> Aplicação full stack que estima a posição política do usuário em **12 eixos independentes** e compara o resultado com **ideologias, países/experiências históricas e personalidades políticas**.

**Demo:** [12axes.vercel.app](https://12axes.vercel.app) | **API:** [one2axes-backend.onrender.com/api/health](https://one2axes-backend.onrender.com/api/health)

---

## Visão Geral

O 12 Axes é um quiz político educativo, anônimo e sem cadastro. O usuário responde afirmações em escala de concordância, recebe percentuais por eixo e visualiza como suas posições se distribuem entre polos como democracia/autocracia, público/privado, planejamento/livre mercado e progressismo/tradição.

Para recrutadores, o projeto mostra uma aplicação web completa: React/TypeScript, Java/Spring Boot, API REST, JSON versionado, algoritmo próprio, testes e deploy em cloud. Para entusiastas de política, funciona como leitura comparativa, não como diagnóstico científico.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | Java 21, Spring Boot 3.3.5, Maven |
| Frontend | React 18, TypeScript, Vite 5 |
| Exportação | `html-to-image` para gerar PNG do resultado |
| Dados | JSON estático versionado no repositório |
| Testes | JUnit 5, MockMvc, AssertJ, Vitest |
| Deploy | Backend no Render via Docker, frontend na Vercel |

Não há banco de dados. Os JSONs são carregados na inicialização do backend e o cálculo é feito em memória a cada requisição.

---

## O Que o Projeto Faz

1. Apresenta uma home com explicação dos 12 eixos, FAQ e seleção de formato.
2. Oferece três versões: **curta** (36 perguntas), **completa** (60 perguntas) e **extrema** (240 perguntas).
3. Busca no backend o pool completo de perguntas e balanceia a seleção no frontend.
4. Registra respostas em 5 pontos, com avanço automático e opção de voltar.
5. Calcula percentuais por eixo, intensidade, ideologias compatíveis, país e personalidade mais próximos.
6. Exibe barras por eixo, cards de compatibilidade e um PNG compartilhável.

---

## Os 12 Eixos

| Eixo | Polo Esquerdo | Polo Direito |
|------|---------------|--------------|
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

Cada eixo é independente. O resultado não reduz o usuário a esquerda/direita: ele mostra combinações, tensões e aproximações entre dimensões políticas diferentes.

---

## Dados do Projeto

| Arquivo | Conteúdo |
|---------|----------|
| `axes.json` | 12 eixos com polos, cores e labels |
| `questions-pool.json` | 240 perguntas: 20 por eixo, 10 por polo |
| `ideologies.json` | Ideologias, categoria, descrição e links internos |
| `ideology-profiles.json` |  Vetores ideológicos de 12 dimensões |
| `countries.json` |  Países, regiões e experiências históricas |
| `countries-profiles.json` |  Vetores de países/experiências |
| `personalities.json` |  Personalidades políticas e intelectuais |
| `personality-profiles.json` | Vetores de personalidade |
| `frontend/public/countries/flags` | Bandeiras e símbolos históricos |
| `frontend/public/personalities/portraits` | Retratos usados nos cards |

O backend valida na inicialização se ideologias, países e personalidades possuem perfis explícitos. Os testes também verificam se vetores usam os 12 eixos conhecidos e se assets públicos existem.

---

## Arquitetura

```txt
React/Vite
  -> GET /api/quiz
  -> selectAndBalanceQuestions() ou selectAllQuestionsBalanced()
  -> POST /api/results
  -> ScoringService
  -> ProfileMatchScorer
  -> IdeologyMatcherService / CountryMatcherService / PersonalityMatcherService
  -> JSON response
  -> tela de resultado + PNG compartilhável
```

**Ponto-chave:** `GET /api/quiz` sempre retorna o pool completo de 240 perguntas. A versão curta e a completa são montadas no frontend a partir desse pool, mantendo distribuição por eixo e alternância de polos. A versão extrema usa todas as perguntas.

---

## Pontuação

| Resposta | Valor de concordância |
|----------|----------------------:|
| Concordo totalmente | 1.00 |
| Concordo | 0.75 |
| Neutro ou Depende | 0.50 |
| Discordo | 0.25 |
| Discordo totalmente | 0.00 |

Cada pergunta declara qual polo é favorecido pela concordância (`LEFT` ou `RIGHT`). O backend converte as respostas em percentual do polo esquerdo por eixo, arredonda em uma casa decimal e deriva o percentual do polo direito.

Intensidade pelo desvio em relação ao centro:

| Desvio do centro | Intensidade |
|------------------|-------------|
| `< 7.5%` | Equilibrado |
| `< 22.5%` | Inclinado |
| `< 37.5%` | Forte |
| `>= 37.5%` | Muito forte |

---

## Matching

O resultado vira um vetor de 12 valores, de `0` a `100`, que representa o percentual do polo esquerdo em cada eixo. Esse vetor é comparado com perfis de ideologias, países e personalidades.

O score combina:

- Similaridade eixo a eixo com curva quadrática e `spread = 50`.
- Penalidade para lados opostos relevantes (`factor = 0.55`).
- RMSE ponderado com decaimento exponencial (`spread = 35`).
- Fórmula final: `0.65 * weightedAxisSimilarity + 0.35 * distanceSimilarity`.
- Todos os 12 eixos têm peso `1.0` no scorer atual.

O backend retorna as 4 ideologias mais compatíveis, o país/experiência histórica mais próximo e a personalidade mais próxima.

---

## API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check: `{"status":"ok"}` |
| `GET` | `/api/quiz?variant=short` | Metadados da versão curta e pool de 240 perguntas |
| `GET` | `/api/quiz?variant=extended` | Metadados da versão completa e pool de 240 perguntas |
| `GET` | `/api/quiz?variant=extreme` | Metadados da versão extrema e pool de 240 perguntas |
| `POST` | `/api/results` | Calcula eixos, ideologias, país e personalidade |
| `GET` | `/api/ideologies` | Lista ideologias |
| `GET` | `/api/ideologies/{id}` | Detalha uma ideologia |
| `GET` | `/api/countries` | Lista países e experiências históricas |
| `GET` | `/api/countries/{id}` | Detalha país ou experiência histórica |

Variantes aceitas: `short`, `curta`, `extended`, `extensa`, `extreme`, `extrema`, `240`, `240questions`.

### Payload de Resultado

```json
{
  "variant": "short",
  "answers": [
    { "questionId": "estrutura_01", "answer": "STRONGLY_AGREE" },
    { "questionId": "poder_03", "answer": "DISAGREE" }
  ]
}
```

Valores de `answer`: `STRONGLY_AGREE`, `AGREE`, `NEUTRAL`, `DISAGREE`, `STRONGLY_DISAGREE`.

### Resposta Resumida

`POST /api/results` retorna `axes`, `topMatch`, `matches`, `topCountryMatch` e `topPersonalityMatch`. Cada eixo inclui percentuais dos dois polos, polo dominante e intensidade; cada match inclui nome, categoria/metadados e compatibilidade.

---

## Estrutura do Repositório

```txt
12Axes/
|-- backend/
|   |-- Dockerfile
|   |-- pom.xml
|   `-- src/
|       |-- main/java/com/twelveaxes/
|       |   |-- config/        # CORS
|       |   |-- controller/    # HealthController, QuizController
|       |   |-- model/         # records e DTOs
|       |   `-- service/       # dados, scoring e matchers
|       |-- main/resources/
|       |   |-- application.properties
|       |   `-- data/          # eixos, perguntas, perfis e catálogos
|       `-- test/              # JUnit, MockMvc e regressões de matching
|-- frontend/
|   |-- public/                # logo, favicons, bandeiras e retratos
|   |-- src/
|   |   |-- components/        # cards, barras, perguntas e progresso
|   |   |-- data/              # eixos da home
|   |   |-- services/          # cliente HTTP
|   |   |-- styles/            # tokens e CSS principal
|   |   |-- types/             # tipos TypeScript
|   |   `-- utils/             # seleção, imagens e exportação PNG
|   |-- package.json
|   `-- vercel.json
|-- docs/
|-- render.yaml
`-- README.md
```

---

## Como Executar Localmente

Pré-requisitos: Java 21+, Maven 3.9+, Node.js 20+ e npm.

### Backend

```bash
cd backend
mvn spring-boot:run
```

```bash
curl http://localhost:8080/api/health
# {"status":"ok"}
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Em desenvolvimento, o Vite proxia `/api` para `http://localhost:8080`.

### Variáveis de Ambiente

| Variável | Lado | Padrão | Uso |
|----------|------|--------|-----|
| `PORT` | Backend | `8080` | Porta HTTP |
| `FRONTEND_ORIGINS` | Backend | localhost + Vercel | Origens CORS |
| `VITE_API_PROXY_TARGET` | Frontend dev | `http://localhost:8080` | Proxy local |
| `VITE_API_URL` | Frontend prod | vazio | URL base da API |

Para usar a API publicada no frontend local:

```env
VITE_API_URL=https://one2axes-backend.onrender.com
```

---

## Testes

```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm test

# Builds
cd backend && mvn package -DskipTests
cd frontend && npm run build
```

Cobertura principal:

- Pool: 240 perguntas, 12 eixos, 20 por eixo e 10 por polo.
- Variantes curta, completa e extrema.
- Respostas neutras produzindo centro e match de centrismo.
- Perfis explícitos para ideologias, países e personalidades.
- Vetores com exatamente os 12 eixos conhecidos e valores entre 0 e 100.
- Endpoints REST, payloads e IDs de pergunta inválidos.
- Seleção frontend sem perder perguntas e alternando polos.
- Assets de bandeiras e retratos existentes em `frontend/public`.

### Simulação de Perfis

```bash
cd backend

mvn -Dtest=RandomQuizSimulationTest test
mvn -Dtest=RandomQuizSimulationTest "-Dquiz.variant=extended" "-Dquiz.mode=left" test
mvn -Dtest=RandomQuizSimulationTest "-Dquiz.variant=extended" "-Dquiz.mode=traditional" "-Dquiz.seed=42" test
```

Modos: `random`, `left`, `right`, `authoritarian`, `libertarian`, `progressive`, `traditional`.

---

## Deploy

| Parte | Plataforma | Configuração |
|-------|------------|--------------|
| Backend | Render | `render.yaml` + `backend/Dockerfile` |
| Frontend | Vercel | `frontend/vercel.json`, build `npm run build`, output `dist` |

Variáveis usadas em produção:

```env
# Render
FRONTEND_ORIGINS=https://12axes.vercel.app

# Vercel
VITE_API_URL=https://one2axes-backend.onrender.com
```

O Render usa `/api/health` como health check. Mais detalhes ficam em `docs/deployment.md`.

---

## Nota Metodológica

O 12 Axes é uma ferramenta de exploração política. A compatibilidade indica proximidade entre respostas e perfis cadastrados, não filiação, recomendação de voto ou avaliação moral. Os perfis e descrições são modelos simplificados para comparação entre correntes, regimes, experiências históricas e figuras públicas.

---

## Autor

**Enzo Xavier Santos** - projeto desenvolvido para portfólio e estudo prático de arquitetura full stack com Java, React, TypeScript, testes automatizados e deploy em cloud.
