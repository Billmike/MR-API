const { Router } = require('express');
const userRoutes = require('./users');

const app = Router();

app.get('/', (request, response) => response.status(200).json({
  message: 'Welcome to the MR API!',
}));

app.use('/user', userRoutes);

module.exports = app;
