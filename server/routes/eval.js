const express = require('express');
const { authJwt } = require('../utils');
const evalController = require('../controllers/eval.controller');

const router = express.Router();

/* route begins with "./api/user/eval" */

router.post(
  '/',
  [authJwt.verifyToken, authJwt.isEval],
  evalController.evaluate,
  evalController.saveToTaskTable
)

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isEval],
  evalController.evalContent
);

router.get(
  '/parsed-data/download',
  [authJwt.verifyToken, authJwt.isEval],
  evalController.downloadParsedData
);

module.exports = router;
