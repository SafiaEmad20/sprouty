# Sprouty Backend 🌱

The backend service for **Sprouty**, a smart plant-care companion that turns raw sensor values into simple, human-friendly plant health messages.

Built with **ASP.NET Core Web API (.NET 10)**, **Entity Framework Core**, and **SQL Server**, following **Clean Architecture**.

---

## 📌 What the Backend Does

- Registers and authenticates users with **JWT**, including a **forgot / reset password** flow by email.
- Lets each user manage **their own plants** (create, read, update, delete).
- Provides a library of **plant types** with their ideal care ranges.
- Accepts **sensor readings** for a plant and automatically **evaluates the plant's health** against its type's ideal ranges.
- Creates **notifications** when a plant needs attention, without sending the same alert twice.
- Exposes a **device API** so the ESP32 IoT device can send live readings.
- Returns a consistent JSON **error format** with the right HTTP status code for every failure.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Language | C# |
| Framework | ASP.NET Core Web API (.NET 10) |
| ORM | Entity Framework Core 10 |
| Database | SQL Server (LocalDB for development) |
| Authentication | JWT Bearer, BCrypt password hashing |
| Email | MailKit (SMTP) |
| API Documentation | OpenAPI + Swagger UI |
| Architecture | Clean Architecture |
| Version Control | Git & GitHub (feature branches + pull requests) |

---

## 🏗️ Architecture

```text
Sprouty.Api             → Controllers, middleware, startup (Presentation)
      │
Sprouty.Application     → Services, DTOs, interfaces, exceptions (Use Cases)
      │
Sprouty.Domain          → Entities and enums (Business Rules)
      │
Sprouty.Infrastructure  → EF Core DbContext, repositories, migrations, email (Persistence)
```

- **Controllers** stay thin: they read the user ID from the JWT and call a service.
- **Services** hold the business logic and validation, and throw typed exceptions.
- **Repositories** are the only layer that talks to the database.
- **ExceptionHandlingMiddleware** converts typed exceptions into HTTP responses.

### Project Structure

```text
SproutyBackend/
├── SproutyBackend.slnx
└── src/
    ├── Sprouty.Api/
    │   ├── Controllers/       Auth, Plants, PlantReadings, PlantTypes, Sensors, Notifications
    │   ├── Middleware/        ExceptionHandlingMiddleware
    │   └── Program.cs
    ├── Sprouty.Application/
    │   ├── DTOs/              Auth, Plants, PlantTypes, Readings, Sensors, Notifications
    │   ├── Exceptions/        Validation, NotFound, Conflict, SensorOffline
    │   ├── Interfaces/
    │   └── Services/
    ├── Sprouty.Domain/
    │   ├── Entities/
    │   └── Enums/
    └── Sprouty.Infrastructure/
        ├── Migrations/
        ├── Persistence/       AppDbContext + entity configurations + seed data
        ├── Repositories/
        ├── Services/          JWT token, email
        └── Settings/
```

---

## 🗄️ Database

| Table | Purpose |
|---|---|
| `users` | User accounts (hashed passwords, role) |
| `plants` | Plants owned by users |
| `plant_types` | Plant types (Basil, Mint, Flowers, Generic are seeded) |
| `plant_requirements` | Ideal moisture, temperature, humidity and light ranges per type |
| `sensors` | Sensors linked to plants (`Active` / `Offline`) |
| `sensor_readings` | Recorded sensor measurements |
| `plant_statuses` | History of computed plant statuses |
| `notifications` | Alerts for plants that need attention |
| `password_reset_tokens` | Hashed, time-limited password reset tokens |

**Delete behaviour:** deleting a plant also deletes its sensors, readings, status history and notifications (cascade delete).

**Migrations:** `InitialCreate`, `UpdatePlantLightRanges`, `AddPasswordResetTokens`.

---

## 🚀 Getting Started

### Prerequisites

- .NET 10 SDK
- Visual Studio 2022+ with the **ASP.NET and web development** workload
- SQL Server LocalDB (installed with Visual Studio)

### 1. Clone and open

```bash
git clone https://github.com/SafiaEmad20/sprouty.git
```

Open `SproutyBackend/SproutyBackend.slnx` in Visual Studio and set **Sprouty.Api** as the startup project.

### 2. Database connection

`Sprouty.Api/appsettings.json` already points to LocalDB:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=SproutyDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Change the server name only if you use a different SQL Server instance.

### 3. Add the secrets (required)

Secrets are **not** stored in the repository. Each developer adds them locally with **User Secrets**:

Right-click **Sprouty.Api** → **Manage User Secrets**, then paste:

```json
{
  "Jwt": {
    "Key": "<a random string of at least 32 characters>"
  },
  "EmailSettings": {
    "Username": "<smtp username, e.g. a Gmail address>",
    "Password": "<smtp password, e.g. a Gmail app password>",
    "FromEmail": "<sender email address>"
  }
}
```

- `Jwt:Key` is **required**: the API will not start without it.
- `EmailSettings` is needed only to send password reset emails. Everything else works without it.
- `Frontend:BaseUrl` in `appsettings.json` (default `http://localhost:4200`) is the address used in the password reset link. Change it when the frontend runs elsewhere.

### 4. Create the database

In **Tools → NuGet Package Manager → Package Manager Console**, run:

```powershell
Update-Database -Project Sprouty.Infrastructure -StartupProject Sprouty.Api
```

Or with the .NET CLI:

```bash
dotnet ef database update --project src/Sprouty.Infrastructure --startup-project src/Sprouty.Api
```

### 5. Run the API

Run the **https** profile from Visual Studio (or press **Ctrl + F5** to run without the debugger).

| | URL |
|---|---|
| API (HTTPS) | `https://localhost:7092` |
| API (HTTP) | `http://localhost:5170` |
| Swagger UI | `https://localhost:7092/swagger` |

### 6. Try it in Swagger

1. `POST /api/auth/register` (or `login`) and copy the `token` from the response.
2. Click **Authorize** and paste the token.
3. `GET /api/plant-types` and copy a plant type `id`.
4. `POST /api/plants` to add a plant; the response includes its `id` and its `sensorId`.
5. `POST /api/plants/{plantId}/readings` with a reading such as `{ "moisture": 20, "temperature": 22, "humidity": 50, "light": 1500 }`. The plant status becomes `NeedsWater` and a notification is created.
6. `GET /api/notifications` to see the alert.

> **Tip:** if the first request after a long pause returns 500 with a "transient failure" message, send it again. LocalDB stops when idle and the first connection can time out.

---

## 📡 API Reference

🔒 = requires `Authorization: Bearer <token>`. Users can only see and change **their own** data; any other user's plant or notification returns **404**.

### Auth: `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create an account (`name`, `email`, `password` with at least 8 characters). Returns a JWT. |
| POST | `/login` | Log in. Returns a JWT (valid for 60 minutes). |
| POST | `/forgot-password` | Sends a reset link by email (valid for 15 minutes, single use). The link opens the frontend page `{Frontend:BaseUrl}/reset-password?token=…&email=…`. Always returns the same message, so it does not reveal whether the email exists. |
| POST | `/reset-password` | Sets a new password (`email`, `token`, `newPassword`, `confirmPassword`). An invalid, expired or already used token returns **400**. |

### Plant Types: `/api/plant-types`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | All plant types with their ideal ranges. |
| GET | `/search?q=min` | Search by English or Arabic name (or category from 3 letters), best matches first. Works from the first letter and forgives a small typo (`mnit` → Mint, `نعنع` → نعناع). Ignores Arabic diacritics and أ/إ/آ, ة/ه, ى/ي differences. No `q` returns all types. |
| GET | `/{id}` | One plant type. |

### Plants 🔒: `/api/plants`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/?search=min` | The current user's plants, newest first. Optional `search` filters by nickname or plant type name with the same smart matching as plant type search. |
| GET | `/{id}` | One plant. |
| POST | `/` | Add a plant (`plantTypeId`, `nickname`, optional `imageUrl`). A sensor is created for it automatically. Returns **201**. |
| PUT | `/{id}` | Update a plant. **Changing the plant type clears the plant's old readings, status history and notifications** so the plant starts fresh with the new type's ranges. Changing only the name or image keeps all data. |
| DELETE | `/{id}` | Delete a plant with its sensors, readings, statuses and notifications. Returns **204**. |

Validation: `nickname` is required (1–100 characters). `imageUrl` is optional; if sent it must be a valid `http://` or `https://` link of 500 characters or fewer.

### Plant Readings 🔒: `/api/plants/{plantId}`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readings?limit=100` | Reading history, oldest → newest (`limit` from 1 to 1000, default 100). |
| GET | `/latest` | Latest reading, the plant type's ideal ranges, and the latest computed status. |
| POST | `/readings` | Add a reading (`moisture`, `temperature`, `humidity`, `light`, **all four required**). It is saved on the plant's **active** sensor, the plant status is computed, and a notification is created if needed. Returns **201** with the reading and status. |

Reading ranges: moisture and humidity 0–100 (%), temperature −40 to 85 (°C), light 0–4095 (raw LDR value, higher = darker). A missing value returns **400**. Every reading in a response also has `lightLevel`: the light as a percentage (0 = dark, 100 = bright), the same unit as the plant type's `minLight`/`maxLight`. All dates are UTC and end with `Z`.

### Notifications 🔒: `/api/notifications`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/?unreadOnly=false` | The user's notifications, newest first (`unreadOnly=true` returns unread only). |
| GET | `/unread-count` | `{ "unreadCount": n }` for the notification badge. |
| PATCH / PUT | `/{id}/read` | Mark one notification as read. |
| PATCH / PUT | `/read-all` | Mark all as read. Returns `{ "markedCount": n }`. |
| DELETE | `/{id}` | Delete a notification. Returns **204**. |

### Sensors (device endpoints): `/api/sensors`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/{sensorId}/readings` | Send a reading directly from a sensor device (e.g. ESP32). |
| POST | `/{sensorId}/process` | Compute the plant status from the sensor's latest reading. |

### Plant Status Values

Statuses are returned as names (for example `"status": "NeedsWater"`):

| Value | Status | Meaning |
|---|---|---|
| 0 | NoData | No readings yet |
| 1 | Healthy | Everything is within range |
| 2 | NeedsWater | Soil is too dry |
| 3 | OverWatered | Soil is too wet |
| 4 | TooHot | Temperature is too high |
| 5 | TooCold | Temperature is too low |
| 6 | NeedsLight | Not enough light |
| 7 | AirTooDry | Humidity is too low |
| 8 | AirTooHumid | Humidity is too high |

A notification is created only when the status **changes** to one that needs attention, so the same alert is not repeated.

### Error Responses

Errors from the business rules return:

```json
{ "title": "Bad Request", "status": 400, "detail": "Image URL must be a valid link that starts with http:// or https://." }
```

Missing or invalid fields (model validation) return the standard ASP.NET shape with an `errors` object, for example `{ "status": 400, "errors": { "Humidity": ["Humidity is required."] } }`.

| Status | When |
|---|---|
| 400 | Invalid input (validation rules, invalid JSON, unknown plant type, out-of-range values) |
| 401 | Missing, invalid or expired token; wrong email or password |
| 404 | The item does not exist or does not belong to the current user |
| 409 | Conflict (e.g. email already registered) or the plant's sensor is offline |
| 500 | Unexpected server error |

---

## ✅ Implementation Status

- [x] Clean Architecture solution, domain model, EF Core configurations and migrations
- [x] Seed data for plant types and their requirements
- [x] JWT authentication (register / login)
- [x] Forgot / reset password by email
- [x] Plant types API
- [x] Plant CRUD (per user, with automatic sensor creation)
- [x] Sensor reading ingestion and plant health evaluation
- [x] Reading history and latest reading endpoints
- [x] Notifications (list, unread count, mark read, mark all read, delete)
- [x] Smart plant search (Arabic and English, typo tolerant)
- [x] Centralized exception handling with consistent error responses
- [x] CORS policy for the frontend, UTC dates, enums as names
- [x] Swagger UI with JWT support
- [x] All endpoints tested manually in Swagger, including invalid inputs and unauthorized access

## 🗺️ Planned / Known Limitations

- **Plant voice:** status messages are currently short English sentences; friendly first-person messages (e.g. *"I'm a little thirsty"*) are planned.
- **IoT integration:** the ESP32 firmware is under development; connecting it to the device API is the next step.
- **Sensor offline detection:** sensors are not yet marked `Offline` automatically, and the device endpoints (`/api/sensors`) are not yet protected by a device key.
- **Status history endpoint:** statuses are stored but not yet exposed through an endpoint.
- **Plant images:** an image upload endpoint is planned; today `imageUrl` accepts links only.
- **Plant type care details** (care notes, care steps, sun schedule) and **admin management** endpoints are planned.
- **CORS:** allowed origins are set in `appsettings.json` → `Cors:AllowedOrigins` (default `http://localhost:4200`); add the deployed frontend address there. Locally the Angular dev server proxies `/api`, so CORS is not needed in development.

---

## 📡 IoT Device Integration

Sprouty includes an **ESP32-based IoT device** with sensors placed next to the plant. The hardware components are ready and the firmware is being developed by the IoT team.

- The device will send its readings to the backend automatically through the **device API** (`/api/sensors`).
- Each plant gets its own sensor record when it is added, and the device identifies itself with that **sensor ID**.
- The backend then evaluates the plant's health and creates notifications, exactly as it does for manual readings.

A detailed device integration guide will be added once the firmware is connected.

---

## 🔗 Frontend Integration

The Angular client in `SproutyFrontend` calls the API through `/api` and uses the dev proxy (`proxy.conf.json` → `https://localhost:7092`). Feature flags in `SproutyFrontend/src/app/core/config.ts` switch each area between mock data and the live API. See the frontend README for details.

---

**Sprouty Backend**: helping plants grow, one step at a time. 🌱
