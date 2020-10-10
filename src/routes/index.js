const express = require('express');
const router = express.Router();

const { Register, Login, listUsers, getSingleUsers, forgotPassword } = require('../controllers/usersController');

const { validationDaftar, runValidation } = require('../../validation');
const middleware = require('../../middleware');

const { addProducts, listProducts, getProductsById, editProducts, deleteProducts } = require('../controllers/productsController');

router.post('/register', validationDaftar, runValidation, Register);
router.post('/login', Login);
router.get('/users', listUsers);
router.get('/users/:id', middleware, getSingleUsers);
router.put('/forgotpassword', forgotPassword); 

router.post('/add_products', addProducts);
router.get('/products', listProducts);
router.get('/products/:id', getProductsById);
router.put('/edit_products/:id', editProducts);
router.delete('/delete_products/:id', deleteProducts);

module.exports = router;