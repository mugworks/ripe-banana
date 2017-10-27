const request = require('./request');
const assert = require('chai').assert;
// const db = require('./db');
const mongoose = require('mongoose');

describe('Auth API', () => {

    beforeEach(() => mongoose.connection.dropDatabase());

    let token = null;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'user',
                password: 'abc'
            })
            .then(({body}) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('Can not signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({email: 'user', password: 'def'})
            .then(
                () => {throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('Must include password', () => {
        return request
            .post('/api/auth/signup')
            .send({email: 'otheruser', password: ''})
            .then(
                () => {throw new Error('Unexpected sucessful response');},
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it.only('Signin with same credential', () => {
        return request
            .post('/api/auth/signin')
            .send({email: 'user', password: 'abc'})
            .then(({body}) => {
                assert.isOk(body.token);
            });
    });

});