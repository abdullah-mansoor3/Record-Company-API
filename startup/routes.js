const express = require('express');
const bands = require('../routes/bands');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/bands', bands);
  app.use(error);
};
