import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readColourTokens, tokensRootCss } from '../scripts/generate-tokens.mjs';

const FIXTURE = `:root {
  --fixed-green: #102E24;
  /* comentário */
  --green-500: var(--fixed-green);
  --accent: var(--green-500);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  --font: "Sora", sans-serif;
}
html[data-quiz-theme="dark"] { --green-500: #348264; }`;

describe('readColourTokens', () => {
  it('resolves var() chains to the light value', () => {
    const tokens = readColourTokens(FIXTURE);
    expect(tokens['green-500']).toBe('#102E24');
    expect(tokens.accent).toBe('#102E24');
  });

  it('keeps only single-colour tokens', () => {
    const tokens = readColourTokens(FIXTURE);
    expect(tokens.shadow).toBeUndefined();
    expect(tokens.font).toBeUndefined();
  });
});

describe('tokensRootCss', () => {
  it('emits every :root declaration, ignoring the dark theme', () => {
    const css = tokensRootCss(FIXTURE);
    expect(css).toContain('--green-500:var(--fixed-green)');
    expect(css).toContain('--font:"Sora", sans-serif');
    expect(css).not.toContain('#348264');
  });
});

describe('stylesheets', () => {
  const COLOUR = /#[0-9a-f]{3,8}\b|rgba?\(|(?<![-\w.])(?:white|black)(?![-\w])/i;

  it.each(['app.css', 'editorial.css', 'motion.css', 'report.css', 'results.css'])(
    '%s only uses colours from tokens.css',
    (file) => {
      const css = readFileSync(new URL(`../src/styles/${file}`, import.meta.url), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/url\([^)]*\)/g, '');
      expect(css.match(COLOUR)?.[0]).toBeUndefined();
    }
  );

  it('gives every ideology a base and a background colour', () => {
    const tokens = readColourTokens();
    for (const key of ['esq-radical', 'esquerda', 'centro', 'direita', 'ext-direita', 'terceira', 'libertario', 'anarquismo']) {
      expect(tokens[`i-${key}`]).toMatch(/^#/);
      expect(tokens[`i-${key}-bg`]).toMatch(/^#/);
    }
  });
});
