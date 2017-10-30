const request = require('./request');
// const mongoose = require('mongoose');
const assert = require('chai').assert;
const db = require('./db');
const tokenService = require('../../lib/utils/token-service');


describe('Actors API', () => {

    beforeEach(() => db.drop());
    let adminToken = '';

    const actor = {
        name: 'George Clooney',
        dob: new Date('1961-05-06'),
        pob: 'Lexington KY'
    };

    beforeEach(() => {
        return tokenService
            .sign({ roles: ['admin'] })
            .then(token => adminToken = token);
    });

    it('saves an actor if admin', () => {
        return request.post('/api/filmIndustry/actors')
            .set('Authorization', adminToken) //eslint-disable-line
            .send(actor)
            .then(({ body }) => {
                assert.equal(body.name, actor.name);
            });
    });

    it('cannot save an actor if not admin', () => {
        return request.post('/api/filmIndustry/actors')
            .send(actor)
            .then(() => {
                assert(false);  
            })
            .catch((error) => {
                assert.equal(error.status, 401);
            });
    });

    it('get actor by id and return pob, dob, and film title and release date using id', () => {

        let savedActor = null;

        return request.post('/api/filmIndustry/actors')
            .set('Authorization', adminToken)
            .send(actor)
            .then(res => {
                savedActor = res.body;

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
                    .set('Authorization', adminToken)
                    .send(film);
            })    
            .then(() => {
                return request.get(`/api/filmIndustry/actors/${savedActor._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body.name, savedActor.name);
                assert.deepEqual(res.body.pob, savedActor.pob);
                assert.ok(res.body.films);
                assert.deepEqual(res.body.films[0][0], 'Thelma and Louise');
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
                .set('Authorization', adminToken)
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

    it('updates actor with an id for admin', () => {
        const update = {
            name: 'Charlie Chaplin',
            dob: 1961,
            pob: 'Lexington KY'
        };
        return request.post('/api/filmIndustry/actors')
            .set('Authorization', adminToken)
            .send(actor)
            .then(res => {
                return request.put(`/api/filmIndustry/actors/${res.body._id}`)
                    .set('Authorization', adminToken)
                    .send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });
    });

    it('cannot update an actor with an id if not admin', () => {
        const update = {
            name: 'Charlie Chaplin',
            dob: 1961,
            pob: 'Lexington KY'
        };
        return request.post('/api/filmIndustry/actors')
            .set('Authorization', adminToken)
            .send(actor)
            .then(res => {
                return request.put(`/api/filmIndustry/actors/${res.body._id}`)
                    .send(update);
            })
            .then(() => {
                assert(false);  
            })
            .catch((error) => {
                assert.equal(error.status, 401);
            });
    });

    it('removes an actor by id if no film exists', () => {
        return request.post('/api/filmIndustry/actors')
            .set('Authorization', adminToken)
            .send(actor)
            .then(res => {
                return request.delete(`/api/filmIndustry/actors/${res.body._id}`)
                    .set('Authorization', adminToken);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });
    
});
