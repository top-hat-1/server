const express = require('express');
const app = express();
require('./models/register-plugins');
const auth = require('./routes/auth');
const projects = require('./routes/projects');

app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/projects', projects);

module.exports = app;