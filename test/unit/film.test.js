const assert = require('chai').assert;
const Film = require('../../lib/models/film');

describe('Film Model', () => {
    it.only('is a good model', () => {
        const film = new Film({
            title: 'The Princess Bride',
            // studio: 1234567812345678,
            released: 1987,
            cast: [{part: 'ROUS', actor: '59eb914ffcd9df5be2d25d18'}]
        });
        assert.equal(film.validateSync(), undefined);
    });

});

