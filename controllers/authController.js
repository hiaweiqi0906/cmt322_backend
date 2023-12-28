const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json('tests is working')
}

const registerUser = (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check empty value
        if (!name) {
            return res.json({
                err: 'Name is required!'
            })
        }

        if (!password || password.length < 6) {
            return res.json({
                err: 'Password of at least 6 characters long is required!'
            })
        }

        if (!email) {
            return res.json({
                err: 'Email is required!'
            })
        } else {
            // find user if exist in db
            // create user record in db
            // if err throw err to fe
            // else return status ok
        }
    } catch (error) {

    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }

        const match = await comparePassword(password, user.password)
        if (match) {
            jwt.sign({
                email: user.email,
                userId: user._id,
                name: user.name,
                type: user.type
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000,
                }).json({ token })
            })
        }
    } catch (error) {
        console.log('err occured', error)
        res.json({
            message: "error occurred",
            error: this.error
        })
    }
}

const readUser = (req, res) => {
    console.log("here", res.locals)
}

module.exports = { test, registerUser, loginUser, readUser }