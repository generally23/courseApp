const express = require('express');
const unroutableErrorHandler = require('./controllers/errorHandlers/unroutableErrorHandler');
const errorHandler = require('./controllers/errorHandlers/globalErrorHandler');
const courseRouter = require('./routes/api/courses');
const accountRouter = require('./routes/api/accounts');
const siteRouter = require('./routes');

const {
  establishDbConnection,
  setUpMiddleware,
  setupExpressConfigurtion,
} = require('./configuration');

require('dotenv').config();

// initalize server
const server = express();
setupExpressConfigurtion(server);

// connect to mongoDB
establishDbConnection();

// setup middleware
setUpMiddleware(server);

// routers
server.use(siteRouter);
server.use('/api/v1/courses', courseRouter);
server.use('/api/v1/accounts', accountRouter);

// error handling middleware
server.use(unroutableErrorHandler);
server.use(errorHandler);

// listen on port default http port 80
server.listen(80);
