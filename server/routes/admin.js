const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get(
  '/',
  adminController.adminContent
);


router.get('/task', adminController.getTask);
router.get('/task/approve', adminController.approveUser)
router.get('/task/reject', adminController.rejectUser)
router.get('/task/pending', adminController.pendingUser);
router.get('/task/approved', adminController.pendingUser);
router.get('/task/schema', adminController.getSchema);
router.get('/task/test', adminController.test);

module.exports = router;

