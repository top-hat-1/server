const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropCollection } = require('./db');

describe('project api', () => {
    before(() => dropCollection('projects'));
    beforeEach(() => dropCollection('users'));


    let project1 = {
        projectName: 'Roof',
        coverPhotoId: Types.ObjectId(),
        owner: Types.ObjectId()
    };

    let userData = {
        name: 'Bill',
        email: 'Bill@me.com',
        password: 'abc'
    }

    before(() => {
        return request
            .post('/api/auth/signup')
            .send(userData)
            .then(({ body }) => userData = body);
    });

    it('saves and gets project', () => {
        project1.owner = userData._id;
        return request.post('/api/projects')
            .send(project1)
            .then(({ body }) => {
                const { _id } = body;
                assert.ok(_id);
                assert.ok(body.coverPhotoId);
                assert.equal(project1.owner, userData._id);
                assert.equal(body.projectName, 'Roof');
                project1 = body;
            });
    });
});