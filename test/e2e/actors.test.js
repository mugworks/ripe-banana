const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;


describe('Actors API', () => {
    
    beforeEach(() => mongoose.connection.dropDatabase());

    const actor = {
        name: 'George Clooney',
        dob: 1961,
        pob: 'Lexington KY'
    };

    it.only('saves an actor', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(({ body }) => {
                assert.equal(body.name, actor.name);
            });
    });

});
