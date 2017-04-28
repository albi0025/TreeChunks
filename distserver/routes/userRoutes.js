'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

var _user2 = require('../models/user');

var _user3 = _interopRequireDefault(_user2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = _express2.default.Router();
var app = (0, _express2.default)();

userRoutes.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

userRoutes.post('/newUser', function (req, res) {
  var token = req.headers.authorization.replace("Bearer", "").trim();
  var decoded = _jsonwebtoken2.default.decode(token);
  _user3.default.findOne({ email: decoded.email }, function (err, user, next) {
    if (err) {
      return next(err);
    } else {
      if (user == null) {
        var _user = new _user3.default();
        _user.name = decoded.given_name;
        _user.email = decoded.email;
        _user.save(function (err, user) {
          if (err) {
            res.send(err);
          } else {
            res.json(user);
          }
        });
      } else {
        res.json(user);
      }
    }
  });
});

userRoutes.put('/flagUpChunk', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $push: { upchunks: req.body.chunkId } }, function (err, raw) {
    if (err) {
      console.log("error up chunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/unFlagUpChunk', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $pull: { upchunks: req.body.chunkId } }, function (err, raw) {
    if (err) {
      console.log("error un chunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/flagDownChunk', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $push: { downchunks: req.body.chunkId } }, function (err, raw) {
    if (err) {
      console.log("error downchunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/unFlagDownChunk', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $pull: { downchunks: req.body.chunkId } }, function (err, raw) {
    if (err) {
      console.log("error undownchunking " + err);
    } else {
      res.json(req.body.chunkId);
    }
  });
});

userRoutes.put('/followTree', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $push: { trees: req.body.treeId } }, function (err, raw) {
    if (err) {
      console.log("error following tree " + err);
    } else {
      res.json(req.body.treeId);
    }
  });
});

userRoutes.put('/unFollowTree', function (req, res) {
  _user3.default.update({ _id: req.body.userId }, { $pull: { trees: req.body.treeId } }, function (err, raw) {
    if (err) {
      console.log("error unfollowing tree " + err);
    } else {
      res.json(req.body.treeId);
    }
  });
});

userRoutes.get('/decode', function (req, res, next) {
  var token = req.headers.authorization.replace("Bearer", "").trim();
  var decoded = _jsonwebtoken2.default.decode(token);
  res.json({ decoded: decoded, date: new Date().getTime() });
});

//---------Start middleware--------------------

//route middleware to verify a token
userRoutes.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = false;

  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer", "").trim();
  }
  if (token) {
    var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token;
    (0, _request2.default)(url, function (err, tokenResponse, body) {
      // if (body.error_description == "Invalid Value") {
      if (JSON.parse(body).error_description) {
        if (document) {
          document.cookie = "token=";
        }
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        next();
      }
    });
  } else {
    //if there is no token
    //return an error
    return res.status(403).send({
      success: false,
      message: 'no token provided'
    });
  }
});
//---------End middleware--------------------

userRoutes.get('/getUser', function (req, res, next) {
  var token = req.headers.authorization.replace("Bearer", "").trim();
  var decoded = _jsonwebtoken2.default.decode(token);
  _user3.default.findOne({ email: decoded.email }, function (err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
});

exports.default = userRoutes;