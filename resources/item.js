const constants = require('../constants');

const queryItems = (z, bundle) => {
    const promise = z.request({
        url: `${constants.API_BASE}/items`,
        method: 'GET',
    });

    return promise.then((response) => {
        let items = [];
        let zohoItems = JSON.parse(response.content).items;

        zohoItems.forEach((item) => {
            items.push({
                id: item.item_id,
                name: item.item_name
            });
        });

        return items;
    });
};

module.exports = {
    key: 'item',
    noun: 'Item',
    display: {
        label: 'List of Zoho Items',
        description: 'This is a hidden trigger',
        hidden: true
    },
    operation: {
        perform: queryItems
    }
}