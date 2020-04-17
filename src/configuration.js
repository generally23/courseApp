const { connect } = require('mongoose');
const { resolve } = require('path');
const { static, json, urlencoded } = require('express');
const cookieParser = require('cookie-parser');

const establishDbConnection = async () => {
  const DB_URI = process.env.DB_URI || 'mongodb://localhost/course_db';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  try {
    await connect(DB_URI, options);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const setUpMiddleware = app => {
  app.use(static(resolve(__dirname, 'public')));
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());

  // enable cors
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
};

const setupExpressConfigurtion = app => {
  app.set('view engine', 'pug');
  app.set('views', resolve(__dirname, 'views'));
};

module.exports = {
  establishDbConnection,
  setUpMiddleware,
  setupExpressConfigurtion,
};
