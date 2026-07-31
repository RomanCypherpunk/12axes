---
name: audit-country
description: Reaudita perfis do catálogo country (países/nações) do projeto 12axes, um lote de 15 por vez, seguindo o protocolo pergunta-a-pergunta de profile-audit/README.md.
---

# /audit_country

Reaudita perfis já existentes do catálogo **country**.

## Antes de qualquer coisa

Leia **profile-audit/README.md inteiro** (raiz do projeto) — autossuficiente, contém a lista dos 12 eixos, o template exato do prompt, a regra de disparo simultâneo, a validação, o script de cálculo/merge do vetor e a atualização de `STATE.json`/`answers/`.

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `country` |
| Metadados (fonte) | `backend/src/main/resources/data/countries.json` |
| Perfis salvos (destino) | `backend/src/main/resources/data/countries-profiles.json` (chave `countryId`) |
| Campos usados no prompt | `id`, `name`, `category`, `description` (ver nota `historical`/`period`) |
| Tipo de perfil no cabeçalho do prompt | `"país/nação"` |

**Nota `historical`:** perfis com `"historical": true` representam um país em um período específico (ex.: "Alemanha Nazista — Terceiro Reich", `period` preenchido). Inclua isso na descrição passada ao subagente para que ele responda como aquele período específico, não o país atual.

## Execução

1. Leia `STATE.json.country.pending`. Se vazio, informe ao usuário que não há mais nada pendente neste catálogo e pare.
2. Pegue os 15 primeiros IDs de `pending` (ou o restante, se houver menos de 15).
3. Siga **exatamente** os passos 2 a 8 de `profile-audit/README.md`, usando os parâmetros da tabela acima:
   - Gerar `prompts/country/<id>.txt` para cada perfil do lote.
   - Disparar os 15 subagentes **simultaneamente**, mesma mensagem, modelo de qualidade (nunca Haiku/rápido).
   - Validar as 15 saídas rodando `python profile-audit/validate.py country <id>` em cada uma.
     Ele checa forma, taxa de neutros e conteúdo (direção dos eixos, duplicata de outro país).
     **Leia os avisos, não só o código de saída** — ver "Modos de falha conhecidos" no README. Se
     reprovar, relance só aquele subagente dizendo qual checagem falhou e quais eixos estavam errados.
   - Calcular vetores e mesclar em `countries-profiles.json`.
   - Atualizar `STATE.json` (mover IDs de `pending` para `done`, atualizar `lastUpdated`).
   - Arquivar em `answers/country/<id>.json` (permanente, nunca apagar) e limpar temporários (mantendo só um par de exemplo em `prompts/country/` + `subagent-out/country/`).
4. Para **cada perfil do lote** já mesclado, rode `python profile-audit/compatibility.py country <id>` e leia as 2 personalidades, 2 ideologias e 2 países mais compatíveis com o vetor recém-atualizado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
5. Ao final, apresente para cada perfil do lote um resumo com os matches calculados no passo anterior (percentual exato) e informe quantos perfis restam em `pending`. **Pergunte explicitamente** se deve continuar para o próximo lote — nunca encadeie lotes sozinho.

## Regras que não podem ser quebradas

Todas as regras da seção final de `profile-audit/README.md` se aplicam sem exceção (nunca lote sequencial, nunca modelo fraco, nunca copiar respostas entre perfis parecidos, nunca apagar `answers/`).
