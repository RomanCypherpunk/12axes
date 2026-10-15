---
name: audit-party
description: Reaudita perfis do catálogo party (partidos, movimentos, casas dinásticas, organizações) do projeto 12axes, um lote de 15 por vez, seguindo o protocolo pergunta-a-pergunta de profile-audit/README.md.
---

# /audit_party

Reaudita perfis já existentes do catálogo **party**.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — autossuficiente, contém a lista dos 12 eixos, o template exato do prompt, a regra de disparo simultâneo, a validação, o script de cálculo/merge do vetor e a atualização de `STATE.json`/`answers/`.

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `party` |
| Metadados (fonte) | `backend/src/main/resources/data/parties.json` |
| Perfis salvos (destino) | `backend/src/main/resources/data/parties-profiles.json` (chave `partyId`) |
| Campos usados no prompt | `id`, `name`, `category`, país associado (`countryId` → nome, só contexto), `historical`/`period`, `description` |
| `religions` | não entra no prompt, mas é revisado a cada lote (ver Execução) |
| Tipo de perfil no cabeçalho do prompt | `"partido/organização política"` |

**Nota `historical`:** perfis com `"historical": true` representam a organização num período específico; inclua o período no prompt para o subagente responder como a organização daquela época, nunca como a atual (ex.: Partido Republicano da era New Deal, não o de Trump).

## Execução

1. Leia `STATE.json.party.pending`. Se vazio, informe ao usuário que não há mais nada pendente neste catálogo e pare.
2. Pegue os 15 primeiros IDs de `pending` (ou o restante, se houver menos de 15).
3. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, usando os parâmetros da tabela acima:
   - Gerar `prompts/party/<id>.txt` para cada perfil do lote. **Regra de partido/organização: responda pela PRÁTICA e pelas IDEIAS.** O prompt deve conter a instrução de que o subagente responde como o próprio partido/grupo/organização pela sua prática real (no governo, a política efetiva; na oposição ou na clandestinidade, a ação e a estratégia; para grupo armado, a prática e a doutrina declarada) e pelas ideias e valores programáticos, e não pelo que críticos, apoiadores isolados ou a população pensam; em perfil histórico vale o período; em `representacao`, democracia interna e eleições formais não contam se, no poder, o partido elimina a oposição, a imprensa livre ou a alternância. Acrescente um parágrafo "FATO PÚBLICO E CALIBRAÇÃO" com a prática concreta, as tensões internas e o que diferencia o perfil dos vizinhos prováveis (outras eras da mesma organização, partidos aliados), como contexto e nunca como alvo numérico.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as saídas com `python profile-audit/validate.py party <id>`. **Leia os avisos, não só o código de saída**: duplicata de outro partido (principalmente da mesma organização em outra era), neutros demais, eixo na direção errada contra as âncoras. Se reprovar, relance só aquele subagente dizendo qual checagem falhou e quais eixos estavam errados.
   - Calcular vetores e mesclar em `parties-profiles.json`.
   - **Revisar `religions` de cada perfil do lote** com o vetor novo (mesma regra dos demais catálogos): `religiao` ≤ 35 exige ao menos uma marca; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil. Em partido/organização, marque a religião que é parte da doutrina, da base ou da identidade (Al-Qaeda `["islam"]`, casa dinástica católica `["catholic"]`). O valor vem de pesquisa, nunca do vetor. Corrija em `parties.json` (só PT) e cite a mudança (antes → depois, com a razão) no resumo final. Vertente cristã: subseção "Vertente cristã" de `NEW_PROFILE.md`.
   - Conferir que `countryId`, `category`, `historical`/`period` e o logo (1:1 em `frontend/public/parties/logos/`) continuam válidos.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/party/<id>.json` (permanente, nunca apagar; a versão anterior vai para `answers/party/_previous/`) e limpar temporários (mantendo só um par de exemplo em `prompts/party/` + `subagent-out/party/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py party <id>` e leia as 2 personalidades, 2 ideologias, 2 países e 2 partidos/organizações mais compatíveis (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   - **Perguntas de arquétipo:** a auditoria responde as 240 perguntas **e** as de arquétipo (bloco `archetype`); liste as escolhas no resumo final.
5. Ao final, apresente por perfil um resumo com os matches (percentual exato), a revisão de `religions` e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
