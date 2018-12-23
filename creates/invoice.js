const constants = require('../constants');

const createInvoice = (z, bundle) => {
    const promise = z.request({
        url: `${constants.ZOHO_API}/invoices`,
        method: 'POST',
        body: JSON.stringify({
            customer_id: bundle.inputData.contactId,
            line_items: buildLineItems(bundle.inputData)
        })
    });

    return promise.then((response) => JSON.parse(response.content));
};

const buildLineItems = (inputData) => {
    let result = [];
    const lineItemSplits = inputData.lineItems.split('\n');

    lineItemSplits.forEach((split) => {
        result.push(buildLineItem(split, inputData.lineItemId));
    });

    return result;
};

const buildLineItem = (lineItemInput, lineItemId) => {
    let result = {};
    const quantityRegExp = new RegExp('^{{{([0-9]+)');
    const descriptionRegExp = new RegExp(' (.+)}}}$')
    result.item_id = lineItemId;
    result.quantity = lineItemInput.match(quantityRegExp)[1];
    result.description = lineItemInput.match(descriptionRegExp)[1];

    return result;
};

module.exports = {
    key: 'invoice',
    noun: 'Invoice',
    display: {
        label: 'Create Invoice',
        description: 'Creates a Zoho invoice with multiple line items.'
    },

    operation: {
        inputFields: [
            {
                key: 'organizationId',
                label: 'Organization',
                required: true
            },
            {
                key: 'contactId',
                label: 'Contact ID',
                required: true,
                helpText: 'The ID of the Zoho Contact being invoiced'
            },
            {
                key: 'lineItemId',
                label: 'Line Item ID',
                required: true,
                helpText: 'The ID of Zoho Line Item to use'
            },
            {
                key: 'lineItems',
                label: 'Line Item Input',
                required: true,
                helpText: 'The digest content to be used as invoice line items'
            },
            {
                key: 'shouldSend',
                label: 'Send',
                required: false,
                helpText: 'Should we send the invoice to the contact now?'
            }
        ],
        perform: createInvoice
    }
}