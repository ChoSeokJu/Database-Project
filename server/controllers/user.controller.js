exports.userContent = (req, res) => {
  console.log(`User ${req.username} sent a request`);
  return res.status(200).send('A content for all users');
};

exports.adminContent = (req, res) => {
  console.log(`Admin user ${req.username} sent a request`);
  return res.status(200).send('Admin Content.');
};

exports.evalContent = (req, res) => {
  console.log(`Submit user ${req.username} sent a request`);
  return res.status(200).send('Eval Content.');
};

exports.submitContent = (req, res) => {
  console.log(`Submit user ${req.username} sent a request`);
  return res.status(200).send('Submit Content.');
};
