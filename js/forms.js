/* Newsletter form and login dialog. */
import { $, setMessage } from './dom.js';
import { validateEmail, validatePassword } from './validators.js';

/* Validates one field and shows the result in its message element. Returns true when valid. */
function checkField(input, message, validate) {
  const error = validate(input.value);
  input.setAttribute('aria-invalid', String(error !== ''));
  setMessage(message, error, false);
  return error === '';
}

function initSubscribeForm() {
  const form = $('sub-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!checkField($('email'), $('sub-msg'), validateEmail)) return;
    form.reset();
    setMessage($('sub-msg'), 'Thank you! Your first brief is on its way.', true);
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
  $('login-open').addEventListener('click', () => { dialog.showModal(); $('l-email').focus(); });
  $('login-close').addEventListener('click', () => dialog.close());
  initPasswordToggle();

  $('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = $('login-msg');
    const emailOk = checkField($('l-email'), message, validateEmail);
    if (!emailOk) return;
    if (!checkField($('l-pass'), message, validatePassword)) return;
    setMessage(message, 'Login successful (demo only, no backend yet).', true);
  });
}

export function initForms() {
  initSubscribeForm();
  initLoginDialog();
}