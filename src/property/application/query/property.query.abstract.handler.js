// Abstract query handler base class
class PropertyQueryHandler {
  async handleGetPropertyQuery(query) {
    throw new Error('Method not implemented');
  }

  async handleGetPropertiesQuery(query) {
    throw new Error('Method not implemented');
  }
}

module.exports = PropertyQueryHandler;