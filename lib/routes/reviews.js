const Router = require('express').Router;
const router = Router();
const Review = require('../models/review');
const ensureAuth = require('../utils/ensure-auth');

router

    .post('/',ensureAuth(), (req, res, next) => {
        new Review(req.body).save()
            .then(result => res.send(result))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Review.findById(req.params.id)
            .then(result =>{
                res.json(result);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .select('rating review_text title')
            .lean()
            .populate('film', 'title -_id')
            .then(result => res.json(result))
            .catch(next);
    })

    .put('/:id', ensureAuth(), (req, res, next) => {
        Review.findOneAndUpdate((req.params.id), req.body, {new: true})
            .then(result => res.json(result))
            .catch(next);
    })

    .delete('/:id', ensureAuth(), (req, res) => {
        Review.findByIdAndRemove((req.params.id), req.body)
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            });

    });


module.exports = router;