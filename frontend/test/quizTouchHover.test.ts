import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('quiz button touch hover styles (issue #274)', () => {
  const css = readFileSync(resolve(__dirname, '../src/styles/app.css'), 'utf-8');

  it('scopes answer-button hover transform and accent indicator within hover media query', () => {
    // Check that modern quiz answer-button hover styles are inside (hover: hover) and (pointer: fine)
    const hoverBlockRegex = /@media\s*\(\s*hover:\s*hover\s*\)\s*and\s*\(\s*pointer:\s*fine\s*\)\s*\{[\s\S]*?\.answer-button:hover:not\(:disabled\):not\(\.selected\)\s*\{[\s\S]*?transform:\s*translateX\(8px\);/m;
    expect(css).toMatch(hoverBlockRegex);
  });

  it('provides a touch reset for coarse/non-hover devices so tapped options do not appear pre-marked', () => {
    const coarseResetRegex = /@media\s*\(\s*hover:\s*none\s*\)\s*,\s*\(\s*pointer:\s*coarse\s*\)\s*\{[\s\S]*?\.answer-button:hover:not\(:disabled\):not\(\.selected\)\s*\{[\s\S]*?transform:\s*none;/m;
    expect(css).toMatch(coarseResetRegex);
  });
});
