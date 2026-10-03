---
name: audit-list
description: Lista os perfis pendentes de auditoria em STATE.json e dispara subagentes de auditoria pergunta-a-pergunta em lotes de 6, para todos os catálogos ou um catálogo específico.
---

# /audit_list

Lista os perfis pendentes e dispara a auditoria em **lotes de 6** (em vez dos 15 padrão do
`profile-audit/README.md`) — use quando o usuário pedir explicitamente lotes menores/mais frequentes.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — o protocolo de prompt/validação/cálculo
de vetor/merge/`STATE.json`/arquivamento é o mesmo; só o tamanho do lote muda (6 em vez de 15).

## Execução

1. Leia `profile-audit/STATE.json`.
2. Se o usuário especificou um catálogo (`personality`/`ideology`/`country`), use só esse. Caso
   contrário, liste os três.
3. Para cada catálogo relevante, apresente ao usuário:
   - Quantos perfis estão em `pending` e quantos em `done` (e o total).
   - Os primeiros 6 IDs de `pending` — este será o próximo lote se o usuário mandar prosseguir.
4. Se o usuário confirmar o disparo (ou já tiver pedido para disparar direto, sem só listar):
   - Pegue os 6 primeiros IDs de `STATE.json.<catalog>.pending` (ou o restante, se houver menos de 6).
   - Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, mas com lote de **6** em vez
     de 15, usando a tabela de parâmetros por catálogo (mesma da seção "Os três catálogos" do README):

     | Catálogo | Metadados (fonte) | Perfis salvos (destino) | Campos do prompt |
     |---|---|---|---|
     | `personality` | `backend/src/main/resources/data/personalities.json` | `backend/src/main/resources/data/personality-profiles.json` (`personalityId`) | `id`, `name`, `role`, `lifespan`, `description` (+ `category` obrigatória no JSON, fora do prompt) |
     | `ideology` | `backend/src/main/resources/data/ideologies.json` | `backend/src/main/resources/data/ideology-profiles.json` (`ideologyId`) | `id`, `name`, `category`, `description` |
     | `country` | `backend/src/main/resources/data/countries.json` | `backend/src/main/resources/data/countries-profiles.json` (`countryId`) | `id`, `name`, `category`, `description` (+ `period` se `historical`) |

   - Gerar `prompts/<catalog>/<id>.txt` para cada um dos 6 perfis.
   - Disparar os **6 subagentes simultaneamente**, mesma mensagem, modelo de qualidade (nunca
     Haiku/rápido) — mesma regra crítica do README, só o número muda.
   - Validar as 6 saídas em `subagent-out/<catalog>/<id>.json`.
   - Calcular vetores e mesclar no arquivo de perfis correspondente.
   - **Revisar `religions` de cada perfil do lote** com o vetor novo: valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Ver "O campo `religions`" em `NEW_PROFILE.md`. Se o campo faltar, estiver errado pela regra, ou o vetor novo cair em `religiao` ≤ 35 com lista vazia, corrija no JSON de metadados PT e cite a mudança (antes → depois, com a razão) no resumo final. Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (país: igreja estatal e participação; personalidade: autodeclaração pública; ideologia: a doutrina, não a referência). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; marque o que não tiver base como provisório no resumo.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/<catalog>/<id>.json` (permanente) e limpar temporários (mantendo só um par
     de exemplo por catálogo).
5. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py <catalog> <id>`
   e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado
   (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   - **Perguntas de arquétipo:** a auditoria responde as 240 perguntas **e** as perguntas de arquétipo, como um usuário do quiz. O prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype`, o `validate.py` reprova se faltar, e o vetor mesclado (via `profile_vector.compute_vector`) soma as alternativas escolhidas como respostas extras, igual ao `ScoringService`. Liste as escolhas no resumo final. Ver "Perguntas de arquétipo" em `profile-audit/README.md`.
6. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior
   (percentual exato) e a revisão de `religions` e informe quantos perfis restam em `pending` naquele catálogo. **Pergunte
   explicitamente** se deve continuar para o próximo lote de 6 — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Mesmas regras da seção final de `profile-audit/README.md`: nunca disparo sequencial dentro de um
lote (sempre simultâneo), nunca modelo fraco, nunca misturar catálogos no mesmo lote, nunca copiar
respostas entre perfis parecidos, nunca apagar `answers/`.
