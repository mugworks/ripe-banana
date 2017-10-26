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
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate({path: 'studio', select: 'name'})
            .populate({path: 'cast.actor', select: 'name'})
            .then(film => {
                res.json(film);
            })
            .catch(next);
    })


    .put('/:id', (req, res, next) => {
        Film.findOneAndUpdate((req.params.id), req.body, { new: true })
            .then(result => {
                res.json(result);})
            .catch(next);
    })

    .delete('/:id', (req, res) => {
        Film.findByIdAndRemove((req.params.id), req.body)
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            });

    });


   

module.exports = router;

