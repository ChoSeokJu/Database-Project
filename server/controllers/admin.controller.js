const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Task = db.task;
const { Op } = db.Sequelize;
const Works_on = db.works_on
const Parsing_data = db.parsing_data
const Evaluate = db.evaluate
const og_data_type = db.og_data_type
const AVG_SCORE = db.AVG_SCORE

Parsing_data.hasMany(Evaluate, {foreignKey: 'Pid'})
Evaluate.belongsTo(Parsing_data, {foreignKey: 'Pid'})

User.hasMany(Parsing_data, {foreignKey: 'Sid'})
Parsing_data.belongsTo(User, {foreignKey: "Sid"})

og_data_type.hasMany(Parsing_data, {foreignKey: 'Did'})
Parsing_data.belongsTo(og_data_type, {foreignKey: 'Did'})

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

exports.parsedDataList = (req, res) => {
  const { taskName, per_page, page } = req.body
  const output = []
  Parsing_data.findAll({
    include: [{
      model: Evaluate,
      required: true
    }, {
      model: User,
      required: true
    }, {
      model: og_data_type,
      required: true
    }],
    where: {
      TaskName: taskName
    },
    offset: per_page*(page-1), 
    limit: per_page
  }).then((parsing_data) => {
    if(parsing_data){
      parsing_data.forEach( (p_data) => {
        output.push({
          "Pid": p_data.Pid,
          "ID": p_data.user.ID,
          "date": p_data.TimeStamp,
          "OGDataType": p_data.og_data_type.Name,
          "PNP": p_data.evaluates[0].Pass
        })
      })
      return res.status(200).json({
        output
      })
    } else {
      return res.status(400).json({
        "message": "nothing found"
      })
    }
  })
}

exports.downloadParsedData = (req, res) => {

  Parsing_data.findByPk(
    req.body.Pid
  ).then((Parsing_data) => {
    if (Parsing_data){
      res.download(Parsing_data.DataRef, "download.csv", function(err){
        if (err) {
          res.status(404).send('bad request');
        } else {
          console.log(res.headersSent);
        }
      })
    } else {
      res.status(400).json({
        "message": "no such parsing data"
      })
    }
  })
}

exports.getUserInfo = (req, res) => {
  User.findOne({
    where: {
      Uid: req.body.Uid
    }
  }).then((User) => {
    if (User) {
      AVG_SCORE.findByPk(
        req.body.Uid
      ).then((AVG_SCORE) => {
        if (AVG_SCORE){
          return res.status(200).json({
            "ID": User.ID,
            "Name": User.Name,
            "Gender": User.Gender,
            "UType": User.UType,
            "Bdate": User.Bdate,
            "PhoneNo": User.PhoneNo,
            "Addr": User.Addr,
            "Score": AVG_SCORE.Score
          })
        } else {
          return res.status(400).json({
            "message": "no such user"
          })
        }
      })
    } else {
      return res.status(400).json({
        "message": "no such user"
      })
    }
  })
}
