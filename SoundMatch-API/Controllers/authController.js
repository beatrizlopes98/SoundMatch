//const passengers = require("../models/passenger").passengers;
const users = require("../Models/user").users;
const { generateToken } = require("../Services/utilities2");
const bcrypt = require("bcrypt");

const saltRounds = 10;

exports.login = async function (req, res) {
    try {
      let user = {
        email: req.body.email,
        password: req.body.password
      };

      const foundUser = await users
        .findOne({ email: user.email })
        .exec()

      if (!foundUser) {
        return res.status(401).send("User not found")
      }
  
      const isPasswordHashed = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );
  
      if (isPasswordHashed || req.body.password === foundUser.password) {
        generateToken({ user: req.body.email }, (token) => {
          res.status(200).json({token: token});
        });
      } else {
        res.status(401).send("Not Authorized");
      }
    } catch (error) {
      res.status(400).send("Error trying to Login", error);
    }
  };

exports.register = function (req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  
    users
      .findOne({ email: req.body.email })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(406).send("Duplicated Email");
        }
  
        let newUser = {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          seens: [],
          likes: [],
          playlistId: []
        };
  
        users
          .create(newUser)
          .then((createdUser) => {
            console.log(newUser)
            console.log(createdUser)
            const user_info = { email: createdUser.email };
            generateToken(user_info, (token) => {
              res.status(201).json({ accessToken: token, user: createdUser});
            });
          })
          .catch((error) => {
            console.error(error); 
            res.status(500).send("Error creating user");
          });
      })
      .catch((error) => {
        res.status(500).send("Error checking for duplicated user", error);
      });
  };