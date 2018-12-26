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

module.exports = {
    addZohoHeaders: addZohoHeaders,
    handleHttpError: handleHttpError
}