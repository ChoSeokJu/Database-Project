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
  const {per_page, page} = req.query
  Task.count().then((count) =>
  Task.findAll({attributes: ['TaskName'], offset: parseInt(per_page)*(parseInt(page)-1), limit: parseInt(per_page)})
    .then((task) => {
      res.status(200).json({
        'data': task,
        'page': parseInt(page),
        'totalCount': count,})
    }))
};

exports.approveUser = (req, res) => {
  const {taskName, Uid} = req.body
  
};

exports.rejectUser = (req, res) => {

};

exports.pendingUser = (req, res) => {
  User.hasMany(works_on, {foreignKey: 'Sid'})
  works_on.belongsTo(User, {foreignKey: 'Sid'})
  var arr = []
  const {taskName, per_page, page} = req.query
  Task.count().then((count => 
    works_on.findAll({
      attributes: [],
      include: [
        {model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true}
      ],
      where: {TaskName: taskName, permit:0},
      offset: parseInt(per_page)*(parseInt(page)-1),
      limit: parseInt(per_page)}).then((result) => {
        for (var i=0; i<result.length; i++) {
          arr.push(result[i].user)
        }
        res.json({
          'data': arr,
          'page': parseInt(page),
          'totalCount': count,
        })
      })))
};

exports.approvedUser = (req, res) => {
  User.hasMany(works_on, {foreignKey: 'Sid'})
  works_on.belongsTo(User, {foreignKey: 'Sid'})
  var arr = []
  const {taskName, per_page, page} = req.query
  Task.count().then((count => 
    works_on.findAll({
      attributes: [],
      include: [
        {model: User,
        attributes: ['Uid', 'ID', 'Name'],
        required: true}
      ],
      where: {TaskName: taskName, permit:1},
      offset: parseInt(per_page)*(parseInt(page)-1),
      limit: parseInt(per_page)}).then((result) => {
        for (var i=0; i<result.length; i++) {
          arr.push(result[i].user)
        }
        res.json({
          'data': arr,
          'page': parseInt(page),
          'totalCount': count,
        })
      })))
};

