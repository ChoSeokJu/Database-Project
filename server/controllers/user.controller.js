const bcrypt = require('bcryptjs');
const db = require('../models');
const { checkValidPassword } = require('../utils/verifySignUp');

const User = db.user;

exports.changeUserInfo = (req, res) => {
  const {id} = req.body
  User.findByPk(id).then((user) => {
    const { address, phone } = req.body;
    user.set('Addr', address);
    user.set('PhoneNo', phone);
    user.save();
    return res.json({
      message: '회원정보를 수정했습니다',
    });
  });
};

exports.changePassword = (req, res) => {
  const {id} = req.body
  User.findByPk(id).then((user) => {
    if (user.get('UType') === 2) {
      return res.status(400).json({
        message: '관리자는 비밀번호를 변경할 수 없습니다',
      });
    }
    checkValidPassword(req, res, () => {
      user.set('Password', bcrypt.hashSync(req.body.password));
      user.save();
      return res.json({
        message: '패스워드를 변경했습니다',
      });
    });
  });
};

exports.getUserInfo = (req, res) => {
  const {id} = req.query
  User.findByPk(id).then((user) =>
    res.json({
      Name: user.get('Name'),
      Bdate: user.get('Bdate'),
      Gender: user.get('Gender'),
      ID: user.get('ID'),
      Addr: user.get('Addr'),
      PhoneNo: user.get('PhoneNo'),
    })
  );
};

exports.handleWithdrawal = (req, res) => {
  const {id} = req.query
  User.findByPk(id).then((user) => {
    if (user.get('UType') === 2) {
      return res
        .status(400)
        .json({ message: 'Admin 계정은 탈퇴할 수 없습니다' });
    }
    user
      .destroy()
      .then(() => res.json({ message: '회원탈퇴가 완료되었습니다' }));
  });
};
