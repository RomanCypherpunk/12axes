---
name: new-ideology
description: Cria um perfil totalmente novo no catálogo ideology do projeto 12axes (metadados PT/EN, auditoria de 240 perguntas, testes), seguindo NEW_PROFILE.md.
---

# /new_ideology <nome>

Cria uma **ideologia** nova do zero — não confundir com reauditoria (`/audit_ideology`).

## Antes de qualquer coisa

Leia **NEW_PROFILE.md inteiro** (`/profile-audit`) e **profile-audit/README.md inteiro** — o primeiro descreve o processo de criação completo, o segundo é reusado integralmente no passo 5 (auditoria pergunta-a-pergunta).

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `ideology` |
| Metadados PT | `backend/src/main/resources/data/ideologies.json` |
| Metadados EN | `backend/src/main/resources/data/i18n/en/ideologies.json` |
| Perfis com vetor | `backend/src/main/resources/data/ideology-profiles.json` (chave `ideologyId`) |
| Campos obrigatórios | `id`, `name`, `category`, `description`, `countryId`, `personalityId` |
| Imagem | não se aplica — ideologias não têm imagem própria |

**Nota `countryId`/`personalityId`:** aponte para um país e uma personalidade **já existentes** no catálogo que exemplifiquem bem a ideologia. Validado por `IdeologyPersonalityMappingTest` e `IdeologyCountryMappingTest` — id inexistente quebra o build.

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `category`, `description`, `countryId`, `personalityId` (escolhidos entre perfis já existentes). Decida por pesquisa/conhecimento factual quando o usuário não especificar; pergunte só se genuinamente ambíguo.
2. **Passo 1** — adicionar objeto ao final de `ideologies.json` (PT), estilo enxuto/factual calibrado por 2-3 exemplos vizinhos.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/ideologies.json` (generalizar referências específicas do Brasil na versão EN).
4. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `countryId`/`personalityId` existentes).
5. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade), calcular vetor, mesclar em `ideology-profiles.json`, arquivar em `answers/ideology/{id}.json`, atualizar `STATE.json.ideology.done` (+1 em `totalProfiles`).
6. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `IdeologyPersonalityMappingTest`, `IdeologyCountryMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
7. **Passo 7** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca deixe `countryId`/`personalityId` apontando para id inexistente. Nunca apague `answers/`.
