const { Schema, model } = require('mongoose');
const orderid = require('order-id')(process.env.ORDER_ID_SECRET);

const fields = {
  orderId: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  subtotal: {
    type: Number,
    default: 0,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  shippingOption: {
    type: String,
    default: 'Ground',
  },
  shippingProvider: {
    type: String,
    default: 'Shipping Provider',
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'archived', 'canceled'],
    default: 'authorized',
  },
  note: String,
};

const Order = new Schema(fields, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
});

Order.pre('save', async function () {
  if (!this.orderId) {
    const id = orderid.generate();
    this.orderId = id;
  }
  return this;
});

Order.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

Order.methods.decreaseProductInventory = async function () {
  const order = await this.populateItems();
  order.items = order.items.map((item) => {
    const { product, quantity } = item;
    product.decreaseInventory(quantity);
    return item;
  });
  return order;
};

Order.methods.restoreProductInventory = async function () {
  const order = await this.populateItems();
  order.items = order.items.map((item) => {
    const { product, quantity } = item;
    product.increaseInventory(quantity);
    return item;
  });
  return order;
};

Order.methods.calculateTotals = async function () {
  const order = await this.populateItems();
  order.items = order.items.map((item) => {
    const { product, quantity } = item;
    const total = product.price * quantity;
    item.price = product.price;
    item.total = total;
    this.subtotal += total;
    this.total = this.subtotal + this.shipping;
    return item;
  });
  return order;
};

Order.methods.populateItems = async function () {
  return await this.populate({
    path: 'items',
    populate: {
      path: 'product',
      model: 'Product',
    },
  }).execPopulate();
};

module.exports = model('Order', Order, 'order');
