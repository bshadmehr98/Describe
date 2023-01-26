const express = require('express');
const app = express();
const page = require('./routes/page');
const user = require('./routes/user');
const section = require('./routes/section');
const errorMiddleware = require('./middleware/errors');

app.use(express.json());

// Routes
app.use('/api/v1', page);
app.use('/api/v1', user);
app.use('/api/v1', section);

// Middleware to handle
app.use(errorMiddleware);

module.exports = app;
