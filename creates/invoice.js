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

        ],
        perform: createInvoice
    }
}