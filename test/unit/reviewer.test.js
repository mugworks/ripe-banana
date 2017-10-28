const assert = require('chai').assert;
const Reviewer = require('../../lib/models/reviewer');

describe.only('Reviewer model', () => {
    
    const reviewer = new Reviewer({
        email: 'roger@ebert.com'
    });

    const password = 'twothumbsup';


    it('check required fields', () => {
        const reviewer = new Reviewer ({
            company: ''
        });
        const { errors } = reviewer.validateSync();
        assert.equal(errors.company.kind, 'required');
    });

    it('generates hash from password', () => {
        reviewer.generateHash(password);
        assert.isOk(reviewer.hash);
        assert.notEqual(reviewer.hash, password);
    });

    it('compares password', () => {
        assert.isTrue(reviewer.comparePassword('twothumbsup'));
        assert.isFalse(reviewer.comparePassword('bad password'));
    });

});

