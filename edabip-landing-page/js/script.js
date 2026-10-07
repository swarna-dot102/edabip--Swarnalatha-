'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsForm');
  const msg = document.getElementById('formMsg');
  if (!form || !msg) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = document.getElementById('email').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    msg.textContent = ok ? 'Thanks! You are subscribed.' : 'Enter a valid business email, e.g. name@company.com.';
    if (ok) form.reset();
  });
});