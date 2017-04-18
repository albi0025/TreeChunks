'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pet = require('../models/pet');

var _pet2 = _interopRequireDefault(_pet);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _mailSend = require('./mailSend');

var _mailSend2 = _interopRequireDefault(_mailSend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sync = {}; //You scrape petango and you get a pet object back.
//You want to look that pet up in your database by animalId.


sync.syncPets = function (scrapedPets) {
  var scrapedAnimalIds = scrapedPets.map(function (pet) {
    return pet.animalId;
  });
  _pet2.default.find({ animalId: { $in: scrapedAnimalIds } }, function (error, docs) {
    // docs are pets from the scrape that already exist in the database
    // scrapedPets are all animals from the scrape
    // scrapedPets - docs are NEW pets, not yet in the database
    // listDiff(scrapedPets, docs) === scrapedPets - docs

    var newPets = this.listDiff(scrapedPets, docs);
    this.saveNewPets(newPets);
    this.updatePets(scrapedPets);
    this.emailRecipients(newPets);
  }.bind(this));

  //For unadopted pets, if they are no longer in the scrape, flag them as adopted
  _pet2.default.find({ adopted: false }, function (err, docs) {
    for (var i = 0; i < docs.length; i++) {
      if (scrapedAnimalIds.indexOf(docs[i].animalId) === -1) {
        this.adoptedTrue(docs[i]);
      }
    }
  }.bind(this));
};

sync.listDiff = function (a1, a2) {
  return a1.filter(function (pet) {
    for (var i = 0; i < a2.length; i++) {
      if (a2[i].animalId === pet.animalId) {
        return false;
      }
    }
    return true;
  });
};

sync.updatePets = function (scrapedPets) {
  for (var i = 0; i < scrapedPets.length; i++) {
    _pet2.default.update({ animalId: scrapedPets[i].animalId }, { $set: { mainPhoto: scrapedPets[i].mainPhoto, description: scrapedPets[i].description } }, function (err) {});
  }
};

sync.emailRecipients = function (newPets) {
  _user2.default.find({ subscribed: true }, 'email', function (err, users) {
    var recipients = users.map(function (user) {
      return user.email;
    });
    (0, _mailSend2.default)(newPets, recipients);
  });
};

sync.saveNewPets = function (pets) {
  _pet2.default.insertMany(pets, function (err, docs) {
    console.log(docs.length + " pets were saved");
  });
};

//look up a the pet object by id in the database and changes adopted to true
sync.adoptedTrue = function (pet) {
  _pet2.default.update({ _id: pet.id }, { $set: { adopted: true } }, function (err) {
    console.log(pet.name + " was adopted! :)");
  });
};

exports.default = sync;