require('dotenv').config();
const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../../middleware/auth')
const authAdmin = require('../../middleware/authAdmin')
const fs = require('fs')

//upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: "No files were uploaded" })

        const file = req.files.file;
        if (file.size > 1024 * 1024 * 5) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Maksimal size 5mb" })
        }
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Format File Salah" })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "product_images" }, async (err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })

    } catch (err) {
        return res.status(403).json({ msg: err.message })
    }
})

//delete image
router.post('/delete_image', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No images selected" })

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;

            res.json({ msg: "Deleted Image" })
        })

    } catch (err) {
        return res.status(403).json({ msg: err.message })
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router