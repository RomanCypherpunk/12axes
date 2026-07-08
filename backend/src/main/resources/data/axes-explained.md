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

**Temas avaliados:** separação, federação, descentralização, centralização, unitarismo, secessão, municipalismo, entre outros.

---

## 02. Representação — Democracia × Autocracia

- **ID:** `representacao`
- **Rótulo (EN):** Representation
- **Polo esquerdo:** Democracia (`#00a896`) — EN: *Democracy*
- **Polo direito:** Autocracia (`#ff6b6b`) — EN: *Autocracy*

**Descrição:** Compara confiança em eleições, anarquia, conselhos, organização voluntária, participação, oposição e instituições democráticas com preferência por liderança forte, tecnocracia, monarquia ou regimes autoritários.

---

## 03. Poder — Segurança × Liberdade

- **ID:** `poder`
- **Rótulo (EN):** Power
- **Polo esquerdo:** Segurança (`#4c6ef5`) — EN: *Security*
- **Polo direito:** Liberdade (`#ffd43b`) — EN: *Liberty*

**Descrição:** Avalia o equilíbrio entre ordem, vigilância, punição e controle estatal versus privacidade, liberdade individual e autonomia civil.

**Temas avaliados:** vigilância governamental, monitoramento nas ruas, ação do Estado na sociedade, soberania do indivíduo, proibição de práticas ou atividades, liberdade civil, autonomia, privacidade.

---

## 04. Imigração — Assimilação × Multicultura

- **ID:** `imigracao`
- **Rótulo (EN):** Immigration
- **Polo esquerdo:** Assimilação (`#f06595`) — EN: *Assimilation*
- **Polo direito:** Multicultura (`#5c7cfa`) — EN: *Multiculturalism*

**Descrição:** Observa se você valoriza assimilação cultural, idioma e identidade nacional ou multiculturalismo, abertura migratória e pluralidade de costumes.

---

## 05. Diplomacia — Militarista × Pacifista

- **ID:** `diplomacia`
- **Rótulo (EN):** Diplomacy
- **Polo esquerdo:** Militarista (`#82c91e`) — EN: *Militarist*
- **Polo direito:** Pacifista (`#f783ac`) — EN: *Pacifist*

**Descrição:** Analisa sua posição sobre Forças Armadas, armamento, dissuasão e intervenção militar em contraste com negociação, pacifismo e organismos internacionais.

---

## 06. Intervenção — Não intervencionista × Nacionalista

- **ID:** `intervencao`
- **Rótulo (EN):** Intervention
- **Polo esquerdo:** Não intervencionista (`#ffe066`) — EN: *Non-interventionist*
- **Polo direito:** Nacionalista (`#c15f00`) — EN: *Nationalist*

**Descrição:** Mede a inclinação entre não intervencionismo externo e soberania nacional mais assertiva, nacionalismo geopolítico e defesa ativa de interesses nacionais.

---

## 07. Economia — Público × Privado

- **ID:** `economia`
- **Rótulo (EN):** Economy
- **Polo esquerdo:** Público (`#ff3b30`) — EN: *Public*
- **Polo direito:** Privado (`#ffd166`) — EN: *Private*

**Descrição:** Compara preferência por propriedade pública, estatais e serviços coletivos com propriedade privada, privatização e protagonismo empresarial.

---

## 08. Controle — Planejamento × Livre mercado

- **ID:** `controle`
- **Rótulo (EN):** Control
- **Polo esquerdo:** Planejamento (`#bf2600`) — EN: *Planning*
- **Polo direito:** Livre mercado (`#00897b`) — EN: *Free market*

**Descrição:** Avalia planejamento estatal, regulação e política econômica ativa contra livre mercado, baixa interferência, autonomia monetária e competição.

**Temas avaliados:** criptomoedas, banco central, economia circular, emissão monetária, congelamento de preços, keynesianismo, entre outros.

---

## 09. Comércio — Protecionismo × Globalismo

- **ID:** `comercio`
- **Rótulo (EN):** Trade
- **Polo esquerdo:** Protecionismo (`#9c27b0`) — EN: *Protectionism*
- **Polo direito:** Globalismo (`#03a9f4`) — EN: *Globalism*

**Descrição:** Mede protecionismo, soberania produtiva e defesa da indústria nacional contra globalismo, livre comércio e integração econômica internacional.

---

## 10. Religião — Irreligioso × Religioso

- **ID:** `religiao`
- **Rótulo (EN):** Religion
- **Polo esquerdo:** Irreligioso (`#ff9800`) — EN: *Irreligious*
- **Polo direito:** Religioso (`#00a6d6`) — EN: *Religious*

**Descrição:** Compara laicidade, secularismo, ateísmo, separação entre religião e Estado e crítica a privilégios religiosos com influência pública da fé, estado confessional, teocracia e valores religiosos.

> **Importante:** este eixo mede tanto a posição da pessoa em relação à religião em sua vida privada quanto no Estado.

---

## 11. Moral — Progressista × Tradicionalista

- **ID:** `moral`
- **Rótulo (EN):** Morality
- **Polo esquerdo:** Progressista (`#9c27b0`) — EN: *Progressive*
- **Polo direito:** Tradicionalista (`#8bc34a`) — EN: *Traditionalist*

**Descrição:** Avalia progressismo cultural, direitos civis e mudanças sociais em contraste com tradição, família, costumes e conservadorismo moral.

**Temas avaliados:** aborto, maconha, veganismo, nudez, prostituição, entre outros.

---

## 12. Tecnologia — Tecnologia × Biologia

- **ID:** `tecnologia`
- **Rótulo (EN):** Technology
- **Polo esquerdo:** Tecnologia (`#6aa6b0`) — EN: *Technology*
- **Polo direito:** Biologia (`#f6ad55`) — EN: *Biology*

**Descrição:** Mede entusiasmo por tecnologia, IA, energia nuclear, industrialização, urbanização, transhumanismo, eugenia, engenharia genética e desenvolvimento técnico contra cautela biológica, ambiental, rural e preservacionista.

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
