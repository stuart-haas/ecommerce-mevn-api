const User = require('../models/user.model');

module.exports = {
  admin: {
    register: async (req, res) => {
      const { username, email, role, password } = req.body;
      try {
        const user = await User.register(
          new User({ username, email, role }),
          password
        );
        res.json({ success: true, message: 'Registration successful', user });
      } catch (error) {
        res.status(422).json({ error: true, message: 'Something went wrong' });
      }
    },
  },
  session: async (req, res) => {
    const { user } = req;
    if (!user) {
      return res.json({ error: true, message: 'Session expired' });
    }
    res.json({ user });
  },
  impersonate: async (req, res) => {
    try {
      const authUser = await User.findById(req.body.id);
      if (req.user.role !== 'superadmin' && authUser.role === 'superadmin') {
        return res.status(403).json({
          error: true,
          message: 'You are not permitted',
        });
      }
      req.login(authUser, () => {
        const user = authUser.toJSON();
        return res.json({
          success: true,
          message: 'Login successful',
          user,
        });
      });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  register: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const user = await User.register(new User({ username, email }), password);
      res.json({ success: true, message: 'Registration successful', user });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  login: (req, res) => {
    const user = req.user.toJSON();
    return res.json({
      success: true,
      message: 'Login successful',
      user,
    });
  },
  logout: (req, res) => {
    if (req.user) {
      req.logout();
      req.session.destroy((error) => {
        if (error) {
          return res.json(error);
        }
        return res.json({ success: true, message: 'Logout successul' });
      });
    } else {
      return res.json({ error: true, message: 'You are not logged in' });
    }
  },
  findAll: async (req, res) => {
    const users = await User.find();
    res.json(users);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('favorites', '_id name');
    if (req.user.role !== 'superadmin' && user.role === 'superadmin') {
      return res.status(403).json({
        error: true,
        message: 'You are not permitted',
      });
    }
    res.json(user);
  },
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (req.user.role !== 'superadmin' && user.role === 'superadmin') {
        return res.status(403).json({
          error: true,
          message: 'You are not permitted',
        });
      }
      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });
      await user.save();
      if (String(user._id) === String(req.user._id)) {
        return req.login(user, () => {
          const authUser = user.toJSON();
          return res.json({
            success: true,
            message: 'Session reloded',
            user: authUser,
          });
        });
      }
      res.json({ success: true, message: 'User updated', user });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (req.user.role !== 'superadmin' && user.role === 'superadmin') {
        return res.status(403).json({
          error: true,
          message: 'You are not permitted',
        });
      }
      await user.deleteOne();
      res.json({
        success: true,
        message: 'User deleted',
        user,
      });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  findMine: async (req, res) => {
    const id = req.params.user;
    const user = await User.findById(id).populate('favorites', '_id name');
    res.json(user);
  },
  updateMine: async (req, res) => {
    const id = req.params.user;
    try {
      const user = await User.findById(id);
      Object.keys(req.body).forEach((key) => {
        if (key !== 'role') {
          user[key] = req.body[key];
        }
      });
      await user.save();
      if (
        user.username !== req.user.username ||
        user.email !== req.user.email
      ) {
        return req.login(user, () => {
          const authUser = user.toJSON();
          return res.json({
            success: true,
            message: 'Session reloded',
            user: authUser,
          });
        });
      }
      res.json({ success: true, message: 'User updated', user });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  deleteMine: async (req, res) => {
    const id = req.params.user;
    try {
      const user = await User.findById(id);
      await user.deleteOne();
      res.json({
        success: true,
        message: 'User deleted',
        user,
      });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  addFavorite: async (req, res) => {
    const id = req.params.user;
    const { favorite } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            favorites: favorite,
          },
        },
        { new: true }
      ).populate('favorites', '_id name');
      res.json({ success: true, message: 'Favorite added', user });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  removeFavorite: async (req, res) => {
    const id = req.params.user;
    const { favorite } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            favorites: favorite,
          },
        },
        { new: true }
      ).populate('favorites', '_id name');
      res.json({ success: true, message: 'Favorite removed', user });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
};
