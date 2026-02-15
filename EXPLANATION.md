# Mini Transaction Ledger - Technical Explanation

This document provides a technical overview of the application architecture, core components, API mechanics, and Docker setup.

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Key Code Components](#key-code-components)
3. [API Layer & Endpoints](#api-layer--endpoints)
4. [API Internal Mechanics](#api-internal-mechanics)
5. [Docker Setup](#docker-setup)

---

## Application Architecture

The application follows **Clean Architecture** with layered separation of concerns:

```
┌─────────────────────────────────────┐
│  Frontend (React SPA)               │
└────────────────┬────────────────────┘
                 │ REST API (JSON)
┌────────────────▼────────────────────┐
│  Controllers (Route & formatting)   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Services (Business logic)          │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Domain Entities (Business rules)   │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│  Repositories (Data access)         │
└────────────────┬────────────────────┘
                 │ SQL
┌────────────────▼────────────────────┐
│  SQLite Database                    │
└─────────────────────────────────────┘
```

**Benefits**: Testability, maintainability, clear responsibilities, and loose coupling.

---

## Key Code Components

### Domain Layer

- **Account Entity**: Represents a customer account with validation. Uses factory methods to ensure valid state. Maintains soft delete for audit trails.
- **LedgerEntry Entity**: Immutable transactions (debits/credits). The `SignedAmount()` method applies correct signs based on entry type.

### Application Layer

- **AccountService**: Orchestrates account operations—creation, querying, and updates via repositories.
- **LedgerService**: Manages debit/credit entries. Validates entry type and coordinates with domain logic.
- **DashboardService**: Aggregates metrics (total accounts, balances, etc.) for dashboard display.

### API Layer

All controllers use **Dependency Injection** to receive services. Controllers route HTTP requests, parse parameters, and delegate to services without business logic.

---

## API Layer & Endpoints

### AccountsController

- `POST /api/accounts` — Create account → `201 Created`
- `GET /api/accounts?page=1&pageSize=10&status=active&search=query` — List with pagination/filters → `200 OK`
- `GET /api/accounts/{id}` — Retrieve account → `200 OK` or `404`
- `PUT /api/accounts/{id}` — Update account → `200 OK` or `404`
- `DELETE /api/accounts/{id}` — Soft delete → `204 No Content` or `404`

### LedgerController

- `POST /api/ledger/entries` — Add debit/credit (entryType: 1 or 2) → `201 Created`
- `GET /api/ledger/entries?accountId={id}` — List entries with pagination → `200 OK`
- `GET /api/ledger/entries/{id}` — Retrieve entry → `200 OK` or `404`

### DashboardController

- `GET /api/dashboard/summary` — Get aggregated metrics → `200 OK`

---

## API Internal Mechanics

### Request Processing Pipeline

1. **Model Binding & Deserialization**
   - ASP.NET Core deserializes JSON payload to Data Transfer Object (DTO)
   - Built-in validators check constraints (required fields, format, length)
   - Invalid requests return `400 Bad Request` with error details

2. **Service Invocation**
   - Controller invokes service method with deserialized data
   - Services contain business logic: validation, domain entity creation, state transitions
   - Services call repositories to persist/retrieve data

3. **Data Access Layer**
   - Repositories use Entity Framework Core to generate SQL queries
   - EF Core tracks entity state (Added, Modified, Deleted)
   - Database changes committed in a transaction

4. **Response Transformation**
   - Service returns domain entities
   - Controller transforms to DTOs for serialization (avoiding internal state exposure)
   - Response typed as `ActionResult<T>` with appropriate HTTP status code

5. **Serialization & HTTP Response**
   - ASP.NET Core serializes DTO to JSON
   - Response headers set Content-Type, CORS headers
   - Sent to client with status code and body

### Example: POST /api/accounts Internals

```
Request: { "accountName": "John Doe", "email": "john@example.com" }
   ↓
[HttpPost] Attribute routes to AccountsController.CreateAccount()
   ↓
Model Binding: JSON → CreateAccountDto
   ↓
ModelState Validation: Check required fields, email format
   ↓
accountService.CreateAccount(dto) executes
   ├─ Account.CreateFactory(name, email) validates and creates domain entity
   ├─ accountRepository.AddAsync(account) stages INSERT
   └─ dbContext.SaveChangesAsync() commits transaction
   ↓
Service returns Account entity with generated ID
   ↓
Controller transforms to AccountDto
   ↓
return CreatedAtAction(...) → `201 Created` + Location header + JSON body
   ↓
Response: { "id": 1, "accountName": "John Doe", "email": "john@example.com" }
```

### Error Handling Flow

- **Validation Errors**: ModelState invalid → `400 Bad Request` with field errors
- **Business Logic Errors**: Service throws domain exception → `409 Conflict` or `422 Unprocessable Entity`
- **Not Found**: Repository returns null → `404 Not Found`
- **Unhandled Exceptions**: Global exception middleware catches → `500 Internal Server Error`

---

## Docker Setup

### Architecture

A Docker Compose file orchestrates two services:

1. **Backend Service** (.NET)
   - Multi-stage build: SDK for compilation → lean runtime image
   - Exposes port `8080`
   - Mounts persistent volume at `/data` for SQLite database

2. **Frontend Service** (React + Nginx)
   - Multi-stage build: Node for compilation → lightweight Nginx-only runtime
   - Exposes port `3000`
   - Depends on backend (ensures startup order)

3. **Volume: ledger-data**
   - Docker-managed volume persisting SQLite database
   - Survives container restarts

### Networking

- Internal bridge network enables container-to-container communication via service names (`http://backend:8080`)
- Frontend and backend communicate within the network; clients access via `localhost:3000` and `localhost:8080`

### Data Persistence

- SQLite database stored at `/data/ledger.db` inside backend container
- Mounted to host volume for durability
- Running `docker-compose down -v` deletes volumes and resets database

---

## Data Flow Example: Creating an Account

1. User submits form → React validates locally
2. Axios sends `POST /api/accounts` with JSON payload
3. AccountsController receives request, deserializes to DTO
4. AccountService calls domain factory to create Account entity (validates state)
5. AccountRepository persists entity via Entity Framework Core
6. EF Core executes INSERT into Accounts table
7. Service transforms entity to AccountDto with generated ID
8. Controller returns `201 Created` response
9. Frontend updates state via React Query cache and re-renders
