const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const utilities = require("../Services/utilities");
const { handleError } = require("../Services/error");

// Normal registration and login routes
router.post("/register", function (req, res) {
  authController.register(req, res);
});

router.post("/login", function (req, res) {
  authController.login(req, res);
});

// Google login route
router.get("/google", function (req, res) {
  res.redirect(utilities.urlGoogle());
});

// Route to handle Google OAuth2.0 callback
router.get("/login", function (req, res) {
  try {
    utilities.getTokens(req.query.code, req, res, (error, tokens) => {
      if (error) {
        handleError(res, 400, error);
      } else {
        utilities.getUserInfo(tokens.access_token, (error, user_info) => {
          if (error) {
            handleError(res, 400, error);
          } else {
            utilities.validateToken(tokens.id_token, (error, validToken) => {
              if (error) {
                handleError(res, 400, error);
              } else {
                console.log(user_info)
                res.status(200).send({
                  tokens: tokens,
                  user: user_info,
                  validToken: validToken,
                });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    handleError(res, 500, `Error trying to Login: ${error}`);
  }
});

module.exports = router;
