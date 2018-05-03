const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    coverPhotoUrl: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Project', schema);