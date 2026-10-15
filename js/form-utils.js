/* Helpers shared by every form: run a validator on one field and show its message. */
import { setMessage } from './dom.js';

const readValue = (input) => (input.type === 'checkbox' ? input.checked : input.value);

/* Validates one field and shows the result in its message element. Returns true when valid. */
export function checkField(input, messageElement, validate) {
  const error = validate(readValue(input));
  input.setAttribute('aria-invalid', String(error !== ''));
  setMessage(messageElement, error, false);
  return error === '';
}

export function clearField(input, messageElement) {
  input.removeAttribute('aria-invalid');
  setMessage(messageElement, '', false);
}