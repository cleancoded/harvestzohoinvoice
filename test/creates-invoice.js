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
                    contactId: expectedCustomerId,
                    lineItems: '<<<10 WP fixes>>>'
                }
            };

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    return params.customer_id == expectedCustomerId;
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

        it('should create invoice with line items', (done) => {
            const bundle = {
                inputData: {
                    lineItems: '<<<10 WP fixes>>>'
                }
            };

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    return params.line_items.length > 0;
                })
                .reply(200, {
                    invoice: {
                        line_items: [
                            {
                                quantity: 10,
                                description: 'WP fixes'
                            }
                        ]
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.invoice.should.have.property('line_items');
                    const lineItems = result.invoice.line_items;

                    lineItems.length.should.be.above(0);

                    done();
                })
                .catch(done);
        });

        it('should create invoice with line item with expected line item ID', (done) => {
            const expectedLineItemId = 123;
            const bundle = {
                inputData: {
                    lineItemId: expectedLineItemId,
                    lineItems: '<<<10 WP fixes>>>'
                }
            };

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    const lineItems = params.line_items;

                    return lineItems[0].item_id === expectedLineItemId;
                })
                .reply(200, {
                    invoice: {
                        line_items: [
                            {
                                line_item_id: expectedLineItemId,
                                quantity: 10,
                                description: 'WP fixes'
                            }
                        ]
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.invoice.line_items;

                    lineItems[0].line_item_id.should.eql(expectedLineItemId);

                    done();
                })
                .catch(done);
        });

        it('should create invoice with line item with expected quantity', (done) => {
            const expectedQuantity = 10;
            const expectedDescription = 'WP fixes';
            const bundle = {
                inputData: {
                    lineItems: `<<<${expectedQuantity} ${expectedDescription}>>>`
                }
            };

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    const lineItems = params.line_items;

                    return lineItems[0].quantity == expectedQuantity;
                })
                .reply(200, {
                    invoice: {
                        line_items: [
                            {
                                quantity: expectedQuantity,
                                description: expectedDescription
                            }
                        ]
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.invoice.line_items;

                    lineItems[0].quantity.should.eql(expectedQuantity);

                    done();
                })
                .catch(done);
        });

        it('should create invoice with expected line items', (done) => {
            const expectedLineItemId = 123;
            const expectedCustomerId = 123456789;
            const bundle = {
                inputData: {
                    contactId: expectedCustomerId,
                    lineItems: "<<<10 WP fixes>>>\n" +
                                "<<<4 Web Maintenance>>>"
                }
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

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    const lineItems = params.line_items;

                    return lineItems.length == 2;
                })
                .reply(200, {
                    invoice: {
                        line_items: [
                            {
                                item_id: expectedLineItemId,
                                quantity: 10,
                                description: "WP fixes"
                            },
                            {
                                item_id: expectedLineItemId,
                                quantity: 4,
                                description: "Web Maintenance"
                            }
                        ]
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.invoice.line_items;

                    lineItems[0].should.deepEqual(firstExpectedLineItem);
                    lineItems[1].should.deepEqual(secondExpectedLineItem);

                    done();
                })
                .catch(done);
        });

        it('should create invoice with expected line items and not fail', (done) => {
            const expectedLineItemId = 123;
            const expectedCustomerId = 123456789;
            const bundle = {
                inputData: {
                    contactId: expectedCustomerId,
                    lineItems: "<<<2.1 Quickbooks: Created Ajax call/view and finished controller to send Quickbooks invoice from website>>>\n" +
                                "<<<3.0 StarrMatica [10-11-2018]: IBM Watson text-to-speech functionality with video demo>>>"
                }
            };
            const firstExpectedDescription = "Quickbooks: Created Ajax call/view and finished controller to send Quickbooks invoice from website";
            const firstExpectedLineItem = {
                item_id: expectedLineItemId,
                quantity: 2.1,
                description: firstExpectedDescription
            };
            const secondExpectedDescription = "StarrMatica [10-11-2018]: IBM Watson text-to-speech functionality with video demo";
            const secondExpectedLineItem = {
                item_id: expectedLineItemId,
                quantity: 3.0,
                description: secondExpectedDescription
            };

            nock(constants.API_BASE)
                .post('/invoices')
                .query((query) => {
                    const params = JSON.parse(query.JSONString);
                    const lineItems = params.line_items;

                    return lineItems.length == 2;
                })
                .reply(200, {
                    invoice: {
                        line_items: [
                            {
                                item_id: expectedLineItemId,
                                quantity: 2.1,
                                description: firstExpectedDescription
                            },
                            {
                                item_id: expectedLineItemId,
                                quantity: 3.0,
                                description: secondExpectedDescription
                            }
                        ]
                    }
                });

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    const lineItems = result.invoice.line_items;

                    lineItems[0].should.deepEqual(firstExpectedLineItem);
                    lineItems[1].should.deepEqual(secondExpectedLineItem);

                    done();
                })
                .catch(done);
        });

        xit('should throw an exception on malformed digest input', (done) => {
            const bundle = {
                inputData: {
                    lineItems: 'This is an unexpected, unparseable string\n' +
                                'with a line-break'
                }
            };

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    done(new Error("This test should have caught an exception, but none was ever thrown!"));
                })
                .catch((error) => {
                    const expectedErrorMessage = 'We received some unexpected input';
                    const messageExists = error.contains(expectedErrorMessage);

                    messageExists.should.be.true();

                    done();
                });
        });
    });
});