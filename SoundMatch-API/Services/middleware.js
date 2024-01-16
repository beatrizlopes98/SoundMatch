const { handleError } = require("./error");
const { validateJSWToken } = require("../Services/token");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return handleError(res, 401, "Unauthorized: Token is missing");
    } else {
      const payload = await validateJSWToken(token);
      if (!payload) {
        return handleError(res, 401, "Unauthorized: Invalid JWT token");
      }
      console.log("Authenticated via JWT token");
      req.user = payload.data.user;
      next();
    }
  } catch (error) {
    return handleError(res, 401, `Unauthorized: ${error.message}`);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user === "admin@mail.com") {
    console.log("User is an admin");
    next();
  } else {
    return handleError(res, 403, "Forbidden: Admin access required");
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
