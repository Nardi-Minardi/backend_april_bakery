require('dotenv').config();
const Products = require('../models/productsModel');
const Formidable = require('formidable');
const path = require('path');

exports.addProducts = (req, res) => {
    
    //tambah produk dengan image menggunakan form-data di api
    const form = new Formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        const { kodeProducts, productsName, price, description, stock } = fields
        const { image } = files
        const products = new Products({
            kodeProducts: kodeProducts,
            productsName: productsName,
            price: price,
            image: image,
            description: description,
            stock: stock
        })
        products.image = image.name
        await products.save()
            return res.status(200).json({
                message: "Produk berhasil ditambahkan",
                data: products
            })
    })

//menyimpan image
    form.on('fileBegin', function (name, file) {
        if(name === 'image') {
            file.path = path.resolve('../../assets/product_images', file.name)
        }
    })
}

// read atau tampil produk
exports.listProducts = async (req, res) => {
        const listProducts = await Products.find()
        return res.status(200).json({
            data: listProducts
        })
}

//menampilkan produk berdasarkan id
exports.getProductsById = async (req, res) => {
    const getProductsById = await Products.findById({_id: req.params.id})
    return res.status(200).json({
        message: "Berhasil",
        data: getProductsById
    })
}

//ubah update produk
exports.editProducts = async (req, res) => {
    const editProducts = await Products.updateOne({_id: req.params.id}, 
    {
        productsName: req.body.productsName,
        price: req.body.price,
        description: req.body.description
    })
        return res.status(201).json({
            message: "Berhasil",
            data: editProducts
    })
}

//delete produk
exports.deleteProducts = async (req, res) => {
    const deleteProducts = await Products.deleteOne({_id: req.params.id})
    return res.status(201).json({
        message: "Berhasil",
        data: deleteProducts
    })
}


