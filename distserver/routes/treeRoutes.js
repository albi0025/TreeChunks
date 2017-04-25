'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tree = require('../models/tree');

var _tree2 = _interopRequireDefault(_tree);

var _chunk = require('../models/chunk');

var _chunk2 = _interopRequireDefault(_chunk);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var treeRoutes = _express2.default.Router();
var app = (0, _express2.default)();

treeRoutes.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

treeRoutes.post('/newTree', function (req, res) {
  var chunk = new _chunk2.default();
  chunk.content = req.body.content;
  chunk.popularity = 0;
  chunk.owner = req.body.owner;
  chunk.date = req.body.date;

  chunk.save(function (err, chunk) {
    if (err) {
      res.send(err);
    } else {
      var tree = new _tree2.default();
      tree.title = req.body.title;
      tree.chunk = chunk._id;
      tree.cover = req.body.cover;
      tree.popularity = 0;
      tree.owner = req.body.owner;
      tree.date = req.body.date;
      tree.save(function (err, tree) {
        if (err) {
          res.send(err);
        } else {
          res.json(tree);
        }
      });
    }
  });
});

treeRoutes.get('/getTrees', function (req, res, next) {
  _tree2.default.find().sort({ popularity: "descending" }).populate('chunk').exec(function (err, trees) {
    if (err) {
      return next(err);
    } else {
      res.json(trees);
    }
  });
});

treeRoutes.get('/getChunk/:chunkid', function (req, res, next) {
  _chunk2.default.findById(req.params.chunkid, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      res.json(chunk);
    }
  });
});

treeRoutes.put('/adjustChunk', function (req, res, next) {
  _chunk2.default.update({ _id: req.body.chunkId }, { $inc: { popularity: req.body.adjustment } }, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      res.json(chunk);
    }
  });
});

treeRoutes.put('/adjustTree', function (req, res, next) {
  console.log(req.body.chunkId);
  _tree2.default.update({ _id: req.body.chunkId }, { $inc: { popularity: req.body.adjustment } }, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      res.json(chunk);
    }
  });
});

treeRoutes.get('/getTree/:treeId', function (req, res, next) {
  _tree2.default.findById(req.params.treeId).populate('chunk').exec(function (err, tree) {
    if (err) {
      return next(err);
    } else {
      res.json(tree);
    }
  });
});

exports.default = treeRoutes;