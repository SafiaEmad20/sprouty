// What talks to the real backend (https://localhost:7092) and what is still mock data.
export const USE_MOCK_AUTH = false;         // LIVE: POST /api/auth/login, /register
export const USE_MOCK_PLANT_TYPES = false;  // LIVE: GET /api/plant-types, /api/plant-types/{id}
export const USE_MOCK = true;               // still mock: my plants, readings, status, notifications (no endpoints yet)
// "/api" is forwarded by proxy.conf.json to the backend. No CORS needed in development.
export const API_URL = '/api';
