const PropertyCommandHandler = require('../property.command');
const PropertyService = require('../../../domain/property.service');
const { CreatePropertyCommand, UpdatePropertyCommand, DeletePropertyCommand } = require('../property.command.abstraction');

// Mock repository
class MockPropertyRepository {
  constructor() {
    this.properties = [];
    this.nextId = 1;
  }

  async save(property) {
    if (!property.id) {
      property.id = this.nextId++;
    }
    this.properties.push(property);
    return property;
  }

  async findById(id) {
    return this.properties.find(p => p.id == id) || null;
  }

  async findAll() {
    return this.properties;
  }

  async update(id, property) {
    const index = this.properties.findIndex(p => p.id == id);
    if (index !== -1) {
      this.properties[index] = property;
      return property;
    }
    throw new Error('Property not found');
  }

  async delete(id) {
    const index = this.properties.findIndex(p => p.id == id);
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    throw new Error('Property not found');
  }
}

describe('Property Command Handler', () => {
  let commandHandler;
  let propertyService;
  let mockRepository;

  beforeEach(() => {
    propertyService = new PropertyService();
    mockRepository = new MockPropertyRepository();
    commandHandler = new PropertyCommandHandler(propertyService, mockRepository);
  });

  describe('Create Property Command', () => {
    test('should create a property successfully', async () => {
      const command = new CreatePropertyCommand({
        title: 'New Property',
        description: 'Beautiful property',
        address: '456 New St',
        price: 300000
      });

      const result = await commandHandler.handleCreatePropertyCommand(command);

      expect(result).toBeDefined();
      expect(result.title).toBe('New Property');
      expect(result.address).toBe('456 New St');
      expect(result.price).toBe(300000);
      expect(result.id).toBe(1);
    });

    test('should throw error for invalid property data', async () => {
      const command = new CreatePropertyCommand({
        title: '', // Invalid title
        address: '456 New St',
        price: 300000
      });

      await expect(commandHandler.handleCreatePropertyCommand(command))
        .rejects
        .toThrow('Validation failed: Title is required and must be a non-empty string');
    });
  });

  describe('Update Property Command', () => {
    test('should update a property successfully', async () => {
      // First create a property
      const createCommand = new CreatePropertyCommand({
        title: 'Original Property',
        address: '123 Old St',
        price: 250000
      });
      const createdProperty = await commandHandler.handleCreatePropertyCommand(createCommand);

      // Now update the property
      const updateCommand = new UpdatePropertyCommand(createdProperty.id, {
        title: 'Updated Property',
        price: 350000
      });

      const result = await commandHandler.handleUpdatePropertyCommand(updateCommand);

      expect(result.title).toBe('Updated Property');
      expect(result.price).toBe(350000);
      expect(result.address).toBe('123 Old St'); // Should remain unchanged
    });

    test('should throw error when property does not exist', async () => {
      const updateCommand = new UpdatePropertyCommand(999, {
        title: 'Updated Property'
      });

      await expect(commandHandler.handleUpdatePropertyCommand(updateCommand))
        .rejects
        .toThrow('Property not found');
    });

    test('should throw error for invalid update data', async () => {
      // First create a property
      const createCommand = new CreatePropertyCommand({
        title: 'Original Property',
        address: '123 Old St',
        price: 250000
      });
      const createdProperty = await commandHandler.handleCreatePropertyCommand(createCommand);

      // Now try to update with invalid data
      const updateCommand = new UpdatePropertyCommand(createdProperty.id, {
        title: '', // Invalid title
        price: -100 // Invalid price
      });

      await expect(commandHandler.handleUpdatePropertyCommand(updateCommand))
        .rejects
        .toThrow('Validation failed: Title is required and must be a non-empty string, Price must be a positive number');
    });
  });

  describe('Delete Property Command', () => {
    test('should delete a property successfully', async () => {
      // First create a property
      const createCommand = new CreatePropertyCommand({
        title: 'Property to Delete',
        address: '789 Delete St',
        price: 200000
      });
      const createdProperty = await commandHandler.handleCreatePropertyCommand(createCommand);

      // Verify property exists
      const existingProperty = await mockRepository.findById(createdProperty.id);
      expect(existingProperty).toBeDefined();

      // Delete the property
      const deleteCommand = new DeletePropertyCommand(createdProperty.id);
      const result = await commandHandler.handleDeletePropertyCommand(deleteCommand);

      expect(result).toEqual({ message: 'Property deleted successfully' });

      // Verify property is deleted
      const deletedProperty = await mockRepository.findById(createdProperty.id);
      expect(deletedProperty).toBeNull();
    });

    test('should throw error when property does not exist', async () => {
      const deleteCommand = new DeletePropertyCommand(999);

      await expect(commandHandler.handleDeletePropertyCommand(deleteCommand))
        .rejects
        .toThrow('Property not found');
    });
  });
});