# Key DDD/CQRS Architecture Files

## Directory Structure
```
src/
├── property/                 # Property domain module
│   ├── application/          # Application layer (CQRS handlers)
│   │   ├── command/          # Command handlers (create, update, delete)
│   │   │   ├── property.command.abstract.handler.js  # Abstract command handler
│   │   │   ├── property.command.abstraction.js       # Command DTOs
│   │   │   └── property.command.js                   # Concrete command handler
│   │   └── query/            # Query handlers (read operations)
│   │       ├── property.query.abstract.handler.js    # Abstract query handler
│   │       ├── property.query.abstraction.js         # Query DTOs
│   │       └── property.query.js                     # Concrete query handler
│   ├── domain/               # Domain layer (entities, services)
│   │   ├── property.abstraction.js                   # Abstract service class
│   │   ├── property.entity.js                        # Domain entity
│   │   └── property.service.js                       # Domain service
│   ├── endpoint/             # API endpoints/controllers
│   │   └── property.endpoint.js                      # REST controllers
│   └── infrastructure/       # Infrastructure layer
│       ├── event/            # Event publisher/subscriber system
│       │   ├── publisher/    # Event publishers
│       │   └── subscriber/   # Event subscribers
│       └── repository/       # Repository implementations
│           ├── property.repository.js                # Abstract repository
│           └── inmemory/     # In-memory implementation
│               └── property.inmemory.js              # In-memory repository
├── dependency_injection/     # Dependency injection container
│   ├── dependency_injection.js                       # DI container
│   └── dependency_injection.initiation.js            # DI initialization
└── routes/                   # Route configurations
    └── routes.js             # API route definitions
```

## Key Implementation Details

### Domain Entity (src/property/domain/property.entity.js)
- Business rules and validation logic
- Invariant protection
- Domain methods for state changes

### Abstract Repository (src/property/infrastructure/repository/property.repository.js)
- Base class defining data access contract
- Methods: save, findById, findAll, update, delete

### In-Memory Repository (src/property/infrastructure/repository/inmemory/property.inmemory.js)
- Concrete implementation of repository pattern
- In-memory storage for development/prototyping

### Command Handler (src/property/application/command/property.command.js)
- Handles write operations (create, update, delete)
- Integrates with domain services and repositories
- Implements validation before execution

### Query Handler (src/property/application/query/property.query.js)
- Handles read operations (get, list)
- Implements filtering, pagination, and search

### Dependency Injection (dependency_injection/dependency_injection.js)
- Manages object lifecycles
- Handles service registration and resolution
- Implements singleton pattern for services

## Testing Structure
- Unit tests for each layer
- Integration tests for component interactions
- End-to-end tests for complete workflows
- 62 total tests covering all architectural layers

## API Endpoints
- POST   /api/properties - Create property (Command)
- GET    /api/properties - List properties (Query) with filters/pagination
- GET    /api/properties/:id - Get property by ID (Query)
- PUT    /api/properties/:id - Update property (Command)
- DELETE /api/properties/:id - Delete property (Command)

## Integration Adaptation Points
1. Rename 'Property' domain to match rental project domain (e.g., 'RentalItem', 'Lease', etc.)
2. Adjust business rules to match rental domain requirements
3. Connect repository implementations to rental project's data storage
4. Integrate event system with rental project's notification system
5. Adapt API endpoints to match rental project's API conventions
6. Update dependency injection to work with rental project's architecture