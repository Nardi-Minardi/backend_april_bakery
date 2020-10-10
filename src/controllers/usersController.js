require('dotenv').config();
const Users = require('../models/usersModel');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { kirimEmail } = require('../../helpers');

// register
exports.Register = async (req, res) => {
    // menampung varialbel dari request body
    const { username, email, password } = req.body

    const hashPassword = await bcryptjs.hash(password, 10)
    const usernameExist = await Users.findOne({username: username})
    const emailExist = await Users.findOne({email: email})
    // jika register dengan username dan email yang sama
    if(usernameExist) {
        return res.status(404).json({
            status: false,
            message: "Username sudah terdaftar"
        })
    }

    if(emailExist) {
        return res.status(404).json({
            status: false,
            message: "Email sudah terdaftar"
        })
    }
    
    const users = new Users({
        username: username,
        email: email,
        password: hashPassword
    })

        await users.save()
        return res.status(200).json({
            message: "Berhasil  mendaftar",
            data: users
    })
                    
}

//proses login bisa pakai username dan email 
exports.Login = async (req, res) => {
    const { username, password } = req.body
        
    const users = await Users.findOne({$or: [{username: username}, {email: username}]})
        if(users) {
    //jika usernamaenya terdaftar masuk proses berhasil
    const passwordUsers = await bcryptjs.compare(password, users.password)
        if(passwordUsers) {
    //jika passwordnya terdaftar di db proses masuk
    const data = {
        //parameter id
        id: users._id
        }
    //proses mengambil token
    const token = await jsonwebtoken.sign(data, process.env.JWT_SECRET)
        return res.status(200).json({
            message: 'Berhasil',
            token : token
        })
        } else {
        return res.status(404).json({
            message: 'Password yang anda masukan salah'
        })
        }

        } else {
            return res.status(404).json({
            message: 'Username atau email tidak terdaftar'
        })
    }
}

// read atau tampil users
exports.listUsers = async (req, res) => {
    const listUsers = await Users.find()
    return res.status(404).json({
        data: listUsers
    })
}

//mengambil single user
exports.getSingleUsers = async (req, res) => {
    const singleUsers = await Users.findOne({_id: req.id})
        return res.status(201).json({
            message: "Berhasil",
            data: singleUsers
        })
}

//lupa password 
exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    const users = await Users.findOne({email: email})
        if(!users) {
            return res.status(200).json ({
                status: false,
                message: "email tidak terdaftar"
            })
        }
    
    const token = jsonwebtoken.sign({
        id: users._id
    }, process.env.JWT_SECRET)

    await Users.updateOne({resetPasswordLink: token})

    const templateEmail = {
        from: "April's Bakery",
        to: email,
        subject: "Link reset password",
        html: ` <p>Silahkan klik link dibawah untuk resert password anda</p> <p>${process.env.CLIENT_URL}/resetpassword/${token}</p> `
    }
    kirimEmail(templateEmail)
        return res.status(200).json ({
            status: true,
            message: "Link reset pasword berhasil terkirim"
    
    })
}