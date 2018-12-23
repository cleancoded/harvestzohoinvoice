const invoiceCreate = require('./creates/invoice');

const handleHttpError = (response, z) => {
  if (response.status >= 400) {
    z.console.log(`Status: ${response.status}`);
    z.console.log(`Content: ${response.content}`);
    z.console.log(`Request: ${JSON.stringify(response.request)}`);
  }

  return response;
};

const addOrganizationHeader = (request, z, bundle) => {
  request.headers['X-com-zoho-invoice-organizationid'] = bundle.inputData.organizationId;

  return request;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  beforeRequest: [
    addOrganizationHeader
  ],

  afterResponse: [
    handleHttpError
  ],

  resources: {
  },

  triggers: {
  },

  searches: {
  },

  creates: {
    [invoiceCreate.key]: invoiceCreate
  }
};

module.exports = App;
