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
| Campos obrigatórios | `id`, `name`, `category`, `description`, `flagPath`, `historical`, `period`, `vector` (sempre `null` no arquivo de metadados), `religions` |
| `religions` | valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Perfil exclusivo de uma religião (a religião é a identidade dele, ex.: Sionismo Trabalhista) leva o marcador `"only"` ao lado, como `["judaism", "only"]`: só aparece para quem escolheu essa religião. Ver "O campo `religions`" em `NEW_PROFILE.md` Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (país/região: igreja estatal > participação de 65% ou mais dos cristãos > duas marcas se a segunda tem 25% ou mais ou a divisão molda a política; vale a vertente do período; antes de 1054, `catholic` e `orthodox`; região segue a vertente da região). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; sem base = provisório. |
| Imagem | bandeira em `frontend/public/countries/flags/{id}.{ext}` (Wikimedia Commons; confira extensão nos vizinhos, normalmente `.gif`) |

**Nota `historical`:** `period` só é preenchido (e `historical: true`) se o perfil representa um país num momento histórico específico (ex.: "Alemanha Nazista — Terceiro Reich"). Nesse caso baixe a bandeira do período, não a atual.

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `category`, `description`, se é `historical`/`period`. Decida por pesquisa/conhecimento factual quando o usuário não especificar; pergunte só se genuinamente ambíguo (ex.: dois países homônimos).
2. **Passo 1** — adicionar objeto ao final de `countries.json` (PT), `vector: null`, já com `religions` decidido por pesquisa (regra na tabela acima). Em país histórico, vale a religião **daquele período**.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/countries.json` (generalizar referências específicas do Brasil na versão EN).
4. **Passo 3** — baixar bandeira real para `frontend/public/countries/flags/{id}.{ext}` e ajustar `flagPath` para bater exatamente com o arquivo salvo. Se não for possível baixar, diga isso explicitamente ao usuário — nunca finja. **Logo em seguida, comprima**: `cd frontend && npm run optimize:images -- public/countries/flags/{id}.{ext}` (imagens da Wikimedia costumam vir gigantes e isso estoura os limites de banda da Vercel). Nunca pule esse passo nem deixe para depois.
5. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `religions` presente no PT só com valores válidos e ausente do EN).
6. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade). **Valide com `python profile-audit/validate.py country {id}` antes de mesclar** — forma, neutros e conteúdo (inclusive se o vetor não saiu ~95% idêntico a outro país); leia os avisos, não só o código de saída. Com o vetor calculado, **reconfira `religions`**: se `religiao` ≤ 35 e a lista estiver vazia, pesquise e preencha antes de mesclar. Depois calcular vetor, mesclar em `countries-profiles.json`, arquivar em `answers/country/{id}.json`, atualizar `STATE.json.country.done` (+1 em `totalProfiles`).
7. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `ReligionFilterTest` (falha se `religions` faltar, tiver valor inválido ou estiver vazio com `religiao` ≤ 35), `IdeologyCountryMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — rodar `python profile-audit/compatibility.py country {id}` para calcular as duas personalidades, duas ideologias e dois países mais compatíveis com o vetor recém-criado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   As **perguntas de arquétipo** fazem parte da auditoria do Passo 5: o prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype` e o vetor soma as alternativas escolhidas, como no quiz do usuário (ver "Perguntas de arquétipo" em `profile-audit/README.md`). Liste as escolhas no resumo do Passo 8.
9. **Passo 8** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, `religions` escolhido (com a razão), os matches calculados no passo 7 com percentual exato, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca afirme bandeira baixada ou testes passando sem ter feito de fato. Nunca apague `answers/`. Nunca deixe uma imagem baixada da internet sem rodar `npm run optimize:images` antes de seguir em frente.
