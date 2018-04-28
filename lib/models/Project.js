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
    coverPhotoId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    comments: [Schema.Types.ObjectId],
    completed: {
        type: Boolean,
        default: false,
    },
    description: String,
    owner: Schema.Types.ObjectId
});

module.exports = mongoose.model('Project', schema);