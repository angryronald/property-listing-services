#!/bin/bash
# API Test Script for Property Listing Service

echo "Starting Property Listing API tests..."

# Start the server in background
node server.js &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Wait for server to start
sleep 3

echo "Testing API endpoints..."

# Test 1: Create a property
echo "Test 1: Creating a property"
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Apartment",
    "description": "A beautiful apartment in downtown.",
    "address": "123 Main St",
    "price": 250000
  }'
echo -e "\n"

# Test 2: Create another property
echo "Test 2: Creating another property"
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Suburban House",
    "description": "Spacious family home in quiet neighborhood.",
    "address": "456 Oak Ave",
    "price": 450000
  }'
echo -e "\n"

# Test 3: Get all properties
echo "Test 3: Fetching all properties"
curl -X GET http://localhost:3000/api/properties
echo -e "\n"

# Test 4: Get a specific property (use an ID from the previous response)
echo "Test 4: Fetching property with ID 1"
curl -X GET http://localhost:3000/api/properties/1
echo -e "\n"

# Test 5: Update a property
echo "Test 5: Updating property with ID 1"
curl -X PUT http://localhost:3000/api/properties/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Luxury Apartment",
    "price": 275000
  }'
echo -e "\n"

# Test 6: Get the updated property
echo "Test 6: Fetching updated property"
curl -X GET http://localhost:3000/api/properties/1
echo -e "\n"

# Test 7: Delete a property
echo "Test 7: Deleting property with ID 2"
curl -X DELETE http://localhost:3000/api/properties/2
echo -e "\n"

# Test 8: Try to get the deleted property (should return 404)
echo "Test 8: Trying to fetch deleted property (should return 404)"
curl -X GET http://localhost:3000/api/properties/2
echo -e "\n"

# Test 9: Test validation - create property with invalid data
echo "Test 9: Testing validation with invalid data"
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "address": "Valid Address",
    "price": -100
  }'
echo -e "\n"

# Test 10: Test filtering and pagination
echo "Test 10: Testing filtering and pagination"
curl -X GET "http://localhost:3000/api/properties?limit=5&offset=0"
echo -e "\n"

# Cleanup: Kill the server
kill $SERVER_PID
echo "Tests completed. Server stopped."