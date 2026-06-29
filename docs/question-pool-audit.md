# Auditoria do pool de perguntas

Arquivo analisado: `backend/src/main/resources/data/questions-pool.json`.

## Diagnóstico

- A estrutura quantitativa está correta: 240 perguntas, 12 eixos, 20 perguntas por eixo e 10 por polo.
- O estilo atual é bom: frases curtas, afirmativas, sem explicação longa e com tema político concreto.
- O problema principal é qualitativo: vários eixos têm perguntas boas, mas faltam temas diretos e faltam itens extremos suficientes para separar quem é moderado de quem realmente fica no polo.
- Termos que não aparecem literalmente hoje e deveriam aparecer em algum ponto: maconha, revolução socialista, tecnocracia, anarquia e eugenia.
- Economia mistura imposto e regulação demais; parte disso pertence melhor ao eixo Controle.
- Imigração cobre bem assimilação e multiculturalismo, mas ainda pode ficar mais direto em fronteiras, idioma oficial e cidadania.
- Religião cobre laicidade e religiosidade privada, mas falta testar Estado confessional/teocrático de forma explícita.

## Regra de estilo recomendada

Manter o padrão atual:

- frase afirmativa;
- uma ideia por pergunta;
- linguagem direta;
- sem contextualização longa;
- sem "você acha que";
- evitar perguntas neutras demais como "X é importante".

## Regra de pureza por eixo

Para evitar que um eixo meça outro sem querer, a pergunta deve mirar o núcleo do eixo:

- Estrutura: onde a decisão fica, não o conteúdo moral ou econômico da decisão.
- Representação: quem tem legitimidade para governar, não se uma política específica é boa.
- Poder: quanto o Estado pode coagir, proibir, vigiar, punir ou liberar.
- Imigração: fronteira, pertencimento, idioma, assimilação, cultura e preconceito.
- Diplomacia: postura diante de guerra, paz, negociação, armamento e conflito externo.
- Intervenção: influência sobre outros países, vizinhos, alianças, sanções e neutralidade.
- Economia: propriedade, serviço público vs privado, estatização, privatização e provisão social.
- Controle: impostos, moeda, Banco Central, câmbio, preços, subsídios e planejamento interno.
- Comércio: abertura externa, tarifas, importações, exportações, multinacionais e globalização.
- Religião: fé na vida pública/privada, secularismo, Estado confessional e influência religiosa.
- Moral: juízo pessoal/social sobre costumes, sem transformar a frase em política estatal.
- Tecnologia: confiança no avanço técnico/transhumanista vs preservação biológica/ecológica.

Regra prática: se uma pergunta de Moral diz "o Estado deveria proibir", ela virou Poder. Se uma pergunta de Economia fala em imposto, ela provavelmente virou Controle. Se uma pergunta de Comércio fala em câmbio, ela virou Controle. Se uma pergunta de Intervenção fala em refugiados, ela provavelmente virou Imigração.

## Perguntas atuais com risco de eixo errado

Estas não são todas ruins, mas são os itens que eu revisaria antes de expandir o pool.

- `estrutura_05`: usa porte de armas, tema que puxa Poder. Melhor: "Cada estado deve poder definir sua própria Constituição, justiça e administração."
- `estrutura_11`: "estados ricos sustentarem estados pobres" puxa redistribuição econômica. Melhor: "A maior parte dos impostos deveria ficar no estado onde foi arrecadada."
- `estrutura_17`: descriminalização puxa Poder/Moral. Melhor: "Cidades deveriam poder criar regras administrativas diferentes da lei nacional."
- `estrutura_18`: costumes e festas locais puxa Imigração/Moral. Melhor: "Políticas públicas não deveriam variar muito entre regiões."
- `imigracao_01`: benefícios públicos puxa Economia/Poder. Melhor: "Imigrantes que recusam aprender o idioma local não se integram plenamente à comunidade nacional."
- `imigracao_02`: serviços públicos multilíngues puxa provisão estatal. Melhor: "Uma sociedade multicultural deve aceitar vários idiomas no cotidiano público."
- `imigracao_13`: qualificação profissional puxa Economia/meritocracia. Melhor: "Imigração permanente deveria exigir domínio do idioma e disposição de assimilação cultural."
- `imigracao_20`: número de refugiados puxa política humanitária. Melhor: "Refugiados de culturas diferentes podem enriquecer a identidade nacional."
- `diplomacia_08`: troca entre gasto militar e saúde/educação puxa Economia. Melhor: "Gastos militares altos tornam conflitos externos mais prováveis."
- `diplomacia_16`: embargos são mais Intervenção que Diplomacia. Melhor: "Mesmo contra regimes hostis, diálogo costuma ser melhor que coerção externa."
- `diplomacia_20`: qualidade de vida interna puxa Economia. Melhor: "Países menos militarizados tendem a viver com menos medo de guerra."
- `intervencao_07`: dinheiro público interno puxa Economia/Controle. Melhor: "Crises externas raramente justificam envolvimento direto do Brasil."
- `intervencao_09`: refugiados puxa Imigração. Melhor: "Problemas de outros países devem ser resolvidos por organismos internacionais, não pelo Brasil."
- `intervencao_11`: comércio aberto puxa Comércio. Melhor: "O Brasil deve evitar blocos geopolíticos fechados e alianças permanentes."
- `intervencao_18`: abrir mercados e empregos puxa Comércio. Melhor: "O Brasil deve disputar influência política fora de suas fronteiras."
- `economia_06`: imposto progressivo puxa Controle. Melhor: "Serviços essenciais deveriam ser financiados e prestados principalmente pelo setor público."
- `economia_07`: imposto sobre herança puxa Controle. Melhor: "Herança e propriedade familiar devem ficar protegidas de projetos coletivistas."
- `economia_10`: regulação genérica puxa Controle. Melhor: "Serviços essenciais não deveriam depender da lógica de lucro."
- `economia_14`: imposto de grandes empresas puxa Controle. Melhor: "Grandes empresas privadas concentram poder demais sobre a vida das pessoas."
- `economia_15`: sindicato obrigatório puxa regulação trabalhista. Melhor: "Relações de trabalho funcionam melhor por contrato direto do que por estruturas coletivas."
- `comercio_08`: câmbio puxa Controle. Melhor: "O governo deveria limitar importações que prejudiquem exportadores e indústria nacional."
- `comercio_18`: nacionalização puxa Economia/Controle se for literal. Melhor: "Cadeias produtivas estratégicas devem ser protegidas da concorrência externa."
- `religiao_05`: família religiosa pode puxar Moral, mas fica no eixo se a ênfase for importância da fé. Melhor: "A religião torna a vida familiar e comunitária mais sólida."
- `religiao_17`: objeção de consciência puxa Poder/serviço público, mas fica no eixo se a ênfase for liberdade religiosa. Melhor: "A consciência religiosa deve pesar mais que normas profissionais em dilemas morais graves."
- `moral_04`: "obrigadas por lei" puxa Poder. Melhor: "Diversidade racial em cargos de liderança é sinal de justiça social."
- `moral_10`: "direito" pode puxar lei. Melhor: "Aborto no início da gestação pode ser uma escolha moralmente aceitável."
- `moral_11`: "criminalizado" puxa Poder. Melhor: "Aborto é moralmente errado porque interrompe uma vida humana."
- `moral_12`: escola pública puxa Estado/educação. Melhor: "Crianças e adolescentes deveriam conhecer identidades de gênero sem tabu."
- `moral_13`: "não do Estado" puxa Poder. Melhor: "Educação sexual deveria seguir principalmente os valores da família."
- `moral_18`: "proibido" puxa Poder. Melhor: "Castigo físico em crianças é uma prática moralmente inaceitável."
- `moral_19`: liberdade dos pais puxa Poder. Melhor: "Pais devem ser a principal autoridade moral na educação dos filhos."
- `moral_20`: empresas e governos puxa política institucional. Melhor: "Paridade de gênero em liderança é um ideal social positivo."
- `tecnologia_01`: empresas e preços puxa Economia. Melhor: "Reduzir plástico e poluição vale mesmo quando exige abrir mão de conveniência."
- `tecnologia_06`: restrição estatal puxa Poder. Melhor: "Agrotóxicos representam risco ambiental maior do que seus ganhos produtivos."
- `tecnologia_11`: proibição puxa Poder. Melhor: "Mesmo mineração limpa na Amazônia ultrapassa um limite ecológico."
- `tecnologia_20`: veganismo obrigatório puxa Poder/Moral. Melhor: "Pecuária moderna pode ser compatível com progresso técnico e responsabilidade ambiental."

## Trocas sugeridas

As sugestões abaixo preservam o ID e o polo de cada item. A ideia é trocar perguntas mais genéricas, redundantes ou fora do eixo por perguntas mais diretas.

### Estrutura

Cobertura atual: boa em federalismo, município, União e serviços nacionais. Falta confederalismo, secessão e centralização extrema.

- `estrutura_13` LEFT -> "Estados deveriam ter direito de se separar da federação se a maioria local quiser."
- `estrutura_19` LEFT -> "O Brasil funcionaria melhor como uma confederação de estados quase soberanos."
- `estrutura_18` RIGHT -> "A União deve poder padronizar leis locais mesmo contra costumes regionais."
- `estrutura_20` RIGHT -> "Governadores e prefeitos deveriam obedecer a planos nacionais, não agir como poderes independentes."

### Representação

Cobertura atual: boa em eleição, líder forte, monarquia e ditadura. Falta tecnocracia explícita, anarquia/assembleísmo e autoritarismo mais extremo.

- `representacao_09` LEFT -> "Uma sociedade anarquista, organizada por assembleias locais, seria melhor que governo profissional."
- `representacao_11` LEFT -> "Plebiscitos deveriam poder derrubar leis e autoridades sem depender do Congresso."
- `representacao_16` RIGHT -> "Uma tecnocracia comandada por especialistas seria melhor que governo escolhido pelo eleitor médio."
- `representacao_20` RIGHT -> "Uma ditadura competente pode ser legítima se entregar ordem e desenvolvimento."

### Poder

Cobertura atual: boa em polícia, vigilância, armas, privacidade, prostituição, eutanásia e redes. Falta maconha direta e monitoramento estatal mais extremo.

- `poder_01` LEFT -> "Em áreas dominadas pelo crime, mandados coletivos e ocupações policiais prolongadas são aceitáveis."
- `poder_05` LEFT -> "O Estado deveria monitorar comunicações digitais para prevenir terrorismo e crime organizado."
- `poder_02` RIGHT -> "Maconha deveria ser legalizada para produção, venda e consumo adulto."
- `poder_04` RIGHT -> "Drogas, prostituição, apostas e pornografia entre adultos não deveriam ser caso de polícia."

### Imigração

Cobertura atual: boa em assimilação, idioma, costumes e multiculturalismo. Falta fronteira fechada/aberta mais nítida e cidadania multicultural.

- `imigracao_03` LEFT -> "Fronteiras fechadas podem ser necessárias para preservar a identidade cultural de um país."
- `imigracao_13` LEFT -> "Residência permanente deveria exigir domínio do idioma e aceitação dos costumes nacionais."
- `imigracao_04` RIGHT -> "Pessoas pacíficas deveriam poder morar e trabalhar no país mesmo sem barreiras migratórias rígidas."
- `imigracao_20` RIGHT -> "Cidadania e direitos sociais não deveriam depender de origem, idioma ou costume familiar."

### Diplomacia

Cobertura atual: forte em militarismo, pacifismo, desarmamento e armas. Falta confronto anti-imperialista e pacifismo extremo.

- `diplomacia_07` LEFT -> "O Brasil deveria buscar capacidade nuclear militar para não depender da proteção de potências estrangeiras."
- `diplomacia_19` LEFT -> "Confrontar potências imperialistas pode exigir força militar, não apenas notas diplomáticas."
- `diplomacia_12` RIGHT -> "Nenhuma causa ideológica justifica iniciar uma guerra."
- `diplomacia_20` RIGHT -> "O país deveria aceitar vulnerabilidade militar se isso reduzir o risco de guerra."

### Intervenção

Cobertura atual: boa em neutralidade, influência regional, sanções e interesse nacional. Falta hegemonia regional/chauvinismo mais explícito.

- `intervencao_06` LEFT -> "O Brasil não deveria enviar tropas ao exterior nem para missões humanitárias."
- `intervencao_19` LEFT -> "Neutralidade deve ser mantida mesmo quando aliados pressionam por apoio."
- `intervencao_10` RIGHT -> "O Brasil deveria impor liderança política sobre a América do Sul quando seus interesses estiverem em jogo."
- `intervencao_12` RIGHT -> "Influenciar governos vizinhos é legítimo quando aumenta a segurança e a vantagem brasileira."

### Economia

Cobertura atual: mistura bem público/privado, mas impostos aparecem demais para um eixo que deveria ser serviço público, propriedade e setor privado.

- `economia_02` LEFT -> "Uma revolução socialista pode ser necessária para substituir o poder dos grandes proprietários."
- `economia_06` LEFT -> "Grandes empresas e bancos deveriam ser estatizados se forem essenciais para a população."
- `economia_03` RIGHT -> "Saúde, educação e previdência deveriam funcionar principalmente por serviços privados concorrentes."
- `economia_17` RIGHT -> "A propriedade privada deve ser protegida mesmo quando gera grande desigualdade."

### Controle

Cobertura atual: boa em Banco Central, câmbio, lastro, impostos, preço e subsídio. Falta controle monetário e liberdade monetária mais extremos.

- `controle_10` LEFT -> "Em crises, o governo deve poder congelar preços, salários e aluguéis."
- `controle_18` LEFT -> "O governo deveria poder controlar saída de capital e câmbio para proteger a economia."
- `controle_11` RIGHT -> "Moedas privadas e criptomoedas deveriam poder competir livremente com a moeda estatal."
- `controle_15` RIGHT -> "Banco Central independente e moeda com lastro rígido valem mais que flexibilidade política."

### Comércio

Cobertura atual: boa em tarifas, importação, multinacionais, soberania e globalização. Falta autarquia e abertura radical mais explícitas.

- `comercio_06` LEFT -> "Produtos estratégicos deveriam ser fabricados no país mesmo que fiquem muito mais caros."
- `comercio_18` LEFT -> "Cadeias produtivas estratégicas devem ser protegidas da concorrência externa."
- `comercio_01` RIGHT -> "Tarifas deveriam ser quase zeradas mesmo que algumas indústrias nacionais quebrem."
- `comercio_07` RIGHT -> "Consumidores e empresas deveriam comprar de qualquer país sem proteção estatal."

### Religião

Cobertura atual: boa em laicidade, símbolos, ensino religioso e vida privada. Falta Estado confessional/teocrático direto.

- `religiao_18` LEFT -> "Religião deveria ficar totalmente fora da política, das escolas públicas e dos prédios do Estado."
- `religiao_20` LEFT -> "Nenhuma igreja deveria receber privilégio fiscal, simbólico ou jurídico do governo."
- `religiao_03` RIGHT -> "As leis deveriam refletir os valores da religião majoritária do país."
- `religiao_07` RIGHT -> "O Estado deveria assumir uma identidade religiosa oficial."

### Moral

Cobertura atual: boa em aborto, LGBT, cotas, linguagem e família. Falta progressismo e tradicionalismo extremos mais nítidos.

- `moral_05` LEFT -> "A identidade de gênero autodeclarada deve ser respeitada socialmente."
- `moral_10` LEFT -> "Aborto no início da gestação pode ser uma escolha moralmente aceitável."
- `moral_11` RIGHT -> "Aborto é moralmente errado porque interrompe uma vida humana."
- `moral_16` RIGHT -> "Pornografia, prostituição e drogas são sinais de decadência moral."

### Tecnologia

Cobertura atual: boa em IA, nuclear, Amazônia, transgênicos e transhumanismo. Falta eugenia/melhoramento humano, plástico/arborização e bioconservadorismo mais extremo.

- `tecnologia_12` LEFT -> "Eugenia e melhoramento genético humano podem ser formas legítimas de reduzir doenças e ampliar capacidades."
- `tecnologia_18` LEFT -> "Implantes cerebrais, próteses inteligentes e edição genética são caminhos legítimos para superar limites humanos."
- `tecnologia_01` RIGHT -> "Reduzir plástico descartável e poluição vale mesmo quando encarece o consumo."
- `tecnologia_13` RIGHT -> "Editar embriões para melhorar inteligência, aparência ou força ultrapassa um limite ético."

## Temas que eu adicionaria se o pool crescer

Se o pool passar de 20 para 24 ou 30 perguntas por eixo, eu adicionaria estes temas sem substituir os atuais:

- Estrutura: autonomia judicial estadual, polícia municipal forte, separatismo regional, transferência fiscal obrigatória.
- Representação: sorteio de cidadãos, voto obrigatório, voto censitário, partido único, conselhos populares.
- Poder: câmeras corporais, acesso estatal a mensagens criptografadas, legalização de todas as drogas, regulação de IA em redes sociais.
- Imigração: cotas migratórias por idioma, refúgio climático, escolas bilíngues, naturalização automática.
- Diplomacia: conscrição em massa, indústria bélica, drones autônomos, objeção de consciência militar.
- Intervenção: bases no exterior, financiamento de aliados, influência sobre eleições vizinhas, retirada de organismos internacionais.
- Economia: SUS, universidade pública, vouchers escolares, moradia pública, cooperativas, herança.
- Controle: imposto de renda, imposto sobre consumo, orçamento participativo, dolarização, fim do Banco Central estatal.
- Comércio: OMC, sanções comerciais, compra governamental nacional, dumping chinês, abertura agrícola.
- Religião: ensino confessional, casamento religioso com efeito civil, objeção de consciência, ateísmo de Estado.
- Moral: barriga de aluguel, divórcio, adoção LGBT, prostituição moralmente aceita, educação sexual.
- Tecnologia: IA geral, robôs militares, geoengenharia, arborização urbana obrigatória, veganismo, Amazônia, energia nuclear.
