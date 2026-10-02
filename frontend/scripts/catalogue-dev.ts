import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import type { Plugin } from 'vite';

const run = promisify(execFile);

// Catalogue pages are generated HTML, so Vite's SPA fallback cannot render them.
export function catalogueDevPlugin(): Plugin {
  return {
    name: 'catalogue-pages-dev',
    apply: 'serve',
    configureServer(server) {
      const root = server.config.root;
      const scripts = join(root, 'scripts');
      const data = resolve(root, '../backend/src/main/resources/data');
      const output = join(root, 'node_modules/.cache/catalogue-pages');
      let generation: Promise<unknown> | undefined;

      server.watcher.add([scripts, data]);
      server.watcher.on('all', (_event, path) => {
        if (path.startsWith(scripts + sep) || path.startsWith(data + sep)) {
          generation = undefined;
          server.ws.send({ type: 'full-reload' });
        }
      });

      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const path = (req.url ?? '/').split('?')[0].replace(/\/+$/, '');
        const catalogue = /^\/(?:en\/)?(?:ideologies|personalities|countries)(?:\/[a-z0-9-]+)?(?:\.html)?$/.test(path);
        const stylesheet = /^\/(?:ideologies|personalities|countries|profile)\.css$/.test(path);
        if (!catalogue && !stylesheet) return next();

        try {
          generation ??= run(process.execPath, [join(scripts, 'generate-pages.mjs'), '--catalogue-only']);
          await generation;
          const file = stylesheet || path.endsWith('.html') ? path : `${path}.html`;
          const content = await readFile(join(output, file));
          res.setHeader('Content-Type', stylesheet ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          const body = stylesheet ? content : await server.transformIndexHtml(path, content.toString());
          res.end(req.method === 'HEAD' ? undefined : body);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Catalogue page not found');
          } else {
            generation = undefined;
            next(error);
          }
        }
      });
    }
  };
}
