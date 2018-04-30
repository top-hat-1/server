const router = require('express').Router();
const Comment = require('../models/Comment');

module.exports = router
    .post('/', (req, res, next) => {
        Comment.create(req.body)
            .then(comment => res.json(comment))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Comment.find(req.query)
            .lean()
            .then(comments => res.json(comments))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Comment.findById(id)
            .then(comment => res.json(comment))
            .catch(next);
    })
    
    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Comment.findByIdAndRemove(id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });