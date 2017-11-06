const assert = require('chai').assert;
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer model', () => {
    

    const reviewer = new Reviewer({
        name: 'Roger Ebert',
        company: 'Siskel & Ebert',
        email: 'testUser1',
        password: 'abc',
        role: 'Admin'
    });

    it('generates hash from password', ()=> {
        reviewer.generateHash('abc');
        assert.isOk(reviewer.hash);

    });

    it('compares password', () => {
        reviewer.generateHash('abc');
        assert.isTrue(reviewer.comparePassword('abc'));
        assert.isFalse(reviewer.comparePassword('diffPassword'));
    });


    it('check if good model', () => {
        assert.equal(reviewer.validateSync(), undefined);
    });

    it('check required fields', () => {
        const reviewer = new Reviewer ({
            name: 'Roger Ebert'
        });
        const { errors } = reviewer.validateSync();
        assert.equal(errors.company.kind, 'required');
    });

});

