exports.evalContent = (req, res) => {
  console.log(`Submit user ${req.username} sent a request`);
  return res.status(200).send('Eval Content.');
};
