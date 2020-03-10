const express = require('express');
const { resolve } = require('path');
const { establishDbConnection } = require('./config');
const unroutableErrorHandler = require('./controllers/errorHandlers/unroutableErrorHandler');
const errorHandler = require('./controllers/errorHandlers/globalErrorHandler');
const cookieParser = require('cookie-parser');
const courseRouterApi = require('./routes/api/courses');
const accountRouterApi = require('./routes/api/accounts');
const courseRouterSite = require('./routes/site');

// initalize app
const app = express();
app.set('view engine', 'pug');
app.set('views', resolve(__dirname, 'views'));

// connect to mongoDB
establishDbConnection();

// setup middleware
app.use(express.static(resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// setup routers
app.use(courseRouterSite);
app.use('/api/v1/courses', courseRouterApi);
app.use('/api/v1/accounts', accountRouterApi);

app.options('/op', (req, res) => {
  console.log(req.headers);
  res.send('yes');
});

// error handling middleware
app.use(unroutableErrorHandler);
app.use(errorHandler);

app.listen(80);
