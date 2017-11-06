const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;
const tokenService = require('../../lib/utils/token-service');

describe('Reviews API', () => {

    let studio = {
        name: 'MGM'
    };

    let actor = {
        name: 'Ryan Gosling'
    };
    
    let reviewer = {
        name: 'Roger Ebert',
        company: 'Siskel & Ebert',
        email: 'bbb@com',
        password: 'vcr',
        roles: ['Admin']
    };
   
    
    beforeEach(() => mongoose.connection.dropDatabase());
    let reviewArray = null;
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
                return  reviewArray =[
                    { 
                        rating: 4,
                        reviewer: reviewer._id,
                        review_text: 'Simply Amazing',
                        film: testMovie._id
                    },
                    { 
                        rating: 1,
                        reviewer: reviewer._id,
                        review_text: 'Terrible movie, delete it!!!',
                        film: testMovie._id
                    }
                ];
            });
    });

    it('saves a review', () => {
        return request.post('/api/filmIndustry/reviews/')
            .set('Authorization', token)
            .send(reviewArray[0])
            .then(({ body }) => {
                assert.equal(body.rating, reviewArray[0].rating);
            });
    });

    it('gets review with id', () => {
        let savedReview = null;
        return request.post('/api/filmIndustry/reviews')
            .set('Authorization', token)
            .send(reviewArray[0])
            .then(res => {
                savedReview = res.body;
                return request.get(`/api/filmIndustry/reviews/${savedReview._id}`);
            })
            .then(res => {
                assert.equal(res.body.review_text, savedReview.review_text);
            });
    });

    it('get all reviewers',() => {

        let reviewPromises = reviewArray.map(item => {
            return request.post('/api/filmIndustry/reviews')
                .set('Authorization', token)
                .send(item)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(reviewPromises)
            .then(_saved => {
                saved =_saved;
                return request.get('/api/filmIndustry/reviews');
            })
            .then(res => {
                assert.deepEqual(res.body[1].rating, saved[1].rating);
                assert.deepEqual(res.body[0].review_text, saved[0].review_text);
                assert.equal(res.body[0].title, saved[0].title);
            });
    });

    it('updates review with an id', () => {
        const update = {rating: 1};

        let savedReview = null;
        return request.post('/api/filmIndustry/reviews')
            .set('Authorization', token)
            .send(reviewArray[0])
            .then(res => {
                savedReview = res.body;
                return request.put(`/api/filmIndustry/reviews/${savedReview._id}`)
                    .set('Authorization', token)
                    .send(update);
            })
            .then(res => {
                assert.equal(res.body.rating, update.rating);
            });
    });

    it('deletes with id', () => {
        let savedReview = null;
        return request.post('/api/filmIndustry/reviews')
            .set('Authorization', token)
            .send(reviewArray[0])
            .then(res => {
                savedReview = res.body;
                return request.delete(`/api/filmIndustry/reviews/${savedReview._id}`)
                    .set('Authorization', token);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
            });
    });

});
