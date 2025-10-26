const { CreatePropertyCommand, UpdatePropertyCommand, DeletePropertyCommand } = require('./property.command.abstraction');
const PropertyRepository = require('../../infrastructure/repository/property.repository');
const AbstractPropertyCommandHandler = require('./property.command.abstract.handler');

class PropertyCommandHandler extends AbstractPropertyCommandHandler {
  constructor(propertyService, propertyRepository) {
    super();
    this.propertyService = propertyService;
    this.propertyRepository = propertyRepository;
  }

  async handleCreatePropertyCommand(command) {
    // Validate the command data
    const errors = this.propertyService.validatePropertyData(command.data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Create the property using domain service
    const property = this.propertyService.createProperty(command.data);

    // Save to repository
    await this.propertyRepository.save(property);

    return property;
  }

  async handleUpdatePropertyCommand(command) {
    // Find the existing property
    const existingProperty = await this.propertyRepository.findById(command.id);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    // Validate the update data
    const errors = this.propertyService.validatePropertyData(command.data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Update the property using domain service
    const updatedProperty = this.propertyService.updateProperty(existingProperty, command.data);

    // Save the updated property
    await this.propertyRepository.update(command.id, updatedProperty);

    return updatedProperty;
  }

  async handleDeletePropertyCommand(command) {
    // Check if property exists
    const existingProperty = await this.propertyRepository.findById(command.id);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    // Delete from repository
    await this.propertyRepository.delete(command.id);

    return { message: 'Property deleted successfully' };
  }
}

module.exports = PropertyCommandHandler;