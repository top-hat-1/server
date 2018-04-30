const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');

describe('moment api', () => {
    
    before(() => dropCollection('moments'));

    let moment1 = {
        projectId: Types.ObjectId(),
        category: 'after',
        caption: 'Kitchen',
        comments: [Types.ObjectId()],
    };

    let moment2 = {
        projectId: Types.ObjectId(),
        category: 'before',
        caption: 'Bedroom',
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

    it('gets all moments', () => {
        moment2.owner = user1._id;
        return request.post('/api/moments')
            .send(moment2)
            .then(() => {
                return request.get('/api/moments')
                    .then(({ body }) => {
                        assert.deepEqual(body[0].caption, 'Kitchen');
                        assert.deepEqual(body[1].caption, 'Bedroom');
                    });
            });
    });

    it('gets a moment by id', () => {
        return request.get(`/api/moments/${moment1._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, moment1);
            });
    });
});