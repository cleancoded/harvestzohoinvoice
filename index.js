const invoiceCreate = require('./creates/invoice');
const authentication = require('./authentication');

const handleHttpError = (response, z) => {
  if (response.status >= 400) {
    z.console.log(`Status: ${response.status}`);
    z.console.log(`Content: ${response.content}`);
    z.console.log(`Request: ${JSON.stringify(response.request)}`);
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
  },

  searches: {
  },

  creates: {
    [invoiceCreate.key]: invoiceCreate
  }
};

module.exports = App;
