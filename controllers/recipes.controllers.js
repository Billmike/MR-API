const { v4 } = require('uuid');
const db = require('../db-config');

/**
 * Create Recipe
 *
 * @param {object} request The express request object
 * @param {object} response The express response object
 *
 * @returns {object} The created recipe
 */
const createRecipe = (request, response) => {
  const {
    body: {
      name,
      description,
      category,
      cookTime,
      imageUrl,
      ingredients,
      directions,
      portion,
    },
    user,
  } = request;

  const owner = user[0].user_id;

  const selectQuery = {
    text: 'SELECT * FROM recipes WHERE name = $1',
    values: [name],
  };

  const insertQuery = {
    text: 'INSERT INTO recipes(recipe_id, name, description, category, cook_time, image_url, ingredients, directions, portion, owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    values: [
      v4(),
      name,
      description,
      category,
      cookTime,
      imageUrl,
      ingredients,
      directions,
      portion,
      owner,
    ],
  };

  return db.query(selectQuery)
    .then((existingRecipe) => {
      if (existingRecipe.length > 0) {
        return response.status(409).json({
          success: false,
          message: 'A recipe with this name has been created. We encourage our users to be unique in naming their recipes!',
        });
      }

      return db.query(insertQuery)
        .then((recipe) => {
          response.status(201).json({
            success: true,
            message: 'Recipe created successfully',
            recipe,
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred while trying to complete your request. Please try again',
      });
    });
};

/**
 * Edit Recipe
 *
 * @param {object} request The express request object
 * @param {object} response The express response object
 *
 * @returns {object} The response object
 */
const editRecipe = (request, response) => {
  const {
    body: {
      name,
      description,
      category,
      cookTime,
      imageUrl,
      ingredients,
      directions,
      portion,
    },
    params: {
      recipeId,
    },
    user,
  } = request;

  const selectQuery = {
    text: 'SELECT * FROM recipes WHERE recipe_id = $1',
    values: [recipeId],
  };

  return db.query(selectQuery)
    .then((foundRecipe) => {
      if (foundRecipe.length === 0) {
        return response.status(404).json({
          success: false,
          message: `Recipe with ID: ${recipeId} not found`,
        });
      }

      if (foundRecipe[0].owner !== user[0].user_id) {
        return response.status(403).json({
          success: false,
          message: 'You cannot perform this action as you do not own this recipe',
        });
      }

      const updateQuery = {
        text: 'UPDATE recipes SET name=$1, description=$2, category=$3, cook_time=$4, image_url=$5, ingredients=$6, directions=$7, portion=$8 WHERE recipe_id = $9',
        values: [
          name || foundRecipe[0].name,
          description || foundRecipe[0].description,
          category || foundRecipe[0].category,
          cookTime || foundRecipe[0].cook_time,
          imageUrl || foundRecipe[0].image_url,
          ingredients || foundRecipe[0].ingredients,
          directions || foundRecipe[0].directions,
          portion || foundRecipe[0].portion,
          recipeId,
        ],
      };

      return db.query(updateQuery)
        .then(() => {
          response.status(204).json({
            success: true,
            message: 'Recipe update successful',
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred while trying to update the recipe',
      });
    });
};

/**
 * Delete Recipe
 *
 * @param {object} request The express request object
 * @param {object} response The express response object
 *
 * @returns {object} The response object
 */
const deleteRecipe = (request, response) => {
  const { params: { recipeId }, user } = request;

  const selectQuery = {
    text: 'SELECT * FROM recipes WHERE recipe_id = $1',
    values: [recipeId],
  };

  const deleteQuery = {
    text: 'DELETE FROM recipes WHERE recipe_id = $1',
    values: [recipeId],
  };

  return db.query(selectQuery)
    .then((foundRecipe) => {
      if (foundRecipe.length === 0) {
        return response.status(404).json({
          success: false,
          message: `Recipe with ID: ${recipeId} not found`,
        });
      }

      if (foundRecipe[0].owner !== user[0].user_id) {
        return response.status(403).json({
          success: false,
          message: 'You cannot perform this action as you do not own this recipe',
        });
      }

      return db.query(deleteQuery)
        .then(() => {
          response.status(204).json({
            success: true,
            message: 'Recipe deleted successfully',
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred. Please try again',
      });
    });
};

/**
 * Like Recipe method
 *
 * @param {Object} request The express request object
 * @param {*} response The express response object
 *
 * @returns {void}
 */
const likeRecipe = (request, response) => {
  const { params: { recipeId }, user } = request;

  const selectQuery = {
    text: 'SELECT * FROM recipes WHERE recipe_id = $1',
    values: [recipeId],
  };

  const selectLikesQuery = {
    text: 'SELECT * FROM likes WHERE fav_recipe_id = $1 AND fav_user_id = $2',
    values: [recipeId, user[0].user_id],
  };

  const deleteLikeQuery = {
    text: 'DELETE from likes WHERE fav_recipe_id = $1 AND fav_user_id = $2',
    values: [recipeId, user[0].user_id],
  };

  const createLikeQuery = {
    text: 'INSERT INTO likes(fav_recipe_id, fav_user_id) VALUES($1, $2)',
    values: [recipeId, user[0].user_id],
  };

  return db.query(selectQuery)
    .then((foundRecipe) => {
      if (foundRecipe.length === 0) {
        return response.status(404).json({
          success: false,
          message: `Recipe with ID: ${recipeId} not found`,
        });
      }

      if (foundRecipe[0].owner === user[0].user_id) {
        return response.status(403).json({
          success: false,
          message: 'You cannot perform this action on your own recipe',
        });
      }

      return db.query(selectLikesQuery)
        .then((foundLike) => {
          if (foundLike.length === 1) {
            return db.query(deleteLikeQuery)
              .then(() => response.status(204).json({
                success: true,
                message: 'Recipe removed from your likes',
              }));
          }

          return db.query(createLikeQuery)
            .then(() => {
              response.status(201).json({
                success: true,
                message: 'Recipe added to your list of likes',
              });
            });
        });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred',
      });
    });
};

module.exports = {
  createRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
};
