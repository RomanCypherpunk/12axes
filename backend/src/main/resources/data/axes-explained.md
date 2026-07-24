# 12 Eixos — Documentação de Referência

Documento de referência dos 12 eixos do quiz político **12axes**. Cada eixo mede uma tensão entre dois polos opostos. Abaixo estão, para cada eixo: identificador técnico, rótulos (PT/EN), polos, cores, a descrição exibida na interface e os temas avaliados por cada polo.

> A ordem segue a numeração oficial da interface (01–12), idêntica à do `axes.json`.

---

## Como interpretar a pontuação

Cada eixo produz uma **pontuação de 0 a 100**, sendo **50 o centro** (posição perfeitamente equilibrada). Dessa pontuação leem-se duas informações complementares: a **porcentagem de compatibilidade** com cada polo e a **direção/intensidade** da posição.

### 1. Porcentagem de compatibilidade com cada polo

A pontuação **é**, ela mesma, a porcentagem de compatibilidade com o **polo esquerdo** (`leftPole`). Quanto **maior** a pontuação, maior o alinhamento com o polo esquerdo; quanto **menor**, maior o alinhamento com o **polo direito** (`rightPole`).

- Compatibilidade com o polo **esquerdo** = **pontuação**
- Compatibilidade com o polo **direito** = **100 − pontuação**

**Exemplos:**

- `Moral = 10` → 10% Progressista / **90% Tradicionalista** (em Moral, o polo esquerdo é Progressista e o direito é Tradicionalista).
- `Intervenção = 90` → **90% Não intervencionista** / 10% Nacionalista — perfil pacifista e contrário ao expansionismo nacional.

### 2. Direção e intensidade

A **direção** (para qual polo a pessoa pende) segue da própria pontuação: **acima de 50** inclina para o **polo esquerdo**; **abaixo de 50**, para o **polo direito**.

A **intensidade** depende da **distância até o centro (50)** — ou seja, de quão longe de 50 está a pontuação. Quanto maior essa distância, mais forte a posição naquele polo:

| Distância do centro | Faixa de pontuação | Classificação |
|---|---|---|
| 0 – 7,5 | 42,5 – 57,5 | **Equilibrado** |
| 7,5 – 22,5 | 27,5 – 42,5 ou 57,5 – 72,5 | **Inclinado para** |
| 22,5 – 37,5 | 12,5 – 27,5 ou 72,5 – 87,5 | **Forte para** |
| acima de 37,5 | abaixo de 12,5 ou acima de 87,5 | **Muito forte para** |

**Exemplos:**

- `Moral = 5` → distância de 45 até o centro → **muito forte para o Tradicionalismo** (5% Progressista / 95% Tradicionalista).
- `Economia = 60` → distância de 10 até o centro → **inclinado para o Público** (serviço público) — 60% Público / 40% Privado.

> **Resumo prático:** a pontuação diz *quanto* (a % do polo esquerdo) e a distância até 50 diz *com que intensidade* (equilibrado → inclinado → forte → muito forte). Pontuação alta = polo esquerdo; pontuação baixa = polo direito.

---

## 01. Estrutura — Federal × Unitário

- **ID:** `estrutura`
- **Rótulo (EN):** Structure
- **Polo esquerdo:** Federal (`#2f80ed`) — EN: *Federal*
- **Polo direito:** Unitário (`#f2994a`) — EN: *Unitary*

**Descrição:** Mede se você prefere poder distribuído entre estados, municípios e comunidades locais ou um Estado nacional unitário com leis e comando mais uniformes.

**Temas avaliados:** separação, federação, descentralização, centralização, unitarismo, secessão e municipalismo.

**Como as questões operacionalizam o eixo:** autonomia legislativa, fiscal e policial de estados e municípios; constituições estaduais; currículo, saúde, educação e segurança administrados local ou nacionalmente; repartição de impostos; conflitos entre governador e presidente; regras próprias para comunidades indígenas e quilombolas; e o direito de secessão. Este eixo trata da **distribuição territorial do poder**, não de democracia versus autoritarismo.

---

## 02. Representação — Democracia × Autocracia

- **ID:** `representacao`
- **Rótulo (EN):** Representation
- **Polo esquerdo:** Democracia (`#00a896`) — EN: *Democracy*
- **Polo direito:** Autocracia (`#ff6b6b`) — EN: *Autocracy*

**Descrição:** Compara confiança em eleições, anarquia, conselhos, organização voluntária, participação, oposição e instituições democráticas com preferência por liderança forte, tecnocracia, monarquia ou regimes autoritários.

**Como as questões operacionalizam o eixo:** eleições livres, voto universal e secreto, direitos da oposição e da imprensa, cortes constitucionais, referendos, revogação de mandatos, sorteio de cargos e assembleias aparecem no polo democrático. Liderança de exceção, governo sem Congresso, tecnocracia, monarquia, restrição do sufrágio, continuidade pelo desempenho e legitimidade de ditaduras aparecem no polo autocrático. Este eixo mede **quem deve governar e sob quais controles**, não a divisão federal ou unitária do Estado.

---

## 03. Poder — Segurança × Liberdade

- **ID:** `poder`
- **Rótulo (EN):** Power
- **Polo esquerdo:** Segurança (`#4c6ef5`) — EN: *Security*
- **Polo direito:** Liberdade (`#ffd43b`) — EN: *Liberty*

**Descrição:** Avalia o equilíbrio entre ordem, vigilância, punição e controle estatal versus privacidade, liberdade individual e autonomia civil.

**Temas avaliados:** vigilância governamental, monitoramento nas ruas, ação do Estado na sociedade, soberania do indivíduo, proibição de práticas ou atividades, liberdade civil, autonomia, privacidade.

**Como as questões operacionalizam o eixo:** policiamento duro, mandados coletivos, reconhecimento facial, interceptação digital, censura de perfis, dissolução de grupos, armas, toque de recolher, prisão sem julgamento, pena de morte e vacinação obrigatória compõem o polo da segurança. Legalização de drogas, apostas, prostituição e eutanásia, liberdade de expressão ofensiva, presunção de inocência, privacidade financeira e proteção do celular compõem o polo da liberdade. Não mede a forma de eleição do governo; mede os **limites do Estado sobre a vida civil**.

---

## 04. Imigração — Assimilação × Multicultura

- **ID:** `imigracao`
- **Rótulo (EN):** Immigration
- **Polo esquerdo:** Assimilação (`#f06595`) — EN: *Assimilation*
- **Polo direito:** Multicultura (`#5c7cfa`) — EN: *Multiculturalism*

**Descrição:** Observa se você valoriza assimilação cultural, idioma e identidade nacional ou multiculturalismo, abertura migratória e pluralidade de costumes.

**Como as questões operacionalizam o eixo:** adaptação ao idioma e aos costumes locais, controle ou fechamento de fronteiras, deportação, preferência por origens culturais semelhantes, preservação da identidade nacional e crítica a enclaves culturais compõem o polo assimilacionista. Pluralidade de idiomas, escolas bilíngues, acolhimento de refugiados, manutenção dos costumes de origem, fronteiras abertas e cosmopolitismo compõem o polo multicultural. O eixo é cultural e migratório; não é uma medida direta de racismo, segurança pública ou comércio exterior.

---

## 05. Diplomacia — Militarista × Pacifista

- **ID:** `diplomacia`
- **Rótulo (EN):** Diplomacy
- **Polo esquerdo:** Militarista (`#82c91e`) — EN: *Militarist*
- **Polo direito:** Pacifista (`#f783ac`) — EN: *Pacifist*

**Descrição:** Analisa sua posição sobre Forças Armadas, armamento, dissuasão e intervenção militar em contraste com negociação, pacifismo e organismos internacionais.

**Como as questões operacionalizam o eixo:** gasto em defesa, indústria nacional de armas, serviço militar, armas nucleares, ataques preventivos, espionagem, drones e dissuasão compõem o polo militarista. Negociação antes do uso da força, desarmamento, redução ou extinção das Forças Armadas, tribunais internacionais, ONU e recusa de iniciar guerras compõem o polo pacifista. O foco é a atitude diante de **força armada e guerra**, não a ambição geopolítica de projetar interesses nacionais — tratada em Intervenção.

---

## 06. Intervenção — Não intervencionista × Nacionalista

- **ID:** `intervencao`
- **Rótulo (EN):** Intervention
- **Polo esquerdo:** Não intervencionista (`#ffe066`) — EN: *Non-interventionist*
- **Polo direito:** Nacionalista (`#c15f00`) — EN: *Nationalist*

**Descrição:** Mede a inclinação entre não intervencionismo externo e soberania nacional mais assertiva, nacionalismo geopolítico e defesa ativa de interesses nacionais.

**Como as questões operacionalizam o eixo:** neutralidade, recusa de mudar governos estrangeiros, rejeição a bases militares, alianças permanentes, sanções, embargos, missões no exterior e intervenção mesmo diante de genocídio compõem o polo não intervencionista. Pressão sobre outros países, liderança regional, proteção de empresas nacionais no exterior, primazia do interesse nacional sobre tratados, influência sobre vizinhos e uso da força para interesses próprios compõem o polo nacionalista. Um perfil pode ser militarista e não intervencionista, ou pacifista e internacionalista; por isso este eixo é separado de Diplomacia.

---

## 07. Economia — Público × Privado

- **ID:** `economia`
- **Rótulo (EN):** Economy
- **Polo esquerdo:** Público (`#ff3b30`) — EN: *Public*
- **Polo direito:** Privado (`#ffd166`) — EN: *Private*

**Descrição:** Compara preferência por propriedade pública, estatais e serviços coletivos com propriedade privada, privatização e protagonismo empresarial.

**Como as questões operacionalizam o eixo:** propriedade social ou dos trabalhadores, estatais estratégicas, bancos públicos, reforma agrária, renda básica, sindicatos, serviços universais e intervenção direta quando o mercado exclui compõem o polo público. Privatização de serviços e infraestrutura, proteção da herança e da propriedade, crítica a impostos, ao funcionalismo e a transferências sociais, além de negociação individual entre empregado e patrão, compõem o polo privado. Este eixo trata de **quem possui e presta** bens e serviços; o grau de regulação do mercado é medido em Controle.

---

## 08. Controle — Planejamento × Livre mercado

- **ID:** `controle`
- **Rótulo (EN):** Control
- **Polo esquerdo:** Planejamento (`#bf2600`) — EN: *Planning*
- **Polo direito:** Livre mercado (`#00897b`) — EN: *Free market*

**Descrição:** Avalia planejamento estatal, regulação e política econômica ativa contra livre mercado, baixa interferência, autonomia monetária e competição.

**Temas avaliados:** criptomoedas, banco central, economia circular, emissão monetária, congelamento de preços, keynesianismo, entre outros.

**Como as questões operacionalizam o eixo:** planejamento setorial, subsídios e campeãs nacionais, impostos progressivos, salário mínimo, congelamento de preços, controle cambial e de capitais, Banco Central subordinado ao governo e gasto anticíclico compõem o polo do planejamento. Livre formação de preços e salários, desregulação, baixa tributação, independência ou abolição do Banco Central, criptomoedas e livre circulação de capitais compõem o polo do livre mercado. Assim, é possível defender propriedade privada e ainda preferir planejamento regulatório, ou defender propriedade pública com métodos menos centralizados.

---

## 09. Comércio — Protecionismo × Globalismo

- **ID:** `comercio`
- **Rótulo (EN):** Trade
- **Polo esquerdo:** Protecionismo (`#9c27b0`) — EN: *Protectionism*
- **Polo direito:** Globalismo (`#03a9f4`) — EN: *Globalism*

**Descrição:** Mede protecionismo, soberania produtiva e defesa da indústria nacional contra globalismo, livre comércio e integração econômica internacional.

**Como as questões operacionalizam o eixo:** tarifas, limitação de importações, compras públicas nacionais, restrição a empresas estrangeiras em setores estratégicos, segurança alimentar, produção doméstica de remédios e chips e soberania econômica compõem o polo protecionista. Tarifas baixas, acordos de livre comércio, Mercosul e União Europeia, investimento estrangeiro, multinacionais, competição internacional e mercado global compõem o polo globalista. Este eixo é externo: não define, por si, se a economia interna é pública, privada, planejada ou livre.

---

## 10. Religião — Irreligioso × Religioso

- **ID:** `religiao`
- **Rótulo (EN):** Religion
- **Polo esquerdo:** Irreligioso (`#ff9800`) — EN: *Irreligious*
- **Polo direito:** Religioso (`#00a6d6`) — EN: *Religious*

**Descrição:** Compara laicidade, secularismo, ateísmo, separação entre religião e Estado e crítica a privilégios religiosos com influência pública da fé, estado confessional, teocracia e valores religiosos.

> **Importante:** este eixo mede tanto a posição da pessoa em relação à religião em sua vida privada quanto no Estado.

**Como as questões operacionalizam o eixo:** neutralidade religiosa das leis, impostos para igrejas, retirada de símbolos e feriados religiosos do Estado, primazia da ciência, crítica à doutrinação infantil e possibilidade de uma ética sem Deus compõem o polo irreligioso. Fé como fonte de sentido e moral, transmissão religiosa na família, símbolos e identidade religiosa oficiais, leis inspiradas pela maioria religiosa e primazia da lei divina compõem o polo religioso. Não se confunde automaticamente com Moral: uma pessoa pode ser religiosa e progressista, ou secular e tradicionalista.

---

## 11. Moral — Progressista × Tradicionalista

- **ID:** `moral`
- **Rótulo (EN):** Morality
- **Polo esquerdo:** Progressista (`#9c27b0`) — EN: *Progressive*
- **Polo direito:** Tradicionalista (`#8bc34a`) — EN: *Traditionalist*

**Descrição:** Avalia progressismo cultural, direitos civis e mudanças sociais em contraste com tradição, família, costumes e conservadorismo moral.

**Temas avaliados:** aborto, maconha, veganismo, nudez, prostituição, entre outros.

**Como as questões operacionalizam o eixo:** igualdade para casais LGBT, reconhecimento de identidade de gênero, cotas raciais, aborto, educação sexual, prostituição como trabalho, poliamor, linguagem neutra, nudez e redução do consumo de carne compõem o polo progressista. Família tradicional, papéis de gênero convencionais, oposição ao aborto, centralidade dos pais na educação moral, crítica à linguagem neutra, à pornografia, às drogas e a mudanças culturais rápidas compõem o polo tradicionalista. O eixo mede valores culturais e direitos civis, não o grau de religiosidade pessoal ou o tamanho do Estado.

---

## 12. Tecnologia — Tecnologia × Biologia

- **ID:** `tecnologia`
- **Rótulo (EN):** Technology
- **Polo esquerdo:** Tecnologia (`#6aa6b0`) — EN: *Technology*
- **Polo direito:** Biologia (`#f6ad55`) — EN: *Biology*

**Descrição:** Mede entusiasmo por tecnologia, IA, energia nuclear, industrialização, urbanização, transhumanismo, eugenia, engenharia genética e desenvolvimento técnico contra cautela biológica, ambiental, rural e preservacionista.

**Como as questões operacionalizam o eixo:** IA e automação, energia nuclear, transgênicos, mineração tecnológica, exploração espacial, urbanização, edição genética, implantes cerebrais, carne cultivada e solução tecnológica para o clima compõem o polo tecnológico. Vida simples e rural, preservação de ecossistemas, precaução diante de agrotóxicos, mineração, engenharia genética, modificação corporal e expansão espacial, além da prioridade de reduzir consumo, compõem o polo biológico. O eixo descreve a relação com técnica, corpo e natureza; não equivale a ser economicamente liberal ou autoritário.

---

## Tabela-resumo

| # | Eixo | Polo esquerdo | Polo direito | ID |
|---|------|---------------|--------------|-----|
| 01 | Estrutura | Federal | Unitário | `estrutura` |
| 02 | Representação | Democracia | Autocracia | `representacao` |
| 03 | Poder | Segurança | Liberdade | `poder` |
| 04 | Imigração | Assimilação | Multicultura | `imigracao` |
| 05 | Diplomacia | Militarista | Pacifista | `diplomacia` |
| 06 | Intervenção | Não intervencionista | Nacionalista | `intervencao` |
| 07 | Economia | Público | Privado | `economia` |
| 08 | Controle | Planejamento | Livre mercado | `controle` |
| 09 | Comércio | Protecionismo | Globalismo | `comercio` |
| 10 | Religião | Irreligioso | Religioso | `religiao` |
| 11 | Moral | Progressista | Tradicionalista | `moral` |
| 12 | Tecnologia | Tecnologia | Biologia | `tecnologia` |

---

## Relação direta com o banco de questões

Este documento explica o significado conceitual de cada eixo, mas sua aplicação é definida diretamente por [questions-pool.json](questions-pool.json). O arquivo contém as 20 perguntas de cada eixo, o polo com o qual concordar aproxima a resposta (`agreePole`) e o peso usado no cálculo. Ao alterar, criar ou reinterpretar uma pergunta, revise também esta documentação para manter a correspondência entre conceito, texto da questão e pontuação do quiz.
