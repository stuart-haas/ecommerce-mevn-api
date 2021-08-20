const { Schema, model } = require('mongoose');
const fns = require('../utils/functions');

const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: String,
  image: String,
  status: {
    type: String,
    enum: ['draft', 'active'],
    default: 'draft',
  },
};

const Category = new Schema(fields, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
});

Category.pre('save', function () {
  this.slug = fns.slugify(this.name);
  return this;
});

module.exports = model('Category', Category, 'category');
