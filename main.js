import * as THREE from 'three';

// ─── State ─────────────────────────────────────────────────────────────
let DATA = [];
let META = {};
let MIN_WAGE = null;
let HISTORY = null; // lazy
let filters = { search: '', pais: '', rubro: '', seniority: '', modalidad: '' };
let pagination = { page: 1, pageSize: 20 };
let sortState = { key: null, dir: 'asc' };

// ─── Bootstrap ─────────────────────────────────────────────────────────
async function load() {
  const [data, meta, minWage] = await Promise.all([
    fetch('./data/salaries.json').then(r => r.json()),
    fetch('./data/meta.json').then(r => r.json()),
    fetch('./data/min_wage.json').then(r => r.json()).catch(() => null),
  ]);
  DATA = data;
  META = meta;
  MIN_WAGE = minWage;
  renderStats();
  populateSelects();
  bindFilters();
  bindSort();
  render();
  renderTopRubros();
  renderMinWage();
  renderSources();
  bindModals();
  bindTabs();
  document.getElementById('last-updated').textContent = META.last_updated || '—';
  const lu2 = document.getElementById('last-updated-2');
  if (lu2) lu2.textContent = META.last_updated || '—';
  const stamp = document.getElementById('last-update-stamp');
  if (stamp) {
    const dateStr = META.last_updated || '—';
    const timeStr = META.last_updated_time || '';
    stamp.textContent = `Última actualización · ${dateStr}${timeStr ? ' ' + timeStr : ''}`;
  }
}

function renderSources() {
  const grid = document.getElementById('sources-grid');
  if (!grid || !META.sources) return;
  grid.innerHTML = META.sources.map(s => {
    const link = s.url
      ? `<a href="${s.url}" target="_blank" rel="noopener" class="text-accent hover:underline">${escape(s.name)} ↗</a>`
      : `<span>${escape(s.name)}</span>`;
    return `
      <div class="card rounded-2xl p-5">
        <div class="flex items-baseline justify-between gap-3 mb-2">
          <h4 class="font-semibold leading-tight">${link}</h4>
          ${s.license ? `<span class="pill text-xs px-2 py-0.5 rounded-full whitespace-nowrap">${escape(s.license)}</span>` : ''}
        </div>
        ${s.scope ? `<p class="text-sm text-slate-300">${escape(s.scope)}</p>` : ''}
        ${s.fetched ? `<p class="text-xs text-muted mt-2">Última verificación: ${escape(s.fetched)}</p>` : ''}
      </div>
    `;
  }).join('');
}

function renderStats() {
  document.getElementById('stat-records').textContent = META.records?.toLocaleString('es-AR') || DATA.length;
  document.getElementById('stat-rubros').textContent = META.rubros || new Set(DATA.map(d => d.rubro)).size;
  document.getElementById('stat-paises').textContent = META.paises || new Set(DATA.map(d => d.pais)).size;
}

function populateSelects() {
  const paises = [...new Set(DATA.map(d => d.pais))].sort();
  const rubros = [...new Set(DATA.map(d => d.rubro))].sort();
  const fp = document.getElementById('f-pais');
  paises.forEach(p => fp.appendChild(new Option(p, p)));
  const fr = document.getElementById('f-rubro');
  rubros.forEach(r => fr.appendChild(new Option(r, r)));
}

function bindFilters() {
  document.getElementById('f-search').addEventListener('input', e => { filters.search = e.target.value.toLowerCase(); pagination.page = 1; render(); });
  document.getElementById('f-pais').addEventListener('change', e => { filters.pais = e.target.value; pagination.page = 1; render(); });
  document.getElementById('f-rubro').addEventListener('change', e => { filters.rubro = e.target.value; pagination.page = 1; render(); });
  document.getElementById('f-seniority').addEventListener('change', e => { filters.seniority = e.target.value; pagination.page = 1; render(); });
  document.querySelectorAll('.modalidad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.modalidad = btn.dataset.modalidad;
      document.querySelectorAll('.modalidad-btn').forEach(b => b.classList.remove('bg-accent', 'text-slate-900'));
      btn.classList.add('bg-accent', 'text-slate-900');
      pagination.page = 1;
      render();
    });
  });
}

function applyFilters(rows) {
  const filtered = rows.filter(r => {
    if (filters.pais && r.pais !== filters.pais) return false;
    if (filters.rubro && r.rubro !== filters.rubro) return false;
    if (filters.seniority && r.seniority !== filters.seniority) return false;
    if (filters.modalidad && r.modalidad !== filters.modalidad) return false;
    if (filters.search) {
      const hay = (r.rol + ' ' + (r.tags || []).join(' ')).toLowerCase();
      if (!hay.includes(filters.search)) return false;
    }
    return true;
  });
  return applySort(filtered);
}

function applySort(rows) {
  if (!sortState.key) return rows;
  const k = sortState.key;
  const dir = sortState.dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    let av = a[k], bv = b[k];
    // strings vs numbers
    if (typeof av === 'string' || typeof bv === 'string') {
      av = (av ?? '').toString().toLowerCase();
      bv = (bv ?? '').toString().toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    }
    av = av ?? -Infinity;
    bv = bv ?? -Infinity;
    return (av - bv) * dir;
  });
}

function bindSort() {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (sortState.key === k) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = k;
        // numeric columns default desc, string columns default asc
        sortState.dir = ['median_usd', 'p25_usd', 'p75_usd', 'n'].includes(k) ? 'desc' : 'asc';
      }
      // update visual indicators
      document.querySelectorAll('th.sortable').forEach(t => t.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(sortState.dir === 'asc' ? 'sort-asc' : 'sort-desc');
      pagination.page = 1;
      render();
    });
  });
}

function render() {
  const rows = applyFilters(DATA);
  const tbody = document.getElementById('results-tbody');
  const empty = document.getElementById('empty-state');
  tbody.innerHTML = '';
  if (rows.length === 0) {
    empty.classList.remove('hidden');
    document.getElementById('results-summary').textContent = '';
    renderPagination(0);
    return;
  }
  empty.classList.add('hidden');
  document.getElementById('results-summary').textContent = `${rows.length} resultados — mediana global $${median(rows.map(r => r.median_usd)).toLocaleString('es-AR')} USD`;
  // pagination
  const totalPages = Math.max(1, Math.ceil(rows.length / pagination.pageSize));
  if (pagination.page > totalPages) pagination.page = totalPages;
  const start = (pagination.page - 1) * pagination.pageSize;
  const pageRows = rows.slice(start, start + pagination.pageSize);
  pageRows.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'row border-t border-white/5 cursor-pointer';
    tr.dataset.rol = r.rol;
    tr.dataset.pais = r.pais;
    tr.dataset.seniority = r.seniority || '';
    tr.dataset.modalidad = r.modalidad || '';
    tr.innerHTML = `
      <td class="py-2.5 px-4 font-medium">${escape(r.rol)}</td>
      <td class="py-2.5 px-4 text-muted">${escape(r.rubro)}</td>
      <td class="py-2.5 px-4">${escape(r.seniority || '—')}</td>
      <td class="py-2.5 px-4">${escape(r.pais)}</td>
      <td class="py-2.5 px-4 text-muted">${escape(r.modalidad || '—')}</td>
      <td class="py-2.5 px-4 text-right font-semibold text-accent">$${(r.median_usd ?? 0).toLocaleString('es-AR')}</td>
      <td class="py-2.5 px-4 text-right text-muted">$${(r.p25_usd ?? 0).toLocaleString('es-AR')} — $${(r.p75_usd ?? 0).toLocaleString('es-AR')}</td>
      <td class="py-2.5 px-4 text-right text-muted">${r.n ?? '—'}</td>`;
    tr.addEventListener('click', () => openHistoryModal(r));
    tbody.appendChild(tr);
  });
  renderPagination(rows.length);
}

function renderPagination(total) {
  let pgEl = document.getElementById('results-pagination');
  if (!pgEl) {
    pgEl = document.createElement('div');
    pgEl.id = 'results-pagination';
    pgEl.className = 'pagination';
    // append inside the table card (not the search/filters card)
    const tableCard = document.getElementById('table-card');
    if (tableCard) tableCard.appendChild(pgEl);
  }
  if (total === 0) { pgEl.innerHTML = ''; return; }
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const start = (pagination.page - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.page * pagination.pageSize, total);
  pgEl.innerHTML = `
    <span class="pg-info">Mostrando ${start}-${end} de ${total}</span>
    <div class="pg-controls">
      <label class="pg-info">Por página
        <select id="pg-size">
          <option value="10" ${pagination.pageSize===10?'selected':''}>10</option>
          <option value="20" ${pagination.pageSize===20?'selected':''}>20</option>
          <option value="50" ${pagination.pageSize===50?'selected':''}>50</option>
          <option value="100" ${pagination.pageSize===100?'selected':''}>100</option>
          <option value="9999" ${pagination.pageSize===9999?'selected':''}>Todas</option>
        </select>
      </label>
      <button id="pg-first" ${pagination.page<=1?'disabled':''}>«</button>
      <button id="pg-prev" ${pagination.page<=1?'disabled':''}>‹</button>
      <span class="pg-info">Página ${pagination.page} / ${totalPages}</span>
      <button id="pg-next" ${pagination.page>=totalPages?'disabled':''}>›</button>
      <button id="pg-last" ${pagination.page>=totalPages?'disabled':''}>»</button>
    </div>`;
  document.getElementById('pg-size').addEventListener('change', e => {
    pagination.pageSize = +e.target.value;
    pagination.page = 1;
    render();
  });
  document.getElementById('pg-first').addEventListener('click', () => { pagination.page = 1; render(); });
  document.getElementById('pg-prev').addEventListener('click', () => { if (pagination.page > 1) { pagination.page--; render(); } });
  document.getElementById('pg-next').addEventListener('click', () => { if (pagination.page < totalPages) { pagination.page++; render(); } });
  document.getElementById('pg-last').addEventListener('click', () => { pagination.page = totalPages; render(); });
}

// ─── History modal ────────────────────────────────────────────────────
async function loadHistory() {
  if (HISTORY) return HISTORY;
  HISTORY = await fetch('./data/history.json').then(r => r.json());
  return HISTORY;
}

async function openHistoryModal(rec) {
  const modal = document.getElementById('history-modal');
  const title = document.getElementById('history-title');
  const meta = document.getElementById('history-meta');
  const chart = document.getElementById('history-chart');
  const tableEl = document.getElementById('history-table');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  title.textContent = rec.rol;
  meta.textContent = `${rec.pais} · ${rec.seniority || '—'} · ${rec.modalidad || '—'} · rubro ${rec.rubro}`;
  chart.innerHTML = '<div class="text-muted text-sm py-12 text-center">Cargando histórico…</div>';
  tableEl.innerHTML = '';
  try {
    const h = await loadHistory();
    const series = h.series.find(s =>
      s.rol === rec.rol && s.pais === rec.pais && s.seniority === rec.seniority && s.modalidad === rec.modalidad
    );
    if (!series) {
      chart.innerHTML = '<div class="text-muted text-sm py-12 text-center">Sin serie histórica disponible para esta combinación.</div>';
      return;
    }
    chart.innerHTML = renderLineChart(series.history);
    tableEl.innerHTML = renderHistoryTable(series.history);
  } catch (e) {
    chart.innerHTML = `<div class="text-bad text-sm py-12 text-center">Error cargando histórico: ${escape(e.message)}</div>`;
  }
}

function renderLineChart(history) {
  // Inline SVG line chart, no deps
  const W = 720, H = 300, PAD_L = 56, PAD_R = 20, PAD_T = 24, PAD_B = 40;
  const xs = history.map(d => d.year);
  const yMedian = history.map(d => d.median_usd);
  const yP25 = history.map(d => d.p25_usd);
  const yP75 = history.map(d => d.p75_usd);
  const yMin = Math.min(...yP25);
  const yMax = Math.max(...yP75);
  const yPad = (yMax - yMin) * 0.08;
  const y0 = Math.max(0, yMin - yPad);
  const y1 = yMax + yPad;
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const xScale = year => PAD_L + (W - PAD_L - PAD_R) * (year - xMin) / Math.max(1, (xMax - xMin));
  const yScale = v => PAD_T + (H - PAD_T - PAD_B) * (1 - (v - y0) / Math.max(1, (y1 - y0)));

  // band p25–p75
  const bandTop = history.map(d => `${xScale(d.year)},${yScale(d.p75_usd)}`).join(' ');
  const bandBottomRev = [...history].reverse().map(d => `${xScale(d.year)},${yScale(d.p25_usd)}`).join(' ');
  const bandPath = `<polygon points="${bandTop} ${bandBottomRev}" fill="rgba(34,211,238,0.12)" stroke="none"/>`;

  // median line
  const medianPath = history.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year)} ${yScale(d.median_usd)}`).join(' ');
  const linePath = `<path d="${medianPath}" fill="none" stroke="#22d3ee" stroke-width="2.5"/>`;

  // points + labels
  const points = history.map(d => `
    <circle cx="${xScale(d.year)}" cy="${yScale(d.median_usd)}" r="4" fill="#22d3ee"/>
    <text x="${xScale(d.year)}" y="${yScale(d.median_usd) - 10}" fill="#e2e8f0" font-size="11" text-anchor="middle">$${d.median_usd.toLocaleString('es-AR')}</text>
  `).join('');

  // axes
  const xAxis = xs.map(yr => `<text x="${xScale(yr)}" y="${H - 14}" fill="#94a3b8" font-size="11" text-anchor="middle">${yr}</text>`).join('');
  // y-axis ticks (3 ticks)
  const yTicks = [y0, (y0 + y1) / 2, y1].map(v => {
    const y = yScale(v);
    return `<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}" stroke="rgba(255,255,255,0.06)"/>
            <text x="${PAD_L - 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end">$${Math.round(v).toLocaleString('es-AR')}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="w-full">
    ${yTicks}
    ${bandPath}
    ${linePath}
    ${points}
    ${xAxis}
    <text x="${PAD_L}" y="${PAD_T - 8}" fill="#94a3b8" font-size="10">Mediana USD · banda P25–P75</text>
  </svg>`;
}

function renderHistoryTable(history) {
  return `<table class="w-full text-sm">
    <thead class="text-xs uppercase text-muted">
      <tr>
        <th class="text-left py-1.5 px-2">Año</th>
        <th class="text-right py-1.5 px-2">Mediana</th>
        <th class="text-right py-1.5 px-2">P25</th>
        <th class="text-right py-1.5 px-2">P75</th>
        <th class="text-right py-1.5 px-2">N</th>
      </tr>
    </thead>
    <tbody>
      ${history.map(d => `<tr class="border-t border-white/5">
        <td class="py-1.5 px-2 font-medium">${d.year}</td>
        <td class="py-1.5 px-2 text-right text-accent font-semibold">$${d.median_usd.toLocaleString('es-AR')}</td>
        <td class="py-1.5 px-2 text-right text-muted">$${d.p25_usd.toLocaleString('es-AR')}</td>
        <td class="py-1.5 px-2 text-right text-muted">$${d.p75_usd.toLocaleString('es-AR')}</td>
        <td class="py-1.5 px-2 text-right text-muted">${d.n}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function bindTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = { salarios: document.getElementById('tab-salarios'), fortunas: document.getElementById('tab-fortunas') };
  function activate(name) {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    Object.entries(panels).forEach(([k, p]) => p.classList.toggle('hidden', k !== name));
    if (name === 'fortunas' && typeof window.initFortunas === 'function') {
      window.initFortunas();
    }
    if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
  }
  buttons.forEach(b => b.addEventListener('click', () => activate(b.dataset.tab)));
  // initial: from hash or default salarios
  const initial = (location.hash || '').replace('#', '');
  activate(initial === 'fortunas' ? 'fortunas' : 'salarios');
}

function bindModals() {
  document.getElementById('history-close').addEventListener('click', () => {
    const m = document.getElementById('history-modal');
    m.classList.add('hidden'); m.classList.remove('flex');
  });
  document.getElementById('api-close').addEventListener('click', () => {
    const m = document.getElementById('api-modal');
    m.classList.add('hidden'); m.classList.remove('flex');
  });
  document.getElementById('open-api-modal').addEventListener('click', () => {
    const m = document.getElementById('api-modal');
    m.classList.remove('hidden'); m.classList.add('flex');
  });
  // close modals on backdrop click
  ['history-modal', 'api-modal'].forEach(id => {
    const m = document.getElementById(id);
    m.addEventListener('click', e => { if (e.target === m) { m.classList.add('hidden'); m.classList.remove('flex'); } });
  });
  // ESC closes any open modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['history-modal', 'api-modal'].forEach(id => {
        const m = document.getElementById(id);
        m.classList.add('hidden'); m.classList.remove('flex');
      });
    }
  });
}

function renderTopRubros() {
  const byRubro = {};
  DATA.forEach(r => { (byRubro[r.rubro] = byRubro[r.rubro] || []).push(r); });
  const top = Object.entries(byRubro)
    .map(([rubro, arr]) => ({ rubro, mediana: median(arr.map(a => a.median_usd)), n: arr.length, top10: arr.sort((a, b) => b.median_usd - a.median_usd).slice(0, 10) }))
    .sort((a, b) => b.mediana - a.mediana);
  const html = top.map(t => `
    <div class="card rounded-2xl p-5">
      <div class="flex items-baseline justify-between mb-3">
        <h3 class="text-lg font-bold">${escape(t.rubro)}</h3>
        <span class="text-accent font-semibold">$${t.mediana.toLocaleString('es-AR')} <span class="text-xs text-muted">USD</span></span>
      </div>
      <ol class="space-y-1 text-sm">
        ${t.top10.map((r, i) => `<li class="flex items-center justify-between gap-3"><span class="text-muted">${i + 1}. ${escape(r.rol)} <span class="text-xs">· ${escape(r.pais)}</span></span><span class="text-accent2">$${(r.median_usd).toLocaleString('es-AR')}</span></li>`).join('')}
      </ol>
    </div>
  `).join('');
  document.getElementById('top-rubros').innerHTML = html;
}

const COUNTRY_FLAGS = {
  AR: '🇦🇷', BO: '🇧🇴', BR: '🇧🇷', CL: '🇨🇱', CO: '🇨🇴',
  CR: '🇨🇷', MX: '🇲🇽', PA: '🇵🇦', UY: '🇺🇾'
};

function renderMinWage() {
  const grid = document.getElementById('min-wage-grid');
  if (!grid || !MIN_WAGE || !Array.isArray(MIN_WAGE.wages)) return;
  const stamp = document.getElementById('min-wage-updated');
  if (stamp) stamp.textContent = MIN_WAGE.last_updated || '—';
  const html = MIN_WAGE.wages
    .slice()
    .sort((a, b) => b.amount_usd_approx - a.amount_usd_approx)
    .map(w => {
      const flag = COUNTRY_FLAGS[w.iso] || '🌎';
      const localFmt = w.amount_local.toLocaleString('es-AR');
      const usdFmt = w.amount_usd_approx.toLocaleString('es-AR');
      const sourceLink = w.source_url
        ? `<a href="${escape(w.source_url)}" target="_blank" rel="noopener" class="text-accent hover:underline text-xs">${escape(w.source_name || 'Fuente')} ↗</a>`
        : '';
      return `
        <div class="card rounded-2xl p-5 flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${flag}</span>
            <h3 class="text-base font-bold">${escape(w.pais)}</h3>
            <span class="pill text-[10px] px-1.5 py-0.5 rounded-full ml-auto">${escape(w.currency)}</span>
          </div>
          <div>
            <div class="text-2xl font-bold text-accent">${localFmt} <span class="text-xs text-muted font-normal">${escape(w.currency)}</span></div>
            <div class="text-sm text-accent2">≈ US$ ${usdFmt}/mes</div>
          </div>
          <div class="text-xs text-muted">Vigente: ${escape(w.effective_date || '—')}</div>
          ${w.notes ? `<div class="text-xs text-slate-300 leading-snug">${escape(w.notes)}</div>` : ''}
          ${sourceLink}
        </div>
      `;
    }).join('');
  grid.innerHTML = html;
}

// ─── Helpers ───────────────────────────────────────────────────────────
function median(arr) {
  const sorted = [...arr].filter(n => Number.isFinite(n)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : Math.round((sorted[m - 1] + sorted[m]) / 2);
}
function escape(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ─── Three.js hero scatter ────────────────────────────────────────────
function initHero(canvasId = 'hero-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  // El hero es puramente decorativo (opacity 0.4, pointer-events:none). Si WebGL no está
  // disponible (deshabilitado / GPU en blocklist / aceleración por hardware apagada), el
  // renderer tira un error: lo capturamos y salimos para NO romper el resto del JS (tabs,
  // tabla de salarios y el chart de Fortunas).
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    console.warn('Hero WebGL no disponible, se omite el fondo decorativo:', e && e.message);
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 2, 0.1, 100);
  camera.position.set(0, 0, 18);
  scene.add(camera);

  // Particle field representing salary points
  const N = 1500;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const palette = [
    new THREE.Color('#22d3ee'),
    new THREE.Color('#a78bfa'),
    new THREE.Color('#34d399'),
    new THREE.Color('#fbbf24'),
  ];
  for (let i = 0; i < N; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    const c = palette[i % palette.length];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.85 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Connecting lines (random subset)
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  for (let i = 0; i < 80; i++) {
    const a = Math.floor(Math.random() * N);
    const b = Math.floor(Math.random() * N);
    linePositions.push(positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2]);
    linePositions.push(positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]);
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.15 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function resize() {
    const w = window.innerWidth;
    const h = canvas.parentElement.clientHeight || window.innerHeight * 0.6;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, true);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function animate() {
    t += 0.0015;
    points.rotation.y = t;
    points.rotation.x = Math.sin(t * 0.7) * 0.18;
    lines.rotation.y = t;
    lines.rotation.x = Math.sin(t * 0.7) * 0.18;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

initHero('hero-canvas');
initHero('hero-canvas-fortunas');
load().catch(e => { console.error(e); document.getElementById('results-summary').textContent = 'Error cargando datos.'; });
