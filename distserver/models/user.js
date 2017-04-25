'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
  name: String,
  email: String,
  upchunks: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Chunk' }],
  downchunks: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Chunk' }],
  trees: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Tree' }]
});

exports.default = _mongoose2.default.model('User', UserSchema);