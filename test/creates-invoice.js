require ('should');

const zapier = require('zapier-platform-core');
const App = require('..');
const appTester = zapier.createAppTester(App);

describe('creates', () => {
    describe('create invoice', () => {
        it('should return true', () => {
            const bundle = {};

            appTester(App.creates.invoice.operation.perform, bundle)
                .then((result) => {
                    result.should.eql(true);
                })
        });
    });
});