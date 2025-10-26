class Property {
  constructor({
    id,
    title,
    description = '',
    address,
    price,
    status = 'available',
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.title = this.validateTitle(title);
    this.description = description;
    this.address = this.validateAddress(address);
    this.price = this.validatePrice(price);
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  validateTitle(title) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title is required and must be a non-empty string');
    }
    return title.trim();
  }

  validateAddress(address) {
    if (!address || typeof address !== 'string' || address.trim() === '') {
      throw new Error('Address is required and must be a non-empty string');
    }
    return address.trim();
  }

  validatePrice(price) {
    if (price === undefined || price === null) {
      throw new Error('Price is required');
    }
    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Price must be a positive number');
    }
    return price;
  }

  updateTitle(title) {
    this.title = this.validateTitle(title);
    this.updatedAt = new Date().toISOString();
  }

  updateDescription(description) {
    this.description = description || '';
    this.updatedAt = new Date().toISOString();
  }

  updateAddress(address) {
    this.address = this.validateAddress(address);
    this.updatedAt = new Date().toISOString();
  }

  updatePrice(price) {
    this.price = this.validatePrice(price);
    this.updatedAt = new Date().toISOString();
  }

  updateStatus(status) {
    this.status = status;
    this.updatedAt = new Date().toISOString();
  }

  isAvailable() {
    return this.status === 'available';
  }
}

module.exports = Property;