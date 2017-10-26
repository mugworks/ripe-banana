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
            .populate({path: 'cast.actor', select: 'name'}).lean()
            .populate({path: 'review', select: 'rating'})
            .then(films => {
                res.json(films);
                console.log(JSON.stringify(films, true, 2));
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .populate({path: 'studio', select: 'name'})
            .populate({path: 'cast.actor', select: 'name'})
            .populate({path: 'cast.role', select: 'role'})
            .then(film => {
                res.json(film);
                console.log(JSON.stringify(film, true, 2));
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

