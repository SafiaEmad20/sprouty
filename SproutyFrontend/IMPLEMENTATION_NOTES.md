# Sprouty Frontend UX Refresh v4 — implementation notes

## Frontend changes
- Kept the v3 Angular structure, routes, authentication flow, profile/settings/logout, and public theme toggle.
- Corrected plant-type search: the supplied backend has no `/api/plant-types/search` route, so search now filters the real `/api/plant-types` response in the browser.
- Corrected My Plants search: the supplied `GET /api/plants` controller does not accept a search query, so filtering is now local after loading the authenticated user's real plant list.
- Replaced broad repeated fallback-photo behavior with a per-plant-type image catalog and kept the user's saved `imageUrl` as the highest priority.
- Clarified non-specific seeded types in the UI: `Flowers` is displayed as `Flowering plant`; `Generic` as `Other plant`. Their backend IDs are unchanged.
- Improved responsive plant card sizing, text contrast in dark mode, plant-library layout, add-plant wizard spacing, and recovery button states.
- Add Plant continues to save only an HTTP(S) image URL (maximum 500 characters), which is the current backend contract.

## Verified backend contract from the supplied source
- Plant types: `GET /api/plant-types` and `GET /api/plant-types/{id}`. No search endpoint exists in this backend snapshot.
- Plants: authenticated `GET /api/plants`, `GET /api/plants/{id}`, `POST /api/plants`, `PUT /api/plants/{id}`, `DELETE /api/plants/{id}`. The list endpoint has no search parameter.
- Plant readings: authenticated `GET /api/plants/{plantId}/readings`, `GET /api/plants/{plantId}/latest`, `POST /api/plants/{plantId}/readings`; payload requires moisture, temperature, humidity, and light.
- Notifications: authenticated list/unread-count/read/read-all/delete routes. PUT is supported for read and read-all.
- Auth: register/login/forgot-password/reset-password endpoints exist. Runtime email delivery and reset-link configuration still require live testing.
- ESP32 ingestion: `POST /api/sensors/{sensorId}/readings` and `POST /api/sensors/{sensorId}/process` exist in the supplied code. This does not prove the physical ESP32 is connected or sending valid data.

## Backend limitations — not changed in this frontend-only v4
1. Plant type seed data contains only Basil, Mint, Flowers, and Generic. A curated 12–15-species library with correct care ranges requires backend seed/configuration and database migration changes. This frontend does not invent additional plant IDs or care requirements.
2. The backend accepts `imageUrl` only; it has no multipart image-upload endpoint or image-storage service. Device photo upload cannot be persisted until backend support is added.
3. Profile is read-only because no profile-update endpoint exists.
4. The supplied SensorsController has no `[Authorize]` attribute. Review sensor authentication/device authorization before production deployment.
5. Backend and ESP32 runtime integration, actual database contents, email delivery, and live sensor telemetry have not been exercised by a source-only review.

## Validation
- The v3 package built successfully on the user's Windows machine before these v4 changes.
- Run `npm ci`, `npm run build -- --configuration development`, then test with the backend running. This package was assembled from source and still needs that local build/runtime verification.
