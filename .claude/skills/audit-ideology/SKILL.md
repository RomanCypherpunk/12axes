---
name: audit-ideology
description: Reaudita perfis do catálogo ideology (ideologias políticas) do projeto 12axes, um lote de 15 por vez, seguindo o protocolo pergunta-a-pergunta de profile-audit/README.md.
---

# /audit_ideology

Reaudita perfis já existentes do catálogo **ideology**.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — autossuficiente, contém a lista dos 12 eixos, o template exato do prompt, a regra de disparo simultâneo, a validação, o script de cálculo/merge do vetor e a atualização de `STATE.json`/`answers/`.

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `ideology` |
| Metadados (fonte) | `backend/src/main/resources/data/ideologies.json` |
| Perfis salvos (destino) | `backend/src/main/resources/data/ideology-profiles.json` (chave `ideologyId`) |
| Campos usados no prompt | `id`, `name`, `category`, `description` |
| Tipo de perfil no cabeçalho do prompt | `"ideologia política"` |

## Execução

1. Leia `STATE.json.ideology.pending`. Se vazio, informe ao usuário que não há mais nada pendente neste catálogo e pare.
2. Pegue os 15 primeiros IDs de `pending` (ou o restante, se houver menos de 15).
3. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, usando os parâmetros da tabela acima:
   - Gerar `prompts/ideology/<id>.txt` para cada perfil do lote.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as 15 saídas em `subagent-out/ideology/<id>.json`.
   - Calcular vetores e mesclar em `ideology-profiles.json`.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/ideology/<id>.json` (permanente, nunca apagar) e limpar temporários (mantendo só um par de exemplo em `prompts/ideology/` + `subagent-out/ideology/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py ideology <id>` e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
5. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior (percentual exato) e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
