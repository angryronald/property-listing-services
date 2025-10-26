const PropertyInMemoryRepository = require('../inmemory/property.inmemory');
const Property = require('../../../domain/property.entity');

describe('Property Repository', () => {
  let repository;

  beforeEach(() => {
    repository = new PropertyInMemoryRepository();
  });

  test('should save a property', async () => {
    const property = new Property({
      id: 1,
      title: 'Test Property',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000
    });

    const result = await repository.save(property);

    expect(result).toBe(property);
    expect(repository.properties).toHaveLength(1);
    expect(repository.properties[0]).toBe(property);
  });

  test('should update an existing property', async () => {
    const property = new Property({
      id: 1,
      title: 'Original Property',
      description: 'Original description',
      address: '123 Original St',
      price: 250000
    });

    await repository.save(property);

    property.updateTitle('Updated Property');
    const updatedResult = await repository.update(1, property);

    expect(updatedResult).toBe(property);
    expect(repository.properties[0].title).toBe('Updated Property');
  });

  test('should find a property by ID', async () => {
    const property = new Property({
      id: 1,
      title: 'Test Property',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000
    });

    await repository.save(property);

    const result = await repository.findById(1);

    expect(result).toBe(property);
  });

  test('should return null for non-existing property', async () => {
    const result = await repository.findById(999);

    expect(result).toBeNull();
  });

  test('should find all properties', async () => {
    const property1 = new Property({
      id: 1,
      title: 'Property 1',
      address: '123 Test St',
      price: 250000
    });

    const property2 = new Property({
      id: 2,
      title: 'Property 2',
      address: '456 Test St',
      price: 300000
    });

    await repository.save(property1);
    await repository.save(property2);

    const result = await repository.findAll();

    expect(result.properties).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  test('should filter properties by status', async () => {
    const property1 = new Property({
      id: 1,
      title: 'Available Property',
      address: '123 Test St',
      price: 250000,
      status: 'available'
    });

    const property2 = new Property({
      id: 2,
      title: 'Sold Property',
      address: '456 Test St',
      price: 300000,
      status: 'sold'
    });

    await repository.save(property1);
    await repository.save(property2);

    const result = await repository.findAll({ status: 'available' });

    expect(result.properties).toHaveLength(1);
    expect(result.properties[0].status).toBe('available');
    expect(result.total).toBe(1);
  });

  test('should apply pagination correctly', async () => {
    // Add multiple properties
    for (let i = 1; i <= 5; i++) {
      const property = new Property({
        id: i,
        title: `Property ${i}`,
        address: `${i} Test St`,
        price: 200000 + i * 10000
      });
      await repository.save(property);
    }

    // Test pagination
    const result = await repository.findAll({ limit: 2, offset: 0 });

    expect(result.properties).toHaveLength(2);
    expect(result.limit).toBe(2);
    expect(result.offset).toBe(0);
    expect(result.total).toBe(5);
  });

  test('should search properties by title', async () => {
    const property1 = new Property({
      id: 1,
      title: 'Beautiful Villa',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000
    });

    const property2 = new Property({
      id: 2,
      title: 'Modern Apartment',
      description: 'A modern property',
      address: '456 Test St',
      price: 300000
    });

    await repository.save(property1);
    await repository.save(property2);

    const result = await repository.findAll({ search: 'Beautiful' });

    expect(result.properties).toHaveLength(1);
    expect(result.properties[0].title).toBe('Beautiful Villa');
  });

  test('should delete a property', async () => {
    const property = new Property({
      id: 1,
      title: 'Property to Delete',
      address: '789 Delete St',
      price: 200000
    });

    await repository.save(property);
    expect(repository.properties).toHaveLength(1);

    await repository.delete(1);

    expect(repository.properties).toHaveLength(0);
  });

  test('should throw error when deleting non-existing property', async () => {
    await expect(repository.delete(999))
      .rejects
      .toThrow('Property not found');
  });

  test('should throw error when updating non-existing property', async () => {
    const property = new Property({
      id: 999,
      title: 'Non-existing Property',
      address: '999 Test St',
      price: 200000
    });

    await expect(repository.update(999, property))
      .rejects
      .toThrow('Property not found');
  });
});