# Sprouty Backend 🌱

The backend service for **Sprouty**, a smart plant-care application designed to help users monitor their plants and understand their needs through simple, actionable information.

## 📌 Project Overview

Sprouty aims to help beginner plant owners care for their plants by providing useful plant information, monitoring sensor readings, identifying plant conditions, and delivering notifications when attention is needed.

The backend is being developed using ASP.NET Core Web API, Entity Framework Core, and SQL Server, following a Clean Architecture approach.

## 🛠️ Technology Stack

- **Language:** C#
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core
- **Database:** Microsoft SQL Server
- **Local Development Database:** SQL Server LocalDB
- **API Documentation:** OpenAPI
- **Version Control:** Git and GitHub
- **Architecture:** Clean Architecture

## 🏗️ Project Structure

The solution is organized into three main projects:

### 1. Sprouty.Domain

Contains the core business entities and domain models, including:

- `User`
- `Plant`
- `PlantType`
- `PlantRequirement`
- `Sensor`
- `SensorReading`
- `PlantStatusRecord`
- `Notification`

The domain also defines enums used to represent user roles, sensor status, plant conditions, and notification types.

### 2. Sprouty.Infrastructure

Responsible for database access and persistence.

Implemented components include:

- `AppDbContext`
- Entity Framework Core entity configurations
- Database table mappings
- Entity relationships and constraints
- Initial seed data for plant types and their requirements
- Entity Framework Core migrations

### 3. Sprouty.Api

The API entry point of the application.

Currently configured components include:

- ASP.NET Core application startup
- Controller registration
- OpenAPI endpoint configuration
- SQL Server database context registration
- HTTP request pipeline configuration

## 🗄️ Database Design

The database includes the following main entities:

| Entity | Purpose |
|---|---|
| Users | Stores user account information |
| Plants | Stores plants owned by users |
| PlantTypes | Defines plant categories and types |
| PlantRequirements | Stores recommended environmental ranges |
| Sensors | Represents sensors associated with plants |
| SensorReadings | Stores recorded sensor measurements |
| PlantStatuses | Stores calculated plant condition records |
| Notifications | Stores notifications associated with plants |

Entity Framework Core configurations define primary keys, relationships, indexes, required properties, field lengths, and enum conversions.

Initial seed data is configured for plant types and their requirements.

## ⚙️ Current Implementation Status

- [x] Initial Clean Architecture solution structure
- [x] Domain entities and relationships
- [x] Entity Framework Core `AppDbContext`
- [x] Entity configuration classes
- [x] Initial plant type and requirement seed data
- [x] SQL Server LocalDB connection configuration
- [x] Initial database migration
- [x] Local database creation and verification
- [x] Successful project build

Authentication, plant management endpoints, sensor data processing, plant condition evaluation, and notifications are planned development tasks unless implemented in subsequent branches.

## 🚀 Getting Started

### Prerequisites

Install the following:

- .NET SDK compatible with the solution
- Visual Studio with the ASP.NET and web development workload
- SQL Server LocalDB
- Entity Framework Core tools, if creating or managing migrations

### 1. Clone the Repository

Clone the Sprouty repository from GitHub and open the solution file in Visual Studio.

### 2. Configure the Database Connection

In `Sprouty.Api/appsettings.json`, configure the `DefaultConnection` connection string for your local SQL Server instance.

Example for SQL Server LocalDB:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=SproutyDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Adjust the server name if your local SQL Server instance is different.

### 3. Restore Dependencies

Restore the NuGet packages for the solution using Visual Studio or the .NET CLI.

### 4. Create the Database

The initial migration is included in the Infrastructure project. To create or update the local database, open the Package Manager Console in Visual Studio and run:

```powershell
Update-Database -Project Sprouty.Infrastructure -StartupProject Sprouty.Api
```

Ensure that `Sprouty.Api` is configured as the startup project and that the connection string is correct.

### 5. Run the API

Set `Sprouty.Api` as the startup project and run the application from Visual Studio.

When running in the Development environment, the configured OpenAPI endpoint can be used to inspect the API documentation.

## 🌿 Project Goal

Sprouty aims to turn plant-monitoring data into understandable guidance, helping users identify when their plants need water, light, or environmental adjustments.

## 👥 Development

This project is being developed collaboratively using Git and GitHub. Feature branches and pull requests are used to organize development and review changes.

---
## 🔗 Integration with Sprouty Frontend

To connect the Angular client (`SproutyFrontend`) with this backend:
- **CORS:** Ensure CORS is enabled for `http://localhost:4200`.
- **JSON Formatting:** Responses should use `camelCase` (default in ASP.NET Core).
- **Client Configuration:** In `SproutyFrontend/src/app/core/config.ts`, set:
  ```typescript
  USE_MOCK = false;
  API_URL = 'https://localhost:<PORT>/api';

  #### 2. توضيح متطلبات الـ Frontend في الـ Planned Features
في جزئية:
> *Authentication, plant management endpoints, sensor data processing...*
يمكنك إضافة تذكير سريع بالـ Endpoints المتوقعة من الـ Frontend:
```markdown
### 📋 Planned API Endpoints & Contract
- [ ] JWT Authentication (`/api/auth/login`, `/api/auth/register`)
- [ ] Plant Types with `care_notes`, `care_steps`, and `sun_schedule`
- [ ] `GET /api/plants/{id}/latest` (returns reading, requirement, and computed plant status)
- [ ] `POST /api/readings` (ingest sensor readings)
- [ ] `GET /api/notifications` & `PUT /api/notifications/{id}/read`

**Sprouty Backend** — Helping plants grow, one step at a time. 🌱
