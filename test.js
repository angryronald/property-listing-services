const request = require('supertest');
const express = require('express');
const app = express();

// In-memory data storage
let properties = [];
let nextId = 1;

// Middleware
app.use(express.json());

// Validation helper
const validateProperty = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate || (isUpdate && 'title' in data)) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Title is required and must be a non-empty string');
    }
  }
  
  if (!isUpdate || (isUpdate && 'address' in data)) {
    if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
      errors.push('Address is required and must be a non-empty string');
    }
  }
  
  if (!isUpdate || (isUpdate && 'price' in data)) {
    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('Price must be a positive number');
    }
  }
  
  return errors;
};

// Helper to find property by ID
const findPropertyById = (id) => {
  return properties.find(property => property.id === parseInt(id));
};

// POST /api/properties - Create a property
app.post('/api/properties', (req, res) => {
  const errors = validateProperty(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  const newProperty = {
    id: nextId++,
    title: req.body.title,
    description: req.body.description || '',
    address: req.body.address,
    price: req.body.price,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// GET /api/properties - Fetch all properties
app.get('/api/properties', (req, res) => {
  let result = [...properties];
  
  // Optional filtering by status
  if (req.query.status) {
    result = result.filter(property => property.status === req.query.status);
  }
  
  // Optional pagination
  const limit = parseInt(req.query.limit) || result.length;
  const offset = parseInt(req.query.offset) || 0;
  
  const paginatedResult = result.slice(offset, offset + limit);
  
  res.json({
    properties: paginatedResult,
    total: result.length,
    limit: limit,
    offset: offset
  });
});

// GET /api/properties/:id - Fetch a property by ID
app.get('/api/properties/:id', (req, res) => {
  const property = findPropertyById(req.params.id);
  
  if (!property) {
    return res.status(404).json({ 
      error: 'Property not found' 
    });
  }
  
  res.json(property);
});

// PUT /api/properties/:id - Update a property
app.put('/api/properties/:id', (req, res) => {
  const propertyIndex = properties.findIndex(property => property.id === parseInt(req.params.id));
  
  if (propertyIndex === -1) {
    return res.status(404).json({ 
      error: 'Property not found' 
    });
  }
  
  // Merge existing property with update data
  const updatedData = { ...properties[propertyIndex], ...req.body, id: parseInt(req.params.id) };
  const errors = validateProperty(updatedData, true);
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }
  
  // Update the updatedAt timestamp
  updatedData.updatedAt = new Date().toISOString();
  
  properties[propertyIndex] = updatedData;
  res.json(updatedData);
});

// DELETE /api/properties/:id - Delete a property
app.delete('/api/properties/:id', (req, res) => {
  const propertyIndex = properties.findIndex(property => property.id === parseInt(req.params.id));
  
  if (propertyIndex === -1) {
    return res.status(404).json({ 
      error: 'Property not found' 
    });
  }
  
  properties.splice(propertyIndex, 1);
  res.json({ 
    message: 'Property deleted successfully' 
  });
});

describe('Property Listing API', () => {
  beforeEach(() => {
    // Reset properties array before each test
    properties.length = 0;
    nextId = 1;
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const newProperty = {
        title: "Luxury Apartment",
        description: "A beautiful apartment in downtown.",
        address: "123 Main St",
        price: 250000
      };

      const response = await request(app)
        .post('/api/properties')
        .send(newProperty)
        .expect(201);

      expect(response.body.title).toBe(newProperty.title);
      expect(response.body.description).toBe(newProperty.description);
      expect(response.body.address).toBe(newProperty.address);
      expect(response.body.price).toBe(newProperty.price);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should return 400 for invalid property data', async () => {
      const invalidProperty = {
        title: "", // Empty title
        address: "123 Main St",
        price: 250000
      };

      await request(app)
        .post('/api/properties')
        .send(invalidProperty)
        .expect(400);
    });
  });

  describe('GET /api/properties', () => {
    it('should return all properties', async () => {
      // Add some test properties
      await request(app)
        .post('/api/properties')
        .send({
          title: "Test Property 1",
          address: "456 Oak Ave",
          price: 300000
        })
        .expect(201);

      await request(app)
        .post('/api/properties')
        .send({
          title: "Test Property 2",
          address: "789 Pine St",
          price: 400000
        })
        .expect(201);

      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.properties).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });
  });

  describe('GET /api/properties/:id', () => {
    it('should return a property by ID', async () => {
      // Create a property first
      const response = await request(app)
        .post('/api/properties')
        .send({
          title: "Test Property",
          address: "456 Oak Ave",
          price: 300000
        })
        .expect(201);

      const propertyId = response.body.id;

      const getResponse = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(propertyId);
      expect(getResponse.body.title).toBe("Test Property");
    });

    it('should return 404 for non-existent property', async () => {
      await request(app)
        .get('/api/properties/999')
        .expect(404);
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('should update a property', async () => {
      // Create a property first
      const response = await request(app)
        .post('/api/properties')
        .send({
          title: "Original Property",
          address: "Original Address",
          price: 300000
        })
        .expect(201);

      const propertyId = response.body.id;

      const updatedData = {
        title: "Updated Property",
        price: 350000
      };

      const putResponse = await request(app)
        .put(`/api/properties/${propertyId}`)
        .send(updatedData)
        .expect(200);

      expect(putResponse.body.title).toBe("Updated Property");
      expect(putResponse.body.price).toBe(350000);
      expect(putResponse.body.updatedAt).not.toBe(putResponse.body.createdAt);
    });

    it('should return 404 for non-existent property', async () => {
      await request(app)
        .put('/api/properties/999')
        .send({
          title: "Updated Property",
          price: 350000
        })
        .expect(404);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('should delete a property', async () => {
      // Create a property first
      const response = await request(app)
        .post('/api/properties')
        .send({
          title: "Property to Delete",
          address: "Some Address",
          price: 200000
        })
        .expect(201);

      const propertyId = response.body.id;

      await request(app)
        .delete(`/api/properties/${propertyId}`)
        .expect(200);

      // Verify the property is deleted
      await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(404);
    });

    it('should return 404 for non-existent property', async () => {
      await request(app)
        .delete('/api/properties/999')
        .expect(404);
    });
  });
});