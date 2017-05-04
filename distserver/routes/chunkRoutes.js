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
  chunk.owner = req.body.owner;
  chunk.date = req.body.date;

  chunk.save(function (err, chunk) {
    if (err) {
      res.send(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.put('/newChildChunk', function (req, res) {
  _chunk2.default.update({ _id: req.body.parentId }, { $push: { children: req.body.childId } }, function (err, raw) {
    if (err) {
      console.log("error adding child " + err);
    } else {
      res.json(req.body.childId);
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

// chunkRoutes.get('/fetchPreview/:chunkid', function(req, res, next) {
//   let charcount = 0;
//   let story = [];
//
//   Chunk.findById(req.params.chunkid, function(err, chunk){
//     if(err){
//       return next(err);
//     }else{
//       res.json(chunk);
//     }
//   });
//
//
//   .then(result => result.json())
//   .then(res => {
//     charcount += res.content.length;
//     story.push(<Link className="preview" style={{textDecoration: "none", fontSize: "14px"}} key={res._id} to= {{pathname: '/Story/' + this.props.tree._id + '/' + res._id}}>{res.content + " "}</Link>);
//     // story += res.content+ " ";
//     if(res.children.length > 0 && charcount < 400){
//       fetch("/getMostPopularChild/" + chunkId, {
//         method:"GET",
//         headers: {
//           "Accept": "application/json",
//           "Content-Type": "application/json"
//         }
//       })
//       .then(result => result.json())
//       .then(res => {
//         this.preparePreview(res._id, story, charcount);
//       });
//     } else {
//       if(charcount > 400){
//         story.pop();
//         let newContent= res.content.substr(0, (400-(charcount-res.content.length)));
//         story.push(<Link className="preview" style={{textDecoration: "none", fontSize: "14px"}} key={res._id} to= {{pathname: '/Story/' + this.props.tree._id + '/' + res._id}}>{newContent + "..."}</Link>);
//       }
//       this.setState({
//         mostPopularStory: story
//       });
//     }
//
//
//
//
// });

chunkRoutes.get('/getChunk/:chunkid', function (req, res, next) {
  _chunk2.default.findById(req.params.chunkid, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getMostPopularChild/:chunkid', function (req, res, next) {
  _chunk2.default.findById(req.params.chunkid).populate('children').exec(function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      var children = chunk.children;
      children.sort(function (childA, childB) {
        return childB.popularity - childA.popularity;
      });
      res.json(children[0]);
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

chunkRoutes.delete('/deleteChunk/:chunkid', function (req, res, next) {
  _chunk2.default.findByIdAndRemove(req.params.chunkid, function (err, chunk) {
    if (err) {
      return next(err);
    } else {
      console.log(chunk);
      _chunk2.default.update({ _id: chunk.parentchunk }, { $pull: { children: chunk._id } }, function (err, raw) {
        if (err) {
          console.log("error deleting child " + err);
        } else {
          res.json("chunk was deleted");
        }
      });
    }
  });
});

exports.default = chunkRoutes;