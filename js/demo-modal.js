/* Request Demo dialog. The latest request is saved in localStorage:
   send = create, send again = edit, "Withdraw" = delete. */
import { $, enableBackdropClose } from './dom.js';
import { loadState, saveState, removeState } from './storage.js';
import { checkField, clearField } from './form-utils.js';
import {
  validateName, validateEmail, validateCompany,
  validateTeamSize, validateMessage, validateConsent
} from './validators.js';

const REQUEST_KEY = 'demoRequest';

const FIELDS = [
  { key: 'name', id: 'demo-name', validate: validateName },
  { key: 'email', id: 'demo-email', validate: validateEmail },
  { key: 'company', id: 'demo-company', validate: validateCompany },
  { key: 'teamSize', id: 'demo-size', validate: validateTeamSize },
  { key: 'message', id: 'demo-message', validate: validateMessage },
  { key: 'consent', id: 'demo-consent', validate: validateConsent }
];

const inputOf = (field) => $(field.id);
const errorOf = (field) => $(`${field.id}-error`);
const hasTypedValue = (input) => input.type !== 'checkbox' && input.value !== '';

/* ---------- saved request ---------- */

function isSavedRequest(value) {
  const required = ['name', 'email', 'company', 'teamSize', 'createdAt'];
  return Boolean(value) && required.every((key) => typeof value[key] === 'string');
}

function loadRequest() {
  const saved = loadState(REQUEST_KEY, null);
  return isSavedRequest(saved) ? saved : null;
}

function formatDate(isoText) {
  const date = new Date(isoText);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/* The note under the hero buttons. Pass a message to show text without the Edit/Withdraw buttons. */
function renderStatus(message = '') {
  const saved = loadRequest();
  const box = $('demo-status');
  if (!message && !saved) { box.hidden = true; return; }

  $('demo-status-text').textContent = message || `Demo requested by ${saved.name} on ${formatDate(saved.createdAt)}.`;
  $('demo-status-actions').hidden = Boolean(message);
  box.hidden = false;
}

function withdrawRequest() {
  removeState(REQUEST_KEY);
  renderStatus('Your demo request was withdrawn.');
}

/* ---------- form ---------- */

function resetForm() {
  $('demo-form').reset();
  FIELDS.forEach((field) => clearField(inputOf(field), errorOf(field)));
}

function fillForm(request) {
  FIELDS.forEach((field) => {
    if (field.key in request) inputOf(field).value = request[field.key];
  });
}

function readRequest() {
  const request = { createdAt: new Date().toISOString() };
  FIELDS.filter((field) => field.key !== 'consent')
    .forEach((field) => { request[field.key] = inputOf(field).value.trim(); });
  return request;
}

/* Checks every field (so all messages show) and returns the first invalid input, or null. */
function findFirstInvalid() {
  const invalid = FIELDS.filter((field) => !checkField(inputOf(field), errorOf(field), field.validate));
  return invalid.length > 0 ? inputOf(invalid[0]) : null;
}

/* After the first mistake, or after leaving a filled field, re-check while the person types. */
function watchFields() {
  FIELDS.forEach((field) => {
    const input = inputOf(field);
    const isInvalid = () => input.getAttribute('aria-invalid') === 'true';
    const recheck = () => checkField(input, errorOf(field), field.validate);
    const changeEvent = input.type === 'checkbox' ? 'change' : 'input';

    input.addEventListener('blur', () => { if (hasTypedValue(input) || isInvalid()) recheck(); });
    input.addEventListener(changeEvent, () => { if (isInvalid()) recheck(); });
  });
}

/* ---------- dialog views ---------- */

function showFormView(isEditing) {
  $('demo-form').hidden = false;
  $('demo-success').hidden = true;
  $('demo-title').textContent = isEditing ? 'Update your demo request' : 'Request a demo';
  $('demo-submit').textContent = isEditing ? 'Save changes' : 'Send request';
}

function showSuccessView(request, wasSaved) {
  const saveNote = wasSaved ? '' : ' We could not save it in this browser, so it will not be remembered after a refresh.';
  $('demo-success-text').textContent =
    `Thank you, ${request.name}! We received your request for ${request.company}. This is a practice form, so nothing was sent.${saveNote}`;
  $('demo-form').hidden = true;
  $('demo-success').hidden = false;
  $('demo-success-title').focus();
}

function openDemoDialog() {
  const saved = loadRequest();
  resetForm();
  if (saved) fillForm(saved);
  showFormView(Boolean(saved));
  if (!$('demo-dialog').open) $('demo-dialog').showModal();
  $('demo-name').focus();
}

function handleSubmit(event) {
  event.preventDefault();
  const firstInvalid = findFirstInvalid();
  if (firstInvalid) { firstInvalid.focus(); return; }

  const request = readRequest();
  const wasSaved = saveState(REQUEST_KEY, request);
  renderStatus();
  showSuccessView(request, wasSaved);
}

export function initDemoModal() {
  const dialog = $('demo-dialog');
  enableBackdropClose(dialog);
  document.querySelectorAll('[data-open-demo]').forEach((button) => button.addEventListener('click', openDemoDialog));
  $('demo-form').addEventListener('submit', handleSubmit);
  $('demo-cancel').addEventListener('click', () => dialog.close());
  $('demo-done').addEventListener('click', () => dialog.close());
  $('demo-edit').addEventListener('click', openDemoDialog);
  $('demo-withdraw').addEventListener('click', withdrawRequest);
  watchFields();
  renderStatus();
}