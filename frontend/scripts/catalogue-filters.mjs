// Módulo compartilhado de filtros avançados para as páginas de catálogo (wiki)
// Permite filtrar por eixos políticos (12 eixos / 24 polos), intensidade,
// tradição religiosa, épocas históricas e categorias adicionais (Issue #253).

import { poleUse } from './pole-icons.mjs';

export const FILTER_STR = {
  pt: {
    filterBtn: 'Filtros',
    filterTitle: 'Filtros avançados',
    filterDesc: 'Filtre por inclinação nos 12 eixos políticos, intensidade e outras características.',
    axesHeading: 'Posição nos 12 eixos políticos',
    axesSubtitle: 'Selecione o polo desejado em cada eixo para encontrar perfis alinhados:',
    intensityLabel: 'Intensidade:',
    intensityAny: 'Qualquer inclinação',
    intensityStrong: 'Posição forte (≥ 60%)',
    religionsHeading: 'Tradição religiosa / espiritual',
    erasHeading: 'Época histórica',
    clearAll: 'Limpar tudo',
    applyBtn: 'Ver resultados',
    activeFiltersLabel: 'Filtros ativos:',
    close: 'Fechar painel',
    foundCount: (n) => `${n} ${n === 1 ? 'perfil encontrado' : 'perfis encontrados'}`,
    allPoles: 'Ambos os polos',
    religions: {
      catholic: 'Católica',
      protestant: 'Protestante',
      orthodox: 'Ortodoxa',
      judaism: 'Judaísmo',
      islam: 'Islã',
      buddhism: 'Budismo',
      hinduism: 'Hinduísmo',
      secular: 'Laico / Sem religião'
    },
    eras: {
      antiguidade: 'Antiguidade',
      medieval: 'Idade Média',
      moderna: 'Idade Moderna',
      xix: 'Século XIX',
      xx: 'Século XX',
      xxi: 'Século XXI'
    }
  },
  en: {
    filterBtn: 'Filters',
    filterTitle: 'Advanced filters',
    filterDesc: 'Filter by leaning across the 12 political axes, intensity and attributes.',
    axesHeading: 'Position across the 12 political axes',
    axesSubtitle: 'Select the desired pole on each axis to find matching profiles:',
    intensityLabel: 'Intensity:',
    intensityAny: 'Any leaning',
    intensityStrong: 'Strong stance (≥ 60%)',
    religionsHeading: 'Religious / spiritual tradition',
    erasHeading: 'Historical era',
    clearAll: 'Clear all',
    applyBtn: 'View results',
    activeFiltersLabel: 'Active filters:',
    close: 'Close panel',
    foundCount: (n) => `${n} ${n === 1 ? 'profile found' : 'profiles found'}`,
    allPoles: 'Both poles',
    religions: {
      catholic: 'Catholic',
      protestant: 'Protestant',
      orthodox: 'Orthodox',
      judaism: 'Judaism',
      islam: 'Islam',
      buddhism: 'Buddhism',
      hinduism: 'Hinduism',
      secular: 'Secular / Non-religious'
    },
    eras: {
      antiguidade: 'Antiquity',
      medieval: 'Middle Ages',
      moderna: 'Early modern era',
      xix: '19th century',
      xx: '20th century',
      xxi: '21st century'
    }
  }
};

// Gera a string compacta de polos para busca instantânea no client-side.
// Formato: "estrutura:l representacao:r:s poder:r ..." onde :s indica posição forte (>= 60 ou <= 40).
export function buildCardPoles(axes, vector) {
  if (!vector) return '';
  const tokens = [];
  for (const axis of axes) {
    const val = vector[axis.id];
    if (typeof val !== 'number') continue;
    const side = val >= 50 ? 'l' : 'r';
    const strong = val >= 60 || val <= 40 ? ':s' : '';
    tokens.push(`${axis.id}:${side}${strong}`);
  }
  return tokens.join(' ');
}

// Renderiza o botão de alternar filtros na barra .tools
export function renderFilterButton(locale) {
  const t = FILTER_STR[locale];
  return `<button type="button" class="btn-filter" id="filter-btn" aria-expanded="false" aria-controls="filter-drawer">
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
    <span>${t.filterBtn}</span>
    <span class="filter-count" id="filter-count" hidden>0</span>
  </button>`;
}

// Renderiza o drawer completo de filtros avançados
export function renderFilterDrawer({ axes, locale, type = 'generic', escapeHtml }) {
  const t = FILTER_STR[locale];

  const axisCards = axes
    .map(
      (axis) => `
    <div class="axis-filter-card" data-axis="${axis.id}">
      <span class="af-axis-title">${escapeHtml(axis.label)}</span>
      <div class="af-pole-group" role="group" aria-label="${escapeHtml(axis.label)}">
        <button type="button" class="af-pole-btn" data-axis="${axis.id}" data-side="l" data-pole-label="${escapeHtml(axis.leftPole)}">
          ${poleUse(axis.id, 'left', ' width="14" height="14"')}
          <span class="af-pole-name">${escapeHtml(axis.leftPole)}</span>
        </button>
        <button type="button" class="af-pole-btn" data-axis="${axis.id}" data-side="r" data-pole-label="${escapeHtml(axis.rightPole)}">
          ${poleUse(axis.id, 'right', ' width="14" height="14"')}
          <span class="af-pole-name">${escapeHtml(axis.rightPole)}</span>
        </button>
      </div>
    </div>`
    )
    .join('');

  // Seção de religião (para países e personalidades)
  let religionSection = '';
  if (type === 'countries' || type === 'personalities') {
    const relKeys = ['catholic', 'protestant', 'orthodox', 'islam', 'judaism', 'buddhism', 'hinduism', 'secular'];
    const relBtns = relKeys
      .map(
        (key) => `
      <button type="button" class="af-rel-btn" data-rel="${key}" data-rel-label="${escapeHtml(t.religions[key])}">
        <span>${escapeHtml(t.religions[key])}</span>
      </button>`
      )
      .join('');

    religionSection = `
    <div class="fd-extra-sec">
      <h4 class="fd-sec-title">${escapeHtml(t.religionsHeading)}</h4>
      <div class="af-rel-grid">${relBtns}</div>
    </div>`;
  }

  // Barra de filtros ativos (fora do drawer, exibida acima da lista)
  const activeFiltersBar = `
  <div class="active-filters-bar" id="active-filters-bar" hidden>
    <span class="af-bar-label">${escapeHtml(t.activeFiltersLabel)}</span>
    <div class="af-pills-wrap" id="af-pills-wrap"></div>
    <button type="button" class="af-clear-all" id="af-clear-all">${escapeHtml(t.clearAll)}</button>
  </div>`;

  const drawerHtml = `
  <div class="filter-drawer" id="filter-drawer" hidden>
    <div class="wrap fd-inner">
      <div class="fd-header">
        <div class="fd-title-wrap">
          <span class="fd-eyebrow"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg> 12 Axes</span>
          <h3>${escapeHtml(t.filterTitle)}</h3>
          <p>${escapeHtml(t.filterDesc)}</p>
        </div>
        <div class="fd-actions">
          <button type="button" class="fd-clear-btn" id="fd-clear-btn">${escapeHtml(t.clearAll)}</button>
          <button type="button" class="fd-close-btn" id="fd-close-btn" aria-label="${escapeHtml(t.close)}">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <div class="fd-body">
        <div class="fd-axes-head">
          <div>
            <h4 class="fd-sec-title">${escapeHtml(t.axesHeading)}</h4>
            <p class="fd-sec-sub">${escapeHtml(t.axesSubtitle)}</p>
          </div>
          <div class="fd-intensity-picker" role="radiogroup" aria-label="${escapeHtml(t.intensityLabel)}">
            <span class="fd-int-label">${escapeHtml(t.intensityLabel)}</span>
            <label class="fd-int-opt">
              <input type="radio" name="fd-intensity" value="any" checked>
              <span>${escapeHtml(t.intensityAny)}</span>
            </label>
            <label class="fd-int-opt">
              <input type="radio" name="fd-intensity" value="strong">
              <span>${escapeHtml(t.intensityStrong)}</span>
            </label>
          </div>
        </div>

        <div class="axis-filter-grid">
          ${axisCards}
        </div>

        ${religionSection}
      </div>

      <div class="fd-footer">
        <span class="fd-count" id="fd-count"></span>
        <button type="button" class="btn fd-done-btn" id="fd-done-btn">${escapeHtml(t.applyBtn)}</button>
      </div>
    </div>
  </div>`;

  return { drawerHtml, activeFiltersBar };
}

// Client-side script para gerenciar filtros avançados em tempo real
export function renderClientFilterScript({ cardSelector = '.ic', hasHistorical = false, locale = 'pt' }) {
  const t = FILTER_STR[locale];
  return `
const S = window.__SCRIPT_STRINGS__;
const F_STR = ${JSON.stringify(t)};
const q = document.getElementById('q');
const chips = [...document.querySelectorAll('.chip')];
const cats = [...document.querySelectorAll('.cat')];
const info = document.getElementById('info');
const empty = document.getElementById('empty');
const histT = ${hasHistorical ? "document.getElementById('historicos-t')" : 'null'};

const filterBtn = document.getElementById('filter-btn');
const filterDrawer = document.getElementById('filter-drawer');
const filterCountBadge = document.getElementById('filter-count');
const fdCloseBtn = document.getElementById('fd-close-btn');
const fdDoneBtn = document.getElementById('fd-done-btn');
const fdClearBtn = document.getElementById('fd-clear-btn');
const fdMatchCount = document.getElementById('fd-match-count');
const activeFiltersBar = document.getElementById('active-filters-bar');
const afPillsWrap = document.getElementById('af-pills-wrap');
const afClearAll = document.getElementById('af-clear-all');

const poleBtns = [...document.querySelectorAll('.af-pole-btn')];
const relBtns = [...document.querySelectorAll('.af-rel-btn')];
const intensityRadios = [...document.querySelectorAll('input[name="fd-intensity"]')];

const norm = s => s ? s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase() : '';

const cards = [...document.querySelectorAll('${cardSelector}')].map(li => ({
  li,
  t: norm(li.dataset.text || ''),
  h: li.querySelector('h3'),
  name: li.querySelector('h3') ? li.querySelector('h3').textContent : '',
  cat: li.dataset.cat || (li.closest('.cat') ? li.closest('.cat').dataset.cat : ''),
  poles: li.dataset.poles ? li.dataset.poles.split(' ') : [],
  religions: li.dataset.religions ? li.dataset.religions.split(' ').filter(Boolean) : []
}));

let activeCat = null;
let activePoles = {};
let activeReligions = new Set();
let intensity = 'any';

function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function toggleDrawer(open) {
  if (!filterDrawer) return;
  const isOpen = open !== undefined ? open : filterDrawer.hidden;
  filterDrawer.hidden = !isOpen;
  if (filterBtn) filterBtn.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    filterDrawer.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }
}

if (filterBtn) filterBtn.addEventListener('click', () => toggleDrawer());
if (fdCloseBtn) fdCloseBtn.addEventListener('click', () => toggleDrawer(false));
if (fdDoneBtn) fdDoneBtn.addEventListener('click', () => toggleDrawer(false));

poleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const axis = btn.dataset.axis;
    const side = btn.dataset.side;
    if (activePoles[axis] === side) {
      delete activePoles[axis];
      btn.classList.remove('active');
    } else {
      activePoles[axis] = side;
      btn.closest('.af-pole-group').querySelectorAll('.af-pole-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    applyFilters();
  });
});

relBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const rel = btn.dataset.rel;
    if (activeReligions.has(rel)) {
      activeReligions.delete(rel);
      btn.classList.remove('active');
    } else {
      activeReligions.add(rel);
      btn.classList.add('active');
    }
    applyFilters();
  });
});

intensityRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      intensity = radio.value;
      applyFilters();
    }
  });
});

chips.forEach(ch => ch.addEventListener('click', () => {
  activeCat = activeCat === ch.dataset.cat ? null : ch.dataset.cat;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === activeCat)));
  applyFilters();
  if (activeCat) {
    const target = document.getElementById(activeCat);
    if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}));

if (q) q.addEventListener('input', applyFilters);

function clearAllFilters() {
  if (q) q.value = '';
  activeCat = null;
  activePoles = {};
  activeReligions.clear();
  intensity = 'any';
  intensityRadios.forEach(r => r.checked = (r.value === 'any'));
  chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
  poleBtns.forEach(b => b.classList.remove('active'));
  relBtns.forEach(b => b.classList.remove('active'));
  applyFilters();
}

if (fdClearBtn) fdClearBtn.addEventListener('click', clearAllFilters);
if (afClearAll) afClearAll.addEventListener('click', clearAllFilters);

function applyFilters() {
  const term = q ? norm(q.value.trim()) : '';
  const poleKeys = Object.entries(activePoles);
  let shown = 0;

  cards.forEach(c => {
    const matchTerm = !term || c.t.includes(term);
    const matchCat = !activeCat || c.cat === activeCat;

    let matchPoles = true;
    for (const [axis, side] of poleKeys) {
      const token = intensity === 'strong' ? (axis + ':' + side + ':s') : (axis + ':' + side);
      const hasPole = c.poles.some(p => intensity === 'strong' ? p === token : p.startsWith(axis + ':' + side));
      if (!hasPole) {
        matchPoles = false;
        break;
      }
    }

    let matchRel = true;
    if (activeReligions.size > 0) {
      const hasSecular = activeReligions.has('secular');
      const isSecular = c.religions.length === 0;
      const matchesRel = c.religions.some(r => activeReligions.has(r));
      matchRel = (hasSecular && isSecular) || matchesRel;
    }

    const ok = matchTerm && matchCat && matchPoles && matchRel;
    c.li.hidden = !ok;
    if (ok) shown++;

    if (c.h) {
      const i = term && ok ? norm(c.name).indexOf(term) : -1;
      if (i >= 0) {
        c.h.innerHTML = esc(c.name.slice(0, i)) + '<mark>' + esc(c.name.slice(i, i + term.length)) + '</mark>' + esc(c.name.slice(i + term.length));
      } else {
        c.h.textContent = c.name;
      }
    }
  });

  let histShown = 0;
  cats.forEach(s => {
    const n = s.querySelectorAll('${cardSelector}:not([hidden])').length;
    s.hidden = n === 0;
    const cc = s.querySelector('.cat-count');
    if (cc) {
      const bEl = cc.querySelector('.cc');
      if (bEl) bEl.textContent = n;
      const clEl = cc.querySelector('.cl');
      if (clEl && cc.dataset.one && cc.dataset.many) {
        clEl.textContent = n === 1 ? cc.dataset.one : cc.dataset.many;
      }
    }
    if (s.dataset.cat !== 'atuais') histShown += n;
  });

  if (histT) histT.hidden = (histShown === 0);
  if (empty) empty.classList.toggle('show', shown === 0);

  // Contagem no drawer
  if (fdMatchCount) {
    fdMatchCount.innerHTML = '<b>' + shown + '</b> ' + (shown === 1 ? S.found[0] : S.found[1]);
  }

  // Badge do botão de filtros
  const filterCount = poleKeys.length + activeReligions.size + (activeCat ? 1 : 0);
  if (filterCountBadge) {
    if (filterCount > 0) {
      filterCountBadge.hidden = false;
      filterCountBadge.textContent = filterCount;
    } else {
      filterCountBadge.hidden = true;
    }
  }

  // Active filters pills bar
  if (activeFiltersBar && afPillsWrap) {
    if (filterCount > 0) {
      activeFiltersBar.hidden = false;
      let pillsHtml = '';
      if (activeCat) {
        const ch = chips.find(c => c.dataset.cat === activeCat);
        const label = ch ? ch.textContent.replace(/[0-9]/g, '').trim() : activeCat;
        pillsHtml += '<span class="af-pill"><span>' + esc(label) + '</span><button type="button" class="af-pill-remove" data-rm-cat="1" aria-label="Remover filtro">×</button></span>';
      }
      for (const [axis, side] of poleKeys) {
        const btn = poleBtns.find(b => b.dataset.axis === axis && b.dataset.side === side);
        const label = btn ? btn.dataset.poleLabel : (axis + ' (' + side + ')');
        pillsHtml += '<span class="af-pill"><span>' + esc(label) + '</span><button type="button" class="af-pill-remove" data-rm-axis="' + axis + '" aria-label="Remover filtro">×</button></span>';
      }
      for (const rel of activeReligions) {
        const btn = relBtns.find(b => b.dataset.rel === rel);
        const label = btn ? btn.dataset.relLabel : rel;
        pillsHtml += '<span class="af-pill"><span>' + esc(label) + '</span><button type="button" class="af-pill-remove" data-rm-rel="' + rel + '" aria-label="Remover filtro">×</button></span>';
      }
      afPillsWrap.innerHTML = pillsHtml;

      // Event listeners para remover pills
      afPillsWrap.querySelectorAll('[data-rm-cat]').forEach(b => {
        b.onclick = () => {
          activeCat = null;
          chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
          applyFilters();
        };
      });
      afPillsWrap.querySelectorAll('[data-rm-axis]').forEach(b => {
        b.onclick = () => {
          const ax = b.dataset.rmAxis;
          delete activePoles[ax];
          poleBtns.filter(p => p.dataset.axis === ax).forEach(p => p.classList.remove('active'));
          applyFilters();
        };
      });
      afPillsWrap.querySelectorAll('[data-rm-rel]').forEach(b => {
        b.onclick = () => {
          const r = b.dataset.rmRel;
          activeReligions.delete(r);
          relBtns.filter(rb => rb.dataset.rel === r).forEach(rb => rb.classList.remove('active'));
          applyFilters();
        };
      });
    } else {
      activeFiltersBar.hidden = true;
      afPillsWrap.innerHTML = '';
    }
  }

  // Texto info superior
  if (info) {
    const isFiltered = term || filterCount > 0;
    info.innerHTML = isFiltered ? '<b>' + shown + '</b> ' + S.found[shown === 1 ? 0 : 1] + '<button type="button" id="clear">' + esc(S.clear) + '</button>' : '';
    const cl = document.getElementById('clear');
    if (cl) cl.onclick = clearAllFilters;
  }
}

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== q && q) {
    e.preventDefault();
    q.focus();
  } else if (e.key === 'Escape' && filterDrawer && !filterDrawer.hidden) {
    toggleDrawer(false);
  }
});

// Leitura inicial de URL query params
(function initFromUrl() {
  const sp = new URLSearchParams(window.location.search);
  let changed = false;
  if (sp.has('q') && q) { q.value = sp.get('q'); changed = true; }
  if (sp.has('cat')) {
    activeCat = sp.get('cat');
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === activeCat)));
    changed = true;
  }
  if (sp.has('poles')) {
    sp.get('poles').split(',').forEach(pair => {
      const [ax, s] = pair.split(':');
      if (ax && (s === 'l' || s === 'r')) {
        activePoles[ax] = s;
        const b = poleBtns.find(btn => btn.dataset.axis === ax && btn.dataset.side === s);
        if (b) b.classList.add('active');
        changed = true;
      }
    });
  }
  if (sp.get('int') === 'strong') {
    intensity = 'strong';
    intensityRadios.forEach(r => r.checked = (r.value === 'strong'));
    changed = true;
  }
  if (sp.has('rel')) {
    sp.get('rel').split(',').forEach(r => {
      activeReligions.add(r);
      const b = relBtns.find(btn => btn.dataset.rel === r);
      if (b) b.classList.add('active');
      changed = true;
    });
  }
  applyFilters();
})();
`;
}

// CSS compartilhado de filtros para ser embutido em IDEOLOGIES_CSS e filhos
export const FILTERS_CSS = `
/* ─── Botão de Filtros na barra .tools ───────────────────────────────────────── */
.btn-filter{display:inline-flex;align-items:center;gap:7px;font:600 13.5px var(--body);padding:8px 16px;border-radius:999px;border:1.5px solid var(--borda);background:var(--sup);color:var(--tinta);cursor:pointer;transition:all .15s ease;white-space:nowrap;flex:none}
.btn-filter svg{width:15px;height:15px;color:var(--suave);transition:color .15s}
.btn-filter:hover{border-color:var(--floresta);color:var(--floresta)}
.btn-filter:hover svg{color:var(--floresta)}
.btn-filter[aria-expanded=true]{background:var(--floresta);color:var(--papel);border-color:var(--floresta)}
.btn-filter[aria-expanded=true] svg{color:var(--papel)}
.filter-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--carmim);color:#fff;font-size:11px;font-weight:700;line-height:1}
.btn-filter[aria-expanded=true] .filter-count{background:var(--papel);color:var(--floresta)}

/* ─── Gaveta de Filtros Avançados ───────────────────────────────────────────── */
.filter-drawer{background:var(--sup);border-bottom:2px solid var(--borda);box-shadow:0 18px 36px rgba(16,16,16,.08);position:relative;z-index:19;animation:fdSlide .2s cubic-bezier(0.16,1,0.3,1)}
@keyframes fdSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.filter-drawer[hidden]{display:none!important}
.fd-inner{padding:24px 24px 28px}
.fd-header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:18px;border-bottom:1px solid var(--borda);margin-bottom:22px}
.fd-eyebrow{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--floresta);margin-bottom:4px}
.fd-eyebrow svg{color:var(--floresta)}
.fd-title-wrap h3{font-family:var(--display);font-weight:600;font-size:22px;letter-spacing:-.02em;line-height:1.2;color:var(--tinta)}
.fd-title-wrap p{font-size:13.5px;color:var(--suave);margin-top:4px}
.fd-actions{display:flex;align-items:center;gap:12px;flex:none}
.fd-clear-btn{font:inherit;font-size:13px;font-weight:500;color:var(--carmim);text-decoration:underline;background:none;border:none;cursor:pointer;padding:6px 8px;border-radius:6px}
.fd-clear-btn:hover{background:rgba(136,9,18,.06)}
.fd-close-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--borda);background:var(--papel);color:var(--tinta);display:grid;place-items:center;cursor:pointer;transition:all .15s}
.fd-close-btn:hover{background:var(--tinta);color:var(--papel)}

/* ─── Eixos no Drawer ────────────────────────────────────────────────────────── */
.fd-axes-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.fd-sec-title{font-family:var(--display);font-weight:600;font-size:15px;letter-spacing:-.01em;color:var(--tinta)}
.fd-sec-sub{font-size:13px;color:var(--suave);margin-top:2px}
.fd-intensity-picker{display:inline-flex;align-items:center;gap:10px;background:var(--papel);border:1px solid var(--borda);border-radius:999px;padding:4px 12px;font-size:12.5px}
.fd-int-label{font-weight:600;color:var(--suave)}
.fd-int-opt{display:inline-flex;align-items:center;gap:5px;cursor:pointer;color:var(--tinta)}
.fd-int-opt input{accent-color:var(--floresta);cursor:pointer}

.axis-filter-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.axis-filter-card{background:var(--papel);border:1px solid var(--borda);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;transition:border-color .15s}
.axis-filter-card:hover{border-color:color-mix(in srgb,var(--floresta) 40%,var(--borda))}
.af-axis-title{font-family:var(--display);font-weight:600;font-size:12.5px;letter-spacing:-.01em;color:var(--suave);text-transform:uppercase}
.af-pole-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.af-pole-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:7px 8px;border-radius:8px;border:1px solid var(--borda);background:var(--sup);color:var(--suave);font:500 12px var(--body);cursor:pointer;transition:all .14s ease;min-width:0}
.af-pole-btn svg{flex:none;color:currentColor;fill:currentColor;stroke:none}
.af-pole-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.af-pole-btn:hover{background:#fff;color:var(--tinta);border-color:var(--floresta)}
.af-pole-btn.active{background:var(--floresta);color:var(--papel);border-color:var(--floresta);font-weight:600;box-shadow:0 2px 6px rgba(16,46,36,.22)}

/* ─── Seção Extra (Religiões / Épocas) ───────────────────────────────────────── */
.fd-extra-sec{padding-top:20px;border-top:1px solid var(--borda);margin-top:16px;margin-bottom:20px}
.af-rel-grid{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.af-rel-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;border:1px solid var(--borda);background:var(--papel);color:var(--suave);font:500 12.5px var(--body);cursor:pointer;transition:all .14s ease}
.af-rel-btn:hover{border-color:var(--floresta);color:var(--tinta)}
.af-rel-btn.active{background:var(--floresta);color:var(--papel);border-color:var(--floresta);font-weight:600}

/* ─── Rodapé do Drawer ───────────────────────────────────────────────────────── */
.fd-footer{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-top:18px;border-top:1px solid var(--borda)}
.fd-count{font-size:14px;font-weight:600;color:var(--suave)}
.fd-count b{color:var(--tinta);font-family:var(--display)}
.fd-done-btn{padding:10px 24px;font-size:14px}

/* ─── Barra de Filtros Ativos (Acima da Lista) ────────────────────────────────── */
.active-filters-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:16px 0 6px}
.active-filters-bar[hidden]{display:none!important}
.af-bar-label{font-size:13px;font-weight:600;color:var(--suave);flex:none}
.af-pills-wrap{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.af-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 12px;border-radius:999px;background:var(--cb,#DCE6E0);color:var(--c,var(--floresta));font-size:12.5px;font-weight:600;border:1px solid color-mix(in srgb,var(--c,var(--floresta)) 30%,transparent)}
.af-pill-remove{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,.08);color:inherit;border:none;cursor:pointer;transition:background .15s}
.af-pill-remove:hover{background:rgba(0,0,0,.2)}
.af-pill-remove svg{width:11px;height:11px}
.af-clear-all{font:inherit;font-size:12.5px;color:var(--carmim);text-decoration:underline;background:none;border:none;cursor:pointer;padding:4px 6px;margin-left:4px}

@media (max-width:980px){
  .axis-filter-grid{grid-template-columns:repeat(2,1fr)}
  .fd-axes-head{flex-direction:column;align-items:flex-start}
}
@media (max-width:640px){
  .axis-filter-grid{grid-template-columns:1fr}
  .fd-inner{padding:18px 16px 22px}
  .fd-header{flex-direction:column;align-items:flex-start;gap:12px}
  .fd-actions{align-self:flex-end}
  .af-pole-group{grid-template-columns:1fr 1fr}
  .af-pole-btn{padding:8px}
}
`;

