const request = require('./request');
const assert = require('chai').assert;
const db =require('./db');
const tokenService = require('../../lib/utils/token-service');

describe.only('Reviewer API', () => {
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
    let adminToken = '';
    
    beforeEach(() => {
        return tokenService
            .sign({ roles: ['admin'] })
            .then(token => adminToken = token);
    });  

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
                    .set('Authorization', adminToken)
                    .send(studio)
                    .then(({ body }) => {
                        studio._id = body._id;
                        return body;
                    });
            }) 
            .then(() => {
                return request.post('/api/filmIndustry/actors')
                    .set('Authorization', adminToken)
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
                    .set('Authorization', adminToken)
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
                    .set('Authorization', adminToken)
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
        // const update = { 
        //     email:'Someone Cool',
        //     company:'Siskel & Ebert'
        // };

        let update = {
            email: 'roger@ebert.com',
            password: 'twothumbsup',
            company: 'Only Ebert'
        };

        // let reviewerToUpdate = {
        //     email: 'Roger Ebert',
        //     company: 'Siskel & Ebert'
        // };

        return request.post('/api/filmIndustry/reviewers')
            .set('Authorization', adminToken)
            .send(reviewer)
            .then(res => {
                return request.put(`/api/filmIndustry/reviewers/${res.body._id}`)
                    .set('Authorization', adminToken)
                    .send(update);
            })
            .then(res => {
                assert.equal(res.body.company, 'Only Ebert');
            });

    });

});
