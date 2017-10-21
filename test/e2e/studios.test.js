const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Studios API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const studio = {
        name: 'Paramount Pictures',
        address: {
            city: 'Hollywood',
            state: 'California',
            country: 'USA'
        }
    };

    it('saves a studio', () => {
        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(({ body }) => {
                assert.equal(body.name, studio.name);
            });
    });
});