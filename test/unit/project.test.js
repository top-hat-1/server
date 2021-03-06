const { assert } = require('chai');
const Project = require('../../lib/models/Project');

describe('project model', () => {
    it('project is a valid model', () => {
        const project1 = {
            projectName: 'Fire-pit',
            dateAdded: new Date(),
            coverPhotoUrl: 'www.google.com',
            completed: true
        };

        const project = new Project(project1);
        project1._id = project._id;
        assert.deepEqual(project.toJSON(), project1);
    });

    it('projectName/coverPhotoId are required and completed comes back false', () => {
        const project = new Project({});
        const { errors } = project.validateSync();
        assert.equal(errors.projectName.kind, 'required');
        assert.equal(errors.coverPhotoUrl.kind, 'required');
        assert.equal(project.completed, false);

    });
});