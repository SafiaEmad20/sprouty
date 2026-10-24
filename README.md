# 🌱 SPROUTY — Smart Plant Care Companion

> **From Seed to Need**

🚧 **Under Active Development** — DEPI Full Stack .NET Capstone Project

SPROUTY is a full-stack web application that helps beginner plant owners understand and care for their plants through simple, human-friendly messages instead of raw sensor values.

Instead of displaying technical readings like:

> **Soil Moisture: 18%**

SPROUTY translates them into meaningful messages such as:

> 🌿 *"I'm a little thirsty."*

The system allows users to register their plants, monitor their health, receive care notifications, and track plant history through an intuitive dashboard.

The project follows **Clean Architecture** and is built with **ASP.NET Core Web API**, **Angular**, **Entity Framework Core**, and **SQL Server**.

---

# 📊 Project Status

| Module | Status |
|---------|--------|
| Domain Model | ✅ Completed |
| Database Design & Migrations | ✅ Completed |
| Angular Frontend | ✅ Completed |
| REST API | 🚧 In Progress |
| Authentication (JWT) | 🚧 In Progress |
| Plant Health Evaluation | 🚧 In Progress |
| Notifications | 🚧 In Progress |
| Frontend–Backend Integration | 🚧 In Progress |
| ESP32 IoT Integration | 🔮 Planned (Optional) |

---

# ✨ Features

- 🔐 JWT Authentication
- 🌱 Plant Management
- 🌿 Plant Types & Care Requirements
- 📊 Sensor Readings
- 💬 Friendly Plant Health Evaluation
- 📈 Plant Status History
- 🔔 Notifications
- 👤 Admin Management
- 📘 REST API
- 📖 OpenAPI / Swagger Documentation

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
├── SproutyBackend/
│   ├── SproutyBackend.slnx
│   ├── src/
│   │   ├── Sprouty.Api/
│   │   ├── Sprouty.Application/
│   │   ├── Sprouty.Domain/
│   │   └── Sprouty.Infrastructure/
│   └── README.md
│
├── SproutyFrontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
```

Each project contains its own dedicated README with setup instructions.

---

# 🛠 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | ASP.NET Core Web API, C#, Entity Framework Core, SQL Server |
| **Frontend** | Angular 20, TypeScript, HTML5, CSS3, RxJS |
| **Architecture** | Clean Architecture |
| **Documentation** | OpenAPI / Swagger |
| **Tools** | Git, GitHub |

---

# 🌿 System Workflow

1. The user creates an account.
2. The user adds one or more plants.
3. Each plant belongs to a plant type with predefined care requirements.
4. Sensor readings are received through manual input, datasets, or an optional IoT device.
5. The backend evaluates the readings against the plant's recommended ranges.
6. A human-friendly plant status is generated.
7. Notifications are created whenever attention is needed.
8. The user can review previous readings and plant history at any time.

---

# 📡 Data Sources

SPROUTY works without requiring any hardware.

Plant readings can come from:

- ✍️ Manual Input
- 📊 Dataset Import
- 🔌 Optional ESP32 IoT Device

---

# 🚀 Getting Started

## Prerequisites

- .NET SDK
- SQL Server
- Angular CLI

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

dotnet ef database update --project src/Sprouty.Infrastructure --startup-project src/Sprouty.Api

dotnet run --project src/Sprouty.Api
```

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

The frontend currently uses **mock data** by default.

To connect it to the backend, update:

```
SproutyFrontend/src/app/core/config.ts
```

```ts
USE_MOCK = false;
API_URL = "https://localhost:<PORT>/api";
```

---

# 📚 Documentation

Detailed project documentation—including system design, Entity Relationship Diagram (ERD), workflow diagrams, proposal, and project analysis—is provided separately in the accompanying project documentation (PDF).

---

# 🔮 Future Enhancements

- ⚛️ React Frontend
- 📡 ESP32 Hardware Integration
- ⚡ SignalR Real-Time Updates
- 📧 Email / Push Notifications
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
