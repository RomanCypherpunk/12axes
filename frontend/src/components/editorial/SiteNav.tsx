import type { ReactNode } from 'react';
import { LANG, setLang, t } from '../../i18n';
import { PARTIES_ENABLED } from '../../utils/partyLogos';

/** Links dos catálogos e da comparação, na mesma ordem do menu das páginas estáticas. */
export function CatalogLinks({ current, showCompare = true }: { current?: 'compare'; showCompare?: boolean }) {
  const prefix = LANG === 'en' ? '/en' : '';
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

export function LangToggle() {
  return (
    <button className="e-lang" type="button" onClick={() => setLang(LANG === 'pt' ? 'en' : 'pt')} aria-label={t.langToggleAria}>
      {t.langToggleLabel}
    </button>
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
