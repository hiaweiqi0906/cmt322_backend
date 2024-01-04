const fs = require('fs')
const getUserInfo = require('../helpers/getUserInfo');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError } = require('../helpers/exceptions');
const validator = require('validator');
const User = require('../models/user');
const mongoose = require('mongoose');
const { promisify } = require('util')
const Case = require('../models/case');
const googleDrive = require('../utils/googleDrive'); // Import the new module
const unlinkAsync = promisify(fs.unlink)
const { userInfo } = require('os');

const createUser = async (req, res) => {
    // const {_id} = getUserInfo(res)
    const {
        username,
        email,
        password,
        avatar_url,
        type
    } = req.body

    try {
        const new_user = new User({
            username,
            email,
            password,
            avatar_url,
            type
        });

        const new_entered_user = await new_user.save();
        if (!new_entered_user) {
            return res.json({
                error: 'No User uploaded'
            })
        }

        return res.status(200).send(new_user)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors) {
                if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value"))
                    validationErrors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        }
    }

}

const listSelectedUser = async (req, res) => {
    res.status(200).send({
        message: "Selected User is here."
    })}

const listUser = async (req, res) => {
    try {
        const allUser = await User.find({})

        if (!allUser)
            throw new DataNotExistError("User does not exist")

        return res.status(200).send(allUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const updateUser = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id } = req.params

    const selectUserID = type === "admin" ? id : userId;

    const {
        username,
        email,
        password,
        avatar_url,
        role
    } = req.body

    const update = {
        username,
        email,
        password,
        avatar_url,
        type:role
    }

    try {

        const selectedUser = await User.findByIdAndUpdate(selectUserID,
            update
        )

        if (!selectedUser) {
            throw new DataNotExistError("User not exist")
        }

        return res.status(200).send(selectedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const deleteUser = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id } = req.params

    const selectUserID = type === "admin" ? id : userId;

    try{

        const deletedUser = await User.findByIdAndDelete(selectUserID)
        if (!deletedUser)
            throw new DataNotExistError("User does not exist")

    return res.status(200).send(deletedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

module.exports = {
    createUser, listSelectedUser, listUser, updateUser, deleteUser
};