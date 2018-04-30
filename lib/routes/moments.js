const router = require('express').Router();
const Moment = require('../models/Moment');
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
    });