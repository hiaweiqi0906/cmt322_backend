const {returnRes} = require('../helpers/returnRes');

const createDoc = (req, res) => {
    returnRes(res, 200, "createDoc")
}
const readDoc = (req, res) => {
    res.status(200).send({
        message: "readDoc"
    })}

const listDoc = (req, res) => {
    res.status(200).send({
        message: "listDoc"
    })}

const updateDoc = (req, res) => {
    res.status(200).send({
        message: "updateDoc"
    })}

const deleteDoc = (req, res) => {
    res.status(200).send({
        message: "deleteDoc"
    })
}

module.exports = {
    createDoc, readDoc, listDoc, updateDoc, deleteDoc
};
