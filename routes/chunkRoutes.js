import React from 'react';
import Tree from '../models/tree';
import Chunk from '../models/chunk';
import express from 'express';

let chunkRoutes = express.Router();
let app = express();

chunkRoutes.use(function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  next();
});

chunkRoutes.post('/newChunk', function(req, res) {
  let chunk = new Chunk();
  chunk.parentchunk = req.body.parentchunk;
  chunk.content = req.body.content;
  chunk.popularity = 0;
  chunk.owner = req.body.owner;
  chunk.date = req.body.date;

  chunk.save(function(err, chunk){
    if(err){
      res.send(err);
    } else {
      res.json(chunk);
    }
  });
});

chunkRoutes.put('/newChildChunk', function(req, res) {
  Chunk.update({ _id: req.body.parentId }, { $push: { children: req.body.childId }}, function(err, raw) {
    if(err){
      console.log("error adding child " + err);
    } else {
      res.json(req.body.childId);
    }
  });
});

chunkRoutes.get('/getStory/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid, function(err, chunk){
    if(err){
      return next(err);
    }else{
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

chunkRoutes.get('/getChunk/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid, function(err, chunk){
    if(err){
      return next(err);
    }else{
      res.json(chunk);
    }
  });
});

chunkRoutes.get('/getMostPopularChild/:chunkid', function(req, res, next) {
  Chunk.findById(req.params.chunkid).populate('children').exec(function(err, chunk){
    if(err){
      return next(err);
    }else{
      let children = chunk.children;
      children.sort(function(childA, childB){
        return childB.popularity-childA.popularity;
      });
      res.json(children[0]);
    }
  });
});


chunkRoutes.get('/getChunks/:parentId', function(req, res) {
  Chunk.find({"parentchunk": req.params.parentId}).sort({popularity: "descending"}).exec( function(err, chunks){
    if(err){
      res.send(err);
    } else {
      res.json(chunks);
    }
  });
});



export default chunkRoutes;
