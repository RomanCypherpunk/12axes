# Página de Resultados Expandida — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a tela de resultados do quiz num relatório longo sobre o perfil ideológico do usuário, com afinidades e distâncias em ideologias, países e personalidades.

**Architecture:** Três frentes sequenciais. Primeiro os dados (campo `category` em 282 personalidades, classificadas individualmente por subagentes). Depois o backend, expondo campos que os matchers já calculam internamente mas truncam. Por último o frontend, com a página nova em componentes próprios, em linguagem visual shadcn construída sobre os tokens CSS existentes.

**Tech Stack:** Java 21 / Spring Boot 3.3.5 / Maven / JUnit 5 + AssertJ no backend. React 18 / TypeScript / Vite 5 / CSS puro / Vitest no frontend.

**Spec:** `docs/superpowers/specs/2026-09-15-pagina-resultados-design.md`

## Global Constraints

- **Commits:** padrão do projeto — `tipo(escopo): descrição curta em inglês minúsculo`, **somente o título, sem corpo**. Exemplos reais: `feat(results): show each percentile of compatibility`, `fix(frontend): vercel deploy`. **Nunca** adicionar `Co-Authored-By`, `Generated with`, ou qualquer marca de IA.
- **Sem dependências novas.** Nada de Tailwind, shadcn/ui, router ou biblioteca de componentes. `package.json` e `pom.xml` não mudam.
- **`ProfileMatchScorer` não é tocado.** Nenhuma alteração no algoritmo de compatibilidade.
- **5 testes já falham na `main`** por questões de centrismo/pragmatismo no scorer. São pré-existentes, não são escopo, e não devem ser "consertados" aqui. Ao rodar a suíte, comparar contra essa linha de base.
- **Idioma do código:** comentários e mensagens em português, como no resto do projeto. Identificadores em inglês.
- **Categorias** (8, exatas): `politico`, `religioso`, `economista`, `filosofo`, `teorico`, `empresario`, `intelectual`, `ativista`.
- **Tokens CSS:** usar apenas os de `frontend/src/styles/tokens.css`. Nenhuma cor nova em hex literal.
- **Rodar backend:** `cd backend && ./mvnw test` (ou `mvnw.cmd` no Windows). **Frontend:** `cd frontend && npm test`.

---

## Task 1: Campo `category` nas 282 personalidades

**Files:**
- Modify: `backend/src/main/resources/data/personalities.json` (282 entradas)
- Create: `backend/src/test/java/com/twelveaxes/PersonalityCategoryTest.java`
- Modify: `backend/src/main/java/com/twelveaxes/model/Personality.java`

**Interfaces:**
- Consumes: nada (primeira task)
- Produces: campo `category` em cada personalidade do JSON; `Personality.category()` como `String`

### Por que classificação individual

O campo `role` tem **105 valores distintos** para 282 perfis. Mapear `role` → `category` por tabela **é proibido pelo usuário**: roles iguais escondem perfis diferentes ("Estadista" cobre tanto Péricles quanto Bismarck; "Teórico" cobre marxistas e geopolíticos). Cada perfil é lido e decidido individualmente.

### Critério das 8 categorias

| categoria | abrange |
|---|---|
| `politico` | chefes de Estado, estadistas, ditadores, monarcas, imperadores, parlamentares |
| `religioso` | líderes e fundadores religiosos, teólogos |
| `economista` | economistas e teóricos econômicos |
| `filosofo` | pensamento geral e abstrato: ética, metafísica, epistemologia, filosofia política clássica |
| `teorico` | formuladores de doutrina política/social específica e operacional |
| `empresario` | empresários, industriais, investidores |
| `intelectual` | escritores, jornalistas, juristas, cientistas, militares, historiadores |
| `ativista` | militantes de movimentos sociais e de direitos civis |

**Fronteira filósofo × teórico** (decide ~50 perfis): `filosofo` é pensamento geral e abstrato (Platão, Kant, Nietzsche, Arendt, Rawls); `teorico` formulou doutrina política/social operacional (Marx, Gramsci, Bakunin, Mackinder, Pareto). Quando o perfil é os dois, decide o motivo de ele estar num catálogo político: Marx → `teorico` (marxismo é programa); Arendt → `filosofo` (obra é análise).

- [ ] **Step 1: Extrair a lista de perfis para classificar**

```bash
cd backend/src/main/resources/data
python -c "
import json
perfis = json.load(open('personalities.json', encoding='utf-8'))
for i, p in enumerate(perfis):
    print(f\"{i}|{p['id']}|{p['name']}|{p['role']}|{p['description'][:200]}\")
" > /tmp/perfis.txt
wc -l /tmp/perfis.txt   # esperado: 282
```

- [ ] **Step 2: Despachar subagentes de classificação em lotes de 30**

10 lotes (0-29, 30-59, ..., 270-281). Despachar em paralelo, um `Agent` por lote, `subagent_type: general-purpose`. Prompt de cada lote:

```
Classifique cada personalidade abaixo em EXATAMENTE UMA destas 8 categorias:

politico    - chefes de Estado, estadistas, ditadores, monarcas, imperadores, parlamentares
religioso   - líderes e fundadores religiosos, teólogos
economista  - economistas e teóricos econômicos
filosofo    - pensamento geral e abstrato: ética, metafísica, epistemologia, filosofia política clássica
teorico     - formuladores de doutrina política/social específica e operacional
empresario  - empresários, industriais, investidores
intelectual - escritores, jornalistas, juristas, cientistas, militares, historiadores
ativista    - militantes de movimentos sociais e de direitos civis

REGRA DECISIVA (filósofo x teórico): filosofo = pensamento geral e abstrato
(Platão, Kant, Nietzsche, Arendt, Rawls). teorico = formulou doutrina política
ou social específica e operacional (Marx, Gramsci, Bakunin, Mackinder, Pareto).
Se a pessoa é genuinamente as duas coisas, decida pelo motivo de ela estar num
catálogo de política: Marx e teorico porque o marxismo e um programa; Arendt e
filosofo porque a obra dela e analise.

Analise CADA perfil individualmente pelo nome, papel e descrição. NÃO agrupe
por papel: papéis iguais podem ter categorias diferentes.

Quem exerceu poder de Estado e também escreveu teoria (ex.: Lênin, Mao) entra
como politico se o exercício do poder é o que define a figura, e teorico se a
obra escrita é o que define.

Responda APENAS um objeto JSON {"id": "categoria"}, uma chave por perfil, sem
texto antes ou depois, cobrindo todos os perfis do lote sem exceção.

PERFIS:
<colar as linhas do lote, formato indice|id|nome|papel|descricao>
```

- [ ] **Step 3: Consolidar as respostas e aplicar ao JSON**

Salvar os 10 JSONs em `/tmp/cat_0.json` ... `/tmp/cat_9.json`, então:

```bash
cd backend/src/main/resources/data
python -c "
import json, glob, collections

VALIDAS = {'politico','religioso','economista','filosofo','teorico','empresario','intelectual','ativista'}

cats = {}
for f in sorted(glob.glob('/tmp/cat_*.json')):
    cats.update(json.load(open(f, encoding='utf-8')))

perfis = json.load(open('personalities.json', encoding='utf-8'))

faltando = [p['id'] for p in perfis if p['id'] not in cats]
invalidas = {i: c for i, c in cats.items() if c not in VALIDAS}
if faltando: raise SystemExit(f'sem categoria: {faltando}')
if invalidas: raise SystemExit(f'categoria invalida: {invalidas}')

# category logo apos role, para o arquivo permanecer legivel
saida = []
for p in perfis:
    novo = {}
    for k, v in p.items():
        novo[k] = v
        if k == 'role':
            novo['category'] = cats[p['id']]
    saida.append(novo)

json.dump(saida, open('personalities.json','w',encoding='utf-8'), ensure_ascii=False, indent=2)
open('personalities.json','a',encoding='utf-8').write('\n')
print('total:', len(saida))
for c, n in collections.Counter(cats.values()).most_common():
    print(f'  {c}: {n}')
"
```

Esperado: 282 perfis, as 8 categorias presentes, nenhuma vazia.

- [ ] **Step 4: Revisar manualmente os perfis de fronteira**

Listar e conferir um a um os que caíram em `filosofo` ou `teorico`:

```bash
cd backend/src/main/resources/data
python -c "
import json
for p in json.load(open('personalities.json', encoding='utf-8')):
    if p['category'] in ('filosofo','teorico'):
        print(f\"{p['category']:11} | {p['name']} | {p['role']}\")
" | sort
```

Corrigir à mão no JSON qualquer um que contrarie a regra decisiva. Este passo é obrigatório: é a fronteira que o spec identifica como a de maior risco.

- [ ] **Step 5: Adicionar `category` ao record `Personality`**

Em `backend/src/main/java/com/twelveaxes/model/Personality.java`, inserir o campo logo após `role`:

```java
public record Personality(
        String id,
        String name,
        String role,
        String category,
        String lifespan,
        String description,
        String imagePath,
        String imageSourceName,
        String imageSourceUrl,
        String imageNote
) {
}
```

O record já tem `@JsonIgnoreProperties(ignoreUnknown = true)`; o JSON EN não traz `category` e desserializa como `null`, o que é tratado na Task 2.

- [ ] **Step 6: Escrever o teste de integridade do catálogo**

Criar `backend/src/test/java/com/twelveaxes/PersonalityCategoryTest.java`:

```java
package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.QuizDataService;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PersonalityCategoryTest {
    private static final Set<String> CATEGORIAS_VALIDAS = Set.of(
            "politico", "religioso", "economista", "filosofo",
            "teorico", "empresario", "intelectual", "ativista"
    );

    @Autowired
    private QuizDataService dataService;

    @Test
    void everyPersonalityHasAValidCategory() {
        assertThat(dataService.getPersonalities())
                .isNotEmpty()
                .allSatisfy(personality -> assertThat(personality.category())
                        .as("Personalidade %s precisa de categoria valida", personality.id())
                        .isIn(CATEGORIAS_VALIDAS));
    }

    @Test
    void everyCategoryHasAtLeastOnePersonality() {
        var usadas = dataService.getPersonalities().stream()
                .map(personality -> personality.category())
                .distinct()
                .toList();

        assertThat(usadas).containsExactlyInAnyOrderElementsOf(CATEGORIAS_VALIDAS);
    }
}
```

- [ ] **Step 7: Rodar o teste**

Run: `cd backend && ./mvnw test -Dtest=PersonalityCategoryTest`
Expected: PASS nos dois testes.

- [ ] **Step 8: Commit**

```bash
git add backend/src/main/resources/data/personalities.json \
        backend/src/main/java/com/twelveaxes/model/Personality.java \
        backend/src/test/java/com/twelveaxes/PersonalityCategoryTest.java
git commit -m "feat(personality): classify catalog into eight categories"
```

---

## Task 2: Personalidades por categoria e opostas

**Files:**
- Modify: `backend/src/main/java/com/twelveaxes/service/PersonalityMatcherService.java`
- Modify: `backend/src/main/java/com/twelveaxes/model/PersonalityMatch.java`
- Create: `backend/src/test/java/com/twelveaxes/PersonalityCategoryMatchTest.java`

**Interfaces:**
- Consumes: `Personality.category()` (Task 1)
- Produces:
  - `PersonalityMatch` ganha o campo `category` (11º componente, após `imageNote`, antes de `compatibility`)
  - `PersonalityMatcherService.findCategoryMatches(List<AxisResult>, String lang)` → `List<PersonalityMatch>` com 3 itens de categorias distintas
  - `PersonalityMatcherService.findBottomMatches(List<AxisResult>, String lang)` → `List<PersonalityMatch>` com as 3 menores, ordem crescente

### Nota de implementação

`findMatches` hoje rankeia o catálogo inteiro e só no fim aplica `.limit(TOP_MATCHES)`. Extrair o ranking completo para um método privado `rankAll(userVector, lang)` que devolve `List<PersonalityMatch>` ordenada, e fazer `findMatches`, `findCategoryMatches` e `findBottomMatches` consumirem ele. Isso evita recalcular o catálogo três vezes e mantém o cálculo idêntico ao atual.

O JSON EN não tem `category`, então `getPersonalities("en")` devolve `category == null`. Resolver na montagem do `PersonalityMatch`: quando a personalidade EN tiver categoria nula, buscar a do catálogo PT pelo `id`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `backend/src/test/java/com/twelveaxes/PersonalityCategoryMatchTest.java`:

```java
package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PersonalityCategoryMatchTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private PersonalityMatcherService matcherService;

    // Perfil de teste: esquerda em todos os eixos. Qualquer vetor serve —
    // as regras testadas valem para qualquer resultado.
    private List<AxisResult> axesDeTeste() {
        return dataService.getAxes().stream()
                .map(axis -> new AxisResult(
                        axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                        72.0, 28.0, axis.leftPole(), "moderada"))
                .toList();
    }

    @Test
    void categoryMatchesReturnThreeDistinctCategories() {
        var axes = axesDeTeste();
        var categorias = matcherService.findCategoryMatches(axes, QuizDataService.LANG_PT).stream()
                .map(PersonalityMatch::category)
                .toList();

        assertThat(categorias).hasSize(3).doesNotHaveDuplicates();
    }

    @Test
    void categoryMatchesExcludeTopMatchAndItsCategory() {
        var axes = axesDeTeste();
        var top = matcherService.findTopMatch(axes, QuizDataService.LANG_PT);
        var porCategoria = matcherService.findCategoryMatches(axes, QuizDataService.LANG_PT);

        assertThat(porCategoria)
                .noneMatch(match -> match.personalityId().equals(top.personalityId()))
                .noneMatch(match -> match.category().equals(top.category()));
    }

    @Test
    void bottomMatchesAreTheLeastCompatibleInAscendingOrder() {
        var axes = axesDeTeste();
        var opostas = matcherService.findBottomMatches(axes, QuizDataService.LANG_PT);
        var top = matcherService.findTopMatch(axes, QuizDataService.LANG_PT);

        assertThat(opostas).hasSize(3);
        assertThat(opostas.get(0).compatibility()).isLessThanOrEqualTo(opostas.get(1).compatibility());
        assertThat(opostas.get(1).compatibility()).isLessThanOrEqualTo(opostas.get(2).compatibility());
        assertThat(opostas.get(2).compatibility()).isLessThan(top.compatibility());
    }

    @Test
    void englishMatchesStillCarryCategory() {
        var axes = axesDeTeste();
        var porCategoria = matcherService.findCategoryMatches(axes, QuizDataService.LANG_EN);

        assertThat(porCategoria)
                .hasSize(3)
                .allSatisfy(match -> assertThat(match.category()).isNotBlank());
    }
}
```

- [ ] **Step 2: Rodar os testes para ver falhar**

Run: `cd backend && ./mvnw test -Dtest=PersonalityCategoryMatchTest`
Expected: FAIL com erro de compilação — `findCategoryMatches`, `findBottomMatches` e `PersonalityMatch.category()` não existem.

- [ ] **Step 3: Adicionar `category` ao `PersonalityMatch`**

```java
public record PersonalityMatch(
        String personalityId,
        String name,
        String role,
        String category,
        String lifespan,
        String description,
        String imagePath,
        String imageSourceName,
        String imageSourceUrl,
        String imageNote,
        double compatibility,
        double compatibilityPercentile
) {
}
```

- [ ] **Step 4: Implementar os métodos no `PersonalityMatcherService`**

Refatorar para um ranking único e adicionar os dois métodos:

```java
    // Ranking completo do catálogo, do mais ao menos compatível. Todos os
    // recortes (topo, categorias, opostos) saem desta mesma lista.
    private List<PersonalityMatch> rankAll(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<PersonalityCandidate> byScore =
                Comparator.comparingDouble(PersonalityCandidate::compatibility).reversed();
        Comparator<PersonalityCandidate> byName =
                Comparator.comparing(candidate -> candidate.personality().name());

        List<PersonalityCandidate> candidates = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .map(personality -> toCandidate(personality, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(PersonalityCandidate::compatibility)
                .toList();

        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
                .sorted(byScore.thenComparing(byName))
                .map(this::toMatch)
                .toList();
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults, String lang) {
        return rankAll(axisResults, lang).stream().limit(TOP_MATCHES).toList();
    }

    // Três personalidades de categorias distintas entre si e diferentes da
    // categoria da mais compatível: percorre o ranking de cima para baixo e
    // pega a primeira de cada categoria ainda não vista.
    public List<PersonalityMatch> findCategoryMatches(List<AxisResult> axisResults, String lang) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang);
        if (ranking.isEmpty()) {
            return List.of();
        }

        PersonalityMatch top = ranking.getFirst();
        Set<String> vistas = new LinkedHashSet<>();
        vistas.add(top.category());

        List<PersonalityMatch> selecionadas = new ArrayList<>();
        for (PersonalityMatch match : ranking) {
            if (selecionadas.size() == CATEGORY_MATCHES) {
                break;
            }
            if (vistas.add(match.category())) {
                selecionadas.add(match);
            }
        }
        return List.copyOf(selecionadas);
    }

    // As três menos compatíveis do catálogo inteiro, em ordem crescente.
    public List<PersonalityMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility))
                .toList();
    }
```

Constantes no topo da classe, junto de `TOP_MATCHES`:

```java
    private static final int CATEGORY_MATCHES = 3;
    private static final int BOTTOM_MATCHES = 3;
```

Imports a acrescentar: `java.util.ArrayList`, `java.util.LinkedHashSet`, `java.util.Set`.

Em `toMatch`, passar a categoria resolvida (o catálogo EN não tem o campo):

```java
    private PersonalityMatch toMatch(PersonalityCandidate candidate) {
        Personality personality = candidate.personality();
        return new PersonalityMatch(
                personality.id(),
                personality.name(),
                personality.role(),
                categoryFor(personality),
                personality.lifespan(),
                personality.description(),
                personality.imagePath(),
                personality.imageSourceName(),
                personality.imageSourceUrl(),
                personality.imageNote(),
                candidate.compatibility(),
                candidate.compatibilityPercentile()
        );
    }

    // O catálogo EN traduz só nome, papel e descrição: a categoria vem sempre
    // do catálogo PT, que é a fonte única dessa classificação.
    private String categoryFor(Personality personality) {
        if (personality.category() != null && !personality.category().isBlank()) {
            return personality.category();
        }
        Personality base = dataService.getPersonalityById(personality.id(), QuizDataService.LANG_PT);
        return base == null ? null : base.category();
    }
```

- [ ] **Step 5: Rodar os testes**

Run: `cd backend && ./mvnw test -Dtest=PersonalityCategoryMatchTest`
Expected: PASS nos 4 testes.

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/twelveaxes/model/PersonalityMatch.java \
        backend/src/main/java/com/twelveaxes/service/PersonalityMatcherService.java \
        backend/src/test/java/com/twelveaxes/PersonalityCategoryMatchTest.java
git commit -m "feat(results): personality matches by category and opposites"
```

---

## Task 3: País histórico e países opostos

**Files:**
- Modify: `backend/src/main/java/com/twelveaxes/service/CountryMatcherService.java`
- Create: `backend/src/test/java/com/twelveaxes/CountryMatchVariantsTest.java`

**Interfaces:**
- Consumes: nada das tasks anteriores
- Produces:
  - `findTopMatch(axes, lang)` passa a devolver o melhor país **atual** (`historical == false`)
  - `findTopHistoricalMatch(List<AxisResult>, String lang)` → `CountryMatch` do melhor histórico
  - `findBottomMatches(List<AxisResult>, String lang)` → `List<CountryMatch>` com as 3 menores, ordem crescente

### Mudança de comportamento

`findTopMatch` hoje considera o catálogo inteiro e pode devolver um país histórico. Passa a filtrar por `historical == false`. Isso altera o resultado de links já compartilhados — aceito e documentado no spec.

Catálogo: 143 países, 87 atuais e 56 históricos.

- [ ] **Step 1: Escrever os testes que falham**

Criar `backend/src/test/java/com/twelveaxes/CountryMatchVariantsTest.java`:

```java
package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CountryMatchVariantsTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryMatcherService matcherService;

    private List<AxisResult> axesDeTeste() {
        return dataService.getAxes().stream()
                .map(axis -> new AxisResult(
                        axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                        72.0, 28.0, axis.leftPole(), "moderada"))
                .toList();
    }

    @Test
    void topMatchIsAlwaysACurrentCountry() {
        var top = matcherService.findTopMatch(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(top.historical()).isFalse();
    }

    @Test
    void topHistoricalMatchIsAlwaysHistorical() {
        var top = matcherService.findTopHistoricalMatch(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(top.historical()).isTrue();
    }

    @Test
    void bottomMatchesAreTheLeastCompatibleInAscendingOrder() {
        var axes = axesDeTeste();
        var opostos = matcherService.findBottomMatches(axes, QuizDataService.LANG_PT);
        var top = matcherService.findTopMatch(axes, QuizDataService.LANG_PT);

        assertThat(opostos).hasSize(3);
        assertThat(opostos.get(0).compatibility()).isLessThanOrEqualTo(opostos.get(1).compatibility());
        assertThat(opostos.get(1).compatibility()).isLessThanOrEqualTo(opostos.get(2).compatibility());
        assertThat(opostos.get(2).compatibility()).isLessThan(top.compatibility());
    }
}
```

- [ ] **Step 2: Rodar os testes para ver falhar**

Run: `cd backend && ./mvnw test -Dtest=CountryMatchVariantsTest`
Expected: FAIL com erro de compilação — `findTopHistoricalMatch` e `findBottomMatches` não existem. (`topMatchIsAlwaysACurrentCountry` pode passar ou falhar conforme o vetor; os outros dois não compilam.)

- [ ] **Step 3: Implementar os métodos**

Substituir o corpo de `findTopMatch(List<AxisResult>, String)` e adicionar os novos, sobre um ranking único:

```java
    // Ranking completo do catálogo, do mais ao menos compatível.
    private List<CountryMatch> rankAll(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<CountryCandidate> byCompatibility =
                Comparator.comparingDouble(CountryCandidate::compatibility).reversed();
        Comparator<CountryCandidate> byName =
                Comparator.comparing(candidate -> candidate.country().name());

        List<CountryCandidate> candidates = dataService.getCountries(QuizDataService.normalizeLang(lang)).stream()
                .map(country -> toCandidate(country, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(CountryCandidate::compatibility)
                .toList();

        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
                .sorted(byCompatibility.thenComparing(byName))
                .map(this::toMatch)
                .toList();
    }

    // País atual mais compatível. Regimes históricos têm sua própria seção.
    public CountryMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return firstMatching(axisResults, lang, false);
    }

    public CountryMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang) {
        return firstMatching(axisResults, lang, true);
    }

    private CountryMatch firstMatching(List<AxisResult> axisResults, String lang, boolean historical) {
        return rankAll(axisResults, lang).stream()
                .filter(match -> match.historical() == historical)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Nenhum pais disponivel para matching (historical=" + historical + ")"));
    }

    // Os três menos compatíveis do catálogo inteiro, em ordem crescente.
    public List<CountryMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        List<CountryMatch> ranking = rankAll(axisResults, lang);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(CountryMatch::compatibility))
                .toList();
    }
```

Constante no topo da classe:

```java
    private static final int BOTTOM_MATCHES = 3;
```

O overload `findTopMatch(List<AxisResult>)` sem idioma continua delegando para a versão com `LANG_PT`.

- [ ] **Step 4: Rodar os testes**

Run: `cd backend && ./mvnw test -Dtest=CountryMatchVariantsTest`
Expected: PASS nos 3 testes.

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/twelveaxes/service/CountryMatcherService.java \
        backend/src/test/java/com/twelveaxes/CountryMatchVariantsTest.java
git commit -m "feat(results): split current and historical country matches"
```

---

## Task 4: Ideologia menos compatível

**Files:**
- Modify: `backend/src/main/java/com/twelveaxes/service/IdeologyMatcherService.java`
- Create: `backend/src/test/java/com/twelveaxes/IdeologyBottomMatchTest.java`

**Interfaces:**
- Consumes: nada das tasks anteriores
- Produces: `IdeologyMatcherService.findBottomMatch(List<AxisResult>, String lang)` → `IdeologyMatch` da menor compatibilidade

`TOP_MATCHES` continua **4** — a seção de outras ideologias não muda de tamanho.

- [ ] **Step 1: Escrever o teste que falha**

Criar `backend/src/test/java/com/twelveaxes/IdeologyBottomMatchTest.java`:

```java
package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyBottomMatchTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private IdeologyMatcherService matcherService;

    private List<AxisResult> axesDeTeste() {
        return dataService.getAxes().stream()
                .map(axis -> new AxisResult(
                        axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                        72.0, 28.0, axis.leftPole(), "moderada"))
                .toList();
    }

    @Test
    void bottomMatchIsLessCompatibleThanEveryTopMatch() {
        var axes = axesDeTeste();
        var oposta = matcherService.findBottomMatch(axes, QuizDataService.LANG_PT);
        var topo = matcherService.findMatches(axes, QuizDataService.LANG_PT);

        assertThat(topo).isNotEmpty();
        assertThat(topo)
                .allSatisfy(match -> assertThat(oposta.compatibility())
                        .isLessThan(match.compatibility()));
    }

    @Test
    void topMatchesStillReturnFour() {
        assertThat(matcherService.findMatches(axesDeTeste(), QuizDataService.LANG_PT)).hasSize(4);
    }
}
```

- [ ] **Step 2: Rodar o teste para ver falhar**

Run: `cd backend && ./mvnw test -Dtest=IdeologyBottomMatchTest`
Expected: FAIL com erro de compilação — `findBottomMatch` não existe.

- [ ] **Step 3: Implementar o método**

`rankCandidates` já devolve o catálogo inteiro ordenado. Adicionar:

```java
    // A ideologia mais distante do usuário no catálogo inteiro.
    public IdeologyMatch findBottomMatch(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        String normalizedLang = QuizDataService.normalizeLang(lang);
        List<IdeologyCandidate> ranking = rankCandidates(userVector, normalizedLang);
        if (ranking.isEmpty()) {
            throw new IllegalStateException("Nenhuma ideologia disponivel para matching");
        }
        return toMatch(ranking.getLast(), normalizedLang);
    }
```

- [ ] **Step 4: Rodar o teste**

Run: `cd backend && ./mvnw test -Dtest=IdeologyBottomMatchTest`
Expected: PASS nos 2 testes.

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/twelveaxes/service/IdeologyMatcherService.java \
        backend/src/test/java/com/twelveaxes/IdeologyBottomMatchTest.java
git commit -m "feat(results): least compatible ideology"
```

---

## Task 5: Expor os campos novos no `QuizResult`

**Files:**
- Modify: `backend/src/main/java/com/twelveaxes/model/QuizResult.java`
- Modify: `backend/src/main/java/com/twelveaxes/controller/QuizController.java:91-97` (método `buildResult`)
- Create: `backend/src/test/java/com/twelveaxes/QuizResultPayloadTest.java`

**Interfaces:**
- Consumes: `findCategoryMatches`, `findBottomMatches` (Task 2); `findTopHistoricalMatch`, `findBottomMatches` (Task 3); `findBottomMatch` (Task 4)
- Produces: `QuizResult` com 10 componentes, consumido pelo frontend na Task 6

- [ ] **Step 1: Escrever o teste que falha**

Criar `backend/src/test/java/com/twelveaxes/QuizResultPayloadTest.java`:

```java
package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class QuizResultPayloadTest {
    // Vetor de 12 eixos, todos à esquerda, no formato aceito por /api/results/by-axes.
    private static final String VETOR = "72,72,72,72,72,72,72,72,72,72,72,72";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void sharedResultCarriesEveryNewSection() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", VETOR))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axes.length()").value(12))
                .andExpect(jsonPath("$.matches.length()").value(4))
                .andExpect(jsonPath("$.bottomIdeologyMatch.ideologyId").isNotEmpty())
                .andExpect(jsonPath("$.topCountryMatch.historical").value(false))
                .andExpect(jsonPath("$.topHistoricalCountryMatch.historical").value(true))
                .andExpect(jsonPath("$.bottomCountryMatches.length()").value(3))
                .andExpect(jsonPath("$.topPersonalityMatch.category").isNotEmpty())
                .andExpect(jsonPath("$.categoryPersonalityMatches.length()").value(3))
                .andExpect(jsonPath("$.bottomPersonalityMatches.length()").value(3));
    }
}
```

- [ ] **Step 2: Rodar o teste para ver falhar**

Run: `cd backend && ./mvnw test -Dtest=QuizResultPayloadTest`
Expected: FAIL — os campos novos não existem no JSON.

- [ ] **Step 3: Expandir o record `QuizResult`**

```java
package com.twelveaxes.model;

import java.util.List;

public record QuizResult(
        List<AxisResult> axes,
        IdeologyMatch topMatch,
        List<IdeologyMatch> matches,
        IdeologyMatch bottomIdeologyMatch,
        CountryMatch topCountryMatch,
        CountryMatch topHistoricalCountryMatch,
        List<CountryMatch> bottomCountryMatches,
        PersonalityMatch topPersonalityMatch,
        List<PersonalityMatch> categoryPersonalityMatches,
        List<PersonalityMatch> bottomPersonalityMatches
) {
}
```

- [ ] **Step 4: Montar o resultado no controller**

Substituir `buildResult` em `QuizController.java`:

```java
    private QuizResult buildResult(List<AxisResult> axes, String lang) {
        var matches = matcherService.findMatches(axes, lang);
        return new QuizResult(
                axes,
                matches.getFirst(),
                matches,
                matcherService.findBottomMatch(axes, lang),
                countryMatcherService.findTopMatch(axes, lang),
                countryMatcherService.findTopHistoricalMatch(axes, lang),
                countryMatcherService.findBottomMatches(axes, lang),
                personalityMatcherService.findTopMatch(axes, lang),
                personalityMatcherService.findCategoryMatches(axes, lang),
                personalityMatcherService.findBottomMatches(axes, lang)
        );
    }
```

- [ ] **Step 5: Rodar o teste**

Run: `cd backend && ./mvnw test -Dtest=QuizResultPayloadTest`
Expected: PASS.

- [ ] **Step 6: Rodar a suíte inteira do backend**

Run: `cd backend && ./mvnw test`
Expected: passam todos, **exceto os 5 de centrismo/pragmatismo que já falhavam na `main`**. Se falhar algum diferente desses 5, é regressão desta mudança — investigar antes de commitar.

- [ ] **Step 7: Commit**

```bash
git add backend/src/main/java/com/twelveaxes/model/QuizResult.java \
        backend/src/main/java/com/twelveaxes/controller/QuizController.java \
        backend/src/test/java/com/twelveaxes/QuizResultPayloadTest.java
git commit -m "feat(results): expose new match sections in quiz result"
```

---

## Task 6: Tipos e textos do frontend

**Files:**
- Modify: `frontend/src/types/quiz.ts:63-113`
- Modify: `frontend/src/i18n/index.ts` (interface de tipos + bloco PT + bloco EN)

**Interfaces:**
- Consumes: JSON do `QuizResult` (Task 5)
- Produces: `QuizResult` e `PersonalityCategory` em TypeScript; chaves de tradução consumidas pelas Tasks 7-8

- [ ] **Step 1: Atualizar os tipos**

Em `frontend/src/types/quiz.ts`, acrescentar a categoria ao `PersonalityMatch` e expandir o `QuizResult`:

```ts
export type PersonalityCategory =
  | 'politico'
  | 'religioso'
  | 'economista'
  | 'filosofo'
  | 'teorico'
  | 'empresario'
  | 'intelectual'
  | 'ativista';

export interface PersonalityMatch {
  personalityId: string;
  name: string;
  role: string;
  category: PersonalityCategory;
  lifespan: string;
  description: string;
  imagePath: string;
  imageSourceName?: string;
  imageSourceUrl?: string;
  imageNote?: string;
  compatibility: number;
  compatibilityPercentile?: number;
}

export interface QuizResult {
  axes: AxisResult[];
  topMatch: IdeologyMatch;
  matches: IdeologyMatch[];
  bottomIdeologyMatch: IdeologyMatch;
  topCountryMatch: CountryMatch;
  topHistoricalCountryMatch: CountryMatch;
  bottomCountryMatches: CountryMatch[];
  topPersonalityMatch: PersonalityMatch;
  categoryPersonalityMatches: PersonalityMatch[];
  bottomPersonalityMatches: PersonalityMatch[];
}
```

- [ ] **Step 2: Adicionar as chaves de tradução**

Em `frontend/src/i18n/index.ts`, declarar no bloco de tipos (junto de `otherMatches`, por volta da linha 143):

```ts
  navOnThisPage: string;
  navAxes: string;
  navCountries: string;
  navPersonalities: string;
  navIdeologies: string;
  countriesSectionTitle: string;
  countryCurrentTab: string;
  countryHistoricalTab: string;
  countriesDistantTitle: string;
  personalitiesSectionTitle: string;
  personalitiesByAreaTitle: string;
  personalitiesDistantTitle: string;
  ideologyDistantTitle: string;
  personalityCategories: Record<PersonalityCategory, string>;
```

No bloco PT (junto de `otherMatches`, por volta da linha 460):

```ts
  navOnThisPage: 'Nesta página',
  navAxes: 'Os 12 eixos',
  navCountries: 'Países',
  navPersonalities: 'Personalidades',
  navIdeologies: 'Outras ideologias',
  countriesSectionTitle: 'Países mais próximos de você',
  countryCurrentTab: 'País atual',
  countryHistoricalTab: 'Experiência histórica',
  countriesDistantTitle: 'Os mais distantes de você',
  personalitiesSectionTitle: 'Personalidades mais próximas de você',
  personalitiesByAreaTitle: 'Também próximos, por área de atuação',
  personalitiesDistantTitle: 'As mais distantes de você',
  ideologyDistantTitle: 'A ideologia mais distante de você',
  personalityCategories: {
    politico: 'Política',
    religioso: 'Religião',
    economista: 'Economia',
    filosofo: 'Filosofia',
    teorico: 'Teoria política',
    empresario: 'Empresariado',
    intelectual: 'Vida intelectual',
    ativista: 'Ativismo',
  },
```

No bloco EN (junto de `otherMatches`, por volta da linha 813):

```ts
  navOnThisPage: 'On this page',
  navAxes: 'The 12 axes',
  navCountries: 'Countries',
  navPersonalities: 'Figures',
  navIdeologies: 'Other ideologies',
  countriesSectionTitle: 'Countries closest to you',
  countryCurrentTab: 'Present-day',
  countryHistoricalTab: 'Historical',
  countriesDistantTitle: 'Furthest from you',
  personalitiesSectionTitle: 'Figures closest to you',
  personalitiesByAreaTitle: 'Also close to you, by field',
  personalitiesDistantTitle: 'Furthest from you',
  ideologyDistantTitle: 'The ideology furthest from you',
  personalityCategories: {
    politico: 'Politics',
    religioso: 'Religion',
    economista: 'Economics',
    filosofo: 'Philosophy',
    teorico: 'Political theory',
    empresario: 'Business',
    intelectual: 'Intellectual life',
    ativista: 'Activism',
  },
```

Importar `PersonalityCategory` de `../types/quiz` no topo do arquivo.

- [ ] **Step 3: Verificar a tipagem**

Run: `cd frontend && npx tsc --noEmit`
Expected: sem erros. Se acusar `QuizResult` incompleto em `exampleResult.ts` ou `shareCard.ts`, completar os objetos literais desses arquivos com os campos novos (o `exampleResult` é conteúdo de home, pode repetir os matches existentes).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/types/quiz.ts frontend/src/i18n/index.ts
git commit -m "feat(frontend): types and copy for expanded results"
```

---

## Task 7: Componentes de seção da página

**Files:**
- Create: `frontend/src/components/results/ResultsNav.tsx`
- Create: `frontend/src/components/results/CountriesSection.tsx`
- Create: `frontend/src/components/results/PersonalitiesSection.tsx`
- Create: `frontend/src/components/results/IdeologiesSection.tsx`
- Create: `frontend/src/components/results/DistantCard.tsx`
- Create: `frontend/src/styles/results.css`
- Modify: `frontend/src/main.tsx` (importar `results.css`)

**Interfaces:**
- Consumes: `QuizResult`, `PersonalityCategory` (Task 6); `CountryMatchCard`, `PersonalityMatchCard`, `IdeologyMatchCard` existentes em `frontend/src/components/`
- Produces: os cinco componentes acima, montados pela Task 8

### Regras de estilo (do spec)

- **Nenhuma cor literal.** Só tokens de `tokens.css`.
- **Verde = afinidade, vermelho = distância, ink = estrutura.** Cor nunca decora.
- **Três pesos de card:** destaque (`--paper` + `--shadow-md`), grade (borda hairline, sem sombra), distância (compacto, `--critical-soft`, sem imagem grande).
- **Linguagem shadcn sem a biblioteca:** card com borda 1px `--line` e `--radius-lg`; badge pill `--radius-pill`; tabs; separator 1px; texto secundário em `--text-muted`.
- **Movimento:** barras animam de 0 até o valor ao entrar no viewport, uma vez, com `--dur-measure` e `--ease-settle`. Sem fade-up por seção.
- `results.css` é arquivo novo — **não** acrescentar nada ao `app.css`, que já tem 6.726 linhas.

- [ ] **Step 1: Criar o card de distância**

`frontend/src/components/results/DistantCard.tsx` — card compacto usado pelos três blocos de opostos:

```tsx
type DistantCardProps = {
  name: string;
  caption: string;
  compatibility: number;
};

// Card dos opostos: menor que os de afinidade porque é informação
// secundária, e em vermelho porque o dado é distância.
export function DistantCard({ name, caption, compatibility }: DistantCardProps) {
  return (
    <article className="distant-card">
      <div className="distant-card-text">
        <h4>{name}</h4>
        <p>{caption}</p>
      </div>
      <span className="distant-card-score">{compatibility.toFixed(1)}%</span>
    </article>
  );
}
```

- [ ] **Step 2: Criar a navegação lateral**

`frontend/src/components/results/ResultsNav.tsx` — sidebar fixa com as seções numeradas, destacando a visível via `IntersectionObserver`:

```tsx
import { useEffect, useState } from 'react';
import { t } from '../../i18n';

const SECTIONS = [
  { id: 'eixos', label: () => t.navAxes },
  { id: 'paises', label: () => t.navCountries },
  { id: 'personalidades', label: () => t.navPersonalities },
  { id: 'ideologias', label: () => t.navIdeologies },
];

export function ResultsNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="results-nav" aria-label={t.navOnThisPage}>
      <p className="results-nav-title">{t.navOnThisPage}</p>
      <ol>
        {SECTIONS.map(({ id, label }, index) => (
          <li key={id}>
            <a href={`#${id}`} data-active={active === id ? 'true' : undefined}>
              <span className="results-nav-index">{index + 1}</span>
              {label()}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 3: Criar a seção de países**

`frontend/src/components/results/CountriesSection.tsx` — tabs atual/histórico + os 3 distantes:

```tsx
import { useState } from 'react';
import { CountryMatchCard } from '../CountryMatchCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { CountryMatch } from '../../types/quiz';

type CountriesSectionProps = {
  current: CountryMatch;
  historical: CountryMatch;
  distant: CountryMatch[];
};

export function CountriesSection({ current, historical, distant }: CountriesSectionProps) {
  const [tab, setTab] = useState<'current' | 'historical'>('current');
  const shown = tab === 'current' ? current : historical;

  return (
    <section className="results-section" id="paises">
      <div className="section-heading">
        <h2>{t.countriesSectionTitle}</h2>
      </div>

      <div className="results-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'current'}
          onClick={() => setTab('current')}
        >
          {t.countryCurrentTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'historical'}
          onClick={() => setTab('historical')}
        >
          {t.countryHistoricalTab}
        </button>
      </div>

      <CountryMatchCard match={shown} />

      <div className="distant-block">
        <h3>{t.countriesDistantTitle}</h3>
        <div className="distant-grid">
          {distant.map((match) => (
            <DistantCard
              key={match.countryId}
              name={match.name}
              caption={match.period || match.category}
              compatibility={match.compatibility}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Criar a seção de personalidades**

`frontend/src/components/results/PersonalitiesSection.tsx` — top-1, os 3 por categoria e os 3 distantes:

```tsx
import { PersonalityMatchCard } from '../PersonalityMatchCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';

type PersonalitiesSectionProps = {
  top: PersonalityMatch;
  byCategory: PersonalityMatch[];
  distant: PersonalityMatch[];
};

export function PersonalitiesSection({ top, byCategory, distant }: PersonalitiesSectionProps) {
  return (
    <section className="results-section" id="personalidades">
      <div className="section-heading">
        <h2>{t.personalitiesSectionTitle}</h2>
      </div>

      <PersonalityMatchCard match={top} />

      <div className="category-block">
        <h3>{t.personalitiesByAreaTitle}</h3>
        <div className="category-grid">
          {byCategory.map((match) => (
            <article className="category-card" key={match.personalityId}>
              <span className="category-badge">{t.personalityCategories[match.category]}</span>
              <img src={match.imagePath} alt="" loading="lazy" />
              <h4>{match.name}</h4>
              <p>{match.role}</p>
              <span className="category-score">{match.compatibility.toFixed(1)}%</span>
            </article>
          ))}
        </div>
      </div>

      <div className="distant-block">
        <h3>{t.personalitiesDistantTitle}</h3>
        <div className="distant-grid">
          {distant.map((match) => (
            <DistantCard
              key={match.personalityId}
              name={match.name}
              caption={match.role}
              compatibility={match.compatibility}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Criar a seção de ideologias**

`frontend/src/components/results/IdeologiesSection.tsx` — as 3 outras + a mais distante:

```tsx
import { IdeologyMatchCard } from '../IdeologyMatchCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';

type IdeologiesSectionProps = {
  others: IdeologyMatch[];
  distant: IdeologyMatch;
};

export function IdeologiesSection({ others, distant }: IdeologiesSectionProps) {
  return (
    <section className="results-section" id="ideologias">
      <div className="section-heading">
        <h2>{t.otherMatches}</h2>
      </div>

      <div className="match-grid">
        {others.map((match) => (
          <IdeologyMatchCard key={match.ideologyId} match={match} />
        ))}
      </div>

      <div className="distant-block">
        <h3>{t.ideologyDistantTitle}</h3>
        <div className="distant-grid distant-grid-single">
          <DistantCard
            name={distant.name}
            caption={distant.category}
            compatibility={distant.compatibility}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Escrever o CSS da página**

Criar `frontend/src/styles/results.css`. Só tokens, sem hex literal. Esqueleto com os blocos obrigatórios:

```css
/* Página de resultados: cor só mede — verde é afinidade, vermelho é
   distância, ink é estrutura. Nenhuma seção tem cor própria. */

/* ── Navegação lateral ─────────────────────────────────────────────── */
.results-nav {
  position: sticky;
  top: 24px;
  align-self: start;
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.results-nav-title {
  margin: 0 0 12px;
  font-size: 0.82rem;
  color: var(--text-soft);
}

.results-nav ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
}

.results-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.92rem;
  transition: background var(--dur-fast) var(--ease-out);
}

.results-nav a:hover { background: var(--ink-50); }

.results-nav a[data-active='true'] {
  background: var(--accent-soft);
  color: var(--accent-deep);
  font-weight: 600;
}

.results-nav-index {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  border: 1px solid currentColor;
  font-size: 0.72rem;
}

/* ── Tabs (atual / histórico) ──────────────────────────────────────── */
.results-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 16px;
  background: var(--ink-50);
  border-radius: var(--radius-md);
}

.results-tabs button {
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: background var(--dur-fast) var(--ease-out);
}

.results-tabs button[aria-selected='true'] {
  background: var(--surface);
  color: var(--text-strong);
  font-weight: 600;
  box-shadow: var(--shadow-xs);
}

/* ── Cards de categoria (peso 2: grade, hairline, sem sombra) ──────── */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}

.category-card {
  position: relative;
  padding: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  text-align: center;
}

.category-card img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
}

.category-badge {
  display: inline-block;
  margin-bottom: 12px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  color: var(--accent-deep);
  font-size: 0.74rem;
  font-weight: 600;
}

.category-score {
  display: block;
  margin-top: 8px;
  color: var(--accent-deep);
  font-weight: 700;
}

/* ── Cards de distância (peso 3: compacto, vermelho, sem imagem) ───── */
.distant-block { margin-top: 28px; }

.distant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 10px;
}

.distant-grid-single { grid-template-columns: minmax(210px, 320px); }

.distant-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  background: var(--critical-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.distant-card h4 { font-size: 0.97rem; }

.distant-card p {
  margin: 2px 0 0;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.distant-card-score {
  color: var(--critical-deep);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* ── Layout de duas colunas com a navegação ────────────────────────── */
@media (min-width: 1100px) {
  .results-layout-with-nav {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 232px;
    gap: 40px;
    align-items: start;
  }
}

@media (max-width: 1099px) {
  .results-nav { display: none; }
}
```

- [ ] **Step 7: Importar o CSS**

Em `frontend/src/main.tsx`, acrescentar a linha após o import de `app.css`:

```ts
import './styles/results.css';
```

- [ ] **Step 8: Verificar a tipagem**

Run: `cd frontend && npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/components/results frontend/src/styles/results.css frontend/src/main.tsx
git commit -m "feat(frontend): result section components"
```

---

## Task 8: Montar a página de resultados

**Files:**
- Modify: `frontend/src/App.tsx:1044-1114` (bloco `screen === 'results'`)
- Modify: `frontend/src/App.tsx:1152-1170` (função `tryNativeShare`)

**Interfaces:**
- Consumes: `ResultsNav`, `CountriesSection`, `PersonalitiesSection`, `IdeologiesSection` (Task 7); `QuizResult` (Task 6)
- Produces: a página final

### Ordem das seções (do spec)

1. Hero — ideologia + match + descrição
2. Os 12 eixos
3. Países — atual, histórico, 3 distantes
4. Personalidades — top-1, 3 por categoria, 3 distantes
5. Outras ideologias — as 3 + a mais distante
6. Compartilhar

- [ ] **Step 1: Importar os componentes novos**

No topo de `App.tsx`, junto dos outros imports de componentes:

```tsx
import { ResultsNav } from './components/results/ResultsNav';
import { CountriesSection } from './components/results/CountriesSection';
import { PersonalitiesSection } from './components/results/PersonalitiesSection';
import { IdeologiesSection } from './components/results/IdeologiesSection';
```

- [ ] **Step 2: Reescrever o corpo do bloco de resultados**

Substituir, dentro de `<section className="results-layout" id="resultados">`, tudo que vem depois do `</header>` (hoje: `IdeologyMatchCard`, seção de eixos, `CountryMatchCard`, `PersonalityMatchCard`, seção de outras correspondências) por:

```tsx
          <div className="results-layout-with-nav">
            <div className="results-main">
              <IdeologyMatchCard match={result.topMatch} featured />

              <section className="results-section results-section-axes" id="eixos">
                <div className="section-heading">
                  <span className="eyebrow">{t.axesSectionEyebrow}</span>
                  <h2>{t.axesSectionTitle}</h2>
                </div>
                <div className="axis-rows">
                  {(quiz?.axes ?? homeAxes).map((axis) => {
                    const axisResult = resultByAxis.get(axis.id);
                    return axisResult ? <AxisResultBar key={axis.id} axis={axis} result={axisResult} /> : null;
                  })}
                </div>
              </section>

              <CountriesSection
                current={result.topCountryMatch}
                historical={result.topHistoricalCountryMatch}
                distant={result.bottomCountryMatches}
              />

              <PersonalitiesSection
                top={result.topPersonalityMatch}
                byCategory={result.categoryPersonalityMatches}
                distant={result.bottomPersonalityMatches}
              />

              <IdeologiesSection
                others={result.matches.slice(1, 4)}
                distant={result.bottomIdeologyMatch}
              />
            </div>

            <ResultsNav />
          </div>
```

O `id="eixos"` já é usado pela home no elemento `hero-result-teaser` (`App.tsx:625`). Como as duas telas nunca aparecem juntas, não há conflito — mas conferir no navegador que o link âncora da navegação rola para a seção certa.

O bloco `results-cta` com os botões e o `<SupportSection />` permanecem onde estão, depois do `</div>` da grade.

- [ ] **Step 3: Verificar a tipagem e os testes**

Run: `cd frontend && npx tsc --noEmit && npm test`
Expected: sem erros de tipo; testes de `quizSelection` passam.

- [ ] **Step 4: Conferir no navegador**

```bash
cd frontend && npm run dev
```

Abrir `http://localhost:5173/results?est=72&rep=72&pod=72&imi=72&dip=72&int=72&eco=72&con=72&com=72&rel=72&mor=72&tec=72` (o backend precisa estar rodando: `cd backend && ./mvnw spring-boot:run`).

Conferir:
- as 6 seções aparecem na ordem do spec
- a navegação lateral destaca a seção visível e os links rolam até ela
- as tabs atual/histórico trocam o card de país
- os 3 cards de categoria mostram categorias diferentes entre si
- em 400px de largura a navegação some e nada estoura horizontalmente

- [ ] **Step 5: Atualizar a mensagem de compartilhamento**

Em `tryNativeShare`, a chamada `t.shareMessage(...)` continua válida — os campos que ela usa (`topMatch`, `topCountryMatch`, `topPersonalityMatch`) seguem existindo. Nenhuma mudança é necessária. Confirmar que `shareCard.ts` ainda compila e que o PNG continua sendo o resumo, não a página inteira:

Run: `cd frontend && npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat(results): assemble expanded results page"
```

---

## Task 9: Verificação final

**Files:** nenhum (só verificação)

- [ ] **Step 1: Suíte completa do backend**

Run: `cd backend && ./mvnw test`
Expected: só os 5 testes pré-existentes de centrismo/pragmatismo falham. Qualquer outra falha é regressão.

- [ ] **Step 2: Build do frontend**

Run: `cd frontend && npm run build`
Expected: `tsc --noEmit` limpo, build do Vite conclui, `generate-pages.mjs` roda sem erro.

- [ ] **Step 3: Conferir o diff inteiro**

```bash
git diff main --stat
```

Confirmar: nenhuma mudança em `ProfileMatchScorer.java`, `package.json` ou `pom.xml`; nada acrescentado ao fim de `app.css`.

- [ ] **Step 4: Conferir as mensagens de commit**

```bash
git log main..HEAD --format='%B' | grep -iE 'claude|co-authored|generated with|anthropic'
```

Expected: nenhuma saída. Se houver, reescrever com `git rebase -i` antes de encerrar.
