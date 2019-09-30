const bcryptjs = require('bcryptjs');
const { v4 } = require('uuid');

const db = require('../db-config');
const validateUserSignup = require('../utils/validateSignup');

/**
 * Create User
 *
 * @param {Object} request The express request object
 * @param {Object} response The express response object
 *
 * @returns {object} The newly created user object
 */
const createUser = (request, response) => {
  const { username, password } = request.body;
  const userData = { username, password };

  const salt = bcryptjs.genSaltSync(12);
  const hashedPassword = bcryptjs.hashSync(password, salt);


  const selectQuery = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username],
  };

  const insertQuery = {
    text: 'INSERT INTO users(username, password, user_id) VALUES($1, $2, $3) RETURNING *',
    values: [username, hashedPassword, v4()],
  };

  const { errors, isValid } = validateUserSignup(userData);

  if (!isValid) {
    return response.status(400).json({
      message: 'Invalid input supplied',
      errors,
    });
  }

  return db.query(selectQuery)
    .then((existingUser) => {
      if (existingUser.length === 1) {
        return response.status(409).json({
          status: false,
          message: 'This username is already taken',
        });
      }
      return db.query(insertQuery)
        .then((user) => {
          response.status(201).json({
            success: true,
            message: 'Signup successful',
            user: {
              username: user[0].username,
              user_id: user[0].user_id,
            },
          });
        });
    })
    .catch(() => {
      response.status(500).json({
        status: false,
        message: 'An error occurred. We are working to have this resolved.',
      });
    });
};

const loginUser = (request, response) => {
  const { username, password } = request.body;
  const userData = { username, password };

  const selectQuery = {
    text: 'SELECT * from users WHERE username = $1',
    values: [username],
  };

  const { errors, isValid } = validateUserSignup(userData);

  if (!isValid) {
    return response.status(400).json({
      message: 'Invalid input supplied',
      errors,
    });
  }

  return db.query(selectQuery)
    .then((user) => {
      console.log('found user', user);
    })
    .catch((error) => {
      console.log('got error', error);
    });
};

module.exports = {
  createUser,
  loginUser,
};
