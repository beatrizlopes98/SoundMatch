var jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { handleError } = require("./error");

const secret = process.env.SECRET;

const googleConfig = {
  //clientId:"829313020638-tikb0uqdo4uev1okfmji5ajbsegg3mt4.apps.googleusercontent.com",
  //clientSecret:"OFgE5UUNz-ZUE05SZqhQ4bfP",
  clientId:"313000397225-o06na9kdk28vnl7u019p163lpcsdqf50.apps.googleusercontent.com",
  clientSecret:"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",
  redirect: "http://localhost:3000/home",
};

const defaultScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

exports.generateJSWToken = (user_info, callback) => {
  let token = jwt.sign(
    {
      data: user_info,
    },
    secret,
    { expiresIn: "24h" }
  );
  console.log("JWT Token Generated:", token);
  return callback(token);
};

exports.validateJSWToken = (token, callback) => {
  if (!token) {
    console.log("JWT Token Validation Failed: Token is missing");
    return callback(false);
  }
  jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
    if (error) {
      console.log("JWT Token Validation Failed:", error);
      return callback(false);
    } else {
      console.log("JWT Token Validated Successfully:", decoded);
      return callback(true);
    }
  });
};

const createConnection = () =>
  new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );

const getConnectionUrl = (auth) =>
  auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope,
  });

const urlGoogle = () => {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  console.log("Generated Google OAuth URL:", url);
  return url;
};

const getTokens = (code, callback) => {
  const auth = createConnection();
  auth
    .getToken(code)
    .then((tokens) => {
      if (!tokens.tokens) {
        return handleError(
          callback,
          500,
          "Error getting tokens: No tokens found"
        );
      } else {
        console.log("Tokens Obtained Successfully:", tokens.tokens);
        return callback(false, tokens.tokens);
      }
    })
    .catch((error) => {
      return handleError(
        callback,
        500,
        `Error getting tokens: ${error.message}`
      );
    });
};

const getUserInfo = (access_token, callback) => {
  let client = new google.auth.OAuth2(googleConfig.clientId);
  client.setCredentials({ access_token: access_token });
  var oauth2 = google.oauth2({
    auth: client,
    version: "v2",
  });
  oauth2.userinfo.get(function (err, result) {
    if (err) {
      return handleError(
        callback,
        500,
        `Error getting user info: ${err.message}`
      );
    } else {
      console.log("User Info Obtained Successfully:", result.data);
      return callback(false, result.data);
    }
  });
};

const validateToken = (token, callback) => {
  let client = new google.auth.OAuth2(googleConfig.clientId);
  async function verify() {
    let ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleConfig.clientId,
    });

    let payload = ticket.getPayload();
    console.log("Google OAuth Token Validated Successfully:", payload);
    return callback(false, payload);
  }

  verify().catch((error) => {
    return handleError(
      callback,
      500,
      `Error validating token: ${error.message}`
    );
  });
};

exports.createConnection = createConnection;
exports.generateAuthUrl = getConnectionUrl;
exports.urlGoogle = urlGoogle;
exports.getTokens = getTokens;
exports.getUserInfo = getUserInfo;
exports.validateToken = validateToken;