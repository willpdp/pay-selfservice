var response      = require(__dirname + '/utils/response.js').response;
var generateRoute = require(__dirname + '/utils/generate_route.js');
var transactions  = require('./controllers/transaction_controller.js');
var credentials   = require('./controllers/credentials_controller.js');
var login         = require('./controllers/login_controller.js');
var devTokens     = require('./controllers/dev_tokens_controller.js');
var auth          = require('./services/auth_service.js');
var querystring   = require('querystring');
var _             = require('lodash');
var paths         = require(__dirname + '/paths.js');
var csrf          = require('./middleware/csrf.js');

module.exports.generateRoute = generateRoute;
module.exports.paths = paths;

module.exports.bind = function (app) {

  auth.bind(app);

  app.get('/greeting', function (req, res) {
    var data = {'greeting': 'Hello', 'name': 'World'};
    response(req.headers.accept, res, 'greeting', data);
  });

  app.get('/style-guide', function (req, res) {
    response(req.headers.accept, res, 'style_guide');
  });

  //  TRANSACTIONS

  var tr = paths.transactions;
  app.get(tr.index, auth.enforce, csrf, transactions.transactionsIndex);
  app.post(tr.index, auth.enforce, transactions.transactionsIndex);
  app.get(tr.download, auth.enforce, csrf, transactions.transactionsDownload);
  app.get(tr.show, auth.enforce, csrf, transactions.transactionsShow);

  // CREDENTIALS

  var cred = paths.credentials;
  app.get(cred.index, auth.enforce, csrf, credentials.index);
  app.post(cred.index, auth.enforce, credentials.update);

  // LOGIN

  var user = paths.user;
  app.get(user.logIn, auth.login, login.logIn);
  app.get(user.logOut, login.logOut);
  app.get(user.callback, auth.callback, login.callback);
  app.get(user.loggedIn, auth.enforce, csrf, login.loggedIn);
  app.get(user.noAccess, auth.enforce,  csrf, login.noAccess);

  // DEV TOKENS

  var dt = paths.devTokens;
  app.get(dt.index, auth.enforce, csrf, devTokens.index);
  app.get(dt.show, auth.enforce, csrf, devTokens.show);
  app.post(dt.create, auth.enforce, csrf, devTokens.create);
  app.put(dt.update, auth.enforce, devTokens.update);
  app.delete(dt.delete, auth.enforce, devTokens.destroy);
};
