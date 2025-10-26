const express = require('express');

class PropertyEndpoint {
  constructor(commandHandler, queryHandler) {
    this.commandHandler = commandHandler;
    this.queryHandler = queryHandler;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // POST /api/properties - Create a property (Command)
    this.router.post('/', async (req, res) => {
      try {
        const { CreatePropertyCommand } = require('../application/command/property.command.abstraction');
        const command = new CreatePropertyCommand(req.body);
        const result = await this.commandHandler.handleCreatePropertyCommand(command);
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // GET /api/properties - Fetch all properties (Query)
    this.router.get('/', async (req, res) => {
      try {
        const { GetPropertiesQuery } = require('../application/query/property.query.abstraction');
        const query = new GetPropertiesQuery(req.query);
        const result = await this.queryHandler.handleGetPropertiesQuery(query);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // GET /api/properties/:id - Fetch a property by ID (Query)
    this.router.get('/:id', async (req, res) => {
      try {
        const { GetPropertyQuery } = require('../application/query/property.query.abstraction');
        const query = new GetPropertyQuery(req.params.id);
        const result = await this.queryHandler.handleGetPropertyQuery(query);
        res.json(result);
      } catch (error) {
        if (error.message === 'Property not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      }
    });

    // PUT /api/properties/:id - Update a property (Command)
    this.router.put('/:id', async (req, res) => {
      try {
        const { UpdatePropertyCommand } = require('../application/command/property.command.abstraction');
        const command = new UpdatePropertyCommand(req.params.id, req.body);
        const result = await this.commandHandler.handleUpdatePropertyCommand(command);
        res.json(result);
      } catch (error) {
        if (error.message === 'Property not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      }
    });

    // DELETE /api/properties/:id - Delete a property (Command)
    this.router.delete('/:id', async (req, res) => {
      try {
        const { DeletePropertyCommand } = require('../application/command/property.command.abstraction');
        const command = new DeletePropertyCommand(req.params.id);
        const result = await this.commandHandler.handleDeletePropertyCommand(command);
        res.json(result);
      } catch (error) {
        if (error.message === 'Property not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = PropertyEndpoint;