const router = require('express').Router();
const User = require('../models/User');
const createEnsureAuth = require('../util/ensure-auth');
const { updateOptions } = require('../util/mongoose-helpers');
const Projects = require('../models/Project');

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

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        User.findById(id)
            .populate('following', 'name')
            .lean()
            .then(user => res.json(user))
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

    .get('/:id/projects', (req, res, next) => {
        const { id } = req.params;

        Promise.all([
            User.findById(id)
                .lean(),

            Projects.find({ owner: id })
                .lean()
        ])
            .then(([user, projects]) => {
                user.projects = projects;
                res.json(user);
            })
            .catch(next);
    })
    
    .post('/:id/following', (req, res, next) => {
        const { id } = req.params;
        const followingId = req.body._id;
        User.findByIdAndUpdate(id, {
            $push: { following: followingId } 
        }, {
            new: true,
            runValidators: true
        })
            .then(user => {
                res.json(user.following[user.following.length - 1 ]);
            })
            .catch(next);
    });