# Sprouty Frontend (Angular 20)

## Run
    npm install
    ng serve        # http://localhost:4200
Login/Register talk to the REAL backend (password min 8 characters). Start the backend first (https://localhost:7092), or set `USE_MOCK_AUTH = true` in `src/app/core/config.ts` to log in without it.

## Mock vs real API
`src/app/core/config.ts`: `USE_MOCK_AUTH = false` (auth is live). `USE_MOCK = true` keeps plants/readings/notifications on mock data until those endpoints exist.
Development uses `proxy.conf.json` (`/api` -> https://localhost:7092), so CORS is not needed locally. Production needs CORS on the backend.
Only the services in `src/app/services` and `core/auth.service.ts` talk to the API/mock.
Mock data lives in `src/app/mock/mock-data.ts`.

## Backend must provide
JWT auth, CORS for http://localhost:4200, Swagger, DTOs in camelCase, plus:
- care_notes, care_steps, sun_schedule on plant_types
- GET /plants/{id}/latest -> { reading, status, requirement } (status computed by backend)
- status_type / notification type as fixed enum values (see models/index.ts)
- POST /readings, GET /notifications, PUT /notifications/{id}/read

## Structure
core/ (auth, guard, interceptor, config) · models/ · mock/ · services/ · shared/ (navbar, gauge, history-chart) · features/ (pages)

## Sensors
The frontend uses 3 sensors only: moisture (water), temperature, light. Humidity was removed from models/UI; the backend ERD still has humidity columns, so agree with the team whether to drop them.

## Home page background photo
Drop your own photo at `public/images/hero.jpg` (landscape, ~1600px wide). If it is missing, the built-in `hero.svg` illustration is used.

## Plant photos
The add-plant form resizes the photo in the browser and sends it as `imageUrl` (base64). For the real backend, agree on an image upload endpoint (multipart) instead and store a URL.
