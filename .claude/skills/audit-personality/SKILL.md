---
name: audit-personality
description: Reaudita perfis do catálogo personality (figuras históricas/públicas) do projeto 12axes, um lote de 15 por vez, seguindo o protocolo pergunta-a-pergunta de profile-audit/README.md.
---

# /audit_personality

Reaudita perfis já existentes do catálogo **personality**.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — ele é autossuficiente e contém:
- A lista dos 12 eixos e o que cada um mede.
- O template exato do prompt de auditoria (cabeçalho + `questions-template.txt`).
- A regra de disparo simultâneo dos 15 subagentes.
- A validação das 15 saídas.
- O script Python de cálculo do vetor e merge.
- A atualização de `STATE.json` e arquivamento em `answers/`.

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `personality` |
| Metadados (fonte) | `backend/src/main/resources/data/personalities.json` |
| Perfis salvos (destino) | `backend/src/main/resources/data/personality-profiles.json` (chave `personalityId`) |
| Campos usados no prompt | `id`, `name`, `role`, `lifespan`, `description` |
| `category` | não entra no prompt de auditoria, mas deve existir e ser um dos 8 valores (ver `NEW_PROFILE.md`) |
| `religions` | não entra no prompt, mas é revisado a cada lote (ver Execução) |
| Tipo de perfil no cabeçalho do prompt | `"figura histórica/pública"` |

## Execução

1. Leia `STATE.json.personality.pending`. Se vazio, informe ao usuário que não há mais nada pendente neste catálogo e pare.
2. Pegue os 15 primeiros IDs de `pending` (ou o restante, se houver menos de 15).
3. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, usando os parâmetros da tabela acima:
   - **Antes de gerar qualquer prompt**: para cada ID do lote que seja pessoa viva e politicamente
     ativa (candidato/titular de cargo em mandato ou campanha corrente), rode a checklist de
     "Pesquisa aprofundada obrigatória para personalidades vivas/contemporâneas" em
     `profile-audit/NEW_PROFILE.md` (Passo 0) para confirmar se a `description` atual em
     `personalities.json` ainda reflete a posição mais recente da pessoa. Se estiver desatualizada,
     atualize `personalities.json`/`i18n/en/personalities.json` **antes** de gerar o prompt — não
     reaudite com uma description que você já sabe estar desatualizada. **Ao reescrever, respeite o
     tamanho padrão do catálogo: ~30 palavras / ~220 caracteres, teto de 45 palavras / 280
     caracteres** (ver tabela em `NEW_PROFILE.md`). Atualizar não é motivo para a description
     crescer — ao acrescentar um fato novo, corte outro menos importante. Confira a contagem com
     `len(desc)` e `len(desc.split())` antes de salvar, em PT e EN.
   - Conferir que cada perfil do lote tem `category` (um dos 8 valores fechados). Perfis antigos
     sem o campo, ou classificados de forma claramente errada pela leitura que a auditoria
     acabou de fazer, devem ser corrigidos em `personalities.json` — `category` vive só no PT.
     Não recategorize por conta própria só porque o `role` sugere outra coisa: `role` descreve,
     `category` agrupa.
   - Gerar `prompts/personality/<id>.txt` para cada perfil do lote.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as 15 saídas rodando `python profile-audit/validate.py personality <id>` em cada uma.
     Ele checa forma, taxa de neutros e conteúdo (direção dos eixos, duplicata, coerência com as
     ideologias que declaram o perfil). **Leia os avisos, não só o código de saída** — ver "Modos de
     falha conhecidos" no README. Se reprovar, relance só aquele subagente dizendo qual checagem
     falhou e quais eixos estavam errados.
   - Calcular vetores e mesclar em `personality-profiles.json`.
   - **Revisar `religions` de cada perfil do lote** com o vetor novo: valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Ver "O campo `religions`" em `NEW_PROFILE.md`. Se o campo faltar, estiver errado pela regra, ou o vetor novo cair em `religiao` ≤ 35 com lista vazia, corrija no JSON de metadados PT e cite a mudança (antes → depois, com a razão) no resumo final. Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (personalidade: autodeclaração pública > pertencimento formal > batismo > contexto, que é sempre provisório; conversão no meio da carreira = as duas; anglicano = `protestant`; Pais da Igreja = as três; fé em disputa = as duas). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; marque o que não tiver base como provisório no resumo.
   - **Livro**: para cada perfil do lote que ainda **não** tem entrada em `backend/src/main/resources/data/books.json` (um livro por personalidade; nunca duplique nem troque o existente sem o usuário pedir), conferir se a pessoa escreveu um livro relevante e adicioná-lo:
   - Só entra obra **escrita pela própria personalidade** e sobre política, economia, filosofia política ou tema diretamente relacionado (religião/sociedade só quando a obra tem peso político, ex.: *Rerum Novarum*, *A Cidade de Deus*). Ficção sem peso político, autoajuda, ciência pura e memórias sem conteúdo político não entram. Sem obra assim, **não adicione nada** e diga isso no resumo; nunca invente um livro.
   - Com mais de uma obra, escolha a mais popular/relevante/importante para o pensamento político da pessoa.
   - Formato (mesmo dos demais itens; `year` = primeira publicação, negativo para a.C.; `url` fica vazio, o usuário preenche os links de afiliado):
     `{ "personalityId": "<id>", "title": { "pt": "<título da edição brasileira>", "en": "<título em inglês>" }, "year": <ano>, "url": { "pt": "", "en": "" } }`
   - `title.pt` = título com que a obra circula no Brasil; sem tradução, repita o original. `title.en` = título em inglês; sem tradução para o inglês, repita o original.
   - Não inclua obras de propaganda de ódio (ex.: *Mein Kampf*); na dúvida, pergunte ao usuário.
   - Adicione ao final do array, mantenha o JSON válido (`python -c "import json;json.load(open('backend/src/main/resources/data/books.json',encoding='utf-8'))"`) e cite o livro escolhido (ou a ausência) no resumo final.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/personality/<id>.json` (permanente, nunca apagar) e limpar temporários (mantendo só um par de exemplo em `prompts/personality/` + `subagent-out/personality/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py personality <id>` e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   - **Perguntas de arquétipo:** a auditoria responde as 240 perguntas **e** as perguntas de arquétipo, como um usuário do quiz. O prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype`, o `validate.py` reprova se faltar, e o vetor mesclado (via `profile_vector.compute_vector`) soma as alternativas escolhidas como respostas extras, igual ao `ScoringService`. Liste as escolhas no resumo final. Ver "Perguntas de arquétipo" em `profile-audit/README.md`.
5. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior (percentual exato), a revisão de `religions` e o livro adicionado a `books.json` (ou por que nenhum) e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
