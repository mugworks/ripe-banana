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
            .populate({path:'studio', select:'name'})
            .populate({path: 'cast.actor', select: 'name'})
            .then(films => {
                res.json(films);
                // console.log(JSON.stringify(films, true, 2));
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate({path: 'studio', select: 'name'})
            .populate({path: 'cast.actor', select: 'name'})
            .then(film => {
                res.json(film);
                // console.log(JSON.stringify(film, true, 2));
            })
            .catch(next);
    });

   

module.exports = router;

