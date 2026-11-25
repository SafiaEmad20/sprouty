# 🌱 SPROUTY — Smart Plant Care Companion

> **From Seed to Need**

🚧 **Under Active Development** — DEPI Full Stack .NET Capstone Project

| | |
|---|---|
| **Project Name** | SPROUTY — Smart Plant Care Companion |
| **Program** | Digital Egypt Pioneers Initiative (DEPI) — Capstone Project |
| **Track** | Software Development — Full Stack .NET Web Developer |
| **Company** | YAT Learning |
| **Group** | YAT849A_CAI5_SWD5_S8_DEPI5 |
| **Instructor** | Ayed Ali Ayed |
| **Team Members** | [6 members](#-team-members) |
| **Work Plan** | [See Work Plan](#-work-plan) |
| **KPIs** | [See KPIs](#-kpis) |
| **Project Files** | [See Project Files](#-project-files) |

---

# 💡 Project Idea

SPROUTY is a full-stack web application that helps beginner plant owners understand and care for their plants through simple, human-friendly messages instead of raw sensor values.

Instead of displaying technical readings like:

> **Soil Moisture: 18%**

SPROUTY translates them into meaningful messages such as:

> 🌿 *"I'm a little thirsty."*

The system allows users to register their plants, monitor their health, receive care notifications, and track plant history through an intuitive dashboard. Plant readings come from an **ESP32-based IoT device** placed with the plant, or can be entered manually.

The project follows **Clean Architecture** and is built with **ASP.NET Core Web API**, **Angular**, **Entity Framework Core**, **SQL Server**, and an **ESP32 IoT device**.

---

# 📊 Project Status

| Module | Status |
|---------|--------|
| Domain Model | ✅ Completed |
| Database Design & Migrations | ✅ Completed |
| REST API | ✅ Completed |
| Authentication (JWT + Forgot / Reset Password) | ✅ Completed |
| Plant Management (CRUD) | ✅ Completed |
| Sensor Readings & Plant Health Evaluation | ✅ Completed |
| Notifications | ✅ Completed |
| Typo-Tolerant Plant Search (API) | ✅ Completed |
| Angular Frontend | ✅ Completed (refreshed UI with light / dark mode) |
| Frontend–Backend Integration | ✅ Completed (all screens use the live API, mock data turned off) |
| ESP32 IoT Device | 🚧 In Progress (device sends readings over USB; firmware not yet in this repository) |
| IoT–Backend Integration | 🚧 In Progress (USB readings are saved to a configured plant every 30 seconds) |
| Friendly Plant Voice Messages | 🚧 In Progress |
| End-to-End Testing (device → API → app) | 🔜 Next step |

---

# ✨ Features

**Available now**

- 🔐 JWT Authentication with Forgot / Reset Password by email
- 🌱 Plant Management: each user manages their own plants
- 🌿 Plant Types & Care Requirements (ideal moisture, temperature, humidity and light ranges)
- 📊 Sensor Readings with history and latest reading
- 💬 Automatic Plant Health Evaluation (e.g. *Needs Water*, *Too Hot*, *Needs Light*)
- 🔔 Notifications with unread count, mark as read and mark all as read
- 🛡️ Consistent error handling (400 / 401 / 404 / 409) and per-user data protection
- 🔍 Typo-tolerant plant search in English and Arabic (e.g. *mnit* finds *Mint*)
- 💡 Light shown as a percentage (`lightLevel`) next to the raw sensor value
- 🌗 Light and dark mode, profile and settings pages
- 📖 OpenAPI / Swagger Documentation with JWT support
- 🔌 Device input: HTTP device API, plus a USB serial reader that saves ESP32 readings automatically

**In progress / Planned**

- 📡 ESP32 IoT device sending live plant readings end to end
- 🗣️ Friendly first-person plant voice messages
- 📈 Plant Status History view
- 👤 Admin Management

---

# 🏗 Architecture

The backend follows the **Clean Architecture** pattern.

```text
Presentation (API)
        │
Application (Use Cases)
        │
Domain (Business Rules)
        │
Infrastructure (EF Core + SQL Server)
```

---

# 📂 Repository Structure

```text
sprouty/
│
├── Docs/
│   └── Product-Definition.pdf
│
├── SproutyBackend/
│   ├── SproutyBackend.slnx
│   └── src/
│       ├── Sprouty.Api/
│       ├── Sprouty.Application/
│       ├── Sprouty.Domain/
│       └── Sprouty.Infrastructure/
│
├── SproutyFrontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
```

- **Docs** – Project documentation, including the Product Definition.
- **SproutyBackend** – ASP.NET Core Web API solution following Clean Architecture.
- **SproutyFrontend** – Angular 20 client application.
- **README.md** – Main project overview and setup guide.

Each project contains its own dedicated README with setup instructions.

---

# 🛠 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | ASP.NET Core Web API (.NET 10), C#, Entity Framework Core, SQL Server |
| **Frontend** | Angular 20, TypeScript, HTML5, CSS3, RxJS |
| **Architecture** | Clean Architecture |
| **Security** | JWT Bearer, PBKDF2 password hashing (ASP.NET Core Identity `PasswordHasher`) |
| **IoT** | ESP32 microcontroller with plant sensors |
| **Documentation** | OpenAPI / Swagger |
| **Tools** | Git, GitHub |

---

# 🌿 System Workflow

1. The user creates an account.
2. The user adds one or more plants.
3. Each plant belongs to a plant type with predefined care requirements, and gets its own sensor automatically.
4. Sensor readings are sent by the ESP32 IoT device, or entered manually.
5. The backend evaluates the readings against the plant's recommended ranges.
6. A human-friendly plant status is generated.
7. Notifications are created whenever attention is needed.
8. The user can review previous readings and plant history at any time.

---

# 📡 Data Sources

Plant readings can come from:

- 🔌 **ESP32 IoT Device**: sensors placed with the plant send readings to the backend automatically (over USB serial, or through the HTTP device API)
- ✍️ **Manual Input**: readings entered through the app, so SPROUTY can also be used without hardware
- 📊 **Dataset Import** (planned)

---

# 🚀 Getting Started

## Prerequisites

- .NET 10 SDK
- SQL Server (LocalDB is enough for development)
- Node.js and Angular CLI

---

## Clone the Repository

```bash
git clone https://github.com/SafiaEmad20/sprouty.git
cd sprouty
```

---

## Backend

```bash
cd SproutyBackend

dotnet restore

# Required secret (the API will not start without it)
dotnet user-secrets set "Jwt:Key" "<a random string of at least 32 characters>" --project src/Sprouty.Api

dotnet ef database update --project src/Sprouty.Infrastructure --startup-project src/Sprouty.Api

dotnet run --project src/Sprouty.Api --launch-profile https
```

- API: `https://localhost:7092`
- Swagger UI: `https://localhost:7092/swagger`

Email settings for password reset, the full API reference and a step-by-step Swagger guide are in [`SproutyBackend/README.md`](SproutyBackend/README.md).

---

## Frontend

```bash
cd SproutyFrontend

npm install

ng serve
```

The application runs on:

```
http://localhost:4200
```

Start the backend first. In development, the Angular dev server proxies `/api` to `https://localhost:7092`, so no CORS setup is needed.

All feature flags in `SproutyFrontend/src/app/core/config.ts` are off, so every screen uses the live API. See the [frontend README](SproutyFrontend/README.md) for details.

---

## IoT Device

SPROUTY includes an **ESP32-based IoT device** with sensors placed next to the plant. The device sends its readings as JSON lines over USB. Inside the API, two background services handle them:

1. `SerialSensorReaderService` reads the USB port and keeps the latest reading.
2. `SerialReadingPersistenceService` saves that reading to one plant every 30 seconds, so the plant status and notifications update automatically.

To use it, set these values in `SproutyBackend/src/Sprouty.Api/appsettings.json` (or in User Secrets):

```json
"SerialPort":      { "PortName": "COM3", "BaudRate": 115200 },
"SerialIngestion": { "Enabled": true, "PlantId": "<plant id>", "UserId": "<owner user id>", "IntervalSeconds": 30 }
```

While `PlantId` and `UserId` are empty, the readings are not saved.

---
# 📁 Project Files

All project files are stored directly in this repository.

| File / Folder | Contents |
|---|---|
| [`Docs/Product-Definition.pdf`](Docs/Product-Definition.pdf) | Product Definition: vision, personas, user journey, MVP scope, plant voice guide, architecture, risks, success metrics and roadmap |
| [`SproutyBackend/`](SproutyBackend/) | ASP.NET Core Web API source code (Clean Architecture) |
| [`SproutyBackend/README.md`](SproutyBackend/README.md) | Backend setup guide and full API reference |
| [`SproutyFrontend/`](SproutyFrontend/) | Angular 20 client source code |
| [`SproutyFrontend/README.md`](SproutyFrontend/README.md) | Frontend setup guide |
| Swagger UI | Live API documentation at `https://localhost:7092/swagger` while the API is running |

The ESP32 device firmware will be added to this repository once it is completed.

---

# 🔮 Future Enhancements

- ⚛️ React Frontend
- ⚡ SignalR Real-Time Updates
- 📲 Push Notifications
- 🤖 AI-Based Plant Recommendations

---

# 👥 Team Members

Developed as a **DEPI Full Stack .NET Web Developer Capstone Project** at **YAT Learning**.

- Sohila Ismail Mohamed
- Ahmed Farag
- Safia Emad Mohamed
- Reem Ahmed
- Abdelrahman Ashraf
- Mohamed Ahmed

---

# 🎓 Instructor

**Ayed Ali Ayed** — YAT Learning, Digital Egypt Pioneers Initiative (DEPI)

---

# 🗓 Work Plan

| # | Phase | Scope | Timeline | Status |
|---|---|---|---|---|
| 1 | Discovery | User survey (40 respondents), results analysis and competitor research | Before Sep 2026 | ✅ Done |
| 2 | Phase 0 — Planning | Product definition, personas, user journey, MVP scope and tech stack | 26 Sep – 3 Oct 2026 | ✅ Done |
| 3 | Project Setup | Repository, Clean Architecture backend, domain model, database migrations, Angular app | 11 – 19 Oct 2026 | ✅ Done |
| 4 | Authentication | JWT authentication, global error handling, frontend login / register connected to the API | 22 – 25 Oct 2026 | ✅ Done |
| 5 | Core Backend Features | Plant types API, sensor reading processing and plant health evaluation | 24 – 30 Oct 2026 | ✅ Done |
| 6 | Plants, Readings & Notifications | Plant CRUD, reading history, notifications, validation and testing | 15 – 16 Nov 2026 | ✅ Done |
| 7 | Account Recovery | Forgot / reset password by email | 18 Nov 2026 | ✅ Done |
| 8 | Frontend Integration & UI | Live API on every screen, reset-password page, refreshed UI with light / dark mode, profile and settings | 15 – 25 Nov 2026 | ✅ Done |
| 9 | Integration Fixes & Search | Enum names, UTC dates, CORS, required readings, light percentage, typo-tolerant search, safer password reset | 24 Nov 2026 | ✅ Done |
| 10 | IoT Device | ESP32 hardware and firmware; USB serial reader and automatic saving of readings | Nov 2026 | 🚧 In Progress |
| 11 | End-to-End Integration | Device → API → app working together on one machine | Upcoming | 🔜 Next |
| 12 | Testing & Improvement | Unit tests, internal testing and bug fixing | Upcoming | 🔜 Planned |
| 13 | User Testing | Trial with 5–10 real users from the target group (ages 18–25) | Upcoming | 🔜 Planned |
| 14 | Final Delivery | Documentation, presentation and demo | Dec 2026 | 🔜 Planned |

---

# 📈 KPIs

Success metrics defined in the Product Definition for the MVP:

| KPI | Target |
|---|---|
| Time for a new user to add their first plant | Less than **2 minutes** |
| Sensor readings delivered successfully to the app | At least **90%** |
| Clarity of plant status | Users understand their plant's condition **without seeing a single technical number** |
| Daily engagement | Users open the app **at least once a day** during the first two weeks |
| User satisfaction | Positive feedback from a test group of **5–10 real users** after two weeks of use |

---

# 📄 License

This project is developed for educational purposes as part of the **Digital Egypt Pioneers Initiative (DEPI)**.
