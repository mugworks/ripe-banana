const Router = require('express').Router;
const router = Router();
const Actor = require('../models/actor');

router

    .post('/', (req, res, next) => {
        new Actor(req.body).save()
            .then(result => res.json(result))
            .catch(next);
    });

module.exports = router;
