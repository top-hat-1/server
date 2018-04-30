const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('moment api', () => {
    
    before(() => dropCollection('moments'));

    let moment1 = {
        projectId: Types.ObjectId(),
        category: 'after',
        caption: 'Kitchen',
        comments: [Types.ObjectId()],
    };

    let user1 = {
        name: 'Jim',
        email: 'Jim@me.com',
        password: 'abc'
    };

    before(() => {
        return request
            .post('/api/auth/signup')
            .send(user1)
            .then(({ body }) => user1 = body);
    });

    it('saves and gets a moment', () => {
        return request.post('/api/moments')
            .send(moment1)
            .then(({ body }) => {
                const { _id, category, caption } = body;
                moment1._id = _id;
                assert.ok(_id);
                assert.ok(body.projectId);
                assert.equal(category, 'after');
                assert.equal(caption, 'Kitchen');
                moment1 = body;
            });
    });
});