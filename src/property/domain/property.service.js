const Property = require('./property.entity');
const { PropertyService: AbstractPropertyService } = require('./property.abstraction');

class PropertyService extends AbstractPropertyService {
  constructor() {
    super();
    this.nextId = 1;
  }

  createProperty({ title, description, address, price, status }) {
    const property = new Property({
      id: this.nextId++,
      title,
      description,
      address,
      price,
      status
    });
    
    return property;
  }

  updateProperty(property, updateData) {
    const { title, description, address, price, status } = updateData;
    
    if (title !== undefined) {
      property.updateTitle(title);
    }
    
    if (description !== undefined) {
      property.updateDescription(description);
    }
    
    if (address !== undefined) {
      property.updateAddress(address);
    }
    
    if (price !== undefined) {
      property.updatePrice(price);
    }
    
    if (status !== undefined) {
      property.updateStatus(status);
    }
    
    return property;
  }

  validatePropertyData(data) {
    const errors = [];
    
    if (data.title !== undefined && (data.title === null || data.title === '')) {
      errors.push('Title is required and must be a non-empty string');
    }
    
    if (data.address !== undefined && (data.address === null || data.address === '')) {
      errors.push('Address is required and must be a non-empty string');
    }
    
    if (data.price !== undefined) {
      if (data.price === null || data.price === undefined) {
        errors.push('Price is required');
      } else if (typeof data.price !== 'number' || data.price <= 0) {
        errors.push('Price must be a positive number');
      }
    }
    
    return errors;
  }
}

module.exports = PropertyService;