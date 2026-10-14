/* "The journey" section: tabs with keyboard (arrow key) support and a progress bar. */
import { $, escapeHtml } from './dom.js';
import { loadStages } from './api.js';
import { loadSection } from './status.js';

const state = { stages: [] };

const tabHtml = (stage, index) =>
  `<button type="button" class="stage" id="tab-${index}" role="tab" data-index="${index}"><span>${index + 1}</span>${escapeHtml(stage.name)}</button>`;

const panelHtml = (stage) =>
  `<div><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.text)}</p>
    <ul>${stage.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
   <div class="metric"><b>${escapeHtml(stage.metric)}</b><span>${escapeHtml(stage.label)}</span></div>`;

function showStage(index, { focus = false } = {}) {
  const tabs = $('stages').querySelectorAll('.stage');
  tabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  $('stage-panel').setAttribute('aria-labelledby', `tab-${index}`);
  $('stage-panel').innerHTML = panelHtml(state.stages[index]);
  $('progress-bar').style.width = `${((index + 1) / state.stages.length) * 100}%`;
  if (focus) tabs[index].focus();
}

function neighbourIndex(key, index) {
  const count = state.stages.length;
  if (key === 'ArrowRight') return (index + 1) % count;
  if (key === 'ArrowLeft') return (index + count - 1) % count;
  return null;
}

function handleKeydown(event) {
  const tab = event.target.closest('.stage');
  if (!tab) return;
  const next = neighbourIndex(event.key, Number(tab.dataset.index));
  if (next === null) return;
  event.preventDefault();
  showStage(next, { focus: true });
}

function renderStages(stages) {
  state.stages = stages;
  $('stages').innerHTML = stages.map(tabHtml).join('');
  showStage(0);
}

export function initJourney() {
  $('stages').addEventListener('click', (event) => {
    const tab = event.target.closest('.stage');
    if (tab) showStage(Number(tab.dataset.index));
  });
  $('stages').addEventListener('keydown', handleKeydown);
  return loadSection({
    slot: $('journey-status'),
    content: $('journey-content'),
    label: 'the data journey',
    emptyMessage: 'The data journey is not available yet.',
    load: loadStages,
    render: renderStages
  });
}