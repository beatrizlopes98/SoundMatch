const { handleError } = require("./error");
const { validateJSWToken, validateToken } = require("../Services/utilities");

const isAuthenticated = async (req, res, next) => {
  const googleToken = req.headers["google-authorization"];
  const jwtToken = req.headers["jwt-authorization"];

    console.log("Headers:", req.headers); // Log headers for debugging

  if (!googleToken && !jwtToken) {
    return handleError(res, 401, "Unauthorized: Token is missing");
  }

  if (googleToken) {
    // Validate the Google API token
    try {
      const payload = await validateToken(googleToken);
      // If the Google API token is valid, proceed to the next middleware or route
      console.log("Authenticated via Google API");
      req.user = payload; // You can attach user information to the request if needed
      next();
    } catch (error) {
      return handleError(res, 401, `Unauthorized: ${error}`);
    }
  } else {
    // Validate the JWT token
    try {
      const isValid = await validateJSWToken(jwtToken);
      if (!isValid) {
        return handleError(res, 401, "Unauthorized: Invalid JWT token");
      }
      console.log("Authenticated via JWT token");
      // If the JWT token is valid, proceed to the next middleware or route
      next();
    } catch (error) {
      return handleError(res, 401, `Unauthorized: ${error.message}`);
    }
  }
};

module.exports = {
  isAuthenticated,
};

// const isAuthenticated = (req, res, next) => {
//   const googleToken = req.headers.authorization;
//   const jwtToken = req.headers["x-access-token"];

//   if (!googleToken && !jwtToken) {
//     return handleError(res, 401, "Unauthorized: Token is missing");
//   }

//   if (googleToken) {
//     // Validate the Google API token
//     validateToken(googleToken, (error, payload) => {
//       if (error) {
//         return handleError(res, 401, `Unauthorized: ${error}`);
//       }

//       // If the Google API token is valid, proceed to the next middleware or route
//       console.log("Authenticated via Google API");
//       next();
//     });
//   } else {
//     // Validate the JWT token
//     validateJSWToken(jwtToken, (isValid) => {
//       if (!isValid) {
//         return handleError(res, 401, "Unauthorized: Invalid JWT token");
//       }

//       // If the JWT token is valid, proceed to the next middleware or route
//       console.log("Authenticated via JWT token");
//       next();
//     });
//   }
// };

// module.exports = {
//   isAuthenticated,
// };

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return handleError(res, 401, "Unauthorized: Token is missing");
//     }

//     // Validate JWT Token
//     const decodedToken = await validateJSWToken(token);

//     // If you want to validate Google OAuth token as well, uncomment the following line
//     // const googleTokenPayload = await validateToken(token);

//     // Your additional logic for authorization goes here

//     console.log("Authenticated");
//     next();
//   } catch (error) {
//     console.error("Error during authentication:", error);
//     return handleError(res, 401, "Unauthorized: Invalid token");
//   }
// };
