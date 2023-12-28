const {returnRes} = require('../helpers/returnRes');

const createUser = (req, res) => {
    
    returnRes(res, 200, "User created.")
}
const listSelectedUser = (req, res) => {
    res.status(200).send({
        message: "Selected User is here."
    })}

const listUser = (req, res) => {
    res.status(200).send({
        message: "User is here."
    })}

const updateUser = (req, res) => {
    res.status(200).send({
        message: "User details updated."
    })}

const deleteUser = (req, res) => {
    res.status(200).send({
        message: "User deleted."
    })
}

module.exports = {
    createUser, listSelectedUser, listUser, updateUser, deleteUser
};