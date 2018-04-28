const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: String,
    hobbies: [String],
    photo: String,
    following: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('User', schema);