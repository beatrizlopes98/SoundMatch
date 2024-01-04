const bcrypt = require("bcrypt");
const utilities = require("../Services/utilities");
const { handleError } = require("../Services/error");

const saltRounds = 10;

const users = require("../Models/user").users;

exports.login = async function (req, res) {
  // Handle login based on the presence of req.query.code
  if (req.query.code) {
    utilities.getTokens(req.query.code, (error, tokens) => {
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
  } else {
    try {
      if (!req.body.email) {
        return handleError(res, 400, "Email is required");
      }

      if (!req.body.password) {
        return handleError(res, 400, "Password is required");
      }

      let user = {
        email: req.body.email,
        password: req.body.password,
      };

      const foundUser = await users.findOne({ email: user.email }).exec();

      if (!foundUser) {
        handleError(res, 401, "User not found");
      }

      const isPasswordHashed = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (isPasswordHashed || req.body.password === foundUser.password) {
        utilities.generateJSWToken({ user: req.body.email }, (token) => {
          res.status(200).json({ token: token });
        });
      } else {
        handleError(res, 401, "Not Authorized");
      }
    } catch (error) {
      handleError(res, 500, `Error trying to Login: ${error}`);
    }
  }
};

exports.register = function (req, res) {
  // Check for required fields
  if (!req.body.name) {
    return handleError(res, 400, "Name is required");
  }

  if (!req.body.email) {
    return handleError(res, 400, "Email is required");
  }

  if (!req.body.password) {
    return handleError(res, 400, "Password is required");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

  users
    .findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return handleError(res, 406, "Duplicated Email");
      }

      let newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        seens: [],
        likes: [],
        playlistId: [],
      };

      users
        .create(newUser)
        .then((createdUser) => {
          console.log(newUser);
          console.log(createdUser);
          const user_info = { email: createdUser.email };
          generateJSWToken(user_info, (token) => {
            res.status(201).json({ accessToken: token, user: createdUser });
          });
        })
        .catch((error) => {
          console.error(error);
          handleError(res, 500, "Error creating user");
        });
    })
    .catch((error) => {
      handleError(res, 500, `Error checking for duplicated user: ${error}`);
    });
};
