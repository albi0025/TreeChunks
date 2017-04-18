'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PetSchema = new _mongoose2.default.Schema({
  url: String,
  animalId: Number,
  name: String,
  mainPhoto: String,
  species: String,
  breed: String,
  age: String,
  gender: String,
  size: String,
  color: String,
  spayNeuter: String,
  declawed: String,
  intakeDate: String,
  description: String,
  adopted: { type: Boolean, default: false },
  amountSponsored: { type: Number, default: 0 }
});

exports.default = _mongoose2.default.model('Pet', PetSchema);