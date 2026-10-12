# Learning Progress

## CSS design tokens / single source of truth
- Introduced: CSS custom properties as design tokens (tokens.css) and the fact that hard-coded colours bypass them.
- Demonstrated understanding: Learner spotted on their own that having two places to change colours is a code smell, and proposed moving the hard-coded colours into the token file.

## CSS vs TypeScript colour sharing
- Introduced: CSS variables only resolve in the browser; code doing colour maths needs concrete values; bundlers (Vite ?raw) can load CSS as text but not as values.
- Learner reasoning: share a single source only for core colours used by both CSS and TS; colours specific to SVGs/components get their own file; prefer a build step over runtime overhead for the shared part.
- Learner chose tokens.css as the hand-edited source (central, easy to find); generated TS file is unversioned and exists only as a build output, so contributors never edit it.
- Learner asked why TS can't import CSS (thought it was TS red tape); explained that it's a browser/CSS limitation, not TS.

## Colour consolidation rule
- Learner decisions: merge near-duplicates into a smaller set for cross-page consistency; dark theme colours go in their own clearly labelled file; PDF palette moves into tokens.css; Phase 1 (centralise) before Phase 2 (re-skin), recorded in the spec.
- Learner rule: merge colours people perceive as the same, keep sufficiently different ones separate; opacity 0.68-0.72 = same white, 0.68 vs 0.78 = distinct.
- Learner chose dE<5: reasoning that this is where colours are clearly different, and it leaves enough groups for the rule to matter.
- Introduced: Delta E 2000 (perceptual colour distance in CIELAB), WCAG contrast ratio.

## Fixed vs theme-aware colours
- Introduced: fixed vs theme-aware tokens; primitive vs semantic token layers.
- Learner decision: hard-coded colours keep current behaviour (stay fixed in dark mode). Learner asked AI to make all remaining Phase 1 decisions.

## Phase 1 status
- Implemented 2026-10-09 in vibe-coding mode (learner request). Learning loop to resume at Phase 2 (football re-skin).
