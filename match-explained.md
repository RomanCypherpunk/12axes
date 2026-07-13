# 12 Axes - explicacao do matching

Este documento descreve a logica atual do backend para transformar respostas do quiz em eixos politicos e, depois, em correspondencias de ideologia, personalidade e pais. Use como referencia antes de pedir alteracoes em outros chats.

## Arquivos principais

- `backend/src/main/java/com/twelveaxes/controller/QuizController.java`
  - Exposes `/api/quiz`, `/api/results` e `/api/results/by-axes`.
- `backend/src/main/java/com/twelveaxes/service/ScoringService.java`
  - Transforma respostas em 12 `AxisResult`.
- `backend/src/main/java/com/twelveaxes/service/ProfileMatchScorer.java`
  - Formula central de compatibilidade, usada por ideologias, personalidades e paises.
- `backend/src/main/java/com/twelveaxes/service/IdeologyMatcherService.java`
  - Ranking, percentil e MMR para as 4 ideologias retornadas.
- `backend/src/main/java/com/twelveaxes/service/PersonalityMatcherService.java`
  - Ranking de personalidades; a API usa o top-1.
- `backend/src/main/java/com/twelveaxes/service/CountryMatcherService.java`
  - Ranking de paises; a API usa o top-1.
- `backend/src/main/java/com/twelveaxes/service/QuizDataService.java`
  - Carrega JSONs, traducoes e perfis canonicos.

## Fluxo da API

### `GET /api/quiz`

Retorna perguntas e opcoes de resposta.

Variantes:

- `short`: 3 perguntas por eixo.
- `extended`: 5 perguntas por eixo.
- `extreme`: usa o pool completo.

Idiomas:

- `pt` por padrao.
- `en`, `en-us`, `en-gb` viram `en`.
- Qualquer outro valor cai para `pt`.

### `POST /api/results`

Recebe respostas do quiz, calcula eixos e retorna:

- `axes`: os 12 eixos calculados.
- `topMatch`: primeira ideologia do ranking final.
- `matches`: 4 ideologias finais.
- `topCountryMatch`: pais mais compativel.
- `topPersonalityMatch`: personalidade mais compativel.

### `GET /api/results/by-axes?v=...`

Reconstrói um resultado compartilhado a partir de 12 valores `leftPercent`, separados por virgula, na ordem de `axes.json`.

Exemplo conceitual:

```text
/api/results/by-axes?v=48,35,70,58,53,44,55,54,58,34,34,43
```

Esse endpoint nao recalcula respostas; ele usa diretamente o vetor de eixos.

## Como respostas viram eixos

Cada resposta tem um valor normalizado:

```text
STRONGLY_AGREE    = 1.00
AGREE             = 0.75
NEUTRAL           = 0.50
DISAGREE          = 0.25
STRONGLY_DISAGREE = 0.00
```

Cada pergunta tem:

- `axisId`: eixo que ela mede.
- `agreePole`: polo para o qual a concordancia aponta.
- `weight`: peso da pergunta.

Para cada resposta:

```text
if agreePole == LEFT:
  leftScore = scoreTowardAgreement
else:
  leftScore = 1 - scoreTowardAgreement
```

O resultado de cada eixo e uma media ponderada:

```text
leftPercent = 100 * sum(leftScore * questionWeight) / sum(questionWeight)
rightPercent = 100 - leftPercent
```

Se um eixo nao recebeu resposta, ele fica neutro: `50`.

Intensidade exibida:

- distancia do centro `< 7.5`: equilibrado.
- `< 22.5`: inclinado.
- `< 37.5`: forte.
- `>= 37.5`: muito forte.

## Vetores de matching

O scorer trabalha com um vetor de 12 valores `leftPercent`, um por eixo:

```text
estrutura
representacao
poder
imigracao
diplomacia
intervencao
economia
controle
comercio
religiao
moral
tecnologia
```

O usuario vira vetor via `ProfileMatchScorer.userVectorFor(axisResults)`.

Os alvos vêm de:

- `data/ideology-profiles.json`
- `data/personality-profiles.json`
- `data/countries-profiles.json`

Fallbacks:

- Ideologia: usa `ideology-profiles.json`; se faltar, tenta `ideology.vector`; se faltar, vetor neutro.
- Personalidade: usa `personality-profiles.json`; se faltar, vetor neutro.
- Pais: usa `countries-profiles.json`; se faltar, tenta `country.vector`; se faltar, vetor neutro.

Na pratica, os testes exigem perfis explicitos para ideologias, paises e personalidades.

## Formula atual de compatibilidade

A formula fica em `ProfileMatchScorer`.

Hoje ela tem 3 componentes:

```text
compatibilidade =
  0.45 * axisSimilarity
+ 0.35 * directionSimilarity
+ 0.20 * magnitudeSimilarity
```

O resultado final e:

```text
round1(clamp(compatibilidade, 0, 100))
```

### 1. `axisSimilarity`

Pergunta: em quantos eixos os dois perfis batem?

Para cada eixo:

```text
diff = abs(userValue - targetValue)
similarity = max(0, 1 - (diff / 50)^2)
```

Isso e quadratico: diferencas pequenas quase nao punem; diferencas grandes punem muito.

Se usuario e alvo estao em lados opostos do centro no mesmo eixo, aplica uma penalidade suave:

```text
factor =
  1
- 0.45
* tanh(abs(userValue - 50) / 25)
* tanh(abs(targetValue - 50) / 25)
```

Depois:

```text
axisSimilarity = 100 * average(similarityPorEixo)
```

### 2. `directionSimilarity`

Pergunta: os vetores apontam para a mesma direcao ideologica?

O scorer centraliza os valores em torno de `50`:

```text
centered = value - 50
```

Depois calcula o cosseno entre vetor do usuario e vetor do alvo:

```text
cosine = dot(user, target) / (norm(user) * norm(target))
directionSimilarity = 50 + 50 * cosine
```

Interpretacao:

- `100`: mesma direcao.
- `50`: direcao indefinida ou ortogonal.
- `0`: direcao oposta.

Se um dos vetores e perfeitamente neutro, a direcao e indefinida e o componente volta `50`.

### 3. `magnitudeSimilarity`

Pergunta: os dois perfis têm intensidade parecida?

Esse componente existe para corrigir um bug real: usuario moderado recebia ideologia extrema com compatibilidade quase perfeita, porque o cosseno mede direcao e ignora intensidade.

Primeiro calcula a extremidade media:

```text
intensity = average(abs(value - 50))
```

Depois compara a intensidade do usuario e do alvo:

```text
magnitudeSimilarity = 100 - 2 * abs(userIntensity - targetIntensity)
```

Como a intensidade vai de `0` a `50`, o fator `2` coloca o resultado em escala `0..100`.

Exemplo:

- usuario com intensidade media `8`.
- alvo com intensidade media `8`.
- magnitude = `100`.

Outro exemplo:

- usuario com intensidade media `8`.
- alvo com intensidade media `28`.
- magnitude = `60`.

Isso impede que um usuario "morno" ganhe nota quase perfeita contra um perfil radical apenas por apontar para o mesmo lado.

## Caso neutro

Neutro contra neutro nao e `75` na formula atual. Agora e:

```text
0.45 * 100 + 0.35 * 50 + 0.20 * 100 = 82.5
```

Motivo:

- `axisSimilarity = 100`: os eixos sao identicos.
- `directionSimilarity = 50`: direcao indefinida.
- `magnitudeSimilarity = 100`: os dois têm intensidade zero.

## Percentil

Cada catalogo calcula percentil contra todos os scores daquele mesmo catalogo:

```text
percentile = 100 * count(score < compatibility) / catalogSize
```

Importante:

- Usa comparacao estrita `<`.
- Nao e uma probabilidade.
- Significa "mais compativel que X% do catalogo".

## Matching de ideologias

`IdeologyMatcherService.findMatches` faz quatro etapas:

1. Converte os eixos do usuario em vetor.
2. Calcula compatibilidade contra todas as ideologias.
3. Calcula percentil dentro do catalogo de ideologias.
4. Seleciona 4 ideologias com diversidade via MMR.

### Ranking base

Antes da diversidade, candidatos sao ordenados por:

```text
compatibility desc
name asc
```

### MMR

O objetivo do MMR e evitar que as 4 correspondencias sejam variacoes quase identicas da mesma ideia.

O primeiro selecionado e sempre o melhor candidato bruto.

Para os proximos, o score e:

```text
mmrScore =
  0.70 * candidate.compatibility
- 0.30 * redundancy
```

`redundancy` e a maior compatibilidade entre o vetor do candidato e os vetores ja selecionados.

Empates sao resolvidos por:

1. maior compatibilidade bruta.
2. nome alfabetico.

Depois da selecao diversa, a lista final e reordenada por compatibilidade decrescente antes de ir para a API. Portanto `matches` deve chegar ao frontend em ordem de similaridade.

### `findRankedMatches`

Existe tambem um metodo interno de ranking puro, sem MMR:

```text
findRankedMatches(axisResults, lang)
```

Ele retorna o top 4 bruto e e usado para testes/diagnostico. O fluxo normal da API usa `findMatches`.

## Matching de personalidades

`PersonalityMatcherService.findMatches`:

1. Calcula compatibilidade contra todas as personalidades.
2. Calcula percentil no catalogo de personalidades.
3. Ordena por compatibilidade desc e nome asc.
4. Retorna top 4.

A API atualmente usa apenas:

```text
findTopMatch(...)
```

Ou seja, o resultado publico inclui so a personalidade mais compativel.

## Matching de paises

`CountryMatcherService.findTopMatch`:

1. Calcula compatibilidade contra todos os paises.
2. Calcula percentil no catalogo de paises.
3. Ordena por compatibilidade desc e nome asc.
4. Retorna o primeiro.

Nao ha MMR para paises, porque a API retorna so um pais.

## Testes que protegem a logica

### `ProfileMatchScorerTest`

Protege:

- vetor identico = `100`.
- mesma direcao bate direcao oposta a distancia comparavel.
- penalidade de lado oposto muda continuamente.
- neutro usa formula derivada das constantes.
- usuario/alvo neutro mantem direcao como `50`.
- usuario morno prefere perfil moderado a perfil extremo perfeitamente alinhado.
- pesos somam `1.0`.

### `ScorerBenchmarkTest`

Benchmark intra-catalogo. Mede:

- recuperacao com ruido moderado.
- recuperacao com ruido forte.
- rejeicao de vetor oposto.
- rejeicao de perfis centrais para usuarios extremos.
- estabilidade do top-1 sob pequena mudanca.
- discriminacao entre primeiro e segundo.
- controle de inflacao de extremidade para usuarios mornos.

Ultima rodada apos o patch de magnitude:

```text
recovery10=80.8%
recovery15=49.8%
opposite=91.5%
center=94.5%
stability=96.0%
discrimination=4.02%
extremity=91.8%
```

O limite de `recovery15` fica em `49.0` porque a nova formula troca uma pequena perda sob ruido forte por controle melhor de extremidade.

### Testes de fluxo

- `IdeologyMatcherServiceTest`: perfis explicitos, vetor canonico, neutro, ordem final por compatibilidade e categorias esperadas.
- `QuizFlowAutomationTest`: contrato da API para variantes do quiz.
- `SharedResultsTest`: endpoint compartilhado por vetor de eixos.
- `IdeologyPersonalityMappingTest`: cada ideologia aponta para personalidade valida.

## Erros ja cometidos

### Confiar so em direcao e proximidade por eixo

O cosseno e cego a intensidade. Um usuario moderado e uma ideologia extrema podem apontar para a mesma direcao, e o cosseno vai dar quase `100`.

Foi o bug observado em producao: usuario com extremidade media baixa recebeu "Quarta Teoria Politica" com compatibilidade muito alta. O componente de magnitude existe para impedir esse tipo de inflacao.

### Tratar `compatibility` como probabilidade

`compatibility` e uma nota de proximidade no espaco dos 12 eixos, nao uma chance estatistica.

### Fixar numero magico em teste de fluxo

Valor absoluto de compatibilidade depende dos pesos da formula. Teste de API deve validar invariantes de comportamento; teste de formula deve derivar o valor esperado das constantes.

### Ordenar visualmente depois de aplicar MMR

MMR seleciona diversidade, mas a lista exibida deve estar em ordem de compatibilidade. O backend ja reordena a lista final com `byScoreThenName()` antes de montar `IdeologyMatch`.

## Como alterar a formula com seguranca

1. Alterar constantes ou componentes em `ProfileMatchScorer`.
2. Atualizar `ProfileMatchScorerTest` usando valores derivados das constantes.
3. Rodar `ScorerBenchmarkTest`.
4. Conferir trade-off: recuperacao, oposto, centro, estabilidade, discriminacao e extremidade.
5. Rodar fluxo de API e shared results.
6. Atualizar este documento com a formula e os numeros novos do benchmark.

Comando usado nesta revisao:

```powershell
..\.tools\apache-maven-3.9.15\bin\mvn.cmd "-Dtest=ProfileMatchScorerTest,ScorerBenchmarkTest,IdeologyMatcherServiceTest,QuizFlowAutomationTest,SharedResultsTest,IdeologyPersonalityMappingTest" test
```
