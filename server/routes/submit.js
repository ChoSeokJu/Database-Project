const express = require('express');
const { authJwt } = require('../utils');
const submitController = require('../controllers/submit.controller');
const router = express.Router();

/* begins with /api/user/submit */

router.get(
  '/',
  submitController.submitContent
);

router.post(
  '/submit-data',
  // submitController.systemAssessment,
  submitController.assignEvaluator
)

module.exports = router;
