// Abstract service class that provides a base for all service implementations
class PropertyService {
  createProperty(data) {
    throw new Error('Method not implemented');
  }

  updateProperty(property, updateData) {
    throw new Error('Method not implemented');
  }

  validatePropertyData(data) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  PropertyService
};