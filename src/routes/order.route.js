const router = require('express').Router();
const controller = require('../controllers/order.controller');
const auth = require('../utils/auth');

router.route('/').post(controller.create);

router.route('/duplicate').post(auth.isAdmin, controller.duplicate);

router.put('/batch/status', auth.isAdmin, controller.batchUpdateStatus);

router.route('/cp').get(auth.isAdmin, controller.admin.findAll);

router
  .route('/cp/:id')
  .all(auth.isAdmin)
  .get(controller.admin.find)
  .put(controller.update)
  .delete(controller.delete);

router.route('/:user').get(auth.isMe, controller.findAll);

router.route('/:user/:id').get(auth.isMe, controller.find);

module.exports = router;
