---
name: new-personality
description: Cria um perfil totalmente novo no catálogo personality do projeto 12axes (metadados PT/EN, retrato, auditoria de 240 perguntas, testes), seguindo NEW_PROFILE.md.
---

# /new_personality <nome>

Cria uma **personalidade** nova do zero — não confundir com reauditoria (`/audit_personality`).

## Antes de qualquer coisa

Leia **NEW_PROFILE.md inteiro** (`/profile-audit`) e **profile-audit/README.md inteiro** — o primeiro descreve o processo de criação completo, o segundo é reusado integralmente no passo 5 (auditoria pergunta-a-pergunta).

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `personality` |
| Metadados PT | `backend/src/main/resources/data/personalities.json` |
| Metadados EN | `backend/src/main/resources/data/i18n/en/personalities.json` |
| Perfis com vetor | `backend/src/main/resources/data/personality-profiles.json` (chave `personalityId`) |
| Campos obrigatórios | `id`, `name`, `role`, `lifespan`, `description`, `imagePath`, `imageSourceName`, `imageSourceUrl`, `imageNote` |
| Imagem | retrato em `frontend/public/personalities/portraits/{id}.jpg` (Wikimedia Commons/Wikipédia) |

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `role`, `lifespan`, `description`. Se o usuário não informou algo essencial, decida por pesquisa/conhecimento factual; só pergunte se a ambiguidade for genuinamente irresolvível (ex.: nome muito comum).
2. **Passo 1** — adicionar objeto ao final de `personalities.json` (PT).
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/personalities.json` (regras de tradução/generalização de referências específicas do Brasil na seção correspondente do NEW_PROFILE.md).
4. **Passo 3** — baixar retrato real para `frontend/public/personalities/portraits/{id}.jpg` e preencher `imagePath`/`imageSourceName`/`imageSourceUrl`/`imageNote`. Se não for possível baixar, diga isso explicitamente ao usuário — nunca finja. **Logo em seguida, comprima**: `cd frontend && npm run optimize:images -- public/personalities/portraits/{id}.jpg` (imagens da Wikimedia costumam vir gigantes — já tivemos um retrato de 52MB — e isso estoura os limites de banda da Vercel). Nunca pule esse passo nem deixe para depois.
5. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN).
6. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade). **Valide com `python profile-audit/validate.py personality {id}` antes de mesclar** — forma, neutros e conteúdo; leia os avisos, não só o código de saída. Depois calcular vetor, mesclar em `personality-profiles.json`, arquivar em `answers/personality/{id}.json`, atualizar `STATE.json.personality.done` (+1 em `totalProfiles`).
7. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `IdeologyPersonalityMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — rodar `python profile-audit/compatibility.py personality {id}` para calcular as duas personalidades, duas ideologias e dois países mais compatíveis com o vetor recém-criado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
9. **Passo 8** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, os matches calculados no passo 7 com percentual exato, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca afirme imagem baixada ou testes passando sem ter feito de fato. Nunca apague `answers/`. Nunca deixe uma imagem baixada da internet sem rodar `npm run optimize:images` antes de seguir em frente.
