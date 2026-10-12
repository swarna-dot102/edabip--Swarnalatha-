'use strict';

/* ===== Sample data (no backend yet) ===== */
var sources = [
  { id: 'erp',  name: 'ERP',     detail: 'Orders and inventory', icon: 'i-db',    records: 420000 },
  { id: 'crm',  name: 'CRM',     detail: 'Customers and deals',  icon: 'i-users', records: 310000 },
  { id: 'hrms', name: 'HRMS',    detail: 'People and payroll',   icon: 'i-id',    records: 95000 },
  { id: 'fin',  name: 'Finance', detail: 'Ledgers and invoices', icon: 'i-coin',  records: 240000 }
];

var stages = [
  { name: 'Connect',   title: 'Connect every source',  text: 'Link your ERP, CRM, HRMS, finance tools, APIs and cloud platforms without writing integration code.',
    items: ['100+ ready connectors', 'Cloud and on-premise', 'Real-time data sync', 'API integration'], metric: '100+', label: 'connectors available' },
  { name: 'Prepare',   title: 'Prepare data you can trust', text: 'Clean, validate and enrich raw data in automated pipelines so every team sees the same numbers.',
    items: ['Data cleansing', 'Data validation', 'ETL pipelines', 'Data enrichment'], metric: '99.9%', label: 'records validated' },
  { name: 'Visualize', title: 'Visualize what matters', text: 'Build interactive dashboards and monitor KPIs in one shared view, with Power BI and Tableau support.',
    items: ['Interactive dashboards', 'KPI monitoring', 'Power BI and Tableau', 'Scheduled reports'], metric: '1 view', label: 'for every team' },
  { name: 'Predict',   title: 'Predict what comes next', text: 'Use predictive analytics to forecast trends, detect anomalies and get plain-language recommendations.',
    items: ['Predictive analytics', 'Trend forecasting', 'Anomaly detection', 'Smart recommendations'], metric: '30 days', label: 'forecast horizon' }
];

var modules = [
  { name: 'Dashboards',      cat: 'Visualize', icon: 'i-grid',  text: 'Real-time views of every KPI, shared across departments.' },
  { name: 'Reports',         cat: 'Visualize', icon: 'i-doc',   text: 'Scheduled PDF and XLS exports for audits and reviews.' },
  { name: 'Analytics',       cat: 'Visualize', icon: 'i-bars',  text: 'Explore data across dimensions and test predictions.' },
  { name: 'Alerts',          cat: 'Automate',  icon: 'i-bell',  text: 'Slack, SMS and email alerts with smart escalation.' },
  { name: 'Connectors',      cat: 'Automate',  icon: 'i-plug',  text: 'Plug in ERP, CRM, finance and HR systems in minutes.' },
  { name: 'Data quality',    cat: 'Automate',  icon: 'i-check', text: 'Automatic cleansing and validation rules for every pipeline.' },
  { name: 'Forecasting',     cat: 'Predict',   icon: 'i-trend', text: 'Trend forecasts and anomaly detection on your own data.' },
  { name: 'User management', cat: 'Govern',    icon: 'i-user',  text: 'SSO, directory sync, roles and audit logging.' }
];

var pillars = [
  { icon: 'i-finger', title: 'MFA authentication',   badge: 'FIDO2 + BIOMETRIC', text: 'Identity-first security with biometric and FIDO2 hardware key support across all endpoints.' },
  { icon: 'i-lock',   title: 'End-to-end encryption', badge: 'AES-256',           text: 'Military-grade AES-256 applied to data both at rest and in transit.' },
  { icon: 'i-key',    title: 'RBAC control',          badge: 'GRANULAR',          text: 'Precision attribute-based access control, down to the individual cell.' },
  { icon: 'i-doc',    title: 'Immutable audit logs',  badge: 'VERIFIED',          text: 'Tamper-proof tracking of every user and system interaction.' }
];

/* ===== Helpers ===== */
function $(id) { return document.getElementById(id); }
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function icon(name) { return '<svg class="ic" aria-hidden="true"><use href="#' + name + '"/></svg>'; }

/* ===== 1. Mobile menu ===== */
var menuBtn = $('menu-btn'), nav = $('nav');
menuBtn.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

/* ===== 2. Hero: interactive data flow ===== */
var active = {};
sources.forEach(function (s) { active[s.id] = true; });

function tween(el, to, suffix) {
  var from = Number(el.dataset.value || 0);
  el.dataset.value = to;
  if (reduce) { el.textContent = to.toLocaleString() + (suffix || ''); return; }
  var start = null;
  function step(t) {
    if (!start) start = t;
    var p = Math.min((t - start) / 450, 1);
    el.textContent = Math.round(from + (to - from) * p).toLocaleString() + (suffix || '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateFlow() {
  var records = 0, count = 0;
  sources.forEach(function (s) { if (active[s.id]) { records += s.records; count++; } });
  tween($('hub-records'), records, ' records / day');
  tween($('out-dash'), count * 3);
  tween($('out-rep'), Math.round(records / 60000));
  tween($('out-alert'), Math.round(records / 150000));
}

var srcBox = $('sources');
sources.forEach(function (s) {
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'src';
  b.setAttribute('aria-pressed', 'true');
  b.innerHTML = icon(s.icon) + '<span><b>' + s.name + '</b><small>' + s.detail + '</small></span><span class="state">ON</span>';
  b.addEventListener('click', function () {
    active[s.id] = !active[s.id];
    b.setAttribute('aria-pressed', String(active[s.id]));
    b.querySelector('.state').textContent = active[s.id] ? 'ON' : 'OFF';
    updateFlow();
  });
  srcBox.appendChild(b);
});
updateFlow();

/* ===== 3. Journey tabs (keyboard: arrow keys) ===== */
var stageBox = $('stages'), panel = $('stage-panel'), bar = $('progress-bar');
var tabs = [];

function showStage(i, focus) {
  var s = stages[i];
  tabs.forEach(function (t, n) {
    t.setAttribute('aria-selected', String(n === i));
    t.tabIndex = n === i ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', 'tab-' + i);
  panel.innerHTML = '<div><h3>' + s.title + '</h3><p>' + s.text + '</p><ul>' +
    s.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
    '<div class="metric"><b>' + s.metric + '</b><span>' + s.label + '</span></div>';
  bar.style.width = ((i + 1) / stages.length * 100) + '%';
  if (focus) tabs[i].focus();
}

stages.forEach(function (s, i) {
  var t = document.createElement('button');
  t.type = 'button';
  t.className = 'stage';
  t.id = 'tab-' + i;
  t.setAttribute('role', 'tab');
  t.innerHTML = '<span>' + (i + 1) + '</span>' + s.name;
  t.addEventListener('click', function () { showStage(i, false); });
  t.addEventListener('keydown', function (e) {
    var n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % stages.length;
    if (e.key === 'ArrowLeft') n = (i + stages.length - 1) % stages.length;
    if (n !== null) { e.preventDefault(); showStage(n, true); }
  });
  stageBox.appendChild(t);
  tabs.push(t);
});
showStage(0, false);

/* ===== 4. Modules: search + filter ===== */
var cats = ['All', 'Visualize', 'Automate', 'Predict', 'Govern'];
var currentCat = 'All';
var chipBox = $('chips'), grid = $('module-grid'), search = $('module-search');

function renderModules() {
  var q = search.value.trim().toLowerCase();
  var list = modules.filter(function (m) {
    var inCat = currentCat === 'All' || m.cat === currentCat;
    var inText = m.name.toLowerCase().indexOf(q) > -1 || m.text.toLowerCase().indexOf(q) > -1;
    return inCat && inText;
  });
  grid.innerHTML = list.map(function (m) {
    return '<article class="mod card">' + icon(m.icon) + '<h3>' + m.name + '</h3><p>' + m.text + '</p><span class="tag">' + m.cat + '</span></article>';
  }).join('');
  $('count').textContent = 'Showing ' + list.length + ' of ' + modules.length + ' modules';
  $('empty').hidden = list.length > 0;
}

cats.forEach(function (c) {
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip';
  b.textContent = c;
  b.setAttribute('aria-pressed', String(c === currentCat));
  b.addEventListener('click', function () {
    currentCat = c;
    Array.prototype.forEach.call(chipBox.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    renderModules();
  });
  chipBox.appendChild(b);
});
search.addEventListener('input', renderModules);
renderModules();

/* ===== 5. Security accordion (one open at a time) ===== */
var pillarBox = $('pillars');
pillars.forEach(function (p, i) {
  var wrap = document.createElement('div');
  wrap.className = 'pillar';
  wrap.innerHTML = '<button type="button" id="pb-' + i + '" aria-expanded="false" aria-controls="pp-' + i + '">' + icon(p.icon) + p.title + '</button>' +
    '<div class="pbody" id="pp-' + i + '" role="region" aria-labelledby="pb-' + i + '" hidden>' + p.text + '<br><em>' + p.badge + '</em></div>';
  pillarBox.appendChild(wrap);
});
function openPillar(i) {
  Array.prototype.forEach.call(pillarBox.children, function (w, n) {
    var open = n === i && w.querySelector('button').getAttribute('aria-expanded') !== 'true';
    w.querySelector('button').setAttribute('aria-expanded', String(open));
    w.querySelector('.pbody').hidden = !open;
    w.setAttribute('data-open', String(open));
  });
}
pillarBox.addEventListener('click', function (e) {
  var b = e.target.closest('button');
  if (b) openPillar(Number(b.id.replace('pb-', '')));
});
openPillar(0);

/* ===== 6. Subscribe form ===== */
var subForm = $('sub-form'), subMsg = $('sub-msg'), email = $('email');
subForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  email.setAttribute('aria-invalid', String(!ok));
  subMsg.textContent = ok ? 'Thank you! Your first brief is on its way.' : 'Please enter a valid business email, for example name@company.com.';
  subMsg.style.color = ok ? '#0b5d2a' : '#8a1c12';
  if (ok) subForm.reset();
});

/* ===== 7. Login dialog (show / hide password) ===== */
var dlg = $('login-dialog');
$('login-open').addEventListener('click', function () { dlg.showModal(); $('l-email').focus(); });
$('login-close').addEventListener('click', function () { dlg.close(); });
$('pass-toggle').addEventListener('click', function () {
  var input = $('l-pass'), show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  this.textContent = show ? 'Hide' : 'Show';
  this.setAttribute('aria-pressed', String(show));
});
$('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var msg = $('login-msg');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('l-email').value.trim())) { msg.textContent = 'Enter a valid email address.'; msg.style.color = '#8a1c12'; return; }
  if ($('l-pass').value.length < 6) { msg.textContent = 'Password must be at least 6 characters.'; msg.style.color = '#8a1c12'; return; }
  msg.textContent = 'Login successful (demo only, no backend yet).'; msg.style.color = '#0b5d2a';
});