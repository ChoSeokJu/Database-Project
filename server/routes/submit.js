const express = require('express');
const { authJwt } = require('../utils');
const submitController = require('../controllers/submit.controller');
const router = express.Router();

/* begins with /api/user/submit */

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.submitContent
);

router.post(
  '/submit-data',
  [authJwt.verifyToken, authJwt.isSubmit],
  // submitController.systemAssessment,
  submitController.assignEvaluator
)

module.exports = router;
