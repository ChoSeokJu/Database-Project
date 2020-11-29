const db = require('../models');

const { parsing_data, evaluate } = db;

// exports.evalContent = (req, res) => {
//   console.log(`Eval user ${req.username} sent a request`);

//   evaluate.findAll({
//     where : {
//       Eid: req.body.Uid
//     },
//   }).then((evaluate) => {
//     if(!evaluate){
//       return res.status(404).json({
//         message: 'evaluator does not have any data assigned'
//       })
//     } else {
//       parsing_data.findAll({
//         where: {
//           Pid: evaluate.Pid
//         }
//       }).then((parsing_data) => {
//         return res.status(200).json({
//           "TaskName"
//         })
//       })
//     }
//   })
//   return res.status(200).send('Eval Content.');
// };


exports.example = (req, res) => {
  console.log(`LOOOOOOK HERE ${req.body}`);
  // console.log(`LLLOOOOOOK HERE ${req.body.keys()}`)
  evaluate.findAll({
    where : {
      Eid: 5
    },
  }).then((evaluate) => {
    if(!evaluate){
      return res.status(404).json({
        message: 'evaluator does not have any data assigned'
      })
    } else {
      parsing_data.findAll({
        where: {
          Pid: evaluate.Pid
        }
      }).then((parsing_data) => {
        return res.status(200).json({
          "returned":parsing_data.Pid
        })
      })
    }
  })
}