const Property = require('../property.entity');

describe('Property Entity', () => {
  test('should create a valid property', () => {
    const property = new Property({
      id: 1,
      title: 'Test Property',
      description: 'A beautiful property',
      address: '123 Test St',
      price: 250000
    });

    expect(property.id).toBe(1);
    expect(property.title).toBe('Test Property');
    expect(property.description).toBe('A beautiful property');
    expect(property.address).toBe('123 Test St');
    expect(property.price).toBe(250000);
    expect(property.status).toBe('available');
    expect(property.createdAt).toBeDefined();
    expect(property.updatedAt).toBeDefined();
  });

  test('should throw error for invalid title', () => {
    expect(() => {
      new Property({
        id: 1,
        title: '',
        address: '123 Test St',
        price: 250000
      });
    }).toThrow('Title is required and must be a non-empty string');

    expect(() => {
      new Property({
        id: 1,
        title: null,
        address: '123 Test St',
        price: 250000
      });
    }).toThrow('Title is required and must be a non-empty string');
  });

  test('should throw error for invalid address', () => {
    expect(() => {
      new Property({
        id: 1,
        title: 'Test Property',
        address: '',
        price: 250000
      });
    }).toThrow('Address is required and must be a non-empty string');

    expect(() => {
      new Property({
        id: 1,
        title: 'Test Property',
        address: null,
        price: 250000
      });
    }).toThrow('Address is required and must be a non-empty string');
  });

  test('should throw error for invalid price', () => {
    expect(() => {
      new Property({
        id: 1,
        title: 'Test Property',
        address: '123 Test St',
        price: -100
      });
    }).toThrow('Price must be a positive number');

    expect(() => {
      new Property({
        id: 1,
        title: 'Test Property',
        address: '123 Test St',
        price: 0
      });
    }).toThrow('Price must be a positive number');

    expect(() => {
      new Property({
        id: 1,
        title: 'Test Property',
        address: '123 Test St',
        price: null
      });
    }).toThrow('Price is required');
  });

  test('should update property fields correctly', () => {
    const property = new Property({
      id: 1,
      title: 'Original Property',
      description: 'Original description',
      address: '123 Original St',
      price: 250000
    });

    property.updateTitle('Updated Property');
    expect(property.title).toBe('Updated Property');

    property.updateDescription('Updated description');
    expect(property.description).toBe('Updated description');

    property.updateAddress('456 Updated Ave');
    expect(property.address).toBe('456 Updated Ave');

    property.updatePrice(300000);
    expect(property.price).toBe(300000);

    property.updateStatus('sold');
    expect(property.status).toBe('sold');
  });

  test('should check availability correctly', () => {
    const availableProperty = new Property({
      id: 1,
      title: 'Available Property',
      address: '123 Test St',
      price: 250000,
      status: 'available'
    });

    const soldProperty = new Property({
      id: 2,
      title: 'Sold Property',
      address: '456 Test St',
      price: 300000,
      status: 'sold'
    });

    expect(availableProperty.isAvailable()).toBe(true);
    expect(soldProperty.isAvailable()).toBe(false);
  });
});