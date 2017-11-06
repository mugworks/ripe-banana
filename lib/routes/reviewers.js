const Router = require('express').Router;
const router = Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const ensureAuth = require('../utils/ensure-auth');
const ensureRole = require('../utils/ensure-role');

router

    // .post('/', (req, res, next) => {
    //     new Reviewer(req.body).save()
    //         .then(result => res.json(result))
    //         .catch(next);
    // })

    .get('/:id', (req, res, next) => {
        const reviewerId = req.params.id;
        Promise.all([
            Reviewer.findById(reviewerId).select('name company').lean(),
            Review.find({reviewer: reviewerId})
                .populate('review')
                .select('rating review_text -_id').lean()
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.json(reviewer);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .select('name company')
            .then(result => res.json(result))
            .catch(next);
    })
    
    .put('/:id', ensureAuth(), ensureRole('Admin'), (req, res, next) => {
        Reviewer.findOneAndUpdate((req.params.id), req.body, {new: true})
            .then(result => res.json(result))
            .catch(next);
    });



module.exports = router;