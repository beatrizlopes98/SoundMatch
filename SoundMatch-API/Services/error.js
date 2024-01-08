const handleError = (res, statusCode, message) => {
  console.error(`Error ${statusCode}: ${message}`);
  return res.status(statusCode).send({ code: statusCode, message: message });
};

module.exports = {
  handleError,
};
