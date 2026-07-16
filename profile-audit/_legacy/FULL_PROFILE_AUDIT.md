# Auditoria completa de profiles

Este documento substitui a triagem anterior. A meta desta estrutura e permitir
uma auditoria 100% verificavel:

```text
527 profiles x 240 perguntas = 126.480 respostas individuais
```

Cada resposta deve ser escolhida entre as 5 alternativas reais do quiz:

```text
CT = Concordo totalmente
C  = Concordo
N  = Neutro
D  = Discordo
DT = Discordo totalmente
```

## Principio

O vetor salvo em cada profile nao deve ser ajustado por impressao geral. Ele
deve cair das respostas que aquele profile daria as perguntas reais em
`backend/src/main/resources/data/questions-pool.json`.

Para cada profile:

```text
240 respostas individuais
12 eixos
20 perguntas por eixo
1 media calculada por eixo
```

O calculo segue a mesma logica do `ScoringService`:

```text
CT = 1.00 de concordancia
C  = 0.75 de concordancia
N  = 0.50 de concordancia
D  = 0.25 de concordancia
DT = 0.00 de concordancia
```

Se a pergunta tem `agreePole = LEFT`, concordar aumenta o valor do polo
esquerdo. Se tem `agreePole = RIGHT`, concordar diminui o valor do polo
esquerdo.

## Arquivos da estrutura

```text
profile-audit/FULL_PROFILE_AUDIT.md
profile-audit/PROFILE_FULL_AUDIT_QUEUE.json
profile-audit/PROFILE_FULL_AUDIT_QUEUE.md
profile-audit/PROFILE_FULL_AUDIT_ANSWERS.jsonl
profile-audit/PROFILE_FULL_AUDIT_RESULTS.json
profile-audit/PROFILE_FULL_AUDIT_REPORT.md
profile-audit/PROFILE_FULL_AUDIT_RESPONSE_TABLES.md
profile-audit/PROFILE_FULL_AUDIT_DUPLICATE_SEQUENCES.md
profile-audit/scripts/full-audit-lib.mjs
profile-audit/scripts/generate-full-profile-audit.mjs
profile-audit/scripts/record-full-axis-answers.mjs
profile-audit/scripts/calculate-full-profile-audit.mjs
profile-audit/scripts/render-answer-tables.mjs
profile-audit/scripts/find-duplicate-answer-sequences.mjs
```

## Fila

A fila trabalha no nivel `profile + eixo`.

Uma unidade da fila equivale a:

```text
1 profile
1 eixo
20 perguntas
20 respostas
1 media calculada
```

Totais esperados:

```text
527 profiles
6.324 unidades de eixo
126.480 respostas individuais
```

Os lotes sao gerados com 5 profiles por lote por padrao. Como cada profile tem
12 eixos, um lote normal tem 60 unidades de eixo e 1.200 respostas individuais.

## Arquivo de respostas

As respostas ficam em `profile-audit/PROFILE_FULL_AUDIT_ANSWERS.jsonl`.

Cada linha representa uma resposta individual:

```json
{"catalog":"ideology","profileId":"fascismo","axisId":"controle","questionId":"controle_01","answer":"C","answerLabel":"Concordo","agreePole":"LEFT","agreementScore":0.75,"leftScore":0.75,"weight":1,"auditedAt":"2026-07-13T00:00:00.000Z"}
```

Esse formato e propositalmente redundante. Ele permite auditar uma pergunta
isolada, recalcular um eixo e reconstruir todo o vetor do profile.

## Como gerar a fila

```powershell
node profile-audit/scripts/generate-full-profile-audit.mjs
```

Opcionalmente, defina quantos profiles entram em cada lote:

```powershell
node profile-audit/scripts/generate-full-profile-audit.mjs 3
```

## Como registrar um eixo auditado

Use o script abaixo com exatamente 20 respostas na ordem das perguntas daquele
eixo em `questions-pool.json`:

```powershell
node profile-audit/scripts/record-full-axis-answers.mjs ideology fascismo controle "CT,C,N,D,DT,CT,C,N,D,DT,CT,C,N,D,DT,CT,C,N,D,DT" "nota opcional"
```

Formato:

```text
node profile-audit/scripts/record-full-axis-answers.mjs <catalog> <profileId> <axisId> "<20 respostas>" "nota opcional"
```

Catalogos validos:

```text
ideology
country
personality
```

Eixos validos:

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

## Como recalcular tudo

```powershell
node profile-audit/scripts/calculate-full-profile-audit.mjs
```

Saidas:

```text
profile-audit/PROFILE_FULL_AUDIT_RESULTS.json
profile-audit/PROFILE_FULL_AUDIT_REPORT.md
```

O relatorio mostra:

```text
quantas respostas existem
quantas unidades de eixo estao completas
quantos profiles tem 12 eixos completos
candidatos a patch com abs(delta) >= 7.5
erros estruturais
```

## Como exportar tabelas de respostas

Todo eixo alterado deve ter uma tabela verificavel com as 20 perguntas, a
alternativa marcada, o `agreePole` e o `leftScore` usado no calculo:

```powershell
node profile-audit/scripts/render-answer-tables.mjs ideology:fascismo.economia ideology:neoliberalismo.controle
```

Saida:

```text
profile-audit/PROFILE_FULL_AUDIT_RESPONSE_TABLES.md
```

## Como detectar sequencias reutilizadas

Sequencias identicas podem ser legitimas, mas nao podem ser um atalho. Antes de
aplicar um lote, rode:

```powershell
node profile-audit/scripts/find-duplicate-answer-sequences.mjs 2
```

Saida:

```text
profile-audit/PROFILE_FULL_AUDIT_DUPLICATE_SEQUENCES.md
```

Se dois ou mais profiles tiverem a mesma sequencia completa de 20 respostas em
um eixo, a igualdade deve ser revisada lado a lado. Se continuar igual, a nota
do eixo precisa explicar por que aqueles profiles realmente responderiam igual.

## Regra para aplicar patch nos profiles

Um valor em `*-profiles.json` so deve ser alterado quando:

```text
1. as 20 respostas daquele eixo foram registradas;
2. o valor calculado diverge do valor salvo de forma relevante;
3. a sequencia das 20 respostas foi revisada;
4. a tabela das 20 respostas foi exportada para eixos alterados;
5. sequencias completas repetidas foram checadas no relatorio de duplicatas;
6. a justificativa foi registrada no relatorio.
```

Threshold recomendado para abrir revisao:

```text
abs(delta) >= 7.5
```

Isso acompanha as faixas de intensidade documentadas em
`axes-explained.md`.

## Status atual

Esta estrutura foi criada para a auditoria completa. A triagem anterior por lote
foi descartada como evidencia final, porque ela nao registrava as 126.480
respostas individuais.

Enquanto `profile-audit/PROFILE_FULL_AUDIT_ANSWERS.jsonl` estiver vazio, nenhum profile deve
ser considerado auditado pergunta a pergunta.
