import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error script em JS puro, sem tipos
import { compassModelJson, MODEL_FILE } from '../scripts/compass-model.mjs';

describe('pesos da bússola', () => {
  it('src/data/compassModel.json está em dia com os catálogos (rode node scripts/compass-model.mjs)', () => {
    expect(readFileSync(MODEL_FILE, 'utf8').replace(/\r\n/g, '\n')).toBe(compassModelJson());
  }, 120_000);
});
