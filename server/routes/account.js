const express = require('express');
const bkfd2Password = require('pbkdf2-password');
const { user } = require('../models');

const router = express.Router();
const hasher = bkfd2Password();

router.post('/signup', (req, res) => {
  /**
   * 구현해야할 부분
   */
  console.log(req.body);
  const usernameRegex = /^[a-z0-9]+$/;
  const {
    username,
    gender,
    name,
    address,
    phone,
    birthday,
    password,
    usertype,
  } = req.body;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'BAD USERNAME',
      code: 1,
    });
  }

  if (password.length < 4 || typeof password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2,
    });
  }

  user.findOne({ ID: username }, (err, exists) => {
    if (err) throw err;
    if (exists) {
      return res.status(409).json({
        error: 'USERNAME EXISTS',
        code: 3,
      });
    }

    hasher({ Password: password }, (err, pass, salt, hash) => {
      user
        .create({
          ID: username,
          Gender: gender,
          Name: name,
          Addr: address,
          PhoneNo: phone,
          Bdate: birthday,
          Password: hash,
          UType: usertype,
          salt,
        })
        .then(() => res.json({ success: true }))
        .catch((error) => {
          console.error(error);
        });
    });
  });
});

router.post('/signin', (req, res) => {
  res.json({ success: true });
});

router.post('/getinfo', (req, res) => {
  res.json({ info: null });
});

router.post('/logout', (req, res) => res.json({ success: true }));

module.exports = router;
