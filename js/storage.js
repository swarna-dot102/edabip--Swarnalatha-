/* localStorage helpers. Every call is wrapped in try/catch, because storage can be
   blocked (private mode), full, or hold broken data. On failure we fall back quietly. */

const PREFIX = 'edabip:';

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

/* Returns true when the value was saved. */
export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

export function removeState(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    return false;
  }
}

export function clearAllState() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    return false;
  }
}