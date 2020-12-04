const express = require('express');
const { authJwt } = require('../utils');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

/* /api/user/admin */

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.adminContent
);


router.get(
  '/task', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getTask
);

router.post(
  '/task/make',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.makeTask
);

router.post(
  '/task/approve', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.approveUser
)

router.post(
  '/task/reject',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.rejectUser
)

router.get(
  '/task/pending', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.pendingUser
);

router.get(
  '/task/approved', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.approvedUser
);

router.get(
  '/task/schema', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getSchema
);

router.post(
  '/task/og-data', 
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.addOgData
);

router.get(
  '/user-info/eval',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.evaluatedData
)

router.get(
  '/user-info/all',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getUserinfoAll
);

router.get(
  '/user-info/search',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.infoSearch
);


router.get(
  '/request',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.requestList
)

router.get(
  '/task/parsed-data',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.parsedDataList
)

router.get(
  '/task/parsed-data/download',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.downloadParsedData
)

router.get(
  '/task/download',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.downloadTaskData
)

router.get(
  '/task/info',
  // [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getTaskInfo
)

router.get(
  '/user-info',
  [authJwt.verifyToken, authJwt.isAdmin],
  adminController.getUserInfo
)

module.exports = router;

