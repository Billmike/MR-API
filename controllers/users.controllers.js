const bcryptjs = require('bcryptjs');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');

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
          const token = jwt.sign({
            user_id: user[0].user_id,
          }, process.env.SECRET_KEY);

          response.status(201).json({
            success: true,
            message: 'Signup successful',
            user: {
              username: user[0].username,
            },
            token,
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

/**
 * Log in User
 *
 * @param {Object} request The express request object
 * @param {Object} response The express response object
 *
 * @returns {Object} Signed in user object
 */
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
      if (user.length === 0) {
        return response.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const comparePassword = bcryptjs.compareSync(password, user[0].password);
      if (comparePassword === false) {
        return response.json({
          success: false,
          message: 'Login failed. Check the username or password provided',
        });
      }

      const token = jwt.sign({
        user_id: user[0].user_id,
      }, process.env.SECRET_KEY);

      return response.status(201).json({
        success: true,
        message: 'Sign in successful',
        user: {
          username: user[0].username,
        },
        token,
      });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred. We are working to have this resolved.',
      });
    });
};

/**
 * Follow author
 *
 * @param {Object} request The express request object
 * @param {Object} response The express response object
 *
 * @returns {void}
 */
const followAuthor = (request, response) => {
  const {
    params: { userId },
    user,
  } = request;

  const selectUserQuery = {
    text: 'SELECT * FROM users WHERE user_id = $1',
    values: [userId],
  };

  const selectFollowingQuery = {
    text: 'SELECT * FROM follows WHERE user_id = $1 AND following_user = $2',
    values: [userId, user[0].user_id],
  };

  const insertQuery = {
    text: 'INSERT INTO follows(user_id, following_user) VALUES($1, $2) RETURNING *',
    values: [userId, user[0].user_id],
  };

  return db.query(selectUserQuery)
    .then((foundUser) => {
      if (foundUser.length === 0) {
        return response.status(404).json({
          success: false,
          message: `User with the ID: ${userId} was not found`,
        });
      }

      return db.query(selectFollowingQuery)
        .then((foundFollowing) => {
          if (foundFollowing.length === 1) {
            return response.status(409).json({
              success: false,
              message: 'You already followed this user',
            });
          }

          return db.query(insertQuery)
            .then(() => {
              response.status(201).json({
                success: true,
                message: 'Successfully followed user',
              });
            });
        });
    })
    .catch(() => {
      response.status(500).json({
        success: false,
        message: 'An error occurred. Please try again later',
      });
    });
};

/**
 * Edit Profile
 *
 * @param {Object} request The express request object
 * @param {*} response The express response object
 *
 * @returns {void}
 */
const editProfile = (request, response) => {
  const {
    user,
    body: {
      username,
      bio,
      hobbies,
      imageUrl,
    },
  } = request;

  const selectUserQuery = {
    text: 'SELECT * FROM users WHERE user_id = $1',
    values: [user[0].user_id],
  };

  return db.query(selectUserQuery)
    .then((foundUser) => {
      if (foundUser.length === 0) {
        return response.status(404).json({
          success: false,
          message: `User with the ID: ${user[0].user_id} was not found`,
        });
      }

      const updateUserQuery = {
        text: 'UPDATE users SET username=$1, bio=$2, hobbies=$3, image_url=$4 WHERE user_id = $5',
        values: [
          username || user[0].username,
          bio || user[0].bio,
          hobbies || user[0].hobbies,
          imageUrl || user[0].image_url,
          user[0].user_id,
        ],
      };
      return db.query(updateUserQuery)
        .then(() => response.status(204).json({
          success: true,
          message: 'User profile updated successfully',
        }));
    })
    .catch(() => response.status(500).json({
      success: false,
      message: 'An error occurred',
    }));
};

module.exports = {
  createUser,
  loginUser,
  followAuthor,
  editProfile,
};
