// Abstract command handler base class
class PropertyCommandHandler {
  async handleCreatePropertyCommand(command) {
    throw new Error('Method not implemented');
  }

  async handleUpdatePropertyCommand(command) {
    throw new Error('Method not implemented');
  }

  async handleDeletePropertyCommand(command) {
    throw new Error('Method not implemented');
  }
}

module.exports = PropertyCommandHandler;