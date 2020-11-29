const express = require('express');
const { authJwt } = require('../utils');
const evalController = require('../controllers/eval.controller');

const router = express.Router();

/* route begins with "./api/user/eval" */

router.post(
  '/evaluate',
  // [authJwt.verifyToken, authJwt.isEval],
  evalController.evaluate,
  evalController.saveToTaskTable
)

router.get(
  '/data-list',
  // [authJwt.verifyToken, authJwt.isEval],
  evalController.evalContent
);

module.exports = router;
