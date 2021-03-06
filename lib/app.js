const express = require('express');
const app = express();
const morgan = require('morgan');
require('./models/register-plugins');


const auth = require('./routes/auth');
const projects = require('./routes/projects');
const users = require('./routes/users');
const moments = require('./routes/moments');
const comments = require('./routes/comments');
const ensureAuth = require('./util/ensure-auth');

app.use(express.json());
app.use(morgan('dev'));

app.use(express.static('public'));

app.use('/api/auth', auth);
app.use('/api/projects', ensureAuth(), projects);
app.use('/api/users', users);
app.use('/api/moments', moments);
app.use('/api/comments', comments);

app.use((req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

module.exports = app;