const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');
const Comment = require('../../lib/models/Comment');

describe.only('comment api', () => {

    before(() => dropCollection('comments'));

    let commentData = {
        userId: Types.ObjectId(),
        comment: 'This is a comment'
    };

    let commentData2 = {
        userId: Types.ObjectId(),
        comment: 'comment two'
    };

    it('adds and gets a comments', () => {
        return request.post('/api/comments')
            .send(commentData)
            .then(({ body }) => {
                assert.ok(body._id);
                assert.equal(body.comment, commentData.comment);
                commentData = body;
            });
    });

    it('gets comment by id', () => {
        return request.get(`/api/comments/${commentData._id}`)
            .then(({ body }) => {
                assert.equal(body.comment, commentData.comment);
            });
    });

    it('gets all comments', () => {
        return request.post('/api/comments')
            .send(commentData2)
            .then(({ body }) => {
                commentData2 = body;
            })
            .then(
                request.get('/api/comments')
                    .then(({ body }) => {
                        assert.deepEqual(body, [commentData, commentData2]);
                    })
            );
    });

    it('deletes a comment', function() {
        this.timeout(3000);
        return request.delete(`/api/comments/${commentData._id}`)
            .then(() => {
                return Comment.findById(commentData._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });

});