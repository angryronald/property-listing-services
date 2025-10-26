const express = require('express');
const container = require('./dependency_injection/dependency_injection.initiation');

// Create the express app
const app = express();

// Middleware
app.use(express.json());

// Get the property endpoint using dependency injection
const PropertyEndpoint = require('./src/property/endpoint/property.endpoint');
const commandHandler = container.resolve('commandHandler');
const queryHandler = container.resolve('queryHandler');
const propertyEndpoint = new PropertyEndpoint(commandHandler, queryHandler);

// Register routes
app.use('/api/properties', propertyEndpoint.getRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;