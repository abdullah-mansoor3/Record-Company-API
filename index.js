const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./startup/db');
require('./startup/routes')(app); 

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
