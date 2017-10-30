const request = require('./request');
const assert = require('chai').assert;
const db =require('./db');
const tokenService = require('../../lib/utils/token-service');

describe('Reviewer API', () => {
    let studio = {
        name: 'MGM'
    };

    let actor = {
        name: 'Ryan Gosling'
    };
    
    let reviewer = {
        email: 'roger@ebert.com',
        password: 'twothumbsup',
        company: 'Siskel & Ebert'
    };

    beforeEach(() => db.drop());

    let token = '';
       
    beforeEach(() => {
        return request.post('/api/filmIndustry/auth/signup')
            .send(reviewer)
            .then(({ body }) => {
                token = body.token;
                return tokenService.verify(token);
            })
            .then((res) => {
                reviewer._id = res.id;
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
            });
    });

    it('get all reviewers',() => {

        let reviewer1 = {
            email: 'erdem@proj.com',
            company: 'erdemLtd',
            password: 'afj'
        };

        return request.post('/api/filmIndustry/auth/signup')
            .send(reviewer1)
            .then(({ body }) => {
                token = body.token;
                return tokenService.verify(token);
            })
            .then((res) => reviewer1._id = res.id)  
            .then(() => request.get('/api/filmIndustry/reviewers'))
            .then(res => {
                assert.deepEqual(res.body[1].company, 'erdemLtd');
            });
    });
    

    it('updates reviewer with an id', () => {
        const update = { 
            name:'Someone Cool',
            company:'Siskel & Ebert'
        };

        let reviewerToUpdate = {
            name: 'Roger Ebert',
            company: 'Siskel & Ebert'
        };

        return request.post('/api/filmIndustry/reviewers')
            .send(reviewerToUpdate)
            .then(res => {
                return request.put(`/api/filmIndustry/reviewers/${res.body._id}`).send(update);
            })
            .then(res => {
                assert.equal(res.body.name, update.name);
            });

    });

});
