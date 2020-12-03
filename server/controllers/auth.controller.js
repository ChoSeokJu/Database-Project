const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const { Op } = db.Sequelize;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const { username, gender, name, address, phone, birthday, password, userType } = req.body;
  console.log("Heellooo")
  User.findOne({
    where: {
      UType: userType
    },
  }).then((user) => {
    if (user && user.userType === "admin") {
      return res.status(404).json({
        message: '관리자 계정이 이미 존재합니다',
      });
    }
    else {
      User.create({
        ID: username,
        Gender: gender,
        Name: name,
        Addr: address,
        PhoneNo: phone,
        Bdate: birthday,
        Password: bcrypt.hashSync(password),
        UType: userType,
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
    }
  });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      ID: username,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: '없는 아이디입니다',
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.get('Password'));

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: '잘못된 비밀번호입니다',
      });
    }

    const token = jwt.sign({ Uid: user.get('Uid'), username }, config.secret, {
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

exports.getUser = (req, res) => {
  User.findAll()
    .then((user) => {
      res.json(user);
    })
};
