const Users = require('../src/models/usersModel')

const authAdmin = async (req, res, next) => {
    try {
        // get user information by id
        const user = await Users.findOne({
            _id: req.user.id
        })
        if (user.role === 0)
            return res.status(400).json({ msg: "Akses Admin ditolak" })

        next()
    } catch (err) {
        return res.status(403).json({ msg: err.message })
    }
}

module.exports = authAdmin