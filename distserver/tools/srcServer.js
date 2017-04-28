'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpackConfig = require('../webpack.config.dev');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _open = require('open');

var _open2 = _interopRequireDefault(_open);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodbUri = require('mongodb-uri');

var _mongodbUri2 = _interopRequireDefault(_mongodbUri);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _configAuth = require('./configAuth');

var _configAuth2 = _interopRequireDefault(_configAuth);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _userRoutes = require('../routes/userRoutes');

var _userRoutes2 = _interopRequireDefault(_userRoutes);

var _treeRoutes = require('../routes/treeRoutes');

var _treeRoutes2 = _interopRequireDefault(_treeRoutes);

var _chunkRoutes = require('../routes/chunkRoutes');

var _chunkRoutes2 = _interopRequireDefault(_chunkRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

var port = process.env.PORT || 3000;
var app = (0, _express2.default)();
var compiler = (0, _webpack2.default)(_webpackConfig2.default);
var router = _express2.default.Router();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

// use morgan to log requests to the console
app.use((0, _morgan2.default)('dev'));

//MongoDB -- Mongoose Import - Start
_mongoose2.default.Promise = global.Promise;

var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/treeChunks';
var mongooseUri = _mongodbUri2.default.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

_mongoose2.default.connect(mongooseUri, options);
//End

var PROD = process.env.NODE_ENV === 'production';

app.use(_express2.default.static('src/public'));

if (PROD) {
  app.use('/', _express2.default.static('dist'));
} else {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: _webpackConfig2.default.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
}

app.get('/public/images/treechunk.ico', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../src/public/images/treechunk.ico'));
});

app.use('/', _treeRoutes2.default);
app.use('/', _chunkRoutes2.default);
app.use('/', _userRoutes2.default);

// app.use('/user', userRoutes);

app.get('/public/images/treechunk.ico', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../src/public/images/treechunk.ico'));
});

app.get('*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../src/public/index.html'));
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else if (!PROD) {
    console.log(('Starting app in dev mode, listening on port ' + port).green);
    (0, _open2.default)('http://localhost:' + port);
  } else {
    console.log('Starting app in production mode, listening on port ' + port);
  }
});