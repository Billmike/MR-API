const { Router } = require('express');
const recipeController = require('../controllers/recipes.controllers');
const verifySessionMiddleware = require('../middleware/loginRequired');

const recipe = Router();

recipe.post('/', verifySessionMiddleware, recipeController.createRecipe);
recipe.patch('/:recipeId', verifySessionMiddleware, recipeController.editRecipe);

module.exports = recipe;
