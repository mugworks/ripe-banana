const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');
const Review = require('../models/review');
const ensureAuth = require('../utils/ensure-auth');

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
            .populate({path: 'review', select: 'rating'}).lean()
            .then(films => {
                res.json(films);
            })
            .catch(next);
    })


    

    .get('/:id', (req, res, next) => {
        const filmId = req.params.id;
        Promise.all([
            Film.findById(req.params.id)
                .populate({path: 'studio', select: 'name'})
                .populate({path: 'cast.actor', select: 'name'}).lean(),
            Review.find({ film: filmId}).select('rating review_text').populate({path: 'reviewer', select: 'name'}).lean()
        ])
            .then(([film, reviews]) => {
                film.reviews = reviews;
                res.json(film);
            })
            .catch(next);
    })


    .put('/:id',ensureAuth(), (req, res, next) => {
        Film.findOneAndUpdate((req.params.id), req.body, { new: true })
            .then(result => {
                res.json(result);})
            .catch(next);
    })

    .delete('/:id', ensureAuth(), (req, res) => {
        Film.findByIdAndRemove((req.params.id), req.body)
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            });

    });


   

module.exports = router;
