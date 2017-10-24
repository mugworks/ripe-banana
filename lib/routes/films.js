const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router

    .post('/', (req, res, next) => {
        new Film(req.body).save()
            .then(result => res.json(result))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Film.find()
            .populate({path: 'studio', select: 'name'})
            .populate({path: 'cast.0._id', select: 'name'})
            .then(films => {
                res.json(films);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate({path: 'studio', select: 'name'})
            .populate({path: 'cast.0._id', select: 'name'})
            .then(film => res.json(film))
            .catch(next);
    });



module.exports = router;

