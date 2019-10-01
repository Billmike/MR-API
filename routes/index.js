const { Router } = require('express');
const userRoutes = require('./users');
const recipesRoutes = require('./recipe');

const app = Router();

app.get('/', (request, response) => response.status(200).json({
  message: 'Welcome to the MR API!',
}));

app.use('/user', userRoutes);
app.use('/recipe', recipesRoutes);

module.exports = app;
