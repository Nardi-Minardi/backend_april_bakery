require('dotenv').config();
const Users = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const { createTestAccount } = require('nodemailer');
// const { kirimEmail } = require('../../helpers');

// users
const usersController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const userExist = await Users.findOne({ username })
            if (userExist) return res.status(400).json({ message: "Username Sudah Terdaftar" })

            const emailExist = await Users.findOne({ email })
            if (emailExist) return res.status(400).json({ message: "Email Sudah Terdaftar" })

            // if (password.length < 6)
            //     return res.status(400).json({ message: "Password Minimal 6 Character" })

            // password encryption
            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = new Users({
                username: username.toLowerCase(),
                email,
                password: hashPassword
            })

            // save mongodb
            await newUser.save()

            // create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: '/users/refresh_token'
            })

            return res.status(200).json({
                message: "Register Success!",
                token: accesstoken
            })

        } catch (err) {
            return res.status(403).json({ message: err.message })
    }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ message: "User Tidak Terdaftar" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ message: "Password Yang Anda Masukan Salah" })

            // if login success, create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/users/refresh_token"
            })

            return res.status(200).json({
                message: "Login Success!",
                accesstoken: accesstoken
            })

        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', ({ path: "/users/refresh_token" }))
            return res.status(200).json({ message: "Logged Out" })
        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ message: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ message: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                return res.status(200).json({ user, accesstoken })
            })

            // return res.status(200).json({ rf_token })


        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ message: "User Tidak Terdaftar" })

            res.json(user)
        } catch (err) {
            return res.status(403).json({ message: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const users = await Users.findOne({email: email})
                if(!users) {
                    return res.status(400).json({
                        status: false,
                        message: "email tidak terdaftar"
                    })
                }

            const token = jsonwebtoken.sign({ id: users._id }, process.env.JWT_SECRET)

            await Users.updateOne({resetPasswordLink: token})

            const templateEmail = {
                from: "April's Bakery",
                to: email,
                subject: "Link reset password",
                html: ` <p>Silahkan klik link dibawah untuk resert password anda</p> <p>${process.env.CLIENT_URL}/resetpassword/${token}</p> `
            }
            kirimEmail(templateEmail)
            return res.status(201).json({
                status: true,
                message: "Link reset pasword berhasil terkirim"
            })

        } catch (err) {
            return res.status(403).json({ message: error.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
// usersSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ id: this._id }, 'secretKey', { expiresIn: '1d' })
//     return token;


module.exports = usersController