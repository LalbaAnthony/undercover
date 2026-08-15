export const VITE_APP_SHORT_NAME = 'Undercover';
export const VITE_APP_NAME = 'Undercover';
export const VITE_APP_COMPANY_NAME = 'Undercover';
export const VITE_APP_AUTHOR_NAME = 'Anthony Lalba';
export const VITE_APP_DESCRIPTION = 'Undercover';
export const VITE_APP_THEME_COLOR = '0E133C';
export const VITE_APP_BG_COLOR = '0E133C';
export const VITE_URL = 'http://localhost:5173';
export const VITE_GIT_REPO = 'https://github.com/LalbaAnthony/undercover';
// Tracks package.json, so it cannot be hardcoded: vite.config.js assigns it to
// process.env, which is what makes it reach import.meta.env in the client.
// The optional chaining is required, not defensive: vite.config.js imports this
// same file and Node executes it, where import.meta.env does not exist.
export const VITE_APP_VERSION = import.meta.env?.VITE_APP_VERSION;
