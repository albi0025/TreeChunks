'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodbUri = require('mongodb-uri');

var _mongodbUri2 = _interopRequireDefault(_mongodbUri);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//We are starting this with two dogs in the database: Baltazaar and Loki.
//In the scrape we are sending two dog objects: Baltazaar and Loretta.
//Loretta does not exist in the database and needs to be added.
//Loki is not in the scrape and needs to be removed from the database.
//Baltazaar is in both the scrape and the DB so he should stay put.

_mongoose2.default.Promise = global.Promise;
var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/petsdata';
var mongooseUri = _mongodbUri2.default.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
_mongoose2.default.connect(mongooseUri, options);
var syncRunner = require('./sync');
var Pet = require('../models/pet');

//This is Baltazaar and he is in the database and in the scrape
var baltazaar = { animalId: 34790773,
  mainPhoto: '//media.petango.com/sms/photos/1095/11d1877d-8611-4f53-90db-0621d709b317.jpg',
  name: 'Baltazaar',
  species: 'Dog',
  breed: 'Akita/Mix',
  age: '1 year  1 month 16 days',
  gender: 'Male',
  size: 'Large',
  color: 'Tan/Black',
  spayNeuter: true,
  declawed: 'No',
  intakeDate: '2/5/2017',
  description: 'Let me introduce myself, my name is Baltazaar.' };

//Loki only exists in the database not in the scrape
var loki = { animalId: 34680077,
  mainPhoto: '//media.petango.com/sms/photos/1095/ab3b6f68-dbc5-42c5-bd23-9d40922ec9c6.jpg',
  name: 'Loki',
  species: 'Dog',
  breed: 'Shepherd/Chinese Shar-Pei',
  age: '3 years  1 month 3 days',
  gender: 'Male',
  size: 'Large',
  color: 'Red/Brown',
  spayNeuter: true,
  declawed: 'No',
  intakeDate: '2/17/2017',
  description: 'Woof',
  adopted: false
};

var loretta = { animalId: 33927386,
  mainPhoto: '//media.petango.com/sms/photos/1095/16b208ca-e425-4994-9b8e-d9aab96d0ddf.jpg',
  name: 'Loretta(Ariel)',
  species: 'Dog',
  breed: 'Great Pyrenees/Mix',
  age: '2 years 4 months 15 days',
  gender: 'Female',
  size: 'Large',
  color: 'White',
  spayNeuter: false,
  declawed: 'No',
  intakeDate: '3/10/2017',
  description: 'I am super cute'
};

var scrapeArray = [baltazaar, loretta];

// Delete every record from the database before we make a test run
Pet.remove({}, function (err, pet) {
  new Pet(baltazaar).save(function (err, pet, next) {
    new Pet(loki).save(function (err, pet, next) {
      syncRunner.syncPets(scrapeArray);
    });
  });
});