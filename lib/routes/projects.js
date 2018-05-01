const router = require('express').Router();
const Project = require('../models/Project');
const createEnsureAuth = require('../util/ensure-auth');
const Comment = require('../models/Comment')

const ensureAuth = createEnsureAuth();

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
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .lean()
            .then(project => res.json(project))
            .catch(next);
    });