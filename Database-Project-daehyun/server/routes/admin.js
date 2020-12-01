const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();
router.get('/user-info/all',adminController.getUserinfo);
router.get('/prac',adminController.getData);
router.get('/checkTask',adminController.totalCount);
router.get('/checkWos', adminController.wodata);
router.get('/joinTest', adminController.joinTest);
router.get('/getTask', adminController.getTask);
router.get('/getPdata', adminController.getPdata);
router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.adminContent
);
router.get('/user-info/search',adminController.infoSearch);

module.exports = router;
