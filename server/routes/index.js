const user = require('./user');
const admin = require('./admin');
const eval = require('./eval');
const submit = require('./submit');
const account = require('./account');

module.exports = function (app) {
  app.use('/api/user/all', user);
  app.use('/api/user/admin', admin);
  app.use('/api/user/eval', eval);
  app.use('/api/user/submit', submit);
  app.use('/api/account', account);
};
