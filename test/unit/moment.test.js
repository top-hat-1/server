const { assert } = require('chai');
const Moment = require('../../lib/models/Moment');
const { Types } = require('mongoose');

describe.skip('moment model', () => {
    let moment1 = {
        projectId: Types.ObjectId(),
        category: 'before',
        caption: 'Cool garage',
        comments: [Types.ObjectId()],
    };
    it('moment is a valid model', () => {

        const moment = new Moment(moment1);
        moment1._id = moment._id;
        assert.deepEqual(moment.toJSON(), moment1);
    });

    it('projectId and category is required', () => {
        const moment = new Moment({});
        const { errors } = moment.validateSync();
        assert.equal(errors.projectId.kind, 'required');
        assert.equal(errors.category.kind, 'required');
    });

    it('category has to be enum', () => {
        moment1.category = 'finished';
        const moment = new Moment(moment1);
        const { errors } = moment.validateSync();
        assert.equal(errors.category.kind, 'enum');
    });
});