const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },

    target: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
});

module.exports = mongoose.model('Comment', schema);