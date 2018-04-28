const Comment = require('../../lib/models/Comment');
const { assert } = require('chai');
const { Types } = require('mongoose');

describe('Comment Model', () => {
    it('comment is a valid model', () => {
        const comment1 = {
            userId: Types.ObjectId(),
            comment: 'This is tight',
        };
        
        const comment = new Comment(comment1);
        comment1._id = comment._id;
        assert.deepEqual(comment.toJSON(), comment1);
    });
});