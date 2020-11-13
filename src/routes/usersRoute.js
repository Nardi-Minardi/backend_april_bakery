const router = require('express').Router()
const usersController = require('../controllers/usersController')
const auth = require('../../middleware/auth')
const registerValidation = require('../../validation/registerValidation');

router.post('/users/register', registerValidation.add, usersController.register)

router.post('/users/login', usersController.login)

router.get('/users/logout', usersController.logout)

router.get('/users/refresh_token', usersController.refreshToken)

router.post('/users/forgotPassword', usersController.forgotPassword)

router.get('/users/info', auth, usersController.getUser)

module.exports = router