exports.adminContent = (req, res) => {
  req.status(200).send('Admin Content.');
};

exports.evalContent = (req, res) => {
  req.status(200).send('Eval Content.');
};

exports.submitContent = (req, res) => {
  req.status(200).send('Submit Content.');
};
