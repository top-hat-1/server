const express = require('express');
const app = express();
require('./models/register-plugins');


const auth = require('./routes/auth');
const projects = require('./routes/projects');
const users = require('./routes/users');

app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/users', users);
module.exports = app;