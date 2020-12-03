const express = require('express');
const { authJwt } = require('../utils');
const { upload } = require("../utils/generalUtils");
const submitController = require('../controllers/submit.controller');
const router = express.Router();

/* begins with /api/user/submit */

router.get(
  '/',
  submitController.submitContent
);

router.post(
  /* user submits data */
  '/submit-data',
  [authJwt.verifyToken, authJwt.isSubmit],
  upload.single('csv'),
  submitController.submitContent,
  submitController.quantAssess,
  submitController.systemAssessment,
  submitController.assignEvaluator
)

router.get(
  /* list of tasks user is approved for */
  '/task-list',
<<<<<<< HEAD
  // [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getTaskList,
  submitController.getAvgScore
=======
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getTaskList
>>>>>>> f68c84a45ef7f270edde396b879655b383ad8eea
)

router.post(
  /* user applies to participate in a task */
  '/apply',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.submitApply
)

router.get(
<<<<<<< HEAD
=======
  /* user average score */
  '/submitter-details',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getAvgScore
)

router.get(
>>>>>>> f68c84a45ef7f270edde396b879655b383ad8eea
  /* list of og data type for a given task*/
  '/og-data',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getOgData
)

router.get(
  '/submitter-list',
  // [authJwt.verifyToken, authJwt.isSubmit],
  submitController.getSubmitterList
)

module.exports = router;
