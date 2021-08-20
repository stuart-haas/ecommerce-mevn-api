const { validationResult } = require('express-validator');
const User = require('../models/user.model');

module.exports = {
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: true,
        message: 'Something went wrong',
        errors: errors.array(),
      });
    } else {
      return next();
    }
  },
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    res.status(401).send({ error: true, message: 'You are not authenticated' });
  },
  isMe: (req, res, next) => {
    const isAuthenticated = req.isAuthenticated();
    const isMe =
      req.user._id && String(req.user._id) === String(req.params.user);

    if (isAuthenticated && isMe) {
      return next();
    }

    res.status(403).send({ error: true, message: 'You are not authorized' });
  },
  isAdmin: async (req, res, next) => {
    const isAuthenticated = req.isAuthenticated();

    if (!req.user.isAdmin || !isAuthenticated) {
      return res
        .status(403)
        .json({ error: true, message: 'You are not authorized ' });
    }
    next();
  },
  isAdminByUsername: async (req, res, next) => {
    const { username } = req.body;
    let user = await User.findOne({ username });

    if (!user.isAdmin) {
      return res.status(403).json({
        error: true,
        message: 'You are not authorized',
      });
    }
    next();
  },
};
