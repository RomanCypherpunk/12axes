import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import countries from '../../backend/src/main/resources/data/countries.json';

interface CountryAsset {
  id: string;
  name: string;
  flagPath: string;
}

describe('country flag assets', () => {
  it('has a public image file for every current country flagPath', () => {
    const missing = (countries as CountryAsset[])
      .filter((country) => !/^(?:https?:|data:|blob:)/i.test(country.flagPath))
      .filter((country) => {
        const publicPath = country.flagPath.replace(/^\/+/, '');
        const filePath = fileURLToPath(new URL(`../public/${publicPath}`, import.meta.url));
        return !existsSync(filePath);
      })
      .map((country) => `${country.id}: ${country.flagPath}`);

    expect(missing).toEqual([]);
  });
});
