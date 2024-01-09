const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json('tests is working')
}

const registerUser = async (req, res) => {
    try {
        const { email, password, username, number, address, type, avatar_url } = req.body;
        const hashedPassword = await hashPassword(password)
        // check empty value
        if (!email) {
            return res.json({
                err: 'Email is required!'
            })
        }

        if (!password || password.length < 6) {
            return res.json({
                err: 'Password of at least 6 characters long is required!'
            })
        }

        if (!username) {
            return res.json({
                err: 'username is required!'
            })
        } 
        if (!number) {
            return res.json({
                err: 'Number is required!'
            })
        }
        if (!address) {
            return res.json({
                err: 'Address is required!'
            })
        }
        if (!type) {
            return res.json({
                err: 'Type is required!'
            })
        } 

        else {
            // find user if exist in db
            // create user record in db
            const newUser = new User({
                username, email, number, address, password:hashedPassword, avatar_url, type,
            })
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
            // if err throw err to fe
            // else return status ok
        }
    } catch (error) {
        res.status(400).json({ message: 'User registration failed' });
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
                name: user.username,
                type: user.type
            }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000,
                })
                .json({ token, type: user.type, name: user.username})
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