const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    comment: {
        type: String,
        required: true
    },

    target: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },

    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', schema);