/* Footer button that clears everything saved in localStorage. Handy for testing and demos. */
import { $ } from './dom.js';
import { clearAllState } from './storage.js';

export function initResetButton() {
  $('reset-data').addEventListener('click', () => {
    clearAllState();
    window.location.reload();
  });
}