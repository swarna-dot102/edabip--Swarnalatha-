/* Data loading: every JSON file in /data is fetched through one function. */

/* Demo only: makes the "Loading…" state visible. Set to 0 before final submission. */
const DEMO_DELAY_MS = 0;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchList(path) {
  await wait(DEMO_DELAY_MS);
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load ${path} (status ${response.status}).`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`${path} does not contain a list.`);
  }
  return data;
}

export const loadSources = () => fetchList('data/sources.json');
export const loadStages = () => fetchList('data/stages.json');
export const loadModules = () => fetchList('data/modules.json');
export const loadPillars = () => fetchList('data/pillars.json');