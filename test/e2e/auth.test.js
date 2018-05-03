const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth api', () => {
    beforeEach(() => dropCollection('users'));

    let userData = {
        name: 'Bobby',
        email: 'Bobby@me.com',
        password: 'abc'
    };

    let token;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(userData)
            .then(({ body }) => {
                token = body.token;
                userData.token = body.token;
                userData.email = body.email;
                userData.name = body.name;
                userData._id = body._id;
            });
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('verifies', () => {
        return request
            .get('/api/auth/verify')
            .send(token)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
    });

    it('signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'Bobby@me.com',
                password: 'abc'
            })
            .then(({ body }) => {
                assert.ok(body.token);
                assert.equal(body.name, 'Bobby');
                assert.equal(body._id, userData._id);
                assert.equal(body.email, userData.email);
            });
    });
});