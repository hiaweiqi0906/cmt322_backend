const fs = require('fs')
const getUserInfo = require('../helpers/getUserInfo');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError } = require('../helpers/exceptions');
const validator = require('validator');
const Document = require('../models/document');
const mongoose = require('mongoose');
const { promisify } = require('util')
const Case = require('../models/case');
const googleDrive = require('../utils/googleDrive'); // Import the new module
const unlinkAsync = promisify(fs.unlink)

const checkCaseAccess = async (userId, type, caseId) => {
    let cases;
    if (type === "admin")
        cases = await Case.findById(new mongoose.Types.ObjectId(caseId))
    else
        cases = await Case.find(
            {
                "case_member_list.case_member_id": userId,
                "case_member_list.case_member_type": type,
                "_id": new mongoose.Types.ObjectId(caseId)
            }
        )

    if (!cases || cases.length === 0)
        throw new DataNotExistError("Case not exist")
}

const updateDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)

    const {
        q: { q_id, q_caseId },
        doc_link,
        doc_type,
        filesize,
        uploaded_at,
        last_accessed_at,
        doc_title,
        uploaded_by,
        can_be_access_by,
        doc_case_related,
        doc_description
    } = req.body

    const filter = {
        "doc_case_related": q_caseId,
        "uploaded_by": userId,
        "_id": new mongoose.Types.ObjectId(q_id)
    }

    const update = {
        doc_type,
        doc_title,
        can_be_access_by,
        doc_description
    }

    try {
        await checkCaseAccess(userId, type, doc_case_related)

        const selectedDocument = type !== "admin" ? await Document.findOneAndUpdate(
            filter, update
        ) : await Document.findByIdAndUpdate(filter._id,
            update
        )


        if (!selectedDocument) {
            throw new DataNotExistError("Document not exist")
        }

        return res.status(200).send(selectedDocument)
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

const readDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id, caseId } = req.params
    try {
        // check curent user is in case?
        await checkCaseAccess(userId, type, caseId)

        // findandupdate
        const requestedDocument = await Document.findByIdAndUpdate(new mongoose.Types.ObjectId(id),
            {
                "$push":
                {
                    "last_accessed_at": {
                        "userId": userId,
                        "type": type,
                        "action": "view"
                    }
                }
            }, { new: true }
        )
        if (!requestedDocument)
            throw new DataNotExistError("Document not exist")

        // update the doc

        return res.status(200).send(requestedDocument)
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

const listDoc = async (req, res) => {
    try {
        const allDocument = await Document.find({})

        if (!allDocument)
            throw new DataNotExistError("Document not exist")

        return res.status(200).send(allDocument)
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

const listDocByCase = async (req, res) => {
    const { caseId } = req.params
    const { userId, type } = getUserInfo(res)
    try {
        const filter = type !== "admin" ? {
            "doc_case_related": caseId,
            "can_be_access_by": userId
        } : { "doc_case_related": caseId, }

        const caseDocuments = await Document.find(filter)
        if (!caseDocuments)
            throw new DataNotExistError("Document not exist")
        await checkCaseAccess(userId, type, caseId)

        return res.status(200).send(caseDocuments)
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

const createDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)

    const authClient = await googleDrive.authorize()
    const uploadedDoc = await googleDrive.uploadFile(authClient, req.file)
    await unlinkAsync(req.file.path)

    const {
        doc_type,
        filesize,
        uploaded_at,
        doc_title,
        uploaded_by,
        can_be_access_by,
        doc_case_related,
        doc_description
    } = req.body

    const doc_link_file = "http://docs.google.com/uc?export=open&id=" + uploadedDoc.data.id
    const doc_link_fileId = uploadedDoc.data.id
    const doc_link_onlineDrive = "https://drive.google.com/file/d/" + uploadedDoc.data.id + "/view?usp=sharing"

    try {
        await checkCaseAccess(userId, type, doc_case_related)

        const new_document = new Document({
            doc_link_file,
            doc_link_fileId,
            doc_link_onlineDrive,
            doc_type,
            filesize,
            uploaded_at: Date.parse(uploaded_at),
            doc_title,
            uploaded_by,
            can_be_access_by,
            doc_case_related,
            doc_description
        });

        const document = await new_document.save();
        if (!document) {
            return res.json({
                error: 'No document uploaded'
            })
        }

        return res.status(200).send(new_document)
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

const deleteDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id, caseId } = req.params

    const filter = type === "admin" ? {
        "_id": new mongoose.Types.ObjectId(id)
    } : {
        "doc_case_related": q_caseId,
        "uploaded_by": userId,
        "_id": new mongoose.Types.ObjectId(id)
    }

    try {
        await checkCaseAccess(userId, type, caseId)

        const deletedDocument = await Document.findOneAndDelete(filter)

        if (!deletedDocument)
            throw new DataNotExistError("Document not exist")

        // TODO: delete file from googledrive
        const authClient = await googleDrive.authorize()
        const deletedDoc = await googleDrive.deleteFile(authClient, deletedDocument.doc_link_fileId)

        return res.status(200).send(deletedDocument)
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
    createDoc, readDoc, listDoc, updateDoc, deleteDoc, listDocByCase
};
