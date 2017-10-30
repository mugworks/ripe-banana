const request = require('./request');
const db = require('./db');
const assert = require('chai').assert;
const tokenService = require('../../lib/utils/token-service');


describe('Studios API', () => {

    
    const studio = {
        name: 'Paramount Pictures',
        address: {
            city: 'Hollywood',
            state: 'California',
            country: 'USA'
        }
    };

    beforeEach(() => db.drop());
    let adminToken = '';
    
    beforeEach(() => {
        return tokenService
            .sign({ roles: ['admin'] })
            .then(token => adminToken = token);
    });
    
    it('saves a studio', () => {
        return request.post('/api/filmIndustry/studios')
            .set('Authorization', adminToken)
            .send(studio)
            .then(({ body }) => {
                assert.equal(body.name, studio.name);
            });
    });

    it('gets all studios by name', () => {
        
        const studio2 = {
            name: 'MGM',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            }
        };

        const studioArray = [studio, studio2].map(studio => {
            return request.post('/api/filmIndustry/studios')
                .set('Authorization', adminToken)
                .send(studio)
                .then(res => res.body);
        });
        let saved = null;
        return Promise.all(studioArray)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/filmIndustry/studios');
            })
            .then(res => {
                assert.equal(res.body.name, saved.name);  
            });
    });

    it('gets a studio with an id', () => {
        let savedStudio = null;
        return request.post('/api/filmIndustry/studios')
            .set('Authorization', adminToken)
            .send(studio)
            .then(res => {
                savedStudio = res.body;
                let movie = {
                    title: 'Field of Dreams',
                    studio: savedStudio._id,
                    released: '1995'
                };
                return request.post('/api/filmIndustry/films')
                    .set('Authorization', adminToken)
                    .send(movie);
            })
            .then(() => {
                return request.get(`/api/filmIndustry/studios/${savedStudio._id}`);
            
            })
            .then(res => {
                assert.equal(res.body.name, savedStudio.name);
                assert.deepEqual(res.body.address, savedStudio.address);
                assert.deepEqual(res.body.films, ['Field of Dreams']);
            });
    });

    it('removes by id', () => {
        let studio = null;
        return request.post('/api/studios')
            .set('Authorization', adminToken)
            .send(studio)
            .then(res => {
                studio = res.body;
                return request.delete(`/api/studios/${studio._id}`)
                    .set('Authorization', adminToken);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/studio/${studio._id}`);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                });
    });

    it('updates studio with an id', () => {
        return request.post('/api/filmIndustry/studios')
            .set('Authorization', adminToken)
            .send(studio)
            .then(res => {
                let savedStudio = res.body;    
                savedStudio.name = 'Disney';
                return request.put(`/api/filmIndustry/studios/${savedStudio._id}`)
                    .set('Authorization', adminToken)
                    .send(savedStudio);
            })
            .then(res => {
                assert.equal(res.body.name, 'Disney');
            });
    });
});
