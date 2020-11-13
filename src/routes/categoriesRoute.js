const router = require('express').Router()
const categoriesController = require('../controllers/categoriesController')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')

router.route('/categories')
    .get(categoriesController.getCategories)
    .post(auth, authAdmin, categoriesController.createCategories)

router.route('/categories/:id')
    .delete(auth, authAdmin, categoriesController.deleteCategories)
    .put(auth, authAdmin, categoriesController.updateCategories)

module.exports = router