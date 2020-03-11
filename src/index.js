const express = require('express');
const {
  resolve
} = require('path');
const {
  establishDbConnection
} = require('./config');
const unroutableErrorHandler = require('./controllers/errorHandlers/unroutableErrorHandler');
const errorHandler = require('./controllers/errorHandlers/globalErrorHandler');
const cookieParser = require('cookie-parser');
const courseRouterApi = require('./routes/api/courses');
const accountRouterApi = require('./routes/api/accounts');
const courseRouterSite = require('./routes/site');
require('dotenv').config();

// initalize app
const app = express();
app.set('view engine', 'pug');
app.set('views', resolve(__dirname, 'views'));

// connect to mongoDB
establishDbConnection();

// setup middleware
app.use(express.static(resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

// routers
app.use(courseRouterSite);
app.use('/api/v1/courses', courseRouterApi);
app.use('/api/v1/accounts', accountRouterApi);

// test
const upload = require('./controllers/utils/fileUploader');

app.post('/upload', upload().single('fichier'), (req, res) => {
  console.clear();
  console.log(req.file);
  res.send('ok')
})

// error handling middleware
app.use(unroutableErrorHandler);
app.use(errorHandler);

// listen on port default http port 80
app.listen(80);



