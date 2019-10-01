const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const db = require('../db-config');

config();

const checkIfUserIsLoggedInAndVerifyToken = (request, response, next) => {
  const token = request.headers['x-access-token'] || request.headers.token || request.query.token;
  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'You need to be logged in to perform this action',
    });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (!decodedToken.user_id) {
    return response.status(401).json({
      success: false,
      message: 'Session has expired. Please log in again',
    });
  }

  const selectQuery = {
    text: 'SELECT * FROM users WHERE user_id = $1',
    values: [decodedToken.user_id],
  };

  return db.query(selectQuery).then((user) => {
    request.user = user;
    return next();
  });
};

module.exports = checkIfUserIsLoggedInAndVerifyToken;
