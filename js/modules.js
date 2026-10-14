/* "Modules" section: search box + category chips filter the module cards. */
import { $, icon, escapeHtml } from './dom.js';
import { loadModules } from './api.js';
import { loadSection } from './status.js';

const ALL = 'All';
const state = { modules: [], category: ALL };

function matchesFilters(module, query) {
  const inCategory = state.category === ALL || module.cat === state.category;
  const text = `${module.name} ${module.text}`.toLowerCase();
  return inCategory && text.includes(query);
}

const cardHtml = (module) =>
  `<article class="mod card">${icon(module.icon)}<h3>${escapeHtml(module.name)}</h3><p>${escapeHtml(module.text)}</p><span class="tag">${escapeHtml(module.cat)}</span></article>`;

const chipHtml = (category) =>
  `<button type="button" class="chip" data-category="${escapeHtml(category)}" aria-pressed="${category === state.category}">${escapeHtml(category)}</button>`;

function renderGrid() {
  const query = $('module-search').value.trim().toLowerCase();
  const visible = state.modules.filter((module) => matchesFilters(module, query));
  $('module-grid').innerHTML = visible.map(cardHtml).join('');
  $('count').textContent = `Showing ${visible.length} of ${state.modules.length} modules`;
  $('empty').hidden = visible.length > 0;
}

function selectCategory(category) {
  state.category = category;
  $('chips').querySelectorAll('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === category));
  });
  renderGrid();
}

function renderModules(modules) {
  state.modules = modules;
  state.category = ALL;
  const categories = [ALL, ...new Set(modules.map((module) => module.cat))];
  $('chips').innerHTML = categories.map(chipHtml).join('');
  renderGrid();
}

export function initModules() {
  $('module-search').addEventListener('input', renderGrid);
  $('chips').addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (chip) selectCategory(chip.dataset.category);
  });
  return loadSection({
    slot: $('modules-status'),
    content: $('modules-content'),
    label: 'modules',
    emptyMessage: 'No modules are available yet.',
    load: loadModules,
    render: renderModules
  });
}