const PropertyQueryHandler = require('../property.query');
const { GetPropertyQuery, GetPropertiesQuery } = require('../property.query.abstraction');

// Mock repository
class MockPropertyRepository {
  constructor() {
    this.properties = [
      {
        id: 1,
        title: 'Available Property',
        description: 'A beautiful property',
        address: '123 Test St',
        price: 250000,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Sold Property',
        description: 'A sold property',
        address: '456 Sold St',
        price: 300000,
        status: 'sold',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  async save(property) {
    this.properties.push(property);
    return property;
  }

  async findById(id) {
    return this.properties.find(p => p.id == id) || null;
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

describe('Property Query Handler', () => {
  let queryHandler;
  let mockRepository;

  beforeEach(() => {
    mockRepository = new MockPropertyRepository();
    queryHandler = new PropertyQueryHandler(mockRepository);
  });

  describe('Get Property Query', () => {
    test('should get a property by ID successfully', async () => {
      const query = new GetPropertyQuery(1);
      const result = await queryHandler.handleGetPropertyQuery(query);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Available Property');
    });

    test('should throw error when property does not exist', async () => {
      const query = new GetPropertyQuery(999);

      await expect(queryHandler.handleGetPropertyQuery(query))
        .rejects
        .toThrow('Property not found');
    });
  });

  describe('Get Properties Query', () => {
    test('should get all properties without filters', async () => {
      const query = new GetPropertiesQuery();
      const result = await queryHandler.handleGetPropertiesQuery(query);

      expect(result.properties).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    test('should filter properties by status', async () => {
      const query = new GetPropertiesQuery({ status: 'available' });
      const result = await queryHandler.handleGetPropertiesQuery(query);

      expect(result.properties).toHaveLength(1);
      expect(result.properties[0].status).toBe('available');
      expect(result.total).toBe(1);
    });

    test('should apply pagination correctly', async () => {
      const query = new GetPropertiesQuery({ limit: 1, offset: 0 });
      const result = await queryHandler.handleGetPropertiesQuery(query);

      expect(result.properties).toHaveLength(1);
      expect(result.limit).toBe(1);
      expect(result.offset).toBe(0);
      expect(result.total).toBe(2);
    });

    test('should search properties by title', async () => {
      const query = new GetPropertiesQuery({ search: 'Available' });
      const result = await queryHandler.handleGetPropertiesQuery(query);

      expect(result.properties).toHaveLength(1);
      expect(result.properties[0].title).toContain('Available');
    });
  });
});