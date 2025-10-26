const DependencyContainer = require('./dependency_injection');

// Create and configure the container
const container = new DependencyContainer();

// Initialize subscribers (this registers event handlers)
container.resolve('eventSubscriber');

module.exports = container;