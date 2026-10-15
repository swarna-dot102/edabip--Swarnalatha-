/* Small DOM helpers shared by every module. */

export const $ = (id) => document.getElementById(id);

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function icon(name) {
  return `<svg class="ic" aria-hidden="true"><use href="assets/icons.svg#${escapeHtml(name)}"/></svg>`;
}

/* Shows a feedback message under a form field and styles it as success or error. */
export function setMessage(element, text, isSuccess) {
  element.textContent = text;
  element.classList.toggle('msg-ok', Boolean(text) && isSuccess);
  element.classList.toggle('msg-error', Boolean(text) && !isSuccess);
}

/* Counts a number up or down inside an element (instantly if the user prefers reduced motion). */
export function animateNumber(element, target, suffix = '') {
  const from = Number(element.dataset.value || 0);
  element.dataset.value = target;
  const write = (value) => { element.textContent = Math.round(value).toLocaleString() + suffix; };

  if (prefersReducedMotion) { write(target); return; }

  const duration = 450;
  let start = null;
  function step(time) {
    if (start === null) start = time;
    const progress = Math.min((time - start) / duration, 1);
    write(from + (target - from) * progress);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Closes a <dialog> when the dark area outside it is clicked. */
export function enableBackdropClose(dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;          /* a click on something inside the dialog */
    const box = dialog.getBoundingClientRect();
    const isOutside = event.clientX < box.left || event.clientX > box.right ||
                      event.clientY < box.top || event.clientY > box.bottom;
    if (isOutside) dialog.close();
  });
}