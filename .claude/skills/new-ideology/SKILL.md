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
| Campos obrigatórios | `id`, `name`, `category`, `description`, `phrase`, `countryId`, `personalityId` |
| `phrase` | frase em primeira pessoa com o que a ideologia defende, ~135 car. / ~18 pal. (seção própria em `NEW_PROFILE.md`) |
| Imagem | não se aplica — ideologias não têm imagem própria |

**Nota `countryId`/`personalityId`:** aponte para um país e uma personalidade **já existentes** no catálogo que exemplifiquem bem a ideologia. Validado por `IdeologyPersonalityMappingTest` e `IdeologyCountryMappingTest` — id inexistente quebra o build.

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `category`, `description`, `countryId`, `personalityId` (escolhidos entre perfis já existentes). Decida por pesquisa/conhecimento factual quando o usuário não especificar; pergunte só se genuinamente ambíguo. A `phrase` é escrita depois, no Passo 5b, quando o vetor já existir para servir de trava.
2. **Passo 1** — adicionar objeto ao final de `ideologies.json` (PT), estilo enxuto/factual calibrado por 2-3 exemplos vizinhos. Deixe `phrase` como string vazia por ora.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/ideologies.json` (generalizar referências específicas do Brasil na versão EN). Deixe `phrase` como string vazia aqui também — ela é escrita nos dois idiomas no Passo 5b, nunca antes.
4. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `countryId`/`personalityId` existentes).
5. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade). **Valide com `python profile-audit/validate.py ideology {id}` antes de mesclar.** Duas checagens importam especialmente aqui: (a) o vetor não pode sair ~95% idêntico a uma ideologia já existente — seria redundante; (b) precisa bater alto com o `personalityId` declarado (abaixo de ~92%, um dos dois vetores está errado). Leia os avisos, não só o código de saída — ver "Modos de falha conhecidos" no README. Depois calcular vetor, mesclar em `ideology-profiles.json`, arquivar em `answers/ideology/{id}.json`, atualizar `STATE.json.ideology.done` (+1 em `totalProfiles`).
6. **Passo 5b** — com o vetor já mesclado, escrever a `phrase` em `ideologies.json` (PT) e traduzi-la em `i18n/en/ideologies.json`. Siga a seção "O campo `phrase`" de `NEW_PROFILE.md`: frase em primeira pessoa sobre o que a ideologia **defende** (parta da `description`), com o vocabulário próprio da corrente e o vetor como trava para não contradizer nenhum eixo. **Nunca** use o esqueleto "culturalmente X, politicamente Y, economicamente Z": ele gera frases intercambiáveis que não distinguem nada. Confira o tamanho (~135 car. / ~18 pal., teto 170/25) e que nenhuma outra ideologia tem frase parecida.
7. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `IdeologyPhraseTest` (falha se a frase faltar, estourar o tamanho ou repetir outra), `IdeologyPersonalityMappingTest`, `IdeologyCountryMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — rodar `python profile-audit/compatibility.py ideology {id}` para calcular as duas personalidades, duas ideologias e dois países mais compatíveis com o vetor recém-criado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
9. **Passo 8** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, os matches calculados no passo 7 com percentual exato, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca deixe `countryId`/`personalityId` apontando para id inexistente. Nunca escreva a `phrase` no formato padronizado por eixos nem antes de o vetor existir. Nunca apague `answers/`.
