const request = require('supertest');
const express = require('express');
const PropertyEndpoint = require('../property.endpoint');
const PropertyService = require('../../domain/property.service');
const PropertyInMemoryRepository = require('../../infrastructure/repository/inmemory/property.inmemory');
const PropertyCommandHandler = require('../../application/command/property.command');
const PropertyQueryHandler = require('../../application/query/property.query');

describe('Property Endpoint Integration Tests', () => {
  let app;
  let commandHandler;
  let queryHandler;
  let propertyEndpoint;

  beforeEach(() => {
    // Initialize all components
    const propertyService = new PropertyService();
    const propertyRepository = new PropertyInMemoryRepository();
    commandHandler = new PropertyCommandHandler(propertyService, propertyRepository);
    queryHandler = new PropertyQueryHandler(propertyRepository);
    
    // Create the endpoint with all handlers
    propertyEndpoint = new PropertyEndpoint(commandHandler, queryHandler);

    // Set up Express app
    app = express();
    app.use(express.json());
    app.use('/api/properties', propertyEndpoint.getRouter());
  });

  test('should create a property via POST endpoint', async () => {
    const newProperty = {
      title: 'Test Property',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000
    };

    const response = await request(app)
      .post('/api/properties')
      .send(newProperty)
      .expect(201);

    expect(response.body.title).toBe(newProperty.title);
    expect(response.body.description).toBe(newProperty.description);
    expect(response.body.address).toBe(newProperty.address);
    expect(response.body.price).toBe(newProperty.price);
    expect(response.body.id).toBeDefined();
  });

  test('should return error for invalid property data via POST endpoint', async () => {
    const invalidProperty = {
      title: '', // Invalid title
      address: '123 Test St',
      price: 250000
    };

    await request(app)
      .post('/api/properties')
      .send(invalidProperty)
      .expect(400);
  });

  test('should get all properties via GET endpoint', async () => {
    // First create a property
    await request(app)
      .post('/api/properties')
      .send({
        title: 'Test Property',
        address: '123 Test St',
        price: 250000
      })
      .expect(201);

    const response = await request(app)
      .get('/api/properties')
      .expect(200);

    expect(response.body.properties).toHaveLength(1);
    expect(response.body.total).toBe(1);
  });

  test('should get a property by ID via GET endpoint', async () => {
    // First create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .send({
        title: 'Test Property',
        address: '123 Test St',
        price: 250000
      })
      .expect(201);

    const propertyId = createResponse.body.id;

    const response = await request(app)
      .get(`/api/properties/${propertyId}`)
      .expect(200);

    expect(response.body.id).toBe(propertyId);
    expect(response.body.title).toBe('Test Property');
  });

  test('should return 404 for non-existing property via GET endpoint', async () => {
    await request(app)
      .get('/api/properties/999')
      .expect(404);
  });

  test('should update a property via PUT endpoint', async () => {
    // First create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .send({
        title: 'Original Property',
        address: '123 Original St',
        price: 250000
      })
      .expect(201);

    const propertyId = createResponse.body.id;

    const updateData = {
      title: 'Updated Property',
      price: 300000
    };

    const response = await request(app)
      .put(`/api/properties/${propertyId}`)
      .send(updateData)
      .expect(200);

    expect(response.body.title).toBe('Updated Property');
    expect(response.body.price).toBe(300000);
  });

  test('should return 404 when trying to update non-existing property', async () => {
    const updateData = {
      title: 'Updated Property',
      price: 300000
    };

    await request(app)
      .put('/api/properties/999')
      .send(updateData)
      .expect(404);
  });

  test('should delete a property via DELETE endpoint', async () => {
    // First create a property
    const createResponse = await request(app)
      .post('/api/properties')
      .send({
        title: 'Property to Delete',
        address: '789 Delete St',
        price: 200000
      })
      .expect(201);

    const propertyId = createResponse.body.id;

    // Verify property exists
    await request(app)
      .get(`/api/properties/${propertyId}`)
      .expect(200);

    // Delete the property
    await request(app)
      .delete(`/api/properties/${propertyId}`)
      .expect(200);

    // Verify property is deleted
    await request(app)
      .get(`/api/properties/${propertyId}`)
      .expect(404);
  });

  test('should return 404 when trying to delete non-existing property', async () => {
    await request(app)
      .delete('/api/properties/999')
      .expect(404);
  });
});