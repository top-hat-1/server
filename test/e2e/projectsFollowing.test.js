const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');


describe('projects load', () => {

    before(() => dropCollection('users'));
    before(() =>  dropCollection('projects'));

    let user1 = {
        name: 'Joe',
        email: 'joe@me.com',
        password: 'abc'
    };

    let project1 = {
        projectName: 'floor',
        coverPhotoUrl: 'www.google.com',
        owner: Types.ObjectId(),
        comments: []
    };

    let project2 = {
        projectName: 'deck',
        coverPhotoUrl: 'www.yahoo.com',
        owner: Types.ObjectId(),
        comments: []
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user1)
            .then(({ body }) => {
                user1 = body;
                project1.owner = body._id;
                project2.owner = body._id;
            });
    });

    before(() => {
        return request.post('/api/projects')
            .send(project1)
            .then(({ body }) => {
                project1 = body;
            });
    });

    before(() => {
        return request.post('/api/projects')
            .send(project2)
            .then(({ body }) => {
                project2 = body;
            });
    });
    
    let user2 = {
        name: 'Mary',
        email: 'mary@me.com',
        password: '123'
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user2)
            .then(({ body }) => {
                user2 = body;
            });
    });

    before(() => {
        return request.post(`/api/users/${user2._id}/following`)
            .send(user1)
            .then(() => {
                request.get(`/api/users/${user2._id}`)
                    .then(({ body }) => {
                        assert.equal(body.following.length, 1);
                    });
            });
    });



    it.skip('gets all projects of users you are following', () => {
        return request.get(`/api/users/${user2._id}/following`)
            .then(({ body }) => {
                assert.equal(body.length, 2);
            });
    });
});