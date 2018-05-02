const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');


describe.only('projects load', () => {

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

    let user3 = {
        name: 'Shawn',
        email: 'shawn@me.com',
        password: '234'
    };

    let project3 = {
        projectName: 'paint',
        coverPhotoUrl: 'www.paint.com',
        owner: Types.ObjectId(),
        comments: []
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user3)
            .then(({ body }) => {
                project3.owner = body._id;
                user3 = body;
            });
    });

    before(() => {
        return request.post('/api/projects')
            .send(project3)
            .then(({ body }) => {
                project3 = body;
            });
    });

    before(() => {
        return request.post(`/api/users/${user2._id}/following`)
            .send(user1)
            .then(() => {
                request.get(`/api/users/${user2._id}`)
                    .then(({ body }) => {
                        assert.equal(body.following.length, 2);
                    });
            });
    });

    before(() => {
        return request.post(`/api/users/${user2._id}/following`)
            .send(user3)
            .then(() => {
                request.get(`/api/users/${user2._id}`)
                    .then(({ body }) => {
                        assert.equal(body.following.length, 2);
                    });
            });
    });

    it('gets all projects of users you are following', function() {
        this.timeout(3000);
        return request.get(`/api/users/${user2._id}/following`)
            .then(({ body }) => {
                assert.equal(body[0].length, 2);
                assert.equal(body[1].length, 1);
            });
    });
});