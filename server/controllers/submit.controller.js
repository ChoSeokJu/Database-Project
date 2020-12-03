const db = require('../models');
const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const { nowDate, csvSanityCheck, typeCheck } = require("../utils/generalUtils");
const { user, parsing_data, evaluate, works_on, AVG_SCORE, og_data_type, task } = db;
const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect:'mysql',
})

exports.submitContent = (req, res, next) => {
  console.log(`Submit user ${req.body.username} submitted data`)
  if(!req.file){
    return res.status(405).json({
      message: 'Wrong file uploaded. Please upload in .csv format'
    })
  }
  var taskCol
  og_data_type.findOne({
    where: {
      TaskName: req.body.TaskName,
      Name: req.body.ogDataName
    }
  }).then((og_data_type) => {
    if (og_data_type) {
      task.findOne({
        where: {
          TaskName: req.body.TaskName
        }
      }).then((task)=>{
        req.body.taskDataTableRef = task.TableRef
        req.body.Mapping = og_data_type.Mapping
        req.body.ogSchema = og_data_type.Schema
        next()
      })
      
    } else {
      return res.status(400).json({
        "message": "such og_data_type does not exist"
      })
    }
  })
};

exports.quantAssess = async function (req, res, next){
  const data = await csv({noheader:false}).fromFile(req.file.path)  // set this to be true for csvSanityCheck
  const taskData = await csv({noheader:true}).fromFile(req.body.taskDataTableRef)
  console.log(taskData);
  // const taskDataHeader = taskData

  const dataHeader = Object.keys(data[0]);
  const { Mapping, ogSchema } = req.body
  if (JSON.stringify(dataHeader.sort()) != JSON.stringify(Object.keys(ogSchema))){
    // reject if ogSchema keys do not match dataHeader (order does not matter)
    return res.status(404).json({
      "message": "submitted csv file does not match the schema defined in original data type"
    })
  }

  var dupCount = rowCount = nullCount = 0;
  var counts = {}
  var parsedData = []
  
  console.log(data);
  taskCol = await Object.keys(Mapping)
  console.log(taskCol)
  data.forEach( (row) => {
      rowCount ++;
      var parsedRows = {}
      taskCol.forEach((col)=>{
        if (!typeCheck(ogSchema[Mapping[col]], row[Mapping[col]])){
          // reject if data contains wrong datatype
          return res.status(404).json({
            "message": "submitted csv file has wrong data type"
          })
        }
        if(row[Mapping[col]] == "null" || row[Mapping[col]] === undefined){
            nullCount ++;
        }
        parsedRows[col] = row[Mapping[col]]
      })
      counts[Object.values(row)] = (counts[Object.values(row)] || 0) + 1
      parsedData.push(parsedRows)
  })

  Object.values(counts).forEach( (count) => {
      if (count > 1) {
          dupCount = dupCount + (count-1)
      }
  })
  req.body.TotalTupleCnt = rowCount
  req.body.DuplicatedTupleCnt = dupCount
  req.body.NullRatio = (nullCount) / (rowCount * taskCol.length)
  console.log(parsedData)
  parsedData = json2csv(parsedData, { header: true })
  console.log(`parsed${req.file.path}`)
  await fs.writeFileSync(`parsed${req.file.path}`, parsedData);
  next();
}

exports.systemAssessment = function(req, res, next){
  /* automatic system assessment */ 
  // ! Term 

  var submitSid, submitDid;
  
  /* find submitter Sid */
  user.findOne({
    where: {
      ID: req.body.username
    }
  }).then((user) => {
    if (user){
      submitSid = user.Uid
      parsing_data.findAndCountAll({
        where: {
          Sid: user.Uid
        }
      }).then((p_data)=>{
        if (p_data){
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
                    "FinalScore": null,
                    "TaskName": req.body.TaskName,
                    "SubmitCnt": p_data.count + 1,
                    "TotalTupleCnt": req.body.TotalTupleCnt,
                    "DuplicatedTupleCnt": req.body.DuplicatedTupleCnt,
                    "NullRatio": req.body.NullRatio,
                    "Term": nowDate("DateTime"),
                    "DataRef": req.file.path,
                    "TimeStamp": nowDate("DateTime"),
                    "Did": submitDid,
                    "Sid": submitSid
              }).then((parsing_data) => {
                if(parsing_data){
                  next();
                } else {
                  return res.status(400).json({
                    "message":`failed to insert data into parsing_data`
                  })
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
            "message": "such user did not submit any"
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
  /* the logic below does not allow that */
  // ! Pid obtained by max (most recent)
  parsing_data.findOne({
    attributes: [[
      sequelize.fn('MAX', sequelize.col('Pid')), 'Pid'
    ]],
    raw: true,
  }).then((parsing_data) => {
    if(parsing_data){
      user.findOne({
        where: {
          UType: 'eval',
        },
        order: sequelize.random(),
      }).then((user) => {
        if (user) {
          evaluate.create({
            "Eid": user.Uid,
            "Pid": parsing_data.Pid
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
    } else {
      return res.status(404).json({
        "message":`No parsing_data exists in database`
      })
    }
  })
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
        Permit: 1
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
  /* get average score and total tuple cnt*/
  user.findOne({
    where: {
      ID: req.query.username
    }
  }).then((user) => {
    if (user) {
      parsing_data.count({
        where: {
          Sid: user.Uid
        },
      }).then((p_data) => {
        if (p_data) {
          AVG_SCORE.findByPk(
            user.Uid
          ).then((AVG_SCORE) => {
            if (AVG_SCORE){
              parsing_data.findOne({
                attributes: [[
                  sequelize.fn('SUM', sequelize.col('TotalTupleCnt')), 'TotalTupleCnt'
                ]],
                where: {
                  Sid: user.Uid,
                  Appended: 1
                },
                raw: true,
              }).then((parsing_data)=>{
                if (parsing_data){
                  return res.status(200).json({
                    "Score": AVG_SCORE.Score,
                    "SubmittedDataCnt": p_data,
                    "TaskDataTableTupleCnt": parsing_data.TotalTupleCnt
                  })
                } else {
                  return res.status(400).json({
                    "message": "no such data"
                  })
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
