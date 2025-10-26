const PropertyService = require('../property.service');
const Property = require('../property.entity');

describe('Property Service', () => {
  let propertyService;

  beforeEach(() => {
    propertyService = new PropertyService();
  });

  test('should create a property correctly', () => {
    const data = {
      title: 'Test Property',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000,
      status: 'available'
    };

    const property = propertyService.createProperty(data);

    expect(property).toBeInstanceOf(Property);
    expect(property.title).toBe('Test Property');
    expect(property.description).toBe('A beautiful property');
    expect(property.address).toBe('123 Test St');
    expect(property.price).toBe(250000);
    expect(property.status).toBe('available');
    expect(property.id).toBe(1); // First property should have id 1
  });

  test('should update property correctly', () => {
    const originalProperty = new Property({
      id: 1,
      title: 'Original Property',
      description: 'Original description',
      address: '123 Original St',
      price: 250000
    });

    const updateData = {
      title: 'Updated Property',
      price: 300000,
      status: 'sold'
    };

    const updatedProperty = propertyService.updateProperty(originalProperty, updateData);

    expect(updatedProperty.title).toBe('Updated Property');
    expect(updatedProperty.price).toBe(300000);
    expect(updatedProperty.status).toBe('sold');
    // Description and address should remain unchanged
    expect(updatedProperty.description).toBe('Original description');
    expect(updatedProperty.address).toBe('123 Original St');
  });

  test('should validate property data correctly', () => {
    // Valid data should have no errors
    const validData = {
      title: 'Valid Property',
      address: '123 Valid St',
      price: 250000
    };
    const noErrors = propertyService.validatePropertyData(validData);
    expect(noErrors).toHaveLength(0);

    // Invalid data should have errors
    const invalidData = {
      title: '',
      price: -100
    };
    const errors = propertyService.validatePropertyData(invalidData);
    expect(errors).toContain('Title is required and must be a non-empty string');
    expect(errors).toContain('Price must be a positive number');
  });

  test('should validate partial update data correctly', () => {
    // Test validation of partial data (only title)
    const partialData = { title: '' };
    const errors = propertyService.validatePropertyData(partialData);
    expect(errors).toContain('Title is required and must be a non-empty string');

    // Test validation of partial data (only address)
    const partialData2 = { address: '' };
    const errors2 = propertyService.validatePropertyData(partialData2);
    expect(errors2).toContain('Address is required and must be a non-empty string');

    // Test validation of partial data (only price)
    const partialData3 = { price: -500 };
    const errors3 = propertyService.validatePropertyData(partialData3);
    expect(errors3).toContain('Price must be a positive number');
  });
});