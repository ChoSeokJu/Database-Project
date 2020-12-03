const express = require('express');
const { authJwt } = require('../utils');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/info',
  [authJwt.verifyToken],
  userController.getUserInfo);
router.post('/modify',
  [authJwt.verifyToken],
  userController.changeUserInfo);
router.get(
  '/withdrawal',
  [authJwt.verifyToken],
  userController.handleWithdrawal,
);
router.post('/password',
  [authJwt.verifyToken],
  userController.changePassword);


router.post('/request-task',
  [authJwt.verifyToken],
  userController.requestTask);

module.exports = router;
