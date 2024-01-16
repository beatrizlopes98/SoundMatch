const { handleError } = require("./error");
const { validateJSWToken, validateSpotifyToken } = require("../Services/token");

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

const isConnected = async (req, res, next) => {
  const spotifyToken = req.headers["x-spotify-token"];
  try {
    if (!spotifyToken) {
      return handleError(res, 401, "Unauthorized: Spotify token is missing");
    }

    const spotifyPayload = await validateSpotifyToken(spotifyToken);

    if (!spotifyPayload) {
      return handleError(res, 401, "Unauthorized: Invalid Spotify token");
    }

    console.log("Authenticated via Spotify token");
    req.spotifyPayload = spotifyPayload;
    next();
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
  isConnected,
  isAdmin,
};
