/* Entry point: starts every part of the page. */
import { initMenu } from './menu.js';
import { initHeroFlow } from './hero-flow.js';
import { initJourney } from './journey.js';
import { initModules } from './modules.js';
import { initSecurity } from './security.js';
import { initForms } from './forms.js';

initMenu();
initForms();
initHeroFlow();
initJourney();
initModules();
initSecurity();