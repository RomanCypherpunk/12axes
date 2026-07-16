---
name: new-country
description: Cria um perfil totalmente novo no catálogo country do projeto 12axes (metadados PT/EN, bandeira, auditoria de 240 perguntas, testes), seguindo NEW_PROFILE.md.
---

# /new_country <nome>

Cria um **país/nação** novo do zero — não confundir com reauditoria (`/audit_country`).

## Antes de qualquer coisa

Leia **NEW_PROFILE.md inteiro** (`/profile-audit`) e **profile-audit/README.md inteiro** — o primeiro descreve o processo de criação completo, o segundo é reusado integralmente no passo 5 (auditoria pergunta-a-pergunta).

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `country` |
| Metadados PT | `backend/src/main/resources/data/countries.json` |
| Metadados EN | `backend/src/main/resources/data/i18n/en/countries.json` |
| Perfis com vetor | `backend/src/main/resources/data/countries-profiles.json` (chave `countryId`) |
| Campos obrigatórios | `id`, `name`, `category`, `description`, `flagPath`, `historical`, `period`, `vector` (sempre `null` no arquivo de metadados) |
| Imagem | bandeira em `frontend/public/countries/flags/{id}.{ext}` (Wikimedia Commons; confira extensão nos vizinhos, normalmente `.gif`) |

**Nota `historical`:** `period` só é preenchido (e `historical: true`) se o perfil representa um país num momento histórico específico (ex.: "Alemanha Nazista — Terceiro Reich"). Nesse caso baixe a bandeira do período, não a atual.

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `category`, `description`, se é `historical`/`period`. Decida por pesquisa/conhecimento factual quando o usuário não especificar; pergunte só se genuinamente ambíguo (ex.: dois países homônimos).
2. **Passo 1** — adicionar objeto ao final de `countries.json` (PT), `vector: null`.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/countries.json` (generalizar referências específicas do Brasil na versão EN).
4. **Passo 3** — baixar bandeira real para `frontend/public/countries/flags/{id}.{ext}` e ajustar `flagPath` para bater exatamente com o arquivo salvo. Se não for possível baixar, diga isso explicitamente ao usuário — nunca finja.
5. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN).
6. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade), calcular vetor, mesclar em `countries-profiles.json`, arquivar em `answers/country/{id}.json`, atualizar `STATE.json.country.done` (+1 em `totalProfiles`).
7. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `IdeologyCountryMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca afirme bandeira baixada ou testes passando sem ter feito de fato. Nunca apague `answers/`.
