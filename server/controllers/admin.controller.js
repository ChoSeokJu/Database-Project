const db = require('../models');
const config = require('../config/auth.config');
const { json } = require('body-parser');
const { response } = require('express');

const User = db.user;
const Task = db.task;
const ogData = db.og_data_type
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
  works_on.findOne({where: {TaskName: taskName, Sid: Uid}}).then((result) =>{
    if (result.get('Permit') === 0) {
      result.set('Permit', 1)
      result.save()
      return res.status(200).json({
      message: '해당 Task의 참여를 승인했습니다'
      })
    }
    else {
      return res.status(400).json({
        message: '해당 유저는 이미 승인 결과가 나왔습니다'
      })
    }
})
};
  

exports.rejectUser = (req, res) => {
  const {taskName, Uid} = req.body
  works_on.findOne({where: {TaskName: taskName, Sid: Uid}}).then((result) =>{
    if (result.get('Permit') === 0) {
      result.set('Permit', null)
      result.save()
      return res.status(200).json({
      message: '해당 Task의 참여를 거절했습니다'
      })
    }
    else {
      return res.status(400).json({
        message: '해당 유저는 이미 승인 결과가 나왔습니다'
      })
    }
})
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
      where: {TaskName: taskName, Permit:0},
      offset: parseInt(per_page)*(parseInt(page)-1),
      limit: parseInt(per_page)}).then((result) => {
        for (var i=0; i<result.length; i++) {
          arr.push(result[i].user)
        }
        console.log(JSON.stringify(result))
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
      where: {TaskName: taskName, Permit:1},
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

exports.getSchema = (req, res) => {
  const {taskName} = req.query
  var arr = []
  Task.findAll({
    attributes: ['TableSchema'],
    where: {TaskName: taskName}})
    .then((columns) => {
      console.log(Object.keys(columns[0].TableSchema[0])[0])
      for (var i=0; i<columns[0].TableSchema.length; i++) {
        arr.push({columnName: Object.keys(columns[0].TableSchema[i])[0]})
      }
      res.status(200).json({
        data: arr
      })
    })
};

exports.addTask = (req, res) => {
};

exports.addOgData = (req, res) => {
  const {taskName, OGDataType, data} = req.body
  ogData.findAll()
};


exports.test = (req, res) => {
  const {taskName, Uid} = req.body
  works_on.findOne({where: {TaskName: taskName, Sid: Uid}}).then((result) =>{
    if (result.get('Permit') === 1) {
      result.set('Permit', 3)
      result.save()
      res.json(result)
    }}
  );
};
