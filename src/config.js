const { connect } = require('mongoose');

exports.establishDbConnection = async () => {
  const DB_URI = process.env.DB_URI || 'mongodb://localhost/course_db';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    await connect(DB_URI, options);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
