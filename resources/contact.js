const constants = require('../constants');

const queryContacts = (z, bundle) => {
    const promise = z.request({
        url: `${constants.API_BASE}/contacts`,
        method: 'GET',
    });

    return promise.then((response) => {
        let contacts = [];
        let zohoContacts = JSON.parse(response.content).contacts;

        zohoContacts.forEach((contact) => {
            contacts.push({
                id: contact.contact_id,
                name: contact.contact_name
            });
        });

        return contacts;
    });
};

module.exports = {
    key: 'contact',
    noun: 'Contact',
    display: {
        label: 'List of Zoho Contacts',
        description: 'This is a hidden trigger',
        hidden: true
    },
    operation: {
        perform: queryContacts
    }
}