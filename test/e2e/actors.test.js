const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;


describe('Actors API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    const actor = {
        name: 'George Clooney',
        dob: new Date('1961-05-06'),
        pob: 'Lexington KY'
    };

    it('saves an actor', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(({ body }) => {
                assert.equal(body.name, actor.name);
            });
    });

    it.only('get actor by id and return pob, dob, and film title and release date using id', () => {

        let savedActor = null;

        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                savedActor = res.body;
                return request.get(`/api/filmIndustry/actors/${savedActor._id}`)
                    .then(() => {
                        let studioId = '59eda47c92868f6ce7de8b24';
                        let film = {
                            title: 'Thelma and Louise',
                            studio: studioId,
                            released: new Date ('1991'),
                            cast: [{
                                part: 'Louise',
                                actor: savedActor._id
                            }]
                        };
                        return request.post('/api/filmIndustry/films')
                            .send(film)
                            .then(() => {
                                return request.get(`/api/filmIndustry/actors/${savedActor._id}`);
                            });
                    });
            })
            .then(res => {
                assert.deepEqual(res.body.name, savedActor.name);
                assert.deepEqual(res.body.pob, savedActor.pob);
                console.log(res.body, 'FINDTitle');
                assert.ok(res.body.films);
            });
    });

    it('get by id return 404 with bad id', () => {
        return request.get('/api/filmIndustry/actors/59eb8057ea2b371badf14536')
            .then(
                () => { throw new Error('Unexpected error'); },
                err => {
                    assert.equal(err.status, 404);
                });
    });

    it('get all actors', () => {
        const actor2 = {
            name: 'Tom Hanks',
            dob: new Date('1956-07-09'),
            pob: 'Concord CA'
        };

        let actorCollection = [actor, actor2].map(item => {
            return request.post('/api/filmIndustry/actors')
                .send(item)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(actorCollection)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/filmIndustry/actors');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
                assert.equal(res.body[1].pob, 'Concord CA');
                assert.equal(res.body[1].dob.slice(0, 4), 1956);
                assert.equal(res.body[1].name, 'Tom Hanks');
            });
    });

    it('updates actor with an id', () => {
        const update = {
            name: 'Charlie Chaplin',
            dob: 1961,
            pob: 'Lexington KY'
        };
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                return request.put(`/api/filmIndustry/actors/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });
    });

    it('removes an actor by id if no film exists', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(res => {
                return request.delete(`/api/filmIndustry/actors/${res.body._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });
    
});
