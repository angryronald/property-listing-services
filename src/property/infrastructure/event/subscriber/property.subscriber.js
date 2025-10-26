class PropertyEventSubscriber {
  constructor(eventPublisher) {
    this.eventPublisher = eventPublisher;
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    // Example: Handle property created event
    this.eventPublisher.subscribe('property.created', (property) => {
      console.log(`Property created: ${property.title} at ${property.address}`);
    });

    // Example: Handle property updated event
    this.eventPublisher.subscribe('property.updated', (property) => {
      console.log(`Property updated: ${property.title}`);
    });

    // Example: Handle property deleted event
    this.eventPublisher.subscribe('property.deleted', (propertyId) => {
      console.log(`Property deleted with ID: ${propertyId}`);
    });
  }
}

module.exports = PropertyEventSubscriber;