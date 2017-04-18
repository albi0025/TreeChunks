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

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _configAuth = require('../tools/configAuth');

var _configAuth2 = _interopRequireDefault(_configAuth);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = _express2.default.Router();
var app = (0, _express2.default)();

userRoutes.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.set('superSecret', _configAuth2.default.secret);

userRoutes.post('/newUser', function (req, res) {
  var user = new _user2.default();
  user.name = req.body.name;
  user.password = _passwordHash2.default.generate(req.body.password);
  user.email = req.body.email;
  user.subscribed = req.body.subscribed;

  user.save(function (err, user) {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
userRoutes.post('/authenticate', function (req, res) {
  // find the user
  _user2.default.findOne({
    email: req.body.email
  }, function (err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (!_passwordHash2.default.verify(req.body.password, user.password)) {
        res.json({
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found and password is right
        // create a token
        var token = _jsonwebtoken2.default.sign(user, app.get('superSecret'), {
          // expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          token: token
        });
      }
    }
  });
});
//---------Start middleware--------------------

// route middleware to verify a token
userRoutes.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers.authorization.replace("Bearer", "").trim();
  // decode token
  if (token) {
    // verifies secret and checks exp
    _jsonwebtoken2.default.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        // req.decoded = decoded;
        req.currentUser = decoded._doc;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

//---------End middleware--------------------

userRoutes.post('/pets', function (req, res) {
  var id = req.body.id;
  _user2.default.update({ _id: req.currentUser._id }, { $push: { pets: id } }, function (err, raw) {
    if (err) {
      console.log("error saving favorite pet " + err);
    } else {
      res.json({});
    }
  });
});

userRoutes.delete('/pets/:id', function (req, res, next) {
  var id = req.params.id;
  console.log(id);
  _user2.default.update({ _id: req.currentUser._id }, { $pull: { pets: id } }, function (err, gif) {
    if (err) {
      return next(err);
    } else {
      res.json({ title: 'Pet was deleted' });
    }
  });
});

userRoutes.get('/userData', function (req, res, next) {
  _user2.default.findOne({ _id: req.currentUser._id }).populate('pets').exec(function (err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
});

exports.default = userRoutes;