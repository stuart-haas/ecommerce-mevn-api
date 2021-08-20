const Category = require('../models/category.model');

module.exports = {
  findAll: async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.json(category);
  },
  create: async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.json({ success: true, message: 'Category created', category });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findById(id);
      Object.keys(req.body).forEach((key) => {
        category[key] = req.body[key];
      });
      await category.save();
      res.json({ success: true, message: 'Category updated', category });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  batchUpdateStatus: async (req, res) => {
    const { ids, status } = req.body;
    try {
      await Category.updateMany(
        { _id: { $in: ids } },
        { $set: { status } },
        { multi: true }
      );
      res.json({ success: true, message: 'Categories updated' });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      res.json({ success: true, message: 'Category deleted', category });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
  batchDelete: async (req, res) => {
    const { ids } = req.body;
    try {
      await Category.deleteMany({ _id: { $in: ids } });
      res.json({ success: true, message: 'Categories deleted' });
    } catch (error) {
      res.status(422).json({ error: true, message: 'Something went wrong' });
    }
  },
};
