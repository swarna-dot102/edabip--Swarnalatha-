/* Entry point: starts every part of the page. */
import { initMenu } from './menu.js';
import { initScrollNav } from './scroll-nav.js';
import { initForms } from './forms.js';
import { initDemoModal } from './demo-modal.js';
import { initResetButton } from './reset.js';
import { initHeroFlow } from './hero-flow.js';
import { initJourney } from './journey.js';
import { initModules } from './modules.js';
import { initSecurity } from './security.js';

initMenu();
initScrollNav();
initForms();
initDemoModal();
initResetButton();
initHeroFlow();
initJourney();
initModules();
initSecurity();