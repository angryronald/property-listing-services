class GetPropertyQuery {
  constructor(id) {
    this.id = id;
  }
}

class GetPropertiesQuery {
  constructor(filters = {}) {
    this.filters = filters;
  }
}

module.exports = {
  GetPropertyQuery,
  GetPropertiesQuery
};