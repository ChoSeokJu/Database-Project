const db = require('../models');
const {nowDate, quantAssess} = require("../utils/generalUtils");
const user = db.user;
const parsing_data = db.parsing_data;
const evaluate = db.evaluate;

exports.submitContent = (req, res) => {
  console.log(`Submit user ${req.username} sent a request`);
  return res.status(200).send('Submit Content.');
};

// exports.systemAssessment = function(req, res, next){
//   /* automatic system assessment */ 
//   console.log(`Submit user ${req.username} submitted data`)
//   req.dataref
// };

var pid = 31
exports.assignEvaluator = function(req, res){
  /* assigning evaluator */
  /* if there is no evaluator, can they still upload? */
  /* the logic below allows that */
  
  parsing_data.create({
      //   "Pid": 100,
      //   "FinalScore": req.body.FinalScore,
      //   "TaskName": req.body.TaskName,
      //   "SubmitCnt": req.body.SubmitCnt,
      //   "TotalTupleCnt": req.body.TotalTupleCnt,
      //   "DuplicatedTupleCnt": req.body.DuplicatedTupleCnt,
      //   "NullRatio": req.body.NullRatio,
      //   "Term": ,
      //   "DataRef": ,
      //   "TimeStamp": ,
      //   "Did": ,
      //   "Sid": 
    "Pid": pid,
    "FinalScore": 10,
    "TaskName": "Example",
    "SubmitCnt": 1,
    "TotalTupleCnt": 10,
    "DuplicatedTupleCnt": 5,
    "NullRatio": 0.1,
    "Term": nowDate("Time"),
    "DataRef": "some reference",
    "TimeStamp": nowDate("DateTime"),
    "Did": 0,
    "Sid": 10
  }).then((parsing_data) => {
    if(!parsing_data){
      res.status(400).send(`failed to insert data into parsing_data`)
      return
    }
  })

  user.findOne({
    where: {
      UType: 'eval',
    },
  }).then((user) => {
    if (user) {
      evaluate.create({
        "Eid": user.Uid,
        "Pid": pid
      }).then((evaluate)=>{
        if (evaluate){
          res.status(200).send(`successfully added data into parsing_data and allocated an evaluator`)
        }
      })
    } else {
      res.status(206).send(`Data was added to parsing_data but there is no evaluator to be allocated`);
    }
  });
  
};
