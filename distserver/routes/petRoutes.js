'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _pet = require('../models/pet');

var _pet2 = _interopRequireDefault(_pet);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var petRoutes = _express2.default.Router();

petRoutes.use(function (req, res, next) {
  console.log('something is happening!');
  res.setHeader('Content-Type', 'application/json');
  next();
});

petRoutes.route('/petsdata').get(function (req, res, next) {
  _pet2.default.find({ "adopted": "false" }, function (err, pets) {
    if (err) {
      next(err);
    } else {
      res.json(pets);
    }
  });
});

petRoutes.put('/pet/:animalId', function (req, res, next) {
  _pet2.default.update({ animalId: req.params.animalId }, { $inc: { amountSponsored: req.body.amountSponsored } }, function (err, pet) {
    if (err) {
      return next(err);
    } else {
      res.json(pet);
    }
  });
});

exports.default = petRoutes;