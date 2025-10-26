const DependencyContainer = require('../dependency_injection/dependency_injection');
const PropertyService = require('../src/property/domain/property.service');
const PropertyInMemoryRepository = require('../src/property/infrastructure/repository/inmemory/property.inmemory');
const PropertyCommandHandler = require('../src/property/application/command/property.command');
const PropertyQueryHandler = require('../src/property/application/query/property.query');

describe('Dependency Injection Container', () => {
  let container;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  test('should resolve property service', () => {
    const service = container.resolve('propertyService');
    expect(service).toBeInstanceOf(PropertyService);
  });

  test('should resolve property repository', () => {
    const repository = container.resolve('propertyRepository');
    expect(repository).toBeInstanceOf(PropertyInMemoryRepository);
  });

  test('should resolve command handler', () => {
    const handler = container.resolve('commandHandler');
    expect(handler).toBeInstanceOf(PropertyCommandHandler);
  });

  test('should resolve query handler', () => {
    const handler = container.resolve('queryHandler');
    expect(handler).toBeInstanceOf(PropertyQueryHandler);
  });

  test('should maintain singleton instances', () => {
    const service1 = container.resolve('propertyService');
    const service2 = container.resolve('propertyService');
    
    expect(service1).toBe(service2); // Same instance
  });

  test('should resolve dependencies in correct order', () => {
    const commandHandler = container.resolve('commandHandler');
    const queryHandler = container.resolve('queryHandler');
    
    // Both handlers should exist and have their dependencies resolved
    expect(commandHandler).toBeDefined();
    expect(queryHandler).toBeDefined();
    expect(commandHandler.propertyService).toBeDefined();
    expect(commandHandler.propertyRepository).toBeDefined();
    expect(queryHandler.propertyRepository).toBeDefined();
  });

  test('should throw error for unregistered service', () => {
    expect(() => {
      container.resolve('nonexistentService');
    }).toThrow('Service nonexistentService not registered');
  });
});