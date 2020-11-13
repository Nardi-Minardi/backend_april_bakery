const router = require("express").Router()
const ordersController = require("../controllers/ordersController")

router.route('/orders')
    .post(ordersController.createOrders)

module.exports = router