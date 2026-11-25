# Sprouty Frontend

Angular 20 frontend for Sprouty. The UI is English and follows the warm cream / forest-green design system from the approved reference screens. A persistent light/dark theme is available inside the authenticated app.

## Requirements
- Node.js 20.19+ or 22.12+
- .NET 10 backend running at `https://localhost:7092`

## Run locally
```powershell
npm ci
npm start
```
Open `http://localhost:4200`. The Angular dev-server proxy in `proxy.conf.json` forwards `/api` to `https://localhost:7092`; do not call the backend host directly from components.

## Backend integration
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- Plant types: `GET /api/plant-types`, `GET /api/plant-types/{id}`
- Plants: `GET /api/plants`, `GET /api/plants/{id}`, `POST /api/plants`, `PUT /api/plants/{id}`, `DELETE /api/plants/{id}`
- Readings: `GET /api/plants/{id}/latest`, `GET /api/plants/{id}/readings`, `POST /api/plants/{id}/readings`
- Notifications: `GET /api/notifications`, `GET /api/notifications/unread-count`, `PUT /api/notifications/{id}/read`, `PUT /api/notifications/read-all`, `DELETE /api/notifications/{id}`

All mock flags in `src/app/core/config.ts` are disabled. Manual readings include moisture, temperature, humidity and light. The UI accepts light as a percentage; the API adapter converts it to the backend LDR raw range 0–4095 and converts returned readings back to percentage (preferring `lightLevel` when the backend provides it).

The plant image field accepts a public HTTP(S) image URL up to 500 characters. There is no base64 or multipart upload because the current API contract does not provide an upload endpoint. Plant requirements and readings are mapped at the API boundary; the dashboard handles plants with no readings yet.

## Theme
The theme is managed by `src/app/core/theme.service.ts` and persisted in `localStorage` as `sprouty-theme`. Global colors are CSS variables in `src/styles.css`.

## Notes
The frontend source was statically updated against the available API contract review. Run `npm ci` and `npm run build` in the project environment, then verify API requests against the live backend and its current Swagger contract before merging. The backend itself is not included in this frontend package.
\n\n## v4 backend contract notes\nSee IMPLEMENTATION_NOTES.md for verified API routes and backend-only requirements (expanded plant catalog, photo uploads, profile editing, and sensor security).\n