const router = require('express').Router();
const Project = require('../models/Project');
// const createEnsureAuth = require('../util/ensure-auth');
const Comments = require('../models/Comment');
const Moments = require('../models/Moment');
const mongo = require('mongodb');

// const ensureAuth = createEnsureAuth();

module.exports = router
    .post('/', /*ensureAuth,*/ (req, res, next) => {
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

        // Promise.all([
        //     Project.findById(id)
        //         .lean(),
            
        //     Comment.find({ userId: id })
        //         .lean()
        // ]);


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
        console.log(o_id);

        Promise.all([
            Project.findById(id)
                .lean(),

            Moments.find({ projectId: o_id })
                .lean()
        ])
            .then(([project, moments]) => {
                project.moments = moments;
                console.log(project);
                res.json(project);
            })
            .catch(next);
    })

    .get('/:id/comments', (req, res, next) => {
        const { id } = req.params;
        let o_id = new mongo.ObjectId(id);
        o_id = JSON.stringify(o_id);
        o_id = o_id.slice(1, -1);
        console.log(o_id);

        Promise.all([
            Project.findById(id)
                .lean(),

            Comments.find({ projectId: o_id })
                .lean()
        ])
            .then(([project, comments]) => {
                project.comments = comments;
                console.log(project);
                res.json(project);
            })
            .catch(next);
    });

    