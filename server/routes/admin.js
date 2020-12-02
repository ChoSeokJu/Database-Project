const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get(
  '/',
  adminController.adminContent
);


router.get('/task', adminController.getTask);
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
router.get('/user-info/all',adminController.getUserinfo);
router.get('/user-info/search',adminController.infoSearch);

module.exports = router;

