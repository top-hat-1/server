const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropCollection } = require('./db');

describe('project api', () => {
    before(() => dropCollection('projects'));

    let project1 = {
        projectName: 'Roof',
        coverPhotoId: Types.ObjectId(),
        owner: Types.ObjectId()
    };

    it('saves and gets project', () => {
        return request.post('/api/projects')
            .send(project1)
            .then(({ body }) => {
                const { _id } = body;
                assert.ok(_id);
                assert.ok(body.coverPhotoId);
                assert.equal(body.projectName, 'Roof');
                project1 = body;
            });
    });
});