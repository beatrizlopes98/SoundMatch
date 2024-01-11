var jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { handleError } = require("./error");

const secret = process.env.SECRET;

const googleConfig = {
  clientId:"313000397225-o06na9kdk28vnl7u019p163lpcsdqf50.apps.googleusercontent.com",
  clientSecret: "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",
  //redirect: "http://localhost:3000/login"
  redirect: "https://soundmatch-api.onrender.com/login",
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
  return callback(token);
};

exports.validateJSWToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject("Token is missing");
    }

    jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
      if (error) {
        reject(error);
      } else {
        console.log(decoded)
        resolve(decoded);
      }
    });
  });
};

const createConnection = () =>
  new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
//Enviar para front-end
const getConnectionUrl = (auth) =>
  auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope,
  });

const urlGoogle = () => {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
};

const getTokens = (code, req, res, callback) => {
  const auth = createConnection();
  auth.getToken(code, (error, tokens) => {
    if (error) {
      return handleError(res, 500, `Error getting tokens: ${error.message}`);
    }

    if (!tokens) {
      return handleError(res, 500, "Error getting tokens: No tokens found");
    }
    return callback(false, tokens);
  });
};

const getUserInfo = (access_token, callback) => {
  let client = new google.auth.OAuth2(googleConfig.clientId);
  client.setCredentials({ access_token: access_token });
  var oauth2 = google.oauth2({
    auth: client,
    version: "v2",
  });
  oauth2.userinfo.get(function (error, result) {
    if (error) {
      return callback(true, error);
    } else {
      return callback(false, result.data);
    }
  });
};

const validateToken = (token, callback) => {
  let client = new google.auth.OAuth2(googleConfig.clientId);
  return new Promise(async (resolve, reject) => {
    try {
      async function verify() {
        let ticket = await client.verifyIdToken({
          idToken: token,
          audience: googleConfig.clientId,
        });

        let payload = ticket.getPayload();
        return callback(false, payload);
      }
      verify().catch((error) => {
        return callback(true, error);
      });
    } catch (error) {
      reject(`Error validating token: ${error.message}`);
    }
  });
};

exports.createConnection = createConnection;
exports.generateAuthUrl = getConnectionUrl;
exports.urlGoogle = urlGoogle;
exports.getTokens = getTokens;
exports.getUserInfo = getUserInfo;
exports.validateToken = validateToken;
