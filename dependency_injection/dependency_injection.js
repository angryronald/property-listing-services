const PropertyService = require('../src/property/domain/property.service');
const PropertyInMemoryRepository = require('../src/property/infrastructure/repository/inmemory/property.inmemory');
const PropertyCommandHandler = require('../src/property/application/command/property.command');
const PropertyQueryHandler = require('../src/property/application/query/property.query');
const PropertyEventPublisher = require('../src/property/infrastructure/event/publisher/property.publisher');
const PropertyEventSubscriber = require('../src/property/infrastructure/event/subscriber/property.subscriber');

class DependencyContainer {
  constructor() {
    this.services = new Map();
    this.initializeContainer();
  }

  initializeContainer() {
    // Register Property Service
    this.register('propertyService', () => new PropertyService());

    // Register Property Repository
    this.register('propertyRepository', () => new PropertyInMemoryRepository());

    // Register Event Publisher
    this.register('eventPublisher', () => new PropertyEventPublisher());

    // Register Event Subscriber (depends on publisher)
    this.register('eventSubscriber', () => {
      const publisher = this.resolve('eventPublisher');
      return new PropertyEventSubscriber(publisher);
    });

    // Register Command Handler (depends on service and repository)
    this.register('commandHandler', () => {
      const service = this.resolve('propertyService');
      const repository = this.resolve('propertyRepository');
      return new PropertyCommandHandler(service, repository);
    });

    // Register Query Handler (depends on repository)
    this.register('queryHandler', () => {
      const repository = this.resolve('propertyRepository');
      return new PropertyQueryHandler(repository);
    });
  }

  register(name, factory) {
    this.services.set(name, { factory, instance: null });
  }

  resolve(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }

    // Create instance if it doesn't exist (singleton pattern)
    if (!service.instance) {
      service.instance = service.factory();
    }

    return service.instance;
  }
}

module.exports = DependencyContainer;