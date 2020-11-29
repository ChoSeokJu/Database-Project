const express = require('express');
const { authJwt } = require('../utils');
const { upload } = require("../utils/generalUtils");
const submitController = require('../controllers/submit.controller');
const router = express.Router();

/* begins with /api/user/submit */

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.submitContent
);

router.post(
  /* user submits data */
  '/submit-data',
  // [authJwt.verifyToken, authJwt.isSubmit],
  upload.single('csv'),
  submitController.submitContent,
  submitController.quantAssess,
  submitController.systemAssessment,
  submitController.assignEvaluator
)

router.post(
  /* list of tasks user is approved for */
  '/task-list',
  // [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getTaskList
)

router.post(
  /* user applies to participate in a task */
  '/apply',
  // [authJwt.verifyToken, authJwt.isSubmit],
  submitController.submitApply
)

router.get(
  /* user average score */
  '/submitter-details',
  // [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getAvgScore
)

module.exports = router;
