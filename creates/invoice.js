const constants = require('../constants');

const createInvoice = (z, bundle) => {
    const promise = z.request({
        url: `${constants.API_BASE}/invoices?send=false`,
        method: 'POST',
        params: {
            JSONString: JSON.stringify({
                customer_id: bundle.inputData.contactId,
                line_items: buildLineItems(bundle.inputData)
            })
        }
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
    const quantityRegExp = new RegExp('^<<<([0-9]+)');
    const descriptionRegExp = new RegExp(' (.+)>>>$')
    const quantityMatch = lineItemInput.match(quantityRegExp);
    const descriptionMatch = lineItemInput.match(descriptionRegExp);

    if (quantityMatch === null || descriptionMatch === null) {
        console.log("throwing error");
        const errorMessage = 'We received some unexpected input from the previous Zapier step.\n' +
                                'Ensure the line item text is in the format <<<[hours][space][description]>>>';
        throw new Error(errorMessage);
    }
    else {
        result.item_id = lineItemId;
        result.quantity = quantityMatch[1];
        result.description = descriptionMatch[1];

        return result;
    }
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
                required: true,
                dynamic: 'organization.id.name'
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
                dynamic: 'item.id.name',
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