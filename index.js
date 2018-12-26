const invoiceCreate = require('./creates/invoice');
const organization = require('./resources/organization');
const item = require('./resources/item');
const authentication = require('./authentication');

const handleHttpError = (response, z) => {
  if (response.status >= 400) {
    z.console.log(`Status: ${response.status}`);
    z.console.log(`Content: ${response.content}`);
    z.console.log(`Request: ${JSON.stringify(response.request)}`);

    throw new Error(`Got an unexpected response from Zoho: ${response.content}`);
  }

  return response;
};

const addZohoHeaders = (request, z, bundle) => {
  request.headers['X-com-zoho-invoice-organizationid'] = bundle.inputData.organizationId;

  if (bundle.authData.access_token) {
    request.headers.Authorization = `Zoho-oauthtoken ${bundle.authData.access_token}`;
  }

  return request;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    addZohoHeaders
  ],

  afterResponse: [
    handleHttpError
  ],

  resources: {
  },

  triggers: {
    [organization.key]: organization,
    [item.key]: item
  },

  searches: {
  },

  creates: {
    [invoiceCreate.key]: invoiceCreate
  }
};

module.exports = App;
