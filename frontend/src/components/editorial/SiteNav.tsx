import { useEffect, useRef, type ReactNode } from 'react';
import { LANG, langPrefix, setLang, t, type Lang } from '../../i18n';
import { PARTIES_ENABLED } from '../../utils/partyLogos';

/** Links dos catálogos e da comparação, na mesma ordem do menu das páginas estáticas. */
export function CatalogLinks({ current, showCompare = true }: { current?: 'compare'; showCompare?: boolean }) {
  const prefix = langPrefix(LANG);
  return (
    <>
      <a href={`${prefix}/books`}>{t.navBooks}</a>
      <a href={`${prefix}/ideologies`}>{t.navIdeologies}</a>
      <a href={`${prefix}/personalities`}>{t.navPersonalities}</a>
      <a href={`${prefix}/countries`}>{t.navCountries}</a>
      {PARTIES_ENABLED && <a href={`${prefix}/parties`}>{t.navParties}</a>}
      {/* Na própria /compare o link fica sem destino: recarregar apagaria os perfis escolhidos. */}
      {current === 'compare' ? (
        <a aria-current="page">{t.navCompare}</a>
      ) : (
        showCompare && <a href={`${prefix}/compare`}>{t.navCompare}</a>
      )}
    </>
  );
}

const LANG_OPTIONS: { code: Lang; label: string; short: string; flag: ReactNode }[] = [
  { code: 'pt', label: 'Português', short: 'PT', flag: <><path fill="#699635" d="M61.5 26.8C59.1 12.7 46.8 2 32 2S4.9 12.7 2.5 26.8L32 12zm-59 10.4C4.9 51.3 17.2 62 32 62s27.1-10.7 29.5-24.8L32 52z"/><path fill="#ffe62e" d="M32 12L2.5 26.8C2.2 28.5 2 30.2 2 32s.2 3.5.5 5.2L32 52l29.5-14.8c.3-1.7.5-3.4.5-5.2s-.2-3.5-.5-5.2z"/><g fill="#428bc1"><path d="M26 28.4c-3.2 0-6.2.7-8.9 1.9c-.1.6-.1 1.1-.1 1.7c0 8.3 6.7 15 15 15c5.6 0 10.5-3.1 13.1-7.6c-3.7-6.5-10.9-11-19.1-11"/><path d="M46.8 34.4c.1-.8.2-1.6.2-2.4c0-8.3-6.7-15-15-15c-5.9 0-11 3.4-13.5 8.4c2.4-.7 4.9-1.1 7.5-1.1c8.5 0 16 4 20.8 10.1"/></g><g fill="#fff"><path d="M26 24.3c-2.6 0-5.1.4-7.5 1.1c-.7 1.5-1.2 3.1-1.4 4.9c2.7-1.2 5.7-1.9 8.9-1.9c8.2 0 15.4 4.4 19.1 10.9c.9-1.5 1.4-3.2 1.7-4.9C42 28.3 34.5 24.3 26 24.3"/><circle cx="22" cy="32" r="1"/><circle cx="26" cy="38" r="1"/><circle cx="32" cy="38" r="1"/><circle cx="32" cy="42" r="1"/><circle cx="40" cy="38" r="1"/><circle cx="40" cy="42" r="1"/><circle cx="36" cy="40" r="1"/><circle cx="22" cy="36" r="1"/></g></> },
  { code: 'en', label: 'English', short: 'EN', flag: <><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32z"/><path fill="#fff" d="M32 20.4h27.7c-.7-1.6-1.5-3.2-2.4-4.6H32z"/><path fill="#ed4c5c" d="M32 25h29.2c-.4-1.6-.9-3.1-1.5-4.6H32z"/><path fill="#fff" d="M32 29.7h29.9c-.1-1.6-.4-3.1-.7-4.6H32z"/><path fill="#ed4c5c" d="M61.9 29.7H32V32H2c0 .8 0 1.5.1 2.3h59.8c.1-.8.1-1.5.1-2.3s0-1.6-.1-2.3"/><path fill="#fff" d="M2.8 38.9h58.4c.4-1.5.6-3 .7-4.6H2.1c.1 1.5.3 3.1.7 4.6"/><path fill="#ed4c5c" d="M4.3 43.5h55.4c.6-1.5 1.1-3 1.5-4.6H2.8c.4 1.6.9 3.1 1.5 4.6"/><path fill="#fff" d="M6.7 48.1h50.6c.9-1.5 1.7-3 2.4-4.6H4.3c.7 1.6 1.5 3.1 2.4 4.6"/><path fill="#ed4c5c" d="M10.3 52.7h43.4c1.3-1.4 2.6-3 3.6-4.6H6.7c1 1.7 2.3 3.2 3.6 4.6"/><path fill="#fff" d="M15.9 57.3h32.2c2.1-1.3 3.9-2.9 5.6-4.6H10.3c1.7 1.8 3.6 3.3 5.6 4.6"/><path fill="#ed4c5c" d="M32 62c5.9 0 11.4-1.7 16.1-4.7H15.9c4.7 3 10.2 4.7 16.1 4.7"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/><path fill="#fff" d="m25 3l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm20 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H15l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm12 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm2.8-14l1.2-.9l1.2.9l-.5-1.5l1.2-1h-1.5L13 9l-.5 1.5h-1.4l1.2.9zm-8 12l1.2-.9l1.2.9l-.5-1.5l1.2-1H5.5L5 21l-.5 1.5h-1c0 .1-.1.2-.1.3l.8.6z"/></> },
  { code: 'es', label: 'Español', short: 'ES', flag: <><path fill="#c60b1e" d="M6.6 16A30 30 0 0 1 57.4 16ZM6.6 48A30 30 0 0 0 57.4 48Z" /><path fill="#ffc400" d="M6.6 16H57.4A30 30 0 0 1 57.4 48H6.6A30 30 0 0 1 6.6 16Z" /></> },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: <><path fill="#1f1f1f" d="M3.7 22A30 30 0 0 1 60.3 22Z" /><path fill="#dd0000" d="M3.7 22H60.3A30 30 0 0 1 60.3 42H3.7A30 30 0 0 1 3.7 22Z" /><path fill="#ffce00" d="M3.7 42A30 30 0 0 0 60.3 42Z" /></> }
];

const Flag = ({ children }: { children: ReactNode }) => (
  <svg className="e-lang-flag" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/**
 * Seletor de idioma compacto: a bandeira e a sigla do idioma atual com uma seta; ao abrir, a lista dos idiomas. Ocupa o mesmo
 * espaço com qualquer número de idiomas. Clicar fora ou apertar Esc fecha.
 */
export function LangToggle() {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: Event) => {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !details.contains(event.target as Node)) details.open = false;
    };
    // O clique dentro do seletor não chega aqui (stopPropagation, para não fechar o menu do celular); qualquer outro fecha a lista.
    document.addEventListener('click', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', close);
    };
  }, []);
  const current = LANG_OPTIONS.find((option) => option.code === LANG) ?? LANG_OPTIONS[0];
  return (
    <details className="e-lang" ref={ref} onClick={(event) => event.stopPropagation()}>
      <summary aria-label={`${t.langToggleAria}: ${current.label}`} title={current.label}>
        <Flag>{current.flag}</Flag>
        <span className="e-lang-code">{current.short}</span>
        <svg className="e-lang-caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="e-lang-menu">
        {LANG_OPTIONS.map((option) => (
          <li key={option.code}>
            <button type="button" lang={option.code} aria-current={option.code === LANG ? 'true' : undefined} onClick={() => setLang(option.code)}>
              <Flag>{option.flag}</Flag>
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Menu principal: em linha no desktop e, no celular, aberto pelo MenuButton; qualquer clique nele o fecha. */
export function NavLinks({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <nav className={open ? 'e-nav-links e-open' : 'e-nav-links'} aria-label={t.mainNavAria} onClick={onClose}>
      {children}
    </nav>
  );
}

export function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button className="e-menu-btn" type="button" aria-label={t.menuAria} aria-expanded={open} onClick={onToggle}>
      <span />
      <span />
      <span />
    </button>
  );
}
