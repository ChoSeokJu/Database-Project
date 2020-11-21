const jwt = require('jsonwebtoken');
const db = require('../models');
const config = require('../config/auth.config.json');

const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }
    req.Uid = decoded.Uid;
    req.username = decoded.username;
    console.log(req.Uid);
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.Uid).then((user) => {
    if (user && user.get('UType') === 'admin') {
      next();
      return;
    }

    res.status(403).send({
      message: 'Require Admin User Type',
    });
  });
};

const isEval = (req, res, next) => {
  User.findByPk(req.Uid).then((user) => {
    if (user && user.get('UType') === 'eval') {
      next();
      return;
    }

    res.status(403).send({
      message: 'Require Eval User Type',
    });
  });
};

const isSubmit = (req, res, next) => {
  User.findByPk(req.Uid).then((user) => {
    if (user && user.get('UType') === 'submit') {
      next();
      return;
    }

    res.status(403).send({
      message: 'Require Submit User Type',
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isEval,
  isSubmit,
};

module.exports = authJwt;
