const { assert } = require('chai');
const User = require('../../lib/models/User');
const { Types } = require('mongoose');

describe('user model', () => {
    it('user is a valid model', () => {
        const user1 = {
            name: 'Bob',
            email: 'Bob@me.com',
            hobbies: [],
            following: [Types.ObjectId()]
        };

        const user = new User(user1);
        user1._id = user._id;
        assert.deepEqual(user.toJSON(), user1);
    });

});