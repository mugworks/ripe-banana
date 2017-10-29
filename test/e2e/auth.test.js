const request = require('./request');
const assert = require('chai').assert;
const mongoose = require('mongoose');
// const db = require('./db');

describe.only('Auth Api', () => {
    beforeEach(() => mongoose.connection.dropDatabase());

    let token = null;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'siskel',
                company: 'Ny Times',
                email: 'testUser1',
                password: 'abc'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('can not signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({ 
                name: 'siskel',
                company: 'Ny Times',
                email: 'testUser1',
                password: 'def'})
            .then(
                () => { throw new Error('unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('Must include password', () => {
        return request
            .post('/api/auth/signup')
            .send( {
                name: 'different siskel',
                company: 'Ny Times',
                email: 'testUser2',
                password: ''
            })
            .then(
                () => { throw new Error('unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                });
    });

    it('signin with same credentials', () => {
        return request
            .post('/api/auth/signin')
            .send({ 
                email: 'testUser1',
                password: 'abc' 
            })
            .then(({ body }) => {
                assert.isOk(body.token);
            });
    });

    it('sign in with bad email', () => {
        return request  
            .post('/api/auth/signin')
            .send({
                email: 'testUserbad',
                password: 'abc' 
            })
            .then(
                () => {throw new Error('Unexpected successful response');},
                err => {
                    assert.equal(err.status, 401);
                }
            );
    });
});