const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.adminContent
);

module.exports = router;
