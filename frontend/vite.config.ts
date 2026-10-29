import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { catalogueDevPlugin } from './scripts/catalogue-dev';

function asyncCssLinkPlugin() {
  return {
    name: 'async-css-link',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
        `<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>`
      );
    }
  };
}

// Com VITE_ASSETS_CDN, o HTML pede o script e o CSS principais à CDN e, se o pedido falhar (CDN fora do ar, ou deploy
// da CDN e da hospedagem ainda fora de sincronia), repete o pedido no próprio site, que também publica /assets.
// window.__ASSET_BASE diz de onde vêm os arquivos carregados depois (telas sob demanda): a CDN, ou '' após uma falha.
function assetFallbackPlugin(cdn: string) {
  return {
    name: 'asset-cdn-fallback',
    apply: 'build' as const,
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      if (!cdn) return html;
      const base = cdn.replace(/\/+$/, '');
      const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const script = new RegExp(`<script type="module" crossorigin src="${escaped}(/assets/[^"]+)"`, 'g');
      const style = new RegExp(`(<link rel="stylesheet" crossorigin href="${escaped}(/assets/[^"]+)"[^>]*?)>`, 'g');
      return html
        .replace(
          `<head>`,
          `<head>
    <script>window.__ASSET_BASE=${JSON.stringify(base)}</script>`
        )
        .replace(
          script,
          (_match, path) =>
            `<script type="module" crossorigin src="${base}${path}" onerror="window.__ASSET_BASE='';var s=document.createElement('script');s.type='module';s.src='${path}';document.head.appendChild(s)"`
        )
        .replace(style, (match, tag, path) =>
          match.includes('<noscript>') ? match : `${tag} onerror="this.onerror=null;this.href='${path}'">`
        );
    }
  };
}

// Com VITE_ASSETS_CDN, os ícones do <head> (favicon e apple-touch-icon) e o logo das metatags de compartilhamento
// (og:image, twitter:image, JSON-LD) também saem da CDN: cada visita pede de 3 a 4 ícones, e na Vercel todo pedido é cobrado.
function iconCdnPlugin(cdn: string) {
  return {
    name: 'icon-cdn',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      if (!cdn) return html;
      const base = cdn.replace(/\/+$/, '');
      return html
        .replace(/(<link rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*? href=")(\/[^"]+)(")/g, `$1${base}$2$3`)
        .replace(/https:\/\/12axes\.vercel\.app\/logo\.png/g, `${base}/logo.png`);
    }
  };
}

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cwd = (globalThis as { process?: { cwd: () => string } }).process?.cwd?.() ?? '.';
  const env = loadEnv(mode, cwd, '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080';
  // Commit em build: VERCEL_GIT_COMMIT_SHA na Vercel, CF_PAGES_COMMIT_SHA no Cloudflare Pages.
  const commitSha = (env.VERCEL_GIT_COMMIT_SHA || env.CF_PAGES_COMMIT_SHA || '').slice(0, 10);

  return {
    plugins: [react(), asyncCssLinkPlugin(), assetFallbackPlugin((env.VITE_ASSETS_CDN || '').replace(/\/+$/, '')), iconCdnPlugin((env.VITE_ASSETS_CDN || '').replace(/\/+$/, '')), catalogueDevPlugin()],
    experimental: {
      // Com VITE_ASSETS_CDN, os arquivos de /assets (JS, CSS e fontes com hash) são pedidos a essa CDN e a hospedagem
      // do site entrega só o HTML. Os arquivos de public/ (favicon etc.) continuam no próprio site.
      renderBuiltUrl(filename, { type, hostType }) {
        const cdn = (env.VITE_ASSETS_CDN || '').replace(/\/+$/, '');
        if (!cdn || type !== 'asset') return undefined;
        // HTML: direto na CDN (com fallback, ver assetFallbackPlugin). CSS: relativo, as fontes acompanham o CSS que carregou.
        // JS (telas sob demanda): a base é decidida na hora, em window.__ASSET_BASE.
        if (hostType === 'html') return `${cdn}/${filename}`;
        if (hostType === 'css') return { relative: true };
        return { runtime: `(window.__ASSET_BASE||"")+${JSON.stringify(`/${filename}`)}` };
      }
    },
    // Bibliotecas carregadas sob demanda (cartão de compartilhar e planilha): sem isto o servidor de desenvolvimento só as
    // descobre ao clicar, re-otimiza no meio da sessão e o navegador fica com um arquivo desatualizado (504 "Outdated Optimize Dep").
    optimizeDeps: { include: ['html-to-image', 'exceljs'] },
    // es2022: o dicionário de idioma é carregado com await no topo do módulo (src/i18n).
    build: {
      target: 'es2022',
      // A Vercel (HTML) e o Cloudflare Pages (/assets) fazem builds separados do mesmo commit, e o hash de conteúdo do Vite
      // sai diferente em cada um: o HTML da Vercel pedia à CDN arquivos que só existiam na própria Vercel, o pedido falhava
      // e todo o JS voltava a ser servido (e cobrado) pela Vercel. Com o SHA do commit no nome, JS e CSS têm o mesmo nome
      // nos dois lugares. Sem SHA (build local), vale o hash de sempre.
      rollupOptions: commitSha
        ? {
            output: {
              entryFileNames: `assets/[name]-${commitSha}.js`,
              chunkFileNames: `assets/[name]-${commitSha}.js`,
              assetFileNames: (info) => (info.name?.endsWith('.css') ? `assets/[name]-${commitSha}[extname]` : 'assets/[name]-[hash][extname]')
            }
          }
        : {}
    },
    test: {
      environment: 'node',
    },
    server: {
      // The backend's OriginEnforcementFilter allowlists http://localhost:5173 and
      // http://127.0.0.1:5173 and rejects /api requests without Origin/Referer, so
      // the dev server must stay on 5173 and the proxy must forward the browser's
      // own Origin/Referer headers untouched.
      fs: { allow: ['..'] },
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true
        }
      }
    }
  };
});
