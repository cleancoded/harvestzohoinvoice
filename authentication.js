const constants = require('./constants');

const getAccessToken = (z, bundle) => {
    const promise = z.request(`${constants.AUTH_BASE}/token`, {
        method: 'POST',
        params: {
            code: bundle.inputData.code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URL,
            grant_type: 'authorization_code'
        }
    });

    return promise.then((response) => {
        z.console.log('getAccessToken response: ', response);
        if (response.status !== 200) {
            throw new Error('Unable to fetch access token: ' + response.content);
        }

        const result = JSON.parse(response.content);
        return {
            access_token: result.access_token,
            refresh_token: result.refresh_token
        };
    });
};

const refreshAccessToken = (z, bundle) => {
    const promise = z.request(`${constants.AUTH_BASE}/token`, {
        method: 'POST',
        params: {
            refresh_token: bundle.authData.refresh_token,
            client_id:  process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URL,
            grant_type: 'refresh_token',
            prompt: 'consent'
        }
    });

    return promise.then((response) => {
        if (response.status !== 200) {
            throw new Error('Unable to fetch access token: ' + response.content);
        }

        const result = JSON.parse(response.content);
        return {
            access_token: result.access_token
        };
    });
};

const testAuth = (z, bundle) => {
    const promise = z.request({
        method: 'GET',
        url: `${constants.API_BASE}/users/me`
    });

    return promise.then((response) => {
        z.console.log("testAuth response: ", response);
        if (response.status === 401) {
            throw new Error('The access token you supplied is not valid');
        }

        return z.JSON.parse(response.content).user.name;
    });
};

module.exports = {
    type: 'oauth2',
    oauth2Config: {
        authorizeUrl: {
            url: `${constants.AUTH_BASE}/auth`,
            params: {
                client_id: '{{process.env.CLIENT_ID}}',
                state: '{{bundle.inputData.state}}',
                redirect_url: '{{bundle.inputData.redirect_url}}',
                response_type: 'code'
            }
        },
        getAccessToken: getAccessToken,
        refreshAccessToken: refreshAccessToken,
        autoRefresh: true,
        scope: 'ZohoInvoice.invoices.CREATE'
    },
    test: testAuth,
    connectionLabel: '{{username}}'
};