const fs = require('fs');
const json2csv = require('json2csv').parse;
const csv = require('csvtojson');
const db = require('../models');
const { parsing_data, evaluate, user, og_data_type, task } = db;
const { finalScore } = require('../utils/generalUtils');

parsing_data.hasMany(evaluate, {foreignKey: 'Pid'})
evaluate.belongsTo(parsing_data, {foreignKey: 'Pid'})

user.hasMany(parsing_data, {foreignKey: 'Sid'})
parsing_data.belongsTo(user, {foreignKey: "Sid"})

og_data_type.hasMany(parsing_data, {foreignKey: 'Did'})
parsing_data.belongsTo(og_data_type, {foreignKey: 'Did'})

exports.evaluate = (req, res, next) => {
  /* insert evaluated value */
  // ! add timestamp
  // ! final score metric => add all numbers
  // ! add description in db
  const { Pid, score, description, PNP } = req.body

  evaluate.update({
    Score: score,
    Pass: PNP,
    Desc: description
  },
    {where : {
      Pid: Pid
    }
  }).then((evaluate_result)=>{
    if (evaluate_result){
      parsing_data.findOne({
        include: [{
          model: evaluate,
          required: true
        }],
        where : {
          Pid: Pid
        }
      }).then((parsing_data_result) => {
        if (parsing_data_result) {
          const { totalScore, Pass } = finalScore(parsing_data_result)
          req.body.Pass = Pass
          req.body.totalScore = totalScore
          parsing_data.update({
            FinalScore: totalScore,
            Appended: totalScore > 10
          },
            {where: {
              Pid: parsing_data_result.Pid
            }
          }).then((parsing_data) => {
            if (parsing_data){
              next()
            } else {
              return res.status(404).json({
                "message": "No such data"
              })
            }
          })
        } else {
          return res.status(404).json({
            "message": "No such data"
          })
        }
      })
    } else {
      return res.status(404).json({
        "message": "No such data"
      })
    }
  })
}

exports.saveToTaskTable = async function (req, res) {
  if (req.body.Pass == 0){
    return res.status(400).json({
      "message":  "the submitted data did not pass qualitative assessment"
    })
  } else if (req.body.totalScore < 10){
    return res.status(400).json({
      "message":  "the submitted data did not pass quantitative assessment"
    })
  }

  var p_data = await parsing_data.findOne({
    where: {
      Pid: req.body.Pid
    },
  })

  const { Sid, Did, TaskName, DataRef } = p_data

  var mapping = await og_data_type.findOne({
    where: {
      Did: Did
    },
    attributes: ["Mapping"]
  })
  
  var taskDataRef = await task.findOne({
    where: {
      TaskName: "Fundamentals",
      // TaskName: TaskName   // this is for deployment
    },
    attributes: ["TableRef"]
  })
  
  console.log(taskDataRef.TableRef)
  console.log(mapping.Mapping)

  const mock_filepath = "parseduploads/f5f7c6037bb2ed0ef7a0e1f78115f16c"

  const parsedData = await csv({noheader:false}).fromFile(mock_filepath)
  // const parsedData = await csv({noheader:false}).fromFile(DataRef)  // this is for deployment
  parsedData.forEach( (row) => {
    row["Sid"] = Sid
  })

  const parsedHeader = Object.keys(parsedData[0]) // or Object.values(mapping.Mapping)

  mock_taskDataRef = "task_data_table/f5f7c6037bb2ed0ef7a0e1f78115f16c"
  
  const write = async (fileName, fields, data) => {
    // ! take note that here, the data is being appended in the order in which they are written and not in the correct "mapping".
    // ! make sure that they are written in order when they are saved
    rows = json2csv(data, { header: false });
    const newRows = rows.replace(/[\\"]/g, "");
  
    await fs.appendFileSync(fileName, "\r\n");
    await fs.appendFileSync(fileName, newRows);
  };
  await write(mock_taskDataRef, parsedHeader, parsedData)
  // await write(taskDataRef, parsedHeader, parsedData)  // this is for deployment
  
  return res.status(200).json({
    "message": "Successfully appended"
  })
}

// exports.evalContent = (req, res) => {
//   console.log(`Eval user ${req.query.username} sent a request`);
//   var assignedData = []
//   user.findOne({
//     where : {
//       ID: req.query.username
//     }
//   }).then((user) => {
//     if (user) {
//       evaluate.findAll({
//         include: [{
//           model: parsing_data,
//           required: true
//         }],
//         where: {
//           Eid: user.Uid
//         },
//         offset: (parseInt(req.query.per_page) * (parseInt(req.query.page)-1)),
//         limit: parseInt(req.query.per_page)
//       }).then((evaluate) => {
//         if (evaluate){
//           return res.status(200).json({
//             "assignedData": evaluate
//           })
//         } else {
//           return res.status(404).json({
//               message: 'evaluator does not have any data assigned'
//             })
//         }
//       })
//     } else {
//       return res.status(404).json({
//         message: 'there is no evaluator yet'
//       })
//     }
    
//   })
// };


exports.evalContent = (req, res) => {
  const { username, per_page, page } = req.query
  user.findOne({
    where: {
      "ID": username
    },
    attributes: ["Uid"]
  }).then((user_id)=>{
    if (user_id) {
      console.log(user_id)

      parsing_data.findAll({
        include: [{
          model: evaluate,
          required: true
        }, {
          model: user,
          required: true
        }, {
          model: og_data_type,
          required: true
        }],
        // where: {
        //   // evaluate.Eid: user_id.Uid
        // },
        order: [
          ["FinalScore", "DESC"],
          ["TimeStamp", "DESC"]
        ],
        offset: per_page*(page-1), 
        limit: per_page
      }).then((parsing_data)=>{
        console.log(parsing_data)
      })
    } else {
      return res.status(404).json({
        "message": "Not Found"
      })
    }
  })
  
}