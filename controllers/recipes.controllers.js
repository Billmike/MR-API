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

  console.log('What user is', user);

  const selectQuery = {
    text: 'SELECT * FROM recipes WHERE name = $1',
    values: [name],
  };

  const insertQuery = {
    text: 'INSERT INTO recipes(recipe_id, name, description, category, cook_time, image_url, ingredients, directions, portion, owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
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
    ],
  };
};

module.exports = createRecipe;
