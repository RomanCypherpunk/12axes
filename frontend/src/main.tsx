import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
