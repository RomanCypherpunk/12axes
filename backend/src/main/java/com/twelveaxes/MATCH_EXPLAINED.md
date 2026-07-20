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
  - Ranking e percentil para as 4 ideologias retornadas.
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

Hoje ela tem 4 componentes:

```text
compatibilidade =
  0.42 * axisSimilarity
+ 0.33 * directionSimilarity
+ 0.18 * magnitudeSimilarity
+ 0.07 * outlierSimilarity
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

### 4. `outlierSimilarity`

Pergunta: existe algum eixo isolado onde usuario e alvo divergem muito, mesmo que a media geral va bem?

Esse componente existe para o seguinte problema: um perfil pode ter compatibilidade alta na media (11 dos 12 eixos proximos) e ainda assim ter 1 eixo com diferenca enorme (ex.: usuario liberal na economia vs. alvo com economia totalmente estatizada). Os outros 3 componentes diluem esse outlier na media geral e o usuario ve uma nota alta para um perfil que diverge muito dele nesse eixo especifico.

Primeiro calcula a maior diferenca absoluta entre os dois vetores, em qualquer eixo:

```text
maxDiff = max(abs(userValue - targetValue)) para todo eixo
```

Depois converte isso em uma nota, com queda suave (nao e um corte binario):

```text
outlierSimilarity = 100 * max(0, 1 - (maxDiff / 100)^2.5)
```

O expoente `2.5` deixa a penalidade branda para diffs moderados (ate uns 40-50 pontos) e mais dura conforme o diff se aproxima de 100. Diferente de um filtro por limiar, isso nunca remove um perfil do ranking: so reduz a nota dele proporcionalmente ao pior eixo, permitindo que o perfil ainda vença se for o melhor candidato disponivel nos outros 3 componentes.

Esse componente tem peso baixo (`0.07`) de proposito: ele deve desempatar e suavizar outliers, nao dominar a formula. Pesos mais altos (testados em ate `0.20`) prejudicam a recuperacao do proprio perfil sob ruido (`ScorerBenchmarkTest`), porque penalizam demais qualquer eixo que receba ruido moderado.

## Caso neutro

Neutro contra neutro nao e `75` na formula atual. Agora e:

```text
0.42 * 100 + 0.33 * 50 + 0.18 * 100 + 0.07 * 100 = 84.5
```

Motivo:

- `axisSimilarity = 100`: os eixos sao identicos.
- `directionSimilarity = 50`: direcao indefinida.
- `magnitudeSimilarity = 100`: os dois têm intensidade zero.
- `outlierSimilarity = 100`: maior diferenca entre eixos e zero.

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
4. Retorna o top 4 bruto por compatibilidade.

### Ranking base

Candidatos sao ordenados por:

```text
compatibility desc
name asc
```

### `findRankedMatches`

Existe tambem um metodo interno de ranking puro:

```text
findRankedMatches(axisResults, lang)
```

Ele retorna o top 4 bruto e hoje e equivalente ao fluxo normal da API.

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
- um outlier extremo em 1 eixo isolado reduz a nota mesmo com os outros 11 eixos identicos.
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

Ultima rodada apos o patch de outlier (4o componente), medida sobre o catalogo atual:

```text
recovery10=72.6%
recovery15=53.3%
opposite=89.8%
center=88.0%
stability=96.9%
discrimination=3.48%
extremity=91.8%
```

**Nota de 2026-07-17**: o `recovery10` ja estava abaixo do limite `MIN_RECOVERY_SIGMA_10_PERCENT = 77.0` no `main`, antes do patch de outlier (media em `71.7%`). O catalogo cresceu desde a ultima calibracao desses limites e o teste ficou vermelho por causa disso, nao por causa do patch — o patch de outlier na verdade melhora o recovery10 (`71.7% -> 72.6%`). Os limites do benchmark (e o teste `neutralAnswersFavorCentrismo` / `neutralAnswersProduceCentrism`, que tambem falha no `main` porque `Monarquismo Constitucional` ficou mais proximo do centro que `Centrismo`) precisam de uma recalibracao separada, fora do escopo desta mudanca de formula.

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

### Confundir ranking bruto com ranking diversificado

Hoje a API de ideologias retorna ranking bruto. Se no futuro voltar a existir uma camada de diversidade ou curadoria visual, isso deve ser exposto separadamente para nao mascarar a ordem real de compatibilidade.

### Descartar perfil por limiar de diferenca em 1 eixo

Foi cogitado (e simulado, nao implementado) um corte binario: remover do ranking qualquer perfil com `diff > 60` (ou `70`) em algum eixo. Simulacoes mostraram que isso descarta entre 45% e 100% do catalogo dependendo do perfil do usuario, e o pior caso e justamente o usuario coerente e extremo (respostas fortes mas nao contraditorias): o corte remove o melhor candidato objetivo (ex.: Coreia do Norte para um usuario extremo-estatista) e o substitui por um candidato com compatibilidade agregada menor, so porque ele nao tem nenhum eixo isolado acima do limiar. Um corte binario sempre cria um penhasco artificial perto do limiar escolhido, qualquer que seja o valor.

O componente `outlierSimilarity` foi escolhido no lugar do corte porque penaliza o outlier de forma continua, sem nunca zerar um candidato — ele pode cair no ranking, mas nao desaparece, e ainda vence quando e genuinamente o melhor candidato disponivel.

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
