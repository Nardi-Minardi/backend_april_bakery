require('dotenv').config();
const Products = require('../models/productsModel');

//FIlter, sorting and pagination
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //querySring = req.query

        // console.log({ before: queryObj }) //before delete page
       
        const excludedFields = ['page', 'sort', 'limit']

        excludedFields.forEach(el => delete (queryObj[el]))

        // console.log({ after: queryObj }) //after delete page

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        console.log({ queryStr })

        // gte = greater than or equal
        // lte = lesser than or equal
        // lt = lesser than
        // gt = greater than
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productsController = {
    getProducts: async (req, res) => {
        try {

            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query

            return res.status(200).json({
                status: "success",
                result: products.length,
                products: products
            })

        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    getProductsById: async (req, res) => {
        try {
            let type = req.query.type
            let productIds = req.query.id
            if (type === 'array') {

            }

            // we need to find the product information that belong to product Id

            Products.find({ '_id': { $in: productIds } })
                .populate('writer')
                .exec((err, products) => {
                    if (err) return req.status(403).send(err)
                    return res.status(200).send(products)
            })

        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    createProducts: async (req, res) => {
        try {
            const { idProducts, productsName, price, image, description, categories } = req.body;
            if (!image) return res.status(400).json({ msg: "No images upload" })

            const productExist = await Products.findOne({ idProducts })
            if (productExist) return res.status(400).json({ message: "This Product already exist" })

            const newProduct = new Products({
                idProducts,
                productsName,
                price,
                image,
                description,
                categories
            })

            await newProduct.save()
            res.json({
                message: "Success Created Product",
                data: newProduct
        })
        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    updateProducts: async (req, res) => {
        try {
            const { idProducts, productsName, price, image, description, categories } = req.body;

            const updateProduct = await Products.updateOne(req.param.id, {
                idProducts,
                productsName,
                price,
                image,
                description,
                categories
            })
            return res.status(200).json({
                message: "Updated Products",
                data: updateProduct
            })
        } catch (err) {
            return res.status({ message: err.message })
        }
    },
    deleteProducts: async (req, res) => {
        try {
            await Products.deleteOne(req.param.id)
            return res.status(200).json("Deleted Products")
        } catch (err) {
            return res.status(403).json({ message: error.message })
        }
    }
}

module.exports = productsController




