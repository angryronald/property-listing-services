# Property Listing Services - DDD and CQRS Implementation

A comprehensive Node.js and Express.js API for managing property listings, built with Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns.

## Features

- Full CRUD operations for property listings
- Domain-Driven Design architecture with separation of concerns
- Command Query Responsibility Segregation (CQRS) pattern
- Validation for required fields and data types
- Filtering and pagination support
- Event-driven architecture support
- Dependency injection for loose coupling
- Comprehensive test coverage

## Architecture Overview

### Layered Architecture
```
src/
├── property/                 # Property domain module
│   ├── application/          # Application layer (CQRS handlers)
│   │   ├── command/          # Command handlers (create, update, delete)
│   │   └── query/            # Query handlers (read operations)
│   ├── domain/               # Domain layer (entities, services, business logic)
│   ├── endpoint/             # API endpoints/controllers
│   └── infrastructure/       # Infrastructure layer
│       ├── event/            # Event publisher/subscriber system
│       │   ├── publisher/    # Event publishers
│       │   └── subscriber/   # Event subscribers
│       └── repository/       # Data access layer
│           ├── inmemory/     # In-memory repository implementation
│           └── nosql/        # Future NoSQL implementations
├── dependency_injection/     # Dependency injection container
└── routes/                   # Route configurations
```

### DDD Components
- **Domain Layer**: Contains `Property` entity with business rules, validation logic, and domain services
- **Application Layer**: Contains command handlers for write operations and query handlers for read operations
- **Infrastructure Layer**: Handles data persistence (repositories) and event publishing/subscribing
- **Endpoint Layer**: API controllers that interface with the application layer

### CQRS Implementation
- **Commands**: Handle all write operations (create, update, delete) with proper validation
- **Queries**: Handle all read operations (get, list) with filtering and pagination
- **Separation**: Clear distinction between read and write operations for scalability

## Requirements

- Node.js (v14 or higher)
- npm

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

### Start the server
```bash
npm start
```

### Run in development mode (with auto-restart)
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

All endpoints follow REST principles and CQRS patterns:

- `POST /api/properties` - Create a property (Command)
- `GET /api/properties` - List properties with optional filters and pagination (Query)
- `GET /api/properties/:id` - Get a property by ID (Query)
- `PUT /api/properties/:id` - Update a property (Command)
- `DELETE /api/properties/:id` - Delete a property (Command)

### Query Parameters
- `status`: Filter by status (e.g., `available`, `sold`)
- `limit`: Number of records to return (pagination)
- `offset`: Number of records to skip (pagination)
- `search`: Search term for title or description

### Sample Requests
```bash
# Create a property
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Apartment",
    "description": "A beautiful apartment in downtown",
    "address": "123 Main St",
    "price": 250000,
    "status": "available"
  }'

# Get all properties with filtering
curl "http://localhost:3000/api/properties?status=available&limit=10&offset=0"
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Available Test Types
- **Unit Tests**: Test individual components (entities, services, handlers)
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete API workflows
- **Dependency Injection Tests**: Verify DI container functionality

## Project Components

### Domain Layer (`src/property/domain/`)
- `property.entity.js`: Core Property entity with validation rules
- `property.service.js`: Domain service with business logic
- `property.abstraction.js`: Abstract interfaces for contracts

### Application Layer (`src/property/application/`)
- `command/`: Command handlers for write operations
  - `property.command.js`: Command handler implementations
  - `property.command.abstraction.js`: Command abstractions
- `query/`: Query handlers for read operations
  - `property.query.js`: Query handler implementations
  - `property.query.abstraction.js`: Query abstractions

### Infrastructure Layer (`src/property/infrastructure/`)
- `repository/`: Data persistence layer
  - `property.repository.js`: Base repository with in-memory storage
  - `inmemory/`: In-memory implementation
- `event/`: Event-driven architecture
  - `publisher/`: Event publishing mechanisms
  - `subscriber/`: Event subscription and handling

### Dependency Injection (`dependency_injection/`)
- `dependency_injection.js`: DI container implementation
- `dependency_injection.initiation.js`: Container initialization

## Development

### Adding New Features
1. Follow the layered architecture pattern
2. Add domain logic to the Domain Layer
3. Create command/query handlers in the Application Layer
4. Implement infrastructure as needed
5. Write comprehensive tests

### Architecture Benefits
- **Maintainability**: Clear separation makes code easier to understand and modify
- **Testability**: Each layer can be tested independently
- **Scalability**: Read and write operations can be scaled separately
- **Flexibility**: Easy to swap implementations (e.g., in-memory to database)
- **Domain Focus**: Business logic is protected and centralized