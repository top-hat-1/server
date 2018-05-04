const router = require('express').Router();
const Moment = require('../models/Moment');
const Project = require('../models/Project');
const { updateOptions } = require('../util/mongoose-helpers');
// const createEnsureAuth = require('../util/ensure-auth');

// const ensureAuth = createEnsureAuth();

module.exports = router
    .post('/', /*ensureAuth,*/ (req, res, next) => {
        Moment.create(req.body)
            .then(moment => res.json(moment))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Moment.find(req.query)
            .lean()
            .then(moments => res.json(moments))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Moment.findById(id)
            .lean()
            .select('category owner caption photoUrl')
            .then(moment => res.json(moment))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Moment.findByIdAndRemove(id)
            .then(removed => res.json({ removed }))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        const momentOwner = req.body.owner;
        Project.findById(req.body.projectId)
            .lean()
            .populate('owner')
            .then(project => {
                let owner = JSON.stringify(project.owner._id);
                if(owner.slice(1, -1) !== momentOwner){
                    throw {
                        status: 403,
                        error: 'User does not have access to update this moment'
                    };
                } else {
                    Moment.findByIdAndUpdate(req.params.id, req.body, updateOptions)
                        .then(moment => res.json(moment))
                        .catch(next);
                }
            })
            .catch(next);
    });