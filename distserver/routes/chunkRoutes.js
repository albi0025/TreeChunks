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

var chunkRoutes = _express2.default.Router();
var app = (0, _express2.default)();

chunkRoutes.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

chunkRoutes.post('/newChunk', function (req, res) {
  var chunk = new _chunk2.default();
  chunk.parentchunk = req.body.parentchunk;
  chunk.content = req.body.content;
  chunk.popularity = 0;

  chunk.save(function (err, chunk) {
    if (err) {
      res.send(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getStory/:chunkid', function (req, res, next) {
  _chunk2.default.findById(req.params.chunkid, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getChunks/:parentId', function (req, res) {
  _chunk2.default.find({ "parentchunk": req.params.parentId }).sort({ popularity: "descending" }).exec(function (err, chunks) {
    if (err) {
      res.send(err);
    } else {
      res.json(chunks);
    }
  });
});

exports.default = chunkRoutes;