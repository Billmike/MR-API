const { Router } = require('express');

const app = Router();

app.get('/', (request, response) => response.status(200).json({
  message: 'Welcome to the MR API!',
}));

module.exports = app;
