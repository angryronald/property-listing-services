# Property Listing API Documentation

This is a REST API for managing property listings built with Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns.

## Base URL
`http://localhost:3000/api`

## Architecture Pattern

The API follows CQRS (Command Query Responsibility Segregation) where:
- **Commands** handle write operations (POST, PUT, DELETE)
- **Queries** handle read operations (GET)

## Endpoints

### 1. Create a Property (Command)
- **URL**: `/properties`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Pattern**: Command Handler

#### Request Body
```json
{
  "title": "Luxury Apartment",
  "description": "A beautiful apartment in downtown.",
  "address": "123 Main St",
  "price": 250000,
  "status": "available"
}
```

#### Response
- **Status**: `201 Created`
- **Body**:
```json
{
  "id": 1,
  "title": "Luxury Apartment",
  "description": "A beautiful apartment in downtown.",
  "address": "123 Main St",
  "price": 250000,
  "status": "available",
  "createdAt": "2025-10-27T17:13:56.286Z",
  "updatedAt": "2025-10-27T17:13:56.286Z"
}
```

### 2. Fetch All Properties (Query)
- **URL**: `/properties`
- **Method**: `GET`
- **Pattern**: Query Handler
- **Query Parameters (Optional)**:
  - `status`: Filter by status (e.g., "available", "sold")
  - `limit`: Number of properties to return (for pagination)
  - `offset`: Number of properties to skip (for pagination)
  - `search`: Search term for title or description

#### Response
- **Status**: `200 OK`
- **Body**:
```json
{
  "properties": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "description": "A beautiful apartment in downtown.",
      "address": "123 Main St",
      "price": 250000,
      "status": "available",
      "createdAt": "2025-10-27T17:13:56.286Z",
      "updatedAt": "2025-10-27T17:13:56.286Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### 3. Fetch a Property by ID (Query)
- **URL**: `/properties/:id`
- **Method**: `GET`
- **Pattern**: Query Handler

#### Response
- **Status**: `200 OK`
- **Body**:
```json
{
  "id": 1,
  "title": "Luxury Apartment",
  "description": "A beautiful apartment in downtown.",
  "address": "123 Main St",
  "price": 250000,
  "status": "available",
  "createdAt": "2025-10-27T17:13:56.286Z",
  "updatedAt": "2025-10-27T17:13:56.286Z"
}
```

#### Error Response
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "error": "Property not found"
}
```

### 4. Update a Property (Command)
- **URL**: `/properties/:id`
- **Method**: `PUT`
- **Content-Type**: `application/json`
- **Pattern**: Command Handler

#### Request Body
```json
{
  "title": "Updated Luxury Apartment",
  "price": 275000,
  "status": "under_offer"
}
```

#### Response
- **Status**: `200 OK`
- **Body**:
```json
{
  "id": 1,
  "title": "Updated Luxury Apartment",
  "description": "A beautiful apartment in downtown.",
  "address": "123 Main St",
  "price": 275000,
  "status": "under_offer",
  "createdAt": "2025-10-27T17:13:56.286Z",
  "updatedAt": "2025-10-27T17:13:56.331Z"
}
```

#### Error Response
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "error": "Property not found"
}
```

### 5. Delete a Property (Command)
- **URL**: `/properties/:id`
- **Method**: `DELETE`
- **Pattern**: Command Handler

#### Response
- **Status**: `200 OK`
- **Body**:
```json
{
  "message": "Property deleted successfully"
}
```

#### Error Response
- **Status**: `404 Not Found`
- **Body**:
```json
{
  "error": "Property not found"
}
```

## Validation Rules

### Required Fields
- `title`: String, non-empty
- `address`: String, non-empty
- `price`: Number, positive value

### Validation Error Response
- **Status**: `400 Bad Request`
- **Body**:
```json
{
  "error": "Validation failed",
  "details": [
    "Title is required and must be a non-empty string",
    "Price must be a positive number"
  ]
}
```

## Architecture Details

### Domain Layer
- `Property.entity.js`: Core entity with business rules and validation
- `Property.service.js`: Domain service with business logic

### Application Layer
- **Commands**: Handle write operations with validation
- **Queries**: Handle read operations with optional filtering

### Infrastructure Layer
- `Repository`: Data persistence abstraction
- `InMemory Implementation`: Temporary storage for demonstration

### Endpoint Layer
- API controllers that interact with command/query handlers

## Running the Server

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. For development with auto-restart: `npm run dev`

The server will run on `http://localhost:3000`