const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Comment', schema);