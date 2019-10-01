const { Router } = require('express');
const recipeController = require('../controllers/recipes.controllers');
const verifySessionMiddleware = require('../middleware/loginRequired');

const recipe = Router();

recipe.post('/', verifySessionMiddleware, recipeController.createRecipe);
recipe.patch('/:recipeId', verifySessionMiddleware, recipeController.editRecipe);
recipe.delete('/:recipeId', verifySessionMiddleware, recipeController.deleteRecipe);

module.exports = recipe;
