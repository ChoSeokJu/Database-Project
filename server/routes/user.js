const { authJwt } = require('../utils');
const controller = require('../controllers/user.controller');

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/user/all', [authJwt.verifyToken], controller.userContent);

  app.get(
    '/api/user/admin',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminContent
  );

  app.get(
    '/api/user/eval',
    [authJwt.verifyToken, authJwt.isEval],
    controller.evalContent
  );

  app.get(
    '/api/user/submit',
    [authJwt.verifyToken, authJwt.isSubmit],
    controller.submitContent
  );
};
