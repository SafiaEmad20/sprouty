# 🌱 SPROUTY — Smart Plant Care Companion

> **From Seed to Need**

🚧 **Under Active Development** — DEPI Full Stack .NET Capstone Project

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
| Angular Frontend | ✅ Completed |
| REST API | ✅ Completed |
| Authentication (JWT + Forgot / Reset Password) | ✅ Completed |
| Plant Management (CRUD) | ✅ Completed |
| Sensor Readings & Plant Health Evaluation | ✅ Completed |
| Notifications | ✅ Completed |
| Frontend–Backend Integration | 🚧 In Progress (connecting the latest backend features) |
| ESP32 IoT Device | 🚧 In Progress (hardware components ready, firmware under development) |
| IoT–Backend–Frontend Integration | 🔜 Next step |
| Friendly Plant Voice Messages | 🚧 In Progress |

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
- 📖 OpenAPI / Swagger Documentation with JWT support
- 🔌 Device API for the ESP32 sensor device to send readings

**In progress / Planned**

- 📡 ESP32 IoT device sending live plant readings to the backend

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
| **Security** | JWT Bearer, BCrypt password hashing |
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

- 🔌 **ESP32 IoT Device**: sensors placed with the plant send readings to the backend automatically
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

Feature flags in `SproutyFrontend/src/app/core/config.ts` switch each area between mock data and the live API. See the [frontend README](SproutyFrontend/README.md) for details.

---

## IoT Device

SPROUTY includes an **ESP32-based IoT device** with sensors placed next to the plant. The hardware components are ready and the firmware is under development. Once connected, the device will send plant readings to the backend automatically, and the results will appear in the app as plant status and notifications.

---
## 📖 Documentation

Project documentation is available in the `Docs/` directory:

- **Product Definition** (`Docs/Product-Definition.pdf`)
- **Backend guide & API reference** ([`SproutyBackend/README.md`](SproutyBackend/README.md))
- **Frontend guide** ([`SproutyFrontend/README.md`](SproutyFrontend/README.md))
- **Live API documentation**: Swagger UI at `https://localhost:7092/swagger` while the API is running

---

# 🔮 Future Enhancements

- ⚛️ React Frontend
- ⚡ SignalR Real-Time Updates
- 📲 Push Notifications
- 🤖 AI-Based Plant Recommendations

---

# 👥 Team

Developed as a **DEPI Full Stack .NET Web Developer Capstone Project**.

| Name | Role |
|------|------|
| Sohila | Backend Developer & Product Lead |
| Ahmed | Backend Developer |
| Reem | Frontend Developer |
| safia | Frontend Developer |
| Abdelrahman | Embedded Systems / IoT |
| Mohamed | Embedded Systems / IoT |

---

# 📄 License

This project is developed for educational purposes as part of the **Digital Egypt Pioneers Initiative (DEPI)**.
