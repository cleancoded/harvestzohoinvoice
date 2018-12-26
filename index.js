const invoiceCreate = require('./creates/invoice');
const organization = require('./resources/organization');
const item = require('./resources/item');
const contact = require('./resources/contact');
const authentication = require('./authentication');
const middleware = require('./middleware');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    middleware.addZohoHeaders
  ],

  afterResponse: [
    middleware.handleHttpError
  ],

  resources: {
  },

  triggers: {
    [organization.key]: organization,
    [contact.key]: contact,
    [item.key]: item
  },

  searches: {
  },

  creates: {
    [invoiceCreate.key]: invoiceCreate
  }
};

module.exports = App;
