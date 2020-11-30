const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Task = db.task;
const { Op } = db.Sequelize;
const Works_on = db.works_on
const Parsing_data = db.parsing_data
const Evaluate = db.evaluate

Parsing_data.hasMany(Evaluate, {foreignKey: 'Pid'})
Evaluate.belongsTo(Parsing_data, {foreignKey: 'Pid'})

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
  Task.count().then((count => 
    works_on.findAll({
      attributes: ['Sid'],
      where: {permit: 0,
              TaskName: taskName},
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
  const {taskName, per_page, page} = req.body
  Task.count().then((count => 
    works_on.findAll({
      attributes: ['Sid'],
      where: {permit: 1,
              TaskName: taskName},
      offset: per_page*(page-1),
      limit: per_page}).then((result) => {
        res.json({
          'data': result,
          'page': page,
          'totalCount': count,
        })
      })))
};

exports.evaluatedData = (req, res) => {
  // ! req.query? req.body? req?
  const { Uid, per_page, page } = req.query

  Evaluate.findAll({
    include: [{
      model: Parsing_data,
      required: true
    }],
    where: {
      Eid: parseInt(Uid),
      Pass: {[Op.ne]: null}
    },
    offset: (parseInt(per_page) * (parseInt(page)-1)),
    limit: parseInt(per_page)
  }).then((evaluate) => {
    if (evaluate){
      return res.status(200).json({
        "evaluatedData": evaluate
      })
    } else {
      return res.status(404).json({
          message: 'evaluator does not have any data assigned'
        })
    }
  })
}

exports.requestList = (req, res) => {
  const { per_page, page } = req.body
  Task.hasMany(Works_on, {foreignKey: 'TaskName'})
  Works_on.belongsTo(Task, {foreignKey: 'TaskName'})

  Works_on.findAndCountAll({
    include: [{
      model: Task,
      required: true
    }],
    where: {
      Permit: 0
    },
    offset: (per_page * (page-1)),
    limit: per_page
  }).then( (Works_on) => {
    if (Works_on){
      return res.status(200).json({
        "data": Works_on.rows,
        "page": page,
        "totalCount": Works_on.count
      })
    }
  })
}