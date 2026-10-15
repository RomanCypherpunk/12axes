import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import parties from '../../backend/src/main/resources/data/parties.json';
import countries from '../../backend/src/main/resources/data/countries.json';
import { resolvePartyLogoSrc } from '../src/utils/partyLogos';

interface PartyAsset {
  id: string;
  name: string;
  logoPath: string;
  countryId: string;
}

const publicFile = (path: string) => fileURLToPath(new URL(`../public/${path.replace(/^\/+/, '')}`, import.meta.url));

describe('party logo assets', () => {
  it('has a public PNG for every party logoPath', () => {
    const missing = (parties as PartyAsset[])
      .filter((party) => !existsSync(publicFile(party.logoPath)))
      .map((party) => `${party.id}: ${party.logoPath}`);

    expect(missing).toEqual([]);
  });

  it('keeps every logo square (1:1)', () => {
    const notSquare = (parties as PartyAsset[])
      .filter((party) => {
        const png = readFileSync(publicFile(party.logoPath));
        const width = png.readUInt32BE(16);
        const height = png.readUInt32BE(20);
        return width !== height;
      })
      .map((party) => party.id);

    expect(notSquare).toEqual([]);
  });

  it('points every party to an existing country', () => {
    const countryIds = new Set((countries as { id: string }[]).map((country) => country.id));
    const broken = (parties as PartyAsset[]).filter((party) => !countryIds.has(party.countryId)).map((party) => party.id);

    expect(broken).toEqual([]);
  });
});

describe('party logo path', () => {
  it('resolves the logo under the base path, from the public folder or just a file name', () => {
    expect(resolvePartyLogoSrc('/parties/logos/vox.png')).toBe('/parties/logos/vox.png');
    expect(resolvePartyLogoSrc('public/parties/logos/vox.png')).toBe('/parties/logos/vox.png');
    expect(resolvePartyLogoSrc('vox.png')).toBe('/parties/logos/vox.png');
    expect(resolvePartyLogoSrc('https://example.com/x.png')).toBe('https://example.com/x.png');
    expect(resolvePartyLogoSrc('')).toBe('');
    expect(resolvePartyLogoSrc(undefined)).toBe('');
  });
});
