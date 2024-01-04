const express = require("express");
const router = express.Router();

//const { body, validationResult } = require("express-validator");
//const authController = require("../Controllers/authController")
//const authGoogleController = require("../Controllers/authGoogleController")
const utilities = require("../Services/utilities3")

// router.post("/login", function (req, res) {
//   authController.login(req, res);
// });

// router.get("/loginGoogle", function (req, res) {~
//   console.log(req.query);
//   authGoogleController.login(req, res);
// })

// router.post("/register", function (req, res) {
//   authController.register(req, res)
// })

// router.get('/google', function (req, res) {
//   authGoogleController.google(req, res)
// })

router.get('/', function(req, res) {
  res.send(utilities.urlGoogle()); 
})

router.get('/login', function(req, res) {
  utilities.getTokens(req.query.code, (error, tokens) => {
      if(error) {
          res.status(400).send(error)
      } else {
          utilities.getUserInfo(tokens.access_token, (error, user_info) => {
              if(error) {
                  res.status(400).send(error);
              } else {
                  utilities.validateToken(tokens.id_token, (error, validToken) => {
                      if(error) {
                          res.status(400).send(error);
                      } else {
                          res.status(200).send({tokens: tokens, user: user_info, validToken: validToken})
                      }
                  });
              }
          })
      }
  })
})


// router.post(
//   "/register",
//   [
//     body("username").isEmail().notEmpty().escape(),
//     body("name").notEmpty().escape(),
//     body("numId").isNumeric().notEmpty(),
//     body("birthDate").notEmpty().escape(),
//     body("nationality").notEmpty().escape(),
//     body("location").optional().escape(),
//     body("password").isLength({ min: 5, max: 10 }).notEmpty().escape(),
//   ],
//   function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.status(400).json({ errors: errors.array() });
//     } else {
//         authController.register(req, res);
//     }
//   }
// );

module.exports = router;
