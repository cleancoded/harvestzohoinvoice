const constants = require('../constants');

const queryOrganizations = (z, bundle) => {
    const promise = z.request({
        url: `${constants.API_BASE}/organizations`,
        method: 'GET',
    });

    return promise.then((response) => {
        let orgs = [];
        let zohoOrgs = JSON.parse(response.content).organizations;

        zohoOrgs.forEach((org) => {
            orgs.push({
                id: org.organization_id,
                name: org.name
            });
        })

        return orgs;
    });
};

module.exports = {
    key: 'organization',
    noun: 'Organization',
    display: {
        label: 'List of Zoho Organizations',
        description: 'This is a hidden trigger',
        hidden: true
    },
    operation: {
        perform: queryOrganizations
    }
}