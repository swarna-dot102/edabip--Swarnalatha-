/* Form validators. Each returns an error message, or an empty string when the value is valid. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

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