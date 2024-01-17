const Case = require('../models/case');
const Message = require('../models/message');
const mongoose = require('mongoose');
const getUserInfo = require('../helpers/getUserInfo');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError } = require('../helpers/exceptions');

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

const updateCase = (req, res) => {
    returnRes(res, 200, "updateCase")
}
const readCase = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const caseId = req.params.id

    try {
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
        return res.status(200).send(cases)

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

const readCaseMessage = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const caseId = req.params.id

    try {
        await checkCaseAccess(userId, type, caseId)
        const caseMessages = await Message.findOne({"message_case_id": caseId})
        if (!caseMessages)
            throw new DataNotExistError("Case not exist")

        return res.status(200).send(caseMessages)
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

const listCase = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    try {
        let cases;
        if (type === "admin")
            cases = await Case.find({})
        else
            cases = await Case.find(
                {
                    "case_member_list.case_member_id": userId,
                    "case_member_list.case_member_type": type
                }
            )

        if (!cases || cases.length === 0)
            throw new DataNotExistError("Case not exist")
        return res.status(200).send(cases)
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

const createCase = async (req, res) => {
    // const {_id} = getUserInfo(res)
    const {
        case_member_list,
        case_title
    } = req.body

    // check user is member of a cases or not
    // const current_cases = await Case.find({ cases_member_list: /john/i }, 'name friends').exec();

    // if no, return error

    // else continue

    try {
        const new_cases = new Case({
            case_member_list, case_title
        });

        const cases = await new_cases.save();
        if (!cases) {
            return res.json({
                error: 'No cases uploaded'
            })
        }

        return res.status(200).send(new_cases)
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

const deleteCase = (req, res) => {
    res.status(200).send({
        message: "deleteCase"
    })
}

module.exports = {
    createCase, readCase, listCase, updateCase, deleteCase, readCaseMessage
};
