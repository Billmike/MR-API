const { Router } = require('express');
const recipeController = require('../controllers/recipes.controllers');
const verifySessionMiddleware = require('../middleware/loginRequired');

const recipe = Router();

recipe.post('/', verifySessionMiddleware, recipeController.createRecipe);
recipe.patch('/:recipeId', verifySessionMiddleware, recipeController.editRecipe);
recipe.delete('/:recipeId', verifySessionMiddleware, recipeController.deleteRecipe);
recipe.post('/:recipeId', verifySessionMiddleware, recipeController.likeRecipe);
recipe.post('/review/:recipeId', verifySessionMiddleware, recipeController.reviewRecipe);
recipe.get('/favorites', verifySessionMiddleware, recipeController.getFavoriteRecipes);

module.exports = recipe;
