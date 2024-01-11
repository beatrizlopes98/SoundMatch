const { handleError } = require("./error");
const { validateJSWToken } = require("../Services/utilities");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return handleError(res, 401, "Unauthorized: Token is missing");
  } else {
    // Validate the JWT token
    try {
      const payload = await validateJSWToken(token);
      if (!payload) {
        return handleError(res, 401, "Unauthorized: Invalid JWT token");
      }
      console.log("Authenticated via JWT token");
      req.user = payload.data.user;
      next();
    } catch (error) {
      return handleError(res, 401, `Unauthorized: ${error.message}`);
    }
  }
};

module.exports = {
  isAuthenticated,
};
