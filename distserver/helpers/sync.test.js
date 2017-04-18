'use strict';

var _chai = require('chai');

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Sync', function () {
  describe('listDiff', function () {
    it('works', function () {
      var a1 = [{ animalId: 1 }, { animalId: 2 }, { animalId: 3 }];
      var a2 = [{ animalId: 2 }, { animalId: 3 }, { animalId: 4 }];
      (0, _chai.expect)(_sync2.default.listDiff(a1, a2)).to.eql([{ animalId: 1 }]);
      (0, _chai.expect)(_sync2.default.listDiff(a2, a1)).to.eql([{ animalId: 4 }]);
    });
  });
});