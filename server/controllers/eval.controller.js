const db = require('../models');
exports.evalContent = (req, res) => {
  console.log(`Eval user ${req.username} sent a request`);
  return res.status(200).send('Eval Content.');
};
