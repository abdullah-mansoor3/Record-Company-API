const express = require('express');
const bands = require('../routes/bands');
const albums = require('../routes/albums');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/bands', bands);
  app.use('/albums', albums);
  app.use(error);
};
