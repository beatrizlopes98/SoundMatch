var jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const fetch = require('node-fetch');
const { handleError } = require("./error");

const secret = process.env.SECRET;

const googleConfig = {
  clientId:"313000397225-o06na9kdk28vnl7u019p163lpcsdqf50.apps.googleusercontent.com",
  clientSecret: "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",
  redirect: "https://soundmatch-api.onrender.com/login",
  //redirect: "http://localhost:3000/login"
};

const spotifyConfig = {
  client_id:"32bbc37fbca044c39ce1a7a22b2d8658",
  client_secret: "bb679316c1f44cbe95c73491810a8e72",
  //redirect: "https://soundmatch-api.onrender.com/handleSpotify"
  redirect: "http://localhost:3000/handleSpotify"
};

const generateSpotifyAuthUrl = () => {
  const scope = 'user-read-private user-read-email'; // Add any additional scopes as needed
  const state = 'some-state'; // A unique value to prevent CSRF attacks
  const redirectUri = encodeURIComponent(spotifyConfig.redirect_uri);
  const clientId = encodeURIComponent(spotifyConfig.client_id);

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${redirectUri}&state=${state}`;

  return spotifyAuthUrl;
};

exports.generateSpotifyAuthUrl = generateSpotifyAuthUrl;


const defaultScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];


//JSON WEB TOKEN generation and validation
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
    console.log("--------------------------------")
    console.log(token)
    if (!token) {
      reject("Token is missing");
    }

    jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
      if (error) {
        reject(error);
      } else {
        console.log("--------------------------------")
        console.log(decoded)
        console.log("--------------------------------")
        resolve(decoded);
      }
    });
  });
};


//GOOGLE OAUTH 2.0 generation and validation
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


//Spotify OAUTH 2.0 generation and validation
const generateSpotifyAccessToken = async (code, callback) => {
  const base64Credentials = Buffer.from(`${spotifyConfig.client_id}:${spotifyConfig.client_secret}`).toString('base64');

  const params = new URLSearchParams();
  params.append('code', code);
  params.append('redirect_uri', spotifyConfig.redirect_uri);
  params.append('grant_type', 'authorization_code');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`,
      },
      body: params,
    });

    const data = await response.json();
    console.log(response.json)
    callback(false, data);
  } catch (error) {
    callback(true, error.message);
  }
};

exports.generateSpotifyAccessToken = generateSpotifyAccessToken;


exports.createConnection = createConnection;
exports.generateAuthUrl = getConnectionUrl;
exports.urlGoogle = urlGoogle;
exports.getTokens = getTokens;
exports.getUserInfo = getUserInfo;
exports.validateToken = validateToken;
