/* Security section: accordion where one pillar is open at a time. */
import { $, icon, escapeHtml } from './dom.js';
import { loadPillars } from './api.js';
import { loadSection } from './status.js';

const pillarHtml = (pillar, index) => `<div class="pillar">
  <button type="button" id="pb-${index}" aria-expanded="false" aria-controls="pp-${index}">${icon(pillar.icon)}${escapeHtml(pillar.title)}</button>
  <div class="pbody" id="pp-${index}" role="region" aria-labelledby="pb-${index}" hidden>${escapeHtml(pillar.text)}<br><em>${escapeHtml(pillar.badge)}</em></div>
</div>`;

function openPillar(index) {
  [...$('pillars').children].forEach((pillar, position) => {
    const button = pillar.querySelector('button');
    const shouldOpen = position === index && button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(shouldOpen));
    pillar.querySelector('.pbody').hidden = !shouldOpen;
    pillar.dataset.open = String(shouldOpen);
  });
}

function renderPillars(pillars) {
  $('pillars').innerHTML = pillars.map(pillarHtml).join('');
  openPillar(0);
}

export function initSecurity() {
  $('pillars').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button) openPillar(Number(button.id.replace('pb-', '')));
  });
  return loadSection({
    slot: $('pillars-status'),
    content: $('pillars'),
    label: 'security features',
    emptyMessage: 'No security features are listed yet.',
    load: loadPillars,
    render: renderPillars
  });
}