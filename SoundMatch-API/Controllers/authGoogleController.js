const utilities = require('../Services/utilities')

exports.login = function (req, res) {
    utilities.getTokens(req.query.code, (error, tokens) => {
        console.log(req.query.code);
        if (error) {
            res.status(400).send(error);
        } else {
            utilities.getUserInfo(tokens.access_token, (error, user_info) => {
                if (error) {
                    res.status(400).send(error);
                } else {
                    utilities.validateToken(tokens.id_token, (error, validToken) => {
                        if (error) {
                            res.status(400).send(error);
                        } else {
                            res.status(200).send({ tokens: tokens, user: user_info, validToken: validToken });
                        }
                    });
                }
            });
        }
    });
};

exports.google = function (req, res,) {
    res.send(utilities.urlGoogle())
}