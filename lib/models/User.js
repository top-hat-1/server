const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

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
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

schema.methods = {
    generateHash(password){
        this.hash = bcrypt.hashSync(password, 8);
    },
    comparePassword(password){
        return bcrypt.compareSync(password, this.hash);
    }
};

module.exports = mongoose.model('User', schema);