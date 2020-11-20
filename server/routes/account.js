const { verifySignUp } = require('../utils');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/account/signup',
    [
      verifySignUp.checkValidUsername,
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkValidPassword,
    ],
    controller.signup
  );

  app.post('/api/account/signin', controller.signin);
};
