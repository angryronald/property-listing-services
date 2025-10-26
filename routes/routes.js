const express = require('express');
const PropertyEndpoint = require('../src/property/endpoint/property.endpoint');
const PropertyService = require('../src/property/domain/property.service');
const PropertyInMemoryRepository = require('../src/property/infrastructure/repository/inmemory/property.inmemory');
const PropertyCommandHandler = require('../src/property/application/command/property.command');
const PropertyQueryHandler = require('../src/property/application/query/property.query');

// Initialize all components
const propertyService = new PropertyService();
const propertyRepository = new PropertyInMemoryRepository();
const commandHandler = new PropertyCommandHandler(propertyService, propertyRepository);
const queryHandler = new PropertyQueryHandler(propertyRepository);

// Create the endpoint with all handlers
const propertyEndpoint = new PropertyEndpoint(commandHandler, queryHandler);

const router = express.Router();

// Mount property routes under /api/properties
router.use('/api/properties', propertyEndpoint.getRouter());

module.exports = router;