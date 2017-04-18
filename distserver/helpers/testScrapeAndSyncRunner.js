'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodbUri = require('mongodb-uri');

var _mongodbUri2 = _interopRequireDefault(_mongodbUri);

var _scrape = require('./scrape');

var _scrape2 = _interopRequireDefault(_scrape);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/petsdata';
var mongooseUri = _mongodbUri2.default.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
_mongoose2.default.connect(mongooseUri, options);

//
var url = "http://ws.petango.com/Webservices/adoptablesearch/" + "wsAdoptableAnimals.aspx?sex=All&agegroup=All&colnum=" + "1&authkey=1t4v495156y98t2wd78317102f933h83or1340ptjm31spd04d";

setInterval(scrapeAndSync, 3600000);

function scrapeAndSync() {
  _scrape2.default.scrapePetango(url, function (arr) {
    _sync2.default.syncPets(arr);
  });
}