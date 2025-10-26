const { GetPropertyQuery, GetPropertiesQuery } = require('./property.query.abstraction');
const AbstractPropertyQueryHandler = require('./property.query.abstract.handler');

class PropertyQueryHandler extends AbstractPropertyQueryHandler {
  constructor(propertyRepository) {
    super();
    this.propertyRepository = propertyRepository;
  }

  async handleGetPropertyQuery(query) {
    const property = await this.propertyRepository.findById(query.id);
    if (!property) {
      throw new Error('Property not found');
    }
    return property;
  }

  async handleGetPropertiesQuery(query) {
    return await this.propertyRepository.findAll(query.filters);
  }
}

module.exports = PropertyQueryHandler;