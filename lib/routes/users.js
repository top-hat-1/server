const router = require('express').Router();
const User = require('../models/User');
const createEnsureAuth = require('../util/ensure-auth');
const { updateOptions } = require('../util/mongoose-helpers');

const ensureAuth = createEnsureAuth();

module.exports = router
    .post('/', (req, res, next) => {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        User.find(req.query)
            .lean()
            .then(users => res.json(users))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        if(req.params.id !== req.body._id) {
            throw {
                status: 403,
                error: 'User does not have access to update this user'
            };
        } else {
            User.findByIdAndUpdate(req.params.id, req.body, updateOptions)
                .then(user => res.json(user))
                .catch(next);
        }
    })
    
    .delete('/:id', ensureAuth, (req, res, next) => {
        const { id } = req.params;
        if(id !== req.body._id){
            throw {
                status: 403,
                error: 'User does not have access to update this user'
            };
        } else {
            User.findByIdAndRemove(id)
                .then(removed => res.json({ removed }))
                .catch(next);
        }
    })
    
    .post('/:id/following', (req, res, next) => {
        const { id } = req.params;
        console.log('this is req body ', req.body)
        User.findByIdAndUpdate(id, {
            $push: { following: req.body } 
        }, {
            new: true,
            runValidators: true
        })
            .then(user => {
                res.json(user.following[user.following.length - 1 ]);
            })
            .catch(next);
    });