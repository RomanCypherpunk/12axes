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
| Campos obrigatórios | `id`, `name`, `category`, `description`, `phrase`, `countryId`, `personalityId`, `religions` |
| `phrase` | frase em primeira pessoa com o que a ideologia defende, ~135 car. / ~18 pal. (seção própria em `NEW_PROFILE.md`) |
| `religions` | valores fechados `catholic`, `protestant`, `orthodox` (o cristianismo é dividido por denominação; perfil ambíguo ou sem denominação leva mais de uma, ou as três), `judaism`, `islam`, `buddhism`, `other` (hinduísmo, xintoísmo, religiões antigas) ou `[]`; pode haver mais de um. Primeiro o vetor: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil (doutrina religiosa por definição, liderança ou fundação religiosa, ou, em personalidades, posição política ou religiosa forte ligada à fé, como Milei, Biden e Mamdani; só `["other"]` pode ficar sempre). Depois, regra **por catálogo** (teste: a religião é parte relevante do que o perfil representa?): **país** = só a religião majoritária ou a tradição dominante, quando o vetor pede marcação, e `[]` para regimes marcados pela perseguição religiosa (Coreia do Norte, URSS); **ideologia** = doutrina com base religiosa explícita ou que defende uma religião como parte da identidade política (Democracia Cristã, Islamismo, Distributismo); **personalidade** = fé pública que aparece na atuação, liderança religiosa ou apoio declarado a uma causa religiosa, nunca só origem étnica ou cultural (Einstein e Friedman = `[]`), e apoio político a Israel não é causa judaica. Aliança só diplomática/militar não conta (Trump = `["protestant"]`, o sionismo cristão é causa cristã; Arábia Saudita = `["islam"]`). Lembre que o filtro **esconde** perfis marcados só com outra religião: marcar a mais tira o perfil de quem escolheu outra tradição; `other` só é curinga quando está sozinho. Se o vetor tiver `religiao` ≤ 35 e o texto disser que o perfil é secular, reaudite o vetor em vez de apagar a religião. Com o vetor calculado, `religiao` ≤ 35 (lado religioso) **exige** ao menos um valor — o `validate.py` ([RELIGIAO]) e o `ReligionFilterTest` bloqueiam —, mas o valor vem de pesquisa, **nunca** do vetor. Vive só no JSON PT, como `category`. Perfil exclusivo de uma religião (a religião é a identidade dele, ex.: Sionismo Trabalhista) leva o marcador `"only"` ao lado, como `["judaism", "only"]`: só aparece para quem escolheu essa religião. Ver "O campo `religions`" em `NEW_PROFILE.md` Vertente cristã: siga a subseção "Vertente cristã" de `profile-audit/NEW_PROFILE.md` (ideologia: classifique a doutrina, não o país ou a pessoa de referência; depende de uma vertente = só ela; cristã em geral = as três, com `only` se exclusiva; neutra = as seis religiões; use o teste da troca). Máximo de 3 marcas cristãs, na dúvida duas, nunca "católico por padrão"; sem base = provisório. |
| Imagem | não se aplica — ideologias não têm imagem própria |

**Nota `countryId`/`personalityId`:** aponte para um país e uma personalidade **já existentes** no catálogo que exemplifiquem bem a ideologia. Validado por `IdeologyPersonalityMappingTest` e `IdeologyCountryMappingTest` — id inexistente quebra o build.

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id` (kebab-case, sem colisão), `name`, uma `category` inicial válida, `description`, `countryId`, `personalityId` (escolhidos entre perfis já existentes). Decida por pesquisa/conhecimento factual quando o usuário não especificar; pergunte só se genuinamente ambíguo. A `phrase` é escrita depois, no Passo 5b, quando o vetor já existir para servir de trava.
2. **Passo 1** — adicionar objeto ao final de `ideologies.json` (PT), estilo enxuto/factual calibrado por 2-3 exemplos vizinhos. Deixe `phrase` como string vazia por ora. Preencha `religions` por pesquisa (regra na tabela acima): a tradição em que a doutrina está de fato ancorada; confira também o `religions` do `personalityId`/`countryId` declarados para não ficar incoerente sem motivo.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/ideologies.json` (generalizar referências específicas do Brasil na versão EN). Deixe `phrase` como string vazia aqui também — ela é escrita nos dois idiomas no Passo 5b, nunca antes.
4. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `countryId`/`personalityId` existentes, `religions` presente no PT só com valores válidos e ausente do EN).
5. **Passo 5** — auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade). **Valide com `python profile-audit/validate.py ideology {id}` antes de mesclar.** Duas checagens importam especialmente aqui: (a) o vetor não pode sair ~95% idêntico a uma ideologia já existente — seria redundante; (b) precisa bater alto com o `personalityId` declarado (abaixo de ~92%, um dos dois vetores está errado). Leia os avisos, não só o código de saída — ver "Modos de falha conhecidos" no README. Com o vetor calculado, **reconfira `religions`**: se `religiao` ≤ 35 e a lista estiver vazia, pesquise e preencha antes de mesclar. Depois calcular vetor, mesclar em `ideology-profiles.json`, arquivar em `answers/ideology/{id}.json`, atualizar `STATE.json.ideology.done` (+1 em `totalProfiles`).
6. **Passo 5a — revisar a categoria com o vetor já calculado.** Leia [IDEOLOGY_CATEGORY_REVIEW.md](../../../profile-audit/IDEOLOGY_CATEGORY_REVIEW.md) e registre a categoria proposta com evidência textual, vetorial e de vizinhos calculados. O vetor é evidência, não um classificador automático. Se a proposta for diferente da categoria inicial, não altere PT nem EN sem confirmação explícita do usuário; continue a criação com a categoria válida atual e apresente a proposta no resumo.
7. **Passo 5b** — com o vetor já mesclado, escrever a `phrase` em `ideologies.json` (PT) e traduzi-la em `i18n/en/ideologies.json`. Siga a seção "O campo `phrase`" de `NEW_PROFILE.md`: frase em primeira pessoa sobre o que a ideologia **defende** (parta da `description`), com o vocabulário próprio da corrente e o vetor como trava para não contradizer nenhum eixo. **Nunca** use o esqueleto "culturalmente X, politicamente Y, economicamente Z": ele gera frases intercambiáveis que não distinguem nada. Confira o tamanho (~135 car. / ~18 pal., teto 170/25) e que nenhuma outra ideologia tem frase parecida.
8. **Passo 6** — rodar `cd backend && ..\.tools\apache-maven-3.9.15\bin\mvn.cmd test` (ou wrapper disponível). Testes relevantes: `ReligionFilterTest` (falha se `religions` faltar, tiver valor inválido ou estiver vazio com `religiao` ≤ 35), `IdeologyPhraseTest` (falha se a frase faltar, estourar o tamanho ou repetir outra), `IdeologyPersonalityMappingTest`, `IdeologyCountryMappingTest`, `ProfileMatchScorerTest`, `ScorerBenchmarkTest`, `QuizFlowAutomationTest`, `SharedResultsTest`. Corrigir causa raiz de qualquer falha, nunca pular.
9. **Passo 7** — rodar `python profile-audit/compatibility.py ideology {id}` para calcular as duas personalidades, duas ideologias e dois países mais compatíveis com o vetor recém-criado (mesmo algoritmo de `ProfileMatchScorer.java`). Nunca estimar esses matches de cabeça.
   As **perguntas de arquétipo** fazem parte da auditoria do Passo 5: o prompt termina com o bloco de `python profile-audit/profile_vector.py --prompt-block`, a saída traz o bloco `archetype` e o vetor soma as alternativas escolhidas, como no quiz do usuário (ver "Perguntas de arquétipo" em `profile-audit/README.md`). Liste as escolhas no resumo do Passo 8.
10. **Passo 8** — apresentar resumo ao usuário: catálogo/id/name, resumo do vetor, `religions` escolhido (com a razão), resultado da revisão de categoria, os matches calculados no passo 7 com percentual exato, confirmação de testes, lista de arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca deixe `countryId`/`personalityId` apontando para id inexistente. Nunca escreva a `phrase` no formato padronizado por eixos nem antes de o vetor existir. Nunca apague `answers/`.
