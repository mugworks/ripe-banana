const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const errorHandler = require('./utils/error-handler');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(bodyParser.json());

const actors = require('./routes/actors');
const studios = require('./routes/studios');

app.use('/api/filmIndustry/actors', actors);
app.use('/api/filmIndustry/studios', studios);

module.exports = app;
