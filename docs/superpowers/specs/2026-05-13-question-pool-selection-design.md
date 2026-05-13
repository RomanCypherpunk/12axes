# Design: Pool único de questões com seleção balanceada L/R

**Data:** 2026-05-13  
**Status:** Aprovado

---

## Contexto

Hoje o projeto mantém dois arquivos JSON estáticos pré-curados manualmente:
- `questions.json` — 36 questões fixas (3 por eixo)
- `questions-extended.json` — 60 questões fixas (5 por eixo)

O backend carrega ambos na inicialização e retorna o arquivo inteiro sem nenhuma lógica de seleção. O frontend recebe tudo e aplica um Fisher-Yates simples (`shuffleQuizQuestions`) sem qualquer balanceamento LEFT/RIGHT.

O novo arquivo `questions-extreme.json` contém 20 questões por eixo × 12 eixos = 240 questões, com `agreePole` explícito (`LEFT` ou `RIGHT`) em cada questão.

---

## Objetivo

1. Consolidar em **um único arquivo de pool** com 20 questões por eixo.
2. A cada quiz iniciado, selecionar aleatoriamente **3 questões por eixo** (quiz de 36) ou **5 por eixo** (quiz de 60).
3. Garantir **50% LEFT / 50% RIGHT** no total (18L+18R ou 30L+30R).
4. Apresentar as questões em **ordem globalmente embaralhada**, alternando polo (L, R, L, R…) para evitar viés de confirmação.

---

## Decisões de design

| Decisão | Escolha | Razão |
|---|---|---|
| Onde fica a lógica de seleção | Frontend (TypeScript) | O embaralhamento já vive no frontend; mudança mínima no backend |
| Seleção é aleatória? | Sim | Cada usuário vê uma combinação diferente |
| Balanceamento por eixo | Alternado por índice de eixo | Garante 50/50 global sem precisar de pós-ajuste |
| Ordem das questões | Intercalada globalmente L/R | Evita sequências do mesmo polo |

---

## Algoritmo de seleção (frontend)

```
selectAndBalanceQuestions(pool: Question[], questionsPerAxis: number): Question[]
```

**Passo 1 — Separar por eixo:**
Agrupa as 240 questões por `axisId` → 12 grupos de 20.

**Passo 2 — Selecionar por eixo com balanceamento:**
Para cada eixo no índice `i` (0–11):
- Embaralha separadamente o subpool LEFT e o subpool RIGHT do eixo
- Se `i` é par → pega `ceil(n/2)` LEFT + `floor(n/2)` RIGHT
- Se `i` é ímpar → pega `floor(n/2)` LEFT + `ceil(n/2)` RIGHT

Resultado para n=3: 6 eixos pares → 2L+1R, 6 eixos ímpares → 1L+2R → **18L + 18R** ✓  
Resultado para n=5: 6 eixos pares → 3L+2R, 6 eixos ímpares → 2L+3R → **30L + 30R** ✓

**Passo 3 — Intercalar globalmente:**
1. Junta todas as questões selecionadas (36 ou 60)
2. Separa em fila LEFT e fila RIGHT; embaralha cada fila
3. Monta sequência final alternando L/R (começo aleatório: 50% começa com L, 50% com R)
4. Se uma fila esgota antes da outra, drena o restante da outra fila

---

## Mudanças necessárias

### Backend

| Arquivo | Mudança |
|---|---|
| `data/questions-pool.json` | Arquivo novo (= `questions-extreme.json` renomeado/copiado) |
| `data/questions.json` | Removido |
| `data/questions-extended.json` | Removido |
| `QuizPayload.java` | Adiciona campo `int questionsPerAxis` |
| `QuizDataService.java` | Carrega `questions-pool.json` como lista única (`poolQuestions`); `getQuiz(variant)` preenche `questionsPerAxis` = 3 (short) ou 5 (extended); `questions` no payload recebe o pool completo |

O campo `totalQuestions` no payload passa a refletir o total esperado após seleção (36 ou 60), calculado como `questionsPerAxis * axes.size()`.

### Frontend

| Arquivo | Mudança |
|---|---|
| `quiz.ts` | Adiciona `questionsPerAxis: number` ao tipo `QuizPayload` |
| `App.tsx` | Substitui `shuffleQuizQuestions` por `selectAndBalanceQuestions`; remove `shuffleArray` genérico (ou mantém como utilitário interno) |

### Função nova em App.tsx

```typescript
function selectAndBalanceQuestions(payload: QuizPayload): QuizPayload {
  const { questions: pool, questionsPerAxis } = payload;

  // Passo 1: agrupar por eixo na ordem definida pelos axes
  const byAxis = new Map<string, Question[]>();
  for (const q of pool) {
    const group = byAxis.get(q.axisId) ?? [];
    group.push(q);
    byAxis.set(q.axisId, group);
  }

  // Passo 2: selecionar por eixo com balanceamento alternado
  const selected: Question[] = [];
  let axisIndex = 0;
  for (const questions of byAxis.values()) {
    const leftPool  = shuffleArray(questions.filter(q => q.agreePole === 'LEFT'));
    const rightPool = shuffleArray(questions.filter(q => q.agreePole === 'RIGHT'));
    const extraLeft = axisIndex % 2 === 0;
    const leftCount  = extraLeft ? Math.ceil(questionsPerAxis / 2) : Math.floor(questionsPerAxis / 2);
    const rightCount = questionsPerAxis - leftCount;
    selected.push(...leftPool.slice(0, leftCount), ...rightPool.slice(0, rightCount));
    axisIndex++;
  }

  // Passo 3: intercalar globalmente L/R
  const leftQueue  = shuffleArray(selected.filter(q => q.agreePole === 'LEFT'));
  const rightQueue = shuffleArray(selected.filter(q => q.agreePole === 'RIGHT'));
  const ordered: Question[] = [];
  let li = 0, ri = 0;
  let pickLeft = Math.random() < 0.5;
  for (let i = 0; i < selected.length; i++) {
    if (pickLeft && li < leftQueue.length)       ordered.push(leftQueue[li++]);
    else if (!pickLeft && ri < rightQueue.length) ordered.push(rightQueue[ri++]);
    else if (li < leftQueue.length)               ordered.push(leftQueue[li++]);
    else                                          ordered.push(rightQueue[ri++]);
    pickLeft = !pickLeft;
  }

  return { ...payload, questions: ordered };
}
```

---

## O que NÃO muda

- Estrutura do `Question` model (backend e frontend)
- Lógica de scoring no `ScoringService.java` — recebe as questões respondidas e pontua normalmente
- API de resultados (`POST /api/results`)
- Tipos de variante (`short` / `extended`)
- Todos os demais arquivos de dados (`axes.json`, `ideologies.json`, `ideology-profiles.json`)

---

## Critérios de sucesso

- Quiz de 36 sempre entrega exatamente 18 questões LEFT e 18 RIGHT
- Quiz de 60 sempre entrega exatamente 30 questões LEFT e 30 RIGHT
- Nenhum eixo é omitido (sempre `questionsPerAxis` questões por eixo)
- A ordem nunca apresenta 2 ou mais questões consecutivas do mesmo polo
- O resultado do scoring permanece correto após a mudança
