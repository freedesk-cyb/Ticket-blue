const express = require('express');
const app = express();

app.get('*', (req, res) => {
  res.status(200).send('Plain Express responding!');
});

module.exports = app;
