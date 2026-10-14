/* Hero: interactive data flow. Switch a source on or off and the outputs change. */
import { $, icon, escapeHtml, animateNumber } from './dom.js';
import { loadSources } from './api.js';
import { loadSection } from './status.js';

const RECORDS_PER_REPORT = 60000;
const RECORDS_PER_ALERT = 150000;
const DASHBOARDS_PER_SOURCE = 3;

const state = { sources: [], active: new Set() };

function sourceButtonHtml(source) {
  return `<button type="button" class="src" data-id="${escapeHtml(source.id)}" aria-pressed="true">
    ${icon(source.icon)}<span><b>${escapeHtml(source.name)}</b><small>${escapeHtml(source.detail)}</small></span><span class="state">ON</span>
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
  updateOutputs();
}

function renderSources(sources) {
  state.sources = sources;
  state.active = new Set(sources.map((source) => source.id));
  $('sources').innerHTML = sources.map(sourceButtonHtml).join('');
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