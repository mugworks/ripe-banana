const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
// const ensureAuth = require('./utils/ensure-auth')();

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());
// app.use(ensureAuth);

const actors = require('./routes/actors');
app.use('/api/filmIndustry/actors', actors);

const films = require('./routes/films');
app.use('/api/filmIndustry/films', films);

const studios = require('./routes/studios');
app.use('/api/filmIndustry/studios', studios);

const reviewers = require('./routes/reviewers');
app.use('/api/filmIndustry/reviewers', reviewers);

const reviews = require('./routes/reviews');
app.use('/api/filmIndustry/reviews', reviews);

const auth = require('./routes/auth');
app.use('/api/filmIndustry/auth', auth);

app.use(errorHandler());

module.exports = app;
