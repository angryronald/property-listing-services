class PropertyEventPublisher {
  constructor() {
    this.subscribers = [];
  }

  subscribe(eventType, handler) {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(handler);
  }

  publish(eventType, data) {
    const eventHandlers = this.subscribers[eventType] || [];
    eventHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${eventType} handler:`, error);
      }
    });
  }
}

module.exports = PropertyEventPublisher;