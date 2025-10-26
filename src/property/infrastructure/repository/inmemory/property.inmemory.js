const PropertyRepository = require('../property.repository');

class PropertyInMemoryRepository extends PropertyRepository {
  constructor() {
    super();
    this.properties = [];
  }

  async save(property) {
    const existingIndex = this.properties.findIndex(p => p.id === property.id);
    if (existingIndex !== -1) {
      this.properties[existingIndex] = property;
    } else {
      this.properties.push(property);
    }
    return property;
  }

  async findById(id) {
    return this.properties.find(property => property.id === parseInt(id)) || null;
  }

  async findAll(filters = {}) {
    let result = [...this.properties];

    // Apply filters
    if (filters.status) {
      result = result.filter(property => property.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const limit = parseInt(filters.limit) || result.length;
    const offset = parseInt(filters.offset) || 0;

    const paginatedResult = result.slice(offset, offset + limit);

    return {
      properties: paginatedResult,
      total: result.length,
      limit: limit,
      offset: offset
    };
  }

  async update(id, property) {
    const index = this.properties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.properties[index] = property;
      return property;
    }
    throw new Error('Property not found');
  }

  async delete(id) {
    const index = this.properties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.properties.splice(index, 1);
      return true;
    }
    throw new Error('Property not found');
  }
}

module.exports = PropertyInMemoryRepository;