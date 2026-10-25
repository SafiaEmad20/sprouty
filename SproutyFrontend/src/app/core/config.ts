// Auth is LIVE on the backend; the other endpoints are not built yet, so they stay on mock data.
export const USE_MOCK_AUTH = false;   // set true to log in without the backend
export const USE_MOCK = true;         // plants, readings, notifications -> set false per feature as the backend adds them
// "/api" is forwarded by proxy.conf.json to the backend (https://localhost:7092). No CORS needed in development.
export const API_URL = '/api';
