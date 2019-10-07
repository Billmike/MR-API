const { Router } = require('express');
const userController = require('../controllers/users.controllers');
const verifySessionMiddleware = require('../middleware/loginRequired');

const user = Router();

user.post('/signup', userController.createUser);
user.post('/login', userController.loginUser);
user.post('/follow/:userId', verifySessionMiddleware, userController.followAuthor);
user.patch('/', verifySessionMiddleware, userController.editProfile);
user.patch('/password', verifySessionMiddleware, userController.updatePassword);
user.post('/:userId', verifySessionMiddleware, userController.blockUser);

module.exports = user;
