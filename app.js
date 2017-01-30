const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
var debug = require('debug')('cip:server');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/images/curated', function(req, res, next) {
  const { page, per_page } = req.query;
  axios(`https://api.unsplash.com/photos/curated?page=${page}&client_id=${process.env.UNSPLASH_CLIENT_ID}&per_page=${per_page}`)
  .then(function(response) {
    res.json(response.data);
  })
  .catch(function(err) {
    next(err);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  debug(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
