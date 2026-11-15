# Sprouty Frontend (Angular 20)

## Run
    npm install
    ng serve        # http://localhost:4200
Login/Register talk to the REAL backend (password min 8 characters). Start the backend first (https://localhost:7092), or set `USE_MOCK_AUTH = true` in `src/app/core/config.ts` to log in without it.

## What is live and what is mock
Flags are in `src/app/core/config.ts`:

| Feature | Flag | State |
|---|---|---|
| Login / Register | `USE_MOCK_AUTH = false` | LIVE (`/api/auth/*`) |
| Plant library + plant details | `USE_MOCK_PLANT_TYPES = false` | LIVE (`/api/plant-types`) |
| My plants, readings, status, alerts | `USE_MOCK = true` | mock (no backend endpoints yet). Plants are saved per account in the browser (localStorage), so a new account starts empty. |

Start the backend first (https://localhost:7092). To work without it set `USE_MOCK_AUTH` and `USE_MOCK_PLANT_TYPES` to `true`.
Development uses `proxy.conf.json` (`/api` -> https://localhost:7092), so CORS is not needed locally.
Real plant types have no care notes/steps/sun schedule yet, so those sections hide until the backend adds them.
Status values: `core/status.ts` -> `normalizeStatus()` accepts the backend enum as a number or a name (OverWatered -> TooMuchWater).

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
