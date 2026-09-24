# Hyperframes Composition Brief: 12 Axes

## Objective
Create a short launch-style brag video for 12 Axes.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21.5 seconds

## Source Material
- Project root: `12Axes/` (frontend React/Vite, backend Spring Boot)
- Primary files read: `frontend/index.html`, `src/styles/tokens.css`, `src/styles/editorial.css`, `src/styles/app.css` (answer buttons), `src/components/editorial/{HomeScreen,ResultsScreen,RoseOfAxes,primitives}.tsx`, `src/components/QuestionCard.tsx`, `src/i18n/index.ts`, `src/data/exampleResult.ts`, `backend/.../questions-pool.json`, `ideologies.json`, README
- Product name: 12 Axes (logo "**12** axes")
- Tagline / strongest claim: "Você sabe mesmo qual é a sua ideologia política?"
- Key UI or visual moment to recreate: question card with the 5 colored answers → result ring (compatibility %) + country and personality cards → Rose of Axes radar
- Copy that must appear verbatim:
  - Você sabe mesmo qual é a sua ideologia política?
  - Com concorrência, empresas privadas prestam serviços melhores do que o Estado.
  - Concordo totalmente / Concordo / Neutro ou Depende / Discordo / Discordo totalmente
  - Pergunta 1 de 240
  - País mais compatível / Personalidade mais compatível / match
  - Gratuito · Anônimo · Resultado imediato
  - 12axes.vercel.app

## Creative Direction
- Tone preset: polished
- Creative direction: revista política editorial (Papel/Floresta/Carmim), sóbria e confiante, com a roleta de ideologias como piscadela
- Interpretation: 5 cenas, holds generosos, entradas rápidas (0.3–0.6s) e transições suaves; energia vem da roleta e dos contadores.
- Angle: o H1 real do site desafia o espectador; o vídeo mostra a pergunta, acelera pelas 240, gira pelos nomes reais do catálogo e trava num resultado concreto.
- Hook: H1 em Sora 800 sobre Papel, "ideologia política" acendendo em carmim no cue 1.60s
- Outro / punchline: logo "12 axes" em 17.91s + "Gratuito · Anônimo · Resultado imediato" + URL
- Avoid: generic SaaS language; abstract filler; redesigning the brand

## Visual Identity
- Background: #F4F1E8 (Papel); surface #FBF9F3; border #E2DDCF; dark scene #102E24 (Floresta)
- Text: #101010 / muted #5B5A55; on dark #BFD1C6
- Accent: Floresta #102E24, Carmim #880912, rose-on-dark #E7A9A4; Esquerda category color #035732
- Display font: Sora 600/700/800 (local woff2)
- Body font: Poppins 400/500/600 (local woff2)
- Visual references from the project: answer button gradients (floresta→carmim), compatibility ring, tags `e-tag-solid`, eyebrow "— " em carmim caixa alta, RoseOfAxes (12 raios, 3 anéis tracejados, polígono #E7A9A4)

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

1. Hook — 3.7s — eyebrow + H1 real
2. Pergunta — 5.26s — card real, 5 respostas, clique em "Concordo", contador 1→240
3. Roleta → resultado — 5.64s — nomes reais girando, trava em Socialismo 89%, Suécia 76%, Karl Marx 94%
4. Escala — 3.31s — roseta + 192 ideologias / 151 países / 316 personalidades
5. Outro — 3.59s — logo, labels, URL

## Audio
- Audio role: warm bed with sparse professional accents
- Audio arc: bed from 0s, accents at interactions, fade-out over the last ~1.2s under the logo hit
- Music: happy-beats-business-moves-vol-11-by-ende-dot-app.mp3
- Music treatment: steady ~0.8 volume, fade 20.3→21.5s
- Music cue guidance: bundled preset (114.84 BPM). Strong cues 1.60 / 8.96 / 17.91. Beats for sequences: 4.23, 4.75, 5.28, 5.80 (answers), 11.60 / 12.65 (cards), 14.76 / 15.81 / 16.86 (stats).
- Audio-reactive treatment: subtle — RMS/bass modulates rose polygon fill + ring glow; no visualizer graphics
- Audio-coupled moments: click on "Concordo" (6.34), roulette lock soft impact, card slides, logo bell
- SFX selection guidance: low-HF-risk picks from sfx-analysis.md
- Exact SFX choice: chosen during composition
- Audio files: copied into `composition/assets/`

## Hyperframes Instructions
Standalone `index.html`, one paused GSAP timeline (`window.__timelines["main"]`), local GSAP + fonts + media. Run `npx hyperframes check` before render.
