const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Task = db.task;
const { Op } = db.Sequelize;
const works_on = db.works_on

exports.adminContent = (req, res) => {
  console.log(`Admin user ${req.username} sent a request`);
  return res.status(200).send('Admin Content.');
};

exports.getTask = (req, res) => {
  const {per_page, page} = req.body
  Task.count().then((count) =>
  Task.findAll({attributes: ['TaskName'], offset: per_page*(page-1), limit: per_page})
    .then((task) => {
      res.status(200).json({
        'data': task,
        'page': page,
        'totalCount': count,})
    }))
};

exports.approveUser = (req, res) => {
  const {taskName, Uid} = req.body
  
};

exports.rejectUser = (req, res) => {

};

exports.pendingUser = (req, res) => {
  const {taskName, per_page, page} = req.body
  Task.count({where: {TaskName: taskName}}).then((count => 
    User.findAll({
      include:  {model: works_on,
                attributes: ['Sid']},
      attributes: ['Uid', 'Name'],
      where: {permit: 0},
      offset: per_page*(page-1),
      limit: per_page}).then((result) => {
        res.json({
          'data': result,
          'page': page,
          'totalCount': count,
        })
      })))
};

exports.approvedUser = (req, res) => {

}
