const bcrypt = require('bcryptjs');
const db = require('../models');
const { checkValidPassword } = require('../utils/verifySignUp');

const User = db.user;
const Requests = db.request_task;

exports.changeUserInfo = (req, res) => {
  const { Uid } = req;
  User.findByPk(Uid).then((user) => {
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
  const { Uid } = req;
  User.findByPk(Uid).then((user) => {
    if (user.get('UType') === 2) {
      return res.status(400).json({
        message: '관리자는 비밀번호를 변경할 수 없습니다',
      });
    }
    checkValidPassword(req, res, () => {
      user.set('Password', bcrypt.hashSync(req.body.password));
      user.save();
      console.log(user);
      return res.json({
        message: '패스워드를 변경했습니다',
      });
    });
  });
};

exports.getUserInfo = (req, res) => {
  const { Uid } = req.query;
  User.findByPk(Uid).then((user) => res.json({
    Name: user.get('Name'),
    Bdate: user.get('Bdate'),
    Gender: user.get('Gender'),
    ID: user.get('ID'),
    Addr: user.get('Addr'),
    PhoneNo: user.get('PhoneNo'),
  }));
};

exports.handleWithdrawal = (req, res) => {
  const { Uid } = req.query;
  User.findByPk(Uid).then((user) => {
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

exports.requestTask = (req, res) => {
  const { title, content } = req.body;
  const date = new Date();
  const dateToTimestamp = date.getTime();
  const timestampToDate = new Date(dateToTimestamp);
  Requests.create({
    Title: title,
    Content: content,
    Date: timestampToDate
  }).then((result) => {
    if (title || content) {
      res.status(200).json({
        message: 'Task 요청이 완료되었습니다'
      });
    }
    else if (!title || !content) {
      res.status(400).json({
        message: '제목이나 내용을 작성하지 않으셨습니다'
      });
    }
  })
};
