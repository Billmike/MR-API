const { v4 } = require('uuid');
const db = require('../db-config');

const createRecipe = (request, response) => {
  const {
    body: {
      name,
      description,
      category,
      cook_time,
      image_url,
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
      cook_time,
      image_url,
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

module.exports = {
  createRecipe,
};
