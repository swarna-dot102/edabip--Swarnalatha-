/* Smooth-scroll navigation. The link of the section you are reading is highlighted
   (IntersectionObserver). The header itself is sticky in CSS. */
import { $, prefersReducedMotion } from './dom.js';

const SECTION_IDS = ['journey', 'modules', 'security', 'subscribe'];
const visibleSections = new Set();

function setActiveLink(sectionId) {
  document.querySelectorAll('#nav a[href^="#"]').forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

const isAtPageBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

function updateActiveLink() {
  const lastVisible = SECTION_IDS.filter((id) => visibleSections.has(id)).pop();
  const fallback = isAtPageBottom() ? SECTION_IDS[SECTION_IDS.length - 1] : null;
  setActiveLink(lastVisible ?? fallback);
}

function observeSections() {
  /* Only a thin band across the upper middle of the screen counts as "reading here". */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.add(entry.target.id);
      else visibleSections.delete(entry.target.id);
    });
    updateActiveLink();
  }, { rootMargin: '-35% 0px -55% 0px' });

  SECTION_IDS.forEach((id) => {
    const section = $(id);
    if (section) observer.observe(section);
  });
}

function scrollToSection(event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  if (window.location.hash !== hash) history.pushState(null, '', hash);
  target.setAttribute('tabindex', '-1');      /* lets keyboard users continue from the section */
  target.focus({ preventScroll: true });
}

export function initScrollNav() {
  document.addEventListener('click', scrollToSection);
  observeSections();
}