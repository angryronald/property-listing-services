class CreatePropertyCommand {
  constructor(data) {
    this.data = data;
  }
}

class UpdatePropertyCommand {
  constructor(id, data) {
    this.id = id;
    this.data = data;
  }
}

class DeletePropertyCommand {
  constructor(id) {
    this.id = id;
  }
}

module.exports = {
  CreatePropertyCommand,
  UpdatePropertyCommand,
  DeletePropertyCommand
};