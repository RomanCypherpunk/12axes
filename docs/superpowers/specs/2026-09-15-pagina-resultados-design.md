# Página de resultados expandida — design

Data: 2026-09-15
Status: aprovado para implementação

## Objetivo

Transformar a tela de resultados do quiz de 12 eixos, hoje um resumo curto
(ideologia + 12 eixos + 1 país + 1 personalidade), numa página longa e completa
sobre o perfil ideológico do usuário, com catálogos de afinidade e de distância.

Referência de estrutura: página de resultados do 16personalities (hero com o
nome do tipo, seções numeradas, sidebar de navegação). Referência visual: padrão
de design shadcn/ui — **a linguagem, não a biblioteca** — sobre a identidade
visual que o projeto já tem.

## Escopo

Três frentes:

1. Reclassificação das 282 personalidades em 8 categorias curadas.
2. Backend: novos campos no `QuizResult` (opostos, país histórico, categorias).
3. Frontend: nova página de resultados.

Fora de escopo: migração para Tailwind/shadcn; tema escuro; alteração do
algoritmo de compatibilidade (`ProfileMatchScorer` fica intacto).

---

## 1. Classificação de personalidades

### Problema

`personalities.json` tem 282 perfis com o campo `role` em texto livre: **105
valores distintos** ("Estadista", "Criptógrafo", "Filósofo e economista",
"Teórico anarquista"...). É impossível agrupar por esse campo.

### Solução

Novo campo `category` em `personalities.json`, com **8 valores fechados**:

| `category` | Abrange |
|---|---|
| `politico` | Chefes de Estado, estadistas, ditadores, monarcas, imperadores, parlamentares |
| `religioso` | Líderes e fundadores religiosos, teólogos |
| `economista` | Economistas e teóricos econômicos |
| `filosofo` | Pensamento geral e abstrato: ética, metafísica, epistemologia, filosofia política clássica |
| `teorico` | Formuladores de doutrina política/social específica e operacional (marxismo, anarquismo, geopolítica, teoria da elite) |
| `empresario` | Empresários, industriais, investidores |
| `intelectual` | Escritores, jornalistas, juristas, cientistas, militares, historiadores |
| `ativista` | Militantes de movimentos sociais e de direitos civis |

O campo `role` **continua como está**, em texto livre, exibido abaixo do nome
como legenda ("Ditador", "Criptógrafo"). `category` agrupa; `role` descreve.

### Critério filósofo × teórico

A única fronteira ambígua, e ela decide ~50 perfis:

- **`filosofo`**: pensamento geral e abstrato. Platão, Kant, Nietzsche, Arendt, Rawls.
- **`teorico`**: formulou uma doutrina política ou social específica e
  operacional. Marx, Gramsci, Bakunin, Mackinder, Pareto.

Quando o perfil é genuinamente os dois, decide o motivo pelo qual ele está num
catálogo de política: Marx entra como `teorico` porque o marxismo é uma doutrina
operacional; Arendt entra como `filosofo` porque sua obra é análise, não programa.

### Método — classificação individual, não dedução

**Requisito explícito do usuário: a classificação é perfil a perfil.** Não é
permitido mapear `role` para `category` por regra ou tabela, porque roles iguais
escondem perfis diferentes e o resultado sairia errado.

Cada perfil é lido individualmente (`name` + `role` + `description`) e
classificado por subagentes, em lotes paralelos. Cada lote devolve um JSON
`{id: category}` para todos os perfis do lote, sem exceção.

O catálogo EN (`i18n/en/personalities.json`) sobrescreve apenas
`name`/`role`/`description`; `category` vive só no arquivo PT e serve aos dois
idiomas, com rótulos traduzidos no frontend.

### Validação

- Todos os 282 perfis têm `category`
- Todo valor pertence ao conjunto de 8
- Nenhuma categoria fica vazia (se ficar, a seção de 3 categorias distintas perde variedade)

---

## 2. Backend

### `QuizResult` — campos

| Campo | Estado | Conteúdo |
|---|---|---|
| `axes` | existente | 12 eixos |
| `topMatch` | existente | ideologia mais compatível |
| `matches` | existente | 4 ideologias (top + 3), `TOP_MATCHES` continua 4 |
| `bottomIdeologyMatch` | **novo** | 1 ideologia menos compatível do catálogo |
| `topCountryMatch` | **alterado** | melhor país **atual** (`historical: false`) |
| `topHistoricalCountryMatch` | **novo** | melhor país **histórico** (`historical: true`) |
| `bottomCountryMatches` | **novo** | 3 países menos compatíveis, catálogo inteiro |
| `topPersonalityMatch` | existente | personalidade mais compatível, qualquer categoria |
| `categoryPersonalityMatches` | **novo** | 3 personalidades, categorias distintas entre si e diferentes da top-1 |
| `bottomPersonalityMatches` | **novo** | 3 personalidades menos compatíveis, catálogo inteiro |

### Mudança de comportamento

`topCountryMatch` hoje é o melhor do catálogo **inteiro** e pode ser um país
histórico. Passa a ser o melhor **entre os atuais**. Links de resultado já
compartilhados podem exibir um país diferente do que exibiam antes. Aceito: a
separação atual/histórico é o que a página pede.

### Algoritmos

**3 personalidades por categoria distinta.** Percorre o ranking completo de cima
para baixo e coleta a primeira personalidade de cada categoria ainda não vista,
pulando a top-1 e a categoria dela, até ter 3. Se o catálogo tiver menos de 4
categorias representadas, devolve quantas houver.

Exemplo — top-1 é Marx (`teorico`): o resultado é o `politico` mais alto, o
`filosofo` mais alto e o `economista` mais alto, na ordem em que aparecem no
ranking (não em ordem fixa de categoria).

**Opostos (países, personalidades, ideologia).** Menor compatibilidade no
catálogo inteiro, sem restrição de categoria nem de `historical`. Desempate por
nome, como no ranking de cima.

Consequência conhecida: regimes históricos extremos tendem a ocupar o fundo do
ranking de países para quase todo usuário, então os 3 piores serão quase sempre
os mesmos. Aceito — o usuário escolheu catálogo inteiro por consistência com as
personalidades opostas.

### Estrutura

`PersonalityMatcherService` ganha os métodos de categoria e de opostos;
`CountryMatcherService` ganha filtro por `historical` e opostos;
`IdeologyMatcherService` ganha o oposto. Os três já rankeiam o catálogo inteiro
internamente e só truncam no fim — a mudança é de exposição, não de cálculo.

`ProfileMatchScorer` **não muda**. Os 5 testes que já falham na `main` por
questões de centrismo/pragmatismo continuam falhando e não são escopo aqui.

---

## 3. Frontend

### Restrições da base

- CSS puro: `tokens.css` (220 linhas) + `app.css` (6.726 linhas). Sem Tailwind.
- React 18 + Vite, sem router: `/results` resolve via `window.location.pathname`.
- `App.tsx` tem 1.195 linhas. A página nova **não** entra nele — sai como
  componentes próprios em `components/results/`.

### Padrão shadcn sem a biblioteca

Adotar a linguagem visual, construída sobre os tokens existentes:

| Primitiva shadcn | Implementação |
|---|---|
| `card` | `--paper`, borda hairline 1px `--line`, `--radius-lg` |
| `badge` | pill `--radius-pill`, `--accent-soft` ou `--critical-soft` |
| `tabs` | atual / histórico na seção de países |
| `separator` | 1px `--line` |
| `muted-foreground` | `--text-muted` / `--text-soft` |

### Cor

Sem paleta nova. Papel semântico:

- **Verde** (`--green-500`, `--accent-soft`): afinidade
- **Vermelho** (`--red-500`, `--critical-soft`): distância
- **Ink** (`--ink-300`, `--line`): estrutura

Regra que mantém a coesão: **verde e vermelho nunca decoram, só medem**. Nenhuma
seção ganha cor própria — evita o arco-íris que a identidade do projeto rejeita.

### Tipografia

Sora (display) + Inter (body), já no projeto. Sem família nova. A escala ganha um
degrau acima do atual para o nome da ideologia no hero — é o análogo do "Cônsul"
da página do MBTI.

### Hierarquia de card — três pesos

Evita o "SaaS-card kit" de cards idênticos:

1. **Destaque** (top-1 de cada catálogo): `--paper`, `--shadow-md`, retrato ou bandeira grande
2. **Grade** (categorias, outras ideologias): borda hairline, sem sombra
3. **Distância** (opostos): compactos, `--critical-soft`, sem imagem grande — peso visual menor porque são informação secundária

### Estrutura da página

```
+------------------------------------------------------+
|  SEU PERFIL IDEOLOGICO                               |
|  Social-democracia            +------------------+   |
|  ############___ 87%          | NESTA PAGINA     |   |
|  descricao longa              | 1 Os 12 eixos    |   |
|                               | 2 Paises         |   |
+-------------------------------| 3 Personalidades |---+
| (1) Os 12 eixos               | 4 Afinidades     |   |
|   [AxisResultBar atual]       | 5 Distancias     |   |
|                               | ---------------- |   |
+-------------------------------| [Compartilhar]   |---+
| (2) Paises                    +------------------+   |
|   +---------+ +---------+   <- atual | historico     |
|   | BR 84%  | | ANT 79% |                            |
|   +---------+ +---------+                            |
|   Mais distantes: [3 cards vermelhos, menores]       |
+------------------------------------------------------+
| (3) Personalidades                                   |
|   +--------------------+  <- top-1, card largo       |
|   | [retrato]  Nome 91%|                             |
|   +--------------------+                             |
|   Tambem proximos - por area:                        |
|   +------+ +------+ +------+  <- 3 categorias        |
|   |filos.| |polit.| |econ. |     distintas           |
|   +------+ +------+ +------+                         |
|   Mais distantes: [3 cards vermelhos]                |
+------------------------------------------------------+
| (4) Outras ideologias [3 cards] + a menos compativel |
+------------------------------------------------------+
| (5) Compartilhar                                     |
+------------------------------------------------------+
```

Alinhamento à esquerda; coluna de texto ~68ch. Centralizado apenas no hero.

**Sidebar de navegação**: fixa à direita, seções numeradas, acompanha o scroll
(padrão tirado do 16personalities). A numeração é legítima aqui — a página é um
percurso ordenado de ~6 seções, não decoração. Em mobile, colapsa.

### Ordem das seções e por quê

A lista original do usuário espalhava "menos compatíveis" em três pontos
distantes da página. Agrupando cada bloco de opostos logo abaixo do seu catálogo,
o usuário lê "os países que combinam / os que não combinam" como uma unidade.

1. Hero — ideologia + match + descrição (funde os dois primeiros itens da lista original; são a mesma informação)
2. Os 12 eixos
3. Países — atual, histórico, 3 mais distantes
4. Personalidades — top-1, 3 por categoria, 3 mais distantes
5. Outras ideologias — as 3 + a menos compatível
6. Compartilhar

### Movimento

Os tokens já trazem o princípio escrito: *"o movimento existe para mostrar a
medição acontecendo, nunca como decoração"*. Seguir isso: barras de
compatibilidade animam de 0 até o valor ao entrar no viewport
(`--dur-measure`, `--ease-settle`), uma vez só. Sem fade-up genérico por seção.
`prefers-reduced-motion` já é respeitado globalmente.

### Decisão de restrição

O 16personalities usa ilustrações grandes em cada seção. **Não imitar**: o
projeto não tem linguagem de ilustração, e retratos históricos + bandeiras já são
o material visual. Adicionar ilustração seria inventar um vocabulário que o resto
do site não tem.

### Compartilhamento

`shareCard.ts` gera o PNG a partir do resultado. Com a página muito mais longa, o
card compartilhado **não** deve virar um print da página inteira: continua sendo
um resumo (ideologia + eixos + top país + top personalidade). O que muda é só a
mensagem de texto do `tryNativeShare`, que pode citar os novos dados.

---

## Testes

**Backend** (JUnit, padrão existente):
- 3 personalidades de categorias distintas, todas diferentes da top-1
- categorias distintas entre si
- opostos: menor compatibilidade do catálogo, ordem crescente
- país atual nunca é `historical: true`; país histórico sempre é
- ideologia oposta é a última do ranking
- todos os 282 perfis têm `category` válida

**Frontend** (Vitest): a base de testes atual cobre `quizSelection`. Adicionar
teste da regra de categorias distintas se ela for espelhada no cliente — se
ficar só no backend, não duplicar.

---

## Riscos

| Risco | Mitigação |
|---|---|
| Classificação errada de perfis ambíguos | Critério filósofo × teórico explícito no spec; classificação individual, nunca por regra |
| `topCountryMatch` muda para links já compartilhados | Aceito e documentado |
| `app.css` crescer ainda mais | Estilos da página nova em arquivo próprio, não appendados em `app.css` |
| `App.tsx` crescer | Página nova em `components/results/`, não inline |
