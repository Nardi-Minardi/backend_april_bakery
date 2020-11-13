const Categories = require('../models/categoriesModel')

const categoriesController = {
    getCategories: async (req, res) => {
        try {
            const categories = await Categories.find()
            return res.json(categories)
        } catch (err) {
            return res.status(403).json({ msg: err.message })
        }
    },
    createCategories: async (req, res) => {
        try {
            // if user have role =1 ---> admin
            // only admin can create, delete and update category
            const { name } = req.body;
            const categories = await Categories.findOne({ name })
            if (categories) return res.status(400).json({ msg: "Category Sudah Ada" })

            const newCategories = new Categories({ name })

            await newCategories.save()
            res.json({ msg: 'Created a Category' })
        } catch (err) {
            return res.status(403).json({ msg: err.message })
        }
    },
    deleteCategories: async (req, res) => {
        try {
            await Categories.deleteOne(req.param.id)
            return res.json({ msg: "Deleted Category" })
        } catch (err) {
            return res.status(403).json({
                msg: err.message
            })
        }
    },
    updateCategories: async (req, res) => {
        try {
            const { name } = req.body;
            await Categories.updateOne(req.param.id, { name })
            return res.status(200).json({ msg: "Updated Category" })
        } catch (err) {
            return res.status(403).json({ msg: err.message })
        }
    },
}

module.exports = categoriesController

