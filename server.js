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
    status: req.body.status || 'available', // Added status field for filtering
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, properties };