exports.handleError = function (res, statusCode, message) {
  if (!res || !res.status || !res.send) {
    console.error(`Error: ${message}`);
    return;
  }

  return res.status(statusCode).send({ code: statusCode, message: message });
};
