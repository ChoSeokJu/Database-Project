const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const { Op } = db.Sequelize;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  User.create({
    ID: req.body.username,
    Gender: req.body.gender,
    Name: req.body.name,
    Addr: req.body.address,
    PhoneNo: req.body.phone,
    Bdate: req.body.birthday,
    Password: bcrypt.hashSync(req.body.password),
    UType: req.body.userType,
  })
    .then((user) => {
      res.json({
        message: '회원가입에 성공했습니다',
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      ID: req.body.username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: '없는 아이디 입니다',
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.get('Password')
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: '잘못된 비밀번호입니다',
      });
    }

    const token = jwt.sign({ id: user.get('UType') }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).json({
      id: user.get('Uid'),
      username: user.get('ID'),
      role: user.get('UType'),
      accessToken: token,
    });
  });
};
