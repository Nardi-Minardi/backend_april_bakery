const router = require('express').Router()
const productsController = require('../controllers/productsController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/products')
    .get(productsController.getProducts)
    .post(auth, authAdmin, productsController.createProducts)

router.route('/products/:id')
    .delete(productsController.deleteProducts)
    .put(productsController.updateProducts)

router.route('/products/detail')
    .get(productsController.getProductsById)

module.exports = router