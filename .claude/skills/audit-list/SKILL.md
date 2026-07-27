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
     | `personality` | `backend/src/main/resources/data/personalities.json` | `backend/src/main/resources/data/personality-profiles.json` (`personalityId`) | `id`, `name`, `role`, `lifespan`, `description` |
     | `ideology` | `backend/src/main/resources/data/ideologies.json` | `backend/src/main/resources/data/ideology-profiles.json` (`ideologyId`) | `id`, `name`, `category`, `description` |
     | `country` | `backend/src/main/resources/data/countries.json` | `backend/src/main/resources/data/countries-profiles.json` (`countryId`) | `id`, `name`, `category`, `description` (+ `period` se `historical`) |

   - Gerar `prompts/<catalog>/<id>.txt` para cada um dos 6 perfis.
   - Disparar os **6 subagentes simultaneamente**, mesma mensagem, modelo de qualidade (nunca
     Haiku/rápido) — mesma regra crítica do README, só o número muda.
   - Validar as 6 saídas em `subagent-out/<catalog>/<id>.json`.
   - Calcular vetores e mesclar no arquivo de perfis correspondente.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/<catalog>/<id>.json` (permanente) e limpar temporários (mantendo só um par
     de exemplo por catálogo).
5. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py <catalog> <id>`
   e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado
   (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
6. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior
   (percentual exato) e informe quantos perfis restam em `pending` naquele catálogo. **Pergunte
   explicitamente** se deve continuar para o próximo lote de 6 — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Mesmas regras da seção final de `profile-audit/README.md`: nunca disparo sequencial dentro de um
lote (sempre simultâneo), nunca modelo fraco, nunca misturar catálogos no mesmo lote, nunca copiar
respostas entre perfis parecidos, nunca apagar `answers/`.
