const express = require('express');
const { authJwt } = require('../utils');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/info', userController.getUserInfo);
router.post('/modify', userController.changeUserInfo);
router.get(
  '/withdrawal',
  userController.handleWithdrawal
);
router.post('/password', userController.changePassword);

module.exports = router;
