const router = require('express').Router();
const User = require('../models/User');
const createEnsureAuth = require('../util/ensure-auth');

const ensureAuth = createEnsureAuth();

module.exports = router
    .post('/', (req, res, next) => {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(next);
    })
    
    .post('/:id/following', (req, res, next) => {
        const { id } = req.params;
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