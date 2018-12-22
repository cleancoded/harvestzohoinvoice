const createInvoice = (z, bundle) => {
    const promise = {};

    return true;
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
                key: 'organization',
                label: 'Organization',
                required: true
            },
            {
                key: 'line_item_id',
                label: 'Line Item ID',
                required: true,
                helpText: 'The ID of Zoho Line Item to use'
            },
            {
                key: 'contact_id',
                label: 'Contact ID',
                required: true,
                helpText: 'The ID of the Zoho Contact being invoiced'
            },
            {
                key: 'send',
                label: 'Send',
                required: false,
                helpText: 'Should we send the invoice to the contact now?'
            },
            {
                key: 'line_items',
                label: 'Line Item Input',
                required: true,
                helpText: 'The digest content to be used as invoice line items'
            }
        ],
        perform: createInvoice
    }
}