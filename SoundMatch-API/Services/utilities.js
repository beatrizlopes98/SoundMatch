const { google } = require('googleapis');

const redirectUrl = 'http://localhost:3000/loginGoogle';

const googleConfig = {
    clientId: '313000397225-o06na9kdk28vnl7u019p163lpcsdqf50.apps.googleusercontent.com',
    clientSecret: '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',
    redirect: 'http://localhost:3000/loginGoogle'
};

const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.profile', 
    'https://www.googleapis.com/auth/userinfo.email'
];

const createConnection = () => {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

const getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

const urlGoogle = () => {
    const auth = createConnection(redirectUrl);
    const url = getConnectionUrl(auth);
    return url;
}

const getTokens = (code, callback) => {
    const auth = createConnection();
    auth.getToken(code, (err, tokens) => {
        if (err) {
            return callback(err);
        }

        callback(null, tokens);
    });
};


const getUserInfo = (access_token, callback) => {
    let client = new google.auth.OAuth2(googleConfig.clientId);
    client.setCredentials({access_token: access_token});
    var oauth2 = google.oauth2({
        auth: client,
        version: 'v2'
    });
    oauth2.userinfo.get(
    function(err, result) {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, result.data)
        }
    });
}

const validateToken = (token, callback) => {
    let client = new google.auth.OAuth2(googleConfig.clientId);
    async function verify() {
        let ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleConfig.clientId, 
        });
        
        let payload = ticket.getPayload();
        return callback(false,payload);
    }
        
    verify().catch(error => {
        return callback(true, error);
    });
}

exports.createConnection = createConnection; 
exports.generateAuthUrl = getConnectionUrl; 
exports.urlGoogle = urlGoogle; 
exports.getTokens = getTokens; 
exports.getUserInfo = getUserInfo; 
exports.validateToken = validateToken; 

