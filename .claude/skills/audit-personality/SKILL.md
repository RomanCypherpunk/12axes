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
     reaudite com uma description que você já sabe estar desatualizada.
   - Gerar `prompts/personality/<id>.txt` para cada perfil do lote.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as 15 saídas em `subagent-out/personality/<id>.json`.
   - Calcular vetores e mesclar em `personality-profiles.json`.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/personality/<id>.json` (permanente, nunca apagar) e limpar temporários (mantendo só um par de exemplo em `prompts/personality/` + `subagent-out/personality/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py personality <id>` e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
5. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior (percentual exato) e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
