/* Loading, error and empty states, shared by every section that loads data. */
import { escapeHtml } from './dom.js';

function showStatus(slot, kind, role, html) {
  slot.className = `status status-${kind}`;
  slot.setAttribute('role', role);
  slot.innerHTML = html;
  slot.hidden = false;
}

function clearStatus(slot) {
  slot.replaceChildren();
  slot.className = '';
  slot.removeAttribute('role');
  slot.hidden = true;
}

const showLoading = (slot, label) =>
  showStatus(slot, 'loading', 'status', `<span class="spinner" aria-hidden="true"></span><span>Loading ${escapeHtml(label)}…</span>`);

const showEmpty = (slot, message) =>
  showStatus(slot, 'empty', 'status', `<span>${escapeHtml(message)}</span>`);

function showError(slot, message, onRetry) {
  showStatus(slot, 'error', 'alert',
    `<span>${escapeHtml(message)}</span><button type="button" class="btn btn-ghost">Try again</button>`);
  slot.querySelector('button').addEventListener('click', onRetry);
}

/*
 * Loads a list, then renders it.
 *   slot    - element that shows the loading / error / empty message
 *   content - element that holds the real content (hidden until data arrives)
 */
export async function loadSection({ slot, content, label, emptyMessage, load, render }) {
  content.hidden = true;
  showLoading(slot, label);
  try {
    const items = await load();
    if (items.length === 0) {
      showEmpty(slot, emptyMessage);
      return;
    }
    clearStatus(slot);
    render(items);
    content.hidden = false;
  } catch (error) {
    const message = `We could not load ${label}. ${error.message}`;
    showError(slot, message, () => loadSection({ slot, content, label, emptyMessage, load, render }));
  }
}