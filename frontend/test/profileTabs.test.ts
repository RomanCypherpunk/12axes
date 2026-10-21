import { describe, expect, it } from 'vitest';
import { PAGE_SCRIPT } from '../scripts/personality-page.mjs';

function createMockDom() {
  const elements: Record<string, any> = {};
  const listeners: Record<string, Function[]> = {};

  const makeElement = (tag: string, attrs: Record<string, any> = {}) => {
    const el: any = {
      tagName: tag.toUpperCase(),
      attributes: { ...attrs },
      style: {
        setProperty: (k: string, v: string) => {
          el.style[k] = v;
        }
      },
      hidden: attrs.hidden ?? false,
      tabIndex: attrs.tabIndex ?? 0,
      offsetHeight: 72,
      getBoundingClientRect: () => ({ top: 100 }),
      dataset: {},
      listeners: {} as Record<string, Function[]>,
      getAttribute: (k: string) => el.attributes[k] ?? null,
      setAttribute: (k: string, v: any) => {
        el.attributes[k] = String(v);
      },
      addEventListener: (evt: string, fn: Function) => {
        el.listeners[evt] = el.listeners[evt] || [];
        el.listeners[evt].push(fn);
      },
      click: () => {
        (el.listeners['click'] || []).forEach((fn: Function) => fn({ preventDefault: () => {} }));
      },
      querySelector: () => null,
      querySelectorAll: () => []
    };
    return el;
  };

  const nav = makeElement('header', { class: 'sh' });
  const tabWrap = makeElement('div', { class: 'ptabs-wrap' });

  const tabAxes = makeElement('button', { role: 'tab', 'aria-controls': 'eixos', 'aria-selected': 'true' });
  const tabPers = makeElement('button', { role: 'tab', 'aria-controls': 'personalidades', 'aria-selected': 'false' });
  const tabPaises = makeElement('button', { role: 'tab', 'aria-controls': 'paises', 'aria-selected': 'false' });

  const panelAxes = makeElement('section', { id: 'eixos', hidden: false });
  const panelPers = makeElement('section', { id: 'personalidades', hidden: true });
  const panelPaises = makeElement('section', { id: 'paises', hidden: true });

  const ctabAtual = makeElement('button', { role: 'tab', 'aria-controls': 'c-atual', 'aria-selected': 'true' });
  const ctabHist = makeElement('button', { role: 'tab', 'aria-controls': 'c-hist', 'aria-selected': 'false' });
  const ctabGroup = makeElement('div', { class: 'ctabs' });
  ctabGroup.querySelectorAll = (sel: string) => (sel === 'button' ? [ctabAtual, ctabHist] : []);

  const panelCAtual = makeElement('div', { id: 'c-atual', hidden: false });
  const panelCHist = makeElement('div', { id: 'c-hist', hidden: true });

  elements['eixos'] = panelAxes;
  elements['personalidades'] = panelPers;
  elements['paises'] = panelPaises;
  elements['c-atual'] = panelCAtual;
  elements['c-hist'] = panelCHist;

  const doc: any = {
    documentElement: { style: { setProperty: () => {} } },
    body: { style: { overflow: '' } },
    querySelector: (sel: string) => {
      if (sel === '.sh') return nav;
      if (sel === '.nav') return null;
      if (sel === '.ptabs-wrap') return tabWrap;
      return null;
    },
    querySelectorAll: (sel: string) => {
      if (sel === '.ptabs [role=tab]') return [tabAxes, tabPers, tabPaises];
      if (sel === '.ctabs') return [ctabGroup];
      if (sel === 'img[data-i]') return [];
      if (sel === '.axis-info') return [];
      return [];
    },
    getElementById: (id: string) => elements[id] || null,
    addEventListener: (evt: string, fn: Function) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    }
  };

  const win: any = {
    scrollTo: () => {},
    addEventListener: (evt: string, fn: Function) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    }
  };

  const hist = {
    replaceState: () => {}
  };

  return {
    doc,
    win,
    hist,
    tabAxes,
    tabPers,
    tabPaises,
    panelAxes,
    panelPers,
    panelPaises,
    ctabAtual,
    ctabHist,
    panelCAtual,
    panelCHist
  };
}

describe('PAGE_SCRIPT tab interactions on profile pages', () => {
  it('does not crash when header is .sh instead of .nav and correctly handles tab clicks', () => {
    const mock = createMockDom();

    // Execute PAGE_SCRIPT in mock sandbox
    const fn = new Function('document', 'window', 'history', 'location', 'addEventListener', PAGE_SCRIPT);
    expect(() => {
      fn(mock.doc, mock.win, mock.hist, { hash: '' }, mock.win.addEventListener);
    }).not.toThrow();

    // Initial state
    expect(mock.panelAxes.hidden).toBe(false);
    expect(mock.panelPers.hidden).toBe(true);
    expect(mock.panelPaises.hidden).toBe(true);

    // Click Personalidades tab
    mock.tabPers.click();
    expect(mock.tabAxes.getAttribute('aria-selected')).toBe('false');
    expect(mock.tabPers.getAttribute('aria-selected')).toBe('true');
    expect(mock.panelAxes.hidden).toBe(true);
    expect(mock.panelPers.hidden).toBe(false);

    // Click Países tab
    mock.tabPaises.click();
    expect(mock.tabPers.getAttribute('aria-selected')).toBe('false');
    expect(mock.tabPaises.getAttribute('aria-selected')).toBe('true');
    expect(mock.panelPers.hidden).toBe(true);
    expect(mock.panelPaises.hidden).toBe(false);
  });

  it('correctly handles country sub-tabs (historical vs modern)', () => {
    const mock = createMockDom();
    const fn = new Function('document', 'window', 'history', 'location', 'addEventListener', PAGE_SCRIPT);
    fn(mock.doc, mock.win, mock.hist, { hash: '' }, mock.win.addEventListener);

    expect(mock.panelCAtual.hidden).toBe(false);
    expect(mock.panelCHist.hidden).toBe(true);

    // Click historical regimes tab
    mock.ctabHist.click();
    expect(mock.panelCAtual.hidden).toBe(true);
    expect(mock.panelCHist.hidden).toBe(false);

    // Click modern countries tab
    mock.ctabAtual.click();
    expect(mock.panelCAtual.hidden).toBe(false);
    expect(mock.panelCHist.hidden).toBe(true);
  });
});

