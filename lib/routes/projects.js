const router = require('express').Router();
const Project = require('../models/Project');
const createEnsureAuth = require('../util/ensure-auth');
const Comments = require('../models/Comment');
const Moments = require('../models/Moment');
const mongo = require('mongodb');

const ensureAuth = createEnsureAuth();

module.exports = router
    .post('/', ensureAuth, (req, res, next) => {
        Project.create(req.body)
            .then(project => res.json(project))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Project.find(req.query)
            .lean()
            .then(projects => res.json(projects))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Project.findById(id)
            .populate({
                path: 'comments.userId',
                model: 'Comment',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .lean()
            .then(project => res.json(project))
            .catch(next);
    })

    .get('/:id/moments', (req, res, next) => {
        const { id } = req.params;
        let o_id = new mongo.ObjectId(id);
        o_id = JSON.stringify(o_id);
        o_id = o_id.slice(1, -1);
        Moments.find({ projectId: o_id })
            .then((moments) => {
                res.json(moments);
            })
            .catch(next);
    })

    .get('/:id/comments', (req, res, next) => {
        const { id } = req.params;
        let o_id = new mongo.ObjectId(id);
        o_id = JSON.stringify(o_id);
        o_id = o_id.slice(1, -1);
        Comments.find({ projectId: o_id })
            .then((comments) => {
                res.json(comments);
            })
            .catch(next);
    })

    .post('/:id/comments', (req, res, next) => {
        const { id } = req.params;
        const commentId = req.body._id;
        Project.findByIdAndUpdate(id, {
            $push: { comments : commentId }
        }, {
            new: true,
            runValidators: true    
        })
            .then(project => {
                res.json(project);
            })
            .catch(next);
    });

    