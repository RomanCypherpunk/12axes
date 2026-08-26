# 12eixos Eleições 2026 — Design

**Data:** 2026-08-26
**Status:** aprovado, pronto para plano de implementação

## Objetivo

Seção separada do 12axes dedicada às eleições presidenciais brasileiras de 2026:
home própria, quiz de 36 perguntas sobre o debate político brasileiro atual e
página de resultado que mostra o candidato mais compatível com o usuário.

Fluxo: `/eleicoes2026` (home) → quiz de 36 perguntas → `/eleicoes2026/resultado`.

Diferença central em relação ao quiz principal: o resultado **não** mostra
ideologia, país nem personalidade. Mostra o candidato mais compatível, os 12
eixos do usuário e os 3 candidatos seguintes por compatibilidade.

## Decisões

| Tema | Decisão |
|------|---------|
| Dados | Catálogo novo no backend, isolado do quiz principal |
| Rotas | Rota `/eleicoes2026` na mesma SPA e mesmo deploy |
| Idioma | Somente PT-BR (eleição brasileira, público brasileiro) |
| Candidatos | 9 nomes definidos pelo usuário |
| Vetores | Auditoria das 36 perguntas eleitorais (não das 240) |
| Resolução | 36 perguntas, 3 por eixo — aceita como está |
| Resultado | Candidato principal + % compatibilidade + 12 eixos + top 3 |
| Compartilhamento | PNG + link recalculável, como no quiz atual |
| Retratos | Fornecidos pelo usuário, comprimidos pelo pipeline existente |

## Backend

### Dados

```
backend/src/main/resources/data/
  election-questions.json     36 perguntas, 3 por eixo, schema de Question
  candidates.json             9 candidatos com metadados eleitorais
  candidate-profiles.json     9 vetores de 12 eixos, schema de PersonalityProfile
```

`candidates.json` estende o schema de `personalities.json` com campos eleitorais:
`party`, `partyName`, `ballotNumber`, `runningMate`, `active`.

O campo `active` permite retirar um candidato do quiz sem remover o registro,
caso uma candidatura caia (Marçal está registrado mas inelegível).

### Serviços

- `CandidateMatcherService` — espelha `PersonalityMatcherService`, com
  `TOP_MATCHES = 4` (principal + 3 seguintes).
- `ProfileMatchScorer` e `ScoringService` reusados **sem alteração**, para que o
  match eleitoral seja consistente com o resto do site.
- `QuizDataService` carrega os 3 JSONs novos e valida no startup que todo
  candidato ativo tem perfil explícito, como já faz para personalities.

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/election/quiz` | 36 perguntas eleitorais |
| `POST` | `/api/election/results` | 12 eixos + top-4 candidatos |
| `GET` | `/api/election/results/by-axes?v=...` | recálculo para link compartilhável |
| `GET` | `/api/election/candidates` | catálogo, para a home |

Nenhum endpoint existente é alterado. `ElectionResult` é um record próprio com
`axes` + `List<CandidateMatch>`, sem ideologia/país/personalidade.

## As 36 perguntas

3 por eixo, alternando `agreePole` para evitar viés de aquiescência, no formato
de afirmação já usado em `questions-pool.json`.

Temas ancorados no debate real de 2026:

- **Poder/Segurança** — PEC da Segurança Pública, autonomia das polícias, excludente de ilicitude
- **Economia** — isenção do IR até R$ 5 mil, privatização de estatais, arcabouço fiscal
- **Moral** — aborto, descriminalização das drogas, pautas de costumes
- **Religião** — laicidade do Estado, bancada evangélica
- **Comércio** — tarifas dos EUA, acordo Mercosul-UE, soberania comercial
- **Intervenção** — soberania nacional vs. alinhamento a Washington, sanções externas
- **Representação** — anistia ao 8 de janeiro, poderes do STF, voto distrital

**Cuidado editorial:** perguntas eleitorais são mais carregadas que as do quiz
genérico. Redação neutra e descritiva, sem termos de campanha, para que o
instrumento não empurre o usuário a um candidato.

## Candidatos

| id | Nome | Partido | Nº | Vice |
|----|------|---------|-----|------|
| `lula` | Luiz Inácio Lula da Silva | PT | 13 | Geraldo Alckmin (PSB) |
| `flavio-bolsonaro` | Flávio Bolsonaro | PL | 22 | Alfredo Gaspar |
| `ronaldo-caiado` | Ronaldo Caiado | PSD | 55 | Gilberto Kassab |
| `romeu-zema` | Romeu Zema | Novo | 30 | Eduardo Girão |
| `renan-santos` | Renan Santos | Missão | 14 | Coronel Medina |
| `augusto-cury` | Augusto Cury | Avante | 70 | Júlio Delgado |
| `samara-martins` | Samara Martins | UP | 80 | Raquel Bricio |
| `rui-costa-pimenta` | Rui Costa Pimenta | PCO | 29 | Antônio Carlos |

Dados conferidos em duas fontes independentes (Wikipédia e Gazeta do Povo), que
coincidem em partido e número de urna.

Fora do escopo por decisão do usuário: Clariana Barão (DC), Hertz Dias (PSTU),
Edmilson Costa (PCB), Wilson Grassi (Democrata).

### Auditoria dos vetores

Cada candidato responde **as 36 perguntas eleitorais**, seguindo o protocolo
pergunta-a-pergunta de `profile-audit/README.md`. Cada resposta é justificada
por evidência: plano de governo registrado no TSE, votos no Congresso,
declarações públicas.

Lula, Flávio Bolsonaro e Caiado já têm vetor no catálogo `personality`; ele
serve como referência de sanidade, mas o vetor eleitoral vem da auditoria das
36 para todos, mantendo o instrumento uniforme.

Total: 9 × 36 = 324 respostas justificadas. É a parte mais longa do trabalho e
a que mais determina a qualidade do resultado.

## Frontend

Rota `/eleicoes2026` na mesma SPA. `App.tsx` já lê `window.location.pathname`
para decidir modo; essa lógica é extraída para um roteador leve em vez de
empilhar mais condicionais — o arquivo está em 1154 linhas e embutir um quiz
inteiro nele o tornaria difícil de manter.

```
frontend/src/election/
  ElectionApp.tsx        home + quiz + resultado
  ElectionHome.tsx       hero, grade dos 9 candidatos, CTA
  ElectionResult.tsx     candidato principal + 12 eixos + top 3
  CandidateCard.tsx      foto, nome, partido, número, % compatibilidade
  electionApi.ts
frontend/public/candidates/portraits/*.jpg
```

Reusa `QuestionCard`, `AxisResultBar`, `ProgressHeader`, `shareCard.ts` e os
tokens de estilo, sem duplicar layout.

### Resultado

1. Card grande do candidato mais compatível, com foto, partido, número e % de compatibilidade
2. As 12 barras de eixo do usuário
3. Os 3 candidatos seguintes em cards menores, cada um com seu %

Sem ideologia, sem país, sem personalidade.

### Compartilhamento

PNG via `shareCard.ts` e link `/eleicoes2026/resultado?est=..&rep=..`, com os 12
valores na URL recalculados pelo backend — mesmo padrão de `/results`.

## Retratos

9 arquivos em `frontend/public/candidates/portraits/`, baixados dos links
fornecidos pelo usuário e comprimidos com `scripts/optimize-images.mjs`
(480px, JPEG q78 mozjpeg). Resultado: 4,9MB → 0,2MB, 11–30KB por arquivo,
dentro da faixa do catálogo existente.

`imageSourceName` e `imageSourceUrl` derivados do link de origem, como no
catálogo de personalidades.

**Nota de licença:** apenas Lula e Renan Santos vêm do Wikimedia (licença
livre). As outras 7 são de veículos comerciais — uso editorial num quiz
educativo, com crédito registrado. Difere do catálogo atual, majoritariamente
Wikimedia.

## Testes

- Backend: validação de startup (todo candidato ativo tem perfil), vetores usam
  os 12 eixos conhecidos, 36 perguntas com 3 por eixo, endpoints respondem,
  `by-axes` valida o intervalo 0–100.
- Frontend: seleção das 36 perguntas, roteamento `/eleicoes2026`, existência dos
  9 retratos em `public/`.

Segue o padrão de testes já existente para os catálogos atuais.

## Riscos

1. **Prazo de validade** — candidaturas ainda podem cair. O campo `active`
   resolve sem refatoração.
2. **Resolução do vetor** — 3 perguntas por eixo dão ~13 posições distintas.
   Aceito: é a mesma densidade da versão curta atual.
3. **Neutralidade** — o maior risco do projeto. Mitigado por redação descritiva
   e auditoria baseada em evidência documental, não em impressão.
