const express = require('express');
const app = express();
require('./models/register-plugins');
const auth = require('./routes/auth');

app.use(express.json());

app.use('/api/auth', auth);

module.exports = app;