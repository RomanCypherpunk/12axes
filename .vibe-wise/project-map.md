# Project Map

## Purpose
Fork of 12 Axes (political quiz on 12 axes, matched against ideology/country/personality catalogs). Goal: adapt into a football-manager philosophy quiz (FORK_README.md).

## Requirements
- Chosen (learner): tasks/1 spec split into Phase 1 centralise colours (merge near-duplicates; dark theme into own labelled file; PDF palette into tokens.css), then Phase 2 football re-skin. NFR-002 WCAG contrast added (AI proposal, pending learner review).
- Learner wants (proposed, not yet confirmed): all colours in one token location; New Star Soccer-like green; pitch-line imagery (corner arc, penalty box, field lines), especially on first view; footballs; respect good design practice.
- Task 1 (tasks/1. FOOTBALL_DESIGN_SPEC.md): restyle site to feel football-like; predominant pitch green (NFR-001). Content stays political for now (out of scope).

## Components
- frontend/ — React 18 + TypeScript + Vite. Entry: src/main.tsx → App.tsx (~1050 lines).
  - Screens: src/components/editorial/ (HomeScreen, ResultsScreen, VariantScreen, RoseOfAxes); results sections in src/components/results/; quiz UI: QuestionCard, ProgressHeader, QuizThemeToggle.
  - Styling: plain CSS imported in main.tsx, in order tokens.css → app.css (~12k lines, ~118 hardcoded hex colors) → results.css → editorial.css → motion.css; report.css for PDF report.
  - Design tokens: src/styles/tokens.css :root — green scale (currently dark "Floresta" #102E24), red "Carmim" scale, ink neutrals, paper background #F4F1E8, semantic aliases (--bg, --surface, --accent, --critical, gradients), Portuguese aliases (--papel, --floresta...), ideology family colors (--i-*). Dark theme: html[data-quiz-theme="dark"] in theme-dark.css (toggled by QuizThemeToggle, quiz only). Hard-coded colours outside tokens: app.css 126 hex + 200 rgb(a); editorial.css 24 hex + 36 rgb(a); motion.css 5 rgb(a); ~69 unique hex, ~107 unique rgb(a), many being white/forest at varying opacity.
  - Fonts: Sora (display) + Poppins (body) via @fontsource.
- backend/ — Spring Boot 3.3 / Java 21 REST API with matching algorithm (not touched by task 1).

## Main Flow
Browser → frontend (Vercel) → REST API (backend on Render) → JSON catalog data → match results → frontend renders.

## Data and Trust Boundaries
Not relevant to task 1; not inspected.

## Build and Deployment
- frontend: npm run build (tsc --noEmit + vite build + generate-pages), npm test (vitest), npm run dev.
- backend: render.yaml (Docker). frontend/vercel.json.

## Colour architecture (implemented, Phase 1)
- Learner decisions: tokens.css is the only hand-edited source; merge colours within dE2000 < 5; opacity rounded to 0.1; dark theme in its own labelled file; PDF reuses tokens.css; generated TS file is unversioned; component-specific colours in their own file; hard-coded colours keep their behaviour (stay fixed in dark mode).
- AI decisions (learner delegated): --fixed-* primitive layer at top of tokens.css :root, never overridden by dark theme; existing tokens with same value point to it (var()); alpha < 0.1 rounded to nearest 0.05; dark-only new tokens --dark-*; homeAxes.ts and countries-index era palette stay as their own data; shareCard #000000 and PoliticalCompass WHITE/NEUTRAL tuples stay as maths constants.
- Files: src/styles/tokens.css (source); src/styles/theme-dark.css (dark base + dark rules, imported after app.css in main.tsx); scripts/generate-tokens.mjs (+ .d.mts) -> src/styles/tokens.generated.ts (gitignored; run by predev/pretest/prebuild/pretest:watch); src/styles/componentColors.ts (crypto brand + compass fallbacks); vite.config.ts tokensHtmlPlugin fills /*@tokens*/ and {{token:name}} in index.html; static page CSS starts with tokensRootCss(); test/tokens.test.ts guards against hard-coded colours in stylesheets.

## Unknowns
- Backend runs locally via `./mvnw spring-boot:run` despite no `javac`: Maven reuses the already-compiled backend/target/classes. Editing backend Java code would need a JDK 21 to recompile.
- Which design direction for "football-like" (pitch textures, scoreboard typography, kits, etc.) — learner's decision.
