// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); // INSTANCE of Express
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
// internally, this creates a new database in mongodb called 'auth'
mongoose.connect('mongodb://localhost:auth/auth');

// App setup
// morgan and bodyParser are Express middlewares
// morgan is a logging framework
app.use(morgan('combined'));
// bodyParser parses incoming requests, in this case into json
// regardless of request type
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server setup
const port = process.env.PORT || 3090;
// http is a native node library for working with http
// this line tells node to create a server and forward requests to the app
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port', port);
