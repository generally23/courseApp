module.exports = (error, req, res, next) => {
  console.log(error);
  res.json(error);
};
