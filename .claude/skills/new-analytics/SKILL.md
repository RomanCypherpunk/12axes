---
name: new-analytics
description: Gera uma planilha Excel com o ranking de ideologias, personalidades e países mais "tirados" no quiz, a partir de exports de pageviews do Umami (CSV de fullPath), replicando o algoritmo real de match do backend (ProfileMatchScorer).
---

# /new_analytics

Recebe um ou mais CSVs de export do Umami (relatório "Full Path" / páginas mais visitadas) e produz
uma planilha `.xlsx` com o ranking de ideologias, personalidades e países que o quiz mais "entregou"
como resultado — usando o **mesmo algoritmo de compatibilidade do backend**, não uma aproximação.

## Quando usar

O usuário pede algo como "quais os perfis mais tirados no quiz", "analytics do umami", "ranking de
ideologias/países/personalidades a partir dos acessos" — geralmente anexando um ou mais CSVs
exportados do Umami com colunas `name,pageviews,visitors,visits,bounces,totaltime`, onde `name` é o
path acessado (ex: `/results?est=60&rep=65&pod=45...`).

## Por que não dá pra simplesmente contar URLs

O CSV do Umami só tem o path e métricas de tráfego — não diz qual ideologia/personalidade/país o
usuário recebeu. Isso exige rodar o **mesmo cálculo de compatibilidade** que o backend roda ao vivo,
contra os mesmos catálogos, para cada combinação de eixos observada.

## Passo 0 — Confirme a lógica de match ainda é a mesma

Antes de codar, releia estes arquivos (podem ter mudado desde a última vez que esta skill rodou):

- `backend/src/main/java/com/twelveaxes/service/ProfileMatchScorer.java` — a fórmula de
  compatibilidade (`compatibility()`). Hoje é uma soma ponderada de 4 componentes:
  - `axisSimilarity` (42%): por eixo, `1 - ((diff/50)^2)`, com penalidade extra via `tanh` quando
    usuário e alvo estão em lados opostos do centro (50) num mesmo eixo.
  - `directionSimilarity` (33%): cosseno entre os vetores centrados em 50.
  - `magnitudeSimilarity` (18%): compara a "intensidade" média (distância média do centro) dos dois
    vetores.
  - `outlierSimilarity` (7%): penaliza com base no eixo de maior diferença (`maxDiff/100`, expoente
    2.5).
  - Resultado: `clamp(0,100)` e arredondado a 1 casa decimal.
- `backend/src/main/resources/data/axes.json` — confirma os 12 eixos e seus ids internos.
- `backend/src/main/java/com/twelveaxes/service/IdeologyMatcherService.java`,
  `PersonalityMatcherService.java`, `CountryMatcherService.java` — confirma que o match é **top-1 por
  categoria** (ideologia, personalidade, país são calculados separadamente, cada um contra seu próprio
  catálogo).

Se algum desses arquivos tiver mudado a fórmula/pesos, **atualize o script desta skill de acordo**
antes de rodar — não confie cegamente no que está descrito aqui.

## Passo 1 — Mapeamento de parâmetros de URL para eixos

Os parâmetros da query string `/results?est=..&rep=..&pod=..&imi=..&dip=..&int=..&eco=..&con=..&com=..&rel=..&mor=..&tec=..`
mapeiam para os ids internos dos eixos (confirme contra `axes.json`):

| param | axis id |
|---|---|
| est | estrutura |
| rep | representacao |
| pod | poder |
| imi | imigracao |
| dip | diplomacia |
| int | intervencao |
| eco | economia |
| con | controle |
| com | comercio |
| rel | religiao |
| mor | moral |
| tec | tecnologia |

Cada valor no CSV é 0–100 (o "rightPercent" do eixo).

## Passo 2 — Onde estão os catálogos

Todos em `backend/src/main/resources/data/`:

- Vetores: `ideology-profiles.json` (campo `ideologyId` + `vector`), `personality-profiles.json`
  (`personalityId` + `vector`), `countries-profiles.json` (`countryId` + `vector`).
- Nomes para exibição: `ideologies.json`, `personalities.json`, `countries.json` (campo `id` + `name`).

## Passo 3 — Localizar e preparar os CSVs de entrada

1. Se o usuário colou o conteúdo do CSV direto na conversa (em vez de anexar um arquivo em disco),
   **não retranscreva manualmente linha por linha** para arquivos grandes (centenas/milhares de
   linhas) — o risco de erro silencioso é alto. Peça para o usuário salvar os arquivos numa pasta em
   disco (sugestão: `analytics/` na raiz do projeto — já está no `.gitignore`) e aguarde confirmação
   antes de prosseguir. Só retranscreva manualmente se o arquivo for pequeno (poucas dezenas de
   linhas) ou se o usuário pedir explicitamente para aceitar esse risco.
2. Pode haver **múltiplos CSVs sobrepostos** (ex: exports do Umami em janelas de tempo diferentes,
   tipo "todo o período", "90 dias", "30 dias", "7 dias" — cada um cumulativo, não aditivo). Confira
   isso olhando o valor de pageviews da linha `/` em cada arquivo: se forem diferentes entre arquivos,
   são exports sobrepostos, não períodos distintos. Trate a entrada como **união de todos os arquivos
   fornecidos**, deduplicando globalmente.

## Passo 4 — Rodar a análise

Não existe `package.json` na raiz do projeto nem dependência de `xlsx` instalada — configure um
projeto Node throwaway na scratchpad (não no repositório):

```bash
cd <scratchpad>
npm init -y
npm install xlsx@0.18.5
```

Escreva um script Node (`analyze.js`) que:

1. Lê todos os CSVs de entrada, faz parse simples (cuidado: o campo `name` nunca contém vírgula neste
   dataset — os separadores de query string são `&`/`=`, então pode pegar os últimos 5 campos numéricos
   pela direita e tratar o resto como o path).
2. Deduplica **globalmente por `name` (a URL/path)** — cada URL única conta 1 acesso, mesmo que apareça
   em vários arquivos ou repetida (isso é uma exigência recorrente do usuário: "conte apenas um acesso
   por url/linha").
3. Filtra só paths que comecem com `/results` e tenham query string com pelo menos um dos 12 params
   de eixo (ignora `/`, `/en`, `/#guia-eixos`, `/#espectro-politico`, assets estáticos, links só com
   `utm_source`/`fbclid` sem eixos, etc.).
4. Para cada URL única de resultado, monta o vetor de 12 eixos (valores ausentes de um eixo devem
   usar o mesmo default do backend, que é o centro = 50.0 — confirme em `ProfileMatchScorer`).
5. Porta a função `compatibility()` do Java para JS **exatamente** (mesmas constantes/pesos/fórmulas
   do Passo 0) e usa para achar o top-1 de cada catálogo (ideologia, personalidade, país)
   separadamente.
6. Gera um `.xlsx` com `xlsx` (SheetJS) com estas abas:
   - **Resumo**: arquivos processados, total de URLs únicas, total de resultados de quiz únicos,
     contagem de perfis distintos obtidos em cada categoria.
   - **Ideologias**: ranking (posição, nome, id, contagem de acessos únicos, % do total), ordenado
     por contagem decrescente.
   - **Personalidades**: idem.
   - **Países**: idem.
   - **Detalhe por URL**: uma linha por URL única de resultado, com pageviews brutos (só para
     referência, não usado na contagem), e os 3 matches + scores de compatibilidade.

## Passo 5 — Entregar

1. Salve o `.xlsx` final na pasta `analytics/` do projeto (já gitignored) e informe o caminho absoluto
   ao usuário.
2. Reporte um resumo: quantas URLs únicas de resultado foram processadas, e o top 3 de cada categoria
   (ideologia/personalidade/país) com suas contagens.
3. **Valide sanidade antes de entregar**: pegue 1–2 URLs de alto tráfego, confira manualmente que o
   score de compatibilidade do top-1 faz sentido (tipicamente >85% para o melhor match quando os eixos
   do usuário batem claramente com um perfil do catálogo). Scores muito baixos em todos os matches de
   uma URL round podem indicar bug no parsing do vetor.

## Regras que não podem ser quebradas

- Nunca aproxime o algoritmo de match (ex: distância euclidiana simples) — sempre porte a fórmula
  exata de `ProfileMatchScorer.java`, incluindo pesos e a penalidade de lado oposto. Aproximações
  mudam o ranking final.
- Nunca conte o mesmo `name`/URL mais de uma vez, mesmo que apareça em vários arquivos de entrada ou
  repetida dentro do mesmo arquivo.
- Nunca modifique os arquivos de dados do backend (`backend/src/main/resources/data/*.json`) — a
  skill é somente leitura sobre eles.
- Nunca commite CSVs de analytics ou o `.xlsx` gerado no git (a pasta `analytics/` já está no
  `.gitignore` — mantenha assim).
