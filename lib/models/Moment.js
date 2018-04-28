const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['before', 'in-progress', 'after']
    },
    caption: String,
    comments: [Schema.Types.ObjectId],
    photoUrl: String,
    dateAdded: Date,
});

module.exports = mongoose.model('Moment', schema);