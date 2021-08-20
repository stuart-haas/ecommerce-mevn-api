const router = require('express').Router();
const controller = require('../controllers/upload.controller');
const auth = require('../utils/auth');

router.post('/', auth.isAdmin, controller.upload);

module.exports = router;
