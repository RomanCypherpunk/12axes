import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { protectTranslatedText } from './utils/translationDom';
import type { TreeKind } from './tree/data';
import '@fontsource/poppins/latin-300.css';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/sora/latin-400.css';
import '@fontsource/sora/latin-500.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import '@fontsource/sora/latin-800.css';
import './styles/tokens.css';
import './styles/app.css';
import './styles/results.css';
import './styles/editorial.css';
import './styles/motion.css';

// Depois de um deploy, uma aba aberta pede blocos com hash antigo que não existem mais.
// Recarrega uma vez para pegar a versão nova; a trava evita laço se o bloco estiver mesmo quebrado.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'chunk-reload-at';
  try {
    const last = Number(window.sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last > 10_000) {
      event.preventDefault();
      window.sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    }
  } catch {
    // sessionStorage indisponível: deixa o erro seguir o fluxo normal.
  }
});

// Visualização em teia dos catálogos: /tree/{ideologies|personalities|countries|parties} (e /en/tree/...).
const TreePage = lazy(() => import('./tree/TreePage'));
const TREE_ROUTE = /^\/(en\/)?tree(?:\/(ideologies|personalities|countries|parties))?\/?$/.exec(window.location.pathname);

const root = document.getElementById('root') as HTMLElement;
protectTranslatedText(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      {TREE_ROUTE ? (
        <Suspense fallback={null}>
          <TreePage kind={(TREE_ROUTE[2] as TreeKind | undefined) ?? 'ideologies'} locale={TREE_ROUTE[1] ? 'en' : 'pt'} />
        </Suspense>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
