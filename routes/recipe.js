const { Router } = require('express');
const recipeController = require('../controllers/recipes.controllers');
const verifySessionMiddleware = require('../middleware/loginRequired');

const recipe = Router();

recipe.post('/', verifySessionMiddleware, recipeController.createRecipe);

module.exports = recipe;
