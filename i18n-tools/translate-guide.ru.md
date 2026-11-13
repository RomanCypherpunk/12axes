# Guia de tradução: russo (ru)

A fonte é sempre o **inglês** (já internacionalizado). Traduza para russo padrão, natural e neutro, em cirílico.

## Tom
- Trate o leitor por **вы** (forma de cortesia), nunca por «ты». Pronomes em minúscula no meio da frase ("ваш результат", "вы узнаете").
- Direto e natural, como uma pessoa escreveria. Sem floreio, sem tradução literal e sem calques do inglês ("осуществлять", "является" em excesso).
- Aspas «елочки» para citações e títulos; travessão longo com espaços ( — ). Sem apóstrofo. **Não use ё**: escreva sempre **е** (все, ее, серьезный). O `build` do lote troca ё→е automaticamente, mas não escreva ё de propósito.
- Maiúsculas à russa: só a primeira palavra do título e nomes próprios; meses, dias e nomes de povos/idiomas em minúscula.
- Gênero do leitor: evite formas marcadas. Se for inevitável (alternativas de resposta), use "согласен(-на)".

## Nomes
- **Pessoas: sempre em cirílico**, na transliteração russa consagrada (Владимир Ленин, Дональд Трамп, Ангела Меркель, Лула да Силва, Карл Маркс). Não deixe nomes em alfabeto latino.
- Formas russas tradicionais quando existirem: Карл Великий, Юлий Цезарь, Александр Македонский, Мартин Лютер, Фома Аквинский, Конфуций, Елизавета II, Екатерина Великая, Наполеон Бонапарт, Фридрих Великий, Карл V.
- Países, regiões e regimes: nome em russo (Бразилия, Германия, Соединённые Штаты, Нидерланды, Великобритания, Испания, Франция, Италия, Португалия).
- Partidos e organizações: nome próprio traduzido/transliterado, formato `Nome (Sigla)`, nunca com o país no nome. Sigla: use a forma russa estabelecida quando houver (НСДАП, КПСС, КПК, ХДС/ХСС, СДПГ, ПСОЭ); caso contrário, **mantenha a sigla latina** (PT, PSDB, PP).
- Títulos de livros: forma russa consagrada quando houver edição; senão, tradução literal em cirílico para obras de língua não russa, ou o original em latim/inglês entre «» só se for nome próprio de uma marca. Obras russas ficam no original em cirílico.
- A marca é sempre **12 Axes**, em alfabeto latino, sem tradução.

## Termos fixos (use sempre estes)
| Inglês | Russo |
|---|---|
| axis / axes | ось / оси (родительный мн.: осей) |
| quiz, political test | тест (политический тест) |
| compatibility | совместимость |
| personality / figure (catálogo) | личность / деятель, по контексту: «личность» |
| Left / Right | левые / правые (прил.: левый / правый) |
| Far Right / Radical Left | крайне правые / радикальные левые |
| Center | центр |
| Third Position | третья позиция |
| libertarian / libertarianism | либертарианец, либертарианский / либертарианство |
| anarchist / anarchism | анархист / анархизм |
| liberal | либеральный |
| progressive / traditionalist | прогрессивный / традиционалистский |
| authoritarian | авторитарный |
| Federal / Unitary | федеративный (федерализм) / унитарный (унитаризм) |
| report (Full Report) | отчёт (Полный отчёт) |
| compass | компас |
| web view | сетевой вид |
| Structure | Структура |
| Representation | Представительство |
| Power | Власть |
| Immigration | Иммиграция |
| Diplomacy | Дипломатия |
| Intervention | Вмешательство |
| Economy | Экономика |
| Control | Контроль |
| Trade | Торговля |
| Religion | Религия |
| Morality | Мораль |
| Technology | Технологии |

## Regras técnicas
- Nunca altere ids, chaves, placeholders (`{name}`, `${n}`), tags HTML, URLs, números e anos.
- **Plural russo tem 3 formas** (1 ось, 2 оси, 5 осей). Em strings montadas no código, use o helper de plural do `ru.ts`; nunca "N ось(и)".
- `role` (papel da personalidade): no máximo **30 caracteres e 5 palavras**. O russo é longo: use substantivos curtos ("Основатель Сингапура", "Отец психоанализа", "Лидер СССР"). Conte antes de gravar.
- `description`: no máximo **280 caracteres e 45 palavras**. Condense em vez de cortar no meio.
- Mesmo sentido, mesma força. Não suavize nem acentue juízos. Não acrescente fatos.
- Condenações e processos judiciais: mantenha exatamente o grau afirmado no inglês (осуждён, осуждён судом первой инстанции, оправдан…).
- Perguntas do quiz: mesma direção e mesma força do original. "should" vira «должен/должна/должно/следует»; não troque por «мог бы». Concordar com a versão em russo precisa significar o mesmo que concordar com a versão em inglês.
- Política sobre Rússia/Ucrânia/Crimeia e temas sensíveis: traduza o texto inglês fielmente, sem acrescentar nem remover juízo, com a terminologia neutra do inglês ("вторжение", "аннексия", "война" quando o inglês assim diz).
- Glossário (`match`): o casamento é **literal** (sem regex), então liste **todas as formas de caso** que aparecerem nas perguntas traduzidas (nominativo, genitivo, dativo, acusativo, instrumental, preposicional; singular e plural), sem distinção de maiúsculas. Ex.: "федерация", "федерации", "федерацию", "федерацией".
