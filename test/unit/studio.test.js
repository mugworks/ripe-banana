const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

describe('Studio model', () => {
    it('check if studio model is good', () => {
        const studio = new Studio({
            name: 'Paramount Pictures',
            address: {
                city: 'Hollywood',
                state: 'California',
                country: 'USA'
            }
        });
        assert.equal(studio.validateSync(), undefined);
    });
});