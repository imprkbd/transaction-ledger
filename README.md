# Mini Transaction Ledger

A full-stack web application for managing customer accounts and tracking financial transactions (debits and credits) in real-time. Built with ASP.NET Core Web API (backend), React (frontend), and SQLite. The application demonstrates clean architecture, domain-driven design (DDD) principles, and containerization with Docker.

## Project Overview

The Mini Transaction Ledger is a comprehensive solution for maintaining financial records with account management, transaction tracking, and dashboard analytics. It implements clean architecture principles with a layered approach separating concerns across API, Application, Domain, and Infrastructure layers.

## Tech Stack

### Backend

- **Framework**: ASP.NET Core 10 with C#
- **ORM**: Entity Framework Core
- **Database**: SQLite (persistent volume in Docker)
- **API Documentation**: Swagger/OpenAPI
- **Architecture Pattern**: Clean Architecture with Domain-Driven Design

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: Axios + React Query
- **Form Management**: React Hook Form
- **Notifications**: React Hot Toast
- **Routing**: React Router v7
- **Icons**: Lucide React

### DevOps & Deployment

- **Containerization**: Docker & Docker Compose
- **Frontend Server**: Nginx (Alpine)
- **Backend Runtime**: .NET 10 Runtime (Alpine)
- **Build Tools**: Node.js 20 (for frontend), .NET 10 SDK (for backend)

## Project Structure

```
transaction-ledger/
├── backend/                         # ASP.NET Core API
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── Ledger.Api/                  # API layer
│   │   ├── Controllers/             # REST endpoints
│   │   ├── Middleware/              # Error handling, etc.
│   │   ├── Program.cs               # Service configuration
│   │   ├── appsettings.json         # Configuration
│   │   └── ledger.db                # SQLite database
│   ├── Ledger.Application/          # Business logic layer
│   │   ├── Accounts/                # Account service & DTOs
│   │   ├── Ledger/                  # Ledger entry service
│   │   ├── Dashboard/               # Dashboard service
│   │   ├── Abstractions/            # Repository interfaces
│   │   └── Common/                  # Value objects, exceptions
│   ├── Ledger.Domain/               # Domain layer (entities)
│   │   ├── Accounts/                # Account entity
│   │   ├── Ledger/                  # LedgerEntry entity
│   │   └── Common/                  # Value objects, exceptions
│   └── Ledger.Infrastructure/       # Data & external services
│       ├── Persistence/             # EF Core DbContext
│       └── Repositories/            #
├── frontend/                        # React + Vite SPA
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── features/                # Feature-specific logic
│   │   ├── pages/                   # Page components
│   │   ├── lib/                     # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── nginx.conf                   # Nginx configuration
│   └── vite.config.js               # Vite configuration
├── docker-compose.yml               # Multi-container orchestration
|── EXPLANATION.md                   # Work Explanation
└── README.md                        # This file
```

## Setup & Installation

### Prerequisites

- Docker & Docker Compose (recommended for quick setup)
- NET 10 SDK and Node.js 20+ (for local development)
- Git

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/transaction-ledger.git
   cd transaction-ledger
   ```

2. **Build and start containers**

   ```bash
   docker compose up --build
   ```

   - Backend API: http://localhost:8080
   - Frontend: http://localhost:3000

3. **Stop containers**
   ```bash
   docker compose down
   ```

### Option 2: Local Development

**Backend Setup:**

```bash
cd backend
dotnet restore
dotnet build
cd Ledger.Api
dotnet run --launch-profile https
```

- API runs on: http://localhost:5059
- Swagger API Docs: http://localhost:5059/swagger/index.html

**Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs on: http://localhost:5173

### Database

- **Configuration**: SQLite persisted to volume at `/data/ledger.db`
- **Migrations**: Applied automatically on application startup
- **Local Development**: Creates `ledger.db` in the application directory

## Architecture Overview

The backend follows **Clean Architecture** with four layers:

- **Domain**: Core business logic and entities (e.g., `Account`, `LedgerEntry`). Contains domain exceptions and value objects (`Money`, `AccountId`). Encapsulates rules like no overdraft, validation.
- **Application**: Use cases and business workflows. Contains services (`AccountService`, `LedgerService`), DTOs, and repository interfaces. Depends only on Domain.
- **Infrastructure**: Implements repository interfaces, EF Core `DbContext`, and configurations. Handles data persistence.
- **API**: Controllers, middleware (error handling), and dependency injection setup. Exposes REST endpoints.

**Frontend** is a single-page application built with React. It uses TanStack Query for server state management and React Hook Form for forms. API calls are centralized in `apiClient`.

### Key Architectural Patterns

1. **Domain-Driven Design**: Entities (`Account`, `LedgerEntry`) contain domain logic
2. **Repository Pattern**: Data access abstraction via `IAccountRepository` and `ILedgerEntryRepository`
3. **Dependency Injection**: Services registered in DI container for loose coupling
4. **Clean Architecture**: Separation of concerns across distinct layers
5. **DTO Pattern**: Data Transfer Objects for API request/response contracts
6. **CORS**: Enabled for frontend-backend communication in development

## Inner Workings (Brief)

**Backend:**

- Controllers receive HTTP requests and delegate to application services.
- Services orchestrate domain objects and use repositories (via DI) to persist data.
- Domain entities enforce business rules (e.g., Account.AddEntry checks balance).
- EF Core maps domain entities to SQLite tables using configurations.
- Global error handling middleware catches exceptions and returns Problem Details.

**Frontend:**

- React Router handles navigation.
- TanStack Query caches server data and manages mutations.
- API requests go through apiClient (axios) with error handling.
- Forms use React Hook Form for validation.

## API Endpoints

### Accounts

- `POST /api/accounts` - Create new account
- `GET /api/accounts` - Get paginated list of accounts (with search & filtering)
- `PUT /api/accounts/{id}` - Update account details
- `DELETE /api/accounts/{id}` - Delete (soft delete) account

### Ledger Entries

- `POST /api/ledger/entries` - Add debit/credit entry
- `GET /api/ledger/entries` - Get entries (paginated, filterable by account)

### Dashboard

- `GET /api/dashboard/summary` - Get overall statistics

## Key Features

✅ **Account Management**: Create, read, update, and delete customer accounts  
✅ **Transaction Tracking**: Record and track debit/credit entries  
✅ **Pagination**: Efficient data retrieval with page-based pagination  
✅ **Search & Filtering**: Find accounts and entries quickly  
✅ **Real-time Dashboard**: View account summaries and statistics  
✅ **Error Handling**: Comprehensive error responses with middleware  
✅ **API Documentation**: Swagger/OpenAPI documentation  
✅ **Soft Deletes**: Accounts can be soft-deleted (not permanently removed)  
✅ **Responsive UI**: Modern React frontend with Tailwind styling  
✅ **Containerized**: Complete Docker setup for easy deployment

## Deployment

### Docker Image Sizes & Build Strategy

**Multi-Stage Builds** reduce final image sizes:

- **Backend**: ~200MB (after build stage removal)
- **Frontend**: ~50MB (after Node.js removal, only Nginx kept)

### Environment Variables

**Backend (Docker)**:

```
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__Default=Data Source=/data/ledger.db
```

**Frontend**:

- API base URL configured in API client (axios)

### Volumes

- `ledger-data`: Persists SQLite database across container restarts

## Development Workflow

1. **Make changes** to frontend/backend code
2. **Rebuild containers** (for backend changes):
   ```bash
   docker-compose down
   docker-compose up --build
   ```
3. **Hot reload** (frontend uses Vite HMR in dev mode)
4. **View logs**: `docker-compose logs -f backend` or `docker-compose logs -f frontend`

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced reporting and exports (CSV, PDF)
- [ ] Multi-currency support
- [ ] Transaction reconciliation
- [ ] Unit tests for services
- [ ] E2E testing with Cypress/Playwright

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact & Support

For issues, questions, or suggestions, please open an issue on GitHub.
