/* Sections fade in (and rise a little) the first time they scroll into view.
   Nothing is hidden when the browser lacks IntersectionObserver or the person
   prefers reduced motion, so the content is always reachable. */
import { prefersReducedMotion } from './dom.js';

export function initFadeIn() {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);          /* fade in once, not every time */
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((section) => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}