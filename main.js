import * as THREE from 'three';

// ─── State ─────────────────────────────────────────────────────────────
let DATA = [];
let META = {};
let filters = { search: '', pais: '', rubro: '', seniority: '', modalidad: '' };

// ─── Bootstrap ─────────────────────────────────────────────────────────
async function load() {
  const [data, meta] = await Promise.all([
    fetch('./data/salaries.json').then(r => r.json()),
    fetch('./data/meta.json').then(r => r.json()),
  ]);
  DATA = data;
  META = meta;
  renderStats();
  populateSelects();
  bindFilters();
  render();
  renderTopRubros();
  renderSources();
  document.getElementById('last-updated').textContent = META.last_updated || '—';
  const lu2 = document.getElementById('last-updated-2');
  if (lu2) lu2.textContent = META.last_updated || '—';
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
  document.getElementById('f-search').addEventListener('input', e => { filters.search = e.target.value.toLowerCase(); render(); });
  document.getElementById('f-pais').addEventListener('change', e => { filters.pais = e.target.value; render(); });
  document.getElementById('f-rubro').addEventListener('change', e => { filters.rubro = e.target.value; render(); });
  document.getElementById('f-seniority').addEventListener('change', e => { filters.seniority = e.target.value; render(); });
  document.querySelectorAll('.modalidad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.modalidad = btn.dataset.modalidad;
      document.querySelectorAll('.modalidad-btn').forEach(b => b.classList.remove('bg-accent', 'text-slate-900'));
      btn.classList.add('bg-accent', 'text-slate-900');
      render();
    });
  });
}

function applyFilters(rows) {
  return rows.filter(r => {
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
}

function render() {
  const rows = applyFilters(DATA);
  const tbody = document.getElementById('results-tbody');
  const empty = document.getElementById('empty-state');
  tbody.innerHTML = '';
  if (rows.length === 0) {
    empty.classList.remove('hidden');
    document.getElementById('results-summary').textContent = '';
    return;
  }
  empty.classList.add('hidden');
  document.getElementById('results-summary').textContent = `${rows.length} resultados — mediana global $${median(rows.map(r => r.median_usd)).toLocaleString('es-AR')} USD`;
  rows.slice(0, 200).forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'row border-t border-white/5';
    tr.innerHTML = `
      <td class="py-2.5 px-4 font-medium">${escape(r.rol)}</td>
      <td class="py-2.5 px-4 text-muted">${escape(r.rubro)}</td>
      <td class="py-2.5 px-4">${escape(r.seniority || '—')}</td>
      <td class="py-2.5 px-4">${escape(r.pais)}</td>
      <td class="py-2.5 px-4 text-muted">${escape(r.modalidad || '—')}</td>
      <td class="py-2.5 px-4 text-right font-semibold text-accent">$${(r.median_usd ?? 0).toLocaleString('es-AR')}</td>
      <td class="py-2.5 px-4 text-right text-muted">$${(r.p25_usd ?? 0).toLocaleString('es-AR')} — $${(r.p75_usd ?? 0).toLocaleString('es-AR')}</td>
      <td class="py-2.5 px-4 text-right text-muted">${r.n ?? '—'}</td>`;
    tbody.appendChild(tr);
  });
}

function renderTopRubros() {
  const byRubro = {};
  DATA.forEach(r => { (byRubro[r.rubro] = byRubro[r.rubro] || []).push(r); });
  const top = Object.entries(byRubro)
    .map(([rubro, arr]) => ({ rubro, mediana: median(arr.map(a => a.median_usd)), n: arr.length, top10: arr.sort((a, b) => b.median_usd - a.median_usd).slice(0, 10) }))
    .sort((a, b) => b.mediana - a.mediana)
    .slice(0, 6);
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

// ─── Helpers ───────────────────────────────────────────────────────────
function median(arr) {
  const sorted = [...arr].filter(n => Number.isFinite(n)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : Math.round((sorted[m - 1] + sorted[m]) / 2);
}
function escape(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ─── Three.js hero scatter ────────────────────────────────────────────
function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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

initHero();
load().catch(e => { console.error(e); document.getElementById('results-summary').textContent = 'Error cargando datos.'; });
