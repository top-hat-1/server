const { assert } = require('chai');
const Project = require('../../lib/models/Project');
const { Types } = require('mongoose');

describe('project model', () => {
    it('project is a valid model', () => {
        const project1 = {
            projectName: 'Firepit',
            dateAdded: new Date(),
            coverPhotoId: Types.ObjectId(),
            comments: [Types.ObjectId()],
            completed: true
        };

        const project = new Project(project1);
        project1._id = project._id;
        assert.deepEqual(project.toJSON(), project1);
    });
});