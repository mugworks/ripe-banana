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

    it('gets a studio with an id', () => {
        let savedStudio = null;
        return request.post('/api/filmIndustry/studios')
            .send(studio)
            .then(res => {
                savedStudio = res.body;
                return request.get(`/api/filmIndustry/studios/${savedStudio._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, savedStudio);
            });
    });
});