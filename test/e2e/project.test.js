const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropCollection } = require('./db');
const Comment = require('../../lib/models/Comment');

describe.only('project api', () => {
    before(() => dropCollection('projects'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('comments'));


    let project1 = {
        projectName: 'Roof',
        coverPhotoUrl: 'www.yahoo.com',
        owner: Types.ObjectId(),
        comments: []
    };

    let project2 = {
        projectName: 'Floor',
        coverPhotoUrl: 'www.yahoo2.com',
        owner: Types.ObjectId(),
        comments: []
    };

    let userData = {
        name: 'Bill',
        email: 'Bill@me.com',
        password: 'abc'
    };

    let comment = {
        userId: userData._id,
        comment: 'Nice work'
    };

    before(() => {
        return request
            .post('/api/auth/signup')
            .send(userData)
            .then(({ body }) => {
                userData = body;
                comment.userId = body._id;
            });
    });

    before(() => {
        return request
            .post('/api/comments')
            .send(comment)
            .then(({ body }) => comment = body);
    });

    it('saves and gets project', () => {
        project1.owner = userData._id;
        project1.comments.push(comment._id);
        return request.post('/api/projects')
            .set('Authorization', userData.token)
            .send(project1)
            .then(({ body }) => {
                const { _id } = body;
                assert.ok(_id);
                assert.ok(body.coverPhotoUrl);
                assert.equal(project1.owner, userData._id);
                assert.equal(body.comments[0], comment._id);
                assert.equal(body.projectName, 'Roof');
                project1 = body;
            });
    });

    it('gets all projects', () => {
        project2.owner = userData._id;
        return request.post('/api/projects')
            .send(project2)
            .set('Authorization', userData.token)
            .then(() => {
                return request.get('/api/projects')
                    .then(({ body }) => {
                        assert.deepEqual(body[0].projectName, 'Roof');
                        assert.deepEqual(body[1].projectName, 'Floor');
                    });
            });


    });

    it('gets project by id', () => {
        return request.get(`/api/projects/${project1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, project1);
            });
    });
});