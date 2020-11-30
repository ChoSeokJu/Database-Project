const db = require('../models');
const { parsing_data, evaluate, user } = db;
const { finalScore } = require('../utils/generalUtils')

parsing_data.hasMany(evaluate, {foreignKey: 'Pid'})
evaluate.belongsTo(parsing_data, {foreignKey: 'Pid'})

exports.evaluate = (req, res) => {
  /* insert evaluated value */
  // ! add timestamp
  // ! final score metric => currently mock
  evaluate.update({
    Score: req.body.Score,
    Pass: req.body.Pass},
    {where : {
      Eid: req.body.Uid,
      Pid: req.body.Pid
    }
  }).then((evaluate_result)=>{
    console.log("UPTO HERE")
    if (evaluate_result){
      parsing_data.findOne({
        include: [{
          model: evaluate,
          required: true
        }],
        where : {
          Pid: req.body.Pid
        }
      }).then((parsing_data_result) => {
        if (parsing_data_result) {
          parsing_data.update({
            FinalScore: finalScore(parsing_data_result)},
            {where: {
              Pid: parsing_data_result.Pid
            }
          }).then((parsing_data) => {
            if (parsing_data){
              // next()
              return res.status(200).json({
                "message": "this is mock success. erase this later"
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
    } else {
      return res.status(404).json({
        "message": "No such data"
      })
    }
  })
}

exports.saveToTaskTable = async function (req, res, next) {
  // ! standards for adding to the tasktable
}

exports.evalContent = (req, res) => {
  console.log(`Eval user ${req.query.username} sent a request`);
  var assignedData = []
  user.findOne({
    where : {
      ID: req.query.username
    }
  }).then((user) => {
    if (user) {
      evaluate.findAll({
        include: [{
          model: parsing_data,
          required: true
        }],
        where: {
          Eid: user.Uid
        },
        offset: (parseInt(req.query.per_page) * (parseInt(req.query.page)-1)),
        limit: parseInt(req.query.per_page)
      }).then((evaluate) => {
        if (evaluate){
          return res.status(200).json({
            "assignedData": evaluate
          })
        } else {
          return res.status(404).json({
              message: 'evaluator does not have any data assigned'
            })
        }
      })
    } else {
      return res.status(404).json({
        message: 'there is no evaluator yet'
      })
    }
    
  })
};
