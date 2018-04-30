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
        // required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    completed: {
        type: Boolean,
        default: false,
    },
    description: String,
    owner: Schema.Types.ObjectId
});

module.exports = mongoose.model('Project', schema);