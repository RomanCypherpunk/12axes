---
name: new-party
description: Cria um perfil totalmente novo no catálogo party (partidos, movimentos, casas dinásticas, organizações armadas e internacionais) do projeto 12axes (metadados PT/EN, logo 1:1, auditoria de 240 perguntas, testes), seguindo NEW_PROFILE.md.
---

# /new_party <nome>

Cria um **partido, movimento, casa dinástica ou organização** nova do zero — não confundir com reauditoria (`/audit_party`).

## Antes de qualquer coisa

Leia **NEW_PROFILE.md inteiro** (`/profile-audit`, seção "Catálogo party") e **profile-audit/README.md inteiro** — o primeiro descreve o processo de criação, o segundo é reusado integralmente no passo 5 (auditoria pergunta-a-pergunta).

## Parâmetros fixos deste catálogo

| Campo | Valor |
|---|---|
| `CATALOG` | `party` |
| Metadados PT | `backend/src/main/resources/data/parties.json` |
| Metadados EN | `backend/src/main/resources/data/i18n/en/parties.json` (só `id`, `name`, `category`, `description`) |
| Perfis com vetor | `backend/src/main/resources/data/parties-profiles.json` (chave `partyId`) |
| Campos obrigatórios | `id`, `name`, `category`, `description`, `logoPath`, `logoSourceName`, `logoSourceUrl`, `logoNote`, `countryId`, `historical`, `period`, `religions` |
| `id` | kebab-case sem acento. Quando o nome colide entre países ou eras, o `id` leva o país e/ou a era (`partido-republicano-eua`, `partido-republicano-eua-new-deal`), e o `name` exibido distingue (ex.: "Partido Republicano (era New Deal)"). |
| `name` | Formato **"Nome do Partido (Sigla)"** ou só **"Nome do Partido"** (PT e EN). **Nunca** inclua o país no nome (nada de "(Sigla, País)" nem "(Hungria)"): a UI já mostra a bandeira e a descrição abaixo, então o país no nome é redundante e deixa o texto grande. Para distinguir eras ou ramos, use só o complemento ("Partido Republicano (era New Deal)", "Casa de Bourbon (ramo francês)"). |
| `category` | valor fechado em PT: `Partido`, `Movimento`, `Casa dinástica`, `Organização armada`, `Organização internacional`. Vive no PT; o EN traduz o rótulo (`Party`, `Movement`, `Dynastic house`, `Armed organization`, `International organization`). O backend e o `validate.py` bloqueiam valor fora da lista. |
| `countryId` | **obrigatório**: id de um país já existente em `countries.json`, atual ou histórico (ex.: NSDAP → `alemanha-nazista-terceiro-reich`; Partido Republicano da era New Deal → `eua-new-deal`; AIB → `brasil-era-vargas`; organização sem Estado, como a Al-Qaeda, usa o país de maior associação, `afeganistao`). O backend rejeita id inexistente e resolve `countryName` por idioma. |
| `historical` / `period` | `historical: true` + `period` preenchido (ex.: `"1933–1945"`) quando o perfil representa a organização num período específico, extinta ou muito diferente da atual. Organização atual: `historical: false`, `period: ""`. A mesma organização em duas eras vira dois perfis. |
| `religions` | mesma regra dos demais catálogos: com `religiao` ≤ 35 a marcação é obrigatória; com `religiao` > 35 o padrão é `[]`, salvo quando a religião é a identidade do perfil. Para **partido/organização**: marque a religião que é parte relevante da doutrina, da base ou da identidade (Al-Qaeda `["islam"]`, AIB `["catholic"]`, casa dinástica católica `["catholic"]`); partido secular ou de base religiosa difusa fica `[]`. O valor vem de pesquisa, nunca do vetor. Vertente cristã: siga a subseção "Vertente cristã" de `NEW_PROFILE.md`. Vive só no PT. |
| Imagem | **logo quadrado 1:1** em `frontend/public/parties/logos/{id}.png` (480x480 PNG, fundo transparente), a partir do **símbolo oficial** mostrado na Wikipédia/Wikimedia Commons (infobox do artigo). Ver Passo 3. |

## Execução

Siga `NEW_PROFILE.md` passo a passo, na íntegra:

1. **Passo 0** — reunir `id`, `name`, `category`, `description`, `countryId`, se é `historical`/`period`. Decida por pesquisa quando o usuário não especificar; pergunte só se genuinamente ambíguo (duas organizações homônimas, por exemplo).
2. **Passo 1** — adicionar o objeto ao final de `parties.json`, `description` no tamanho padrão (~30 palavras / ~220 caracteres, teto 45/280), factual, citando os 2-3 traços mais definidores e sem opinião.
3. **Passo 2** — traduzir e adicionar ao final de `i18n/en/parties.json` (`id`, `name`, `category`, `description`; generalizar referências específicas do Brasil).
4. **Passo 3 (logo)** — baixar o símbolo oficial da Wikipédia/Commons (`Special:FilePath/<arquivo>`, com o nome URL-encoded; prefira o SVG original) para uma pasta temporária e gerar o quadrado com `cd frontend && npm run square:logo -- <arquivo-baixado> public/parties/logos/{id}.png`. O script centraliza sem distorcer nem cortar numa tela 480x480 transparente com margem. Se um perfil histórico usa o mesmo símbolo de outro (ex.: dois eras do mesmo partido), copie o PNG. Preencha `logoPath`, `logoSourceName`, `logoSourceUrl` (página do arquivo no Commons) e `logoNote`. Se não for possível baixar, diga isso ao usuário, nunca finja. Confira o resultado visualmente.
5. **Passo 4** — conferir consistência dos JSONs (válidos, sem campo obrigatório vazio, `id` idêntico PT/EN, `countryId` existente, `religions` só no PT).
6. **Passo 5** — **Regra de partido/organização: responda pela PRÁTICA e pelas IDEIAS.** O prompt deve instruir o subagente a responder como o próprio partido/grupo/organização pela prática real (no governo, a política efetiva; na oposição ou na clandestinidade, a ação e a estratégia; para grupo armado, a prática e a doutrina declarada) e pelas ideias e valores programáticos, e não pelo que críticos, apoiadores isolados ou a população pensam; em perfil histórico, vale o período; em `representacao`, democracia interna e eleições formais não contam se, no poder, o partido elimina oposição, imprensa livre ou alternância. Acrescente um parágrafo "FATO PÚBLICO E CALIBRAÇÃO" com a prática e as ideias concretas, as tensões internas e o que diferencia o perfil dos vizinhos prováveis (ex.: o mesmo partido em outra era), como contexto e nunca como alvo numérico. Auditoria de 240 perguntas para este único perfil, reusando os passos 2-5 de `profile-audit/README.md` (um subagente só, modelo de qualidade, nunca Haiku). **Valide com `python profile-audit/validate.py party {id}` antes de mesclar** (forma, neutros, conteúdo, categoria, país e logo 1:1); leia os avisos, não só o código de saída. Se sair ~95% idêntico a outro partido (sobretudo da mesma organização em outra era), pergunte ao usuário antes de mesclar. Reconfira `religions` com o vetor calculado. Depois calcular o vetor (`profile_vector.compute_vector`), **acrescentar** `{partyId, vector}` em `parties-profiles.json`, arquivar em `answers/party/{id}.json`, adicionar o id em `STATE.json.party.done` (+1 em `totalProfiles`).
7. **Passo 6** — rodar `cd backend && mvn test` (ou o wrapper disponível; ver `NEW_PROFILE.md`). Testes relevantes: `PartyCatalogTest` (campos, categoria, país, logo 1:1, vetor com os 12 eixos, `religions`), `QuizResultPayloadTest`, `SharedResultsTest`, `CompareControllerTest`, `ReligionFilterTest`. Corrigir a causa raiz de qualquer falha, nunca pular.
8. **Passo 7** — rodar `python profile-audit/compatibility.py party {id}` para calcular os dois matches de personalidade, de ideologia, de país e de partido/organização (mesmo algoritmo de `ProfileMatchScorer.java`; aplica o filtro de religião). Nunca estimar de cabeça. As perguntas de arquétipo fazem parte da auditoria do Passo 5: liste as escolhas no resumo.
9. **Passo 8** — apresentar resumo: catálogo/id/name/país associado, vetor, `religions` (com a razão), matches com percentual exato, testes e arquivos tocados.

## Regras que não podem ser quebradas

Nunca invente um vetor sem rodar a auditoria real de 240 perguntas. Nunca use modelo fraco. Nunca copie as respostas de outro perfil (nem da mesma organização em outra era). Nunca deixe `countryId` apontando para id inexistente. Nunca use logo que não seja o símbolo oficial mostrado na Wikipédia, nem logo fora do formato 1:1. Nunca apague `answers/`. Nunca afirme logo baixado ou testes passando sem ter feito de fato.
