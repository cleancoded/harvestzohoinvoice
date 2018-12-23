require ('should');

const constants = require('../constants');
const zapier = require('zapier-platform-core');
const App = require('..');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('Multi-line-item Zoho Invoice', () => {
    describe('create invoice', () => {
        it('should create invoice with expected contact ID', (done) => {
            const expectedCustomerId = 1;
            const bundle = {
                inputData: {
                    contactId: expectedCustomerId
                }
            };

            nock(constants.ZOHO_API)
                .post('/invoices', (body) => {
                    return body.customer_id === expectedCustomerId;
                })
                .reply(200, {
                    invoice: {
                        customer_id: expectedCustomerId
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.invoice.should.have.property('customer_id');
                    const customerId = result.invoice.customer_id;

                    customerId.should.eql(expectedCustomerId);

                    done();
                })
                .catch(done);
        });

        xit('should create invoice with line items', (done) => {
            const bundle = {
                lineItems: "{{{10 WP fixes}}}"
            };

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.should.have.property('line_items');
                    const lineItems = result.line_items;

                    lineItems.length.should.be.above(0);

                    done();
                })
                .catch(done);
        });

        xit('should create invoice with line item with expected line item ID', (done) => {
            const expectedLineItemId = 123;
            const bundle = {
                lineItems: "{{{10 WP fixes}}}"
            };

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.line_items;

                    lineItems[0].item_id.should.eql(expectedLineItemId);

                    done();
                })
                .catch(done);
        });

        xit('should create invoice with line item with expected quantity', (done) => {
            const expectedQuantity = 10;
            const bundle = {
                lineItems: "{{{10 WP fixes}}}"
            };

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.line_items;

                    lineItems[0].quantity.should.eql(expectedQuantity);

                    done();
                })
                .catch(done);
        });

        xit('should make expected Zoho API call', (done) => {
            const bundle = {};

            nock(constants.ZOHO_API)
                .post('/invoices')
                .reply(200, true);

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.should.true();

                    done();
                })
                .catch(done);
        });

        xit('should create invoice with expected line items', (done) => {
            const expectedLineItemId = 123;
            const expectedCustomerId = 123456789;
            const bundle = {
                lineItems: "{{{10 WP fixes}}}\n" +
                            "{{{4 Web Maintenance}}}"
            };
            const firstExpectedLineItem = {
                item_id: expectedLineItemId,
                quantity: 10,
                description: "WP fixes"
            };
            const secondExpectedLineItem = {
                item_id: expectedLineItemId,
                quantity: 4,
                description: "Web Maintenance"
            };
        });
    });
});