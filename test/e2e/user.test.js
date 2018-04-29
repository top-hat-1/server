const { assert } = require('chai');
const { Types } = require('mongoose');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('user api', () => {
    
    before(() => dropCollection('users'));

    let userData = {
        name: 'Joe',
        email: 'Joe@me.com',
        hobbies: ['woodworking'],
        photo: 'www.google.com',
        following: []

    };
    
    let newUser = {
        name: 'Billy',
        email: 'bill@me.com',
        password: 'abc'
    };

    before(() => {
        return request  
            .post('/api/auth/signup')
            .send(newUser)
            .then(({ body }) => newUser = body);
    });
    
    it('saves and gets a user', () => {
        return request.post('/api/users')
            .send(userData)
            .then(({ body }) => {
                const { _id, email, name, hobbies, photo } = body;
                userData._id = _id;
                assert.ok(_id);
                assert.equal(email, 'Joe@me.com');
                assert.equal(name, 'Joe');
                assert.deepEqual(hobbies, ['woodworking']);
                assert.equal(photo, 'www.google.com');
            });
    });

    it('updates user', () => {
        newUser.name = 'Bill';
        return request.put(`/api/users/${newUser._id}`)
            .send(newUser)
            .then(({ body }) => {
                assert.equal(body.name, 'Bill');
            });
    });

    

    it.skip('puts a user id into following array of user', () => {
        return request.post(`/api/users/${userData._id}/following`)
            .send(userData._id)
            .then(({ body }) => {
                assert.equal(body, [userData._id]);
            });
    });
});