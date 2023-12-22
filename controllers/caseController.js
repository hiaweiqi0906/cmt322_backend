const Case = require('../models/case');
const mongoose = require('mongoose');

const updateCase = (req, res) => {
    returnRes(res, 200, "updateCase")
}
const readCase = (req, res) => {
    res.status(200).send({
        message: "readCase"
    })
}

const listCase = async (req, res) => {
    try {
        const new_cases = new Case({
            case_member_list, case_title
        });

        console.log(new_cases);

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

const createCase = async (req, res) => {
    // const {_id} = getUserInfo(res)
    const {
        case_member_list,
        case_title
    } = req.body

    console.log(case_member_list);



    // check user is member of a cases or not
    // const current_cases = await Case.find({ cases_member_list: /john/i }, 'name friends').exec();

    // if no, return error

    // else continue

    // TODO: upload doc to cloudinary

    try {
        const new_cases = new Case({
            case_member_list, case_title
        });

        console.log(new_cases);

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
    createCase, readCase, listCase, updateCase, deleteCase
};
