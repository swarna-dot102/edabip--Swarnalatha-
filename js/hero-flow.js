/* Hero: interactive data flow. Switch a source on or off and the outputs change. */
import { $, icon, escapeHtml, animateNumber } from './dom.js';
import { loadSources } from './api.js';
import { loadSection } from './status.js';
import { loadState, saveState } from './storage.js';

const RECORDS_PER_REPORT = 60000;
const RECORDS_PER_ALERT = 150000;
const DASHBOARDS_PER_SOURCE = 3;
const ACTIVE_SOURCES_KEY = 'activeSources';

const state = { sources: [], active: new Set() };

function sourceButtonHtml(source, isOn) {
  return `<button type="button" class="src" data-id="${escapeHtml(source.id)}" aria-pressed="${isOn}">
    ${icon(source.icon)}<span><b>${escapeHtml(source.name)}</b><small>${escapeHtml(source.detail)}</small></span><span class="state">${isOn ? 'ON' : 'OFF'}</span>
  </button>`;
}

function updateOutputs() {
  const activeSources = state.sources.filter((source) => state.active.has(source.id));
  const records = activeSources.reduce((total, source) => total + source.records, 0);
  animateNumber($('hub-records'), records, ' records / day');
  animateNumber($('out-dash'), activeSources.length * DASHBOARDS_PER_SOURCE);
  animateNumber($('out-rep'), Math.round(records / RECORDS_PER_REPORT));
  animateNumber($('out-alert'), Math.round(records / RECORDS_PER_ALERT));
}

function toggleSource(button) {
  const id = button.dataset.id;
  if (state.active.has(id)) state.active.delete(id); else state.active.add(id);
  const isOn = state.active.has(id);
  button.setAttribute('aria-pressed', String(isOn));
  button.querySelector('.state').textContent = isOn ? 'ON' : 'OFF';
  saveState(ACTIVE_SOURCES_KEY, [...state.active]);
  updateOutputs();
}

/* Sources that were switched on last time (all on the first time). */
function restoreActiveSources(sources) {
  const saved = loadState(ACTIVE_SOURCES_KEY, null);
  if (!Array.isArray(saved)) return new Set(sources.map((source) => source.id));
  return new Set(sources.filter((source) => saved.includes(source.id)).map((source) => source.id));
}

function renderSources(sources) {
  state.sources = sources;
  state.active = restoreActiveSources(sources);
  $('sources').innerHTML = sources.map((source) => sourceButtonHtml(source, state.active.has(source.id))).join('');
  updateOutputs();
}

export function initHeroFlow() {
  $('sources').addEventListener('click', (event) => {
    const button = event.target.closest('.src');
    if (button) toggleSource(button);
  });
  return loadSection({
    slot: $('sources-status'),
    content: $('sources'),
    label: 'data sources',
    emptyMessage: 'No data sources are available yet.',
    load: loadSources,
    render: renderSources
  });
}