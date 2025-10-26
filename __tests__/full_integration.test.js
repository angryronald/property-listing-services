// Full Integration Test: Complete Property Management Workflow

const request = require('supertest');
const express = require('express');

// Create a separate test app to avoid conflicts with the main app
const PropertyEndpoint = require('../src/property/endpoint/property.endpoint');
const PropertyService = require('../src/property/domain/property.service');
const PropertyInMemoryRepository = require('../src/property/infrastructure/repository/inmemory/property.inmemory');
const PropertyCommandHandler = require('../src/property/application/command/property.command');
const PropertyQueryHandler = require('../src/property/application/query/property.query');

const propertyService = new PropertyService();
const propertyRepository = new PropertyInMemoryRepository();
const commandHandler = new PropertyCommandHandler(propertyService, propertyRepository);
const queryHandler = new PropertyQueryHandler(propertyRepository);
const propertyEndpoint = new PropertyEndpoint(commandHandler, queryHandler);

const app = express();
app.use(express.json());
app.use('/api/properties', propertyEndpoint.getRouter());

describe('Full Property Management Workflow', () => {
  let createdPropertyId;

  test('Complete workflow: Create, Read, Update, Delete a property', async () => {
    // Step 1: Create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .send({
        title: 'Integration Test Property',
        description: 'A property created for integration testing',
        address: '789 Integration Blvd',
        price: 450000,
        status: 'available'
      })
      .expect(201);

    expect(createResponse.body.title).toBe('Integration Test Property');
    expect(createResponse.body.description).toBe('A property created for integration testing');
    expect(createResponse.body.address).toBe('789 Integration Blvd');
    expect(createResponse.body.price).toBe(450000);
    expect(createResponse.body.status).toBe('available');
    expect(createResponse.body.id).toBeDefined();
    
    createdPropertyId = createResponse.body.id;

    // Step 2: Read (GET) the created property
    const getResponse = await request(app)
      .get(`/api/properties/${createdPropertyId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(createdPropertyId);
    expect(getResponse.body.title).toBe('Integration Test Property');

    // Step 3: Read all properties and verify the created property is there
    const getAllResponse = await request(app)
      .get('/api/properties')
      .expect(200);

    expect(getAllResponse.body.properties).toHaveLength(1);
    expect(getAllResponse.body.properties[0].id).toBe(createdPropertyId);

    // Step 4: Update (PUT) the property
    const updateResponse = await request(app)
      .put(`/api/properties/${createdPropertyId}`)
      .send({
        title: 'Updated Integration Test Property',
        price: 475000
      })
      .expect(200);

    expect(updateResponse.body.title).toBe('Updated Integration Test Property');
    expect(updateResponse.body.price).toBe(475000);
    expect(updateResponse.body.id).toBe(createdPropertyId);

    // Step 5: Verify the update by reading again
    const verifyUpdateResponse = await request(app)
      .get(`/api/properties/${createdPropertyId}`)
      .expect(200);

    expect(verifyUpdateResponse.body.title).toBe('Updated Integration Test Property');
    expect(verifyUpdateResponse.body.price).toBe(475000);

    // Step 6: Filter properties by status (should still find our property)
    const filterResponse = await request(app)
      .get('/api/properties?status=available')
      .expect(200);

    expect(filterResponse.body.properties).toHaveLength(1);
    expect(filterResponse.body.properties[0].id).toBe(createdPropertyId);

    // Step 7: Delete the property
    await request(app)
      .delete(`/api/properties/${createdPropertyId}`)
      .expect(200);

    // Step 8: Verify the property is deleted (should return 404)
    await request(app)
      .get(`/api/properties/${createdPropertyId}`)
      .expect(404);
  });

  test('Validation: Should reject invalid property creation', async () => {
    // Try to create property with invalid data
    const invalidProperty = {
      title: '', // Invalid: empty title
      address: 'Valid Address St',
      price: -1000 // Invalid: negative price
    };

    await request(app)
      .post('/api/properties')
      .send(invalidProperty)
      .expect(400);
  });

  test('Pagination: Should properly paginate results', async () => {
    // Create multiple properties for pagination test
    await request(app)
      .post('/api/properties')
      .send({
        title: 'Property 1',
        address: '101 First St',
        price: 300000
      })
      .expect(201);

    await request(app)
      .post('/api/properties')
      .send({
        title: 'Property 2',
        address: '102 Second St',
        price: 350000
      })
      .expect(201);

    // Test pagination with limit=1
    const paginatedResponse = await request(app)
      .get('/api/properties?limit=1&offset=0')
      .expect(200);

    expect(paginatedResponse.body.properties).toHaveLength(1);
    expect(paginatedResponse.body.limit).toBe(1);
    expect(paginatedResponse.body.offset).toBe(0);
    expect(paginatedResponse.body.total).toBeGreaterThanOrEqual(2);
  });
});