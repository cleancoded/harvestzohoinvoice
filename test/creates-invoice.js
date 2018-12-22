require ('should');

const zapier = require('zapier-platform-core');
const App = require('..');
const appTester = zapier.createAppTester(App);

describe('Multi-line-item Zoho Invoice', () => {
    describe('create invoice', () => {
        it('should create invoice with expected contact ID', (done) => {
            const expectedCustomerId = 1;
            const bundle = {
                contactId: expectedCustomerId
            };

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.should.have.property('customer_id');
                    const customerId = result.customer_id;

                    customerId.should.eql(expectedCustomerId);

                    done();
                })
                .catch(done);
        });

        it('should create invoice with line items', (done) => {
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
    });
});