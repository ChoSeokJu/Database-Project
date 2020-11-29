const express = require('express');
const { authJwt } = require('../utils');
const evalController = require('../controllers/eval.controller');

const router = express.Router();

/* route begins with "./api/user/eval" */

// router.get(
//   '/data-list',
//   [authJwt.verifyToken, authJwt.isEval],
//   evalController.evalContent
// );

router.get(
  '/',
  evalController.example
);

module.exports = router;
