const db = require('../models');
const { parsing_data, evaluate, user } = db;

parsing_data.hasMany(evaluate, {foreignKey: 'Pid'})
evaluate.belongsTo(parsing_data, {foreignKey: 'Pid'})

exports.evaluate = (req, res, next) => {
  /* insert evaluated value */
  // ! add timestamp
  // ! final score metric
  evaluate.update({
    Score: req.body.Score,
    Pass: req.body.Pass,
    where : {
      Eid: req.body.Eid,
      Pid: req.body.Pid
    }
  }).then((evaluate)=>{
    parsing_data.findAll({
      include: [{
        model: evaluate,
        required: true
      }]
    }).then((parsing_data) => {
      if (parsing_data){
        parsing_data.forEach( (data) => {
          /* implement the final score metric*/

        })
      } else {
        return res.status(404).json({
          "message": "No such data"
        })
      }
    })
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
