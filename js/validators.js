/* Form validators. Each returns an error message, or an empty string when the value is valid. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[\p{L}][\p{L} .'-]*$/u;
const MIN_PASSWORD_LENGTH = 6;
const MAX_COMPANY_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 300;

export function validateEmail(value) {
  const email = value.trim();
  if (email === '') return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address, for example name@company.com.';
  return '';
}

export function validatePassword(value) {
  if (value === '') return 'Please enter your password.';
  if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return '';
}

export function validateName(value) {
  const name = value.trim();
  if (name === '') return 'Please enter your full name.';
  if (name.length < 2) return 'Your name must be at least 2 characters.';
  if (!NAME_PATTERN.test(name)) return 'Your name can only have letters, spaces, dots, apostrophes and hyphens.';
  return '';
}

export function validateCompany(value) {
  const company = value.trim();
  if (company === '') return 'Please enter your company name.';
  if (company.length > MAX_COMPANY_LENGTH) return `Company name must be ${MAX_COMPANY_LENGTH} characters or fewer.`;
  return '';
}

export function validateTeamSize(value) {
  return value === '' ? 'Please choose your team size.' : '';
}

/* The message is optional, but it cannot be too long. */
export function validateMessage(value) {
  const length = value.trim().length;
  return length > MAX_MESSAGE_LENGTH
    ? `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer (it is ${length} now).`
    : '';
}

export function validateConsent(isChecked) {
  return isChecked ? '' : 'Please tick the box so we can contact you about the demo.';
}