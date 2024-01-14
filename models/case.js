const mongoose = require('mongoose');
const { Schema } = mongoose

const validateArrayLength = (value) => {
    if (!Array.isArray(value) || value.length == 0) {
        return false;
    }
    return true
}
// Schema
const caseSchema = new Schema({
    case_member_list: {
        type: [
            {
                case_member_id: {
                    type: String,
                    required: true,
                },
                case_member_type: {
                    type: String,
                    required: true,
                },
                case_member_role: {
                    type: String,
                    required: true,
                },
            }],
        validate: {
            validator: validateArrayLength,
            message: "Case_member_list should not be empty array"
        }
    },
    case_title: {
        type: String,
        required: [true, "Case_title should not be null"],
    },
})

// Model
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel