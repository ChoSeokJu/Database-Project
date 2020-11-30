const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get(
  '/',
  adminController.adminContent
);


router.get('/task', adminController.getTask);

router.get('/pending', adminController.pendingUser);


module.exports = router;

