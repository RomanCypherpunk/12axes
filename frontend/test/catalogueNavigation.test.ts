import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';
import { catalogueDevPlugin } from '../scripts/catalogue-dev';

describe('local catalogue navigation', () => {
  let server: ViteDevServer;
  let base: string;

  beforeAll(async () => {
    server = await createServer({
      configFile: false,
      root: fileURLToPath(new URL('..', import.meta.url)),
      plugins: [catalogueDevPlugin()],
      server: { host: '127.0.0.1', port: 0 }
    });
    await server.listen();
    base = server.resolvedUrls!.local[0];

    // A cold cache generates every catalogue page; allow extra time on CI runners.
    const response = await fetch(`${base}ideologies`);
    expect(response.status).toBe(200);
    await response.text();
  }, 60_000);

  afterAll(async () => { await server?.close(); });

  it.each(['ideologies', 'personalities', 'countries'])('serves %s in both languages instead of the quiz homepage', async (catalogue) => {
    for (const prefix of ['', 'en/']) {
      const response = await fetch(`${base}${prefix}${catalogue}`);
      const html = await response.text();
      expect(response.status).toBe(200);
      expect(html).toContain('aria-current="page"');
      expect(html).not.toContain('/src/main.tsx');
      expect(html).toContain(`/${prefix}${catalogue}/`);
    }
  });

  it('serves detail pages, clean URL aliases and generated styles', async () => {
    for (const path of ['en/personalities/donald-trump', 'personalities.html', 'en/countries/?search=test', 'profile.css']) {
      const response = await fetch(base + path);
      expect(response.status).toBe(200);
      expect(await response.text()).not.toContain('/src/main.tsx');
    }
    expect((await fetch(base + 'profile.css')).headers.get('content-type')).toContain('text/css');
  });

  it('keeps the quiz homepage and returns 404 for missing catalogue entries', async () => {
    expect(await (await fetch(base)).text()).toContain('/src/main.tsx');
    expect((await fetch(base + 'en/personalities/nonexistent-profile')).status).toBe(404);
  });
});
