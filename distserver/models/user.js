'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  subscribed: { type: Boolean, default: false },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }]
});

exports.default = mongoose.model('User', UserSchema);