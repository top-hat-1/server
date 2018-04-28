const router = require('express').Router();
const Project = require('../models/Project');

module.exports = router
    .post('/', (req, res, next) => {
        Project.create(req.body)
            .then(project => res.json(project))
            .catch(next);
    });