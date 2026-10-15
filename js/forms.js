/* Newsletter form and login dialog. */
import { $, setMessage, enableBackdropClose } from './dom.js';
import { validateEmail, validatePassword } from './validators.js';
import { checkField } from './form-utils.js';
import { loadState, saveState } from './storage.js';

const SUBSCRIBED_KEY = 'subscribedEmail';

const savedEmail = () => loadState(SUBSCRIBED_KEY, '');

function validateNewEmail(value) {
  const error = validateEmail(value);
  if (error) return error;
  return value.trim().toLowerCase() === String(savedEmail()).toLowerCase()
    ? 'This email is already subscribed.'
    : '';
}

function initSubscribeForm() {
  const form = $('sub-form');
  const message = $('sub-msg');
  const saved = savedEmail();
  if (saved) setMessage(message, `You are subscribed with ${saved}.`, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!checkField($('email'), message, validateNewEmail)) return;
    saveState(SUBSCRIBED_KEY, $('email').value.trim());
    form.reset();
    setMessage(message, 'Thank you! Your first brief is on its way.', true);
  });
}

function initPasswordToggle() {
  $('pass-toggle').addEventListener('click', (event) => {
    const input = $('l-pass');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    event.currentTarget.textContent = show ? 'Hide' : 'Show';
    event.currentTarget.setAttribute('aria-pressed', String(show));
  });
}

function initLoginDialog() {
  const dialog = $('login-dialog');
  enableBackdropClose(dialog);
  $('login-open').addEventListener('click', () => { dialog.showModal(); $('l-email').focus(); });
  $('login-close').addEventListener('click', () => dialog.close());
  initPasswordToggle();

  $('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = $('login-msg');
    if (!checkField($('l-email'), message, validateEmail)) return;
    if (!checkField($('l-pass'), message, validatePassword)) return;
    setMessage(message, 'Login successful (demo only, no backend yet).', true);
  });
}

export function initForms() {
  initSubscribeForm();
  initLoginDialog();
}