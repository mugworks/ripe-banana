const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;
const tokenService = require('../../lib/utils/token-service');

describe('Reviewer API', () => {
    let studio = {
        name: 'MGM'
    };

    let actor = {
        name: 'Ryan Gosling'
    };
    
    let reviewer = {
        name: 'Roger Ebert',
        company: 'Siskel & Ebert',
        email: 'xxx@x.com',
        password: 'xyz',
        roles: ['Admin']
    };

    let reviewer1 = {
        name: 'whatever',
        company: 'whatever co',
        email: 'whatever@com',
        password: 'xyz',
        role: ['Admin']
    };

    beforeEach(() => mongoose.connection.dropDatabase());

    let token = null;
    beforeEach(() => {
        
        return request.post('/api/auth/signup')
            .send(reviewer)
            .then(({ body }) => {
                token = body.token;
                return tokenService.verify(token);
            })
            .then((res) => {
                reviewer._id = res.id;
            })
            .then(() => {
                return request.post('/api/auth/signup')
                    .send(reviewer1)
                    .then(({ body }) => {
                        token = body.token;
                        return tokenService.verify(token);
                    });
            })
            .then(()=>{
                return request.post('/api/filmIndustry/studios')
                    .send(studio)
                    .then(({ body }) => {
                        studio._id = body._id;
                        return body;
                    });
            }) 
            .then(() => {
                return request.post('/api/filmIndustry/actors')
                    .send(actor)
                    .then(({ body }) => {
                        actor._id = body._id;
                        return body;
                    });     
            })
            .then(() => {
                let testMovie = {
                    title: 'Wonder Woman',
                    studio: studio._id,
                    released: 2017,
                    cast: [{actor: actor._id}]
                };
                return request.post('/api/filmIndustry/films')
                    .set('Authorization', token)
                    .send(testMovie)
                    .then(({ body }) => {
                        testMovie._id = body._id;
                        return body;
                    });
            }) 
            .then((testMovie)=>{
                let review ={ 
                    rating: 4,
                    reviewer: reviewer._id,
                    review_text: 'Simply Amazing',
                    film: testMovie._id
                };
                return request.post('/api/filmIndustry/reviews/') 
                    .set('Authorization', token)
                    .send(review)
                    .then(({ body }) => {
                        review._id = body._id;
                        return body;
                        
                    });
            });

    });

      
    
    it('gets a reviewer with an id', () => {
        return request.get(`/api/filmIndustry/reviewers/${reviewer._id}`)
            .then(({ body }) => {
                assert.equal(body.name, reviewer.name);
                assert.equal(body.reviews[0].rating, 4);
                assert.equal(body.reviews[0].review_text, 'Simply Amazing');
            });
    });


    it('get all reviewers',() => {

        return request.get('/api/filmIndustry/reviewers')
            .then(({ body })=> {
                assert.equal(body.length, 2);
                assert.deepEqual(body[1].name, 'whatever');
            }); 
    });

    it('updates reviewer with an id', () => {
        const update = { 
            name:'Someone Cool',
            company:'Siskel & Ebert',
            roles: ['Admin']
        };

        return request.put(`/api/filmIndustry/reviewers/${reviewer._id}`)
            .set('Authorization', token)
            .send(update)
            .then(({ body }) => {
                assert.equal(body.name, update.name);
            });

    });

});