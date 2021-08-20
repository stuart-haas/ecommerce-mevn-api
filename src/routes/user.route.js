const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/user.controller');
const middleware = require('../middlewares/user.middleware');
const auth = require('../utils/auth');

router.route('/').get(auth.isAdmin, controller.findAll);

router.post(
  '/cp/register',
  middleware.registrationRules,
  auth.validate,
  auth.isAdmin,
  controller.admin.register
);
router.post(
  '/cp/login',
  middleware.loginRules,
  auth.validate,
  auth.isAdminByUsername,
  passport.authenticate('local'),
  controller.login
);
router.post(
  '/cp/impersonate',
  auth.isAdmin,
  controller.impersonate,
  passport.authenticate('local'),
  controller.login
);

router
  .route('/cp/:id')
  .get(auth.isAdmin, controller.find)
  .put(auth.isAdmin, controller.update)
  .delete(auth.isAdmin, controller.delete);

router.post(
  '/register',
  middleware.registrationRules,
  auth.validate,
  controller.register
);
router.post(
  '/login',
  middleware.loginRules,
  auth.validate,
  passport.authenticate('local'),
  controller.login
);
router.post('/logout', controller.logout);

router.get('/session', controller.session);

router.post('/favorite/:user', auth.isMe, controller.addFavorite);
router.put('/favorite/:user', auth.isMe, controller.removeFavorite);

router
  .route('/:user')
  .get(auth.isMe, controller.findMine)
  .put(auth.isMe, controller.updateMine)
  .delete(auth.isMe, controller.deleteMine);

module.exports = router;
