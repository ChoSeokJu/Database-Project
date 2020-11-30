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

router.get('/example', controller.getUser);

router.get('/examples', function (req, res) {
  return res.status(200).send('시발')
});

module.exports = router;
