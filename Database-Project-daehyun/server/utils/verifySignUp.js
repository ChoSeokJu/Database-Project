const db = require('../models');

const User = db.user;

const checkValidUsername = (req, res, next) => {
  const usernameRegex = /^[a-z0-9]+$/;

  const { username } = req.body;

  if (!usernameRegex.test(username)) {
    res.status(400).json({
      message: '유효하지 않은 아이디입니다',
    });
    return;
  }

  next();
};

const checkDuplicateUsername = (req, res, next) => {
  const { username } = req.body;

  User.findOne({
    where: {
      ID: username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).json({
        message: '이미 존재하는 아이디입니다',
      });
      return;
    }
    next();
  });
};

const checkValidPassword = (req, res, next) => {
  const { password } = req.body;

  if (password.length < 4 || typeof password !== 'string') {
    res.status(400).json({
      message: '비밀번호가 너무 짧습니다',
    });
    return;
  }

  next();
};

const verifySignUp = {
  checkValidUsername,
  checkDuplicateUsername,
  checkValidPassword,
};

module.exports = verifySignUp;
