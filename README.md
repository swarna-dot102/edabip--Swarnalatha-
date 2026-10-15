# EDABIP – Enterprise Data Analytics & Business Intelligence Platform

A responsive landing page for a business intelligence platform, built with plain HTML, CSS and JavaScript (no frameworks or libraries).

![EDABIP home page](assets/screenshot-task1.png)
<!-- TODO (Day 3): replace with a new Task 2 screenshot, saved as assets/screenshot-task2.png -->

## Features
- Page content loaded from JSON files with `fetch` and `async/await`, with loading, error (with "Try again") and empty states
- Sticky header with smooth-scroll navigation; the link of the section you are reading is highlighted (IntersectionObserver)
- **Request Demo** dialog with field-by-field validation and a success message
- Newsletter form with email validation (empty, wrong format, already subscribed)
- Interactive data-flow demo in the hero, "How it works" tabs (arrow keys), module search and filter, security accordion
- The page remembers your actions after a refresh (localStorage)
- Mobile hamburger menu; responsive layout; keyboard accessible
- Code split into ES modules

## How to run
ES modules and `fetch` do **not** work when you double-click `index.html`. Use a local server:

**Option 1 – VS Code Live Server**
1. Open the folder in VS Code.
2. Right-click `index.html` and choose **Open with Live Server**.

**Option 2 – Python**
```bash
python -m http.server 8000
```
Then open http://localhost:8000

No installation or build step is needed.

## Project structure
```
index.html
css/
  style.css
js/
  main.js          entry point
  api.js           fetches the JSON files
  status.js        loading / error / empty states
  dom.js           shared DOM helpers
  storage.js       safe localStorage helpers
  validators.js    form validation rules
  form-utils.js    shows a validation message for one field
  menu.js          mobile hamburger menu
  scroll-nav.js    smooth scroll + active link on scroll
  demo-modal.js    Request Demo dialog
  forms.js         newsletter form and login dialog
  reset.js         "Reset saved data" button
  hero-flow.js     interactive data-flow demo
  journey.js       "journey" tabs
  modules.js       module search + filter
  security.js      security accordion
data/
  sources.json  stages.json  modules.json  pillars.json
assets/
  icons.svg  logo.svg  screenshot-task1.png
```

## What each module does
| File | Responsibility |
|---|---|
| `main.js` | Imports every part of the page and starts it |
| `api.js` | One `fetchList` function that loads and checks a JSON file; one small loader per data file |
| `status.js` | `loadSection` shows "Loading…", then renders the data, or shows an empty or error message with a retry button |
| `dom.js` | `$`, `escapeHtml`, `icon`, `setMessage`, `animateNumber`, `enableBackdropClose` used by many modules |
| `storage.js` | `loadState`, `saveState`, `removeState`, `clearAllState`. Every call is in `try/catch`, so the page still works if storage is blocked or full |
| `validators.js` | One function per rule (`validateEmail`, `validateName`, `validateCompany`,