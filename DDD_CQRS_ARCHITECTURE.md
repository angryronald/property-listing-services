# Property Listing Service - DDD and CQRS Implementation

This project demonstrates the implementation of Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns in a JavaScript/Node.js application.

## Architecture Overview

The application follows a layered architecture with clear separation of concerns following DDD principles:

```
┌─────────────────┐
│   User Interface│ (endpoint) - API controllers
├─────────────────┤
│   Application   │ (application) - CQRS handlers and use cases
├─────────────────┤
│     Domain      │ (domain) - Entities, services, business logic
├─────────────────┤
│ Infrastructure  │ (infrastructure) - Repositories, events, external services
└─────────────────┘
```

## Detailed Directory Structure

```
src/
├── property/                 # Property domain module
│   ├── application/          # Application layer (use cases)
│   │   ├── command/          # Command handlers (write operations)
│   │   │   ├── property.command.js          # Command handler implementation
│   │   │   ├── property.command.abstraction.js # Command abstractions
│   │   │   └── __tests__/                   # Command unit tests
│   │   └── query/            # Query handlers (read operations)
│   │       ├── property.query.js            # Query handler implementation
│   │       ├── property.query.abstraction.js # Query abstractions
│   │       └── __tests__/                   # Query unit tests
│   ├── domain/               # Domain layer (core business logic)
│   │   ├── property.entity.js               # Property entity with validation
│   │   ├── property.service.js              # Domain service
│   │   ├── property.abstraction.js          # Domain contracts
│   │   └── __tests__/                       # Domain unit tests
│   ├── endpoint/             # API endpoint controllers
│   │   ├── property.endpoint.js             # REST API controllers
│   │   └── __tests__/                       # Endpoint integration tests
│   ├── infrastructure/       # Infrastructure layer
│   │   ├── event/            # Event system
│   │   │   ├── publisher/    # Event publishers
│   │   │   │   └── property.publisher.js    # Property event publisher
│   │   │   └── subscriber/   # Event subscribers
│   │   │       └── property.subscriber.js   # Property event subscriber
│   │   └── repository/       # Data access implementations
│   │       ├── property.repository.js       # Repository interface/implementation
│   │       ├── inmemory/     # In-memory storage implementation
│   │       │   └── property.inmemory.js     # In-memory repository
│   │       └── __tests__/                   # Repository unit tests
│   └── constant/             # Domain constants (if any)
├── dependency_injection/     # Dependency injection container and setup
│   ├── dependency_injection.js              # DI container
│   └── dependency_injection.initiation.js   # DI initialization
├── routes/                   # Route configuration
│   └── routes.js             # API route definitions
├── __tests__/                # Integration and full application tests
│   ├── dependency_injection.test.js         # DI container tests
│   └── full_integration.test.js             # Full workflow tests
└── app.js                    # Main application entry point
```

## DDD Implementation Details

### Domain Layer (`src/property/domain/`)
- **Entity**: `Property.entity.js` - Core domain entity with:
  - Business rules and validation logic
  - Encapsulated state and behavior
  - Invariant protection (e.g., price must be positive)
  - Domain methods for state changes (`updateTitle`, `updatePrice`, etc.)

- **Domain Service**: `Property.service.js` - Contains:
  - Domain logic not tied to entity state
  - Complex business operations
  - Validation helper methods
  - Entity creation logic

- **Domain Abstractions**: `Property.abstraction.js` - Defines:
  - Repository interface contracts
  - Domain service interfaces
  - Abstract base classes for testing

### Application Layer (`src/property/application/`)
- **Command Pattern**: Handles write operations using the CQRS pattern:
  - `property.command.js`: Command handler with business logic for write operations
  - `property.command.abstraction.js`: Command definitions and interfaces
  - Proper validation before executing business logic
  - Domain event publishing after successful operations

- **Query Pattern**: Handles read operations:
  - `property.query.js`: Query handler with logic for retrieving data
  - `property.query.abstraction.js`: Query definitions and interfaces
  - Filtering, sorting, and pagination logic
  - Direct data access without business logic

### Infrastructure Layer (`src/property/infrastructure/`)
- **Repository Pattern**: `property.repository.js` and `property.inmemory.js`:
  - Abstraction for data access
  - In-memory implementation for development/testing
  - Interface for easy swapping of storage technologies
  - Implementation of domain persistence needs

- **Event System**: Publisher/subscriber for domain events:
  - `property.publisher.js`: Manages event publishing
  - `property.subscriber.js`: Handles event consumption
  - Loose coupling between domain and infrastructure concerns

### Endpoint Layer (`src/property/endpoint/`)
- **API Controllers**: `property.endpoint.js`:
  - Maps HTTP requests to application layer
  - Handles HTTP-specific concerns (status codes, headers)
  - Translates between HTTP and domain objects
  - Error handling at the presentation layer

## CQRS Implementation Details

### Commands (Write Operations) - Located in `src/property/application/command/`
- **CreatePropertyCommand**: Creates new property with validation
- **UpdatePropertyCommand**: Updates existing property with change tracking
- **DeletePropertyCommand**: Removes property with proper validation
- **Handler Responsibilities**:
  - Validates input data using domain services
  - Orchestrates domain entity creation/updating
  - Persists changes through repositories
  - Publishes domain events
  - Returns appropriate results

### Queries (Read Operations) - Located in `src/property/application/query/`
- **GetPropertyQuery**: Retrieves single property by ID
- **GetPropertiesQuery**: Retrieves multiple properties with:
  - Status filtering support
  - Pagination (limit/offset)
  - Search functionality
- **Handler Responsibilities**:
  - Directs to appropriate read model
  - Applies requested filters
  - Returns data without business logic

### Benefits of CQRS Pattern in This Implementation
1. **Separation of Concerns**: Write and read operations have different requirements
2. **Performance Optimization**: Read and write models can be optimized separately
3. **Scalability**: Read and write operations can be scaled independently
4. **Simplicity**: Each operation has focused responsibility
5. **Domain Protection**: Write operations can enforce domain rules while reads are optimized for performance

## Dependency Injection System

Located in `dependency_injection/`:
- **Container**: Manages object creation and lifecycle
- **Registration**: All services are registered with their dependencies
- **Resolution**: Creates objects with proper dependency injection
- **Singleton Pattern**: Services are instantiated once and reused
- **Testing Support**: Easy to mock dependencies for tests

## Testing Strategy

The implementation includes comprehensive testing at all layers:

### Unit Tests (62+ tests)
- **Domain**: Entity validation, business logic
- **Application**: Command/query handler logic
- **Infrastructure**: Repository functionality
- **Endpoint**: API integration

### Integration Tests
- Full workflow testing
- Dependency injection verification
- Cross-layer functionality

### Test Coverage
- 100% testing of domain entities and services
- Complete coverage of command/query handlers
- Full API endpoint testing
- Infrastructure component verification

## Key Features and Benefits

1. **Domain Protection**: Business logic is centralized and protected
2. **Scalability**: Read and write operations can scale independently
3. **Maintainability**: Clear separation makes code easier to understand and modify
4. **Testability**: Each layer can be tested independently
5. **Flexibility**: Easy to swap implementations (e.g., in-memory to database)
6. **Performance**: Optimized read models for queries
7. **Consistency**: Proper validation and business rules enforcement
8. **Event-Driven**: Support for domain events and eventual consistency

## Running the Application

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. The API will be available at `http://localhost:3000`

## Running Tests

1. Run all tests: `npm test`
2. Run tests with coverage: `npm run test:coverage`
3. Run tests in watch mode: `npm run test:watch`

The implementation provides a robust, maintainable foundation that can be extended with additional features, persistence layers (database implementations), authentication, and other enterprise capabilities while maintaining the DDD and CQRS architectural principles.