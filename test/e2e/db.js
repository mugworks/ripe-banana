const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/filmIndustry-test';
const mongoose = require('mongoose');
const request = require('./request');

before(() => connect(url));
after(() => mongoose.connection.close());

module.exports = {
    drop() {
        return mongoose.connection.dropDatabase();
    },
    getToken(user = {email: 'roger@ebert.com', password: 'twothumbsup'}) {
        return request
            .post('api/auth/signup')
            .send(user)
            .then(({body}) => body.token);
    }
};