import { Component, type ErrorInfo, type ReactNode } from 'react';
import { t } from '../i18n';
import { loadProgress } from '../utils/quizProgress';

interface ErrorBoundaryState {
  failed: boolean;
}

// Sem isso, qualquer erro de renderização desmonta a aplicação inteira e a
// pessoa vê uma tela branca. Aqui mostramos uma saída e lembramos que o
// progresso do quiz está guardado.
export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('12axes: erro de renderização', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) {
      return this.props.children;
    }
    const hasProgress = loadProgress() !== null;
    return (
      <main className="app-shell center-shell">
        <div className="error-panel" role="alert">
          <h1>12 Axes</h1>
          <h2>{t.crashTitle}</h2>
          <p>{hasProgress ? t.crashBodyWithProgress : t.crashBody}</p>
          <button className="secondary-button" type="button" onClick={() => window.location.reload()}>
            {t.crashReload}
          </button>
        </div>
      </main>
    );
  }
}
