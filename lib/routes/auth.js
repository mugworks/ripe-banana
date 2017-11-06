const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const tokenService = require('../utils/token-service');

router
    .post('/signup', (req,res,next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code:400, error: 'password is required'};

        
        Reviewer.emailExists(email)
            .then(exists => {
                if(exists) {
                    throw {code: 400, error: 'email already exi sts'};
                }

                const reviewer = new Reviewer(req.body);
                reviewer.generateHash(password);

                return reviewer.save();
            })
            .then(reviewer => tokenService.sign(reviewer))
            .then(token => res.send({ token}))
            .catch(next);
    })

    .post('/signin', (req,res,next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code:400, error: 'password is required'};

        Reviewer.findOne({ email })
            .then(reviewer => {
                if(!reviewer || !reviewer.comparePassword(password)) {
                    throw { code: 401, error: 'authentication failed' };
                }
                return tokenService.sign(reviewer);
            })
            .then(token => res.send({ token }))
            .catch(next);
    });

module.exports = router;