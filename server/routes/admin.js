const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get(
  '/',
  adminController.adminContent
);


router.get('/task', adminController.getTask);
router.post('/task/make', adminController.makeTask);
router.post('/task/approve', adminController.approveUser)
router.post('/task/reject', adminController.rejectUser)
router.get('/task/pending', adminController.pendingUser);
router.get('/task/approved', adminController.pendingUser);
router.get('/task/schema', adminController.getSchema);
router.post('/task/og-data', adminController.addOgData);
router.get(
  '/user-info/eval',

  adminController.evaluatedData
)

router.get(
  '/request',

  adminController.requestList
)

router.get(
  '/task/parsed-data',

  adminController.parsedDataList
)

router.get(
  '/task/parsed-data/download',

  adminController.downloadParsedData
)

router.get(
  '/task/download',

  adminController.downloadTaskData
)

router.get(
  '/user-info',
  adminController.getUserInfo
)
module.exports = router;

