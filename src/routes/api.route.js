const router = require('express').Router();
const upload = require('./upload.route');
const user = require('./user.route');
const product = require('./product.route');
const category = require('./category.route');
const cart = require('./cart.route');
const order = require('./order.route');

router.use('/upload', upload);
router.use('/user', user);
router.use('/product', product);
router.use('/category', category);
router.use('/cart', cart);
router.use('/order', order);

module.exports = router;
