# Question Pool Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir dois arquivos de questões estáticos por um único pool de 240 questões, com seleção aleatória balanceada 50% LEFT / 50% RIGHT e ordem intercalada por polo.

**Architecture:** O backend passa a carregar um único `questions-pool.json` e expõe o campo `questionsPerAxis` no payload. O frontend substitui o Fisher-Yates simples por `selectAndBalanceQuestions`, extraído em `utils/quizSelection.ts` para permitir testes unitários com Vitest.

**Tech Stack:** Java 17 + Spring Boot (backend), React 18 + TypeScript + Vite + Vitest (frontend)

---

## Mapa de arquivos

| Arquivo | Ação |
|---|---|
| `backend/src/main/resources/data/questions-pool.json` | Criar (copiar de Downloads) |
| `backend/src/main/resources/data/questions.json` | Deletar |
| `backend/src/main/resources/data/questions-extended.json` | Deletar |
| `backend/src/main/java/com/twelveaxes/model/QuizPayload.java` | Modificar — adicionar `questionsPerAxis` |
| `backend/src/main/java/com/twelveaxes/service/QuizDataService.java` | Modificar — carregar pool único |
| `backend/src/test/java/com/twelveaxes/ScoringServiceTest.java` | Modificar — atualizar testes quebrados |
| `frontend/package.json` | Modificar — adicionar Vitest |
| `frontend/vite.config.ts` | Modificar — adicionar bloco `test` |
| `frontend/src/utils/quizSelection.ts` | Criar — algoritmo de seleção |
| `frontend/src/utils/quizSelection.test.ts` | Criar — testes unitários |
| `frontend/src/types/quiz.ts` | Modificar — adicionar `questionsPerAxis` |
| `frontend/src/App.tsx` | Modificar — usar `selectAndBalanceQuestions` |

---

## Task 1: Adicionar questions-pool.json ao backend

**Files:**
- Create: `backend/src/main/resources/data/questions-pool.json`

- [ ] **Step 1: Copiar o arquivo pool para o backend**

No terminal (PowerShell):
```powershell
Copy-Item "$env:USERPROFILE\Downloads\questions-extreme.json" `
  "C:\Users\gasometro\Documents\12Axes\backend\src\main\resources\data\questions-pool.json"
```

- [ ] **Step 2: Verificar contagem de questões**

```powershell
$pool = Get-Content "C:\Users\gasometro\Documents\12Axes\backend\src\main\resources\data\questions-pool.json" | ConvertFrom-Json
Write-Host "Total de questões: $($pool.Count)"
$byAxis = $pool | Group-Object axisId
Write-Host "Eixos encontrados: $($byAxis.Count)"
$byAxis | ForEach-Object { Write-Host "$($_.Name): $($_.Count) questões" }
```

Saída esperada: 240 questões, 12 eixos, 20 por eixo.

- [ ] **Step 3: Commit**

```bash
git add backend/src/main/resources/data/questions-pool.json
git commit -m "data: add questions-pool.json with 240 questions across 12 axes"
```

---

## Task 2: Configurar Vitest no frontend

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/vite.config.ts`
- Create: `frontend/src/utils/quizSelection.test.ts` (sanity check)

- [ ] **Step 1: Instalar Vitest**

```bash
cd frontend
npm install --save-dev vitest @vitest/coverage-v8
```

- [ ] **Step 2: Adicionar script de test ao package.json**

Em `frontend/package.json`, adicionar dentro de `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

O `scripts` completo fica:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Adicionar bloco `test` ao vite.config.ts**

Substituir o conteúdo de `frontend/vite.config.ts` por:
```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const cwd = (globalThis as { process?: { cwd: () => string } }).process?.cwd?.() ?? '.';
  const env = loadEnv(mode, cwd, '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

  return {
    plugins: [react()],
    test: {
      environment: 'node',
    },
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
            });
          }
        }
      }
    }
  };
});
```

- [ ] **Step 4: Adicionar questionsPerAxis ao tipo QuizPayload em quiz.ts**

Em `frontend/src/types/quiz.ts`, substituir a interface `QuizPayload`:
```typescript
export interface QuizPayload {
  title: string;
  description: string;
  variant: QuizVariant;
  questionCount: number;
  questionsPerAxis: number;
  axes: Axis[];
  questions: Question[];
  answerOptions: AnswerOption[];
}
```

Isso precisa acontecer antes dos testes para que o TypeScript compile o arquivo de testes.

- [ ] **Step 5: Criar teste de sanidade para verificar setup**

Criar `frontend/src/utils/quizSelection.test.ts` com apenas:
```typescript
import { describe, it, expect } from 'vitest';

describe('vitest setup', () => {
  it('works', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Executar e confirmar que passa**

```bash
cd frontend
npm test
```

Saída esperada: `1 passed`.

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts src/types/quiz.ts src/utils/quizSelection.test.ts
git commit -m "test(frontend): add vitest and questionsPerAxis type"
```

---

## Task 3: Escrever testes com falha para o algoritmo de seleção (TDD)

**Files:**
- Modify: `frontend/src/utils/quizSelection.test.ts`

Os testes cobrem os critérios de sucesso do spec: contagem por polo, contagem por eixo, sem polos consecutivos.

- [ ] **Step 1: Substituir o conteúdo de quizSelection.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { selectAndBalanceQuestions } from './quizSelection';
import type { QuizPayload } from '../types/quiz';

const AXIS_IDS = [
  'estrutura', 'representacao', 'poder', 'imigracao',
  'diplomacia', 'intervencao', 'economia', 'controle',
  'comercio', 'religiao', 'moral', 'tecnologia',
];

function makePool(questionsPerAxis: number, targetPerAxisSelection: number): QuizPayload {
  const questions = AXIS_IDS.flatMap((axisId) =>
    Array.from({ length: questionsPerAxis }, (_, i) => ({
      id: `${axisId}_${String(i).padStart(2, '0')}`,
      axisId,
      text: `Pergunta ${i} de ${axisId}`,
      agreePole: (i % 2 === 0 ? 'LEFT' : 'RIGHT') as 'LEFT' | 'RIGHT',
      weight: 1,
    }))
  );
  return {
    title: '12 Axes',
    description: 'Test',
    variant: 'short',
    questionCount: AXIS_IDS.length * targetPerAxisSelection,
    questionsPerAxis: targetPerAxisSelection,
    axes: AXIS_IDS.map((id) => ({
      id, label: id, leftPole: 'L', rightPole: 'R', leftColor: '', rightColor: '',
    })),
    questions,
    answerOptions: [],
  };
}

describe('selectAndBalanceQuestions — quiz curto (3 por eixo)', () => {
  it('retorna exatamente 36 questões', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    expect(result.questions).toHaveLength(36);
  });

  it('retorna exatamente 3 questões por eixo', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    for (const axisId of AXIS_IDS) {
      const count = result.questions.filter((q) => q.axisId === axisId).length;
      expect(count, `eixo ${axisId}`).toBe(3);
    }
  });

  it('retorna 18 questões LEFT e 18 RIGHT', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    const leftCount = result.questions.filter((q) => q.agreePole === 'LEFT').length;
    const rightCount = result.questions.filter((q) => q.agreePole === 'RIGHT').length;
    expect(leftCount).toBe(18);
    expect(rightCount).toBe(18);
  });

  it('não apresenta dois polos iguais consecutivos', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    for (let i = 1; i < result.questions.length; i++) {
      expect(
        result.questions[i].agreePole,
        `questões ${i - 1} e ${i} têm mesmo polo`
      ).not.toBe(result.questions[i - 1].agreePole);
    }
  });
});

describe('selectAndBalanceQuestions — quiz completo (5 por eixo)', () => {
  it('retorna exatamente 60 questões', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    expect(result.questions).toHaveLength(60);
  });

  it('retorna exatamente 5 questões por eixo', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    for (const axisId of AXIS_IDS) {
      const count = result.questions.filter((q) => q.axisId === axisId).length;
      expect(count, `eixo ${axisId}`).toBe(5);
    }
  });

  it('retorna 30 questões LEFT e 30 RIGHT', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    const leftCount = result.questions.filter((q) => q.agreePole === 'LEFT').length;
    const rightCount = result.questions.filter((q) => q.agreePole === 'RIGHT').length;
    expect(leftCount).toBe(30);
    expect(rightCount).toBe(30);
  });

  it('não apresenta dois polos iguais consecutivos', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    for (let i = 1; i < result.questions.length; i++) {
      expect(
        result.questions[i].agreePole,
        `questões ${i - 1} e ${i} têm mesmo polo`
      ).not.toBe(result.questions[i - 1].agreePole);
    }
  });
});
```

- [ ] **Step 2: Executar e confirmar que os testes falham**

```bash
cd frontend
npm test
```

Saída esperada: todos os testes falham com `Cannot find module './quizSelection'`.

- [ ] **Step 3: Commit dos testes com falha**

```bash
git add frontend/src/utils/quizSelection.test.ts
git commit -m "test(frontend): write failing tests for selectAndBalanceQuestions"
```

---

## Task 4: Implementar o algoritmo de seleção

**Files:**
- Create: `frontend/src/utils/quizSelection.ts`

- [ ] **Step 1: Criar frontend/src/utils/quizSelection.ts**

```typescript
import type { QuizPayload, Question } from '../types/quiz';

export function selectAndBalanceQuestions(payload: QuizPayload): QuizPayload {
  const { questions: pool, questionsPerAxis } = payload;

  const byAxis = new Map<string, Question[]>();
  for (const q of pool) {
    const group = byAxis.get(q.axisId) ?? [];
    group.push(q);
    byAxis.set(q.axisId, group);
  }

  const selected: Question[] = [];
  let axisIndex = 0;
  for (const axisQuestions of byAxis.values()) {
    const leftPool = shuffleArray(axisQuestions.filter((q) => q.agreePole === 'LEFT'));
    const rightPool = shuffleArray(axisQuestions.filter((q) => q.agreePole === 'RIGHT'));
    const extraLeft = axisIndex % 2 === 0;
    const leftCount = extraLeft
      ? Math.ceil(questionsPerAxis / 2)
      : Math.floor(questionsPerAxis / 2);
    const rightCount = questionsPerAxis - leftCount;
    selected.push(...leftPool.slice(0, leftCount), ...rightPool.slice(0, rightCount));
    axisIndex++;
  }

  const leftQueue = shuffleArray(selected.filter((q) => q.agreePole === 'LEFT'));
  const rightQueue = shuffleArray(selected.filter((q) => q.agreePole === 'RIGHT'));
  const ordered: Question[] = [];
  let li = 0;
  let ri = 0;
  let pickLeft = Math.random() < 0.5;

  for (let i = 0; i < selected.length; i++) {
    if (pickLeft && li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else if (!pickLeft && ri < rightQueue.length) {
      ordered.push(rightQueue[ri++]);
    } else if (li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else {
      ordered.push(rightQueue[ri++]);
    }
    pickLeft = !pickLeft;
  }

  return { ...payload, questions: ordered };
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

- [ ] **Step 2: Executar os testes e confirmar que todos passam**

```bash
cd frontend
npm test
```

Saída esperada: `10 passed`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/utils/quizSelection.ts
git commit -m "feat(frontend): implement selectAndBalanceQuestions with L/R balance"
```

---

## Task 5: Atualizar o backend

**Files:**
- Modify: `backend/src/main/java/com/twelveaxes/model/QuizPayload.java`
- Modify: `backend/src/main/java/com/twelveaxes/service/QuizDataService.java`
- Modify: `backend/src/test/java/com/twelveaxes/ScoringServiceTest.java`
- Delete: `backend/src/main/resources/data/questions.json`
- Delete: `backend/src/main/resources/data/questions-extended.json`

- [ ] **Step 1: Atualizar QuizPayload.java**

Substituir o conteúdo de `backend/src/main/java/com/twelveaxes/model/QuizPayload.java` por:
```java
package com.twelveaxes.model;

import java.util.List;

public record QuizPayload(
        String title,
        String description,
        String variant,
        int questionCount,
        int questionsPerAxis,
        List<Axis> axes,
        List<Question> questions,
        List<AnswerOption> answerOptions
) {}
```

- [ ] **Step 2: Atualizar QuizDataService.java**

Substituir o conteúdo de `backend/src/main/java/com/twelveaxes/service/QuizDataService.java` por:
```java
package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerOption;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Axis;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyProfile;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuizPayload;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class QuizDataService {
    public static final String SHORT_VARIANT = "short";
    public static final String EXTENDED_VARIANT = "extended";

    private final ObjectMapper objectMapper;
    private List<Axis> axes;
    private List<Question> poolQuestions;
    private List<Ideology> ideologies;
    private Map<String, IdeologyProfile> ideologyProfiles;

    public QuizDataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadData() throws IOException {
        axes = readJson("data/axes.json", new TypeReference<>() {});
        poolQuestions = readJson("data/questions-pool.json", new TypeReference<>() {});
        ideologies = readJson("data/ideologies.json", new TypeReference<>() {});
        List<IdeologyProfile> profiles = readJson("data/ideology-profiles.json", new TypeReference<>() {});
        ideologyProfiles = profiles.stream()
                .collect(Collectors.toUnmodifiableMap(IdeologyProfile::ideologyId, Function.identity()));
    }

    public QuizPayload getQuiz() {
        return getQuiz(SHORT_VARIANT);
    }

    public QuizPayload getQuiz(String variant) {
        String normalizedVariant = normalizeVariant(variant);
        int questionsPerAxis = normalizedVariant.equals(EXTENDED_VARIANT) ? 5 : 3;
        int questionCount = questionsPerAxis * axes.size();
        return new QuizPayload(
                "12 Axes",
                "Um quiz de " + questionCount + " perguntas para estimar sua posição nos 12 eixos políticos.",
                normalizedVariant,
                questionCount,
                questionsPerAxis,
                axes,
                poolQuestions,
                answerOptions()
        );
    }

    public List<Axis> getAxes() {
        return axes;
    }

    public List<Question> getQuestions() {
        return poolQuestions;
    }

    public List<Question> getQuestions(String variant) {
        normalizeVariant(variant);
        return poolQuestions;
    }

    public List<Ideology> getIdeologies() {
        return ideologies;
    }

    public Map<String, IdeologyProfile> getIdeologyProfiles() {
        return ideologyProfiles;
    }

    private List<AnswerOption> answerOptions() {
        return Arrays.stream(AnswerValue.values())
                .map(value -> new AnswerOption(value, labelFor(value), value.scoreTowardAgreement()))
                .toList();
    }

    private String labelFor(AnswerValue value) {
        return switch (value) {
            case STRONGLY_AGREE -> "Concordo totalmente";
            case AGREE -> "Concordo";
            case NEUTRAL -> "Neutro / Inseguro";
            case DISAGREE -> "Discordo";
            case STRONGLY_DISAGREE -> "Discordo totalmente";
        };
    }

    private String normalizeVariant(String variant) {
        if (variant == null || variant.isBlank()) {
            return SHORT_VARIANT;
        }
        return switch (variant.trim().toLowerCase()) {
            case SHORT_VARIANT, "curta" -> SHORT_VARIANT;
            case EXTENDED_VARIANT, "extensa" -> EXTENDED_VARIANT;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Versão de quiz inválida");
        };
    }

    private <T> T readJson(String path, TypeReference<T> type) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream input = resource.getInputStream()) {
            return objectMapper.readValue(input, type);
        }
    }
}
```

- [ ] **Step 3: Atualizar ScoringServiceTest.java**

Os testes `shortQuizHasThreeQuestionsPerAxis`, `extendedQuizHasFiveQuestionsPerAxis`, `shortQuizIsGloballyBalancedAcrossPoles` e `extendedQuizAlternatesPolesPerAxisAndIsGloballyBalanced` testavam seleção que agora é responsabilidade do frontend — substitua-os por testes do pool.

Substituir o conteúdo de `backend/src/test/java/com/twelveaxes/ScoringServiceTest.java` por:
```java
package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ScoringServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Test
    void poolHasTwoHundredFortyQuestionsAcrossTwelveAxes() {
        var questions = dataService.getQuestions();
        var questionsByAxis = questions.stream()
                .collect(Collectors.groupingBy(question -> question.axisId(), Collectors.counting()));

        assertThat(questions).hasSize(240);
        assertThat(questionsByAxis).hasSize(12);
        assertThat(questionsByAxis).allSatisfy((axisId, count) -> assertThat(count).isEqualTo(20));
    }

    @Test
    void poolHasTenQuestionsPerPolePerAxis() {
        var questionsByAxis = dataService.getQuestions().stream()
                .collect(Collectors.groupingBy(question -> question.axisId()));

        assertThat(questionsByAxis).allSatisfy((axisId, axisQuestions) -> {
            long leftCount = axisQuestions.stream()
                    .filter(q -> q.agreePole() == Pole.LEFT).count();
            long rightCount = axisQuestions.stream()
                    .filter(q -> q.agreePole() == Pole.RIGHT).count();
            assertThat(leftCount).as("LEFT em %s", axisId).isEqualTo(10);
            assertThat(rightCount).as("RIGHT em %s", axisId).isEqualTo(10);
        });
    }

    @Test
    void neutralAnswersProduceCenteredAxes() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();

        var results = scoringService.score(new ResultRequest(answers));

        assertThat(results).hasSize(12);
        assertThat(results).allSatisfy(axis -> {
            assertThat(axis.leftPercent()).isEqualTo(50.0);
            assertThat(axis.rightPercent()).isEqualTo(50.0);
            assertThat(axis.intensity()).isEqualTo("Equilibrado");
        });
    }

    @Test
    void shortQuizPayloadHasCorrectQuestionsPerAxis() {
        var payload = dataService.getQuiz(QuizDataService.SHORT_VARIANT);
        assertThat(payload.questionsPerAxis()).isEqualTo(3);
        assertThat(payload.questionCount()).isEqualTo(36);
        assertThat(payload.questions()).hasSize(240);
    }

    @Test
    void extendedQuizPayloadHasCorrectQuestionsPerAxis() {
        var payload = dataService.getQuiz(QuizDataService.EXTENDED_VARIANT);
        assertThat(payload.questionsPerAxis()).isEqualTo(5);
        assertThat(payload.questionCount()).isEqualTo(60);
        assertThat(payload.questions()).hasSize(240);
    }
}
```

- [ ] **Step 4: Executar os testes do backend**

```bash
cd backend
./mvnw test
```

Saída esperada: todos os testes passam.

- [ ] **Step 5: Deletar os arquivos de questões antigos**

```bash
git rm backend/src/main/resources/data/questions.json
git rm backend/src/main/resources/data/questions-extended.json
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/twelveaxes/model/QuizPayload.java
git add backend/src/main/java/com/twelveaxes/service/QuizDataService.java
git add backend/src/test/java/com/twelveaxes/ScoringServiceTest.java
git commit -m "feat(backend): load single questions pool, expose questionsPerAxis in payload"
```

---

## Task 6: Atualizar App.tsx

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Atualizar App.tsx**

Em `frontend/src/App.tsx`:

1. Adicionar o import no topo do arquivo (após os imports existentes):
```typescript
import { selectAndBalanceQuestions } from './utils/quizSelection';
```

2. No `useEffect` inicial (linha ~37), substituir:
```typescript
.then((payload) => setQuiz(shuffleQuizQuestions(payload)))
```
por:
```typescript
.then((payload) => setQuiz(selectAndBalanceQuestions(payload)))
```

3. Na função `startQuiz` (linha ~82), substituir:
```typescript
setQuiz(shuffleQuizQuestions(nextQuiz));
```
por:
```typescript
setQuiz(selectAndBalanceQuestions(nextQuiz));
```

4. Remover as duas funções do final do arquivo:
```typescript
// REMOVER esta função:
function shuffleQuizQuestions(quiz: QuizPayload): QuizPayload {
  return {
    ...quiz,
    questions: shuffleArray(quiz.questions)
  };
}

// REMOVER esta função:
function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
```

- [ ] **Step 3: Verificar que o build passa sem erros de tipo**

```bash
cd frontend
npm run build
```

Saída esperada: `built in Xs` sem erros de TypeScript.

- [ ] **Step 4: Executar os testes do frontend**

```bash
cd frontend
npm test
```

Saída esperada: `10 passed`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat(frontend): use selectAndBalanceQuestions with balanced L/R pool"
```

---

## Checklist de verificação final

Antes de considerar a feature completa, confirme manualmente:

- [ ] Quiz de 36 inicia sem erros no browser
- [ ] Quiz de 60 inicia sem erros no browser
- [ ] Abrir o DevTools → Network → resposta de `/api/quiz?variant=short` contém `"questionsPerAxis": 3` e `"questions"` com 240 itens
- [ ] Abrir o DevTools → Network → resposta de `/api/quiz?variant=extended` contém `"questionsPerAxis": 5` e `"questions"` com 240 itens
- [ ] Em nenhum momento duas perguntas seguidas têm o mesmo `agreePole` (verificável inspecionando o estado do React DevTools ou adicionando um `console.log` temporário)
- [ ] Os resultados do quiz ainda calculam corretamente (fazer o quiz completo e verificar que os percentuais por eixo fazem sentido)
