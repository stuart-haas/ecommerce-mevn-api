const User = require('../models/user.model');
const { body } = require('express-validator');

module.exports = {
  registrationRules: [
    body('username', 'Username required')
      .exists()
      .trim()
      .escape()
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject('Username already exists');
          }
        });
      }),
    body('email', 'Email required')
      .isEmail()
      .exists()
      .trim()
      .escape()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Email already exists');
          }
        });
      }),
    body('password', 'Password required').exists().trim().escape(),
    body('passwordConfirm', 'Passwords do not match')
      .exists()
      .trim()
      .escape()
      .custom((value, { req }) => value == req.body.password),
  ],
  loginRules: [
    body('username', 'Username required')
      .exists()
      .trim()
      .escape()
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (!user) {
            return Promise.reject('User not found');
          }
        });
      }),
    body('password', 'Password required').exists().trim().escape(),
  ],
};
