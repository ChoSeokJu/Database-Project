const db = require('../models');
const config = require('../config/auth.config');
const { json } = require('body-parser');
const { response } = require('express');


const User = db.user;
const Task = db.task;
const ogData = db.og_data_type;
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


exports.addOgData = (req, res) => {
  const {taskName, OGDataType, data, desc} = req.body
  Task.findOne({
    where:{TaskName: taskName},
    attributes : ['TableSchema']}).then((schema) => {
      if (schema) {
        ogData.create({
          Name: OGDataType,
          Mapping: data,
          TaskName: taskName,
          Schema: schema['TableSchema'],
          Desc: desc
        }).then((ogdata) => {
          res.status(200).json({
            message: '원본데이터가 생성 되었습니다'
          })
      })
    }
    else {
      return res.status(400).json({
        message: '해당 Task가 없습니다'
    })
  }
})
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


exports.getUserinfo = (req,res) => {
  const {per_page, page} = req.body;
  User.count().then((count) => 
  User.findAll({offset: per_page*(page-1), limit: per_page})
    .then((User) => {
      res.status(200).json({
        'data': User,
        'page': page,
        'totalCount': count})
  }))
};

exports.infoSearch = (req, res) => {
  const { search, searchCriterion, per_page, page} = req.body;
  User.count().then((count) => {
    if( searchCriterion == "ID") {
      User.findAll({
        where: {
          ID: {[Op.substring]: search}
        }
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
      }) 
    }
    else if( searchCriterion == "task") {
      User.hasMany(Parsing_data, {foreignKey: 'Sid'})
      Parsing_data.belongsTo(User, {foreignKey: 'Sid'})
      User.findAll({
        include: [{
          model: Parsing_data,
          attributes: [],
          where:{TaskName: {[Op.substring]: search}},
          required: true
        }],
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
      }) 
    }
    else if( searchCriterion == "Gender") {
      User.findAll({
        where: {
          Gender: {[Op.substring]: search}
        },
        offset: per_page*(page-1),
        limit: per_page
      }).then((result) => {
        return res.status(200).json({
          "result": result,
          "page":page,
          "totalCount":count
        })
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

exports.downloadTaskData = (req, res) => {
  const mock_taskDataRef = "task_data_table/2aaa5e831d47a5e3199ea2acdf2f334d"// this is mock
  const { taskName } = req.query 
  Task.findByPk(
    taskName
  ).then((Task)=>{
    if (Task){
      res.download(mock_taskDataRef, Task.TableName+".csv", function(err){     // this is mock
      // res.download(Task.TableRef, Task.TableName+".csv", function(err){
        if (err) {
          return res.status(404).json({
            "message": "Could not download"
          });
        } else {
          console.log(res.headersSent);
        }
      })
    } else {
      res.status(400).json({
        "message": "requested data does not exist"
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