const db = require('../models');
const csv = require('csvtojson');
const { nowDate, csvSanityCheck } = require("../utils/generalUtils");
const { user, parsing_data, evaluate, works_on, AVG_SCORE, og_data_type, task } = db;
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect:'mysql',
})

exports.submitContent = (req, res, next) => {
  console.log(`Submit user ${req.body.username} submitted data`)
  console.log(`where is the problem ${req.file}`)
  if(!req.file){
    return res.status(405).json({
      message: 'Wrong file uploaded. Please upload in .csv format'
    })
  } else {
    if (!csvSanityCheck(req.file.path)){
      return res.status(405).json({
        message: 'Submitted csv file is in wrong format'
      })
    }
  }
  var taskCol
  og_data_type.findOne({
    where: {
      TaskName: req.body.TaskName,
      Name: req.body.ogDataName
    }
  }).then((og_data_type) => {
    if (og_data_type) {
      taskCol = Object.values(og_data_type.Mapping)
      req.body.taskCol = taskCol
      next()
    } else {
      return res.status(400).json({
        "message": "such og_data_type does not exist"
      })
    }
  })
};

exports.quantAssess = async function (req, res, next){
  const data = await csv({noheader:false}).fromFile(req.file.path)
  var dupCount = rowCount = nullCount = 0;
  var counts = {}
  console.log(data);
  taskCol = await req.body.taskCol
  console.log(taskCol)
  data.forEach( (row) => {
      rowCount ++;
      req.body.taskCol.forEach((col)=>{
          if(row[col] == "null" || row[col] === undefined){
              nullCount ++;
          }
      })
      counts[Object.values(row)] = (counts[Object.values(row)] || 0) + 1
  })

  Object.values(counts).forEach( (count) => {
      if (count > 1) {
          dupCount = dupCount + (count-1)
      }

  })
  req.body.TotalTupleCnt = rowCount
  req.body.DuplicatedTupleCnt = dupCount
  req.body.NullRatio = (nullCount) / (rowCount * taskCol.length)
  next();
}

var pid = 134
exports.systemAssessment = function(req, res, next){
  /* automatic system assessment */ 
  // ! SubmitCnt
  // ! Term 
  // ! Pid --> how to get this and pass it on to "assignEvaluator"

  var submitSid, submitDid;
  
  /* find submitter Sid */
  user.findOne({
    where: {
      ID: req.body.username
    }
  }).then((user) => {
    if (user){
      submitSid = user.Uid

  /* find submitted Did */
      og_data_type.findOne({
        where: {
          Name: req.body.ogDataName,
          TaskName: req.body.TaskName
        }
      }).then((og_data_type) => {
        if (og_data_type){
          submitDid = og_data_type.Did
          parsing_data.create({
                "Pid": pid,
                "FinalScore": null,
                "TaskName": req.body.TaskName,
                "SubmitCnt": 1,
                "TotalTupleCnt": req.body.TotalTupleCnt,
                "DuplicatedTupleCnt": req.body.DuplicatedTupleCnt,
                "NullRatio": req.body.NullRatio,
                "Term": nowDate("DateTime"),
                "DataRef": req.file.path,
                "TimeStamp": nowDate("DateTime"),
                "Did": submitDid,
                "Sid": submitSid
          }).then((parsing_data) => {
            if(!parsing_data){
              return res.status(400).json({
                "message":`failed to insert data into parsing_data`
              })
            } else {
              next();
            }
          })
        } else {
          return res.status(400).json({
            "message": "such og_data_type does not exist"
          })
        }
      })

    } else {
      return res.status(400).json({
        "message": "such user does not exist"
      })
    }
  })
};

exports.assignEvaluator = function(req, res){
  /* assigning evaluator */
  /* if there is no evaluator, can they still upload? */
  /* the logic below allows that */
  console.log("We did it till here!")
  user.findOne({
    where: {
      UType: 'eval',
    },
    order: sequelize.random(),
  }).then((user) => {
    if (user) {
      evaluate.create({
        "Eid": user.Uid,
        "Pid": pid
      }).then((evaluate)=>{
        if (evaluate){
          return res.status(200).json({
            "message":`successfully added data into parsing_data and allocated an evaluator`
          })
        }
      })
    } else {
      return res.status(206).json({
        "message":`Data was added to parsing_data but there is no evaluator to be allocated`
      })
    }
  });
  
};

exports.getTaskList = function(req, res) {
  var taskList = []
  user.findOne({
    where:{
      ID: req.query.username
    }
  }).then((user) => {
    works_on.findAll({
      where:{
        Sid: user.Uid,
        Permit: 0
      },
      offset: (parseInt(req.query.per_page) * (parseInt(req.query.page)-1)),
      limit: parseInt(req.query.per_page)
    }).then((works_on) => {
      if(works_on){
        works_on.forEach( (data) => {
          taskList.push(data.TaskName)
        })
        return res.status(200).json({
          "TaskNameList": taskList
        })
      } else {  
        return res.status(400).json({
          message: "User has not been approved any task"
        })
      }
    })
  })
}

exports.submitApply = function(req, res) {
  user.findOne({
    where: {
      ID: req.body.username
    }
  }).then((user)=>{
    works_on.create({
      Sid: user.Uid,
      TaskName: req.body.TaskName
    }).then((works_on) => {
      if (works_on){
        return res.status(200).json({
          message: "Successfully requested"
        })
      } else{
        return res.status(500).json({
          message: "Request Failed"
        })
      }
    })
  })
}

exports.getAvgScore = function(req, res) {
  /* get average score */
  // ! TaskDataTableTupleCnt

  user.findOne({
    where: {
      ID: req.query.username
    }
  }).then((user) => {
    if (user) {
      parsing_data.count({
        where: {
          Sid: user.Uid
        }
      }).then((parsing_data) => {
        if (parsing_data) {
          AVG_SCORE.findByPk(
            user.Uid
          ).then((AVG_SCORE) => {
            if (AVG_SCORE){
              return res.status(200).json({
                "Score": AVG_SCORE.Score,
                "SubmittedDataCnt": parsing_data,
                // "TaskDataTableTupleCnt": 
              })
            } else {
              return res.status(400).json({
                "message": "such og_data_type does not exist"
              })
            }
          })
        } else {
          return res.status(400).json({
            "message": "user did not submit any parsing_data"
          }) 
        }
      })
    } else {
      return res.status(400).json({
        "message": "such user does not exist"
      }) 
    }
  }) 
}
exports.getOgData = (req, res) => {
  const {taskName} = req.query
  og_data_type.findAll({
    attributes: ['Did', 'Name'],
    where: {TaskName: taskName}})
    .then((result) => {
      res.status(200).json({
        data: result
      })
    })
};