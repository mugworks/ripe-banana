const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');

router

    .post('/', (req, res, next) => {
        new Studio(req.body).save()
            .then(result => res.json(result))
            .catch(next);

    });

module.exports = router;