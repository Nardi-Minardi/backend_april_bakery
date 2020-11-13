require('dotenv').config();
const Orders = require("../models/ordersModel")

const ordersController = {
    createOrders: async (req, res) => {
        try {
            const { idOrders, amount, total, products } = req.body
            if (!idOrders) return res.status(400).json({ msg: "Tidak ada order produk" })

            const newOrders = new Orders({
                idOrders,
                amount,
                total,
                products
            })

            await newOrders.save()
            return res.status(200).json({
                message: "Success created order",
                data: newOrders
            })

        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    }
}

module.exports = ordersController