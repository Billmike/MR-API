const { Router } = require('express');
const recipeController = require('../controllers/recipes.controllers');

const recipe = Router();

recipe.post('/', recipeController.createRecipe);
