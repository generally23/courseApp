module.exports = (error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).json(error.message);
};
