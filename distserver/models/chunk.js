'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChunkSchema = new _mongoose2.default.Schema({
  parentchunk: _mongoose2.default.Schema.Types.ObjectId,
  children: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Chunk' }],
  content: String,
  popularity: Number,
  owner: { type: _mongoose2.default.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  tags: String
});

exports.default = _mongoose2.default.model('Chunk', ChunkSchema);