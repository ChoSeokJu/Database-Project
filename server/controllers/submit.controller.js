// const { Sequelize, QueryTypes } = require('sequelize');
// const parsing_data = require('../models/parsing_data');
// const User = require('../models/user');
// const sequelize = new Sequelize()

exports.submitContent = (req, res) => {
  console.log(`Submit user ${req.username} sent a request`);
  return res.status(200).send('Submit Content.');
};

// exports.systemAssessment = function(req, res, next){
//   /* automatic system assessment */ 
//   console.log(`Submit user ${req.username} submitted data`)
//   // req.dataref
//   // const  = await parsing_data.create({
//   // })
// };

// exports.assignEvaluator = function(req, res){
//   /* assigning evaluator */
//   const eval_cnt = await sequelize.query(
//     "SELECT COUNT(*) FROM `Freakswot.user` U WHERE (U.UType = 0)",
//     { type: QueryTypes.SELECT}
//   );
  
//   if(eval_cnt > 0){
//     const eval_user = await sequelize.query(
//       "SELECT U.Uid\
//         FROM `Freakswot.user` U WHERE U.UType = 0\
//         ORDER BY RAND()\
//         LIMIT 1",
//       { type: QueryTypes.SELECT }
//     );
//   }else{
//     res.status(204).send(`No evaluator`);
//   }
//   res.status(201).json({'eval': eval_user});
// };
