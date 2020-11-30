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

router.get(
  '/user-info/eval',

  adminController.evaluatedData
)

router.get(
  '/request',

  adminController.requestList
)

router.get(
  '/task/parsed-data/download',

  adminController.downloadParsedData
)
module.exports = router;

