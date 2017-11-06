const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
// const ensureAuth = require('./utils/ensure-auth');


app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());



const actors = require('./routes/actors');
const films = require('./routes/films');
const studios = require('./routes/studios');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');

const auth = require('./routes/auth');
app.use('/api/auth', auth);

app.use('/api/filmIndustry/studios', studios);
app.use('/api/filmIndustry/actors', actors);
app.use('/api/filmIndustry/films', films);
app.use('/api/filmIndustry/reviewers', reviewers);
app.use('/api/filmIndustry/reviews', reviews);







app.use(errorHandler());

module.exports = app;
