const express = require('express');
const { verifySignUp } = require('../utils');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/signup',
  [
    verifySignUp.checkValidUsername,
    verifySignUp.checkDuplicateUsername,
    verifySignUp.checkValidPassword,
  ],
  controller.signup
);

router.post('/signin', controller.signin);

module.exports = router;
