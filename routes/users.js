const { Router } = require('express');
const userController = require('../controllers/users.controllers');

const user = Router();

user.post('/signup', userController.createUser);
user.post('/login', userController.loginUser);

module.exports = user;
