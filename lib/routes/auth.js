const router = require('express').Router();
const { respond } = require('./route-helpers');
const { sign } = require('../util/token-service');
const User = require('../models/User');
const createEnsureAuth = require('../util/ensure-auth');

const hasEmailAndPassword = ({ body }, res, next) => {
    const { email, password } = body;
    if(!email || !password) {
        throw {
            status: 400,
            error: 'Email and password are required'
        };
    }
    next();
};

module.exports = router

    .get('/verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ))

    .post('/signup', hasEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return User.exists({ email })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'Email exists'
                        };
                    }
                    const user = new User(body);
                    user.generateHash(password);
                    return user.save();
                })
                .then(user => {
                    return {
                        token: sign(user),
                        _id: user._id,
                        name: user.name,
                        email: email
                    };
                });
        }
    ))

    .post('/signin', hasEmailAndPassword, respond(
        ({ body }) => {
            const { email, password } = body;
            delete body.password;

            return User.findOne({ email })
                .then(user => {
                    if(!user || !user.comparePassword(password)){
                        throw {
                            status: 401,
                            error: 'Invalid email or password'
                        };
                    }
                    return { 
                        token: sign(user),
                        name: user.name,
                        email: user.email,
                        _id: user.id,
                        hobbies: user.hobbies,
                        photo: user.photo,
                        following: user.following
                    };
                });
        }
    ));