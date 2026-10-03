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
| Campos obrigatórios | `id`, `name`, `role`, `category`, `lifespan`, `description`, `imagePath`, `imageSourceName`, `imageSourceUrl`, `imageNote`, `religions` |
| `category` | um de: `politico`, `religioso`, `economista`, `filosofo`, `teorico`, `empresario`, `intelectual`, `ativista` (ver NEW_PROFILE.md) |
| `religions` | valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Perfil exclusivo de uma religião (a religião é a identidade dele, ex.: Sionismo Trabalhista) leva o marcador `"only"` ao lado, como `["judaism", "only"]`: só aparece para quem escolheu essa religião. Ver "O campo `religions`" em `NEW_PROFILE.md` Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (personalidade: autodeclaração pública > pertencimento formal > batismo > contexto, que é sempre provisório; conversão no meio da carreira = as duas; anglicano = `protestant`; Pais da Igreja = as três; fé em disputa = as duas). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; sem base = provisório. |
| Imagem | retrato em `frontend/public/personalities/portraits/{id}.jpg` (Wikimedia Commons/Wikipédia) |

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, `role`, `category`, `lifespan`, `description`. **`category`** é um dos 8 valores fechados (tabela em `NEW_PROFILE.md`): `role` descreve em texto livre, `category` agrupa. Na dúvida entre `filosofo` e `teorico`: filósofo é pensamento abstrato geral, teórico formulou doutrina política operacional. `religioso` cobre quem trata de religião **a favor ou contra** (Lutero e Nietzsche estão os dois lá); ser apenas irreligioso não basta, a obra tem de ser sobre o tema. Se o usuário não informou algo essencial, decida por pesquisa/conhecimento factual; só pergunte se a ambiguidade for genuinamente irresolvível (ex.: nome muito comum).
2. **Passo 1** — adicionar objeto ao final de `personalities.json` (PT), já com `religions` decidido por pesquisa (regra na tabela acima).
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/personalities.json` (regras de tradução/generalização de referências específicas do Brasil na seção correspondente do NEW_PROFILE.md).
4. **Passo 3** — baixar retrato real para `frontend/public/personalities/portraits/{id}.jpg` e preencher `imagePath`/`imageSourceName`/`imageSourceUrl`/`imageNote`. Se não for possível baixar, diga isso explicitamente ao usuário — nunca finja. **Logo em seguida, comprima**: `cd frontend && npm run optimize:images -- public/personalities/portraits/{id}.jpg` (imagens da Wikimedia costumam vir gigantes — já tivemos um retrato de 52MB — e isso estoura os limites de banda da Vercel). Nunca pule esse passo nem deixe para depois.
5. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `category` presente no PT e entre os 8 valores, `religions` presente no PT só com valores válidos). `category` e `religions` **não** vão no arquivo EN.
6. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade). **Valide com `python profile-audit/validate.py personality {id}` antes de mesclar** — forma, neutros e conteúdo; leia os avisos, não só o código de saída. Com o vetor calculado, **reconfira `religions`**: se `religiao` ≤ 35 e a lista estiver vazia, pesquise e preencha antes de mesclar. Depois calcular vetor, mesclar em `personality-profiles.json`, arquivar em `answers/personality/{id}.json`, atualizar `STATE.json.personality.done` (+1 em `totalProfiles`).
7. **Passo 5b — livro** — conferir se a personalidade escreveu um livro relevante e adicioná-lo a `backend/src/main/resources/data/books.json` (um livro por personalidade; se o `personalityId` já existir lá, não duplique):
   - Só entra obra **escrita pela própria personalidade** e sobre política, economia, filosofia política ou tema diretamente relacionado (religião/sociedade só quando a obra tem peso político, ex.: *Rerum Novarum*, *A Cidade de Deus*). Ficção sem peso político, autoajuda, ciência pura e memórias sem conteúdo político não entram. Sem obra assim, **não adicione nada** e diga isso no resumo; nunca invente um livro.
   - Com mais de uma obra, escolha a mais popular/relevante/importante para o pensamento político da pessoa.
   - Formato (mesmo dos demais itens; `year` = primeira publicação, negativo para a.C.; `url` fica vazio, o usuário preenche os links de afiliado):
     `{ "personalityId": "<id>", "title": { "pt": "<título da edição brasileira>", "en": "<título em inglês>" }, "year": <ano>, "url": { "pt": "", "en": "" } }`
   - `title.pt` = título com que a obra circula no Brasil; sem tradução, repita o original. `title.en` = título em inglês; sem tradução para o inglês, repita o original.
   - Não inclua obras de propaganda de ódio (ex.: *Mein Kampf*); na dúvida, pergunte ao usuário.
   - Adicione ao final do array, mantenha o JSON válido (`python -c "import json;json.load(open('backend/src/main/resources/data/books.json',encoding='utf-8'))"`) e cite o livro escolhido (ou a ausência) no resumo final.
7. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `PersonalityCategoryTest` (falha se `category` faltar ou for inválida), `ReligionFilterTest` (falha se `religions` faltar, tiver valor inválido ou estiver vazio com `religiao` ≤ 35), `PersonalityCategoryMatchTest`, `IdeologyPersonalityMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — rodar `python profile-audit/compatibility.py personality {id}` para calcular as duas personalidades, duas ideologias e dois países mais compatíveis com o vetor recém-criado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   As **perguntas de arquétipo** fazem parte da auditoria do Passo 5: o prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype` e o vetor soma as alternativas escolhidas, como no quiz do usuário (ver "Perguntas de arquétipo" em `profile-audit/README.md`). Liste as escolhas no resumo do Passo 8.
9. **Passo 8** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, `religions` escolhido (com a razão), livro adicionado a `books.json` (ou por que nenhum), os matches calculados no passo 7 com percentual exato, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca afirme imagem baixada ou testes passando sem ter feito de fato. Nunca apague `answers/`. Nunca deixe uma imagem baixada da internet sem rodar `npm run optimize:images` antes de seguir em frente.
