const express = require('express');
const { authJwt } = require('../utils');
const submitController = require('../controllers/submit.controller');

const router = express.Router();

router.get(
  '/',
  [authJwt.verifyToken, authJwt.isSubmit],
  submitController.submitContent
);

module.exports = router;
