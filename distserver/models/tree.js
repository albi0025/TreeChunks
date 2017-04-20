'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeSchema = new _mongoose2.default.Schema({
  title: String,
  chunk: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Chunk' },
  cover: String,
  popularity: Number
});

exports.default = _mongoose2.default.model('Tree', TreeSchema);