const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropCollection } = require('./db');

describe('project api', () => {
    before(() => dropCollection('projects'));
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('comments'));
    beforeEach(() => dropCollection('moments'));

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

    let comment1 = {
        projectId: Types.ObjectId(),
        userId: userData._id,
        comment: 'Nice work',
        name: 'cj'
    };

    let moment1 = {
        projectId: Types.ObjectId(),
        category: 'after',
        caption: 'Master Bath',
        comments: [Types.ObjectId()],
    };

    let moment2 = {
        projectId: Types.ObjectId(),
        category: 'before',
        caption: 'Pool',
        comments: [Types.ObjectId()],
    };

    before(() => {
        return request
            .post('/api/auth/signup')
            .send(userData)
            .then(({ body }) => {
                userData = body;
                comment1.userId = body._id;
            });
    });

    before(() => {
        return request
            .post('/api/comments')
            .send(comment1)
            .then(({ body }) => comment1 = body);
    });

    before(() => {
        return request
            .post('/api/moments')
            .set('Authorization', userData.token)
            .send(moment1)
            .then(({ body }) => {
                moment1 = body;
            });
    });

    before(() => {
        return request
            .post('/api/moments')
            .set('Authorization', userData.token)
            .send(moment2)
            .then(({ body }) => {
                moment2 = body;
            });
    });

    it('saves and gets project', () => {
        project1.owner = userData._id;
        return request.post('/api/projects')
            .set('Authorization', userData.token)
            .send(project1)
            .then(({ body }) => {
                const { _id } = body;
                assert.ok(_id);
                assert.ok(body.coverPhotoUrl);
                assert.equal(project1.owner, userData._id);
                assert.equal(body.projectName, 'Roof');
                project1 = body;
            });
    });

    it('gets project by id', () => {
        return request.get(`/api/projects/${project1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, project1);
            });
    });

    it('gets all projects', () => {
        project2.owner = userData._id;
        return request.post('/api/projects')
            .set('Authorization', userData.token)
            .send(project2)
            .set('Authorization', userData.token)
            .then(() => {
                return request.get('/api/projects')
                    .then(({ body }) => {
                        assert.equal(body[0].projectName, 'Roof');
                        assert.equal(body[1].projectName, 'Floor');
                    });
            });
    });


    it('gets individual project with all moments', () => {
        project1.owner = userData._id;
        moment1.projectId = project1._id;
        return request.post('/api/moments')
            .set('Authorization', userData.token)
            .send(moment1)
            .then(() => {
                return request.get(`/api/projects/${project1._id}/moments`)
                    .then(({ body }) => {
                        assert.equal(body[0].caption, 'Master Bath');
                    }); 
            });
    });

    it('gets individual project with all comments', () => {
        comment1.projectId = project1._id;
        return request.post('/api/comments')
            .send(comment1)
            .then(() => {
                return request.get(`/api/projects/${project1._id}/comments`)
                    .then(({ body }) => {
                        assert.equal(body[0].comment, 'Nice work');
                    });
            });
    });
});