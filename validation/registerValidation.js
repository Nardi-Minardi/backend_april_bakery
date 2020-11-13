const { check, validationResult } = require('express-validator');

const registerValidation = () => [
    check('username', 'username tidak boleh kosong').notEmpty(),
    check('email', 'email tidak boleh kosong').notEmpty().matches(/.+\@.+\..+/).withMessage('Format Email Salah'),
    check('password', 'Password tidak boleh kosong').notEmpty().isLength({ min: 6 }).withMessage('Password Minimal 6 Characters'),
]

const runValidation = (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg
            })
        }
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
}

module.exports = {
    add: [
        registerValidation(),
        runValidation
    ]
}


