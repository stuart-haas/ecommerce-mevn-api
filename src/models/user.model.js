const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const crypto = require('crypto');

const fields = {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'superadmin'],
    default: 'member',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: String,
  firstName: String,
  lastName: String,
  street: String,
  city: String,
  state: String,
  zipCode: String,
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
};

const User = new Schema(fields, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
});

User.pre('save', function () {
  if (!this.avatar) {
    this.avatar = this.gravatar();
  }
  if (this.role === 'admin' || this.role === 'superadmin') {
    this.isAdmin = true;
  }
});

User.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.hash;
  delete obj.salt;
  return obj;
};

User.methods.gravatar = function (size = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=mp`;
  }

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=identicon`;
};

User.plugin(passportLocalMongoose);

module.exports = model('User', User, 'user');
